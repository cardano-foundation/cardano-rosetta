import { FastifyInstance } from 'fastify';
import pino, { Logger } from 'pino';
import StatusCodes from 'http-status-codes';
import * as Repositories from '../../../src/server/db/repositories';
import * as Services from '../../../src/server/services/services';
import createPool from '../../../src/server/db/connection';
import buildServer from '../../../src/server/server';
import { Pool } from 'pg';
import { CardanoCli } from '../../../src/server/utils/cardanonode-cli';

export const setupDatabase = (offline: boolean): Pool => {
  if (offline) {
    const poolMock = new Pool();
    poolMock.query = jest.fn();
    return poolMock;
  }
  return createPool(process.env.DB_CONNECTION_STRING);
};

const configLogger = (): Logger =>
  pino({
    enabled: false
  });

export const cardanoCliMock: CardanoCli = {
  submitTransaction: jest.fn()
};

export const setupServer = (database: Pool): FastifyInstance => {
  const logger = configLogger();
  // let repositories;
  const repositories = Repositories.configure(database, logger);
  const services = Services.configure(repositories, logger);
  return buildServer(services, cardanoCliMock, 'mainnet', process.env.LOGGER_LEVEL);
};

export const testInvalidNetworkParameters = (
  endpoint: string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  generateRequest: (network: string, blockchain: string) => object,
  server: () => FastifyInstance
): void => {
  test('Should throw invalid blockchain error when the blockchain specified is invalid', async () => {
    const response = await server().inject({
      method: 'post',
      url: endpoint,
      payload: generateRequest('bitcoin', 'mainnet')
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4004,
      message: 'Invalid blockchain',
      retriable: false
    });
  });

  test('Should throw invalid network error when the network specified is invalid', async () => {
    const response = await server().inject({
      method: 'post',
      url: endpoint,
      payload: generateRequest('cardano', 'testnet')
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4002,
      message: 'Network not found',
      retriable: false
    });
  });
};
