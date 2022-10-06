import { fuzzy } from 'fast-fuzzy';
import { DatosEtnia } from '../../tipos';
import { extraerNombreCodigo } from '../../utilidades/ayudas';

const tiposEtnia = [
  { nombre: 'NO REPORTADO', codigo: '-1' },
  { nombre: 'NO DEFINIDO', codigo: '-1' },
  { nombre: 'NO INFORMA', codigo: '-1' },
  { nombre: 'INDÍGENA', codigo: '1' },
  { nombre: 'ROM (GITANO)', codigo: '2' },
  { nombre: 'RAIZAL (SAN ANDRES Y PROVIDENCIA)', codigo: '3' },
  { nombre: 'PALENQUERO DE SAN BASILIO', codigo: '4' },
  { nombre: 'NEGRO, MULATO, AFROCOLOMBIANO O AFRODESCENCIENTE', codigo: '5' },
  { nombre: 'OTRAS ETNIAS', codigo: '6' },
];

export default (etnia: string, numeroFila: number, esRips: boolean): DatosEtnia => {
  let codigoEtnia = { nombre: null, codigo: null };

  if (etnia) {
    if (!esRips) {
      if (etnia === 'NO REPORTADO') {
        return { nombre: etnia, codigo: '-1' };
      } else {
        return extraerNombreCodigo(etnia);
      }
    } else {
      const datosEtnia = tiposEtnia.find((obj) => fuzzy(obj.nombre, etnia) >= 0.8);

      if (datosEtnia) {
        return datosEtnia;
      } else {
        throw new Error(
          JSON.stringify({
            error: 'No se pudo encontrar tipo de etnia',
            etnia,
          })
        );
      }
    }
  } else {
    console.log(numeroFila, etnia);
  }

  return codigoEtnia;
};
