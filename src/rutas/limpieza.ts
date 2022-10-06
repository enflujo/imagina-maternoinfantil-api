import { readdir } from 'fs/promises';

import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import path from 'path';
import fp from 'fastify-plugin';
import errata from '../modulos/errata';
import {
  Agregado,
  AgregadoNacionalProcesado,
  DatosPorAño,
  DepartamentoProcesado,
  MunicipioProcesado,
  VariablesRips,
  VariablesVvee,
} from '../tipos';
import { actualizarPorcentaje, guardarJSON, iniciarEtnias } from '../utilidades/ayudas';
import { getXlsxStream } from 'xlstream';
import barraProceso from '../modulos/barraProceso';
import { SingleBar } from 'cli-progress';
import agregador from '../modulos/agregador';
import { archivos } from '../utilidades/constantes';
import limpiarLugar from '../modulos/limpieza/lugar';
import limpiarEtnia from '../modulos/limpieza/etnia';
import limpiarRegimen from '../modulos/limpieza/regimen';
import limpiarSexo from '../modulos/limpieza/sexo';
import limpiarCaracterizacion from '../modulos/limpieza/caracterizacion';
import limpiarGeojson from '../modulos/limpieza/geojson';

const calcularMinMax = (agregados: DatosPorAño) => {
  let min = Infinity;
  let max = 0;
  for (let año in agregados) {
    const valor = agregados[año][2];
    min = valor < min ? valor : min;
    max = valor > max ? valor : max;
  }

  return { min, max };
};

