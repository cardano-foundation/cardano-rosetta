/* eslint-disable no-magic-numbers */
/* eslint-disable camelcase */
import { FastifyInstance } from 'fastify';
import StatusCodes from 'http-status-codes';
import { Pool } from 'pg';
import { setupDatabase, setupServer, cardanoCliMock, testInvalidNetworkParameters } from './utils/test-utils';
import {
  CONSTRUCTION_PAYLOADS_REQUEST,
  CONSTRUCTION_PAYLOADS_REQUEST_INVALID_INPUTS,
  CONSTRUCTION_PAYLOADS_REQUEST_INVALID_OUTPUTS,
  transactionParsedOperations,
  CONSTRUCTION_PAYLOADS_REQUEST_INVALID_TRANSACTION_ID
} from './fixture-data';
import { CARDANO, MAINNET, SIGNATURE_TYPE } from '../../src/server/utils/constants';
import { Errors } from '../../src/server/utils/errors';

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

const generateProcessPayload = (blockchain: string, network: string, relativeTtl?: number) => ({
  network_identifier: {
    blockchain,
    network
  },
  operations: [],
  metadata: relativeTtl
    ? {
        relative_ttl: relativeTtl
      }
    : undefined
});

const CONSTRUCTION_DERIVE_ENDPOINT = '/construction/derive';
const CONSTRUCTION_HASH_ENDPOINT = '/construction/hash';
const CONSTRUCTION_PREPROCESS_ENDPOINT = '/construction/preprocess';
const CONSTRUCTION_METADATA_ENDPOINT = '/construction/metadata';
const CONSTRUCTION_COMBINE_ENDPOINT = '/construction/combine';
const CONSTRUCTION_PAYLOADS_ENDPOINT = '/construction/payloads';
const CONSTRUCTION_PARSE_ENDPOINT = '/construction/parse';
const CONSTRUCTION_SUBMIT_ENDPOINT = '/construction/submit';
const INVALID_PUBLIC_KEY_FORMAT = 'Invalid public key format';

