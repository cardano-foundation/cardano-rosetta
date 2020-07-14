/* eslint-disable camelcase */
/* eslint-disable no-magic-numbers */
import { FastifyInstance } from 'fastify';
import StatusCodes from 'http-status-codes';
import * as Repositories from '../../src/server/db/repositories';
import * as Services from '../../src/server/services/services';
import createPool from '../../src/server/db/connection';
import buildServer from '../../src/server/server';
import { Pool } from 'pg';

const generatePayload = () => ({
  // eslint-disable-next-line camelcase
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  }
});

const cardanoMainnet = { network_identifiers: [{ network: 'mainnet', blockchain: 'cardano' }] };

describe('/network/list endpoint', () => {
  let database: Pool;
  let server: FastifyInstance;
  beforeAll(async () => {
    database = await createPool(process.env.DB_CONNECTION_STRING);
    const repositories = Repositories.configure(database);
    const services = Services.configure(repositories);
    server = buildServer(services, process.env.LOGGER_ENABLED === 'true');
  });

  afterAll(async () => {
    await database.end();
  });

  test('if requested without params it should properly return an array of one element equal to cardano mainnet', async () => {
    const response = await server.inject({
      method: 'post',
      url: '/network/list',
      payload: generatePayload()
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual(cardanoMainnet);
  });

  test('if requested with random params it should properly return an array of one element equal to cardano mainnet', async () => {
    const response = await server.inject({
      method: 'post',
      url: '/network/list',
      payload: Object.assign({}, generatePayload(), {
        randomParams: { firstParam: 'What a param!', secondParam: 'It should not change the behavior' }
      })
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual(cardanoMainnet);
  });
});
