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
  CONSTRUCTION_PAYLOADS_WITHDRAWAL_RESPONSE,
  CONSTRUCTION_PAYLOADS_STAKE_REGISTRATION_AND_WITHDRAWAL_RESPONSE,
  CONSTRUCTION_PAYLOADS_INVALID_OPERATION_TYPE
} from '../fixture-data';
import { SIGNATURE_TYPE } from '../../../src/server/utils/constants';

const CONSTRUCTION_PAYLOADS_ENDPOINT = '/construction/payloads';

const INVALID_STAKING_KEY_FORMAT = { message: 'Invalid staking key format', code: 4017, retriable: false };

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

  test('Should throw an error when invalid transactionId is sent as input parameters', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_REQUEST_INVALID_TRANSACTION_ID
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4008,
      message: 'Transaction inputs parameters errors in operations array',
      retriable: false,
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
          hex_bytes: '77149f22f9b04c45bc30473d27ab5f8ed01d05cba04903169097b2033a25c67f'
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
          hex_bytes: '4bf7c4c3eae2e67e97a446aa4ea90f1bdb4b061c7e0affd15a79970edd93e61e'
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
        }
      ]
    });
  });

  test('Should return an error when staking key in one operation has invalid format', async () => {
    const { network_identifier, operations, metadata } = CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_REGISTRATION;
    const payload = {
      network_identifier,
      operations: operations.map(({ metadata: opMetadata, ...rest }) => ({
        metadata: opMetadata && {
          staking_credential: { hex_bytes: opMetadata.staking_credential.hex_bytes, curve_type: 'secp256k1' }
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
