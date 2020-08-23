/* eslint-disable no-magic-numbers */
import { FastifyInstance } from 'fastify';
import StatusCodes from 'http-status-codes';
import { Pool } from 'pg';
import { block23236WithTransactions, transaction987aOnGenesis } from '../fixture-data';
import { setupDatabase, setupServer } from '../utils/test-utils';

const TRANSACTION_NOT_FOUND = 'Transaction not found';

const generatePayload = (index?: number, hash?: string) => ({
  // eslint-disable-next-line camelcase
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  // eslint-disable-next-line camelcase
  block_identifier: {
    index,
    hash
  }
});

describe('/block/transactions endpoint', () => {
  let database: Pool;
  let server: FastifyInstance;
  beforeAll(async () => {
    database = setupDatabase(false);
    server = setupServer(database);
  });

  afterAll(async () => {
    await database.end();
  });

  const BLOCK_TRANSACTION_ENDPOINT = '/block/transaction';
  test('should return the transaction if a valid hash is sent', async () => {
    const { index, hash } = block23236WithTransactions.block.block_identifier;
    const [transaction] = block23236WithTransactions.block.transactions;
    const response = await server.inject({
      method: 'post',
      url: BLOCK_TRANSACTION_ENDPOINT,
      payload: {
        ...generatePayload(index, hash),
        // eslint-disable-next-line camelcase
        transaction_identifier: {
          hash: transaction.transaction_identifier.hash
        }
      }
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({ transaction });
  });

  test('should return an error if the transaction doesnt exist', async () => {
    const { index, hash } = block23236WithTransactions.block.block_identifier;
    const response = await server.inject({
      method: 'post',
      url: BLOCK_TRANSACTION_ENDPOINT,
      payload: {
        ...generatePayload(index, hash),
        // eslint-disable-next-line camelcase
        transaction_identifier: {
          // Last digit was changed from 4 to 5
          hash: 'abbeb108ebc3990c7f031113bcb8ce8f306a1eec8f313acffcdcd256379208f5'
        }
      }
    });

    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({ code: 4006, message: TRANSACTION_NOT_FOUND, retriable: false });
  });
  test('should fail if incorrect network identifier is sent', async () => {
    const { index, hash } = block23236WithTransactions.block.block_identifier;
    const [transaction] = block23236WithTransactions.block.transactions;
    const response = await server.inject({
      method: 'post',
      url: BLOCK_TRANSACTION_ENDPOINT,
      payload: {
        ...generatePayload(index, hash),
        // eslint-disable-next-line camelcase
        network_identifier: {
          blockchain: 'cardano',
          network: 'testnet'
        },
        // eslint-disable-next-line camelcase
        transaction_identifier: {
          hash: transaction.transaction_identifier.hash
        }
      }
    });

    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({ message: 'Network not found', code: 4002, retriable: false });
  });
  test('should fail if incorrect blockchain identifier is sent', async () => {
    const { index, hash } = block23236WithTransactions.block.block_identifier;
    const [transaction] = block23236WithTransactions.block.transactions;
    const response = await server.inject({
      method: 'post',
      url: BLOCK_TRANSACTION_ENDPOINT,
      payload: {
        ...generatePayload(index, hash),
        // eslint-disable-next-line camelcase
        network_identifier: {
          blockchain: 'incorrect',
          network: 'mainnet'
        },
        // eslint-disable-next-line camelcase
        transaction_identifier: {
          hash: transaction.transaction_identifier.hash
        }
      }
    });

    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({ message: 'Invalid blockchain', code: 4004, retriable: false });
  });

  test('should fail if requested block index does not correspond to requested block hash', async () => {
    const { hash } = block23236WithTransactions.block.block_identifier;
    const [transaction] = block23236WithTransactions.block.transactions;
    const response = await server.inject({
      method: 'post',
      url: BLOCK_TRANSACTION_ENDPOINT,
      payload: {
        ...generatePayload(1234, hash),
        // eslint-disable-next-line camelcase
        transaction_identifier: {
          hash: transaction.transaction_identifier.hash
        }
      }
    });

    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({ message: TRANSACTION_NOT_FOUND, code: 4006, retriable: false });
  });
  test('should fail if requested block hash does not correspond to requested block index', async () => {
    const { index } = block23236WithTransactions.block.block_identifier;
    const [transaction] = block23236WithTransactions.block.transactions;
    const response = await server.inject({
      method: 'post',
      url: BLOCK_TRANSACTION_ENDPOINT,
      payload: {
        ...generatePayload(index, 'fakeHash'),
        // eslint-disable-next-line camelcase
        transaction_identifier: {
          hash: transaction.transaction_identifier.hash
        }
      }
    });

    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({ message: TRANSACTION_NOT_FOUND, code: 4006, retriable: false });
  });
  test('should return transaction for genesis block when requested', async () => {
    const genesisIndex = 0;
    const genesisHash = '5f20df933584822601f9e3f8c024eb5eb252fe8cefb24d1317dc3d432e940ebb';
    const transaction = '927edb96f3386ab91b5f5d85d84cb4253c65b1c2f65fa7df25f81fab1d62987a';
    const response = await server.inject({
      method: 'post',
      url: BLOCK_TRANSACTION_ENDPOINT,
      payload: {
        ...generatePayload(genesisIndex, genesisHash),
        // eslint-disable-next-line camelcase
        transaction_identifier: {
          hash: transaction
        }
      }
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual(transaction987aOnGenesis);
  });
});
