/* eslint-disable camelcase */
/* eslint-disable no-magic-numbers */
import { FastifyInstance } from 'fastify';
import StatusCodes from 'http-status-codes';
import { Pool } from 'pg';
import { setupDatabase, setupServer } from './utils/test-utils';

const generatePayload = () => ({
  // eslint-disable-next-line camelcase
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  }
});

const cardanoMainnet = { network_identifiers: [{ network: 'mainnet', blockchain: 'cardano' }] };
const version = {
  rosetta_version: '1.4.0',
  node_version: '1.0.2',
  middleware_version: '0.0.1',
  metadata: {}
};
const allow = {
  operation_statuses: [
    {
      status: 'success',
      successful: true
    }
  ],
  operation_types: ['transfer'],
  errors: [
    {
      code: 0,
      message: 'string',
      retriable: true
    }
  ],
  historical_balance_lookup: true
};

describe('/network/list endpoint', () => {
  let database: Pool;
  let server: FastifyInstance;
  beforeAll(async () => {
    database = setupDatabase();
    server = setupServer(database);
  });

  afterAll(async () => {
    await database.end();
  });

  test('if requested with an empty request body it should properly return an array of one element equal to cardano mainnet', async () => {
    const response = await server.inject({
      method: 'post',
      url: '/network/list',
      payload: {}
    });
    
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual(cardanoMainnet);
  });
});

describe('/network/options endpoint', () => {
  let database: Pool;
  let server: FastifyInstance;
  beforeAll(async () => {
    database = setupDatabase();
    server = setupServer(database);
  });

  test('if requested without params it should properly return an object containing proper version information', async () => {
    const response = await server.inject({
      method: 'post',
      url: '/network/options',
      payload: generatePayload()
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json().version).toEqual(version);
  });

  // nth: Do this test more granular to assert in a specific test errors array
  test('if requested without params it should properly return an object containing proper allow information', async () => {
    const response = await server.inject({
      method: 'post',
      url: '/network/options',
      payload: generatePayload()
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json().allow).toEqual(allow);
  });
});
