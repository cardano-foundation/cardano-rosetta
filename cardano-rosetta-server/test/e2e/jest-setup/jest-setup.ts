import dotenv from 'dotenv';
import path from 'path';
import { parse } from 'pg-connection-string';
import { setupPostgresContainer } from './docker';

dotenv.config({ path: path.join(__dirname, '../../../.env.test') });

module.exports = async () => {
  const { user, password, port } = parse(process.env.DB_CONNECTION_STRING);
  await setupPostgresContainer(
    user ? user : 'postgres',
    password ? password : 'mysecretpassword',
    port ? port : '5432'
  );
};
