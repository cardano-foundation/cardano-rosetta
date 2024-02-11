/* eslint-disable max-len */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-statements */
/* eslint-disable camelcase */
import StatusCodes from 'http-status-codes';
import { Pool } from 'pg';
import { FastifyInstance } from 'fastify';
import {
  setupDatabase,
  setupServer,
  testInvalidNetworkParameters,
  modifyAccount,
  modifyMAOperation,
  modifyCoinChange,
  modifyPoolKeyHash,
  modfyPoolParameters
} from '../utils/test-utils';
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
  CONSTRUCTION_PAYLOADS_INVALID_OPERATION_TYPE,
  CONSTRUCTION_PAYLOADS_REQUEST_WITH_MA,
  CONSTRUCTION_PAYLOADS_REQUEST_WITH_MA_RESPONSE,
  CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_AND_PLEDGE,
  CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_AND_PLEDGE_RESPONSE,
  CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_SINGLE_HOST_ADDR,
  CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_SINGLE_HOST_ADDR_RESPONSE,
  CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_SINGLE_HOST_NAME,
  CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_SINGLE_HOST_NAME_RESPONSE,
  CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_MULTI_HOST_NAME,
  CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_MULTI_HOST_NAME_RESPONSE,
  CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_NO_METADATA,
  CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_NO_METADATA_RESPONSE,
  CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_MULTIPLE_RELAY,
  CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_MULTIPLE_RELAY_RESPONSE,
  CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_CERT,
  CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_CERT_RESPONSE,
  CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_INVALID_CERT,
  CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_INVALID_CERT_TYPE,
  CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_NO_COLD_KEY,
  CONSTRUCTION_PAYLOADS_REQUEST_WITH_BYRON_INPUT,
  CONSTRUCTION_PAYLOADS_REQUEST_WITH_BYRON_INPUT_RESPONSE,
  CONSTRUCTION_PAYLOADS_WITH_POOL_RETIREMENT,
  CONSTRUCTION_PAYLOADS_WITH_POOL_RETIREMENT_NO_EPOCH,
  CONSTRUCTION_PAYLOADS_WITH_POOL_RETIREMENT_RESPONSE,
  CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION,
  CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_RESPONSE,
  CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_WITH_NO_VOTING_KEY,
  CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_WITH_INVALID_VOTING_KEY,
  CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_WITH_NO_REWARD_ADDRESS,
  CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_WITH_INVALID_REWARD_ADDRESS,
  CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_WITH_INVALID_STAKE_KEY,
  CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_WITH_NO_STAKE_KEY,
  CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_WITH_INVALID_NONCE,
  CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_WITH_NO_SIGNATURE,
  CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_WITH_INVALID_SIGNATURE,
  CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_WITH_NO_METADATA,
  CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_WITH_EMPTY_METADATA
} from '../fixture-data';
import {
  SIGNATURE_TYPE,
  POLICY_ID_LENGTH,
  ASSET_NAME_LENGTH,
  OperationType
} from '../../../src/server/utils/constants';

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
    database = setupDatabase();
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
          account_identifier: {
            address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
          },
          signature_type: SIGNATURE_TYPE,
          hex_bytes: '333a6ccaaa639f7b451ce93764f54f654ef499fdb7b8b24374ee9d99eab9d795'
        }
      ]
    });
  });

  test('Should return a valid unsigned transaction hash whenever a input with Byron Address is send', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_REQUEST_WITH_BYRON_INPUT
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      unsigned_transaction: CONSTRUCTION_PAYLOADS_REQUEST_WITH_BYRON_INPUT_RESPONSE,
      payloads: [
        {
          account_identifier: {
            address: 'Ae2tdPwUPEZC6WJfVQxTNN2tWw4skGrN6zRVukvxJmTFy1nYkVGQBuURU3L'
          },
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
      details: {
        message:
          // eslint-disable-next-line max-len
          'Invalid input: ThisIsAnInvalidAddressaddr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx - mixed-case strings not allowed'
      }
    });
  });

  test('Should return an error when input operation has no coin change property', async () => {
    const payload = modifyCoinChange(CONSTRUCTION_PAYLOADS_REQUEST);
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
    const payload = modifyCoinChange(CONSTRUCTION_PAYLOADS_REQUEST, {
      coin_identifier: {
        identifier: 'invalid_coin_identifier'
      },
      coin_action: 'coin_spent'
    });
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
    CONSTRUCTION_PAYLOADS_REQUEST.operations.push(bigOutput, bigOutput);
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
          account_identifier: {
            address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
          },
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
          account_identifier: {
            address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
          },
          signature_type: SIGNATURE_TYPE,
          hex_bytes: 'd4818d5a1ad1163fdb84b1e538d6d2c2fc34a86a91cd13f628dd3a7e4458a7c1'
        },
        {
          account_identifier: {
            address: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5'
          },
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
          account_identifier: {
            address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
          },
          signature_type: SIGNATURE_TYPE,
          hex_bytes: 'dbf6479409a59e3e99c79b9c46b6af714de7c8264094b1d38c373b7454acf33d'
        },
        {
          account_identifier: {
            address: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5'
          },
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
          account_identifier: {
            address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
          },
          signature_type: SIGNATURE_TYPE,
          hex_bytes: 'da2eb0d62aee9313fc68df0827bd176b55168bc9129aedce92f4e29b1d52de38'
        },
        {
          account_identifier: {
            address: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5'
          },
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
          account_identifier: {
            address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
          },
          signature_type: SIGNATURE_TYPE,
          hex_bytes: '8b47f0f3690167b596f1e7623e1869148f6bea78ebceaa08fe890a2e3e9e4d89'
        },
        {
          account_identifier: {
            address: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5'
          },
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
          account_identifier: {
            address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
          },
          signature_type: SIGNATURE_TYPE,
          hex_bytes: '9c0f4e7fa746738d3df3665fc7cd11b2e3115e3268a047e0435f2454ed41fdc5'
        },
        {
          account_identifier: {
            address: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5'
          },
          signature_type: SIGNATURE_TYPE,
          hex_bytes: '9c0f4e7fa746738d3df3665fc7cd11b2e3115e3268a047e0435f2454ed41fdc5'
        }
      ]
    });
  });

  // eslint-disable-next-line max-len
  test('Should return a valid unsigned transaction hash when sending valid operations including pool retirement', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_WITH_POOL_RETIREMENT
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      unsigned_transaction: CONSTRUCTION_PAYLOADS_WITH_POOL_RETIREMENT_RESPONSE,
      payloads: [
        {
          account_identifier: {
            address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
          },
          signature_type: SIGNATURE_TYPE,
          hex_bytes: 'ec44114edfb063ce344797f95328ccfd8bc1c92f71816803803110cfebbb8360'
        },
        {
          account_identifier: {
            address: '153806dbcd134ddee69a8c5204e38ac80448f62342f8c23cfe4b7edf'
          },
          signature_type: SIGNATURE_TYPE,
          hex_bytes: 'ec44114edfb063ce344797f95328ccfd8bc1c92f71816803803110cfebbb8360'
        }
      ]
    });
  });

  test('Should throw an error when no epoch was sent on pool retirement operation', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_WITH_POOL_RETIREMENT_NO_EPOCH
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4036,
      message: 'Mandatory parameter is missing: Epoch',
      retriable: false
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
          staking_credential: { hex_bytes: opMetadata.staking_credential?.hex_bytes, curve_type: 'secp256k1' }
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
    const payload = modifyPoolKeyHash(CONSTRUCTION_PAYLOADS_WITH_STAKE_DELEGATION, OperationType.STAKE_DELEGATION);
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4020,
      message: 'Pool key hash is required to operate',
      retriable: false
    });
  });

  test('Should return an error when an invalid pool key hash is provided for stake delegation', async () => {
    const payload = modifyPoolKeyHash(
      CONSTRUCTION_PAYLOADS_WITH_STAKE_DELEGATION,
      OperationType.STAKE_DELEGATION,
      'InvalidPoolKeyHash'
    );
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4025,
      details: {
        message:
          // eslint-disable-next-line max-len
          "Deserialization failed in Ed25519KeyHash because: Invalid cbor: expected tuple 'hash length' of length 28 but got length Len(0)."
      },
      message: 'Provided pool key hash has invalid format',
      retriable: false
    });
  });

  // eslint-disable-next-line max-len
  test('Should return a valid unsigned transaction hash when sending valid operations including ma amount', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_REQUEST_WITH_MA
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      unsigned_transaction: CONSTRUCTION_PAYLOADS_REQUEST_WITH_MA_RESPONSE,
      payloads: [
        {
          account_identifier: {
            address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
          },
          hex_bytes: '3a4e241fe0c56f8001cb2e71ffdf10e2804437b4159930c32d59e3b4469203d6',
          signature_type: SIGNATURE_TYPE
        }
      ]
    });
  });
});

