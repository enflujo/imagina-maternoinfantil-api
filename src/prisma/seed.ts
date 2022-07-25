import { PrismaClient, Prisma } from '@prisma/client';
import { SingleBar } from 'cli-progress';
import path from 'path';
import { getXlsxStream } from 'xlstream';
import barraProceso from '../modulos/barraProceso';
import { AgregadoNacionalProcesado, DatosProcesados, Lugar } from '../tipos';
import { archivos } from '../utilidades/constantes';
import limpiarLugar from '../modulos/limpieza/lugar';
import limpiarEtnia from '../modulos/limpieza/etnia';
import limpiarRegimen from '../modulos/limpieza/regimen';
import limpiarSexo from '../modulos/limpieza/sexo';
import limpiarCaracterizacion from '../modulos/limpieza/caracterizacion';
import { actualizarPorcentaje, esNumero, redondearDecimal } from '../utilidades/ayudas';
const prisma = new PrismaClient();

async function procesarTabla(indice: number) {
  const indicador = archivos[indice];
  const nombreTabla = indicador.nombreTabla;
  const datosProcesados: DatosProcesados = [];
  const agregadoNacional: AgregadoNacionalProcesado = {};

  let numeroFila = 0;
  let total = 0;
  let barraActual: SingleBar;

  const flujo = await getXlsxStream({
    filePath: path.resolve(__dirname, '../../datos/NUEVA data indicadores disponibles minsaludf.xlsx'),
    sheet: nombreTabla,
    withHeader: false,
    ignoreEmpty: true,
  });

  flujo.on('data', async (fila) => {
    // Si es la primera fila, iniciar barra de proceso
    if (numeroFila === 0) {
      total = fila.totalSheetSize;
      barraActual = barraProceso();

      barraActual.start(total, 0, {
        tabla: nombreTabla,
        terminado: false,
      });
    }
    numeroFila++;

    // Omitir filas que tienen información que no corresponde a los datos (ejemplo: TOTALES al final)
    if (Object.keys(fila.raw.obj).length <= 4) return;

    // Contador para saber en que fila de Excel estamos, útil para buscar errores directo en el Excel.

    // Particularidad de este Excel, todas las tablas empiezan en la fila 4
    if (numeroFila >= 3) {
      // En este punto hay una fila con datos, sumamos al total en errata para saber cuantos hay registrados en total.
      // errata[nombreTabla].total++;

      /**
       * Las variables (columnas) disponibles en el Excel.
       */
      const año = fila.formatted.obj.A;
      const indicador = fila.formatted.obj.B;
      const dep = fila.formatted.obj.C;
      const mun = fila.formatted.obj.D;
      const etnia = fila.formatted.obj.E;
      const tipoRegimen = fila.formatted.obj.F;
      const sexo = fila.formatted.obj.G;
      const caracterizacion = fila.formatted.obj.H;
      const nume = fila.formatted.obj.I;
      const deno = fila.formatted.obj.J;

      // agregador.caracterizaciones.add(caracterizacion);
      // agregador.etnias.add(etnia);
      // agregador.regimen.add(tipoRegimen);
      // agregador.sexo.add(sexo);

      // const numerador = esNumero(nume) ? +nume : null;
      // const denominador = esNumero(deno) ? +deno : null;

      // if (nombreTabla !== 'PROMEDIO CONTROLES PRENATALES') {
      //   if (numerador && denominador) {
      //     if (numerador > denominador) {
      //       errata[nombreTabla].numeradorMayorQueDenominador++;
      //       errata[nombreTabla].errores.push(
      //         `Fila ${numeroFila}: ${numerador} (Numerador) es > que ${denominador} (denominador)`
      //       );
      //       // console.log(`Numerador (${numerador}) es > que denominador (${denominador})`);
      //       // throw new Error(JSON.stringify(fila, null, 2));
      //       // return;
      //     }
      //   }
      // } else {
      //   // TODO: hacer el calculo de este indicador diferente al resto
      // }

      // const { datosDepartamento, datosMunicipio } = limpiarLugar(datosProcesados, dep, numeroFila, mun, año);
      const etniaProcesado = limpiarEtnia(etnia, numeroFila);
      if (etniaProcesado.codigo) {
        try {
          const agregarEtnia = await prisma.etnia.upsert({
            where: { codigo: etniaProcesado.codigo },
            update: {},
            create: { ...etniaProcesado },
          });
        } catch (error) {
          console.error(error);
          console.error(numeroFila, etniaProcesado);
          throw new Error();
        }
        const agregarCaso = await prisma.casos.create({
          data: {
            etniaCodigo: etniaProcesado.codigo,
          },
        });
      } else {
        console.log(etnia);
      }

      if (!indicador) {
        console.log(indicador);
      }

      // const codigoRegimen = limpiarRegimen(tipoRegimen, numeroFila, nombreTabla);
      // const codigoSexo = limpiarSexo(sexo, numeroFila, nombreTabla);
      // const codigoCaracterizacion = limpiarCaracterizacion(caracterizacion);

      // if (!agregadoNacional[año]) {
      //   agregadoNacional[año] = [0, 0, 0];
      // }

      // if (numerador) {
      //   agregadoNacional[año][0] += numerador;
      //   datosDepartamento.agregados[año][0] += numerador;
      //   datosMunicipio.agregados[año][0] += numerador;
      // }

      // if (denominador) {
      //   agregadoNacional[año][1] += denominador;
      //   datosDepartamento.agregados[año][1] += denominador;
      //   datosMunicipio.agregados[año][1] += denominador;
      // }

      // actualizarPorcentaje(agregadoNacional[año]);
      // actualizarPorcentaje(datosDepartamento.agregados[año]);
      // actualizarPorcentaje(datosMunicipio.agregados[año]);

      // if (!datosMunicipio.datos[año]) {
      //   datosMunicipio.datos[año] = [];
      // }

      // datosMunicipio.datos[año].push([
      //   codigoEtnia,
      //   codigoRegimen,
      //   codigoSexo,
      //   codigoCaracterizacion,
      //   numerador,
      //   denominador,
      //   numerador && denominador ? redondearDecimal((numerador / denominador) * 100, 1, 2) : null,
      // ]);

      // errata[nombreTabla].procesados++;
      barraActual.update(fila.processedSheetSize, { terminado: false });
    } else {
      // console.log(fila);
    }
  });

  flujo.on('close', () => {
    // const municipiosAgregados: Lugar[] = [];

    // const departamentosAgregados = datosProcesados.map((obj) => {
    //   // Extraer datos de municipios en este loop
    //   obj.municipios.forEach((mun) => {
    //     municipiosAgregados.push({
    //       codigo: mun.mun,
    //       // nombre: mun.nombre,
    //       dep: obj.dep,
    //       datos: mun.agregados,
    //     });
    //   });

    //   // devolver sólo datos de departamento
    //   return {
    //     codigo: obj.dep,
    //     // nombre: obj.nombre,
    //     datos: obj.agregados,
    //   };
    // });

    // guardarJSON(agregadoNacional, `${nombreTabla}-pais`);
    // guardarJSON(departamentosAgregados, `${nombreTabla}-departamentos`);
    // guardarJSON(municipiosAgregados, `${nombreTabla}-municipios`);
    // guardarJSON(datosProcesados, nombreTabla);

    // guardarJSON(errata, 'errata');
    // guardarJSON(agregador, 'agregados');

    barraActual.update(total, { terminado: true });
    barraActual.stop();

    if (indice < archivos.length - 1) {
      procesarTabla(++indice);
    } else {
      console.log('------------- FIN --------------');
    }
  });
}

const datosEtnias: Prisma.EtniaCreateInput[] = [
  {
    codigo: '-1',
    nombre: 'NO REPORTADO',
  },
  {
    codigo: '1',
    nombre: 'INDÍGENA',
  },
  {
    codigo: '2',
    nombre: 'ROM (GITANO)',
  },
  {
    codigo: '3',
    nombre: 'RAIZAL (SAN ANDRES Y PROVIDENCIA)',
  },
  {
    codigo: '4',
    nombre: 'PALENQUERO DE SAN BASILIO',
  },
  {
    codigo: '5',
    nombre: 'NEGRO, MULATO, AFROCOLOMBIANO O AFRODESCENCIENTE',
  },
  {
    codigo: '6',
    nombre: 'OTRAS ETNIAS',
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const data of datosEtnias) {
    const etnia = await prisma.etnia.create({ data });
    console.log(`Created user with id: ${etnia.codigo}`);
  }
  console.log(`Seeding finished.`);
}

async function inicio() {
  try {
    await procesarTabla(17);
    await prisma.$disconnect();
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
inicio();
// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
