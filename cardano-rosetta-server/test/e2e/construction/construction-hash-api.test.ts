/* eslint-disable camelcase */
import StatusCodes from 'http-status-codes';
import { setupOfflineDatabase, setupServer, testInvalidNetworkParameters } from '../utils/test-utils';
import { CONSTRUCTION_INVALID_TRANSACTION, CONSTRUCTION_SIGNED_TRANSACTION_WITH_EXTRA_DATA } from '../fixture-data';
import { Pool } from 'pg';
import { FastifyInstance } from 'fastify';

const CONSTRUCTION_HASH_ENDPOINT = '/construction/hash';

const generatePayloadWithSignedTransaction = (blockchain: string, network: string, signedTransaction: string) => ({
  network_identifier: { blockchain, network },
  signed_transaction: signedTransaction
});

describe(CONSTRUCTION_HASH_ENDPOINT, () => {
  let database: Pool;
  let server: FastifyInstance;

  beforeAll(async () => {
    database = setupOfflineDatabase();
    server = setupServer(database);
  });

  afterAll(async () => {
    await database.end();
  });

  testInvalidNetworkParameters(
    CONSTRUCTION_HASH_ENDPOINT,
    (blockchain, network) => generatePayloadWithSignedTransaction(blockchain, network, 'encodedTx'),
    () => server
  );

  test('Should return a valid hash when providing a proper signed transaction', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_HASH_ENDPOINT,
      payload: generatePayloadWithSignedTransaction(
        'cardano',
        'mainnet',
        CONSTRUCTION_SIGNED_TRANSACTION_WITH_EXTRA_DATA
      )
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      transaction_identifier: { hash: '333a6ccaaa639f7b451ce93764f54f654ef499fdb7b8b24374ee9d99eab9d795' }
    });
  });

  test('Should return an error when providing an invalid transaction', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_HASH_ENDPOINT,
      payload: generatePayloadWithSignedTransaction('cardano', 'mainnet', CONSTRUCTION_INVALID_TRANSACTION)
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 5003,
      message: 'Parse signed transaction error',
      retriable: false
    });
  });
});
