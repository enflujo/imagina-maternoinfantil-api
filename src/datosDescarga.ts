import { readdir, stat } from 'fs/promises';
import { parse, resolve } from 'path';
import { guardarJSON } from './utilidades/ayudas';
const ruta = resolve(__dirname, '../datos/fuentes/xlsx');
type PesosXLSX = {
  [nombre: string]: string;
};
const datos: PesosXLSX = {};

function pesoArchivo(peso: number) {
  const i = peso == 0 ? 0 : Math.floor(Math.log(peso) / Math.log(1024));
  const formato = ['B', 'kB', 'MB', 'GB', 'TB'][i];
  const calculo = Number((peso / Math.pow(1024, i)).toFixed(2));

  return `${calculo} ${formato}`;
}

async function calcularPesos() {
  const archivos = await readdir(ruta).then((nombres) => nombres.filter((nombre) => nombre.endsWith('.zip')));

  for (const nombre of archivos) {
    const { size } = await stat(resolve(ruta, nombre));
    const peso = pesoArchivo(size);
    const nombreArchivo = parse(nombre).name;
    datos[nombreArchivo] = peso;
  }

  guardarJSON(datos, 'pesosArchivos');
}

calcularPesos();
