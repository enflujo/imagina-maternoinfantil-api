import 'dotenv/config';
import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { cadena, logAviso, logCyan } from './utilidades/constantes';
// import bd from './bd';
import { crearEstructura } from './bd/cliente';
import limpieza from './rutas/limpieza';
import rips from './rutas/rips';

const servidor: FastifyInstance = fastify();
const PUERTO = process.env.API_PUERTO ? +process.env.API_PUERTO : 8080;

servidor.register(cors);
servidor.register(limpieza);
servidor.register(rips);

servidor.listen({ port: PUERTO }, (err) => {
  if (err) {
    servidor.log.error(err);
    throw err;
  }

  console.log(`${cadena} ${logCyan('Servidor disponible en:')} ${logAviso.underline(`http://localhost:${PUERTO}`)}`);
});
