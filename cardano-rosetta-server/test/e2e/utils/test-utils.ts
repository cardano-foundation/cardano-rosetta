import { FastifyInstance } from 'fastify';
import fs from 'fs';
import path from 'path';
import StatusCodes from 'http-status-codes';
import * as Repositories from '../../../src/server/db/repositories';
import * as Services from '../../../src/server/services/services';
import createPool from '../../../src/server/db/connection';
import buildServer from '../../../src/server/server';
import { Pool } from 'pg';
import { CardanoCli } from '../../../src/server/utils/cardano/cli/cardanonode-cli';
import { CardanoNode } from '../../../src/server/utils/cardano/cli/cardano-node';

const DEFAULT_PAGE_SIZE = 5;

export const setupDatabase = (offline: boolean): Pool => {
  if (offline) {
    const poolMock = new Pool();
    poolMock.query = jest.fn();
    return poolMock;
  }
  return createPool(process.env.DB_CONNECTION_STRING);
};

export const cardanoCliMock: CardanoCli = {
  submitTransaction: jest.fn()
};

export const cardanoNodeMock: CardanoNode = {
  getCardanoNodeVersion: async (): Promise<string> =>
    'cardano-node 1.18.0 - linux-x86_64 - ghc-8.6\ngit rev 36ad7b90bfbde8afd41b68ed9b928df3fcab0dbc'
};

export const linearFeeParameters = { minFeeA: 44, minFeeB: 155381 };

const NETWORK_ID = 'mainnet';
export const minKeyDeposit = 2000000;

export const setupServer = (database: Pool): FastifyInstance => {
  // let repositories;
  const repositories = Repositories.configure(database);
  const services = Services.configure(
    repositories,
    NETWORK_ID,
    // eslint-disable-next-line no-magic-numbers
    1097911063,
    JSON.parse(fs.readFileSync(path.resolve(process.env.TOPOLOGY_FILE_PATH)).toString()),
    Number(process.env.DEFAULT_RELATIVE_TTL),
    linearFeeParameters,
    minKeyDeposit
  );
  return buildServer(services, cardanoCliMock, cardanoNodeMock, process.env.LOGGER_LEVEL, {
    networkId: NETWORK_ID,
    pageSize: Number(process.env.PAGE_SIZE) || DEFAULT_PAGE_SIZE
  });
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
