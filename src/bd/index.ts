import fp from 'fastify-plugin';

import { Pool, QueryConfig } from 'pg';

const pool = new Pool({
  database: process.env.BD_NOMBRE,
  user: process.env.BD_USUARIO,
  password: process.env.BD_CLAVE,
  port: 5432,
});

export default {
  consulta: (texto: string | QueryConfig, valores: string[]) => pool.query(texto, valores),
};
