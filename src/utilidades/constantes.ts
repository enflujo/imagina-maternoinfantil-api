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
  { nombreTabla: 'EEVV - PORCENTAJE NACIDOS VIVOS BAJO PESO', nombreArchivo: 'nacidos-bajo-peso', unidadMedida: 100 },
  {
    nombreTabla: 'EEVV - PORCENTAJE NACIDOS VIVOS 4 CONS PRENATAL',
    nombreArchivo: 'nacidos-4-controles-prenatales',
    unidadMedida: 100,
  },
  // { nombreTabla: 'EEVV - PROMEDIO CONTROLES PRENATALES', nombreArchivo: 'controles-prenatales', unidadMedida: 100 },
  {
    nombreTabla: 'EEVV - PORCENTAJE NACIDOS VIVOS MENOR15 PAPA 4',
    nombreArchivo: 'nacidos-menores15-padre4',
    unidadMedida: 100,
  },
  {
    nombreTabla: 'EEVV - PORCENTAJE PARTOS INSTITUCIONALES',
    nombreArchivo: 'partos-institucionales',
    unidadMedida: 100,
  },
  { nombreTabla: 'EEVV - PORCENTAJE PARTOS POR CESAREA', nombreArchivo: 'partos-cesarea', unidadMedida: 100 },
  { nombreTabla: 'EEVV - PROPORCION NACIDOS DE MENORES 14', nombreArchivo: 'nacidos-menores14', unidadMedida: 100 },
  {
    nombreTabla: 'EEVV - PROPORCION NACIDOS DE MUJERES 14 A 17',
    nombreArchivo: 'nacidos-mujeres14-17',
    unidadMedida: 100,
  },
  { nombreTabla: 'EEVV - RAZON MORTALIDAD MATERNA 1', nombreArchivo: 'mortalidad-materna1', unidadMedida: 100000 },
  { nombreTabla: 'EEVV - TASA FECUNDIDAD MUJERES 10 A 14', nombreArchivo: 'fecundidad-10-14', unidadMedida: 1000 },
  { nombreTabla: 'EEVV - TASA FECUNDIDAD MUJERES 10 A 19', nombreArchivo: 'fecundidad-10-19', unidadMedida: 1000 },
  { nombreTabla: 'EEVV - TASA FECUNDIDAD MUJERES 15 A 19', nombreArchivo: 'fecundidad-15-19', unidadMedida: 1000 },
  { nombreTabla: 'EEVV - TASA MORTALIDAD NINEZ', nombreArchivo: 'mortalidad-ninez', unidadMedida: 1000 },
  { nombreTabla: 'EEVV - TASA MORTALIDAD MENORES 1', nombreArchivo: 'mortalidad-menor1', unidadMedida: 1000 },
  { nombreTabla: 'EEVV - TASA MORTALIDAD MENORES 5 EDA', nombreArchivo: 'mortalidad-5eda', unidadMedida: 100000 },
  { nombreTabla: 'EEVV - TASA MORTALIDAD MENORES 5 IRA', nombreArchivo: 'mortalidad-5ira', unidadMedida: 100000 },
  { nombreTabla: 'EEVV - TASA MORTALIDAD PERINATAL', nombreArchivo: 'mortalidad-perinatal', unidadMedida: 1000 },
  {
    nombreTabla: 'EEVV - TASA MORTALIDAD DESNUTRICIÓN MENORES 5',
    nombreArchivo: 'mortalidad-desnutricion',
    unidadMedida: 100000,
  },
  {
    nombreTabla: 'RIPS - PORCENTAJE ASESORIA ANTICONCEPCION',
    nombreArchivo: 'asesoria-anticoncepcion',
    unidadMedida: 100,
  },
  { nombreTabla: 'RIPS - PORCENTAJE GESTANTES SIFILIS', nombreArchivo: 'sifilis', unidadMedida: 100 },
  { nombreTabla: 'RIPS - PORCENTAJE TRANSMISION SEXUAL', nombreArchivo: 'trasmision-sexual', unidadMedida: 100 },
  { nombreTabla: 'RIPS - PORCENTAJE CONTROLES MENORES 5', nombreArchivo: 'control-5', unidadMedida: 100 },
  { nombreTabla: 'RIPS - PORCENTAJE MALTRATO', nombreArchivo: 'maltrato', unidadMedida: 100 },
];
