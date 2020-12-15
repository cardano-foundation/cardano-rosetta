/* eslint-disable camelcase */
import StatusCodes from 'http-status-codes';
import { Pool } from 'pg';
import { FastifyInstance } from 'fastify';
import { setupDatabase, setupServer, testInvalidNetworkParameters } from '../utils/test-utils';
import {
  CONSTRUCTION_PAYLOADS_MULTIPLE_INPUTS,
  CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_REGISTRATION,
  CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_DEREGISTRATION,
  CONSTRUCTION_PAYLOADS_WITH_STAKE_DELEGATION,
  CONSTRUCTION_PAYLOADS_WITH_STAKE_REGISTRATION_AND_DELEGATION,
  CONSTRUCTION_PAYLOADS_WITH_WITHDRAWAL,
  CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_REGISTRATION_AND_WITHDRAWAL,
  CONSTRUCTION_PAYLOADS_REQUEST,
  CONSTRUCTION_PAYLOADS_REQUEST_INVALID_INPUTS,
  CONSTRUCTION_PAYLOADS_REQUEST_INVALID_OUTPUTS,
  CONSTRUCTION_PAYLOADS_REQUEST_INVALID_TRANSACTION_ID,
  CONSTRUCTION_PAYLOADS_RESPONSE,
  CONSTRUCTION_PAYLOADS_STAKE_REGISTRATION_RESPONSE,
  CONSTRUCTION_PAYLOADS_STAKE_DEREGISTRATION_RESPONSE,
  CONSTRUCTION_PAYLOADS_STAKE_DELEGATION_RESPONSE,
  CONSTRUCTION_PAYLOADS_STAKE_REGISTRATION_AND_DELEGATION_RESPONSE,
  CONSTRUCTION_PAYLOADS_WITHDRAWAL_RESPONSE,
  CONSTRUCTION_PAYLOADS_STAKE_REGISTRATION_AND_WITHDRAWAL_RESPONSE,
  CONSTRUCTION_PAYLOADS_INVALID_OPERATION_TYPE
} from '../fixture-data';
import { SIGNATURE_TYPE } from '../../../src/server/utils/constants';

const CONSTRUCTION_PAYLOADS_ENDPOINT = '/construction/payloads';

const INVALID_STAKING_KEY_FORMAT = { message: 'Invalid staking key format', code: 4017, retriable: false };
const MISSING_STAKING_KEY = {
  message: 'Staking key is required for this type of address',
  code: 4018,
  retriable: false
};
const TRANSACTION_INPUTS_PARAMETERS_MISSING_ERROR = {
  message: 'Transaction inputs parameters errors in operations array',
  code: 4008,
  retriable: false
};
const TRANSACTION_OUTPUT_PARAMETERS_MISSING_ERROR = {
  message: 'Transaction outputs parameters errors in operations array',
  code: 4009,
  retriable: false
};

