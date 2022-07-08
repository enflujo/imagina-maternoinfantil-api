import { Client } from 'pg';
import { parametrosBd } from '../utilidades/constantes';

const cliente = new Client(parametrosBd);

const tablas = `
CREATE TABLE IF NOT EXISTS prueba (
  username varchar(45) NOT NULL,
  password varchar(450) NOT NULL,
  enabled integer NOT NULL DEFAULT '1',
  PRIMARY KEY (username)
)
`;

async function crearEstructura() {
  try {
    cliente.connect();
    await cliente.query(tablas);
    console.log('Tabla creada');
  } catch (err) {
    console.log(err);
  } finally {
    cliente.end();
    console.log('Fin');
  }
}

export { crearEstructura };
