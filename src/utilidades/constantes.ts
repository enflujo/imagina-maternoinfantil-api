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
  {
    nombreTabla: 'EEVV - PORCENTAJE NACIDOS VIVOS BAJO PESO',
    nombreArchivo: 'nacidos-bajo-peso',
    unidadMedida: 100,
    nombreIndicador: 'PORCENTAJE DE NACIDOS VIVOS A TÉRMINO CON BAJO PESO AL NACER',
  },
  {
    nombreTabla: 'EEVV - PORCENTAJE NACIDOS VIVOS 4 CONS PRENATAL',
    nombreArchivo: 'nacidos-4-controles-prenatales',
    unidadMedida: 100,
    nombreIndicador: 'PORCENTAJE DE NACIDOS VIVOS CON CUATRO O MAS CONSULTAS DE CONTROL PRENATAL',
  },
  // { nombreTabla: 'EEVV - PROMEDIO CONTROLES PRENATALES', nombreArchivo: 'controles-prenatales', unidadMedida: 100 },
  {
    nombreTabla: 'EEVV - PORCENTAJE NACIDOS VIVOS MENOR15 PAPA 4',
    nombreArchivo: 'nacidos-menores15-padre4',
    unidadMedida: 100,
    nombreIndicador:
      'PORCENTAJE DE NACIDOS VIVOS DE MUJERES MENORES DE 15 AÑOS  DONDE EL PADRE ES MAYOR 4 O MÁS AÑOS DE EDAD',
  },
  {
    nombreTabla: 'EEVV - PORCENTAJE PARTOS INSTITUCIONALES',
    nombreArchivo: 'partos-institucionales',
    unidadMedida: 100,
    nombreIndicador: 'PORCENTAJE DE PARTOS INSTITUCIONALES',
  },
  {
    nombreTabla: 'EEVV - PORCENTAJE PARTOS POR CESAREA',
    nombreArchivo: 'partos-cesarea',
    unidadMedida: 100,
    nombreIndicador: 'PORCENTAJE DE PARTOS POR CESAREA',
  },
  {
    nombreTabla: 'EEVV - PROPORCION NACIDOS DE MENORES 14',
    nombreArchivo: 'nacidos-menores14',
    unidadMedida: 100,
    nombreIndicador: 'PORPORCIÓN DE NACIDOS VIVOS HIJOS DE MUJERES MENORES DE 14 AÑOS',
  },
  {
    nombreTabla: 'EEVV - PROPORCION NACIDOS DE MUJERES 14 A 17',
    nombreArchivo: 'nacidos-mujeres14-17',
    unidadMedida: 100,
    nombreIndicador: 'PROPORCIÓN DE NACIDOS VIVOS HIJOS DE MUJERES DE 14 A 17 AÑOS',
  },
  {
    nombreTabla: 'EEVV - RAZON MORTALIDAD MATERNA 1',
    nombreArchivo: 'mortalidad-materna1',
    unidadMedida: 100000,
    nombreIndicador: 'RAZÓN DE MORTALIDAD MATERNA A 1 AÑO',
  },
  {
    nombreTabla: 'EEVV - TASA FECUNDIDAD MUJERES 10 A 14',
    nombreArchivo: 'fecundidad-10-14',
    unidadMedida: 1000,
    nombreIndicador: 'TASA DE FECUNDIDAD ESPECÍFICA EN MUJERES DE 10 A 14 AÑOS',
  },
  {
    nombreTabla: 'EEVV - TASA FECUNDIDAD MUJERES 10 A 19',
    nombreArchivo: 'fecundidad-10-19',
    unidadMedida: 1000,
    nombreIndicador: 'TASA DE FECUNDIDAD ESPECÍFICA EN MUJERES DE 10 A 19 AÑOS',
  },
  {
    nombreTabla: 'EEVV - TASA FECUNDIDAD MUJERES 15 A 19',
    nombreArchivo: 'fecundidad-15-19',
    unidadMedida: 1000,
    nombreIndicador: 'TASA DE FECUNDIDAD ESPECÍFICA EN MUJERES DE 15 A 19 AÑOS',
  },
  {
    nombreTabla: 'EEVV - TASA MORTALIDAD NINEZ',
    nombreArchivo: 'mortalidad-ninez',
    unidadMedida: 1000,
    nombreIndicador: 'TASA DE MORTALIDAD EN LA NIÑEZ (MENORES DE 5 AÑOS DE EDAD)',
  },
  {
    nombreTabla: 'EEVV - TASA MORTALIDAD MENORES 1',
    nombreArchivo: 'mortalidad-menor1',
    unidadMedida: 1000,
    nombreIndicador: 'TASA DE MORTALIDAD EN MENORES DE UN AÑO DE EDAD',
  },
  {
    nombreTabla: 'EEVV - TASA MORTALIDAD MENORES 5 EDA',
    nombreArchivo: 'mortalidad-5eda',
    unidadMedida: 100000,
    nombreIndicador: 'TASA DE MORTALIDAD EN NIÑOS MENORES DE 5 AÑOS POR ENFERMEDAD DIARREICA AGUDA',
  },
  {
    nombreTabla: 'EEVV - TASA MORTALIDAD MENORES 5 IRA',
    nombreArchivo: 'mortalidad-5ira',
    unidadMedida: 100000,
    nombreIndicador: 'TASA DE MORTALIDAD EN NIÑOS MENORES DE 5 AÑOS POR INFECCIÓN RESPIRATORIA AGUDA',
  },
  {
    nombreTabla: 'EEVV - TASA MORTALIDAD PERINATAL',
    nombreArchivo: 'mortalidad-perinatal',
    unidadMedida: 1000,
    nombreIndicador: 'TASA DE MORTALIDAD PERINATAL',
  },
  {
    nombreTabla: 'EEVV - TASA MORTALIDAD DESNUTRICIÓN MENORES 5',
    nombreArchivo: 'mortalidad-desnutricion',
    unidadMedida: 100000,
    nombreIndicador: 'TASA DE MORTALIDAD POR DESNUTRICIÓN EN MENORES DE 5 AÑOS',
  },
  {
    nombreTabla: 'RIPS - PORCENTAJE ASESORIA ANTICONCEPCION',
    nombreArchivo: 'asesoria-anticoncepcion',
    unidadMedida: 100,
    nombreIndicador: 'Porcentaje de personas que consultaron por servicios de anticoncepción',
  },
  {
    nombreTabla: 'RIPS - PORCENTAJE GESTANTES SIFILIS',
    nombreArchivo: 'sifilis',
    unidadMedida: 100,
    nombreIndicador: 'Número de Gestantes atendidas por sífilis gestacional',
  },
  {
    nombreTabla: 'RIPS - PORCENTAJE TRANSMISION SEXUAL',
    nombreArchivo: 'trasmision-sexual',
    unidadMedida: 100,
    nombreIndicador: 'Proporción de personas atendidas por infecciones de transmisión predominantemente sexual',
  },
  {
    nombreTabla: 'RIPS - PORCENTAJE CONTROLES MENORES 5',
    nombreArchivo: 'control-5',
    unidadMedida: 100,
    nombreIndicador: 'Proporción de población menor de 5 años que es atendida para controles de rutina del niño/niña',
  },
  {
    nombreTabla: 'RIPS - PORCENTAJE MALTRATO',
    nombreArchivo: 'maltrato',
    unidadMedida: 100,
    nombreIndicador: 'Proporción de personas que fueron atendidas por sindromes de maltrato.',
  },
];
