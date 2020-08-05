/* eslint-disable camelcase */
import { FastifyInstance } from 'fastify';
import StatusCodes from 'http-status-codes';
import { Pool } from 'pg';
import { setupDatabase, setupServer } from './utils/test-utils';

const generatePayload = (blockchain: string, network: string, key?: string, curveType?: string) => ({
  // eslint-disable-next-line camelcase
  network_identifier: {
    blockchain,
    network
  },
  public_key: {
    hex_bytes: key || '1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F',
    curve_type: curveType || 'edwards25519'
  }
});

const CONSTRUCTION_DERIVE_ENDPOINT = '/construction/derive';
const INVALID_PUBLIC_KEY_FORMAT = 'Invalid public key format';

describe(CONSTRUCTION_DERIVE_ENDPOINT, () => {
  let database: Pool;
  let server: FastifyInstance;
  beforeAll(async () => {
    database = setupDatabase();
    server = setupServer(database);
  });

  afterAll(async () => {
    await database.end();
  });

  test('Should return the address corresponding to the public key and mainnet network when providing a valid public key', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_DERIVE_ENDPOINT,
      payload: generatePayload('cardano', 'mainnet')
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json().address).toEqual('addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx');
  });

  test('Should return an error when the public key has a lower length than 32', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_DERIVE_ENDPOINT,
      payload: generatePayload('cardano', 'mainnet', 'smallPublicKey')
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({ code: 4007, message: INVALID_PUBLIC_KEY_FORMAT, retriable: false });
  });

  test('Should return an error when the public key has a bigger length than 32', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_DERIVE_ENDPOINT,
      payload: generatePayload(
        'cardano',
        'mainnet',
        'ThisIsABiggerPublicKeyForTestingPurposesThisIsABiggerPublicKeyForTestingPurposes'
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({ code: 4007, message: INVALID_PUBLIC_KEY_FORMAT, retriable: false });
  });

  test('Should return an error the network parameter is an invalid one', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_DERIVE_ENDPOINT,
      payload: generatePayload(
        'bitcoin',
        'testnet',
        'ThisIsABiggerPublicKeyForTestingPurposesThisIsABiggerPublicKeyForTestingPurposes'
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({ code: 4004, message: 'Invalid blockchain', retriable: false });
  });

  test('Should return an error when the curve type is invalid', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_DERIVE_ENDPOINT,
      payload: generatePayload(
        'cardano',
        'mainnet',
        '1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F',
        'secp256k1'
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({ code: 4007, message: INVALID_PUBLIC_KEY_FORMAT, retriable: false });
  });
});
