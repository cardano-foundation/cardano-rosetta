/* eslint-disable no-magic-numbers */
import { FastifyInstance } from 'fastify';
import StatusCodes from 'http-status-codes';
import { Pool } from 'pg';
import { setupDatabase, setupServer } from '../utils/test-utils';
import { generateNetworkPayload } from '../network/common';
import { CARDANO, MAINNET } from '../../../src/server/utils/constants';

let databaseClosed = false;

const genericErrorMatcher = (regexp: RegExp) =>
  expect.objectContaining({
    code: 5000,
    details: {
      message: expect.stringMatching(
        // eslint-disable-next-line prettier/prettier
        regexp
      )
    },
    message: 'An error occurred',
    retriable: true
  });

describe('Server test', () => {
  let database: Pool;
  let server: FastifyInstance;
  beforeAll(async () => {
    database = setupDatabase();
    server = setupServer(database);
  });

  afterAll(async () => {
    if (!databaseClosed) await database.end();
  });

  test('should return a generic error if payload is not valid', async () => {
    const response = await server.inject({
      method: 'post',
      url: '/block',
      payload: { asdasa: 10 }
    });

    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual(
      genericErrorMatcher(/An error occurred for request \d: body should have required property 'network_identifier'/)
    );
  });

  test('should return a generic error if there is db connection problem', async () => {
    await database.end();
    databaseClosed = true;
    const response = await server.inject({
      method: 'post',
      url: '/network/status',
      payload: generateNetworkPayload(CARDANO, MAINNET)
    });

    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual(genericErrorMatcher(/An error occurred for request.*/));
  });
});
