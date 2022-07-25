import { extraerNombreCodigo } from '../../utilidades/ayudas';

export default (etnia: string, numeroFila: number) => {
  let codigoEtnia = { nombre: null, codigo: null };

  if (etnia) {
    if (etnia === 'NO REPORTADO') {
      return { nombre: etnia, codigo: '-1' };
    } else {
      return extraerNombreCodigo(etnia);
    }
  } else {
    console.log(numeroFila, etnia);
  }

  return codigoEtnia;
};