describe('Construction API', () => {
  let database: Pool;
  let server: FastifyInstance;
  beforeAll(async () => {
    database = setupDatabase(true);
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

    testInvalidNetworkParameters(
      CONSTRUCTION_DERIVE_ENDPOINT,
      (blockchain, network) => generatePayload(blockchain, network),
      () => server
    );

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
    testInvalidNetworkParameters(
      CONSTRUCTION_HASH_ENDPOINT,
      (blockchain, network) => generatePayloadWithSignedTransaction(blockchain, network, 'encodedTx'),
      () => server
    );

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
        transaction_identifier: { hash: '4827ce27820b2605e0314af4d52c8a2b697f2f7a37f08079bbc2f7102b0572d1' }
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
        transaction_identifier: { hash: '31fc9813a71d8db12a4f2e3382ab0671005665b70d0cd1a9fb6c4a4e9ceabc90' }
      });
    });
  });

  describe(CONSTRUCTION_PREPROCESS_ENDPOINT, () => {
    testInvalidNetworkParameters(
      CONSTRUCTION_PREPROCESS_ENDPOINT,
      (blockchain, network) => generateProcessPayload(blockchain, network, 100),
      () => server
    );

    test('Should return a valid TTL when the parameters are valid', async () => {
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_PREPROCESS_ENDPOINT,
        payload: generateProcessPayload('cardano', 'mainnet', 100)
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({ options: { relative_ttl: 100 } });
    });

    test('Should return a TTL when using default relateive ttl', async () => {
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_PREPROCESS_ENDPOINT,
        payload: generateProcessPayload('cardano', 'mainnet', undefined)
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({ options: { relative_ttl: 1000 } });
    });
  });

  describe(CONSTRUCTION_METADATA_ENDPOINT, () => {
    beforeAll(async () => {
      database = setupDatabase(false);
      server = setupServer(database);
    });

    test('Should return a valid TTL when the parameters are valid', async () => {
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_METADATA_ENDPOINT,
        payload: generateMetadataPayload('cardano', 'mainnet', 100)
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({ metadata: { ttl: '65294' } });
    });

    testInvalidNetworkParameters(
      CONSTRUCTION_METADATA_ENDPOINT,
      (blockchain, network) => generateMetadataPayload(blockchain, network, 100),
      () => server
    );
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
              signature_type: SIGNATURE_TYPE
            },
            public_key: {
              hex_bytes: '1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F',
              curve_type: 'edwards25519'
            },
            signature_type: SIGNATURE_TYPE,
            hex_bytes:
              '6C92508135CB060187A2706ADE8154782867B1526E9615D06742BE5C56F037AB85894C098C2AB07971133C0477BAEE92ADF3527AD7CC816F13E1E4C361041206'
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
        '83a4008182582010c3c63f2a97ce531730fd2bd708cda1eb08920f79d2abeeb833c7089f13c54e00018182582b82d818582183581c0b40138c75daebf910edf9cb34024528cab10c74ed2a897c37b464b0a0001a777c6af614021a0002b4f60314a100818258201b400d60aaf34eaf6dcbab9bba46001a23497886cf11066f7846933d30e5ad3f58406c92508135cb060187a2706ade8154782867b1526e9615d06742be5c56f037ab85894c098c2ab07971133c0477baee92adf3527ad7cc816f13e1e4c361041206f6'
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
              signature_type: SIGNATURE_TYPE
            },
            public_key: {
              hex_bytes: '58201b400d60aaf34eaf6dcbab9bba46001a23497886cf11066f7846933d30e5ad3f',
              curve_type: 'edwards25519'
            },
            signature_type: SIGNATURE_TYPE,
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
              signature_type: SIGNATURE_TYPE
            },
            public_key: {
              hex_bytes: '1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F',
              curve_type: 'edwards25519'
            },
            signature_type: SIGNATURE_TYPE,
            hex_bytes:
              '6C92508135CB060187A2706ADE8154782867B1526E9615D06742BE5C56F037AB85894C098C2AB07971133C0477BAEE92ADF3527AD7CC816F13E1E4C361041206'
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
          'a400818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c4002199c40031903e8',
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
            // eslint-disable-next-line quotes
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

  // The test vectors used here refers to the same transaction, signed and unsigned, calculated in previous endpoints.
  describe(CONSTRUCTION_PARSE_ENDPOINT, () => {
    test('Should return 1 input, 2 outputs and signers if a valid signed transaction is set', async () => {
      const signedTransaction =
        '83a400818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c4002199c40031903e8a100818258201b400d60aaf34eaf6dcbab9bba46001a23497886cf11066f7846933d30e5ad3f58406c92508135cb060187a2706ade8154782867b1526e9615d06742be5c56f037ab85894c098c2ab07971133c0477baee92adf3527ad7cc816f13e1e4c361041206f6';
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_PARSE_ENDPOINT,
        payload: {
          network_identifier: { blockchain: CARDANO, network: MAINNET },
          signed: true,
          transaction: signedTransaction
        }
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json().operations).toEqual(transactionParsedOperations);
      expect(response.json().signers).toEqual(['bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb']);
    });

    test('Should return 1 input, 2 outputs and empty signers if a valid unsigned transaction is set', async () => {
      const unsignedTransaction =
        'a400818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c4002199c40031903e8';
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_PARSE_ENDPOINT,
        payload: {
          network_identifier: { blockchain: CARDANO, network: MAINNET },
          signed: false,
          transaction: unsignedTransaction
        }
      });

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json().operations).toEqual(transactionParsedOperations);
      expect(response.json().signers).toEqual([]);
    });

    test('Should throw an error when invalid signed transaction bytes are provided', async () => {
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_PARSE_ENDPOINT,
        payload: {
          network_identifier: { blockchain: CARDANO, network: MAINNET },
          signed: true,
          transaction: 'invalidSignedTransactionBytes'
        }
      });
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.json()).toEqual({
        code: 4011,
        message: 'Cant create signed transaction from transaction bytes',
        retriable: false
      });
    });

    test('Should throw an error when invalid unsigned transaction bytes are provided', async () => {
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_PARSE_ENDPOINT,
        payload: {
          network_identifier: { blockchain: CARDANO, network: MAINNET },
          signed: false,
          transaction: 'invalidUnsignedTransactionBytes'
        }
      });
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.json()).toEqual({
        code: 4012,
        message: 'Cant create unsigned transaction from transaction bytes',
        retriable: false
      });
    });

    test('Should throw an error when valid unsigned transaction bytes but signed flag is true are provided', async () => {
      const unsignedTransaction =
        '0xa4008182582010c3c63f2a97ce531730fd2bd708cda1eb08920f79d2abeeb833c7089f13c54e00018182582b82d818582183581c0b40138c75daebf910edf9cb34024528cab10c74ed2a897c37b464b0a0001a777c6af614021a0002b4f60314';
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_PARSE_ENDPOINT,
        payload: {
          network_identifier: { blockchain: CARDANO, network: MAINNET },
          signed: true,
          transaction: unsignedTransaction
        }
      });
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.json()).toEqual({
        code: 4011,
        message: 'Cant create signed transaction from transaction bytes',
        retriable: false
      });
    });

    test('Should throw an error when valid signed transaction bytes but signed flag is false are provided', async () => {
      const signedTransaction =
        '0x83a4008182582010c3c63f2a97ce531730fd2bd708cda1eb08920f79d2abeeb833c7089f13c54e00018182582b82d818582183581c0b40138c75daebf910edf9cb34024528cab10c74ed2a897c37b464b0a0001a777c6af614021a0002b4f60314a100818258201b400d60aaf34eaf6dcbab9bba46001a23497886cf11066f7846933d30e5ad3f58406c92508135cb060187a2706ade8154782867b1526e9615d06742be5c56f037ab85894c098c2ab07971133c0477baee92adf3527ad7cc816f13e1e4c361041206f6';
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_PARSE_ENDPOINT,
        payload: {
          network_identifier: { blockchain: CARDANO, network: MAINNET },
          signed: false,
          transaction: signedTransaction
        }
      });
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.json()).toEqual({
        code: 4012,
        message: 'Cant create unsigned transaction from transaction bytes',
        retriable: false
      });
    });
  });

  describe(CONSTRUCTION_SUBMIT_ENDPOINT, () => {
    it('Should return an error if an invalid network is sent', async () => {
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_SUBMIT_ENDPOINT,
        payload: generatePayloadWithSignedTransaction(
          'cardano',
          'testnet',
          '83a400818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018182581d61a6274badf4c9ca583df893a73139625ff4dc73aaa3082e67d6d5d08e0102182a030aa10081825820e7d33eeb6f1df124f9f4c226428bc46b4c93ac4bc89dacc85748d1a2b47ded135840f39ee9a72d5de64b5a8ccffb7830cd7af4438944ffb16698f7e3b3a11ae684e14f213c5ac38a50852bf1d531f13f02fc0510610f7b549bec10d01dfe81ee080ef6'
        )
      });
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.json()).toEqual({ ...Errors.NETWORK_NOT_FOUND, retriable: false });
    });

    it('Should return an error if an invalid network is sent', async () => {
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_SUBMIT_ENDPOINT,
        payload: generatePayloadWithSignedTransaction(
          'bitcoin',
          'mainnet',
          '83a400818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018182581d61a6274badf4c9ca583df893a73139625ff4dc73aaa3082e67d6d5d08e0102182a030aa10081825820e7d33eeb6f1df124f9f4c226428bc46b4c93ac4bc89dacc85748d1a2b47ded135840f39ee9a72d5de64b5a8ccffb7830cd7af4438944ffb16698f7e3b3a11ae684e14f213c5ac38a50852bf1d531f13f02fc0510610f7b549bec10d01dfe81ee080ef6'
        )
      });
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.json()).toEqual({ ...Errors.INVALID_BLOCKCHAIN, retriable: false });
    });

    it('Should return the transaction identifier is request is valid', async () => {
      const mock = cardanoCliMock.submitTransaction as jest.Mock;
      mock.mockClear();
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_SUBMIT_ENDPOINT,
        payload: generatePayloadWithSignedTransaction(
          'cardano',
          'mainnet',
          '83a400818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018182581d61a6274badf4c9ca583df893a73139625ff4dc73aaa3082e67d6d5d08e0102182a030aa10081825820e7d33eeb6f1df124f9f4c226428bc46b4c93ac4bc89dacc85748d1a2b47ded135840f39ee9a72d5de64b5a8ccffb7830cd7af4438944ffb16698f7e3b3a11ae684e14f213c5ac38a50852bf1d531f13f02fc0510610f7b549bec10d01dfe81ee080ef6'
        )
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(mock.mock.calls.length).toBe(1);
      expect(response.json()).toEqual({
        transaction_identifier: { hash: '4827ce27820b2605e0314af4d52c8a2b697f2f7a37f08079bbc2f7102b0572d1' }
      });
    });

    it('Should return an error if there is a problem when sending the transaction', async () => {
      const mock = cardanoCliMock.submitTransaction as jest.Mock;
      mock.mockClear();
      mock.mockImplementation(() => {
        throw new Error('Error when calling cardano-cli');
      });
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_SUBMIT_ENDPOINT,
        payload: generatePayloadWithSignedTransaction(
          'cardano',
          'mainnet',
          '83a400818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018182581d61a6274badf4c9ca583df893a73139625ff4dc73aaa3082e67d6d5d08e0102182a030aa10081825820e7d33eeb6f1df124f9f4c226428bc46b4c93ac4bc89dacc85748d1a2b47ded135840f39ee9a72d5de64b5a8ccffb7830cd7af4438944ffb16698f7e3b3a11ae684e14f213c5ac38a50852bf1d531f13f02fc0510610f7b549bec10d01dfe81ee080ef6'
        )
      });
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect((cardanoCliMock.submitTransaction as jest.Mock).mock.calls.length).toBe(1);
      expect(response.json()).toEqual({
        code: 5008,
        details: {
          message: 'Error when calling cardano-cli'
        },
        message: 'Error when sending the transaction',
        retriable: true
      });
    });
  });
});
