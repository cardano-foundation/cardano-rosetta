/* eslint-disable no-magic-numbers */
import { FastifyInstance } from 'fastify';
import StatusCodes from 'http-status-codes';
import { Pool } from 'pg';
import {
  block1,
  block1000WithoutTxs,
  block23236WithTransactions,
  block7134WithTxs,
  blockWith8Txs,
  GENESIS_HASH,
  latestBlockIdentifier
} from '../fixture-data';
import { setupDatabase, setupServer } from '../utils/test-utils';

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

describe('/block endpoint', () => {
  let database: Pool;
  let server: FastifyInstance;
  beforeAll(async () => {
    database = setupDatabase(false);
    server = setupServer(database);
  });

  afterAll(async () => {
    await database.end();
  });

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
    expect(response.json().block.block_identifier).toEqual(latestBlockIdentifier);
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
