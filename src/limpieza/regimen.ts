import { extraerNombreCodigo } from '../utilidades/ayudas';
import errata from '../modulos/errata';

export default (tipoRegimen: string, numeroFila: number, nombreTabla: string) => {
  let codigoRegimen: string | null = null;

  if (tipoRegimen) {
    const { codigo } = extraerNombreCodigo(tipoRegimen);
    codigoRegimen = codigo.toLowerCase();
  } else {
    errata[nombreTabla].errores.push(
      `Fila ${numeroFila}: No se pudo identificar el Tipo de Régimen desde el valor ${tipoRegimen}`
    );
  }

  return codigoRegimen;
};
