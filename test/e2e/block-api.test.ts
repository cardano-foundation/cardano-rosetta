/* eslint-disable no-magic-numbers */
import { FastifyInstance } from 'fastify';
import StatusCodes from 'http-status-codes';
import { Pool } from 'pg';
import {
  block1000WithoutTxs,
  block23236WithTransactions,
  latestBlock,
  block7134WithTxs,
  blockWith8Txs,
  GENESIS_HASH,
  block1,
  transaction987aOnGenesis
} from './fixture-data';
import { setupDatabase, setupServer } from './utils/test-utils';

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

const TRANSACTION_NOT_FOUND = 'Transaction not found';

describe('Block API', () => {
  let database: Pool;
  let server: FastifyInstance;
  beforeAll(async () => {
    database = setupDatabase();
    server = setupServer(database);
  });

  afterAll(async () => {
    await database.end();
  });

  describe('/block endpoint', () => {
    test('should return an error if block not found', async () => {
      const response = await server.inject({
        method: 'post',
        url: '/block',
        payload: generatePayload(1000, 'deadbeefdeadbeef')
      });

      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.json()).toEqual({ code: 4001, message: 'Block not found', retriable: false });
    });

    test('should properly return a block without transactions if requested by block number', async () => {
      const response = await server.inject({
        method: 'post',
        url: '/block',
        payload: generatePayload(1000)
      });

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual(block1000WithoutTxs);
    });

    test('should properly return a block without transactions if requested by block hash', async () => {
      const response = await server.inject({
        method: 'post',
        url: '/block',
        payload: generatePayload(undefined, 'f84748ae7f413a7f73ddb599fd77e4ed488484c1353c6075a05f30e9c78c9de9')
      });

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual(block1000WithoutTxs);
    });

    test('should properly return a block without transactions if requested by block and hash', async () => {
      const response = await server.inject({
        method: 'post',
        url: '/block',
        payload: generatePayload(1000, 'f84748ae7f413a7f73ddb599fd77e4ed488484c1353c6075a05f30e9c78c9de9')
      });

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual(block1000WithoutTxs);
    });

    test('should be able to fetch latest block information', async () => {
      const response = await server.inject({
        method: 'post',
        url: '/block',
        payload: generatePayload()
      });

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual(latestBlock);
    });

    test('should properly return a block with transactions', async () => {
      const response = await server.inject({
        method: 'post',
        url: '/block',
        payload: generatePayload(23236)
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual(block23236WithTransactions);
    });

    test('should properly return a block with 2 output transactions', async () => {
      const response = await server.inject({
        method: 'post',
        url: '/block',
        payload: generatePayload(7134)
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual(block7134WithTxs);
    });

    test('should properly return a block with 8 transactions but only the hashes of them', async () => {
      const response = await server.inject({
        method: 'post',
        url: '/block',
        payload: generatePayload(undefined, '7a8dbe66c6a1b41bdbf4f3865ea20aebbf93b9697bf39024d5d08ffad10ab1e8')
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual(blockWith8Txs);
    });

    test('should return an error if hash sent in the request does not match the one in block 0', async () => {
      const response = await server.inject({
        method: 'post',
        url: '/block',
        payload: generatePayload(0, '7a8dbe66c6a1b41bdbf4f3865ea20aebbf93b9697bf39024d5d08ffad10ab1e8')
      });
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.json()).toEqual({ code: 4001, message: 'Block not found', retriable: false });
    });

    test('should be able to return block 0', async () => {
      const response = await server.inject({
        method: 'post',
        url: '/block',
        payload: generatePayload(0)
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json().block.block_identifier.hash).toEqual(GENESIS_HASH);
      expect(response.json().other_transactions.length).toEqual(14505);
    });

    // Block 1 parent should be genesis,
    test('should return boundary block 1 if requested by hash', async () => {
      const response = await server.inject({
        method: 'post',
        url: '/block',
        payload: generatePayload(undefined, 'f0f7892b5c333cffc4b3c4344de48af4cc63f55e44936196f365a9ef2244134f')
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual(block1);
      expect(response.json().block.parent_block_identifier.hash).toEqual(GENESIS_HASH);
    });
  });
  describe('/block/transactions endpoint', () => {
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
});
