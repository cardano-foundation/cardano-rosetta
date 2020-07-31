/* eslint-disable no-console */
import { Pool } from 'pg';
import pino from 'pino';
import buildServer from './server';
import createPool from './db/connection';
import * as Repostories from './db/repositories';
import * as Services from './services/services';
const { PORT, BIND_ADDRESS, DB_CONNECTION_STRING, LOGGER_ENABLED, LOGGER_LEVEL }: NodeJS.ProcessEnv = process.env;

const configLogger = () =>
  pino({
    name: 'cardano-rosetta',
    level: LOGGER_LEVEL,
    enabled: LOGGER_ENABLED !== 'false'
  });

const start = async (databaseInstance: Pool) => {
  let server;
  try {
    const logger = configLogger();
    const repository = Repostories.configure(databaseInstance, logger);
    const services = Services.configure(repository, logger);
    server = buildServer(services, LOGGER_ENABLED === 'true');
    server.addHook('onClose', (fastify, done) => databaseInstance.end(done));
    // eslint-disable-next-line no-magic-numbers
    await server.listen(PORT || 3000, BIND_ADDRESS || '0.0.0.0');
    server.blipp();
  } catch (error) {
    console.log(error);
    server?.log.error(error);
    await databaseInstance?.end();
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  }
};

process.on('uncaughtException', error => {
  console.error(error);
});
process.on('unhandledRejection', error => {
  console.error(error);
});

const connectDB = async () => await createPool(DB_CONNECTION_STRING);

connectDB()
  .then(databaseInstance => start(databaseInstance))
  .catch(console.error);
