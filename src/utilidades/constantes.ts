import colores from 'cli-color';
import emoji from 'node-emoji';

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
export const archivos = [
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
