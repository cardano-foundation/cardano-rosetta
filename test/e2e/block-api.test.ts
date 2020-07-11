/* eslint-disable camelcase */
/* eslint-disable no-magic-numbers */
import { FastifyInstance } from 'fastify';
import StatusCodes from 'http-status-codes';
import * as Repostories from '../../src/server/db/repositories';
import * as Services from '../../src/server/services/services';
import createPool from '../../src/server/db/connection';
import buildServer from '../../src/server/server';
import { Pool } from 'pg';

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

const block1000WithoutTxs = {
  block: {
    block_identifier: {
      index: 1000,
      hash: '0xf84748ae7f413a7f73ddb599fd77e4ed488484c1353c6075a05f30e9c78c9de9'
    },
    parent_block_identifier: {
      index: 999,
      hash: '0x18c7525617b8747a721c3fb003776826fe60a55e64f6b4f5396d06b1ff88ce02'
    },
    timestamp: 1506233871000,
    metadata: {
      transactionsCount: 0,
      createdBy: 'SlotLeader-5411c7bf87c25260',
      size: 669,
      epochNo: 0,
      slotNo: 999
    },
    transactions: []
  }
};

describe('/block endpoint', () => {
  let database: Pool;
  let server: FastifyInstance;
  beforeAll(async () => {
    database = await createPool(process.env.DB_CONNECTION_STRING);
    const repository = Repostories.configure(database);
    const services = Services.configure(repository);
    server = buildServer(services, process.env.LOGGER_ENABLED === 'true');
  });

  afterAll(async () => {
    await database.end();
  });

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

  test.skip('should properly return for genesis block', async () => {
    // FIXME: Check why genesis block cannot be referenced by 0
  });

  // test('should return latest block information if no information is sent in the BlockIdentifier', async () => {});
  //
  //  test('should a block with no transactions if all the parameters are sent', async () => {});
  //
  //  test('should return if proper network, block hash and index are sent', async () => {});
  //
  //  test('should fail if wrong blockchain is sent', async () => {
  //    expect(false).toBe(true);
  //  });
  //
  //  test('should return if proper block and block number is sent', async () => {
  //    expect(false).toBe(true);
  //  });
});
