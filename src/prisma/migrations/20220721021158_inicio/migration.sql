-- CreateTable
CREATE TABLE "Regimen" (
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Regimen_pkey" PRIMARY KEY ("codigo")
);

-- CreateTable
CREATE TABLE "Etnia" (
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Etnia_pkey" PRIMARY KEY ("codigo")
);

-- CreateTable
CREATE TABLE "Caracterizacion" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Caracterizacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Casos" (
    "id" SERIAL NOT NULL,
    "anno" INTEGER NOT NULL,
    "departamentoCodigo" TEXT NOT NULL,
    "municipioCodigo" TEXT NOT NULL,
    "etniaCodigo" TEXT NOT NULL,
    "regimenCodigo" TEXT NOT NULL,
    "sexo" TEXT NOT NULL,
    "caracterizacionId" INTEGER NOT NULL,
    "numerador" INTEGER NOT NULL,
    "denominador" INTEGER NOT NULL,
    "porcentaje" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Casos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Regimen_codigo_key" ON "Regimen"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Regimen_nombre_key" ON "Regimen"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Etnia_codigo_key" ON "Etnia"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Etnia_nombre_key" ON "Etnia"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Caracterizacion_nombre_key" ON "Caracterizacion"("nombre");

-- AddForeignKey
ALTER TABLE "Casos" ADD CONSTRAINT "Casos_etniaCodigo_fkey" FOREIGN KEY ("etniaCodigo") REFERENCES "Etnia"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Casos" ADD CONSTRAINT "Casos_regimenCodigo_fkey" FOREIGN KEY ("regimenCodigo") REFERENCES "Regimen"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Casos" ADD CONSTRAINT "Casos_caracterizacionId_fkey" FOREIGN KEY ("caracterizacionId") REFERENCES "Caracterizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
