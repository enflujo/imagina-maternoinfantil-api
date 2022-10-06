export type AgregadoNacionalProcesado = {
  datos: DatosPorAño;
  etnias: EtniasProcesadas;
  min: number;
  max: number;
};

export type MunicipioProcesado = {
  /** Código del municipio */
  codigo: string;
  /** Nombre del municipio */
  nombre?: string | null;
  /** Agregados por año del municipio */
  datos: DatosPorAño;
  etnias?: EtniasProcesadas;
  min: number;
  max: number;
};

export type DepartamentoProcesado = {
  /** Código del departamento */
  codigo: string;
  /** Nombre del departamento */
  nombre?: string | null;
  datos: DatosPorAño;
  etnias: EtniasProcesadas;
  min: number;
  max: number;
};

export type TiposEtnia = {
  '-1': 'No Reportado';
  '1': 'Indígena';
  '2': 'Rom (Gitano)';
  '3': 'Raizal (San Andrés y Providencia)';
  '4': 'Palenquero de San Basilio';
  '5': 'Negro, Mulato, Afrocolombiano o Afrodecendiente';
  '6': 'Otras Etnias';
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
  etnia: string,
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
  nombre?: string | null;
  datos: {
    [año: string]: Agregado;
  };
  dep?: string;
};

export type Municipio = [
  /** Código de municipio (sin departamento): ### */
  codigo: string,
  /** Nombre de la ciudad o municipio */
  nombre: string,
  /** Código del departamento al que pertenece la ciudad o municipio: ## */
  codigoDepartamento: string,
  /** Código de la ciudad o municipio (incluyendo su departamento): ##### */
  codigoCompleto: string
];
export type ObjetoMunicipios = {
  llaves: string[];
  datos: Municipio[];
};

export type Departamento = [codigo: string, nombre: string, latitud: number, longitud: number];
export type ObjetoDepartamentos = {
  llaves: string[];
  datos: Departamento[];
};

export type IndicadorReferencia = {
  nombreTabla: string;
  nombreArchivo: string;
  unidadMedida: number;
};

export type DatosEtnia = {
  nombre: string | null;
  codigo: string | null;
};

export type Agregado = [numerador: number, denominador: number, porcentaje: number];

/**
 * Variables en las tablas de Excel provenientes de VVEE
 */
export type VariablesVvee = {
  /** Año */
  anno: string;
  /** Departamento */
  departamento: string;
  /** Municipio */
  municipio: string;
  /** Etnia */
  etnia: string;
  /** Tipo de régimen */
  regimen: string;
  /** Sexo */
  sexo: string;
  /** Caracterización */
  caracterizacion: string;
  /** Numerador */
  numerador?: number;
  /** Denominador */
  denominador?: number;
};

export type VariablesRips = {
  tipo: string;
  anno: string;
  departamento: string;
  municipio: string;
  regimen: string;
  etnia: string;
  valor: number;
};

type EtniasProcesadas = {
  [codigoEtnia: string]: {
    datos: { [año: string]: Agregado };
    min: number;
    max: number;
  };
};

export type DatosPorAño = {
  [año: string]: Agregado;
};
