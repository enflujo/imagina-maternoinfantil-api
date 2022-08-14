import { SingleBar } from 'cli-progress';
import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import fp from 'fastify-plugin';
import path from 'path';
import { getXlsxStream } from 'xlstream';
import barraProceso from '../modulos/barraProceso';
import { AgregadoNacionalProcesado, DepartamentoProcesado, MunicipioProcesado } from '../tipos';
import { rips } from '../utilidades/constantes';
import limpiarLugar from '../modulos/limpieza/lugar';
import { actualizarPorcentaje, esNumero, guardarJSON } from '../utilidades/ayudas';

async function procesarTabla(indice: number) {
  const { nombreTabla, nombreArchivo, unidadMedida } = rips[indice];
  const agregadoNacional: AgregadoNacionalProcesado = {};
  const agregadoDepartamental: DepartamentoProcesado[] = [];
  const agregadoMunicipal: MunicipioProcesado[] = [];

  let numeroFila = 0;
  let total = 0;
  let barraActual: SingleBar;

  const flujo = await getXlsxStream({
    filePath: path.resolve(__dirname, '../../datos/fuentes/INDICADORES RIPS FINALES PLANO.xlsx'),
    sheet: nombreTabla,
    withHeader: true,
    ignoreEmpty: true,
  });

  flujo.on('data', (fila) => {
    if (numeroFila === 0) {
      total = fila.totalSheetSize;
      barraActual = barraProceso();

      barraActual.start(total, 0, {
        tabla: nombreTabla,
        terminado: false,
      });
    }
    numeroFila++;

    const datosFila = fila.formatted.obj;
    const año = datosFila.Anno;
    const dep = datosFila.Departamento;
    const mun = datosFila.Municipio;
    const valor = esNumero(datosFila.Valor) ? +datosFila.Valor : null;

    const { datosDepartamento, datosMunicipio } = limpiarLugar(
      agregadoDepartamental,
      agregadoMunicipal,
      dep,
      mun,
      numeroFila,
      año
    );

    if (!agregadoNacional[año]) {
      agregadoNacional[año] = [0, 0, 0];
    }

    if (valor && datosFila.Tipo === 'numerador') {
      agregadoNacional[año][0] += valor;
      datosDepartamento[0] += valor;
      datosMunicipio[0] += valor;
    } else if (valor && datosFila.Tipo === 'denominador') {
      agregadoNacional[año][1] += valor;
      datosDepartamento[1] += valor;
      datosMunicipio[1] += valor;
    } else {
      console.error(numeroFila, valor, datosFila.Valor);
    }

    actualizarPorcentaje(agregadoNacional[año], unidadMedida);
    actualizarPorcentaje(datosDepartamento, unidadMedida);
    actualizarPorcentaje(datosMunicipio, unidadMedida);

    barraActual.update(fila.processedSheetSize, { terminado: false });
  });

  flujo.on('close', () => {
    guardarJSON(agregadoNacional, `${nombreArchivo}-pais`);
    guardarJSON(agregadoDepartamental, `${nombreArchivo}-departamentos`);
    guardarJSON(agregadoMunicipal, `${nombreArchivo}-municipios`);
    // guardarJSON(datosProcesados, nombreTabla);

    // guardarJSON(errata, '_errata');
    // guardarJSON(agregador, '_agregados');

    barraActual.update(total, { terminado: true });
    barraActual.stop();

    if (indice < rips.length - 1) {
      procesarTabla(++indice);
    } else {
      console.log('------------- FIN --------------');
    }
  });
}

const RutaRips: FastifyPluginAsync = async (servidor: FastifyInstance, opciones: FastifyPluginOptions) => {
  servidor.get('/rips', {}, async () => {
    procesarTabla(0);
  });
};

export default fp(RutaRips);
