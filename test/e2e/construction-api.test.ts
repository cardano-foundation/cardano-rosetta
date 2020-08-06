/* eslint-disable camelcase */
import { FastifyInstance } from 'fastify';
import StatusCodes from 'http-status-codes';
import { Pool } from 'pg';
import { setupDatabase, setupServer } from './utils/test-utils';

const generatePayload = (blockchain: string, network: string, key?: string, curveType?: string) => ({
  network_identifier: {
    blockchain,
    network
  },
  public_key: {
    hex_bytes: key || '1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F',
    curve_type: curveType || 'edwards25519'
  }
});

const generatePayloadWithSignedTransaction = (blockchain: string, network: string, signedTransaction: string) => ({
  network_identifier: { blockchain, network },
  signed_transaction: signedTransaction
});

const CONSTRUCTION_DERIVE_ENDPOINT = '/construction/derive';
const CONSTRUCTION_HASH_ENDPOINT = '/construction/hash';
const INVALID_PUBLIC_KEY_FORMAT = 'Invalid public key format';

describe('Construction API', () => {
  let database: Pool;
  let server: FastifyInstance;
  beforeAll(async () => {
    database = setupDatabase();
    server = setupServer(database);
  });

  afterAll(async () => {
    await database.end();
  });

  describe(CONSTRUCTION_DERIVE_ENDPOINT, () => {
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

    test('Should return an error when the address has an invalid format', async () => {
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_DERIVE_ENDPOINT,
        payload: generatePayload(
          'cardano',
          'mainnet',
          '1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F__.'
        )
      });
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.json()).toEqual({ code: 4007, message: INVALID_PUBLIC_KEY_FORMAT, retriable: false });
    });
  });

  describe(CONSTRUCTION_HASH_ENDPOINT, () => {
    /**
     * These tests parameters where extracted from emurgo serialization examples:
     * https://github.com/Emurgo/cardano-serialization-lib/blob/master/example/index.spec.ts
     */

    test('Should return a valid hash when providing a proper signed transaction', async () => {
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_HASH_ENDPOINT,
        payload: generatePayloadWithSignedTransaction(
          'cardano',
          'mainnet',
          '83a400818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018182581d61a6274badf4c9ca583df893a73139625ff4dc73aaa3082e67d6d5d08e0102182a030aa10081825820e7d33eeb6f1df124f9f4c226428bc46b4c93ac4bc89dacc85748d1a2b47ded135840f39ee9a72d5de64b5a8ccffb7830cd7af4438944ffb16698f7e3b3a11ae684e14f213c5ac38a50852bf1d531f13f02fc0510610f7b549bec10d01dfe81ee080ef6'
        )
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transaction_identifier: { hash: '0x4827ce27820b2605e0314af4d52c8a2b697f2f7a37f08079bbc2f7102b0572d1' }
      });
    });
    test('Should return an error when providing an invalid transaction', async () => {
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_HASH_ENDPOINT,
        payload: generatePayloadWithSignedTransaction('cardano', 'mainnet', 'InvalidHashForTransaction')
      });
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.json()).toEqual({
        code: 5005,
        message: 'Parse signed transaction error',
        retriable: false
      });
    });
  });

  // These function's parameters were created using `cardano-cli shelley transacion sign`
  test('Should return a valid hash when providing a valid signed transaction', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_HASH_ENDPOINT,
      payload: generatePayloadWithSignedTransaction(
        'cardano',
        'mainnet',
        '83a4008182582010c3c63f2a97ce531730fd2bd708cda1eb08920f79d2abeeb833c7089f13c54e00018182582b82d818582183581c0b40138c75daebf910edf9cb34024528cab10c74ed2a897c37b464b0a0001a777c6af614021a0002b4f60314a10081825820d4b26cfd7d51b0c03bb899d7b55a0268e67110393b9426e88c21bd58c7bf14395840ee00ceaafc90676c7c19172aefd02721fe1a4443b01e82d498216d1b4d6f9beec3f98866b8a0cfddc5a2a94edcbab2a2638e161a143a43c1ffb776a8908ccd0ff6'
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      transaction_identifier: { hash: '0x31fc9813a71d8db12a4f2e3382ab0671005665b70d0cd1a9fb6c4a4e9ceabc90' }
    });
  });
});
