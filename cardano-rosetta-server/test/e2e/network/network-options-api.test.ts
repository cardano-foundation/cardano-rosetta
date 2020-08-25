/* eslint-disable camelcase */
import { Pool } from 'pg';
import { FastifyInstance } from 'fastify';
import StatusCodes from 'http-status-codes';
import { setupDatabase, setupServer, testInvalidNetworkParameters } from '../utils/test-utils';
import { CARDANO, MAINNET } from '../../../src/server/utils/constants';
import { generateNetworkPayload } from './common';
import packageJson from '../../../package.json';

const NETWORK_OPTIONS_ENDPOINT = '/network/options';

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
      message: 'Network not found',
      retriable: false
    },
    {
      code: 4003,
      message: 'Networks not found',
      retriable: false
    },
    {
      code: 4004,
      message: 'Invalid blockchain',
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
      code: 4013,
      message: 'Cant deserialize transaction input from transaction body',
      retriable: false
    },
    {
      code: 4014,
      message: 'Cant deserialize transaction output from transaction body',
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

const version = {
  rosetta_version: '1.4.1',
  node_version: '1.0.2',
  middleware_version: packageJson.version,
  metadata: {}
};

describe('/network/options endpoint', () => {
  let database: Pool;
  let server: FastifyInstance;
  beforeAll(async () => {
    database = setupDatabase(false);
    server = setupServer(database);
  });

  afterAll(async () => {
    await database.end();
  });

  test('if requested with proper payload it should properly return an object containing proper version information', async () => {
    const response = await server.inject({
      method: 'post',
      url: NETWORK_OPTIONS_ENDPOINT,
      payload: generateNetworkPayload(CARDANO, MAINNET)
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json().version).toEqual(version);
  });

  // nth: Do this test more granular to assert in a specific test errors array
  test('if requested with proper payload it should properly return an object containing proper allow information', async () => {
    const response = await server.inject({
      method: 'post',
      url: NETWORK_OPTIONS_ENDPOINT,
      payload: generateNetworkPayload(CARDANO, MAINNET)
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json().allow).toEqual(allow);
  });

  testInvalidNetworkParameters(
    NETWORK_OPTIONS_ENDPOINT,
    (blockchain, network) => generateNetworkPayload(blockchain, network),
    () => server
  );
});
