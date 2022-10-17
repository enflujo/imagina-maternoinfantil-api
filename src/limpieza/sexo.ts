import errata from '../modulos/errata';

export default (sexo: string, numeroFila: number, nombreTabla: string) => {
  let codigoSexo: string | null = null;

  if (sexo) {
    if (sexo === 'FEMENINO') {
      codigoSexo = 'f';
    } else if (sexo === 'MASCULINO') {
      codigoSexo = 'm';
    } else if (sexo === 'INDETERMINADO') {
      codigoSexo = 'i';
    } else {
      errata[nombreTabla].errores.push(`Fila ${numeroFila}: No se pudo identificar el Sexo desde el valor ${sexo}`);
    }
  }

  return codigoSexo;
};
