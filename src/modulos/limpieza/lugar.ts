import { DatosProcesados, DepartamentoProcesado, MunicipioProcesado } from '../../tipos';
import { extraerNombreCodigo } from '../../utilidades/ayudas';
import { departamentos, municipios } from '../../utilidades/lugaresColombia';

export default (datosProcesados: DatosProcesados, dep: string | null, numeroFila: Number, mun: string, año: string) => {
  let departamentoI = 0;

  if (dep) {
    const { codigo } = extraerNombreCodigo(dep);
    departamentoI = datosProcesados.findIndex((d: DepartamentoProcesado) => d.dep === codigo);
    // const infoDepartamento = departamentos.datos.find((d) => d[0] === codigo);
    // const nombre = infoDepartamento ? infoDepartamento[1] : null;

    if (departamentoI < 0) {
      datosProcesados.push({
        dep: codigo,
        // nombre,
        agregados: {},
        municipios: [],
      });
      departamentoI = datosProcesados.length - 1;
    }
  } else {
    throw new Error('ERROR: Departamento');
  }

  let municipioI = 0;
  const datosDepartamento = datosProcesados[departamentoI];

  if (mun) {
    const { codigo } = extraerNombreCodigo(mun);
    municipioI = datosDepartamento.municipios.findIndex((m: MunicipioProcesado) => m.mun === codigo);
    // const infoMunicipio = municipios.datos.find((d) => d[3] === codigo);
    // const nombre = infoMunicipio ? infoMunicipio[1] : null;

    if (municipioI < 0) {
      datosDepartamento.municipios.push({
        mun: codigo,
        // nombre,
        agregados: {},
        datos: {},
      });
      municipioI = datosDepartamento.municipios.length - 1;
    }
  } else {
    console.error(numeroFila, mun);
    throw new Error('ERROR: Municipio');
  }

  const datosMunicipio = datosDepartamento.municipios[municipioI];

  if (!datosDepartamento.agregados[año]) {
    datosDepartamento.agregados[año] = [0, 0, 0];
  }

  if (!datosDepartamento.municipios[municipioI].agregados[año]) {
    datosDepartamento.municipios[municipioI].agregados[año] = [0, 0, 0];
  }

  return { datosDepartamento, datosMunicipio };
};
