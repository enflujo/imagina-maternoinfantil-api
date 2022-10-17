import path from 'path';
import { getXlsxStream } from 'xlstream';
import { SingleBar } from 'cli-progress';

import errata from './modulos/errata';
import {
  NacionalProcesado,
  DepartamentoProcesado,
  MunicipioProcesado,
  DatosEtnia,
  VariablesRips,
  VariablesVvee,
} from './tipos';
import { actualizarPorcentaje, agregarExtremos, guardarJSON, iniciarEtnias } from './utilidades/ayudas';

import barraProceso from './modulos/barraProceso';

import agregador from './modulos/agregador';
import { archivos, logAviso, logCyan, logVerde } from './utilidades/constantes';
import limpiarLugar from './limpieza/lugar';
import limpiarEtnia from './limpieza/etnia';
import limpiarRegimen from './limpieza/regimen';
import limpiarSexo from './limpieza/sexo';
import limpiarCaracterizacion from './limpieza/caracterizacion';
import limpiarGeojson from './limpieza/geojson';

async function procesarTabla(indice: number) {
  const { nombreTabla, nombreArchivo, unidadMedida } = archivos[indice];
  const ruta = path.resolve(__dirname, `../datos/fuentes/xlsx/${nombreTabla}.xlsx`);
  const esEevv = nombreTabla.includes('EEVV');
  const esRips = nombreTabla.includes('RIPS');

  const agregadoNacional: NacionalProcesado = { datos: {}, etnias: iniciarEtnias(), min: 0, max: 0 };
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
    const { datosPais, datosDepartamento, datosMunicipio, etniaDepartamento, etniaPais } = limpiarLugar(
      agregadoNacional,
      agregadoDepartamental,
      agregadoMunicipal,
      dep,
      mun,
      numeroFila,
      año,
      dEtnia
    );

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
        sumarNumerador(numerador, dEtnia);
      }

      if (denominador) {
        sumarDenominador(denominador, dEtnia);
      }
    } else if (esRips) {
      const datosFila: VariablesRips = fila.formatted.obj;
      const { tipo, valor } = datosFila;

      if (valor) {
        if (tipo === 'numerador') {
          sumarNumerador(valor, dEtnia);
        } else if (tipo === 'denominador') {
          sumarDenominador(valor, dEtnia);
        } else {
          console.error(numeroFila, valor, valor);
        }
      }
    }

    actualizarPorcentaje(datosPais, unidadMedida);
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

    function sumarNumerador(numerador: number, dEtnia?: DatosEtnia) {
      agregadoNacional.datos[año][0] += numerador;
      datosDepartamento[0] += numerador;
      datosMunicipio[0] += numerador;

      if (etniaPais) {
        etniaPais[0] += numerador;
      }

      if (etniaDepartamento) {
        etniaDepartamento[0] += numerador;
      }
    }

    function sumarDenominador(denominador: number, dEtnia?: DatosEtnia) {
      agregadoNacional.datos[año][1] += denominador;
      datosDepartamento[1] += denominador;
      datosMunicipio[1] += denominador;

      if (etniaPais) {
        etniaPais[1] += denominador;
      }

      if (etniaDepartamento) {
        etniaDepartamento[1] += denominador;
      }
    }
  });

  flujo.on('close', () => {
    agregarExtremos(agregadoNacional);

    agregadoDepartamental.forEach((datosDep) => {
      agregarExtremos(datosDep);
    });

    agregadoMunicipal.forEach((datosMun) => {
      agregarExtremos(datosMun);
    });

    guardarJSON(agregadoNacional, `${nombreArchivo}-pais`);
    guardarJSON(agregadoDepartamental, `${nombreArchivo}-departamentos`);
    guardarJSON(agregadoMunicipal, `${nombreArchivo}-municipios`);

    guardarJSON(errata, '_errata');
    guardarJSON(agregador, '_agregados');

    barraActual.update(total, { terminado: true });
    barraActual.stop();

    if (indice < archivos.length - 1) {
      procesarTabla(++indice);
    } else {
      console.log('------------- FIN --------------');
    }
  });
}

async function inicio() {
  console.log(logAviso('..:: Procesando GeoJSON ::..'));
  limpiarGeojson();
  console.log(logVerde('..:: GeoJSON Procesados ::..'));

  console.log(logCyan('..:: Procesando Archivos ::..'));
  await procesarTabla(0);
}

inicio();
