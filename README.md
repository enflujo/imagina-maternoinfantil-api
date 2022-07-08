# API para proyecto de salud maternoinfantil

## Arreglos manuales

### mortalidad neonatal temprana

- Borramos las siguientes filas, ya que tiene fin e inicio de tablas (Total General y de nuevo los encabezados de fila 1). Seguramente no se borraron al aplanar:
  - 25992 a 25994
  - 51303 a 51306
  - 76868 a 76871
  - 102783 a 102786
  - 128868 a 128871

## Modelado

```mermaid
classDiagram
  class Indicador {
    string nombre
  }
  class Instancia {
    string indicador
    int numerador
    int denominador
    float porcentaje
    int año: 2015-2020
    string sexo: masculino, femenino, indeterminado, null
  }

  class Municipios {
    int codigo
    string nombre
    --------------------------
    _total: 1103
  }

  class Departamentos {
    int codigo
    string nombre
    --------------------------
    _total: 32
  }

  class Etnias {
    int codigo
    string nombre
    --------------------------
    1 - Indígena
    2 - ROM - Gitano
    3 - Raizal - San Andrés y Providencia
    4 - Palenquero de San Basilio
    5 - Negro, Mulato, Afrocolombiano o afrodescendiente
    6 - Otras etnias
    No Reportado
  }

  class TipoRégimen {
    string codigo
    string nombre
    --------------------------
    C - Contributivo
    S - Subsidiado
    P - Especial
    E - Excepción
    ND - No definido
    NR - No reportado
    null
  }

  class Caracterizaciones {
    int edadInicial
    int edadFinal
    --------------------------
    Menor de 1 año
    De 1 a 4 años
    De 10 a 11 años
    De 12 a 13 años
    De 14 años
    De 15 a 18 años
    De 19 años
    De 20 a 24 años
    De 25 a 26 años
    De 27 a 29 años
    De 30 a 34 años
    De 35 a 39 años
    De 40 a 44 años
    De 45 a 49 años
    De 50 a 54 años
    De 55 a 59 años
    No Reportado
    null
  }
  Indicador --> "muchos" Instancia : Contiene
  Indicador --> "1" Municipios : Contiene
  Departamentos --> "muchos" Municipios : Contiene
  Instancia --> "1" Municipios : Contiene
  Instancia --> "1" Etnias : Contiene
  Instancia --> "1" TipoRégimen : Contiene
  Instancia --> "1" Caracterizaciones : Contiene
```

## PGAdmin

Arreglar permiso de volumen:

```bash
sudo chown -R 5050:5050 ./pgadmin
```

### Tablas en el Excel

```js
[
  'NACIDOS VIVOS BAJO PESO',
  'NACIDOS VIVOS 4 CONS PRENATAL',
  'PROMEDIO CONTROLES PRENATALES',
  'NACIDOS VIVOS <15 PAPA 4',
  'PARTOS INSTITUCIONALES',
  'PARTOS POR CESAREA',
  'NACIDOS DE <14 AÑOS',
  'PROP NACIDOS DE MUJ 14 A 17',
  'RAZON MORT MATERNA 1 AÑO',
  'FECUNDIDAD 10 A 14 AÑOS',
  'FECUNDIDAD 10 A 19 AÑOS',
  'FECUNDIDAD 15 A 19 AÑOS',
  'MORTALIDAD EN LA NIÑEZ',
  'MORTALIDAD EN < 1 AÑO',
  'MORTALIDAD < 5EDA',
  'MORTALIDAD < 5IRA',
  'MORTALIDAD PERINATAL',
  'MORTALIDAD DESNUTRICI< 5',
];
```

### Recomendaciones

En Linux, abrir datos con Gnumeric.
