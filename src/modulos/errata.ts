export type Tablas = {
  [key: string]: {
    sinPorcentaje: number;
    errores: string[];
    procesados: number;
    numeradorMayorQueDenominador: number;
    total: number;
  };
};

export default {} as Tablas;