describe('Invalid request with MultiAssets', () => {
  let database: Pool;
  let server: FastifyInstance;

  beforeAll(async () => {
    database = setupDatabase();
    server = setupServer(database);
  });

  afterAll(async () => {
    await database.end();
  });
  const invalidOperationErrorMessage = 'Transaction outputs parameters errors in operations array';

  test('Should fail if MultiAsset policy id is shorter than expected', async () => {
    const invalidPolicy = Array.from({ length: POLICY_ID_LENGTH }).join('0');
    const { operations, ...restPayload } = CONSTRUCTION_PAYLOADS_REQUEST_WITH_MA;
    const payload = {
      operations: modifyMAOperation(invalidPolicy)(operations),
      ...restPayload
    };
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload
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
    const { operations, ...restPayload } = CONSTRUCTION_PAYLOADS_REQUEST_WITH_MA;
    const payload = {
      operations: modifyMAOperation(invalidPolicy)(operations),
      ...restPayload
    };
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload
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
    // eslint-disable-next-line no-magic-numbers
    const invalidPolicy = Array.from({ length: POLICY_ID_LENGTH + 2 }).join('0');
    const { operations, ...restPayload } = CONSTRUCTION_PAYLOADS_REQUEST_WITH_MA;
    const payload = {
      operations: modifyMAOperation(invalidPolicy)(operations),
      ...restPayload
    };
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload
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

  test('Should fail if MultiAsset symbol is not a hex string', async () => {
    const invalidSymbol = 'thisIsANonHexString';
    const { operations, ...restPayload } = CONSTRUCTION_PAYLOADS_REQUEST_WITH_MA;
    const payload = {
      operations: modifyMAOperation(undefined, invalidSymbol)(operations),
      ...restPayload
    };

    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload
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
    // eslint-disable-next-line no-magic-numbers
    const invalidSymbol = Array.from({ length: ASSET_NAME_LENGTH + 2 }).join('0');
    const { operations, ...restPayload } = CONSTRUCTION_PAYLOADS_REQUEST_WITH_MA;
    const payload = {
      operations: modifyMAOperation(undefined, invalidSymbol)(operations),
      ...restPayload
    };

    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload
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
});

describe('Pool Registration', () => {
  let database: Pool;
  let server: FastifyInstance;

  beforeAll(async () => {
    database = setupDatabase();
    server = setupServer(database);
  });

  afterAll(async () => {
    await database.end();
  });

  test('Should return a valid unsigned transaction hash when sending valid operations with pool registration with pledge', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_AND_PLEDGE
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      unsigned_transaction: CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_AND_PLEDGE_RESPONSE,
      payloads: [
        {
          account_identifier: {
            address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
          },
          signature_type: SIGNATURE_TYPE,
          hex_bytes: '19d2feaca112ef7df5b703509a2ae37a743fcc174b8aa3898e0e9f4f577b4c80'
        },
        {
          account_identifier: {
            address: 'stake1uxly0q2cnpxrjrqm9vpnr9dwkr0j945gulhhgs3dx33l47sweg9er'
          },
          signature_type: SIGNATURE_TYPE,
          hex_bytes: '19d2feaca112ef7df5b703509a2ae37a743fcc174b8aa3898e0e9f4f577b4c80'
        },
        {
          account_identifier: {
            address: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5'
          },
          signature_type: SIGNATURE_TYPE,
          hex_bytes: '19d2feaca112ef7df5b703509a2ae37a743fcc174b8aa3898e0e9f4f577b4c80'
        },
        {
          account_identifier: {
            address: '1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5'
          },
          hex_bytes: '19d2feaca112ef7df5b703509a2ae37a743fcc174b8aa3898e0e9f4f577b4c80',
          signature_type: 'ed25519'
        }
      ]
    });
  });
  test('Should return a valid unsigned transaction hash when sending valid operations including pool registration with Single Host Addr relay', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_SINGLE_HOST_ADDR
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      unsigned_transaction: CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_SINGLE_HOST_ADDR_RESPONSE,
      payloads: [
        {
          account_identifier: {
            address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
          },
          signature_type: SIGNATURE_TYPE,
          hex_bytes: '53f456cca6b8a6869301509cbd8c91f24dfef5b924b8c1e46934396cb3e47479'
        },
        {
          account_identifier: {
            address: 'stake1uxly0q2cnpxrjrqm9vpnr9dwkr0j945gulhhgs3dx33l47sweg9er'
          },
          signature_type: SIGNATURE_TYPE,
          hex_bytes: '53f456cca6b8a6869301509cbd8c91f24dfef5b924b8c1e46934396cb3e47479'
        },
        {
          account_identifier: {
            address: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5'
          },
          hex_bytes: '53f456cca6b8a6869301509cbd8c91f24dfef5b924b8c1e46934396cb3e47479',
          signature_type: 'ed25519'
        },
        {
          account_identifier: {
            address: '1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5'
          },
          hex_bytes: '53f456cca6b8a6869301509cbd8c91f24dfef5b924b8c1e46934396cb3e47479',
          signature_type: 'ed25519'
        }
      ]
    });
  });
  test('Should return a valid unsigned transaction hash when sending valid operations including pool registration with Single Host Name relay', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_SINGLE_HOST_NAME
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      unsigned_transaction: CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_SINGLE_HOST_NAME_RESPONSE,
      payloads: [
        {
          account_identifier: {
            address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
          },
          signature_type: SIGNATURE_TYPE,
          hex_bytes: 'ad36f2e07fb6d0a0864bcda0deea6c081770ddb3390eac85c7696479930be608'
        },
        {
          account_identifier: {
            address: 'stake1uxly0q2cnpxrjrqm9vpnr9dwkr0j945gulhhgs3dx33l47sweg9er'
          },
          signature_type: SIGNATURE_TYPE,
          hex_bytes: 'ad36f2e07fb6d0a0864bcda0deea6c081770ddb3390eac85c7696479930be608'
        },
        {
          account_identifier: {
            address: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5'
          },
          hex_bytes: 'ad36f2e07fb6d0a0864bcda0deea6c081770ddb3390eac85c7696479930be608',
          signature_type: 'ed25519'
        },
        {
          account_identifier: {
            address: '1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5'
          },
          hex_bytes: 'ad36f2e07fb6d0a0864bcda0deea6c081770ddb3390eac85c7696479930be608',
          signature_type: 'ed25519'
        }
      ]
    });
  });
  test('Should return a valid unsigned transaction hash when sending valid operations including pool registration with Multi Host Name relay', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_MULTI_HOST_NAME
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      unsigned_transaction: CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_MULTI_HOST_NAME_RESPONSE,
      payloads: [
        {
          account_identifier: {
            address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
          },
          signature_type: SIGNATURE_TYPE,
          hex_bytes: 'bd874d7253af650d7d265a5dd259a16d838593e99252d3ed5409b84a2d3e864e'
        },
        {
          account_identifier: {
            address: 'stake1uxly0q2cnpxrjrqm9vpnr9dwkr0j945gulhhgs3dx33l47sweg9er'
          },
          signature_type: SIGNATURE_TYPE,
          hex_bytes: 'bd874d7253af650d7d265a5dd259a16d838593e99252d3ed5409b84a2d3e864e'
        },
        {
          account_identifier: {
            address: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5'
          },
          signature_type: SIGNATURE_TYPE,
          hex_bytes: 'bd874d7253af650d7d265a5dd259a16d838593e99252d3ed5409b84a2d3e864e'
        },
        {
          account_identifier: {
            address: '1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5'
          },
          signature_type: SIGNATURE_TYPE,
          hex_bytes: 'bd874d7253af650d7d265a5dd259a16d838593e99252d3ed5409b84a2d3e864e'
        }
      ]
    });
  });
  test('Should return a valid unsigned transaction hash when sending valid operations including pool registration with no pool metadata', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_NO_METADATA
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      unsigned_transaction: CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_NO_METADATA_RESPONSE,
      payloads: [
        {
          account_identifier: {
            address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
          },
          signature_type: SIGNATURE_TYPE,
          hex_bytes: 'f7eb90cf4a22f0f214f37feaa00000683857e4216999ca089bab94cc012d83a9'
        },
        {
          account_identifier: {
            address: 'stake1uxly0q2cnpxrjrqm9vpnr9dwkr0j945gulhhgs3dx33l47sweg9er'
          },
          signature_type: SIGNATURE_TYPE,
          hex_bytes: 'f7eb90cf4a22f0f214f37feaa00000683857e4216999ca089bab94cc012d83a9'
        },
        {
          account_identifier: {
            address: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5'
          },
          signature_type: SIGNATURE_TYPE,
          hex_bytes: 'f7eb90cf4a22f0f214f37feaa00000683857e4216999ca089bab94cc012d83a9'
        },
        {
          account_identifier: {
            address: '1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5'
          },
          hex_bytes: 'f7eb90cf4a22f0f214f37feaa00000683857e4216999ca089bab94cc012d83a9',
          signature_type: 'ed25519'
        }
      ]
    });
  });
  test('Should return a valid unsigned transaction hash when sending valid operations including pool registration with multiple relays', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_MULTIPLE_RELAY
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      unsigned_transaction: CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_MULTIPLE_RELAY_RESPONSE,
      payloads: [
        {
          account_identifier: {
            address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
          },
          signature_type: SIGNATURE_TYPE,
          hex_bytes: '4c860e86b15288caf28e719ec322da4943401bed4a31c4039052d46526a1d835'
        },
        {
          account_identifier: {
            address: 'stake1uxly0q2cnpxrjrqm9vpnr9dwkr0j945gulhhgs3dx33l47sweg9er'
          },
          signature_type: SIGNATURE_TYPE,
          hex_bytes: '4c860e86b15288caf28e719ec322da4943401bed4a31c4039052d46526a1d835'
        },
        {
          account_identifier: {
            address: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5'
          },
          signature_type: SIGNATURE_TYPE,
          hex_bytes: '4c860e86b15288caf28e719ec322da4943401bed4a31c4039052d46526a1d835'
        },
        {
          account_identifier: {
            address: '1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5'
          },
          hex_bytes: '4c860e86b15288caf28e719ec322da4943401bed4a31c4039052d46526a1d835',
          signature_type: 'ed25519'
        }
      ]
    });
  });
  test('Should throw an error when there are operations including pool registration with invalid cold key hash', async () => {
    const invalidAccountIdentifier = {
      address: 'invalidHexString'
    };
    const payload = modifyAccount(
      CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_NO_METADATA,
      invalidAccountIdentifier,
      OperationType.POOL_REGISTRATION
    );
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4025,
      details: {
        message:
          // eslint-disable-next-line max-len
          "Deserialization failed in Ed25519KeyHash because: Invalid cbor: expected tuple 'hash length' of length 28 but got length Len(0)."
      },
      message: 'Provided pool key hash has invalid format',
      retriable: false
    });
  });
  test('Should throw an error when there are operations including pool registration with missing cold key hash', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_NO_COLD_KEY
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4020,
      message: 'Pool key hash is required to operate',
      retriable: false
    });
  });
  test('Should throw an error when there are operations including pool registration with empty pool relays', async () => {
    const emptyPoolRelays = {
      vrfKeyHash: '8dd154228946bd12967c12bedb1cb6038b78f8b84a1760b1a788fa72a4af3db0',
      rewardAddress: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5',
      pledge: '5000000',
      cost: '3000000',
      poolOwners: ['stake1uxly0q2cnpxrjrqm9vpnr9dwkr0j945gulhhgs3dx33l47sweg9er'],
      relays: [],
      margin: {
        numerator: '1',
        denominator: '1'
      },
      poolMetadata: {
        url: 'poolMetadataUrl',
        hash: '9ac2217288d1ae0b4e15c41b58d3e05a13206fd9ab81cb15943e4174bf30c90b'
      }
    };
    const payload = modfyPoolParameters(CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_NO_METADATA, emptyPoolRelays);
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4030,
      message: 'Pool relays are invalid',
      details: { message: 'Empty relays received' },
      retriable: false
    });
  });
  test('Should throw an error when there are operations including pool registration with invalid pool relay type', async () => {
    const invalidPoolRelays = {
      vrfKeyHash: '8dd154228946bd12967c12bedb1cb6038b78f8b84a1760b1a788fa72a4af3db0',
      rewardAddress: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5',
      pledge: '5000000',
      cost: '3000000',
      poolOwners: ['stake1uxly0q2cnpxrjrqm9vpnr9dwkr0j945gulhhgs3dx33l47sweg9er'],
      relays: [{ type: 'invalidType' }],
      margin: {
        numerator: '1',
        denominator: '1'
      },
      poolMetadata: {
        url: 'poolMetadataUrl',
        hash: '9ac2217288d1ae0b4e15c41b58d3e05a13206fd9ab81cb15943e4174bf30c90b'
      }
    };
    const payload = modfyPoolParameters(
      CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_NO_METADATA,
      invalidPoolRelays
    );
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4030,
      message: 'Pool relays are invalid',
      details: { message: 'Error: Invalid pool relay type received' },
      retriable: false
    });
  });
  test('Should throw an error when there are operations including pool registration with missing pool relay type', async () => {
    const invalidPoolRelays = {
      vrfKeyHash: '8dd154228946bd12967c12bedb1cb6038b78f8b84a1760b1a788fa72a4af3db0',
      rewardAddress: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5',
      pledge: '5000000',
      cost: '3000000',
      poolOwners: ['stake1uxly0q2cnpxrjrqm9vpnr9dwkr0j945gulhhgs3dx33l47sweg9er'],
      relays: [{ dnsName: 'dnsName', port: '2020' }],
      margin: {
        numerator: '1',
        denominator: '1'
      },
      poolMetadata: {
        url: 'poolMetadataUrl',
        hash: '9ac2217288d1ae0b4e15c41b58d3e05a13206fd9ab81cb15943e4174bf30c90b'
      }
    };
    const payload = modfyPoolParameters(
      CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_NO_METADATA,
      invalidPoolRelays
    );
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4030,
      message: 'Pool relays are invalid',
      details: { message: 'Error: Invalid pool relay type received' },
      retriable: false
    });
  });
  test('Should throw an error when there are operations including pool registration with invalid pool relays with invalid ipv4', async () => {
    const invalidPoolRelays = {
      vrfKeyHash: '8dd154228946bd12967c12bedb1cb6038b78f8b84a1760b1a788fa72a4af3db0',
      rewardAddress: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5',
      pledge: '5000000',
      cost: '3000000',
      poolOwners: ['stake1uxly0q2cnpxrjrqm9vpnr9dwkr0j945gulhhgs3dx33l47sweg9er'],
      relays: [{ type: 'single_host_addr', ipv4: 'notAHexString' }],
      margin: {
        numerator: '1',
        denominator: '1'
      },
      poolMetadata: {
        url: 'poolMetadataUrl',
        hash: '9ac2217288d1ae0b4e15c41b58d3e05a13206fd9ab81cb15943e4174bf30c90b'
      }
    };
    const payload = modfyPoolParameters(
      CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_NO_METADATA,
      invalidPoolRelays
    );
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4030,
      message: 'Pool relays are invalid',
      details: {
        // eslint-disable-next-line quotes
        message: `Deserialization failed in Ipv4 because: Invalid cbor: expected tuple 'Ipv4 address length' of length 4 but got length Len(1).`
      },
      retriable: false
    });
  });
  test('Should throw an error when there are operations including pool registration with invalid pool relays with invalid port', async () => {
    const invalidPoolRelays = {
      vrfKeyHash: '8dd154228946bd12967c12bedb1cb6038b78f8b84a1760b1a788fa72a4af3db0',
      rewardAddress: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5',
      pledge: '5000000',
      cost: '3000000',
      poolOwners: ['stake1uxly0q2cnpxrjrqm9vpnr9dwkr0j945gulhhgs3dx33l47sweg9er'],
      relays: [{ type: 'single_host_name', dnsName: 'dnsName', port: 'NaN' }],
      margin: {
        numerator: '1',
        denominator: '1'
      },
      poolMetadata: {
        url: 'poolMetadataUrl',
        hash: '9ac2217288d1ae0b4e15c41b58d3e05a13206fd9ab81cb15943e4174bf30c90b'
      }
    };
    const payload = modfyPoolParameters(
      CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_NO_METADATA,
      invalidPoolRelays
    );
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4030,
      message: 'Pool relays are invalid',
      details: {
        message: 'Invalid port NaN received'
      },
      retriable: false
    });
  });
  test('Should throw an error when there are operations including pool registration with pool relays with invalid pool metadata hash', async () => {
    const invalidMetadataHash = 'invalidMetadataHash';
    const invalidPoolRelays = {
      vrfKeyHash: '8dd154228946bd12967c12bedb1cb6038b78f8b84a1760b1a788fa72a4af3db0',
      rewardAddress: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5',
      pledge: '5000000',
      cost: '3000000',
      poolOwners: ['stake1uxly0q2cnpxrjrqm9vpnr9dwkr0j945gulhhgs3dx33l47sweg9er'],
      relays: [{ type: 'single_host_addr', dnsName: 'dnsName', port: '2020' }],
      margin: {
        numerator: '1',
        denominator: '1'
      },
      poolMetadata: {
        url: 'poolMetadataUrl',
        hash: invalidMetadataHash
      }
    };
    const payload = modfyPoolParameters(
      CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_NO_METADATA,
      invalidPoolRelays
    );
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4031,
      message: 'Pool metadata is invalid',
      details: {
        // eslint-disable-next-line quotes
        message: `Deserialization failed in PoolMetadataHash because: Invalid cbor: expected tuple 'hash length' of length 32 but got length Len(0).`
      },
      retriable: false
    });
  });
  test('Should throw an error when there are operations including pool registration with pool relays with invalid pool owners', async () => {
    const invalidPoolOwner = 'notAValidAddress';
    const invalidPoolRelays = {
      vrfKeyHash: '8dd154228946bd12967c12bedb1cb6038b78f8b84a1760b1a788fa72a4af3db0',
      rewardAddress: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5',
      pledge: '5000000',
      cost: '3000000',
      poolOwners: [invalidPoolOwner],
      relays: [{ type: 'single_host_addr', dnsName: 'dnsName', port: '2020' }],
      margin: {
        numerator: '1',
        denominator: '1'
      },
      poolMetadata: {
        url: 'poolMetadataUrl',
        hash: '9ac2217288d1ae0b4e15c41b58d3e05a13206fd9ab81cb15943e4174bf30c90b'
      }
    };
    const payload = modfyPoolParameters(
      CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_NO_METADATA,
      invalidPoolRelays
    );
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4034,
      message: 'Invalid pool owners received',
      details: {
        // eslint-disable-next-line quotes
        message: `missing human-readable separator, \"1\"`
      },
      retriable: false
    });
  });
  test('Should throw an error when there are operations including pool registration with negative cost', async () => {
    const invalidPoolRelays = {
      vrfKeyHash: '8dd154228946bd12967c12bedb1cb6038b78f8b84a1760b1a788fa72a4af3db0',
      rewardAddress: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5',
      pledge: '5000000',
      cost: '-3000000',
      poolOwners: ['stake1uxly0q2cnpxrjrqm9vpnr9dwkr0j945gulhhgs3dx33l47sweg9er'],
      relays: [{ type: 'single_host_addr', dnsName: 'dnsName', port: '2020' }],
      margin: {
        numerator: '1',
        denominator: '1'
      },
      poolMetadata: {
        url: 'poolMetadataUrl',
        hash: '9ac2217288d1ae0b4e15c41b58d3e05a13206fd9ab81cb15943e4174bf30c90b'
      }
    };
    const payload = modfyPoolParameters(
      CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_NO_METADATA,
      invalidPoolRelays
    );
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4035,
      message: 'Invalid pool registration parameters received',
      details: {
        message: 'Given cost -3000000 is invalid'
      },
      retriable: false
    });
  });
  test('Should throw an error when there are operations including pool registration with pool relays with negative pledge', async () => {
    const invalidPoolRelays = {
      vrfKeyHash: '8dd154228946bd12967c12bedb1cb6038b78f8b84a1760b1a788fa72a4af3db0',
      rewardAddress: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5',
      pledge: '-5000000',
      cost: '3000000',
      poolOwners: ['stake1uxly0q2cnpxrjrqm9vpnr9dwkr0j945gulhhgs3dx33l47sweg9er'],
      relays: [{ type: 'single_host_addr', dnsName: 'dnsName', port: '2020' }],
      margin: {
        numerator: '1',
        denominator: '1'
      },
      poolMetadata: {
        url: 'poolMetadataUrl',
        hash: '9ac2217288d1ae0b4e15c41b58d3e05a13206fd9ab81cb15943e4174bf30c90b'
      }
    };
    const payload = modfyPoolParameters(
      CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_NO_METADATA,
      invalidPoolRelays
    );
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4035,
      message: 'Invalid pool registration parameters received',
      details: {
        message: 'Given pledge -5000000 is invalid'
      },
      retriable: false
    });
  });
  test('Should throw an error when there are operations including pool registration with pool relays with negative denominator', async () => {
    const invalidPoolRelays = {
      vrfKeyHash: '8dd154228946bd12967c12bedb1cb6038b78f8b84a1760b1a788fa72a4af3db0',
      rewardAddress: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5',
      pledge: '5000000',
      cost: '3000000',
      poolOwners: ['stake1uxly0q2cnpxrjrqm9vpnr9dwkr0j945gulhhgs3dx33l47sweg9er'],
      relays: [{ type: 'single_host_addr', dnsName: 'dnsName', port: '2020' }],
      margin: {
        numerator: '1',
        denominator: '-1'
      },
      poolMetadata: {
        url: 'poolMetadataUrl',
        hash: '9ac2217288d1ae0b4e15c41b58d3e05a13206fd9ab81cb15943e4174bf30c90b'
      }
    };
    const payload = modfyPoolParameters(
      CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_NO_METADATA,
      invalidPoolRelays
    );
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4035,
      message: 'Invalid pool registration parameters received',
      details: {
        message: 'Given denominator -1 is invalid'
      },
      retriable: false
    });
  });
  test('Should throw an error when there are operations including pool registration with pool relays with alphabetical numerator', async () => {
    const invalidPoolRelays = {
      vrfKeyHash: '8dd154228946bd12967c12bedb1cb6038b78f8b84a1760b1a788fa72a4af3db0',
      rewardAddress: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5',
      pledge: '5000000',
      cost: '3000000',
      poolOwners: ['stake1uxly0q2cnpxrjrqm9vpnr9dwkr0j945gulhhgs3dx33l47sweg9er'],
      relays: [{ type: 'single_host_addr', dnsName: 'dnsName', port: '2020' }],
      margin: {
        numerator: '1asad',
        denominator: '1'
      },
      poolMetadata: {
        url: 'poolMetadataUrl',
        hash: '9ac2217288d1ae0b4e15c41b58d3e05a13206fd9ab81cb15943e4174bf30c90b'
      }
    };
    const payload = modfyPoolParameters(
      CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_NO_METADATA,
      invalidPoolRelays
    );
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4035,
      message: 'Invalid pool registration parameters received',
      details: {
        message: 'ParseIntError { kind: InvalidDigit }'
      },
      retriable: false
    });
  });

  test('Should throw an error when there are operations including pool registration with no margin', async () => {
    const invalidPoolRelays = {
      vrfKeyHash: '8dd154228946bd12967c12bedb1cb6038b78f8b84a1760b1a788fa72a4af3db0',
      rewardAddress: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5',
      pledge: '5000000',
      cost: '3000000',
      poolOwners: ['stake1uxly0q2cnpxrjrqm9vpnr9dwkr0j945gulhhgs3dx33l47sweg9er'],
      relays: [{ type: 'single_host_addr', dnsName: 'dnsName', port: '2020' }],
      poolMetadata: {
        url: 'poolMetadataUrl',
        hash: '9ac2217288d1ae0b4e15c41b58d3e05a13206fd9ab81cb15943e4174bf30c90b'
      }
    };
    const payload = modfyPoolParameters(
      CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_NO_METADATA,
      invalidPoolRelays
    );
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4035,
      message: 'Invalid pool registration parameters received',
      details: {
        message: 'Missing margin parameter at pool registration parameters'
      },
      retriable: false
    });
  });
  test('Should throw an error when there are operations including pool registration with invalid reward address', async () => {
    const payloadWithInvalidAddress = {
      vrfKeyHash: '8dd154228946bd12967c12bedb1cb6038b78f8b84a1760b1a788fa72a4af3db0',
      rewardAddress: 'notAValidAddress',
      pledge: '5000000',
      cost: '3000000',
      poolOwners: ['stake1uxly0q2cnpxrjrqm9vpnr9dwkr0j945gulhhgs3dx33l47sweg9er'],
      relays: [{ type: 'single_host_addr', dnsName: 'dnsName', port: '2020' }],
      margin: {
        numerator: '1',
        denominator: '1'
      },
      poolMetadata: {
        url: 'poolMetadataUrl',
        hash: '9ac2217288d1ae0b4e15c41b58d3e05a13206fd9ab81cb15943e4174bf30c90b'
      }
    };
    const payload = modfyPoolParameters(
      CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_NO_METADATA,
      payloadWithInvalidAddress
    );
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4015,
      message: 'Provided address is invalid',
      retriable: true
    });
  });
});
describe('Pool Registration with certification', () => {
  let database: Pool;
  let server: FastifyInstance;

  beforeAll(async () => {
    database = setupDatabase();
    server = setupServer(database);
  });

  afterAll(async () => {
    await database.end();
  });
  test('Should return a valid unsigned transaction hash when sending valid operations with pool registration with cert', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_CERT
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      unsigned_transaction: CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_CERT_RESPONSE,
      payloads: [
        {
          account_identifier: {
            address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
          },
          signature_type: SIGNATURE_TYPE,
          hex_bytes: '36939bdede6c9170adea85911197806bca6a25bb56ef2d09ed7c407a31789eb8'
        },
        {
          account_identifier: {
            address: 'stake1u9af5n26dtr6nkrs9qv05049x0jkcncau9k6vyd8xrhr7qq8tez5p'
          },
          signature_type: SIGNATURE_TYPE,
          hex_bytes: '36939bdede6c9170adea85911197806bca6a25bb56ef2d09ed7c407a31789eb8'
        },
        {
          account_identifier: {
            address: '1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5'
          },
          signature_type: SIGNATURE_TYPE,
          hex_bytes: '36939bdede6c9170adea85911197806bca6a25bb56ef2d09ed7c407a31789eb8'
        },
        {
          account_identifier: {
            address: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5'
          },
          signature_type: SIGNATURE_TYPE,
          hex_bytes: '36939bdede6c9170adea85911197806bca6a25bb56ef2d09ed7c407a31789eb8'
        }
      ]
    });
  });
  test('Should throw an error when sending operations with pool registration with invalid cert', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_INVALID_CERT
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4027,
      message: 'Invalid pool registration certificate format',
      details: {
        message:
          'Deserialization failed in CertificateEnum because: Invalid cbor: not enough bytes, expect 0 bytes but received 0 bytes.'
      },
      retriable: false
    });
  });
  test('Should throw an error when sending operations with pool registration with invalid cert type', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_INVALID_CERT_TYPE
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4028,
      message: 'Invalid certificate type. Expected pool registration certificate',
      retriable: false
    });
  });
});