async function procesarTabla(indice: number) {
  const { nombreTabla, nombreArchivo, unidadMedida } = archivos[indice];
  const ruta = path.resolve(__dirname, `../../datos/fuentes/xlsx/${nombreTabla}.xlsx`);
  const esEevv = nombreTabla.includes('EEVV');
  const esRips = nombreTabla.includes('RIPS');

  const agregadoNacional: AgregadoNacionalProcesado = {
    datos: {},
    etnias: iniciarEtnias(),
    min: 0,
    max: 0,
  };
  const agregadoDepartamental: DepartamentoProcesado[] = [];
  const agregadoMunicipal: MunicipioProcesado[] = [];

  let numeroFila = 0;
  let total = 0;
  let barraActual: SingleBar;

  const flujo = await getXlsxStream({
    filePath: ruta,
    sheet: 'datos',
    withHeader: true,
    ignoreEmpty: true,
  });

  flujo.on('data', (fila) => {
    const sumarNumerador = (numerador: number) => {
      agregadoNacional.datos[año][0] += numerador;
      datosDepartamento[0] += numerador;
      datosMunicipio[0] += numerador;

      if (etniaPais) {
        etniaPais[0] += numerador;
      }

      if (etniaDepartamento) {
        etniaDepartamento[0] += numerador;
      }
    };

    const sumarDenominador = (denominador: number) => {
      agregadoNacional.datos[año][1] += denominador;
      datosDepartamento[1] += denominador;
      datosMunicipio[1] += denominador;

      if (etniaPais) {
        etniaPais[1] += denominador;
      }

      if (etniaDepartamento) {
        etniaDepartamento[1] += denominador;
      }
    };
    // Si es la primera fila, iniciar barra de proceso
    if (numeroFila === 0) {
      total = fila.totalSheetSize;
      barraActual = barraProceso();

      barraActual.start(total, 0, {
        tabla: nombreTabla,
        terminado: false,
      });
    }

    // Contador para saber en que fila de Excel estamos, útil para buscar errores directo en el Excel.
    numeroFila++;

    // Omitir filas que tienen información que no corresponde a los datos (ejemplo: TOTALES al final)
    if (Object.keys(fila.raw.obj).length <= 4) return;

    // En este punto hay una fila con datos, sumamos al total en errata para saber cuantos hay registrados en total.
    errata[nombreTabla].total++;
    /**
     * Las variables (columnas) disponibles en el Excel.
     */

    const año = fila.formatted.obj.anno;
    const dep = fila.formatted.obj.departamento;
    const mun = fila.formatted.obj.municipio;
    const etnia = fila.formatted.obj.etnia;
    const tipoRegimen = fila.formatted.obj.regimen;

    agregador.etnias.add(etnia);
    agregador.regimen.add(tipoRegimen);

    const dEtnia = limpiarEtnia(etnia, numeroFila, esRips);
    const { datosDepartamento, datosMunicipio, etniaDepartamento } = limpiarLugar(
      agregadoDepartamental,
      agregadoMunicipal,
      dep,
      mun,
      numeroFila,
      año,
      dEtnia
    );

    let etniaPais: Agregado | null = null;

    if (!agregadoNacional.datos[año]) {
      agregadoNacional.datos[año] = [0, 0, 0];

      if (dEtnia.codigo) {
        if (!agregadoNacional.etnias[dEtnia.codigo].datos[año]) {
          agregadoNacional.etnias[dEtnia.codigo].datos[año] = [0, 0, 0];
          etniaPais = agregadoNacional.etnias[dEtnia.codigo].datos[año];
        }
      }
    }

    if (esEevv) {
      const datosFila: VariablesVvee = fila.formatted.obj;
      const numerador = datosFila.numerador;
      const denominador = datosFila.denominador;
      const caracterizacion = datosFila.caracterizacion;
      const sexo = datosFila.sexo;
      // const codigoRegimen = limpiarRegimen(tipoRegimen, numeroFila, nombreTabla);
      // const codigoSexo = limpiarSexo(sexo, numeroFila, nombreTabla);
      // const codigoCaracterizacion = limpiarCaracterizacion(caracterizacion);
      agregador.caracterizaciones.add(caracterizacion);
      agregador.sexo.add(sexo);

      if (numerador) {
        sumarNumerador(numerador);
      }

      if (denominador) {
        sumarDenominador(denominador);
      }
    } else if (esRips) {
      const datosFila: VariablesRips = fila.formatted.obj;
      const { tipo, valor } = datosFila;

      if (valor) {
        if (tipo === 'numerador') {
          sumarNumerador(valor);
        } else if (tipo === 'denominador') {
          sumarDenominador(valor);
        } else {
          console.error(numeroFila, valor, valor);
        }
      }
    }

    actualizarPorcentaje(agregadoNacional.datos[año], unidadMedida);
    actualizarPorcentaje(datosDepartamento, unidadMedida);
    actualizarPorcentaje(datosMunicipio, unidadMedida);

    if (etniaPais) {
      actualizarPorcentaje(etniaPais, unidadMedida);
    }

    if (etniaDepartamento) {
      actualizarPorcentaje(etniaDepartamento, unidadMedida);
    }

    errata[nombreTabla].procesados++;
    barraActual.update(fila.processedSheetSize, { terminado: false });
  });

  flujo.on('close', () => {
    agregarExtremos(agregadoNacional);

    agregadoDepartamental.forEach((datosDep) => {
      agregarExtremos(datosDep);
    });

    agregadoMunicipal.forEach((datosMun) => {
      agregarExtremos(datosMun);
    });

    // guardarJSON(agregadoNacional, `${nombreArchivo}-pais`);
    // guardarJSON(agregadoDepartamental, `${nombreArchivo}-departamentos`);
    // guardarJSON(agregadoMunicipal, `${nombreArchivo}-municipios`);

    // guardarJSON(errata, '_errata');
    // guardarJSON(agregador, '_agregados');

    barraActual.update(total, { terminado: true });
    barraActual.stop();

    if (indice < archivos.length - 1) {
      procesarTabla(++indice);
    } else {
      console.log('------------- FIN --------------');
    }
  });
}

const agregarExtremos = (agregado: AgregadoNacionalProcesado | DepartamentoProcesado | MunicipioProcesado) => {
  const extremos = calcularMinMax(agregado.datos);
  agregado.min = extremos.min;
  agregado.max = extremos.max;

  if (agregado.etnias) {
    for (let codigoEtnia in agregado.etnias) {
      const datosEtnia = agregado.etnias[codigoEtnia];
      const extremosEtnia = calcularMinMax(datosEtnia.datos);
      datosEtnia.min = extremosEtnia.min;
      datosEtnia.max = extremosEtnia.max;
    }
  }

  return agregado;
};

async function procesarArchivo(ruta: string) {
  console.log(ruta);
}

const RutaLimpieza: FastifyPluginAsync = async (servidor: FastifyInstance, opciones: FastifyPluginOptions) => {
  servidor.get('/excel', {}, async () => {
    procesarTabla(0);
    limpiarGeojson();
  });
};

export default fp(RutaLimpieza);
