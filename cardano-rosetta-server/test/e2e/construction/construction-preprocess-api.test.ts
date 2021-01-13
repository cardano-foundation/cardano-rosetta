/* eslint-disable camelcase */
import StatusCodes from 'http-status-codes';
import { setupOfflineDatabase, setupServer, testInvalidNetworkParameters } from '../utils/test-utils';
import { Pool } from 'pg';
import { FastifyInstance } from 'fastify';
import {
  CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_REGISTRATION,
  CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_DEREGISTRATION,
  CONSTRUCTION_PAYLOADS_WITH_STAKE_DELEGATION,
  CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_REGISTRATION_AND_STAKE_DELEGATION,
  CONSTRUCTION_PAYLOADS_WITH_WITHDRAWAL,
  CONSTRUCTION_PAYLOADS_WITH_TWO_WITHDRAWALS,
  CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_REGISTRATION_AND_WITHDRAWAL,
  CONSTRUCTION_PAYLOADS_REQUEST,
  TRANSACTION_SIZE_IN_BYTES,
  TX_WITH_STAKE_KEY_REGISTRATION_SIZE_IN_BYTES,
  TX_WITH_STAKE_KEY_DEREGISTRATION_SIZE_IN_BYTES,
  TX_WITH_STAKE_DELEGATION_SIZE_IN_BYTES,
  TX_WITH_STAKE_KEY_REGISTRATION_AND_STAKE_DELEGATION_SIZE_IN_BYTES,
  TX_WITH_WITHDRAWAL_SIZE_IN_BYTES,
  TX_WITH_TWO_WITHDRAWALS_SIZE_IN_BYTES,
  TX_WITH_STAKE_KEY_REGISTRATION_AND_WITHDRAWAL_SIZE_IN_BYTES
} from '../fixture-data';

const CONSTRUCTION_PREPROCESS_ENDPOINT = '/construction/preprocess';

type ProcessPayloadType = {
  blockchain?: string;
  network?: string;
  operations?: Components.Schemas.Operation[];
  relativeTtl?: number;
};

const generateProcessPayload = ({
  blockchain = 'cardano',
  network = 'mainnet',
  operations = CONSTRUCTION_PAYLOADS_REQUEST.operations,
  relativeTtl
}: ProcessPayloadType) => ({
  network_identifier: {
    blockchain,
    network
  },
  operations,
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
    database = setupOfflineDatabase();
    server = setupServer(database);
  });

  afterAll(async () => {
    await database.end();
  });

  testInvalidNetworkParameters(
    CONSTRUCTION_PREPROCESS_ENDPOINT,
    // eslint-disable-next-line no-magic-numbers
    (blockchain, network) => generateProcessPayload({ blockchain, network, relativeTtl: 100 }),
    () => server
  );

  test('Should return a valid TTL when the parameters are valid', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PREPROCESS_ENDPOINT,
      // eslint-disable-next-line no-magic-numbers
      payload: generateProcessPayload({ blockchain: 'cardano', network: 'mainnet', relativeTtl: 100 })
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      options: { relative_ttl: 100, transaction_size: TRANSACTION_SIZE_IN_BYTES }
    });
  });

  test('Should return a valid TTL when the operations include stake key registration', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PREPROCESS_ENDPOINT,
      // eslint-disable-next-line no-magic-numbers
      payload: generateProcessPayload({
        blockchain: 'cardano',
        network: 'mainnet',
        operations: CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_REGISTRATION.operations,
        relativeTtl: 100
      })
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      options: { relative_ttl: 100, transaction_size: TX_WITH_STAKE_KEY_REGISTRATION_SIZE_IN_BYTES }
    });
  });

  test('Should return a valid TTL when the operations include stake key deregistration', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PREPROCESS_ENDPOINT,
      // eslint-disable-next-line no-magic-numbers
      payload: generateProcessPayload({
        blockchain: 'cardano',
        network: 'mainnet',
        operations: CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_DEREGISTRATION.operations,
        relativeTtl: 100
      })
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      options: { relative_ttl: 100, transaction_size: TX_WITH_STAKE_KEY_DEREGISTRATION_SIZE_IN_BYTES }
    });
  });

  test('Should return a valid TTL when the operations include stake delegation', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PREPROCESS_ENDPOINT,
      // eslint-disable-next-line no-magic-numbers
      payload: generateProcessPayload({
        blockchain: 'cardano',
        network: 'mainnet',
        operations: CONSTRUCTION_PAYLOADS_WITH_STAKE_DELEGATION.operations,
        relativeTtl: 100
      })
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      options: { relative_ttl: 100, transaction_size: TX_WITH_STAKE_DELEGATION_SIZE_IN_BYTES }
    });
  });

  // eslint-disable-next-line max-len
  test('Should return a valid TTL when the operations include stake key registration and stake delegation', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PREPROCESS_ENDPOINT,
      // eslint-disable-next-line no-magic-numbers
      payload: generateProcessPayload({
        blockchain: 'cardano',
        network: 'mainnet',
        operations: CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_REGISTRATION_AND_STAKE_DELEGATION.operations,
        relativeTtl: 100
      })
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      options: {
        relative_ttl: 100,
        transaction_size: TX_WITH_STAKE_KEY_REGISTRATION_AND_STAKE_DELEGATION_SIZE_IN_BYTES
      }
    });
  });

  test('Should return a valid TTL when the operations include withdrawal', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PREPROCESS_ENDPOINT,
      // eslint-disable-next-line no-magic-numbers
      payload: generateProcessPayload({
        blockchain: 'cardano',
        network: 'mainnet',
        operations: CONSTRUCTION_PAYLOADS_WITH_WITHDRAWAL.operations,
        relativeTtl: 100
      })
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      options: { relative_ttl: 100, transaction_size: TX_WITH_WITHDRAWAL_SIZE_IN_BYTES }
    });
  });

  test('Should return a valid TTL when the operations include two withdrawals', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PREPROCESS_ENDPOINT,
      // eslint-disable-next-line no-magic-numbers
      payload: generateProcessPayload({
        blockchain: 'cardano',
        network: 'mainnet',
        operations: CONSTRUCTION_PAYLOADS_WITH_TWO_WITHDRAWALS.operations,
        relativeTtl: 100
      })
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      options: { relative_ttl: 100, transaction_size: TX_WITH_TWO_WITHDRAWALS_SIZE_IN_BYTES }
    });
  });

  test('Should return a valid TTL when the operations include withdrawal and stake key registration', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PREPROCESS_ENDPOINT,
      // eslint-disable-next-line no-magic-numbers
      payload: generateProcessPayload({
        blockchain: 'cardano',
        network: 'mainnet',
        operations: CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_REGISTRATION_AND_WITHDRAWAL.operations,
        relativeTtl: 100
      })
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      options: { relative_ttl: 100, transaction_size: TX_WITH_STAKE_KEY_REGISTRATION_AND_WITHDRAWAL_SIZE_IN_BYTES }
    });
  });

  test('Should return a TTL when using default relateive ttl', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PREPROCESS_ENDPOINT,
      payload: generateProcessPayload({ blockchain: 'cardano', network: 'mainnet' })
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({ options: { relative_ttl: 1000, transaction_size: TRANSACTION_SIZE_IN_BYTES } });
  });
});
