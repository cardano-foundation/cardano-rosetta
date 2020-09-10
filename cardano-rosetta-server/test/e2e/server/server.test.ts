/* eslint-disable no-magic-numbers */
import { FastifyInstance } from 'fastify';
import StatusCodes from 'http-status-codes';
import { Pool } from 'pg';
import { setupDatabase, setupServer } from '../utils/test-utils';
import { generateNetworkPayload } from '../network/common';
import { CARDANO, MAINNET } from '../../../src/server/utils/constants';

describe('Server test', () => {
  let database: Pool;
  let server: FastifyInstance;
  beforeAll(async () => {
    database = setupDatabase(false);
    server = setupServer(database);
  });

  afterAll(async () => {
    await database.end();
  });

  const genericErrorMatcher = expect.objectContaining({
    code: 5000,
    details: {
      message: expect.stringContaining('An error occurred for request')
    },
    message: 'An error occurred',
    retriable: true
  });

  test('should return a generic error if payload is not valid', async () => {
    const response = await server.inject({
      method: 'post',
      url: '/block',
      payload: '{ asdasd }'
    });

    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual(genericErrorMatcher);
  });

  test('should return a generic error if there is db connection problem', async () => {
    await database.end();
    const response = await server.inject({
      method: 'post',
      url: '/network/status',
      payload: generateNetworkPayload(CARDANO, MAINNET)
    });

    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual(genericErrorMatcher);
  });
});
