/* eslint-disable camelcase */
/* eslint-disable no-magic-numbers */
import { FastifyInstance } from 'fastify';
import StatusCodes from 'http-status-codes';
import { Pool } from 'pg';
import { mod } from 'shades';
import { ASSET_NAME_LENGTH, POLICY_ID_LENGTH } from '../../../src/server/utils/constants';
import {
  CONSTRUCTION_PAYLOADS_REQUEST,
  CONSTRUCTION_PAYLOADS_REQUEST_INVALID_OUTPUTS,
  CONSTRUCTION_PAYLOADS_REQUEST_INVALID_INPUTS,
  CONSTRUCTION_PAYLOADS_REQUEST_WITH_BYRON_OUTPUT,
  CONSTRUCTION_PAYLOADS_REQUEST_WITH_MA,
  CONSTRUCTION_PAYLOADS_REQUEST_WITH_MULTIPLE_MA,
  CONSTRUCTION_PAYLOADS_REQUEST_WITM_MA_WITHOUT_NAME,
  CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_AND_PLEDGE,
  CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_CERT,
  CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_MULTI_HOST_NAME,
  CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_MULTIPLE_RELAY,
  CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_NO_METADATA,
  CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_SINGLE_HOST_ADDR,
  CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_SINGLE_HOST_NAME,
  CONSTRUCTION_PAYLOADS_WITH_STAKE_DELEGATION,
  CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_DEREGISTRATION,
  CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_REGISTRATION,
  CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_REGISTRATION_AND_STAKE_DELEGATION,
  CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_REGISTRATION_AND_WITHDRAWAL,
  CONSTRUCTION_PAYLOADS_WITH_TWO_WITHDRAWALS,
  CONSTRUCTION_PAYLOADS_WITH_WITHDRAWAL,
  SIGNED_TX_WITH_BYRON_OUTPUT,
  SIGNED_TX_WITH_MA,
  SIGNED_TX_WITH_MA_WITHOUT_NAME,
  SIGNED_TX_WITH_MULTIPLE_MA,
  SIGNED_TX_WITH_POOL_REGISTRATION_AND_PLEDGE,
  SIGNED_TX_WITH_POOL_REGISTRATION_WITH_CERT,
  SIGNED_TX_WITH_POOL_REGISTRATION_WITH_MULTI_HOST_NAME,
  SIGNED_TX_WITH_POOL_REGISTRATION_WITH_MULTIPLE_RELAYS,
  SIGNED_TX_WITH_POOL_REGISTRATION_WITH_NO_METADATA,
  SIGNED_TX_WITH_POOL_REGISTRATION_WITH_SINGLE_HOST_ADDR,
  SIGNED_TX_WITH_POOL_REGISTRATION_WITH_SINGLE_HOST_NAME,
  SIGNED_TX_WITH_STAKE_DELEGATION,
  SIGNED_TX_WITH_STAKE_KEY_DEREGISTRATION,
  SIGNED_TX_WITH_STAKE_KEY_REGISTRATION,
  SIGNED_TX_WITH_STAKE_KEY_REGISTRATION_AND_STAKE_DELEGATION,
  SIGNED_TX_WITH_STAKE_KEY_REGISTRATION_AND_WITHDRWAWAL,
  SIGNED_TX_WITH_TWO_WITHDRAWALS,
  SIGNED_TX_WITH_WITHDRAWAL,
  TRANSACTION_SIZE_IN_BYTES,
  CONSTRUCTION_PAYLOADS_REQUEST_WITH_BYRON_INPUT,
  TRANSACTION_WITH_BYRON_INPUT_SIZE,
  CONSTRUCTION_PAYLOADS_WITH_POOL_RETIREMENT,
  SIGNED_TX_WITH_POOL_RETIREMENT,
  LATEST_EPOCH_PROTOCOL_PARAMS
} from '../fixture-data';
import { modifyMAOperation, setupDatabase, setupServer, testInvalidNetworkParameters } from '../utils/test-utils';

const CONSTRUCTION_PREPROCESS_ENDPOINT = '/construction/preprocess';

const sizeInBytes = (hex: string) => hex.length / 2;

type ProcessPayloadType = {
  blockchain?: string;
  network?: string;
  operations?: Components.Schemas.Operation[];
  relativeTtl?: number;
};

const deposit_parameters = {
  poolDeposit: LATEST_EPOCH_PROTOCOL_PARAMS.poolDeposit,
  keyDeposit: LATEST_EPOCH_PROTOCOL_PARAMS.keyDeposit
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
        relative_ttl: relativeTtl,
        deposit_parameters
      }
    : { deposit_parameters }
});

