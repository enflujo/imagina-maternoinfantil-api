import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import path from 'path';
import fp from 'fastify-plugin';
import errata from '../modulos/errata';
import { AgregadoNacionalProcesado, DepartamentoProcesado, MunicipioProcesado } from '../tipos';
import { actualizarPorcentaje, esNumero, guardarJSON } from '../utilidades/ayudas';
import { getXlsxStream } from 'xlstream';
import barraProceso from '../modulos/barraProceso';
import { SingleBar } from 'cli-progress';
import agregador from '../modulos/agregador';
import { archivos } from '../utilidades/constantes';
import limpiarLugar from '../modulos/limpieza/lugar';
import limpiarEtnia from '../modulos/limpieza/etnia';
import limpiarRegimen from '../modulos/limpieza/regimen';
import limpiarSexo from '../modulos/limpieza/sexo';
import limpiarCaracterizacion from '../modulos/limpieza/caracterizacion';
import limpiarGeojson from '../modulos/limpieza/geojson';

async function procesarTabla(indice: number) {
  const { nombreTabla, nombreArchivo, unidadMedida } = archivos[indice];
  const agregadoNacional: AgregadoNacionalProcesado = {};
  const agregadoDepartamental: DepartamentoProcesado[] = [];
  const agregadoMunicipal: MunicipioProcesado[] = [];

  let numeroFila = 0;
  let total = 0;
  let barraActual: SingleBar;

  const flujo = await getXlsxStream({
    filePath: path.resolve(__dirname, '../../datos/fuentes/NUEVA data indicadores disponibles minsaludf.xlsx'),
    sheet: nombreTabla,
    withHeader: false,
    ignoreEmpty: true,
  });

  flujo.on('data', (fila) => {
    // Si es la primera fila, iniciar barra de proceso
    if (numeroFila === 0) {
      total = fila.totalSheetSize;
      barraActual = barraProceso();

      barraActual.start(total, 0, {
        tabla: nombreTabla,
        terminado: false,
      });
    }
    // Contador para saber en que fila de Excel estamos, útil para buscar errores directo en el Excel.
    numeroFila++;

    // Omitir filas que tienen información que no corresponde a los datos (ejemplo: TOTALES al final)
    if (Object.keys(fila.raw.obj).length <= 4) return;

    // Particularidad de este Excel, todas las tablas empiezan en la fila 4
    if (numeroFila >= 3) {
      // En este punto hay una fila con datos, sumamos al total en errata para saber cuantos hay registrados en total.
      errata[nombreTabla].total++;

      /**
       * Las variables (columnas) disponibles en el Excel.
       */
      const año = fila.formatted.obj.A;
      const dep = fila.formatted.obj.C;
      const mun = fila.formatted.obj.D;
      const etnia = fila.formatted.obj.E;
      const tipoRegimen = fila.formatted.obj.F;
      const sexo = fila.formatted.obj.G;
      const caracterizacion = fila.formatted.obj.H;
      const nume = fila.formatted.obj.I;
      const deno = fila.formatted.obj.J;

      agregador.caracterizaciones.add(caracterizacion);
      agregador.etnias.add(etnia);
      agregador.regimen.add(tipoRegimen);
      agregador.sexo.add(sexo);

      const numerador = esNumero(nume) ? +nume : null;
      const denominador = esNumero(deno) ? +deno : null;

      if (nombreTabla !== 'PROMEDIO CONTROLES PRENATALES') {
        if (numerador && denominador) {
          if (numerador > denominador) {
            errata[nombreTabla].numeradorMayorQueDenominador++;
            errata[nombreTabla].errores.push(
              `Fila ${numeroFila}: ${numerador} (Numerador) es > que ${denominador} (denominador)`
            );
            // console.log(`Numerador (${numerador}) es > que denominador (${denominador})`);
            // throw new Error(JSON.stringify(fila, null, 2));
            // return;
          }
        }
      } else {
        // TODO: hacer el calculo de este indicador diferente al resto
      }

      const { datosDepartamento, datosMunicipio } = limpiarLugar(
        agregadoDepartamental,
        agregadoMunicipal,
        dep,
        mun,
        numeroFila,
        año
      );
      const dEtnia = limpiarEtnia(etnia, numeroFila);
      const codigoRegimen = limpiarRegimen(tipoRegimen, numeroFila, nombreTabla);
      const codigoSexo = limpiarSexo(sexo, numeroFila, nombreTabla);
      const codigoCaracterizacion = limpiarCaracterizacion(caracterizacion);

      if (!agregadoNacional[año]) {
        agregadoNacional[año] = [0, 0, 0];
      }

      if (numerador) {
        agregadoNacional[año][0] += numerador;
        datosDepartamento[0] += numerador;
        datosMunicipio[0] += numerador;
      }

      if (denominador) {
        agregadoNacional[año][1] += denominador;
        datosDepartamento[1] += denominador;
        datosMunicipio[1] += denominador;
      }

      actualizarPorcentaje(agregadoNacional[año], unidadMedida);
      actualizarPorcentaje(datosDepartamento, unidadMedida);
      actualizarPorcentaje(datosMunicipio, unidadMedida);

      // if (!datosMunicipio.datos[año]) {
      //   datosMunicipio.datos[año] = [];
      // }

      // datosMunicipio.datos[año].push([
      //   dEtnia.codigo,
      //   codigoRegimen,
      //   codigoSexo,
      //   codigoCaracterizacion,
      //   numerador,
      //   denominador,
      //   numerador && denominador ? redondearDecimal((numerador / denominador) * 100, 1, 2) : null,
      // ]);

      errata[nombreTabla].procesados++;
      barraActual.update(fila.processedSheetSize, { terminado: false });
    } else {
      // console.log(fila);
    }
  });

  flujo.on('close', () => {
    guardarJSON(agregadoNacional, `${nombreArchivo}-pais`);
    guardarJSON(agregadoDepartamental, `${nombreArchivo}-departamentos`);
    guardarJSON(agregadoMunicipal, `${nombreArchivo}-municipios`);
    // guardarJSON(datosProcesados, nombreTabla);

    guardarJSON(errata, '_errata');
    guardarJSON(agregador, '_agregados');

    barraActual.update(total, { terminado: true });
    barraActual.stop();

    if (indice < archivos.length - 1) {
      procesarTabla(++indice);
    } else {
      console.log('------------- FIN --------------');
    }
  });
}

const RutaLimpieza: FastifyPluginAsync = async (servidor: FastifyInstance, opciones: FastifyPluginOptions) => {
  servidor.get('/excel', {}, async () => {
    procesarTabla(0);
    limpiarGeojson();
  });
};

export default fp(RutaLimpieza);
