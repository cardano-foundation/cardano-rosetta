/* eslint-disable camelcase */
/* eslint-disable no-magic-numbers */
import { FastifyInstance } from 'fastify';
import StatusCodes from 'http-status-codes';
import { Pool } from 'pg';
import { setupDatabase, setupServer } from './utils/test-utils';

const CARDANO = 'cardano';
const MAINNET = 'mainnet';
const NETWORK_OPTIONS_ENDPOINT = '/network/options';
const NETWORK_STATUS_ENDPOINT = '/network/status';

const generatePayload = (blockchain: string, network: string) => ({
  // eslint-disable-next-line camelcase
  network_identifier: {
    blockchain,
    network
  }
});

const cardanoMainnet = { network_identifiers: [{ network: MAINNET, blockchain: CARDANO }] };
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
      code: 400,
      message: 'Block not found',
      retriable: false
    },
    {
      code: 400,
      message: 'Network not found',
      retriable: false
    },
    {
      code: 400,
      message: 'Invalid blockchain',
      retriable: false
    },
    {
      code: 400,
      message: 'Networks not found',
      retriable: false
    },
    {
      code: 501,
      message: 'Not implemented',
      retriable: false
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

  afterAll(async () => {
    await database.end();
  });

  test('if requested with proper payload it should properly return an object containing proper version information', async () => {
    const response = await server.inject({
      method: 'post',
      url: NETWORK_OPTIONS_ENDPOINT,
      payload: generatePayload(CARDANO, MAINNET)
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json().version).toEqual(version);
  });

  // nth: Do this test more granular to assert in a specific test errors array
  test('if requested with proper payload it should properly return an object containing proper allow information', async () => {
    const response = await server.inject({
      method: 'post',
      url: NETWORK_OPTIONS_ENDPOINT,
      payload: generatePayload(CARDANO, MAINNET)
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json().allow).toEqual(allow);
  });

  test('If requested with invalid networkName, it should throw an error', async () => {
    const response = await server.inject({
      method: 'post',
      url: NETWORK_OPTIONS_ENDPOINT,
      payload: generatePayload(CARDANO, 'testnet')
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({ code: StatusCodes.BAD_REQUEST, message: 'Network not found', retriable: false });
  });

  test('If requested with invalid blockchain, it should throw an error', async () => {
    const response = await server.inject({
      method: 'post',
      url: NETWORK_OPTIONS_ENDPOINT,
      payload: generatePayload('bitcoin', MAINNET)
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: StatusCodes.BAD_REQUEST,
      message: 'Invalid blockchain',
      retriable: false
    });
  });
});

describe('/network/status endpoint', () => {
  let database: Pool;
  let server: FastifyInstance;
  beforeAll(async () => {
    database = setupDatabase();
    server = setupServer(database);
  });

  afterAll(async () => {
    await database.end();
  });

  test('If requested with valid payload, it should properly return an object containing proper latestBlock information', async () => {
    const response = await server.inject({
      method: 'post',
      url: NETWORK_STATUS_ENDPOINT,
      payload: generatePayload(CARDANO, MAINNET)
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    //assert latestBlock here
  });

  test('If requested with valid payload, it should properly return an object containing proper latestGenesis information', async () => {
    const response = await server.inject({
      method: 'post',
      url: NETWORK_STATUS_ENDPOINT,
      payload: generatePayload(CARDANO, MAINNET)
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    const genesis_block_identifier = {};
    //asser genesis block here
  });

  test('If requested with invalid blockchain, it should properly throw an error', async () => {
    const response = await server.inject({
      method: 'post',
      url: NETWORK_STATUS_ENDPOINT,
      payload: generatePayload('bitcoin', MAINNET)
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: StatusCodes.BAD_REQUEST,
      message: 'Invalid blockchain',
      retriable: false
    });
  });

  test('If requested with invalid networkName, it should properly throw an error', async () => {
    const response = await server.inject({
      method: 'post',
      url: NETWORK_STATUS_ENDPOINT,
      payload: generatePayload(CARDANO, 'testnet')
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: StatusCodes.BAD_REQUEST,
      message: 'Network not found',
      retriable: false
    });
  });
});
