import { extraerNombreCodigo } from '../../utilidades/ayudas';

export default (etnia: string, numeroFila: number) => {
  let codigoEtnia: number | null = null;

  if (etnia) {
    if (etnia === 'NO REPORTADO') {
      codigoEtnia = -1;
    } else {
      const { codigo } = extraerNombreCodigo(etnia);
      codigoEtnia = +codigo;
    }
  } else {
    console.log(numeroFila, etnia);
  }

  return codigoEtnia;
};
