/* eslint-disable camelcase */
import { FastifyInstance } from 'fastify';
import StatusCodes from 'http-status-codes';
import { Pool } from 'pg';
import {
  constructionParseOperations,
  CONSTRUCTION_INVALID_TRANSACTION,
  CONSTRUCTION_PAYLOADS_REQUEST,
  CONSTRUCTION_PAYLOADS_REQUEST_WITH_BYRON_OUTPUT,
  CONSTRUCTION_PAYLOADS_REQUEST_WITH_MA,
  CONSTRUCTION_PAYLOADS_REQUEST_WITH_MULTIPLE_MA,
  CONSTRUCTION_PAYLOADS_REQUEST_WITH_SEVERAL_MA,
  CONSTRUCTION_PAYLOADS_REQUEST_WITM_MA_WITHOUT_NAME,
  CONSTRUCTION_PAYLOADS_STAKE_DELEGATION_RESPONSE,
  CONSTRUCTION_PAYLOADS_STAKE_DEREGISTRATION_RESPONSE,
  CONSTRUCTION_PAYLOADS_STAKE_REGISTRATION_AND_DELEGATION_RESPONSE,
  CONSTRUCTION_PAYLOADS_STAKE_REGISTRATION_AND_WITHDRAWAL_RESPONSE,
  CONSTRUCTION_PAYLOADS_STAKE_REGISTRATION_RESPONSE,
  CONSTRUCTION_PAYLOADS_WITHDRAWAL_RESPONSE,
  CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_AND_PLEDGE,
  CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_CERT,
  CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_MULTIPLE_RELAY,
  CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_NO_METADATA,
  CONSTRUCTION_PAYLOADS_WITH_STAKE_DELEGATION,
  CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_DEREGISTRATION,
  CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_REGISTRATION,
  CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_REGISTRATION_AND_WITHDRAWAL,
  CONSTRUCTION_PAYLOADS_WITH_STAKE_REGISTRATION_AND_DELEGATION,
  CONSTRUCTION_PAYLOADS_WITH_WITHDRAWAL,
  CONSTRUCTION_SIGNED_TRANSACTION_WITH_EXTRA_DATA,
  CONSTRUCTION_SIGNED_TX_WITH_BYRON_ADDRESS_AND_EXTRA_DATA,
  CONSTRUCTION_SIGNED_TRANSACTION_WITH_MA,
  CONSTRUCTION_SIGNED_TRANSACTION_WITH_MULTIPLE_MA,
  CONSTRUCTION_SIGNED_TRANSACTION_WITH_SEVERAL_MA,
  CONSTRUCTION_SIGNED_TX_WITH_MA_WITHOUT_NAME,
  CONSTRUCTION_SIGNED_TX_WITH_POOL_REGISTRATION_AND_PLEDGE,
  CONSTRUCTION_SIGNED_TX_WITH_POOL_REGISTRATION_WITH_CERT,
  CONSTRUCTION_SIGNED_TX_WITH_POOL_REGISTRATION_WITH_MULTIPLE_RELAYS,
  CONSTRUCTION_SIGNED_TX_WITH_POOL_REGISTRATION_WITH_NO_METADATA,
  CONSTRUCTION_SIGNED_TX_WITH_POOL_RETIREMENT,
  CONSTRUCTION_SIGNED_TX_WITH_REGISTRATION_AND_EXTRA_DATA,
  CONSTRUCTION_SIGNED_TX_WITH_REGISTRATION_AND_WITHDRWAWAL_AND_EXTRA_DATA,
  CONSTRUCTION_UNSIGNED_TRANSACTION_WITH_EXTRA_DATA,
  CONSTRUCTION_SIGNED_TX_INPUT_WITH_BYRON_ADDRESS_AND_EXTRA_DATA,
  CONSTRUCTION_PAYLOADS_REQUEST_WITH_BYRON_INPUT,
  CONSTRUCTION_PAYLOADS_WITH_POOL_RETIREMENT,
  CONSTRUCTION_SIGNED_TX_WITH_VOTE_REGISTRATION,
  CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION,
  CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_RESPONSE
} from '../fixture-data';
import { setupOfflineDatabase, setupServer } from '../utils/test-utils';

