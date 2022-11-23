import path from 'path';
import fs from 'fs';
import { getXlsxStream } from 'xlstream';
import { archivos } from './utilidades/constantes';
import { extraerNombreCodigo, guardarJSON } from './utilidades/ayudas';
import { DepartamentoProcesado, MunicipioProcesado } from './tipos';

const nombreArchivo = 'Plan de analisis Indicadores - V2';
const ruta = path.resolve(__dirname, `../datos/fuentes/xlsx/${nombreArchivo}.xlsx`);

const tablas = {
  nacionales: 'data indicadores nacional',
  departamentos: 'data indicadores dpto',
  municipios: 'data indicadores municipio',
};

export function procesarPais() {
  return new Promise(async (resolver, rechazar) => {
    const flujo = await getXlsxStream({
      filePath: ruta,
      sheet: tablas.nacionales,
      withHeader: true,
      ignoreEmpty: true,
    });

    flujo.on('data', async (fila) => {
      const { Indicador: nombreIndicador, tendencia, regla: alarma } = fila.formatted.obj;
      if (nombreIndicador === 'PROMEDIO DE CONTROLES PRENATALES') return;

      const objetoIndicador = archivos.find((obj) => obj.nombreIndicador === nombreIndicador);

      if (objetoIndicador?.nombreArchivo) {
        const archivo = fs.readFileSync(
          path.resolve(__dirname, `../datos/exportados/${objetoIndicador?.nombreArchivo}-pais.json`),
          'utf-8'
        );

        if (archivo) {
          const datos = JSON.parse(archivo);
          datos.analisis = {
            tendencia,
            alarma: !!alarma,
          };
          guardarJSON(datos, `${objetoIndicador?.nombreArchivo}-pais`);
        }
      } else {
        console.log('_________________________', objetoIndicador, fila.formatted);
      }
    });

    flujo.on('close', () => {
      resolver(null);
    });
  });
}

async function procesarDepartamentos() {
  return new Promise(async (resolver) => {
    const flujo = await getXlsxStream({
      filePath: ruta,
      sheet: tablas.departamentos,
      withHeader: true,
      ignoreEmpty: true,
    });

    flujo.on('data', async (fila) => {
      const {
        Departamento: dep,
        Indicador: nombreIndicador,
        'tendencia deseada': tendencia,
        'Alarma por pandemia (si empeora) (2020-2019)': alarma,
      } = fila.formatted.obj;
      if (nombreIndicador === 'PROMEDIO DE CONTROLES PRENATALES') return;

      const objetoIndicador = archivos.find((obj) => obj.nombreIndicador === nombreIndicador);

      if (objetoIndicador?.nombreArchivo) {
        let archivo;
        try {
          archivo = fs.readFileSync(
            path.resolve(__dirname, `../datos/exportados/${objetoIndicador?.nombreArchivo}-departamentos.json`),
            'utf-8'
          );

          if (archivo) {
            const datos = JSON.parse(archivo) as DepartamentoProcesado[];
            const { codigo } = extraerNombreCodigo(dep);
            const datosDep = datos.find((obj: DepartamentoProcesado) => obj.codigo === codigo);

            if (datosDep) {
              datosDep.analisis = {
                tendencia,
                alarma: !!alarma,
              };
              guardarJSON(datos, `${objetoIndicador?.nombreArchivo}-departamentos`);
            }
          }
        } catch (error) {
          console.log(nombreIndicador, error);
          throw new Error();
        }
      } else {
        console.log('_________________________', objetoIndicador, fila.formatted);
      }
    });

    flujo.on('close', () => {
      resolver(null);
    });
  });
}

async function procesarMunicipios() {
  return new Promise(async (resolver) => {
    const flujo = await getXlsxStream({
      filePath: ruta,
      sheet: tablas.municipios,
      withHeader: true,
      ignoreEmpty: true,
    });

    flujo.on('data', async (fila) => {
      const {
        Municipio: mun,
        Indicador: nombreIndicador,
        'tendencia deseada': tendencia,
        'Alarma por pandemia (si empeora) (2020-2019)': alarma,
      } = fila.formatted.obj;
      if (nombreIndicador === 'PROMEDIO DE CONTROLES PRENATALES') return;

      const objetoIndicador = archivos.find((obj) => obj.nombreIndicador === nombreIndicador);

      if (objetoIndicador?.nombreArchivo) {
        let archivo;
        try {
          archivo = fs.readFileSync(
            path.resolve(__dirname, `../datos/exportados/${objetoIndicador?.nombreArchivo}-municipios.json`),
            'utf-8'
          );

          if (archivo) {
            const datos = JSON.parse(archivo) as MunicipioProcesado[];
            const { codigo } = extraerNombreCodigo(mun);
            const datosMun = datos.find((obj: MunicipioProcesado) => obj.codigo === codigo);

            if (datosMun) {
              datosMun.analisis = {
                tendencia,
                alarma: !!alarma,
              };
              guardarJSON(datos, `${objetoIndicador?.nombreArchivo}-municipios`);
            }
          }
        } catch (error) {
          console.log(nombreIndicador, error);
          throw new Error();
        }
      } else {
        console.log('_________________________', objetoIndicador, fila.formatted);
      }
    });

    flujo.on('close', () => {
      resolver(null);
    });
  });
}

async function procesar() {
  await procesarPais();
  console.log('Fin Nacionales');
  // await procesarDepartamentos();
  // console.log('Fin Departamentos');
  // await procesarMunicipios();
  // console.log('Fin Municipios');
}

procesar();
