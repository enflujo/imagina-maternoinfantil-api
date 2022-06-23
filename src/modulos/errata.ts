export type Tablas = {
  [key: string]: {
    sinPorcentaje: number;
    procesados: number;
    numeradorMayorQueDenominador: number;
    errores: string[];
    total: number;
  };
};

export default {} as Tablas;
