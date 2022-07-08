// {
//   dep: '05',
//   agregados: {
//     2015: [0, 0, 0],
//   },
//   municipios: [
//     {
//       mun: '05001',
//       agregados: {
//         2015: [0, 0, 0],
//       },
//       datos: {
//         2015: [
//           [1, 'c', 'f', 'nr', 0, 1],
//           [1, 'c', 'm', 'nr', 0, 3],
//         ],
//         2016: [[], []],
//       },
//     },
//   ];
// }

export type Agregado = [nominador: number, denominador: number, porcentaje: number];

export type Instancia = [
  etnia: number | null,
  regimen: string | null,
  sexo: string | null,
  caracterizacion: string | null,
  numerador: number | null,
  denominador: number | null,
  porcentaje: number | null
];

export type MunicipioProcesado = {
  /** Código del municipio */
  mun: string;
  /** Agregados por año del municipio */
  agregados: {
    [key: string]: Agregado;
  };
  datos: {
    [key: string]: Instancia[];
  };
};

export type DepartamentoProcesado = {
  /** Código del departamento */
  dep: string;
  /** Agregados por año del departamento */
  agregados: {
    [key: string]: Agregado;
  };
  /** Municipios */
  municipios: MunicipioProcesado[];
};

export type DatosProcesados = DepartamentoProcesado[];

export type DatosFuente = {
  Ano: number;
  Indicador: string;
  Departamento: string;
  Municipio: string;
  Etnia: string;
  Régimen: string;
  Sexo: string;
  Caracterización: string;
  Numerador: number;
  Denominador: number;
  ValorIndicador: number;
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

export type Lugar = {
  codigo: string;
  datos: {
    [key: string]: Agregado;
  };
  dep?: string;
};
