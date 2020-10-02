/* eslint-disable camelcase */
import StatusCodes from 'http-status-codes';
import { setupDatabase, setupServer, testInvalidNetworkParameters } from '../utils/test-utils';
import { Pool } from 'pg';
import { FastifyInstance } from 'fastify';
import { CONSTRUCTION_PAYLOADS_REQUEST, TRANSACTION_SIZE_IN_BYTES } from '../fixture-data';

const CONSTRUCTION_PREPROCESS_ENDPOINT = '/construction/preprocess';

const generateProcessPayload = (blockchain: string, network: string, relativeTtl?: number) => ({
  network_identifier: {
    blockchain,
    network
  },
  operations: CONSTRUCTION_PAYLOADS_REQUEST.operations,
  metadata: relativeTtl
    ? {
        relative_ttl: relativeTtl
      }
    : undefined
});

describe(CONSTRUCTION_PREPROCESS_ENDPOINT, () => {
  let database: Pool;
  let server: FastifyInstance;

  beforeAll(async () => {
    database = setupDatabase(true);
    server = setupServer(database);
  });

  afterAll(async () => {
    await database.end();
  });

  testInvalidNetworkParameters(
    CONSTRUCTION_PREPROCESS_ENDPOINT,
    // eslint-disable-next-line no-magic-numbers
    (blockchain, network) => generateProcessPayload(blockchain, network, 100),
    () => server
  );

  test('Should return a valid TTL when the parameters are valid', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PREPROCESS_ENDPOINT,
      // eslint-disable-next-line no-magic-numbers
      payload: generateProcessPayload('cardano', 'mainnet', 100)
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      options: { relative_ttl: 100, transaction_size: TRANSACTION_SIZE_IN_BYTES }
    });
  });

  test('Should return a TTL when using default relateive ttl', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PREPROCESS_ENDPOINT,
      payload: generateProcessPayload('cardano', 'mainnet', undefined)
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({ options: { relative_ttl: 1000, transaction_size: TRANSACTION_SIZE_IN_BYTES } });
  });
});
