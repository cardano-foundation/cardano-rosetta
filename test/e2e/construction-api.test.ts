/* eslint-disable no-magic-numbers */
/* eslint-disable camelcase */
import { FastifyInstance } from 'fastify';
import StatusCodes from 'http-status-codes';
import { Pool } from 'pg';
import { setupDatabase, setupServer } from './utils/test-utils';
import {
  CONSTRUCTION_PAYLOADS_REQUEST,
  CONSTRUCTION_PAYLOADS_REQUEST_INVALID_INPUTS,
  CONSTRUCTION_PAYLOADS_REQUEST_INVALID_OUTPUTS
} from './fixture-data';

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
const generateMetadataPayload = (blockchain: string, network: string, relativeTtl: number) => ({
  network_identifier: {
    blockchain,
    network
  },
  options: {
    relative_ttl: relativeTtl
  }
});

const CONSTRUCTION_DERIVE_ENDPOINT = '/construction/derive';
const CONSTRUCTION_HASH_ENDPOINT = '/construction/hash';
const CONSTRUCTION_METADATA_ENDPOINT = '/construction/metadata';
const CONSTRUCTION_COMBINE_ENDPOINT = '/construction/combine';
const CONSTRUCTION_PAYLOADS_ENDPOINT = '/construction/payloads';
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
    // These function's parameters were created using `cardano-cli shelley transacion build raw`
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
  describe(CONSTRUCTION_METADATA_ENDPOINT, () => {
    test('Should return a valid TTL when the parameters are valid', async () => {
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_METADATA_ENDPOINT,
        payload: generateMetadataPayload('cardano', 'mainnet', 100)
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({ metadata: { ttl: '65294' } });
    });

    test('Should throw invalid blockchain error when the blockchain specified is invalid', async () => {
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_METADATA_ENDPOINT,
        payload: generateMetadataPayload('bitcoin', 'mainnet', 100)
      });
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.json()).toEqual({
        code: 4004,
        message: 'Invalid blockchain',
        retriable: false
      });
    });

    test('Should throw invalid network error when the network specified is invalid', async () => {
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_METADATA_ENDPOINT,
        payload: generateMetadataPayload('cardano', 'testnet', 100)
      });
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.json()).toEqual({
        code: 4002,
        message: 'Network not found',
        retriable: false
      });
    });
  });

  describe(CONSTRUCTION_COMBINE_ENDPOINT, () => {
    /**
     * All test vectors built in /construction/combine tests were generated using these scripts:
     * $> cardano-cli shelley transaction build-raw \
     *    --tx-in 10c3c63f2a97ce531730fd2bd708cda1eb08920f79d2abeeb833c7089f13c54e#0 \
     *    --tx-out Ae2tdPwUPEYwvsWu2uaXGK8NQN2R97J9qDbYqqVnFnBotch3Sjvmzoop3eM+20 --ttl 20 \
     *    --fee 177398 --out-file /tmp/unsigned.txt
     * $> cardano-cli shelley transaction witness --tx-body-file /tmp/unsigned.txt \
     *    --mainnet --out-file /tmp/witness --witness-signing-key-file ../sign.txt
     * $> cardano-cli shelley transaction sign --tx-body-file /tmp/unsigned.txt \
     *    --mainnet --out-file /tmp/signed --signing-key-file ../sign.txt
     */
    test('Should return signed transaction when providing valide unsigned transaction and signatures', async () => {
      const payload = {
        network_identifier: {
          blockchain: 'cardano',
          network: 'mainnet'
        },
        unsigned_transaction:
          'a4008182582010c3c63f2a97ce531730fd2bd708cda1eb08920f79d2abeeb833c7089f13c54e00018182582b82d818582183581c0b40138c75daebf910edf9cb34024528cab10c74ed2a897c37b464b0a0001a777c6af614021a0002b4f60314',
        signatures: [
          {
            signing_payload: {
              address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx',
              hex_bytes: '31fc9813a71d8db12a4f2e3382ab0671005665b70d0cd1a9fb6c4a4e9ceabc90',
              signature_type: 'ecdsa'
            },
            public_key: {
              hex_bytes: '58201b400d60aaf34eaf6dcbab9bba46001a23497886cf11066f7846933d30e5ad3f',
              curve_type: 'edwards25519'
            },
            signature_type: 'ecdsa',
            hex_bytes:
              '8258201b400d60aaf34eaf6dcbab9bba46001a23497886cf11066f7846933d30e5ad3f58406c92508135cb060187a2706ade8154782867b1526e9615d06742be5c56f037ab85894c098c2ab07971133c0477baee92adf3527ad7cc816f13e1e4c361041206'
          }
        ]
      };
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_COMBINE_ENDPOINT,
        payload
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json().signed_transaction).toEqual(
        '0x83a4008182582010c3c63f2a97ce531730fd2bd708cda1eb08920f79d2abeeb833c7089f13c54e00018182582b82d818582183581c0b40138c75daebf910edf9cb34024528cab10c74ed2a897c37b464b0a0001a777c6af614021a0002b4f60314a100818258201b400d60aaf34eaf6dcbab9bba46001a23497886cf11066f7846933d30e5ad3f58406c92508135cb060187a2706ade8154782867b1526e9615d06742be5c56f037ab85894c098c2ab07971133c0477baee92adf3527ad7cc816f13e1e4c361041206f6'
      );
    });
    test('Should return error when providing valid unsigned transaction but invalid signatures', async () => {
      const payload = {
        network_identifier: {
          blockchain: 'cardano',
          network: 'mainnet'
        },
        unsigned_transaction:
          'a4008182582010c3c63f2a97ce531730fd2bd708cda1eb08920f79d2abeeb833c7089f13c54e00018182582b82d818582183581c0b40138c75daebf910edf9cb34024528cab10c74ed2a897c37b464b0a0001a777c6af614021a0002b4f60314',
        signatures: [
          {
            signing_payload: {
              address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkx',
              hex_bytes: '31fc9813a71d8db12a4f2e3382ab0671005665b70d0cd1a9fb6c4a4e9ceabc90',
              signature_type: 'ecdsa'
            },
            public_key: {
              hex_bytes: '58201b400d60aaf34eaf6dcbab9bba46001a23497886cf11066f7846933d30e5ad3f',
              curve_type: 'edwards25519'
            },
            signature_type: 'ecdsa',
            hex_bytes: 'signatureHexInvalidBytes'
          }
        ]
      };
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_COMBINE_ENDPOINT,
        payload
      });
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.json()).toEqual({
        code: 5007,
        message: 'Cant build witnesses set for transaction probably because of provided signatures',
        retriable: false
      });
    });

    test('Should return error when providing valid signatures but invalid transactions', async () => {
      const payload = {
        network_identifier: {
          blockchain: 'cardano',
          network: 'mainnet'
        },
        unsigned_transaction: 'InvalidTransaction',
        signatures: [
          {
            signing_payload: {
              address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx',
              hex_bytes: '31fc9813a71d8db12a4f2e3382ab0671005665b70d0cd1a9fb6c4a4e9ceabc90',
              signature_type: 'ecdsa'
            },
            public_key: {
              hex_bytes: '58201b400d60aaf34eaf6dcbab9bba46001a23497886cf11066f7846933d30e5ad3f',
              curve_type: 'edwards25519'
            },
            signature_type: 'ecdsa',
            hex_bytes:
              '8258201b400d60aaf34eaf6dcbab9bba46001a23497886cf11066f7846933d30e5ad3f58406c92508135cb060187a2706ade8154782867b1526e9615d06742be5c56f037ab85894c098c2ab07971133c0477baee92adf3527ad7cc816f13e1e4c361041206'
          }
        ]
      };
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_COMBINE_ENDPOINT,
        payload
      });
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.json()).toEqual({
        code: 5006,
        message: 'Cant create signed transaction probably because of unsigned transaction bytes',
        retriable: false
      });
    });
  });

  describe(CONSTRUCTION_PAYLOADS_ENDPOINT, () => {
    // This test vector was generated using
    // ./cardano-cli shelley transaction build-raw --tx-in 2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f#1 \
    //  --tx-out addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx +10000 \
    //  --tx-out addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx+40000  --ttl 1000 --fee 40000 --out-file /tmp/tx.txt
    //     And the output was hashed using:
    // import { createHash } from "blake2";
    // const txBuffer = Buffer.from(
    //   "a400818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c4002199c40031903e8",
    //   "hex"
    // );
    // var h = createHash("blake2b", { digestLength: 32 });
    // h.update(txBuffer);
    // console.log(h.digest("hex"))
    test('Should return a valid unsigned transaction hash whenever valid operations are sent as parameters', async () => {
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_PAYLOADS_ENDPOINT,
        payload: CONSTRUCTION_PAYLOADS_REQUEST
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        unsigned_transaction:
          '0xa400818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c4002199c40031903e8',
        payloads: [
          {
            address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx',
            hex_bytes: '0x333a6ccaaa639f7b451ce93764f54f654ef499fdb7b8b24374ee9d99eab9d795',
            signature_type: 'ecdsa'
          }
        ]
      });
    });
    test('Should throw an erorr when invalid inputs are sent as parameters', async () => {
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_PAYLOADS_ENDPOINT,
        payload: CONSTRUCTION_PAYLOADS_REQUEST_INVALID_INPUTS
      });
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.json()).toEqual({
        code: 4008,
        message: 'Transaction inputs parameters errors in operations array',
        retriable: false
      });
    });

    test('Should throw an erorr when invalid outputs are sent as parameters', async () => {
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_PAYLOADS_ENDPOINT,
        payload: CONSTRUCTION_PAYLOADS_REQUEST_INVALID_OUTPUTS
      });
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.json()).toEqual({
        code: 4009,
        message: 'Transaction outputs parameters errors in operations array',
        retriable: false
      });
    });

    test('Should throw an erorr when more outputs sum is bigger than inputs sum', async () => {
      // We are triplicating the last output of 40k amount
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
});
