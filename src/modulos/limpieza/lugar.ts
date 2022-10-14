import { DatosEtnia, DepartamentoProcesado, MunicipioProcesado, NacionalProcesado } from '../../tipos';
import { extraerNombreCodigo, iniciarEtnias } from '../../utilidades/ayudas';
import { departamentos, municipios } from '../../utilidades/lugaresColombia';

export default (
  agregadoNacional: NacionalProcesado,
  agregadoDepartamental: DepartamentoProcesado[],
  agregadoMunicipal: MunicipioProcesado[],
  dep: string | null,
  mun: string | null,
  numeroFila: Number,
  año: string,
  dEtnia: DatosEtnia
) => {
  let departamentoI = 0;

  if (dep) {
    const { codigo } = extraerNombreCodigo(dep);
    departamentoI = agregadoDepartamental.findIndex((d: DepartamentoProcesado) => d.codigo === codigo);
    const infoDepartamento = departamentos.datos.find((d) => d[0] === codigo);
    const nombre = infoDepartamento ? infoDepartamento[1] : null;

    if (departamentoI < 0) {
      agregadoDepartamental.push({
        codigo,
        nombre,
        datos: {},
        etnias: iniciarEtnias(),
        min: 0,
        max: 0,
      });
      departamentoI = agregadoDepartamental.length - 1;
    }
  } else {
    throw new Error(
      JSON.stringify({
        error: 'ERROR: Departamento',
        dep,
        fila: numeroFila,
      })
    );
  }

  let municipioI = 0;
  const datosDepartamento = agregadoDepartamental[departamentoI];

  if (mun) {
    const { codigo } = extraerNombreCodigo(mun);
    municipioI = agregadoMunicipal.findIndex((m: MunicipioProcesado) => m.codigo === codigo);
    const infoMunicipio = municipios.datos.find((d) => d[3] === codigo);
    const nombre = infoMunicipio ? infoMunicipio[1] : null;

    if (municipioI < 0) {
      agregadoMunicipal.push({
        codigo,
        nombre,
        datos: {},
        min: 0,
        max: 0,
      });
      municipioI = agregadoMunicipal.length - 1;
    }
  } else {
    console.error(numeroFila, mun);
    throw new Error('ERROR: Municipio');
  }

  const datosMunicipio = agregadoMunicipal[municipioI];

  if (!datosDepartamento.datos[año]) {
    datosDepartamento.datos[año] = [0, 0, 0];
  }
  if (dEtnia.codigo) {
    if (!datosDepartamento.etnias[dEtnia.codigo].datos[año]) {
      datosDepartamento.etnias[dEtnia.codigo].datos[año] = [0, 0, 0];
    }
  }

  if (!datosMunicipio.datos[año]) {
    datosMunicipio.datos[año] = [0, 0, 0];
  }

  const etniaDepartamento = dEtnia.codigo ? datosDepartamento.etnias[dEtnia.codigo].datos[año] : null;

  // País
  if (!agregadoNacional.datos[año]) {
    agregadoNacional.datos[año] = [0, 0, 0];
  }

  if (dEtnia.codigo) {
    if (!agregadoNacional.etnias[dEtnia.codigo].datos[año]) {
      agregadoNacional.etnias[dEtnia.codigo].datos[año] = [0, 0, 0];
    }
  }

  const etniaPais = dEtnia.codigo ? agregadoNacional.etnias[dEtnia.codigo].datos[año] : null;

  return {
    datosPais: agregadoNacional.datos[año],
    datosDepartamento: datosDepartamento.datos[año],
    datosMunicipio: datosMunicipio.datos[año],
    etniaDepartamento,
    etniaPais,
  };
};
