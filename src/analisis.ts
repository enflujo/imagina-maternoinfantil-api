import path from 'path';
import { getXlsxStream } from 'xlstream';
import { archivos } from './utilidades/constantes';
const tablas = {
  nacionales: 'data indicadores nacional',
};
async function procesar() {
  const nombreArchivo = 'Plan de analisis Indicadores - V2';
  const ruta = path.resolve(__dirname, `../datos/fuentes/xlsx/${nombreArchivo}.xlsx`);
  const flujo = await getXlsxStream({
    filePath: ruta,
    sheet: tablas.nacionales,
    withHeader: true,
    ignoreEmpty: true,
  });

  flujo.on('data', (fila) => {
    const [nombreIndicador, a2010, a2019, a2020, promedio, sd, tendencia, alarma] = fila.formatted.arr;
    const objetoIndicador = archivos.find((obj) => obj.nombreIndicador === nombreIndicador);
    console.log(objetoIndicador, tendencia, !!alarma);
  });

  flujo.on('close', () => {
    console.log('FIN');
  });
}

procesar();
