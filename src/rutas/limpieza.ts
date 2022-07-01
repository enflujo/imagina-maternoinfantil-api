import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import path from 'path';
import fp from 'fastify-plugin';
import errata from '../modulos/errata';
import { DatosProcesados, DepartamentoProcesado, MunicipioProcesado } from '../tipos';
import { esNumero, extraerNombreCodigo, guardarJSON, redondearDecimal } from '../utilidades/ayudas';
import { getXlsxStream } from 'xlstream';
import barraProceso from '../modulos/barraProceso';
import { SingleBar } from 'cli-progress';

const archivos = [
  'NACIDOS VIVOS BAJO PESO',
  'NACIDOS VIVOS 4 CONS PRENATAL',
  'PROMEDIO CONTROLES PRENATALES',
  'NACIDOS VIVOS <15 PAPA 4',
  'PARTOS INSTITUCIONALES',
  'PARTOS POR CESAREA',
  'NACIDOS DE <14 AÑOS',
  'PROP NACIDOS DE MUJ 14 A 17',
  'RAZON MORT MATERNA 1 AÑO',
  'FECUNDIDAD 10 A 14 AÑOS',
  'FECUNDIDAD 10 A 19 AÑOS',
  'FECUNDIDAD 15 A 19 AÑOS',
  'MORTALIDAD EN LA NIÑEZ',
  'MORTALIDAD EN < 1 AÑO',
  'MORTALIDAD < 5EDA',
  'MORTALIDAD < 5IRA',
  'MORTALIDAD PERINATAL',
  'MORTALIDAD DESNUTRICI< 5',
];

const agregador = {
  caracterizaciones: new Set(),
  sexo: new Set(),
  etnias: new Set(),
  regimen: new Set(),
};

async function procesarTabla(indice: number) {
  const nombreTabla = archivos[indice];
  const datosProcesados: DatosProcesados = [];

  let numeroFila = 0;

  if (!errata[nombreTabla]) {
    errata[nombreTabla] = {
      sinPorcentaje: 0,
      procesados: 0,
      numeradorMayorQueDenominador: 0,
      errores: [],
      total: 0,
    };
  }

  const flujo = await getXlsxStream({
    filePath: path.resolve(__dirname, '../datos/NUEVA data indicadores disponibles minsaludf.xlsx'),
    sheet: nombreTabla,
    withHeader: false,
    ignoreEmpty: true,
  });

  let total = 0;
  let barraActual: SingleBar;

  flujo.on('data', (fila) => {
    if (Object.keys(fila.raw.obj).length <= 4) return;

    if (numeroFila === 0) {
      total = fila.totalSheetSize;
      barraActual = barraProceso();

      barraActual.start(total, 0, {
        tabla: nombreTabla,
        terminado: false,
      });
    }

    numeroFila++;

    if (numeroFila >= 3) {
      errata[nombreTabla].total++;

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
        const departamento = extraerNombreCodigo(dep);
        if (!departamento.codigo) {
          console.log(numeroFila, fila);
          throw new Error('No tiene código el departamento');
        }

        departamentoI = datosProcesados.findIndex((d: DepartamentoProcesado) => d.dep === departamento.codigo);

        if (departamentoI < 0) {
          datosProcesados.push({
            dep: departamento.codigo,
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
        const municipio = extraerNombreCodigo(mun);
        municipioI = datosProcesados[departamentoI].municipios.findIndex(
          (m: MunicipioProcesado) => m.mun === municipio.codigo
        );

        if (municipioI < 0) {
          datosProcesados[departamentoI].municipios.push({
            mun: municipio.codigo,
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

      try {
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
      } catch (err) {
        console.log(etnia, err);
        // throw new Error();
      }

      let codigoRegimen: string | null = null;

      try {
        if (tipoRegimen) {
          const { codigo } = extraerNombreCodigo(tipoRegimen);
          codigoRegimen = codigo.toLowerCase();
        }
      } catch (err) {
        console.log(numeroFila, tipoRegimen);
      }

      let codigoSexo: string | null = null;

      try {
        if (sexo) {
          if (sexo === 'FEMENINO') {
            codigoSexo = 'f';
          } else if (sexo === 'MASCULINO') {
            codigoSexo = 'm';
          } else if (sexo === 'INDETERMINADO') {
            codigoSexo = 'i';
          }
        }
      } catch (err) {
        console.log(numeroFila, sexo);
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
    procesarTabla(9);
  });
};

export default fp(RutaLimpieza);
