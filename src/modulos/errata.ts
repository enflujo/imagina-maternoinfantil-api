import { IndicadorReferencia } from '../tipos';
import { archivos } from '../utilidades/constantes';

export type Tablas = {
  [key: string]: {
    sinPorcentaje: number;
    procesados: number;
    numeradorMayorQueDenominador: number;
    errores: string[];
    total: number;
  };
};

const errata: Tablas = {};

archivos.forEach((indicador: IndicadorReferencia) => {
  errata[indicador.nombreTabla] = {
    sinPorcentaje: 0,
    procesados: 0,
    numeradorMayorQueDenominador: 0,
    errores: [],
    total: 0,
  };
});

export default errata;
