import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

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

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
