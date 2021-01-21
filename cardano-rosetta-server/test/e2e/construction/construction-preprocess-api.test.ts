/* eslint-disable camelcase */
/* eslint-disable no-magic-numbers */
import StatusCodes from 'http-status-codes';
import { mod } from 'shades';
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
  SIGNED_TX_WITH_STAKE_KEY_REGISTRATION,
  SIGNED_TX_WITH_STAKE_KEY_DEREGISTRATION,
  TRANSACTION_SIZE_IN_BYTES,
  SIGNED_TX_WITH_STAKE_DELEGATION,
  SIGNED_TX_WITH_STAKE_KEY_REGISTRATION_AND_STAKE_DELEGATION,
  SIGNED_TX_WITH_WITHDRAWAL,
  SIGNED_TX_WITH_TWO_WITHDRAWALS,
  SIGNED_TX_WITH_STAKE_KEY_REGISTRATION_AND_WITHDRWAWAL,
  CONSTRUCTION_PAYLOADS_REQUEST_WITH_MA,
  SIGNED_TX_WITH_MA,
  CONSTRUCTION_COMBINE_PAYLOAD,
  CONSTRUCTION_PAYLOADS_REQUEST_WITH_MULTIPLE_MA,
  SIGNED_TX_WITH_MULTIPLE_MA
} from '../fixture-data';
import { ASSET_NAME_LENGTH, POLICY_ID_LENGTH } from '../../../src/server/utils/constants';

const CONSTRUCTION_PREPROCESS_ENDPOINT = '/construction/preprocess';

const sizeInBytes = (hex: string) => hex.length / 2;

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
      options: { relative_ttl: 100, transaction_size: sizeInBytes(SIGNED_TX_WITH_STAKE_KEY_REGISTRATION) }
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
      options: { relative_ttl: 100, transaction_size: sizeInBytes(SIGNED_TX_WITH_STAKE_KEY_DEREGISTRATION) }
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
      options: { relative_ttl: 100, transaction_size: sizeInBytes(SIGNED_TX_WITH_STAKE_DELEGATION) }
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
        transaction_size: sizeInBytes(SIGNED_TX_WITH_STAKE_KEY_REGISTRATION_AND_STAKE_DELEGATION)
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
      options: { relative_ttl: 100, transaction_size: sizeInBytes(SIGNED_TX_WITH_WITHDRAWAL) }
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
      options: { relative_ttl: 100, transaction_size: sizeInBytes(SIGNED_TX_WITH_TWO_WITHDRAWALS) }
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
      options: {
        relative_ttl: 100,
        transaction_size: sizeInBytes(SIGNED_TX_WITH_STAKE_KEY_REGISTRATION_AND_WITHDRWAWAL)
      }
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

  test('Should properly process MultiAssets transactions', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PREPROCESS_ENDPOINT,
      // eslint-disable-next-line no-magic-numbers
      payload: generateProcessPayload({
        blockchain: 'cardano',
        network: 'mainnet',
        relativeTtl: 100,
        operations: CONSTRUCTION_PAYLOADS_REQUEST_WITH_MA.operations
      })
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      options: { relative_ttl: 100, transaction_size: sizeInBytes(SIGNED_TX_WITH_MA) }
    });
  });

  test('Should properly process MultiAssets transactions with several tokens', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PREPROCESS_ENDPOINT,
      // eslint-disable-next-line no-magic-numbers
      payload: generateProcessPayload({
        blockchain: 'cardano',
        network: 'mainnet',
        relativeTtl: 100,
        operations: CONSTRUCTION_PAYLOADS_REQUEST_WITH_MULTIPLE_MA.operations
      })
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      options: { relative_ttl: 100, transaction_size: sizeInBytes(SIGNED_TX_WITH_MULTIPLE_MA) }
    });
  });

  describe('Invalid request with MultiAssets', () => {
    const invalidOperationErrorMessage = 'Transaction outputs parameters errors in operations array';
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const modifyMAOperation = (policyId?: string, symbol?: string) =>
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
    test('Should fail if MultiAsset policy id is shorter than expected', async () => {
      const invalidPolicy = new Array(POLICY_ID_LENGTH).join('0');

      const operations = modifyMAOperation(invalidPolicy)(CONSTRUCTION_PAYLOADS_REQUEST_WITH_MA.operations);

      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_PREPROCESS_ENDPOINT,
        // eslint-disable-next-line no-magic-numbers
        payload: generateProcessPayload({
          blockchain: 'cardano',
          network: 'mainnet',
          relativeTtl: 100,
          operations
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.json()).toEqual({
        code: 4009,
        details: {
          message: `PolictyId ${invalidPolicy} is not valid`
        },
        message: invalidOperationErrorMessage,
        retriable: false
      });
    });

    test('Should fail if MultiAsset policy id is longer than expected', async () => {
      const invalidPolicy = new Array(POLICY_ID_LENGTH + 2).join('0');

      const operations = modifyMAOperation(invalidPolicy)(CONSTRUCTION_PAYLOADS_REQUEST_WITH_MA.operations);

      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_PREPROCESS_ENDPOINT,
        // eslint-disable-next-line no-magic-numbers
        payload: generateProcessPayload({
          blockchain: 'cardano',
          network: 'mainnet',
          relativeTtl: 100,
          operations
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.json()).toEqual({
        code: 4009,
        details: {
          message: `PolictyId ${invalidPolicy} is not valid`
        },
        message: invalidOperationErrorMessage,
        retriable: false
      });
    });

    test('Should fail if MultiAsset symbol longer than expected', async () => {
      const invalidSymbol = new Array(ASSET_NAME_LENGTH + 2).join('0');

      const operations = modifyMAOperation(undefined, invalidSymbol)(CONSTRUCTION_PAYLOADS_REQUEST_WITH_MA.operations);

      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_PREPROCESS_ENDPOINT,
        // eslint-disable-next-line no-magic-numbers
        payload: generateProcessPayload({
          blockchain: 'cardano',
          network: 'mainnet',
          relativeTtl: 100,
          operations
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.json()).toEqual({
        code: 4009,
        details: {
          message: `Token name ${invalidSymbol} is not valid`
        },
        message: invalidOperationErrorMessage,
        retriable: false
      });
    });

    test('Should fail if MultiAsset symbol longer than expected', async () => {
      const invalidSymbol = new Array(ASSET_NAME_LENGTH + 2).join('0');

      const operations = mod(
        1,
        'metadata',
        'tokenBundle',
        0
      )((tokenBundleItem: Components.Schemas.TokenBundleItem) => ({
        ...tokenBundleItem,
        tokens: [
          {
            value: '10000',
            currency: {
              symbol: '6e7574636f696e',
              decimals: 0
            }
          },
          {
            value: '10000',
            currency: {
              symbol: '6e7574636f696e',
              decimals: 0
            }
          }
        ]
      }))(CONSTRUCTION_PAYLOADS_REQUEST_WITH_MULTIPLE_MA.operations);

      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_PREPROCESS_ENDPOINT,
        // eslint-disable-next-line no-magic-numbers
        payload: generateProcessPayload({
          blockchain: 'cardano',
          network: 'mainnet',
          relativeTtl: 100,
          operations
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.json()).toEqual({
        code: 4009,
        details: {
          message:
            'Token name 6e7574636f696e has already been added for policy b0d07d45fe9514f80213f4020e5a61241458be626841cde717cb38a7 and will be overriden'
        },
        message: invalidOperationErrorMessage,
        retriable: false
      });
    });
  });
});
