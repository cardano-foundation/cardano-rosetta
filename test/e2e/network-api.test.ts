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

const NETWORK_NOT_FOUND = 'Network not found';
const INVALID_BLOCKCHAIN = 'Invalid blockchain';
const genesis_block_identifier = {
  hash: '5f20df933584822601f9e3f8c024eb5eb252fe8cefb24d1317dc3d432e940ebb',
  index: 0 // FIXME this is not ok
};
const last_block_identifier = {
  hash: '94049f0e34aee1c5b0b492a57acd054885251e802401f72687a1e79fa1a6e252',
  index: 65168
};

const cardanoMainnet = { network_identifiers: [{ network: MAINNET, blockchain: CARDANO }] };
const version = {
  rosetta_version: '1.4.1',
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
      code: 4001,
      message: 'Block not found',
      retriable: false
    },
    {
      code: 4002,
      message: NETWORK_NOT_FOUND,
      retriable: false
    },
    {
      code: 4003,
      message: 'Networks not found',
      retriable: false
    },
    {
      code: 4004,
      message: INVALID_BLOCKCHAIN,
      retriable: false
    },
    {
      code: 4005,
      message: 'Genesis block not found',
      retriable: false
    },
    {
      code: 4006,
      message: 'Transaction not found',
      retriable: false
    },
    { code: 4007, message: 'Invalid public key format', retriable: false },
    { code: 4008, message: 'Transaction inputs parameters errors in operations array', retriable: false },
    { code: 4009, message: 'Transaction outputs parameters errors in operations array', retriable: false },
    { code: 4010, message: 'The transaction you are trying to build has more outputs than inputs', retriable: false },
    {
      message: 'Cant create signed transaction from transaction bytes',
      code: 4011,
      retriable: false
    },
    {
      message: 'Cant create unsigned transaction from transaction bytes',
      code: 4012,
      retriable: false
    },
    {
      code: 5001,
      message: 'Not implemented',
      retriable: false
    },
    {
      code: 5002,
      message: 'Topology file not found',
      retriable: false
    },
    { code: 5003, message: 'Page size config not found', retriable: false },
    { code: 5004, message: 'Address generation error', retriable: false },
    { code: 5005, message: 'Parse signed transaction error', retriable: false },
    {
      code: 5006,
      message: 'Cant create signed transaction probably because of unsigned transaction bytes',
      retriable: false
    },
    {
      code: 5007,
      message: 'Cant build witnesses set for transaction probably because of provided signatures',
      retriable: false
    },
    {
      code: 5008,
      message: 'Error when sending the transaction',
      retriable: true
    }
  ],
  historical_balance_lookup: true
};

const peers = [{ peer_id: 'relays-new.cardano-mainnet.iohk.io' }];

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
    expect(response.json()).toEqual({ code: 4002, message: NETWORK_NOT_FOUND, retriable: false });
  });

  test('If requested with invalid blockchain, it should throw an error', async () => {
    const response = await server.inject({
      method: 'post',
      url: NETWORK_OPTIONS_ENDPOINT,
      payload: generatePayload('bitcoin', MAINNET)
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4004,
      message: INVALID_BLOCKCHAIN,
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

  test('If requested with valid payload, it should properly return an object containing proper status information', async () => {
    const response = await server.inject({
      method: 'post',
      url: NETWORK_STATUS_ENDPOINT,
      payload: generatePayload(CARDANO, MAINNET)
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json().genesis_block_identifier).toEqual(genesis_block_identifier);
    expect(response.json().current_block_identifier).toEqual(last_block_identifier);
    expect(response.json().peers).toEqual(peers);
  });

  test('If requested with invalid blockchain, it should properly throw an error', async () => {
    const response = await server.inject({
      method: 'post',
      url: NETWORK_STATUS_ENDPOINT,
      payload: generatePayload('bitcoin', MAINNET)
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4004,
      message: INVALID_BLOCKCHAIN,
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
      code: 4002,
      message: NETWORK_NOT_FOUND,
      retriable: false
    });
  });
});
