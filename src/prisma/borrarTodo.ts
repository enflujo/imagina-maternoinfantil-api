import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// The transaction runs synchronously so deleteUsers must run last.

async function borrar() {
  const borrarCasos = prisma.casos.deleteMany();
  const borrarEtnias = prisma.etnia.deleteMany();

  await prisma.$transaction([borrarCasos, borrarEtnias]);
}

borrar()
  .then(async () => {
    console.log('Todas las tablas se borraron.');
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
