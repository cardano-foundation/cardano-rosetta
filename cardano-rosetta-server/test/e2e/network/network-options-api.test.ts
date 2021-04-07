/* eslint-disable camelcase */
import { FastifyInstance } from 'fastify';
import StatusCodes from 'http-status-codes';
import { Pool } from 'pg';
import packageJson from '../../../package.json';
import { CARDANO, MAINNET, OPERATION_TYPES } from '../../../src/server/utils/constants';
import { setupDatabase, setupServer, testInvalidNetworkParameters } from '../utils/test-utils';
import { generateNetworkPayload } from './common';

const NETWORK_OPTIONS_ENDPOINT = '/network/options';

const allow = {
  operation_statuses: [
    {
      status: 'success',
      successful: true
    }
  ],
  operation_types: OPERATION_TYPES,
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
      code: 4015,
      message: 'Provided address is invalid',
      retriable: true
    },
    {
      code: 4016,
      message: 'Provided address type is invalid',
      retriable: true
    },
    { code: 4017, message: 'Invalid staking key format', retriable: false },
    { code: 4018, message: 'Staking key is required for this type of address', retriable: false },
    {
      code: 4019,
      message: 'Provided operation type is invalid',
      retriable: true
    },
    {
      code: 4020,
      message: 'Pool key hash is required for stake delegation',
      retriable: false
    },
    {
      code: 4021,
      message: 'Provided pool key hash has invalid format',
      retriable: false
    },
    {
      code: 4022,
      message: 'Assets are required for output operation token bundle',
      retriable: false
    },
    {
      code: 4023,
      message: 'Asset value is required for token asset',
      retriable: false
    },
    {
      code: 5000,
      message: 'An error occurred',
      retriable: true
    },
    {
      code: 5001,
      message: 'Not implemented',
      retriable: false
    },
    { code: 5002, message: 'Address generation error', retriable: false },
    { code: 5003, message: 'Parse signed transaction error', retriable: false },
    {
      code: 5004,
      message: 'Cant create signed transaction probably because of unsigned transaction bytes',
      retriable: false
    },
    {
      code: 5005,
      message: 'Cant build witnesses set for transaction probably because of provided signatures',
      retriable: false
    },
    {
      code: 5006,
      message: 'Error when sending the transaction',
      retriable: true
    }
  ],
  historical_balance_lookup: true
};

const version = {
  rosetta_version: '1.4.4',
  node_version: 'cardano-node 1.18.0 - linux-x86_64 - ghc-8.6\ngit rev 36ad7b90bfbde8afd41b68ed9b928df3fcab0dbc',
  middleware_version: packageJson.version,
  metadata: {}
};

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

  // eslint-disable-next-line max-len
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
  // eslint-disable-next-line max-len
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
