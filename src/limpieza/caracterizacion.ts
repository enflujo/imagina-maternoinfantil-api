import { esNumero } from '../utilidades/ayudas';

export default (caracterizacion: string) => {
  let codigoCaracterizacion: string | null = null;

  if (caracterizacion) {
    if (caracterizacion === 'No Reportado') {
      codigoCaracterizacion = 'nr';
    } else {
      const partes = caracterizacion.split(' ');
      const edades = partes.filter((parte: string) => esNumero(parte));
      codigoCaracterizacion = edades.join('-');
    }
  }

  return codigoCaracterizacion;
};
