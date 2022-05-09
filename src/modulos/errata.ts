export type Tablas = {
  [key: string]: {
    sinPorcentaje: number;
    errores: string[];
    procesados: number;
    numeradorMayorQueDenominador: number;
    total: number;
  };
  // 'nacidos vivos bajo peso': string[];
  // 'nacidos vivos < 4 cp': string[];
};

//   {"nacidos padres 4 años >": "Nacidos de madres mayores de 15 años cuyo padre es más de 4 años mayor que la madre"},
//   {"nacidos < 15 padres 4 años >": "Nacidos de madres menores de 15 años cuyo padre es más de 4 años mayor que la madre"},
//   {"partos atendidos personal calif": "Partos atendidos por personal calificado"},
//   {"partos": "Partos"},
//   {"partos por cesarea": "Partos por cesárea"},
//   {"nacidos de <14": "Nacidos de madres menores de 14 años"},
//   {"controles prenatales": "Controles prenatales"},
//   {"nacidos de 14 a 17": "Nacidos de madres de entre 14 y 17 años"},
//   {"nacidos de 18 a 26": "Nacidos de madres de entre 18 y 26 años"},
//   {"mortalidad materna 1 año": "Mortalidad materna durante el primer año después del parto"},
//   {"mortalidad materna 42 dias": "Mortalidad materna durante los primeros 42 días después del parto"},
//   {"fecundidad 10 a 14": "Fecundidad en niñas de entre 10 y 14 años"},
//   {"fecundidad 10 a 19": "Fecundidad en niñas de entre 10 y 19 años"},
//   {"fecundidad 15 a 19": "Fecundidad en niñas de entre 15 y 19 años"},
//   {"mortalidad menores de 5 años": "Mortalidad en menores de 5 años"},
//   {"mortalidad menor de 1 año": "Mortalidad en menores de 1 año"},
//   {"mortalidad < 5 eda": "Revisar si se repite ¿?"},
//   {"mortalidad fetal": "Mortalidad fetal"},
//   {"mortalidad neonatal": "Mortalidad neonatal"},
//   {"mortalidad neonatal tardia": "Mortalidad neonatal tardía"},
//   {"mortalidad neonatal temprana": "Mortalidad neonatal temprana"},
//   {"mortalidad perinatal": "Mortalidad perinatal"},
//   {"mortalidad desnutricion <5": "Mortalidad por desnutrición en menores de 5 años"},
//   {"mortalidad postneonatal": "Mortalidad postneonatal"}
// ;
export default {} as Tablas;
