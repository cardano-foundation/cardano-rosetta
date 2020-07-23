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

  test('should return all utxos until last block if no block number is specified', async () => {
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
    expect(response.json()).toEqual({
      balances: [{ currency: { decimals: 6, metadata: {}, symbol: 'ADA' }, metadata: {}, value: '21063' }],
      block_identifier: {
        hash: '0x94049f0e34aee1c5b0b492a57acd054885251e802401f72687a1e79fa1a6e252',
        index: 65168
      },
      metadata: {
        utxos: [
          {
            index: 0,
            transactionHash: '0xaf0dd90debb1fbaf3854b90686ba2d6f7c95416080e8cda18d9ea3cb6bb195ad',
            value: '21063'
          }
        ]
      }
    });
  });

  // FIXME: This tests is not working as it's not considering genesis UTXOs
  test.only('should only consider balance up to block number if specified', async () => {
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_BALANCE_ENDPOINT,
      payload: generatePayload(CARDANO, 'mainnet', '0xAe2tdPwUPEZGvXJ3ebp4LDgBhbxekAH2oKZgfahKq896fehv8oCJxmGJgLt', 20)
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      balances: [
        {
          currency: {
            decimals: 6,
            metadata: {},
            symbol: 'ADA'
          },
          metadata: {},
          value: '1153846'
        }
      ],
      block_identifier: {
        hash: '0x7c6901c6346781c2bc5cbc49577490e336c2545c320ce4a61605bc71a9c5bed0',
        index: 20
      },
      metadata: {
        utxos: []
      }
    });
  });

  test('should only consider balance up to block identifier if specified', async () => {
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_BALANCE_ENDPOINT,
      payload: generatePayload(
        CARDANO,
        'mainnet',
        '0xAe2tdPwUPEZGvXJ3ebp4LDgBhbxekAH2oKZgfahKq896fehv8oCJxmGJgLt',
        undefined,
        '0x7c6901c6346781c2bc5cbc49577490e336c2545c320ce4a61605bc71a9c5bed0'
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      balances: [
        {
          currency: {
            decimals: 6,
            metadata: {},
            symbol: 'ADA'
          },
          metadata: {},
          value: '1153846'
        }
      ],
      block_identifier: {
        hash: '0x7c6901c6346781c2bc5cbc49577490e336c2545c320ce4a61605bc71a9c5bed0',
        index: 20
      },
      metadata: {
        utxos: []
      }
    });
  });

  test('should use both identifier and number if specified', async () => {
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_BALANCE_ENDPOINT,
      payload: generatePayload(
        CARDANO,
        'mainnet',
        '0xDdzFFzCqrhsdufpFxByLTQmktKJnTrudktaHq1nK2MAEDLXjz5kbRcr5prHi9gHb6m8pTvhgK6JbFDZA1LTiTcP6g8KuPSF1TfKP8ewp',
        30,
        '0xe88f87dd0791c14a8063a95dd387b34ce5b0b425f21b6478195a7bf7eadb425d'
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json().balances[0].value).toEqual('999800000');
    // // FIXME add asserts for metada
    expect(response.json().balances[0].currency).toEqual({ symbol: 'ADA', decimals: 6, metadata: {} });
  });

  test('should fail if specified block number and hash dont match', async () => {
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_BALANCE_ENDPOINT,
      payload: generatePayload(
        CARDANO,
        'mainnet',
        '0xDdzFFzCqrhsdufpFxByLTQmktKJnTrudktaHq1nK2MAEDLXjz5kbRcr5prHi9gHb6m8pTvhgK6JbFDZA1LTiTcP6g8KuPSF1TfKP8ewp',
        44,
        '0xe88f87dd0791c14a8063a95dd387b34ce5b0b425f21b6478195a7bf7eadb425d'
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json().balances[0].value).toEqual('999800000');
    // // FIXME add asserts for metada
    expect(response.json().balances[0].currency).toEqual({ symbol: 'ADA', decimals: 6, metadata: {} });
  });

  test.todo('should return empty if address doesnt exist');
});
