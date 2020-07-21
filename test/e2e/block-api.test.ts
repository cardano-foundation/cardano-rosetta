/* eslint-disable no-magic-numbers */
import { FastifyInstance } from 'fastify';
import StatusCodes from 'http-status-codes';
import { Pool } from 'pg';
import { block1000WithoutTxs, block23236WithTransactions, latestBlock } from './fixture-data';
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
      expect(response.json()).toEqual({ code: StatusCodes.BAD_REQUEST, message: 'Block not found', retriable: false });
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
        code: 501,
        message: 'Not implemented',
        retriable: false
      });
    });
  });
});
