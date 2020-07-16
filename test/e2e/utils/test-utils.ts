import { FastifyInstance } from 'fastify';
import * as Repositories from '../../../src/server/db/repositories';
import * as Services from '../../../src/server/services/services';
import createPool from '../../../src/server/db/connection';
import buildServer from '../../../src/server/server';
import { Pool } from 'pg';

export const setupDatabase = (): Pool => createPool(process.env.DB_CONNECTION_STRING);

export const setupServer = (database: Pool): FastifyInstance => {
  const repositories = Repositories.configure(database);
  const services = Services.configure(repositories);
  return buildServer(services, process.env.LOGGER_ENABLED === 'true');
};
