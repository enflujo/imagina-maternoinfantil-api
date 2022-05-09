export type DatosProcesados = [
  codigoMunicipio: string,
  codigoDepartamento: string,
  datosPorAños: {
    [key: string]: DatosAño;
  }
];

export type DatosFuente = {
  Ano: number;
  Departamento: string;
  Municipio: string;
  Etnia: string;
  Numerador: number;
  Denominador: number;
  Indicador: string;
  'Tipo Régimen': string;
  Sexo: string;
  Caracterización: string;
};

/**
 *
 */
export type DatosAño = [
  /** Numerador del indicador */
  numerador: number,
  /** Denominador del indicador */
  denominador: number,
  /** Porcentaje a partir del numerador / indicador */
  porcentaje: number,
  /** Código etnia */
  etnia: number,
  codigoRegimen: string,
  codigoSexo: string,
  caracterizacion: string
];

export type NombreCodigo = {
  nombre: string;
  codigo: string;
};
