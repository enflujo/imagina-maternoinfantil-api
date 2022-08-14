import colores from 'cli-color';
import emoji from 'node-emoji';
import { IndicadorReferencia } from '../tipos';

/**
 * Para usar otros colores, usar esta tabla para saber el número: https://robotmoon.com/256-colors/
 * Texto: xterm(40)
 * Fondo: bgXterm(40)
 */
export const logError = colores.red.bold;
export const logAviso = colores.bold.xterm(214);
export const logBloque = colores.bgCyan.black;
export const logCyan = colores.cyan.bold;
export const logVerde = colores.greenBright;
export const logNaranjaPulso = colores.xterm(214).blink;

// https://raw.githubusercontent.com/omnidan/node-emoji/master/lib/emoji.json
export const cadena = emoji.emojify(':link:');
export const conector = emoji.emojify(':electric_plug:');
export const gorila = emoji.emojify(':gorilla:');
export const chulo = emoji.emojify(':white_check_mark:');

export const parametrosBd = {
  database: process.env.BD_NOMBRE,
  user: process.env.BD_USUARIO,
  password: process.env.BD_CLAVE,
  port: 5432,
  host: 'localhost',
};

/**
 * Nombres de las pestañas en el Excel
 */
export const archivos: IndicadorReferencia[] = [
  { nombreTabla: 'NACIDOS VIVOS BAJO PESO', nombreArchivo: 'nacidos-bajo-peso', unidadMedida: 100 },
  { nombreTabla: 'NACIDOS VIVOS 4 CONS PRENATAL', nombreArchivo: 'nacidos-4-controles-prenatales', unidadMedida: 100 },
  // { nombreTabla: 'PROMEDIO CONTROLES PRENATALES', nombreArchivo: 'controles-prenatales', unidadMedida: 100 },
  { nombreTabla: 'NACIDOS VIVOS <15 PAPA 4', nombreArchivo: 'nacidos-menores15-padre4', unidadMedida: 100 },
  { nombreTabla: 'PARTOS INSTITUCIONALES', nombreArchivo: 'partos-institucionales', unidadMedida: 100 },
  { nombreTabla: 'PARTOS POR CESAREA', nombreArchivo: 'partos-cesarea', unidadMedida: 100 },
  { nombreTabla: 'NACIDOS DE <14 AÑOS', nombreArchivo: 'nacidos-menores14', unidadMedida: 100 },
  { nombreTabla: 'PROP NACIDOS DE MUJ 14 A 17', nombreArchivo: 'nacidos-mujeres14-17', unidadMedida: 100 },
  { nombreTabla: 'RAZON MORT MATERNA 1 AÑO', nombreArchivo: 'mortalidad-materna1', unidadMedida: 100000 },
  { nombreTabla: 'FECUNDIDAD 10 A 14 AÑOS', nombreArchivo: 'fecundidad-10-14', unidadMedida: 1000 },
  { nombreTabla: 'FECUNDIDAD 10 A 19 AÑOS', nombreArchivo: 'fecundidad-10-19', unidadMedida: 1000 },
  { nombreTabla: 'FECUNDIDAD 15 A 19 AÑOS', nombreArchivo: 'fecundidad-15-19', unidadMedida: 1000 },
  { nombreTabla: 'MORTALIDAD EN LA NIÑEZ', nombreArchivo: 'mortalidad-ninez', unidadMedida: 1000 },
  { nombreTabla: 'MORTALIDAD EN < 1 AÑO', nombreArchivo: 'mortalidad-menor1', unidadMedida: 1000 },
  { nombreTabla: 'MORTALIDAD < 5EDA', nombreArchivo: 'mortalidad-5eda', unidadMedida: 100000 },
  { nombreTabla: 'MORTALIDAD < 5IRA', nombreArchivo: 'mortalidad-5ira', unidadMedida: 100000 },
  { nombreTabla: 'MORTALIDAD PERINATAL', nombreArchivo: 'mortalidad-perinatal', unidadMedida: 1000 },
  { nombreTabla: 'MORTALIDAD DESNUTRICI< 5', nombreArchivo: 'mortalidad-desnutricion', unidadMedida: 100000 },
];

export const rips: IndicadorReferencia[] = [
  { nombreTabla: 'control < 5 años', nombreArchivo: 'control-5', unidadMedida: 100 },
  { nombreTabla: 'sifilis', nombreArchivo: 'sifilis', unidadMedida: 100 },
  { nombreTabla: 'trasmision sexual', nombreArchivo: 'trasmision-sexual', unidadMedida: 100 },
  { nombreTabla: 'maltrato', nombreArchivo: 'maltrato', unidadMedida: 100 },
  { nombreTabla: 'asesoria anticoncepcion', nombreArchivo: 'asesoria-anticoncepcion', unidadMedida: 100 },
];
