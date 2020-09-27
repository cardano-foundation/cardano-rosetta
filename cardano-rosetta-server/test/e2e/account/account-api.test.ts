/* eslint-disable camelcase */
/* eslint-disable no-magic-numbers */
import { FastifyInstance } from 'fastify';
import StatusCodes from 'http-status-codes';
import { Pool } from 'pg';
import { setupDatabase, setupServer } from '../utils/test-utils';
import { CARDANO } from '../../../src/server/utils/constants';

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

const emptyBalances = [
  {
    currency: {
      decimals: 6,
      symbol: 'ADA'
    },
    value: '0'
  }
];

const AE2HashAccountBalances = [
  {
    currency: {
      decimals: 6,
      symbol: 'ADA'
    },
    value: '1153846000000'
  }
];

const AE2HashAccountUtxos = [
  {
    coin_identifier: { identifier: '2d51b929d79a0ac8f360f38e8a38cdcb28ca84139aced314c5d7edc739aa4366:0' },
    amount: { value: '1153846000000', currency: { symbol: 'ADA', decimals: 6 } }
  }
];

const ACCOUNT_BALANCE_ENDPOINT = '/account/balance';

describe('/account/balance endpoint', () => {
  let database: Pool;
  let server: FastifyInstance;
  beforeAll(async () => {
    database = setupDatabase(false);
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
      balances: [{ currency: { decimals: 6, symbol: 'ADA' }, value: '21063' }],
      block_identifier: {
        hash: '94049f0e34aee1c5b0b492a57acd054885251e802401f72687a1e79fa1a6e252',
        index: 65168
      },
      coins: [
        {
          coin_identifier: { identifier: 'af0dd90debb1fbaf3854b90686ba2d6f7c95416080e8cda18d9ea3cb6bb195ad:0' },
          amount: { value: '21063', currency: { symbol: 'ADA', decimals: 6 } }
        }
      ]
    });
  });

  test('should only consider balance up to block number if specified', async () => {
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_BALANCE_ENDPOINT,
      payload: generatePayload(CARDANO, 'mainnet', 'Ae2tdPwUPEZGvXJ3ebp4LDgBhbxekAH2oKZgfahKq896fehv8oCJxmGJgLt', 20)
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      balances: AE2HashAccountBalances,
      block_identifier: {
        hash: '7c6901c6346781c2bc5cbc49577490e336c2545c320ce4a61605bc71a9c5bed0',
        index: 20
      },
      coins: AE2HashAccountUtxos
    });
  });

  test('should only consider balance up to block identifier if specified', async () => {
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_BALANCE_ENDPOINT,
      payload: generatePayload(
        CARDANO,
        'mainnet',
        'Ae2tdPwUPEZGvXJ3ebp4LDgBhbxekAH2oKZgfahKq896fehv8oCJxmGJgLt',
        undefined,
        '7c6901c6346781c2bc5cbc49577490e336c2545c320ce4a61605bc71a9c5bed0'
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      balances: AE2HashAccountBalances,
      block_identifier: {
        hash: '7c6901c6346781c2bc5cbc49577490e336c2545c320ce4a61605bc71a9c5bed0',
        index: 20
      },
      coins: AE2HashAccountUtxos
    });
  });

  test('should use both identifier and number if specified', async () => {
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_BALANCE_ENDPOINT,
      payload: generatePayload(
        CARDANO,
        'mainnet',
        'Ae2tdPwUPEZGvXJ3ebp4LDgBhbxekAH2oKZgfahKq896fehv8oCJxmGJgLt',
        30,
        'd3fdc8c8ea4050cc87a21cb73110d54e3ec92f8ae76941e8a1957ed6e6a7e0b0'
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      balances: AE2HashAccountBalances,
      block_identifier: {
        hash: 'd3fdc8c8ea4050cc87a21cb73110d54e3ec92f8ae76941e8a1957ed6e6a7e0b0',
        index: 30
      },
      coins: AE2HashAccountUtxos
    });
  });

  test('should fail if specified block number and hash dont match', async () => {
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_BALANCE_ENDPOINT,
      payload: generatePayload(
        CARDANO,
        'mainnet',
        'DdzFFzCqrhsdufpFxByLTQmktKJnTrudktaHq1nK2MAEDLXjz5kbRcr5prHi9gHb6m8pTvhgK6JbFDZA1LTiTcP6g8KuPSF1TfKP8ewp',
        44,
        'e88f87dd0791c14a8063a95dd387b34ce5b0b425f21b6478195a7bf7eadb425d'
      )
    });

    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
  });

  test('should only consider balance till latest block', async () => {
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_BALANCE_ENDPOINT,
      payload: generatePayload(
        CARDANO,
        'mainnet',
        'DdzFFzCqrhsdufpFxByLTQmktKJnTrudktaHq1nK2MAEDLXjz5kbRcr5prHi9gHb6m8pTvhgK6JbFDZA1LTiTcP6g8KuPSF1TfKP8ewp'
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      block_identifier: {
        index: 65168,
        hash: '94049f0e34aee1c5b0b492a57acd054885251e802401f72687a1e79fa1a6e252'
      },
      balances: [
        {
          value: '11509379714',
          currency: {
            decimals: 6,
            symbol: 'ADA'
          }
        }
      ],
      coins: [
        {
          coin_identifier: {
            identifier: 'bcc57134d1bd588b00f40142f0fdc17db5f35047e3196cdf26aa7319524c0014:1'
          },
          amount: { value: '999800000', currency: { decimals: 6, symbol: 'ADA' } }
        },
        {
          coin_identifier: {
            identifier: '4bcf79c0c2967986749fd0ae03f5b54a712d51b35672a3d974707c060c4d8dac:1'
          },
          amount: { value: '10509579714', currency: { decimals: 6, symbol: 'ADA' } }
        }
      ]
    });
  });

  test('should return empty if address doesnt exist', async () => {
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_BALANCE_ENDPOINT,
      payload: generatePayload(CARDANO, 'mainnet', 'fakeAddress', 44)
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      balances: emptyBalances,
      block_identifier: {
        hash: 'f1c244bece74921b7aa85fc20f32f65ba17d9596eeb8ce4cf1152f67922e7b74',
        index: 44
      },
      coins: []
    });
  });

  // tests with same address for more readability of /account/balance full flow
  test('should only consider balance till block 3337 and balance should not be 0', async () => {
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_BALANCE_ENDPOINT,
      payload: generatePayload(
        CARDANO,
        'mainnet',
        'DdzFFzCqrhsszHTvbjTmYje5hehGbadkT6WgWbaqCy5XNxNttsPNF13eAjjBHYT7JaLJz2XVxiucam1EvwBRPSTiCrT4TNCBas4hfzic',
        3336
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      block_identifier: {
        index: 3336,
        hash: '824f66a4159ec3afb1b87ebb6c34deeef32788f6701ebadb40fa80f88add3702'
      },
      balances: [
        {
          value: '1000000',
          currency: {
            decimals: 6,
            symbol: 'ADA'
          }
        }
      ],
      coins: [
        {
          amount: { value: '1000000', currency: { symbol: 'ADA', decimals: 6 } },
          coin_identifier: { identifier: '6497b33b10fa2619c6efbd9f874ecd1c91badb10bf70850732aab45b90524d9e:0' }
        }
      ]
    });
  });
  test('should only consider balance till last block and balance SHOULD be 0', async () => {
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_BALANCE_ENDPOINT,
      payload: generatePayload(
        CARDANO,
        'mainnet',
        'DdzFFzCqrhsszHTvbjTmYje5hehGbadkT6WgWbaqCy5XNxNttsPNF13eAjjBHYT7JaLJz2XVxiucam1EvwBRPSTiCrT4TNCBas4hfzic',
        3337
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      block_identifier: {
        index: 3337,
        hash: '86b54dd69f404bb9656ee766e8c019dae3b5ef4ea00c04ef2e5597c9799214a8'
      },
      balances: [
        {
          value: '0',
          currency: {
            decimals: 6,
            symbol: 'ADA'
          }
        }
      ],
      coins: []
    });
  });
});
