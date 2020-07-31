import { FastifyInstance } from 'fastify';
import pino, { Logger } from 'pino';
import * as Repositories from '../../../src/server/db/repositories';
import * as Services from '../../../src/server/services/services';
import createPool from '../../../src/server/db/connection';
import buildServer from '../../../src/server/server';
import { Pool } from 'pg';

export const setupDatabase = (): Pool => createPool(process.env.DB_CONNECTION_STRING);

const configLogger = (): Logger =>
  pino({
    enabled: false
  });

export const setupServer = (database: Pool): FastifyInstance => {
  const logger = configLogger();
  const repositories = Repositories.configure(database, logger);
  const services = Services.configure(repositories, logger);
  return buildServer(services, process.env.LOGGER_ENABLED === 'true');
};