describe(CONSTRUCTION_PAYLOADS_ENDPOINT, () => {
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
    CONSTRUCTION_PAYLOADS_ENDPOINT,
    (blockchain, network) => ({
      ...CONSTRUCTION_PAYLOADS_REQUEST,
      network_identifier: {
        blockchain,
        network
      }
    }),
    () => server
  );

  // eslint-disable-next-line max-len
  test('Should return a valid unsigned transaction hash whenever valid input and output operations are sent as parameters', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_REQUEST
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      unsigned_transaction: CONSTRUCTION_PAYLOADS_RESPONSE,
      payloads: [
        {
          address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx',
          signature_type: SIGNATURE_TYPE,
          hex_bytes: '333a6ccaaa639f7b451ce93764f54f654ef499fdb7b8b24374ee9d99eab9d795'
        }
      ]
    });
  });

  test('Should return a single payload for each input address', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_MULTIPLE_INPUTS
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json().payloads.length).toEqual(1);
  });

  test('Should return an error when operations with invalid types are sent as parameters', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_INVALID_OPERATION_TYPE
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4019,
      message: 'Provided operation type is invalid',
      retriable: true
    });
  });

  test('Should throw an error when invalid inputs are sent as parameters', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_REQUEST_INVALID_INPUTS
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

  test('Should throw an error when invalid outputs are sent as parameters', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_REQUEST_INVALID_OUTPUTS
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4014,
      message: 'Cant deserialize transaction output from transaction body',
      retriable: false,
      details: { message: 'mixed-case strings not allowed' }
    });
  });

  test('Should return an error when input operation has no coin change property', async () => {
    const { operations, ...restPayload } = CONSTRUCTION_PAYLOADS_REQUEST;
    const payload = {
      operations: operations.map(({ coin_change, ...restOperation }) => ({
        ...restOperation
      })),
      ...restPayload
    };
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      ...TRANSACTION_INPUTS_PARAMETERS_MISSING_ERROR,
      details: { message: 'Input has missing coin_change field' }
    });
  });

  test('Should return an error when input operation has invalid coin identifier', async () => {
    const { operations, ...restPayload } = CONSTRUCTION_PAYLOADS_REQUEST;
    const payload = {
      operations: operations.map(({ coin_change, ...restOperation }) => ({
        coin_change: {
          coin_identifier: {
            identifier: 'invalid_coin_identifier'
          },
          coin_action: 'coin_spent'
        },
        ...restOperation
      })),
      ...restPayload
    };
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      ...TRANSACTION_INPUTS_PARAMETERS_MISSING_ERROR,
      details: { message: 'Input has invalid coin_identifier field' }
    });
  });

  test('Should return an error when input operation has no amount property', async () => {
    const { operations, ...restPayload } = CONSTRUCTION_PAYLOADS_REQUEST;
    const payload = {
      operations: operations.map(({ amount, type, ...restOperation }) => ({
        amount: type === 'output' ? amount : undefined,
        type,
        ...restOperation
      })),
      ...restPayload
    };
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      ...TRANSACTION_INPUTS_PARAMETERS_MISSING_ERROR,
      details: { message: 'Input has missing amount value field' }
    });
  });

  test('Should return an error when input operation has positive amount', async () => {
    const { operations, ...restPayload } = CONSTRUCTION_PAYLOADS_REQUEST;
    const payload = {
      operations: operations.map(({ amount, type, ...restOperation }) => ({
        amount:
          type === 'input'
            ? {
                value: '90000',
                currency: {
                  symbol: 'ADA',
                  decimals: 6
                }
              }
            : amount,
        type,
        ...restOperation
      })),
      ...restPayload
    };
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      ...TRANSACTION_INPUTS_PARAMETERS_MISSING_ERROR,
      details: { message: 'Input has positive amount value' }
    });
  });

  test('Should throw an error when invalid transactionId is sent as input parameters', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_REQUEST_INVALID_TRANSACTION_ID
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      ...TRANSACTION_INPUTS_PARAMETERS_MISSING_ERROR,
      details: { message: 'Input has invalid coin_identifier field' }
    });
  });

  test('Should throw an error when more outputs sum is bigger than inputs sum', async () => {
    // We are triplicating the last output of 40k amount
    // eslint-disable-next-line no-magic-numbers
    const bigOutput = CONSTRUCTION_PAYLOADS_REQUEST.operations[2];
    CONSTRUCTION_PAYLOADS_REQUEST.operations.push(bigOutput);
    CONSTRUCTION_PAYLOADS_REQUEST.operations.push(bigOutput);
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_REQUEST
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4010,
      message: 'The transaction you are trying to build has more outputs than inputs',
      retriable: false
    });
  });

  test('Should return an error when output operation has no amount property', async () => {
    const { operations, ...restPayload } = CONSTRUCTION_PAYLOADS_REQUEST;
    const payload = {
      operations: operations.map(({ amount, type, ...restOperation }) => ({
        amount: type === 'input' ? amount : undefined,
        type,
        ...restOperation
      })),
      ...restPayload
    };
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      ...TRANSACTION_OUTPUT_PARAMETERS_MISSING_ERROR,
      details: { message: 'Output has missing amount value field' }
    });
  });

  test('Should return an error when output operation has negative amount', async () => {
    const { operations, ...restPayload } = CONSTRUCTION_PAYLOADS_REQUEST;
    const payload = {
      operations: operations.map(({ amount, type, ...restOperation }) => ({
        amount:
          type === 'output'
            ? {
                value: '-90000',
                currency: {
                  symbol: 'ADA',
                  decimals: 6
                }
              }
            : amount,
        type,
        ...restOperation
      })),
      ...restPayload
    };
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      ...TRANSACTION_OUTPUT_PARAMETERS_MISSING_ERROR,
      details: { message: 'Output has negative amount value' }
    });
  });

  // eslint-disable-next-line max-len
  test('Should return a valid unsigned transaction hash when sending valid operations including stake key registration', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_REGISTRATION
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      unsigned_transaction: CONSTRUCTION_PAYLOADS_STAKE_REGISTRATION_RESPONSE,
      payloads: [
        {
          address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx',
          signature_type: SIGNATURE_TYPE,
          hex_bytes: 'ec6bb1091d68dcb3e4f4889329e143fbb6090b8e78c74e7c8d0903d9eec4eed1'
        }
      ]
    });
  });

  // eslint-disable-next-line max-len
  test('Should return a valid unsigned transaction hash when sending valid operations including stake delegation', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_WITH_STAKE_DELEGATION
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      unsigned_transaction: CONSTRUCTION_PAYLOADS_STAKE_DELEGATION_RESPONSE,
      payloads: [
        {
          address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx',
          signature_type: SIGNATURE_TYPE,
          hex_bytes: 'd4818d5a1ad1163fdb84b1e538d6d2c2fc34a86a91cd13f628dd3a7e4458a7c1'
        },
        {
          address: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5',
          signature_type: SIGNATURE_TYPE,
          hex_bytes: 'd4818d5a1ad1163fdb84b1e538d6d2c2fc34a86a91cd13f628dd3a7e4458a7c1'
        }
      ]
    });
  });

  // eslint-disable-next-line max-len
  test('Should return a valid unsigned transaction hash when sending valid operations including stake key registration and stake delegation', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_WITH_STAKE_REGISTRATION_AND_DELEGATION
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      unsigned_transaction: CONSTRUCTION_PAYLOADS_STAKE_REGISTRATION_AND_DELEGATION_RESPONSE,
      payloads: [
        {
          address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx',
          signature_type: SIGNATURE_TYPE,
          hex_bytes: 'dbf6479409a59e3e99c79b9c46b6af714de7c8264094b1d38c373b7454acf33d'
        },
        {
          address: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5',
          signature_type: SIGNATURE_TYPE,
          hex_bytes: 'dbf6479409a59e3e99c79b9c46b6af714de7c8264094b1d38c373b7454acf33d'
        }
      ]
    });
  });

  // eslint-disable-next-line max-len
  test('Should return a valid unsigned transaction hash when sending valid operations including withdrawal', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_WITH_WITHDRAWAL
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      unsigned_transaction: CONSTRUCTION_PAYLOADS_WITHDRAWAL_RESPONSE,
      payloads: [
        {
          address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx',
          signature_type: SIGNATURE_TYPE,
          hex_bytes: 'da2eb0d62aee9313fc68df0827bd176b55168bc9129aedce92f4e29b1d52de38'
        },
        {
          address: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5',
          signature_type: SIGNATURE_TYPE,
          hex_bytes: 'da2eb0d62aee9313fc68df0827bd176b55168bc9129aedce92f4e29b1d52de38'
        }
      ]
    });
  });

  // eslint-disable-next-line max-len
  test('Should return a valid unsigned transaction hash when sending valid operations including withdrawal and stake registration', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_REGISTRATION_AND_WITHDRAWAL
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      unsigned_transaction: CONSTRUCTION_PAYLOADS_STAKE_REGISTRATION_AND_WITHDRAWAL_RESPONSE,
      payloads: [
        {
          address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx',
          signature_type: SIGNATURE_TYPE,
          hex_bytes: '8b47f0f3690167b596f1e7623e1869148f6bea78ebceaa08fe890a2e3e9e4d89'
        },
        {
          address: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5',
          signature_type: SIGNATURE_TYPE,
          hex_bytes: '8b47f0f3690167b596f1e7623e1869148f6bea78ebceaa08fe890a2e3e9e4d89'
        }
      ]
    });
  });

  // eslint-disable-next-line max-len
  test('Should return a valid unsigned transaction hash when sending valid operations including stake key deregistration', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_DEREGISTRATION
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      unsigned_transaction: CONSTRUCTION_PAYLOADS_STAKE_DEREGISTRATION_RESPONSE,
      payloads: [
        {
          address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx',
          signature_type: SIGNATURE_TYPE,
          hex_bytes: '9c0f4e7fa746738d3df3665fc7cd11b2e3115e3268a047e0435f2454ed41fdc5'
        },
        {
          address: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5',
          signature_type: SIGNATURE_TYPE,
          hex_bytes: '9c0f4e7fa746738d3df3665fc7cd11b2e3115e3268a047e0435f2454ed41fdc5'
        }
      ]
    });
  });

  test('Should return an error when no staking key is provided in staking key registration operation', async () => {
    const { network_identifier, operations, metadata } = CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_REGISTRATION;
    const payload = {
      network_identifier,
      operations: operations.map(({ metadata: opMetadata, ...rest }) => ({
        metadata: opMetadata && {
          staking_credential: undefined
        },
        ...rest
      })),
      metadata
    };
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual(MISSING_STAKING_KEY);
  });

  test('Should return an error when staking key in one operation has invalid format', async () => {
    const { network_identifier, operations, metadata } = CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_REGISTRATION;
    const payload = {
      network_identifier,
      operations: operations.map(({ metadata: opMetadata, ...rest }) => ({
        metadata: opMetadata && {
          staking_credential: { hex_bytes: opMetadata.staking_credential!.hex_bytes, curve_type: 'secp256k1' }
        },
        ...rest
      })),
      metadata
    };
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual(INVALID_STAKING_KEY_FORMAT);
  });

  test('Should return an error when staking key in one operation has a bigger length than 32', async () => {
    const { network_identifier, operations, metadata } = CONSTRUCTION_PAYLOADS_WITH_STAKE_DELEGATION;
    const bigCredential = {
      hex_bytes: 'ThisIsABiggerPublicKeyForTestingPurposesThisIsABiggerPublicKeyForTestingPurposes',
      curve_type: 'edwards25519'
    };
    const payload = {
      network_identifier,
      operations: operations.map(({ metadata: opMetadata, ...rest }) => ({
        metadata: opMetadata && { staking_credential: bigCredential },
        ...rest
      })),
      metadata
    };
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual(INVALID_STAKING_KEY_FORMAT);
  });

  test('Should return an error when staking key in one operation has a smaller length than 32', async () => {
    const { network_identifier, operations, metadata } = CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_DEREGISTRATION;
    const smallCredential = {
      hex_bytes: 'smallPublicKey',
      curve_type: 'edwards25519'
    };
    const payload = {
      network_identifier,
      operations: operations.map(({ metadata: opMetadata, ...rest }) => ({
        metadata: opMetadata && { staking_credential: smallCredential },
        ...rest
      })),
      metadata
    };
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual(INVALID_STAKING_KEY_FORMAT);
  });

  test('Should return an error when no pool key hash is provided for stake delegation', async () => {
    const { network_identifier, operations, metadata } = CONSTRUCTION_PAYLOADS_WITH_STAKE_DELEGATION;
    const payload = {
      network_identifier,
      operations: operations.map(({ metadata: opMetadata, ...rest }) => ({
        ...rest,
        metadata: { staking_credential: opMetadata?.staking_credential }
      })),
      metadata
    };
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4020,
      message: 'Pool key hash is required for stake delegation',
      retriable: false
    });
  });
});
