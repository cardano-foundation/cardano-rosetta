import { FastifyInstance } from 'fastify';
import fs from 'fs';
import { mod, findBy } from 'shades';
import path from 'path';
import StatusCodes from 'http-status-codes';
import PgConnectionString from 'pg-connection-string';
import * as Repositories from '../../../src/server/db/repositories';
import * as Services from '../../../src/server/services/services';
import createPool from '../../../src/server/db/connection';
import buildServer from '../../../src/server/server';
import { Pool } from 'pg';
import { CardanoCli } from '../../../src/server/utils/cardano/cli/cardanonode-cli';
import { CardanoNode } from '../../../src/server/utils/cardano/cli/cardano-node';
import { OperationType } from '../../../src/server/utils/constants';

const DEFAULT_PAGE_SIZE = 5;

/**
 * Setups a database connection that will fail if invoked.
 * This is useful to test offline methods
 */
export const setupOfflineDatabase = (): Pool => {
  const poolMock = new Pool();
  poolMock.query = jest.fn();
  return poolMock;
};

/**
 * This function setups the database connection to be used when testing.
 * If database is received, connection string value will be overridden.
 *
 * @param connectionString to connect to the db
 * @param database this value can be used to override connection string Database
 */
export const setupDatabase = (connectionString = process.env.DB_CONNECTION_STRING, database = 'mainnet'): Pool => {
  const { user, password, host, port } = PgConnectionString.parse(connectionString);
  return createPool(`postgresql://${user}:${password}@${host}:${port}/${database}`);
};

export const cardanoCliMock: CardanoCli = {
  submitTransaction: jest.fn()
};

export const cardanoNodeMock: CardanoNode = {
  getCardanoNodeVersion: async (): Promise<string> =>
    'cardano-node 1.18.0 - linux-x86_64 - ghc-8.6\ngit rev 36ad7b90bfbde8afd41b68ed9b928df3fcab0dbc'
};

export const minKeyDeposit = 2000000;
export const poolDeposit = 500000000;

export const linearFeeParameters = { minFeeA: 44, minFeeB: 155381 };
const NETWORK_ID = 'mainnet';

export const setupServer = (database: Pool, disableSearchApi = false): FastifyInstance => {
  // let repositories;
  const repositories = Repositories.configure(database);
  const services = Services.configure(
    repositories,
    NETWORK_ID,
    // eslint-disable-next-line no-magic-numbers
    1097911063,
    JSON.parse(fs.readFileSync(path.resolve(process.env.TOPOLOGY_FILE_PATH)).toString()),
    Number(process.env.DEFAULT_RELATIVE_TTL),
    {
      keyDeposit: process.env.DEFAULT_KEY_DEPOSIT as string,
      poolDeposit: process.env.DEFAULT_POOL_DEPOSIT as string
    }
  );
  return buildServer(services, cardanoCliMock, cardanoNodeMock, process.env.LOGGER_LEVEL, {
    networkId: NETWORK_ID,
    pageSize: Number(process.env.PAGE_SIZE) || DEFAULT_PAGE_SIZE,
    mock: true,
    disableSearchApi
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
      payload: generateRequest('cardano', 'preprod')
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4002,
      message: 'Network not found',
      retriable: false
    });
  });
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const modifyMAOperation = (policyId?: string, symbol?: string) =>
  mod(
    1,
    'metadata',
    'tokenBundle',
    0
  )((tokenBundleItem: Components.Schemas.TokenBundleItem) => ({
    ...tokenBundleItem,
    policyId: policyId ?? tokenBundleItem.policyId,
    tokens: mod(0, 'currency', 'symbol')((v: string) => symbol || v)(tokenBundleItem.tokens)
  }));

export const modifyCoinChange = (
  payload: Components.Schemas.ConstructionPayloadsRequest,
  coinChange?: Components.Schemas.CoinChange
): Components.Schemas.ConstructionPayloadsRequest =>
  mod(
    'operations',
    findBy((operation: Components.Schemas.Operation) => operation && operation.type === OperationType.INPUT),
    'coin_change'
  )(() => coinChange)(payload);

export const modifyPoolKeyHash = (
  payload: Components.Schemas.ConstructionPayloadsRequest,
  operationType: OperationType,
  poolKeyHash?: string
): Components.Schemas.ConstructionPayloadsRequest =>
  mod(
    'operations',
    findBy((operation: Components.Schemas.Operation) => operation && operation.type === operationType),
    'metadata'
  )(metadata => {
    const toReturn = metadata ?? {};
    // eslint-disable-next-line camelcase
    toReturn.pool_key_hash = poolKeyHash;
    return toReturn;
  })(payload);

export const modfyPoolParameters = (
  payload: Components.Schemas.ConstructionPayloadsRequest,
  poolParameters: Components.Schemas.PoolRegistrationParams
): Components.Schemas.ConstructionPayloadsRequest =>
  mod(
    'operations',
    findBy(
      (operation: Components.Schemas.Operation) => operation && operation.type === OperationType.POOL_REGISTRATION
    ),
    'metadata'
  )(metadata => {
    const toReturn = metadata ?? {};
    // eslint-disable-next-line camelcase
    toReturn.poolRegistrationParams = poolParameters;
    return toReturn;
  })(payload);

export const modifyAccount = (
  payload: Components.Schemas.ConstructionPayloadsRequest,
  accountIdentifier: Components.Schemas.AccountIdentifier,
  operationType: OperationType
): Components.Schemas.ConstructionPayloadsRequest =>
  mod(
    'operations',
    findBy((operation: Components.Schemas.Operation) => operation && operation.type === operationType),
    'account'
  )(() => accountIdentifier)(payload);
