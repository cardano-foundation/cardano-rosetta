/* eslint-disable camelcase */
/* eslint-disable no-magic-numbers */
import { FastifyInstance } from 'fastify';
import StatusCodes from 'http-status-codes';
import { Pool } from 'pg';
import { setupDatabase, setupServer } from './utils/test-utils';
import { CARDANO } from '../../src/server/utils/constants';

const generatePayload = (
  blockchain: string,
  network: string,
  address: string,
  blockIndex?: number,
  blockHash?: string
) => ({
  // eslint-disable-next-line camelcase
  network_identifier: {
    blockchain,
    network
  },
  account_identifier: { address },
  block_identifier: { index: blockIndex, hash: blockHash }
});

const ACCOUNT_BALANCE_ENDPOINT = '/account/balance';

describe('/account/balance endpoint', () => {
  let database: Pool;
  let server: FastifyInstance;
  beforeAll(async () => {
    database = setupDatabase();
    server = setupServer(database);
  });

  afterAll(async () => {
    await database.end();
  });

  test('if requested with no block_identifier and other proper params it should return the balance and metadata till latest block of requested address', async () => {
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_BALANCE_ENDPOINT,
      payload: generatePayload(
        CARDANO,
        'mainnet',
        'DdzFFzCqrhsdoAvvE5tYdW3CcyHKgsUFXMdWVcsJTNhQzBZqr7GUzuM2tJjc7wyiLiLHGajTjZzLZp9jtUi4juY3ntmjs6ocpt7uV5TG'
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json().balances[0].value).toEqual('21063');
    // FIXME add asserts for metada
    expect(response.json().balances[0].currency).toEqual({ symbol: 'ADA', decimals: 6, metadata: {} });
  });

  test('if requested with only blockHash identifier and other proper params it should return the balance and metadata till latest block of requested address', async () => {
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_BALANCE_ENDPOINT,
      payload: generatePayload(CARDANO, 'mainnet', '0xAe2tdPwUPEZGvXJ3ebp4LDgBhbxekAH2oKZgfahKq896fehv8oCJxmGJgLt', 20)
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json().balances[0].value).toEqual('0');
    // // FIXME add asserts for metada
    expect(response.json().balances[0].currency).toEqual({ symbol: 'ADA', decimals: 6, metadata: {} });
  });

  test('if requested with only blockNumber identifier and other proper params it should return the balance and metadata till latest block of requested address', async () => {
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_BALANCE_ENDPOINT,
      payload: generatePayload(
        CARDANO,
        'mainnet',
        '0xDdzFFzCqrhsdufpFxByLTQmktKJnTrudktaHq1nK2MAEDLXjz5kbRcr5prHi9gHb6m8pTvhgK6JbFDZA1LTiTcP6g8KuPSF1TfKP8ewp',
        undefined,
        '0xe88f87dd0791c14a8063a95dd387b34ce5b0b425f21b6478195a7bf7eadb425d'
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json().balances[0].value).toEqual('999800000');
    // // FIXME add asserts for metada
    expect(response.json().balances[0].currency).toEqual({ symbol: 'ADA', decimals: 6, metadata: {} });
  });
});
