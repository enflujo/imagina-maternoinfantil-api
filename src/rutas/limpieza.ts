import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import path from 'path';
import fp from 'fastify-plugin';
import xlsx from 'xlsx';
import errata from '../modulos/errata';
import { DatosFuente, DatosProcesados, DepartamentoProcesado, MunicipioProcesado } from '../tipos';
import { esNumero, extraerNombreCodigo, guardarJSON, redondearDecimal } from '../utilidades/ayudas';

const agregador = {
  caracterizaciones: new Set(),
  sexo: new Set(),
  etnias: new Set(),
  regimen: new Set(),
};
// const rutaIndicadores = path.resolve(__dirname, '../datos/NUEVA data indicadores disponibles minsaludf.xlsx');
const rutaIndicadores = path.resolve(__dirname, '../datos/PROMEDIO CONTROLES PRENATALES.xlsx');
const noVan = ['LISTADO TOTAL', 'INDICADORES GUIA'];
const RutaLimpieza: FastifyPluginAsync = async (servidor: FastifyInstance, opciones: FastifyPluginOptions) => {
  servidor.get('/limpieza', {}, async (request, reply) => {
    try {
      const excelIndicadores = xlsx.readFile(rutaIndicadores, { bookSheets: true });
      const todasLasTablas = excelIndicadores.SheetNames.filter((nombre: string) => !noVan.includes(nombre));

      console.log(todasLasTablas);

      todasLasTablas.forEach((nombreTabla: string, i: number) => {
        console.log('Procesando tabla', nombreTabla);
        const archivo = xlsx.readFile(rutaIndicadores, { sheets: nombreTabla });
        const datosTabla: DatosFuente[] = xlsx.utils.sheet_to_json(archivo.Sheets[nombreTabla], { range: 3 });
        const datosProcesados: DatosProcesados = [];

        if (!errata[nombreTabla]) {
          errata[nombreTabla] = {
            sinPorcentaje: 0,
            procesados: 0,
            numeradorMayorQueDenominador: 0,
            total: datosTabla.length,
          };
        }

        for (let n = 0; n < datosTabla.length - 1; n++) {
          const fila = datosTabla[n];
          const numeroFila = n + 2;
          const año = fila.Ano;
          const dep = fila.Departamento;
          const mun = fila.Municipio;
          const caracterizacion = fila.Caracterización;
          const etnia = fila.Etnia;
          const tipoRegimen = fila['Tipo Régimen'];
          const sexo = fila.Sexo;
          const numerador = fila.Numerador;
          const denominador = fila.Denominador;

          agregador.caracterizaciones.add(caracterizacion);
          agregador.etnias.add(etnia);
          agregador.regimen.add(tipoRegimen);
          agregador.sexo.add(sexo);

          // if (!fila.Numerador || !fila.Denominador) {
          //   errata[nombreTabla].sinPorcentaje++;
          //   continue;
          // }

          if (numerador > denominador) {
            errata[nombreTabla].numeradorMayorQueDenominador++;
            continue;
          }

          let departamentoI = 0;

          if (dep) {
            const departamento = extraerNombreCodigo(dep);
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
            console.log(numeroFila, dep);
            continue;
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
              console.log(n + 2, etnia);
            }
          } catch (err) {
            console.log(fila.Etnia, err);
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
              const edades = partes.filter((parte) => esNumero(parte));
              codigoCaracterizacion = edades.join('-');
            }
          }

          if (!datosProcesados[departamentoI].agregados[año]) {
            datosProcesados[departamentoI].agregados[año] = [0, 0, 0];
          }

          datosProcesados[departamentoI].agregados[año][0] += numerador;
          datosProcesados[departamentoI].agregados[año][1] += denominador;

          const [depNum, depDen] = datosProcesados[departamentoI].agregados[año];
          const depPorcentaje = (depNum / depDen) * 100;
          datosProcesados[departamentoI].agregados[año][2] = redondearDecimal(depPorcentaje, 1, 2);

          if (!datosProcesados[departamentoI].municipios[municipioI].agregados[año]) {
            datosProcesados[departamentoI].municipios[municipioI].agregados[año] = [0, 0, 0];
          }

          datosProcesados[departamentoI].municipios[municipioI].agregados[año][0] += numerador;
          datosProcesados[departamentoI].municipios[municipioI].agregados[año][1] += denominador;

          const [munNum, munDen] = datosProcesados[departamentoI].municipios[municipioI].agregados[año];
          const munPorcentaje = (munNum / munDen) * 100;
          datosProcesados[departamentoI].municipios[municipioI].agregados[año][2] = redondearDecimal(
            munPorcentaje,
            1,
            2
          );

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
            redondearDecimal((numerador / denominador) * 100, 1, 2),
          ]);

          errata[nombreTabla].procesados++;
        }

        guardarJSON(datosProcesados, nombreTabla);

        guardarJSON(errata, 'errata');
        guardarJSON(agregador, 'agregados');
      });

      console.log('FIN');
    } catch (err) {
      console.log(err);
    }
  });
};

export default fp(RutaLimpieza);
