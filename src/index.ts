import 'dotenv/config';
import path from 'path';
import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import xlsx from 'xlsx';
import { cadena, logAviso, logCyan } from './utilidades/constantes';
import { extraerNombreCodigo, guardarJSON, redondearDecimal } from './utilidades/ayudas';
import { DatosFuente, DatosProcesados } from './tipos';
import errata from './modulos/errata';

const rutaIndicadores = path.resolve(__dirname, './datos/indicadores.xlsx');
const servidor: FastifyInstance = fastify();
const PUERTO = process.env.API_PUERTO || 8080;

servidor.register(cors);

const agregador = {
  caracterizaciones: new Set(),
  sexo: new Set(),
  etnias: new Set(),
  regimen: new Set(),
};

servidor.get('/', async (request, reply) => {
  try {
    const excelIndicadores = xlsx.readFile(rutaIndicadores, { bookSheets: true });
    const todasLasTablas = excelIndicadores.SheetNames;
    todasLasTablas.forEach((nombreTabla: string, i: number) => {
      // if (i === 24) {
      console.log('Procesando tabla', nombreTabla);
      const archivo = xlsx.readFile(rutaIndicadores, { sheets: nombreTabla });
      const datosTabla: DatosFuente[] = xlsx.utils.sheet_to_json(archivo.Sheets[nombreTabla]);
      const datosProcesados: DatosProcesados[] = [];

      if (!errata[nombreTabla]) {
        errata[nombreTabla] = {
          sinPorcentaje: 0,
          procesados: 0,
          numeradorMayorQueDenominador: 0,
          errores: [],
          total: datosTabla.length,
        };
      }

      for (let n = 0; n < datosTabla.length; n++) {
        const fila = datosTabla[n];
        const caracterizacion = fila.Caracterización;
        const etnia = fila.Etnia;
        const tipoRegimen = fila['Tipo Régimen'];
        const sexo = fila.Sexo;

        agregador.caracterizaciones.add(caracterizacion);
        agregador.etnias.add(etnia);
        agregador.regimen.add(tipoRegimen);
        agregador.sexo.add(sexo);

        if (!fila.Numerador || !fila.Denominador) {
          errata[nombreTabla].sinPorcentaje++;
          continue;
        }

        if (fila.Numerador > fila.Denominador) {
          errata[nombreTabla].numeradorMayorQueDenominador++;
          continue;
        }

        const dep = fila.Departamento;
        let departamento;
        if (dep) {
          departamento = extraerNombreCodigo(dep);
        } else {
          console.log(n + 2, departamento);
          throw new Error('ERROR: Departamento');
        }

        const mun = fila.Municipio;
        let municipioI = -9999999;
        if (mun) {
          const municipio = extraerNombreCodigo(mun);
          municipioI = datosProcesados.findIndex((m) => m[0] === municipio.codigo);

          if (municipioI < 0) {
            datosProcesados.push([municipio.codigo, departamento.codigo, {}]);
            municipioI = datosProcesados.length - 1;
          }
        } else {
          console.error(n + 2, mun);
          throw new Error('ERROR: Municipio');
        }

        let codigoEtnia = -9;

        try {
          if (etnia) {
            if (etnia === 'NO REPORTADO') {
              codigoEtnia = -1;
            } else {
              const { codigo } = extraerNombreCodigo(etnia);
              codigoEtnia = +codigo;
            }
          } else {
            codigoEtnia = -2;
            console.log(n + 2, etnia);
          }
        } catch (err) {
          console.log(fila.Etnia, err);
          // throw new Error();
        }

        let codigoRegimen = '';

        try {
          if (tipoRegimen) {
            const { codigo, nombre } = extraerNombreCodigo(tipoRegimen);
            codigoRegimen = codigo;
          }
        } catch (err) {
          console.log(n + 2, fila['Tipo Régimen']);
        }

        let codigoSexo = '';

        if (sexo === 'FEMENINO') {
          codigoSexo = 'f';
        } else if (sexo === 'MASCULINO') {
          codigoSexo = 'm';
        } else if (sexo === 'INDETERMINADO' || sexo === undefined) {
          codigoSexo = 'n/a';
        } else {
          errata[nombreTabla].errores.push(`Sexo en fila ${n + 2} no identificado: ${sexo}`);
        }

        datosProcesados[municipioI][2][fila.Ano] = [
          fila.Numerador,
          fila.Denominador,
          redondearDecimal((fila.Numerador / fila.Denominador) * 100, 1, 2),
          codigoEtnia,
          codigoRegimen,
          codigoSexo,
          caracterizacion,
        ];

        errata[nombreTabla].procesados++;
      }

      guardarJSON(datosProcesados, nombreTabla);

      guardarJSON(errata, 'errata');
      guardarJSON(agregador, 'agregados');
      // }
    });
    console.log('FIN');
  } catch (err: unknown) {
    console.error(err);
  }
  return { mensaje: 'holas' };
});

const inicio = async () => {
  try {
    await servidor.listen(PUERTO);

    console.log(`${cadena} ${logCyan('Servidor disponible en:')} ${logAviso.underline(`http://localhost:${PUERTO}`)}`);
  } catch (err: unknown) {
    servidor.log.error(err);
    process.exit(1);
  }
};

inicio();
