/* eslint-disable camelcase */
import StatusCodes from 'http-status-codes';
import { Pool } from 'pg';
import { FastifyInstance } from 'fastify';
import { setupDatabase, setupServer, testInvalidNetworkParameters } from '../utils/test-utils';
import {
  CONSTRUCTION_PAYLOADS_REQUEST,
  CONSTRUCTION_PAYLOADS_REQUEST_INVALID_INPUTS,
  CONSTRUCTION_PAYLOADS_REQUEST_INVALID_OUTPUTS,
  CONSTRUCTION_PAYLOADS_REQUEST_INVALID_TRANSACTION_ID,
  CONSTRUCTION_PAYLOADS_RESPONSE
} from '../fixture-data';
import { SIGNATURE_TYPE } from '../../../src/server/utils/constants';

const CONSTRUCTION_PAYLOADS_ENDPOINT = '/construction/payloads';

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

  test('Should return a valid unsigned transaction hash whenever valid operations are sent as parameters', async () => {
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
    const bigOutput = CONSTRUCTION_PAYLOADS_REQUEST_INVALID_OUTPUTS.operations[2];
    CONSTRUCTION_PAYLOADS_REQUEST_INVALID_OUTPUTS.operations.push(bigOutput);
    CONSTRUCTION_PAYLOADS_REQUEST_INVALID_OUTPUTS.operations.push(bigOutput);
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PAYLOADS_ENDPOINT,
      payload: CONSTRUCTION_PAYLOADS_REQUEST_INVALID_OUTPUTS
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4010,
      message: 'The transaction you are trying to build has more outputs than inputs',
      retriable: false
    });
  });
});
