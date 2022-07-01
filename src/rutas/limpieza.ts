import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import path from 'path';
import fp from 'fastify-plugin';
import errata from '../modulos/errata';
import { DatosProcesados, DepartamentoProcesado, MunicipioProcesado } from '../tipos';
import { esNumero, extraerNombreCodigo, guardarJSON, redondearDecimal } from '../utilidades/ayudas';
import { getXlsxStream } from 'xlstream';
import barraProceso from '../modulos/barraProceso';
import { SingleBar } from 'cli-progress';
import agregador from '../modulos/agregador';
import { archivos } from '../utilidades/constantes';

async function procesarTabla(indice: number) {
  const nombreTabla = archivos[indice];
  const datosProcesados: DatosProcesados = [];
  let numeroFila = 0;
  let total = 0;
  let barraActual: SingleBar;

  const flujo = await getXlsxStream({
    filePath: path.resolve(__dirname, '../datos/NUEVA data indicadores disponibles minsaludf.xlsx'),
    sheet: nombreTabla,
    withHeader: false,
    ignoreEmpty: true,
  });

  flujo.on('data', (fila) => {
    // Omitir filas que tienen información que no corresponde a los datos (ejemplo: TOTALES al final)
    if (Object.keys(fila.raw.obj).length <= 4) return;

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

      let departamentoI = 0;

      if (dep) {
        const { codigo } = extraerNombreCodigo(dep);
        if (!codigo) {
          console.log(numeroFila, fila);
          throw new Error('No tiene código el departamento');
        }

        departamentoI = datosProcesados.findIndex((d: DepartamentoProcesado) => d.dep === codigo);

        if (departamentoI < 0) {
          datosProcesados.push({
            dep: codigo,
            agregados: {},
            municipios: [],
          });
          departamentoI = datosProcesados.length - 1;
        }
      } else {
        console.log(numeroFila, dep, fila);

        throw new Error('ERROR: Departamento');
      }

      let municipioI = 0;

      if (mun) {
        const { codigo } = extraerNombreCodigo(mun);
        municipioI = datosProcesados[departamentoI].municipios.findIndex((m: MunicipioProcesado) => m.mun === codigo);

        if (municipioI < 0) {
          datosProcesados[departamentoI].municipios.push({
            mun: codigo,
            agregados: {},
            datos: {},
          });
          municipioI = datosProcesados[departamentoI].municipios.length - 1;
        }
      } else {
        console.error(numeroFila, mun);
        throw new Error('ERROR: Municipio');
      }

      let codigoEtnia: number | null = null;

      if (etnia) {
        if (etnia === 'NO REPORTADO') {
          codigoEtnia = -1;
        } else {
          const { codigo } = extraerNombreCodigo(etnia);
          codigoEtnia = +codigo;
        }
      } else {
        console.log(numeroFila, etnia);
      }

      let codigoRegimen: string | null = null;

      if (tipoRegimen) {
        const { codigo } = extraerNombreCodigo(tipoRegimen);
        codigoRegimen = codigo.toLowerCase();
      } else {
        errata[nombreTabla].errores.push(
          `Fila ${numeroFila}: No se pudo identificar el Tipo de Régimen desde el valor ${tipoRegimen}`
        );
      }

      let codigoSexo: string | null = null;

      if (sexo) {
        if (sexo === 'FEMENINO') {
          codigoSexo = 'f';
        } else if (sexo === 'MASCULINO') {
          codigoSexo = 'm';
        } else if (sexo === 'INDETERMINADO') {
          codigoSexo = 'i';
        } else {
          errata[nombreTabla].errores.push(`Fila ${numeroFila}: No se pudo identificar el Sexo desde el valor ${sexo}`);
        }
      }

      let codigoCaracterizacion: string | null = null;

      if (caracterizacion) {
        if (caracterizacion === 'No Reportado') {
          codigoCaracterizacion = 'nr';
        } else {
          const partes = caracterizacion.split(' ');
          const edades = partes.filter((parte: string) => esNumero(parte));
          codigoCaracterizacion = edades.join('-');
        }
      }

      if (!datosProcesados[departamentoI].agregados[año]) {
        datosProcesados[departamentoI].agregados[año] = [0, 0, 0];
      }

      if (numerador) datosProcesados[departamentoI].agregados[año][0] += numerador;
      if (denominador) datosProcesados[departamentoI].agregados[año][1] += denominador;

      const [depNum, depDen] = datosProcesados[departamentoI].agregados[año];
      const depPorcentaje = (depNum / depDen) * 100;
      datosProcesados[departamentoI].agregados[año][2] = redondearDecimal(depPorcentaje, 1, 2);

      if (!datosProcesados[departamentoI].municipios[municipioI].agregados[año]) {
        datosProcesados[departamentoI].municipios[municipioI].agregados[año] = [0, 0, 0];
      }

      if (numerador) datosProcesados[departamentoI].municipios[municipioI].agregados[año][0] += numerador;
      if (denominador) datosProcesados[departamentoI].municipios[municipioI].agregados[año][1] += denominador;

      const [munNum, munDen] = datosProcesados[departamentoI].municipios[municipioI].agregados[año];
      const munPorcentaje = (munNum / munDen) * 100;
      datosProcesados[departamentoI].municipios[municipioI].agregados[año][2] = redondearDecimal(munPorcentaje, 1, 2);

      if (!datosProcesados[departamentoI].municipios[municipioI].datos[año]) {
        datosProcesados[departamentoI].municipios[municipioI].datos[año] = [];
      }

      datosProcesados[departamentoI].municipios[municipioI].datos[año].push([
        codigoEtnia,
        codigoRegimen,
        codigoSexo,
        codigoCaracterizacion,
        numerador,
        denominador,
        numerador && denominador ? redondearDecimal((numerador / denominador) * 100, 1, 2) : null,
      ]);

      errata[nombreTabla].procesados++;
      barraActual.update(fila.processedSheetSize, { terminado: false });
    } else {
      // console.log(fila);
    }
  });

  flujo.on('close', () => {
    const departamentosAgregados = datosProcesados.map((obj) => {
      return {
        codigo: obj.dep,
        datos: obj.agregados,
      };
    });

    const municipiosAgregados = datosProcesados.map((obj) => {
      return {
        dep: obj.dep,
        datos: obj.municipios.map((mun) => {
          return {
            codigo: mun.mun,
            datos: mun.agregados,
          };
        }),
      };
    });
    guardarJSON(departamentosAgregados, `${nombreTabla}-departamentos`);
    guardarJSON(municipiosAgregados, `${nombreTabla}-municipios`);
    guardarJSON(datosProcesados, nombreTabla);
    guardarJSON(errata, 'errata');
    guardarJSON(agregador, 'agregados');

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
  });
};

export default fp(RutaLimpieza);
