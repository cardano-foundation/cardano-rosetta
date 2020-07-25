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
  GENESIS_HASH
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
        payload: generatePayload(1000, '0xdeadbeefdeadbeef')
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
        payload: generatePayload(undefined, '0xf84748ae7f413a7f73ddb599fd77e4ed488484c1353c6075a05f30e9c78c9de9')
      });

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual(block1000WithoutTxs);
    });

    test('should properly return a block without transactions if requested by block and hash', async () => {
      const response = await server.inject({
        method: 'post',
        url: '/block',
        payload: generatePayload(1000, '0xf84748ae7f413a7f73ddb599fd77e4ed488484c1353c6075a05f30e9c78c9de9')
      });

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual(block1000WithoutTxs);
    });

    // FIXME: Check why genesis block is failing when queried for 0
    test.todo('should properly return for genesis block');

    // FIXME: Add a test for this case when testing with a mock db is done
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
        payload: generatePayload(undefined, '0x7a8dbe66c6a1b41bdbf4f3865ea20aebbf93b9697bf39024d5d08ffad10ab1e8')
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual(blockWith8Txs);
    });

    test('should return an error if hash sent in the request does not match the one in block 0', async () => {
      const response = await server.inject({
        method: 'post',
        url: '/block',
        payload: generatePayload(0, '0x7a8dbe66c6a1b41bdbf4f3865ea20aebbf93b9697bf39024d5d08ffad10ab1e8')
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
    });
  });
  describe('/block/transactions endpoint', () => {
    test('should return a not implemented error', async () => {
      const response = await server.inject({
        method: 'post',
        url: '/block/transaction',
        payload: {
          ...generatePayload(1000, '0xf84748ae7f413a7f73ddb599fd77e4ed488484c1353c6075a05f30e9c78c9de9'),
          // eslint-disable-next-line camelcase
          transaction_identifier: {
            hash: '0x2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f'
          }
        }
      });

      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.json()).toEqual({
        code: 5001,
        message: 'Not implemented',
        retriable: false
      });
    });
  });
});
