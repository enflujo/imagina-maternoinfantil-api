import { writeFileSync } from 'fs';
import path from 'path';
import { Agregado, NombreCodigo } from '../tipos';

/**
 * Revisa si el valor de un texto contiene un número.
 *
 * @param valor {string} Texto a revisar
 * @returns {Boolean} true o false
 */
export const esNumero = (valor: string): boolean => !isNaN(parseInt(valor));

/**
 * Guarda datos de JS a un archivo .json
 *
 * @param {object} json Objeto o Array que se quiere guardar en archivo JSON.
 * @param {string} nombre Nombre del archivo.
 */
export const guardarJSON = (json: object, nombre: string): void => {
  writeFileSync(
    path.resolve(__dirname, `../../datos/exportados/${nombre}.json`),
    JSON.stringify(json, (_llave, valor) => (valor instanceof Set ? [...valor] : valor))
  );
};

/**
 * Redondea y reduce el número de decimales de un numero.
 *
 * @example
 * ```js
 * redondearDecimal(3.1938477402, 2, 5);
 * ```
 * @param {number} num Número decimal que se va a transformar.
 * @param {number} minimo El mínimo de decimales que debe tener el resultado.
 * @param {number} maximo El máximo de decimales que debe tener el resultado.
 * @returns {number} Número con decimales reducidos.
 */
export const redondearDecimal = (num: number, minimo: number, maximo: number): number =>
  Number(
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: minimo,
      maximumFractionDigits: maximo,
    }).format(num)
  );

export const extraerNombreCodigo = (texto: string): NombreCodigo => {
  if (texto) {
    try {
      const textoComparar = texto.toLocaleLowerCase().trim();
      if (textoComparar.includes('definido') || textoComparar.includes('reportado')) {
        return { nombre: 'No Definido', codigo: '-1' };
      }

      if (texto.includes('-')) {
        const arr = texto.split('-');
        const codigo = arr[0].trim();
        const nombre = arr[1].trim();
        return { nombre, codigo };
      }
    } catch (err) {
      throw new Error(JSON.stringify(err));
    }
  }

  console.log(`Problema al extraer nombre y código del texto: ${texto}`);
  throw new Error();
};

/**
 * Convierte milisegundos a texto, útil para imprimir tiempo transcurrido.
 * @param ms Tiempo en milisegundos
 * @returns Tiempo en formato: HH:MM:SS
 */
export const reloj = (ms: number): string =>
  new Date(ms).toLocaleTimeString('en-GB', {
    timeZone: 'Etc/UTC',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

export const actualizarPorcentaje = (agregado: Agregado, unidadMedida: number = 100) => {
  const [numerador, denominador] = agregado;
  const porcentaje = (numerador / denominador) * unidadMedida;
  agregado[2] = redondearDecimal(porcentaje, 1, 2);
};

export const iniciarDatos = () => {
  return { datos: {}, min: 0, max: 0 };
};

export const iniciarEtnias = () => {
  return {
    '-1': iniciarDatos(),
    '1': iniciarDatos(),
    '2': iniciarDatos(),
    '3': iniciarDatos(),
    '4': iniciarDatos(),
    '5': iniciarDatos(),
    '6': iniciarDatos(),
  };
};
