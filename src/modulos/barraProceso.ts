import { SingleBar, Options as ProgressOptions, Params as ProgressParams } from 'cli-progress';
import {
  logAviso,
  logCyan,
  logVerde,
  chulo,
  logBloque,
  gorila,
  conector,
  logNaranjaPulso,
} from '../utilidades/constantes';
import { reloj } from '../utilidades/ayudas';

type ProgressPayload = {
  tabla: string;
  terminado: boolean;
};

function formatoBarra(opciones: ProgressOptions, params: ProgressParams, payload: ProgressPayload): string {
  if (opciones) {
    const { value, total, progress, startTime } = params;
    const ancho = opciones.barsize || 40;
    const completado = Math.round(progress * ancho);
    const seccionCompleta = opciones.barCompleteString || '=';
    const seccionIncompleta = opciones.barIncompleteString || '-';
    const barra = seccionCompleta.substring(0, completado) + seccionIncompleta.substring(0, ancho - completado);
    const paginas = `Tabla: ${payload.tabla}`;
    const cola = `${paginas} | ${((value / total) * 100).toFixed(1)}% | ${reloj(Date.now() - startTime)}`;

    if (!payload.terminado) {
      if (value >= total) {
        return `${logBloque(conector)} ${logAviso('Procesando errata')} |${logNaranjaPulso(barra)}| ${cola}`;
      } else {
        return `${logBloque(gorila)} ${logAviso('Procesando')} |${logCyan(barra)}| ${cola}`;
      }
    }

    return `${chulo} ${logAviso('Archivo procesado')} |${logVerde(barra)}| ${cola}`;
  }

  return '';
}

export default new SingleBar({
  format: formatoBarra,
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  // forceRedraw: true,
  hideCursor: true,
});