describe('Vote Registration', () => {
  let database: Pool;
  let server: FastifyInstance;

  beforeAll(async () => {
    database = setupDatabase();
    server = setupServer(database);
  });

  afterAll(async () => {
    await database.end();
  });

  test('Should return a valid unsigned transaction hash when sending valid operations with a vote registration', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      unsigned_transaction: CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_RESPONSE,
      payloads: [
        {
          account_identifier: {
            address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
          },
          signature_type: SIGNATURE_TYPE,
          hex_bytes: '91dd32dbf59dc3295f53f1dc0ac02d317e139b1c4a26fef4c4172b4b9b0a2de1'
        }
      ]
    });
  });
  test('Should throw an error when the voting key is empty', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_WITH_NO_VOTING_KEY
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 5009,
      message: 'Voting key is missing',
      retriable: false
    });
  });
  test('Should throw an error when the voting key is not valid', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_WITH_INVALID_VOTING_KEY
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 5010,
      message: 'Voting key format is invalid',
      retriable: false
    });
  });
  test('Should throw an error when the reward address is empty', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_WITH_NO_REWARD_ADDRESS
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4015,
      message: 'Provided address is invalid',
      retriable: true
    });
  });
  test('Should throw an error when the reward address is not valid', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_WITH_INVALID_REWARD_ADDRESS
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4015,
      message: 'Provided address is invalid',
      retriable: true
    });
  });
  test('Should throw an error when the stake key is empty', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_WITH_NO_STAKE_KEY
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4018,
      message: 'Staking key is required for this type of address',
      retriable: false
    });
  });
  test('Should throw an error when the stake key is not valid', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_WITH_INVALID_STAKE_KEY
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4017,
      message: 'Invalid staking key format',
      retriable: false
    });
  });
  test('Should throw an error when the voting nonce is not greater than zero', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_WITH_INVALID_NONCE
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 5007,
      message: 'Voting nonce not valid',
      retriable: false
    });
  });
  test('Should throw an error when the voting signature is empty', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_WITH_NO_SIGNATURE
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 5008,
      message: 'Invalid voting signature',
      retriable: false
    });
  });
  test('Should throw an error when the voting signature is not valid', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_WITH_INVALID_SIGNATURE
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 5008,
      message: 'Invalid voting signature',
      retriable: false
    });
  });
  test('Should throw an error when the transaction has no metadata', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_WITH_NO_METADATA
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 5011,
      message: 'Missing vote registration metadata',
      retriable: false
    });
  });
  test('Should throw an error when there is no vote registration metadata', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_WITH_EMPTY_METADATA
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 5011,
      message: 'Missing vote registration metadata',
      retriable: false
    });
  });
});