describe(CONSTRUCTION_PREPROCESS_ENDPOINT, () => {
  let database: Pool;
  let server: FastifyInstance;

  beforeAll(async () => {
    database = setupDatabase();
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

  test('Should return a valid TTL when the operations include an input with a Byron address', async () => {
    const { operations } = CONSTRUCTION_PAYLOADS_REQUEST_WITH_BYRON_INPUT;
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PREPROCESS_ENDPOINT,
      // eslint-disable-next-line no-magic-numbers
      payload: generateProcessPayload({ blockchain: 'cardano', network: 'mainnet', operations, relativeTtl: 100 })
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      options: { relative_ttl: 100, transaction_size: TRANSACTION_WITH_BYRON_INPUT_SIZE }
    });
  });

  test('Should return a valid TTL when the operations include an output with a Byron address', async () => {
    const { operations } = CONSTRUCTION_PAYLOADS_REQUEST_WITH_BYRON_OUTPUT;
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PREPROCESS_ENDPOINT,
      // eslint-disable-next-line no-magic-numbers
      payload: generateProcessPayload({ blockchain: 'cardano', network: 'mainnet', operations, relativeTtl: 100 })
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      options: { relative_ttl: 100, transaction_size: sizeInBytes(SIGNED_TX_WITH_BYRON_OUTPUT) }
    });
  });

  test('Should throw an error when invalid outputs are sent as parameters', async () => {
    const { operations } = CONSTRUCTION_PAYLOADS_REQUEST_INVALID_OUTPUTS;
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PREPROCESS_ENDPOINT,
      // eslint-disable-next-line no-magic-numbers
      payload: generateProcessPayload({ blockchain: 'cardano', network: 'mainnet', operations, relativeTtl: 100 })
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4014,
      message: 'Cant deserialize transaction output from transaction body',
      retriable: false,
      details: {
        message:
          // eslint-disable-next-line max-len
          'Invalid input: ThisIsAnInvalidAddressaddr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx - mixed-case strings not allowed'
      }
    });
  });

  test('Should throw an error when invalid inputs are sent as parameters', async () => {
    const { operations } = CONSTRUCTION_PAYLOADS_REQUEST_INVALID_INPUTS;
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PREPROCESS_ENDPOINT,
      // eslint-disable-next-line no-magic-numbers
      payload: generateProcessPayload({ blockchain: 'cardano', network: 'mainnet', operations, relativeTtl: 100 })
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4013,
      message: 'Cant deserialize transaction input from transaction body',
      retriable: false,
      details: {
        message:
          // eslint-disable-next-line max-len, quotes
          "There was an error deserializating transaction input: Deserialization failed in TransactionHash because: Invalid cbor: expected tuple 'hash length' of length 32 but got length Len(0)."
      }
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

  test('Should return a valid TTL when the operations include pool retirement', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PREPROCESS_ENDPOINT,
      // eslint-disable-next-line no-magic-numbers
      payload: generateProcessPayload({
        blockchain: 'cardano',
        network: 'mainnet',
        operations: CONSTRUCTION_PAYLOADS_WITH_POOL_RETIREMENT.operations,
        relativeTtl: 100
      })
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      options: {
        relative_ttl: 100,
        transaction_size: sizeInBytes(SIGNED_TX_WITH_POOL_RETIREMENT)
      }
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

  test('Should properly process MultiAssets transactions with tokens without name', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PREPROCESS_ENDPOINT,
      // eslint-disable-next-line no-magic-numbers
      payload: generateProcessPayload({
        blockchain: 'cardano',
        network: 'mainnet',
        relativeTtl: 100,
        operations: CONSTRUCTION_PAYLOADS_REQUEST_WITM_MA_WITHOUT_NAME.operations
      })
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      options: { relative_ttl: 100, transaction_size: sizeInBytes(SIGNED_TX_WITH_MA_WITHOUT_NAME) }
    });
  });

  describe('Invalid request with MultiAssets', () => {
    const invalidOperationErrorMessage = 'Transaction outputs parameters errors in operations array';

    test('Should fail if MultiAsset policy id is shorter than expected', async () => {
      const invalidPolicy = Array.from({ length: POLICY_ID_LENGTH }).join('0');

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
          message: `PolicyId ${invalidPolicy} is not valid`
        },
        message: invalidOperationErrorMessage,
        retriable: false
      });
    });

    test('Should fail if MultiAsset policy id is longer than expected', async () => {
      const invalidPolicy = Array.from({ length: POLICY_ID_LENGTH + 2 }).join('0');

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
          message: `PolicyId ${invalidPolicy} is not valid`
        },
        message: invalidOperationErrorMessage,
        retriable: false
      });
    });

    test('Should fail if MultiAsset policy id is not a hex string', async () => {
      const invalidPolicy = Array.from({ length: POLICY_ID_LENGTH + 1 }).join('w');

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
          message: `PolicyId ${invalidPolicy} is not valid`
        },
        message: invalidOperationErrorMessage,
        retriable: false
      });
    });

    test('Should fail if MultiAsset symbol longer than expected', async () => {
      const invalidSymbol = Array.from({ length: ASSET_NAME_LENGTH + 2 }).join('0');

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

    test('Should fail if MultiAsset symbol is not a hex string', async () => {
      const invalidSymbol = 'thisIsANonHexString';

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
            // eslint-disable-next-line max-len
            'Token name 6e7574636f696e has already been added for policy b0d07d45fe9514f80213f4020e5a61241458be626841cde717cb38a7 and will be overriden'
        },
        message: invalidOperationErrorMessage,
        retriable: false
      });
    });

    test('Should fail if MultiAsset value for output operation is negative', async () => {
      const value = '-10000';
      const operations = mod(
        1,
        'metadata',
        'tokenBundle',
        0
      )((tokenBundleItem: Components.Schemas.TokenBundleItem) => ({
        ...tokenBundleItem,
        tokens: [
          {
            value,
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
          message: `Asset 6e7574636f696e has negative or invalid value '${value}'`
        },
        message: invalidOperationErrorMessage,
        retriable: false
      });
    });

    test('Should fail if MultiAsset value is not a number', async () => {
      const value = 'someInvalidValue';
      const symbol = '6e7574636f696f';

      const operations = mod(
        1,
        'metadata',
        'tokenBundle',
        0
      )((tokenBundleItem: Components.Schemas.TokenBundleItem) => ({
        ...tokenBundleItem,
        tokens: [
          {
            value,
            currency: {
              symbol,
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
          message: `Asset ${symbol} has negative or invalid value '${value}'`
        },
        message: invalidOperationErrorMessage,
        retriable: false
      });
    });
  });
  describe('Pool registration requests', () => {
    test('Should properly process transactions with pool registrations with pledge', async () => {
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_PREPROCESS_ENDPOINT,
        // eslint-disable-next-line no-magic-numbers
        payload: generateProcessPayload({
          blockchain: 'cardano',
          network: 'mainnet',
          relativeTtl: 100,
          operations: CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_AND_PLEDGE.operations
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        options: { relative_ttl: 100, transaction_size: sizeInBytes(SIGNED_TX_WITH_POOL_REGISTRATION_AND_PLEDGE) }
      });
    });
    test('Should properly process transactions with pool registrations with multiple relays', async () => {
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_PREPROCESS_ENDPOINT,
        // eslint-disable-next-line no-magic-numbers
        payload: generateProcessPayload({
          blockchain: 'cardano',
          network: 'mainnet',
          relativeTtl: 100,
          operations: CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_MULTIPLE_RELAY.operations
        })
      });

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        options: {
          relative_ttl: 100,
          transaction_size: sizeInBytes(SIGNED_TX_WITH_POOL_REGISTRATION_WITH_MULTIPLE_RELAYS)
        }
      });
    });
    test('Should properly process transactions with pool registrations with single host addr', async () => {
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_PREPROCESS_ENDPOINT,
        // eslint-disable-next-line no-magic-numbers
        payload: generateProcessPayload({
          blockchain: 'cardano',
          network: 'mainnet',
          relativeTtl: 100,
          operations: CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_SINGLE_HOST_ADDR.operations
        })
      });

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        options: {
          relative_ttl: 100,
          transaction_size: sizeInBytes(SIGNED_TX_WITH_POOL_REGISTRATION_WITH_SINGLE_HOST_ADDR)
        }
      });
    });
    test('Should properly process transactions with pool registrations with single host name', async () => {
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_PREPROCESS_ENDPOINT,
        // eslint-disable-next-line no-magic-numbers
        payload: generateProcessPayload({
          blockchain: 'cardano',
          network: 'mainnet',
          relativeTtl: 100,
          operations: CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_SINGLE_HOST_NAME.operations
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        options: {
          relative_ttl: 100,
          transaction_size: sizeInBytes(SIGNED_TX_WITH_POOL_REGISTRATION_WITH_SINGLE_HOST_NAME)
        }
      });
    });
    test('Should properly process transactions with pool registrations with multiple host name', async () => {
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_PREPROCESS_ENDPOINT,
        // eslint-disable-next-line no-magic-numbers
        payload: generateProcessPayload({
          blockchain: 'cardano',
          network: 'mainnet',
          relativeTtl: 100,
          operations: CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_MULTI_HOST_NAME.operations
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        options: {
          relative_ttl: 100,
          transaction_size: sizeInBytes(SIGNED_TX_WITH_POOL_REGISTRATION_WITH_MULTI_HOST_NAME)
        }
      });
    });
    test('Should properly process transactions with pool registrations with no pool metadata', async () => {
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_PREPROCESS_ENDPOINT,
        // eslint-disable-next-line no-magic-numbers
        payload: generateProcessPayload({
          blockchain: 'cardano',
          network: 'mainnet',
          relativeTtl: 100,
          operations: CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_NO_METADATA.operations
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        options: { relative_ttl: 100, transaction_size: sizeInBytes(SIGNED_TX_WITH_POOL_REGISTRATION_WITH_NO_METADATA) }
      });
    });
    test('Should properly process transactions with pool registrations with cert', async () => {
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_PREPROCESS_ENDPOINT,
        // eslint-disable-next-line no-magic-numbers
        payload: generateProcessPayload({
          blockchain: 'cardano',
          network: 'mainnet',
          relativeTtl: 100,
          operations: CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_CERT.operations
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        options: { relative_ttl: 100, transaction_size: sizeInBytes(SIGNED_TX_WITH_POOL_REGISTRATION_WITH_CERT) }
      });
    });
  });
});
