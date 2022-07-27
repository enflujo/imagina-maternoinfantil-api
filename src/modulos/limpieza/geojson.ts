import { Position, FeatureCollection } from 'geojson';
import { guardarJSON, redondearDecimal } from '../../utilidades/ayudas';
// import municipiosGeoJson from '../../../datos/fuentes/MunicipiosVeredas1MB.json';
// import departamentosGeoJson from '../../../datos/fuentes/departamentosFuente.json';
import { departamentos as dDep, municipios as dMun } from '../../utilidades/lugaresColombia';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// const municipios = municipiosGeoJson as FeatureCollection<any>;
// const departamentos = departamentosGeoJson as FeatureCollection<any>;

/**
 * Reduce el tamaño final del GEOJSON al reducir los decimales
 *
 * @param geometria Geometría del GeoJSON
 * @returns Geometría con coordenadas reducidas
 */
function reducirGeometria(geometria: any) {
  if (geometria.type === 'Polygon' || geometria.type === 'MultiPolygon') {
    geometria.coordinates = geometria.coordinates.map((bloqueMulti: any) => {
      return bloqueMulti.map((poly: Position | Position[]) => {
        return poly.map((punto: number | Position) => {
          if (typeof punto === 'object') {
            // Es MultiPolygon, seguir al siguiente nivel.
            return punto.map((nodo: number) => redondearDecimal(nodo, 2, 5));
          }
          // Es Polygon, resolver desde este nivel.
          return redondearDecimal(punto, 2, 5);
        });
      });
    });
  }

  return geometria;
}

function limpiarGeojson() {
  try {
    const municipiosGeo = readFileSync(resolve(__dirname, '../../../datos/fuentes/MunicipiosVeredas1MB.json'), 'utf-8');
    const departamentosGeo = readFileSync(
      resolve(__dirname, '../../../datos/fuentes/departamentosFuente.json'),
      'utf-8'
    );
    const municipios: FeatureCollection = JSON.parse(municipiosGeo);
    const departamentos: FeatureCollection = JSON.parse(departamentosGeo);

    municipios.features = municipios.features.map((municipio) => {
      if (municipio.properties) {
        const codigo = municipio.properties.DPTOMPIO;
        const datosLugar = dMun.datos.find((lugar) => lugar[3] === codigo);
        const nombre = datosLugar ? datosLugar[1] : municipio.properties.MPIO_CNMBR;

        return {
          type: municipio.type,
          properties: {
            codigo,
            nombre,
            departamento: municipio.properties.DPTO_CCDGO,
          },
          geometry: reducirGeometria(municipio.geometry),
        };
      }
      return municipio;
    });

    departamentos.features = departamentos.features.map((departamento) => {
      if (departamento.properties) {
        const codigo = departamento.properties.DPTO;
        const datosLugar = dDep.datos.find((lugar) => lugar[0] === codigo);
        const nombre = datosLugar ? datosLugar[1] : departamento.properties.NOMBRE_DPT;

        return {
          type: departamento.type,
          properties: {
            codigo,
            nombre,
          },
          geometry: reducirGeometria(departamento.geometry),
        };
      }
      return departamento;
    });

    return { departamentos, municipios };
  } catch (error) {
    console.error(error);
  }

  return;
}

export default () => {
  const datos = limpiarGeojson();
  if (datos) {
    guardarJSON(datos.municipios, 'municipios');
    guardarJSON(datos.departamentos, 'departamentos');
  }

  // return { municipios, departamentos };
};