const CONSTRUCTION_PARSE_ENDPOINT = '/construction/parse';

const generateParsePayload = (blockchain: string, network: string, signed: boolean, transaction: string) => ({
  network_identifier: { blockchain, network },
  signed,
  transaction
});

describe(CONSTRUCTION_PARSE_ENDPOINT, () => {
  let database: Pool;
  let server: FastifyInstance;

  beforeAll(async () => {
    database = setupOfflineDatabase();
    server = setupServer(database);
  });

  afterAll(async () => {
    await database.end();
  });

  test('Should return 1 input, 2 outputs and signers if a valid signed transaction is set', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PARSE_ENDPOINT,
      payload: generateParsePayload('cardano', 'mainnet', true, CONSTRUCTION_SIGNED_TRANSACTION_WITH_EXTRA_DATA)
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json().operations).toEqual(constructionParseOperations(CONSTRUCTION_PAYLOADS_REQUEST));
    expect(response.json().account_identifier_signers).toEqual([
      { address: CONSTRUCTION_PAYLOADS_REQUEST.operations[0].account?.address }
    ]);
  });

  test('Should return 1 input with byron address and signers if a valid signed transaction is set', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PARSE_ENDPOINT,
      payload: generateParsePayload(
        'cardano',
        'mainnet',
        true,
        CONSTRUCTION_SIGNED_TX_INPUT_WITH_BYRON_ADDRESS_AND_EXTRA_DATA
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json().operations).toEqual(
      constructionParseOperations(CONSTRUCTION_PAYLOADS_REQUEST_WITH_BYRON_INPUT)
    );
    expect(response.json().account_identifier_signers).toEqual([
      { address: CONSTRUCTION_PAYLOADS_REQUEST_WITH_BYRON_INPUT.operations[0].account?.address }
    ]);
  });

  test('Should return valid data if a valid signed transaction with a Byron address is set', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PARSE_ENDPOINT,
      payload: generateParsePayload(
        'cardano',
        'mainnet',
        true,
        CONSTRUCTION_SIGNED_TX_WITH_BYRON_ADDRESS_AND_EXTRA_DATA
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json().operations).toEqual(
      constructionParseOperations(CONSTRUCTION_PAYLOADS_REQUEST_WITH_BYRON_OUTPUT)
    );
    expect([response.json().account_identifier_signers[0].address]).toEqual([
      CONSTRUCTION_PAYLOADS_REQUEST_WITH_BYRON_OUTPUT.operations[0].account?.address
    ]);
  });

  // eslint-disable-next-line max-len
  test('Should return 1 input, 2 outputs, 1 stake key registration and signers with payment and stake addresses', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PARSE_ENDPOINT,
      payload: generateParsePayload('cardano', 'mainnet', true, CONSTRUCTION_SIGNED_TX_WITH_REGISTRATION_AND_EXTRA_DATA)
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json().operations).toEqual(
      constructionParseOperations(CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_REGISTRATION)
    );
    expect(
      response.json().account_identifier_signers.map((account_signer: { address: unknown }) => account_signer.address)
    ).toEqual([
      CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_REGISTRATION.operations[0].account?.address,
      'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5'
    ]);
  });

  // eslint-disable-next-line max-len
  test('Should return 1 input, 2 outputs, 1 stake key registration, 1 withdrawal and signers addresses should be unique ', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PARSE_ENDPOINT,
      payload: generateParsePayload(
        'cardano',
        'mainnet',
        true,
        CONSTRUCTION_SIGNED_TX_WITH_REGISTRATION_AND_WITHDRWAWAL_AND_EXTRA_DATA
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json().operations).toEqual(
      constructionParseOperations(CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_REGISTRATION_AND_WITHDRAWAL)
    );
    expect(
      response.json().account_identifier_signers.map((account_signer: { address: unknown }) => account_signer.address)
    ).toEqual([
      CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_REGISTRATION_AND_WITHDRAWAL.operations[0].account?.address,
      'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5'
    ]);
  });

  test('Should return 1 input, 2 outputs and empty signers if a valid unsigned transaction is set', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PARSE_ENDPOINT,
      payload: generateParsePayload('cardano', 'mainnet', false, CONSTRUCTION_UNSIGNED_TRANSACTION_WITH_EXTRA_DATA)
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json().operations).toEqual(constructionParseOperations(CONSTRUCTION_PAYLOADS_REQUEST));
    expect(response.json().account_identifier_signers).toEqual([]);
  });

  // eslint-disable-next-line max-len
  test('Should return 1 input, 2 outputs, 1 stake key registration and empty signers if a valid unsigned transaction is set', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PARSE_ENDPOINT,
      payload: generateParsePayload('cardano', 'mainnet', false, CONSTRUCTION_PAYLOADS_STAKE_REGISTRATION_RESPONSE)
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json().operations).toEqual(
      constructionParseOperations(CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_REGISTRATION)
    );
    expect(response.json().account_identifier_signers).toEqual([]);
  });

  // eslint-disable-next-line max-len
  test('Should return 1 input, 2 outputs, 1 stake key deregistration and empty signers if a valid unsigned transaction is set', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PARSE_ENDPOINT,
      payload: generateParsePayload('cardano', 'mainnet', false, CONSTRUCTION_PAYLOADS_STAKE_DEREGISTRATION_RESPONSE)
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json().operations).toEqual(
      constructionParseOperations(CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_DEREGISTRATION)
    );
    expect(response.json().account_identifier_signers).toEqual([]);
  });

  // eslint-disable-next-line max-len
  test('Should return 1 input, 2 outputs, 1 stake delegation and empty signers if a valid unsigned transaction is set', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PARSE_ENDPOINT,
      payload: generateParsePayload('cardano', 'mainnet', false, CONSTRUCTION_PAYLOADS_STAKE_DELEGATION_RESPONSE)
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json().operations).toEqual(
      constructionParseOperations(CONSTRUCTION_PAYLOADS_WITH_STAKE_DELEGATION)
    );
    expect(response.json().account_identifier_signers).toEqual([]);
  });

  // eslint-disable-next-line max-len
  test('Should return 1 input, 2 outputs, 1 stake key registration, 1 stake delegation and empty signers if a valid unsigned transaction is set', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PARSE_ENDPOINT,
      payload: generateParsePayload(
        'cardano',
        'mainnet',
        false,
        CONSTRUCTION_PAYLOADS_STAKE_REGISTRATION_AND_DELEGATION_RESPONSE
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json().operations).toEqual(
      constructionParseOperations(CONSTRUCTION_PAYLOADS_WITH_STAKE_REGISTRATION_AND_DELEGATION)
    );
    expect(response.json().account_identifier_signers).toEqual([]);
  });

  // eslint-disable-next-line max-len
  test('Should return 1 input, 2 outputs, 1 withdrawal and empty signers if a valid unsigned transaction is set', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PARSE_ENDPOINT,
      payload: generateParsePayload('cardano', 'mainnet', false, CONSTRUCTION_PAYLOADS_WITHDRAWAL_RESPONSE)
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json().operations).toEqual(constructionParseOperations(CONSTRUCTION_PAYLOADS_WITH_WITHDRAWAL));
    expect(response.json().account_identifier_signers).toEqual([]);
  });

  // eslint-disable-next-line max-len
  test('Should return 1 input, 2 outputs, 1 stake key registration, 1 withdrawal and empty signers if a valid unsigned transaction is set', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PARSE_ENDPOINT,
      payload: generateParsePayload(
        'cardano',
        'mainnet',
        false,
        CONSTRUCTION_PAYLOADS_STAKE_REGISTRATION_AND_WITHDRAWAL_RESPONSE
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json().operations).toEqual(
      constructionParseOperations(CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_REGISTRATION_AND_WITHDRAWAL)
    );
    expect(response.json().account_identifier_signers).toEqual([]);
  });

  test('Should throw an error when invalid signed transaction bytes are provided', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PARSE_ENDPOINT,
      payload: generateParsePayload('cardano', 'mainnet', true, CONSTRUCTION_INVALID_TRANSACTION)
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
      payload: generateParsePayload('cardano', 'mainnet', false, CONSTRUCTION_INVALID_TRANSACTION)
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4012,
      message: 'Cant create unsigned transaction from transaction bytes',
      retriable: false
    });
  });

  test('Should throw an error when valid unsigned transaction bytes but signed flag is true are provided', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PARSE_ENDPOINT,
      payload: generateParsePayload('cardano', 'mainnet', true, CONSTRUCTION_UNSIGNED_TRANSACTION_WITH_EXTRA_DATA)
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4011,
      message: 'Cant create signed transaction from transaction bytes',
      retriable: false
    });
  });

  test('Should throw an error when valid signed transaction bytes but signed flag is false are provided', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PARSE_ENDPOINT,
      payload: generateParsePayload('cardano', 'mainnet', false, CONSTRUCTION_SIGNED_TRANSACTION_WITH_EXTRA_DATA)
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4012,
      message: 'Cant create unsigned transaction from transaction bytes',
      retriable: false
    });
  });

  test('Should return 1 input and 2 ouput, first input and ouput with MultiAssets', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PARSE_ENDPOINT,
      payload: generateParsePayload('cardano', 'mainnet', true, CONSTRUCTION_SIGNED_TRANSACTION_WITH_MA)
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json().operations).toEqual(constructionParseOperations(CONSTRUCTION_PAYLOADS_REQUEST_WITH_MA));
  });

  test('Should correctly parse operations with two MultiAssets', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PARSE_ENDPOINT,
      payload: generateParsePayload('cardano', 'mainnet', true, CONSTRUCTION_SIGNED_TRANSACTION_WITH_MULTIPLE_MA)
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json().operations).toEqual(
      constructionParseOperations(CONSTRUCTION_PAYLOADS_REQUEST_WITH_MULTIPLE_MA)
    );
  });

  test('Should correctly parse operations with several MultiAssets ', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PARSE_ENDPOINT,
      payload: generateParsePayload('cardano', 'mainnet', true, CONSTRUCTION_SIGNED_TRANSACTION_WITH_SEVERAL_MA)
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json().operations).toEqual(
      constructionParseOperations(CONSTRUCTION_PAYLOADS_REQUEST_WITH_SEVERAL_MA)
    );
  });

  test('Should correctly parse operations with MultiAssets without name ', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_PARSE_ENDPOINT,
      payload: generateParsePayload('cardano', 'mainnet', true, CONSTRUCTION_SIGNED_TX_WITH_MA_WITHOUT_NAME)
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json().operations).toEqual(
      constructionParseOperations(CONSTRUCTION_PAYLOADS_REQUEST_WITM_MA_WITHOUT_NAME)
    );
  });
  describe('Pool registration requests', () => {
    test('Should correctly parse operations with pool registrations with pledge ', async () => {
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_PARSE_ENDPOINT,
        payload: generateParsePayload(
          'cardano',
          'mainnet',
          true,
          CONSTRUCTION_SIGNED_TX_WITH_POOL_REGISTRATION_AND_PLEDGE
        )
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json().operations).toEqual(
        constructionParseOperations(CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_AND_PLEDGE)
      );
      expect(response.json().account_identifier_signers).toEqual([
        {
          address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
        },
        {
          address: '1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5'
        },
        {
          address: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5'
        },
        {
          address: 'stake1uxly0q2cnpxrjrqm9vpnr9dwkr0j945gulhhgs3dx33l47sweg9er'
        }
      ]);
    });
    test('Should correctly parse operations with pool registrations with multiple relays', async () => {
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_PARSE_ENDPOINT,
        payload: generateParsePayload(
          'cardano',
          'mainnet',
          true,
          CONSTRUCTION_SIGNED_TX_WITH_POOL_REGISTRATION_WITH_MULTIPLE_RELAYS
        )
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json().operations).toEqual(
        constructionParseOperations(CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_MULTIPLE_RELAY)
      );
      expect(response.json().account_identifier_signers).toEqual([
        {
          address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
        },
        {
          address: '1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5'
        },
        {
          address: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5'
        },
        {
          address: 'stake1uxly0q2cnpxrjrqm9vpnr9dwkr0j945gulhhgs3dx33l47sweg9er'
        }
      ]);
    });
    test('Should correctly parse operations with pool registrations with no pool metadata', async () => {
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_PARSE_ENDPOINT,
        payload: generateParsePayload(
          'cardano',
          'mainnet',
          true,
          CONSTRUCTION_SIGNED_TX_WITH_POOL_REGISTRATION_WITH_NO_METADATA
        )
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json().operations).toEqual(
        constructionParseOperations(CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_NO_METADATA)
      );
      expect(response.json().account_identifier_signers).toEqual([
        {
          address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
        },
        {
          address: '1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5'
        },
        {
          address: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5'
        },
        {
          address: 'stake1uxly0q2cnpxrjrqm9vpnr9dwkr0j945gulhhgs3dx33l47sweg9er'
        }
      ]);
    });
    test('Should correctly parse operations with pool registrations with cert', async () => {
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_PARSE_ENDPOINT,
        payload: generateParsePayload(
          'cardano',
          'mainnet',
          true,
          CONSTRUCTION_SIGNED_TX_WITH_POOL_REGISTRATION_WITH_CERT
        )
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json().operations).toEqual(
        constructionParseOperations(CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_CERT)
      );
      expect(response.json().account_identifier_signers).toEqual([
        {
          address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
        },
        {
          address: 'stake1u9af5n26dtr6nkrs9qv05049x0jkcncau9k6vyd8xrhr7qq8tez5p'
        },
        {
          address: '1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5'
        },
        {
          address: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5'
        }
      ]);
    });
  });
  describe('Pool retirement requests', () => {
    // eslint-disable-next-line max-len
    test('Should return 1 input, 2 outputs, 1 pool retirement and empty signers if a valid unsigned transaction is set', async () => {
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_PARSE_ENDPOINT,
        payload: generateParsePayload('cardano', 'mainnet', true, CONSTRUCTION_SIGNED_TX_WITH_POOL_RETIREMENT)
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json().operations).toEqual(
        constructionParseOperations(CONSTRUCTION_PAYLOADS_WITH_POOL_RETIREMENT)
      );
      expect(response.json().account_identifier_signers).toEqual([
        {
          address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
        },
        {
          address: '153806dbcd134ddee69a8c5204e38ac80448f62342f8c23cfe4b7edf'
        }
      ]);
    });
  });

  describe('Vote Registration', () => {
    test('Should correctly parse operations with vote registration data for signed transactions', async () => {
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_PARSE_ENDPOINT,
        payload: generateParsePayload('cardano', 'mainnet', true, CONSTRUCTION_SIGNED_TX_WITH_VOTE_REGISTRATION)
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json().operations).toEqual(
        constructionParseOperations(CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION)
      );
      expect(response.json().account_identifier_signers).toEqual([
        {
          address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
        }
      ]);
    });
    test('Should correctly parse operations with vote registration data for unsigned transactions', async () => {
      const response = await server.inject({
        method: 'post',
        url: CONSTRUCTION_PARSE_ENDPOINT,
        payload: generateParsePayload(
          'cardano',
          'mainnet',
          false,
          CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_RESPONSE
        )
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json().operations).toEqual(
        constructionParseOperations(CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION)
      );
      expect(response.json().account_identifier_signers).toEqual([]);
    });
  });
});
