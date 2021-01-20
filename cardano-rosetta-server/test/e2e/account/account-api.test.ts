/* eslint-disable camelcase */
/* eslint-disable no-magic-numbers */
import { FastifyInstance } from 'fastify';
import StatusCodes from 'http-status-codes';
import { Pool } from 'pg';
import { CARDANO } from '../../../src/server/utils/constants';
import {
  latestBlockIdentifier,
  address1vpfAccountBalances,
  address1vpfCoins,
  balancesAtBlock213891,
  balancesAtBlock213892,
  coinsAtBlock213891,
  coinsAtBlock213892
} from '../fixture-data';
import { setupDatabase, setupServer } from '../utils/test-utils';

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
  let multiassetsDatabase: Pool;
  let serverWithMultiassetsSupport: FastifyInstance;
  beforeAll(async () => {
    database = setupDatabase();
    server = setupServer(database);
    multiassetsDatabase = setupDatabase(process.env.DB_CONNECTION_STRING, 'launchpad');
    serverWithMultiassetsSupport = setupServer(multiassetsDatabase);
  });

  afterAll(async () => {
    await database.end();
    await multiassetsDatabase.end();
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
      block_identifier: latestBlockIdentifier,
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
      block_identifier: latestBlockIdentifier,
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
            identifier: '4bcf79c0c2967986749fd0ae03f5b54a712d51b35672a3d974707c060c4d8dac:1'
          },
          amount: { value: '10509579714', currency: { decimals: 6, symbol: 'ADA' } }
        },
        {
          coin_identifier: {
            identifier: 'bcc57134d1bd588b00f40142f0fdc17db5f35047e3196cdf26aa7319524c0014:1'
          },
          amount: { value: '999800000', currency: { decimals: 6, symbol: 'ADA' } }
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

    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4015,
      message: 'Provided address is invalid',
      retriable: true,
      details: { message: 'fakeAddress' }
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
  test('should return 0 for the balance of stake account at block with no earned rewards', async () => {
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_BALANCE_ENDPOINT,
      payload: generatePayload(
        CARDANO,
        'mainnet',
        'stake1uyqq2a22arunrft3k9ehqc7yjpxtxjmvgndae80xw89mwyge9skyp',
        4490560,
        '6fca1ba5a6ccd557968140e2586f2fed947785f4ef15bac0090657db80c68386'
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      block_identifier: {
        index: 4490560,
        hash: '6fca1ba5a6ccd557968140e2586f2fed947785f4ef15bac0090657db80c68386'
      },
      balances: [
        {
          value: '0',
          currency: {
            decimals: 6,
            symbol: 'ADA'
          }
        }
      ]
    });
  });
  // At this point the total amount of rewards is 112588803 (at block 4597779) + 111979582 (at block 4619221)
  // and the total amount of withdrawals is 112588803 (at block 4597861)
  test('should sum all rewards and subtract all withdrawals till block 4876885', async () => {
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_BALANCE_ENDPOINT,
      payload: generatePayload(
        CARDANO,
        'mainnet',
        'stake1uyqq2a22arunrft3k9ehqc7yjpxtxjmvgndae80xw89mwyge9skyp',
        4853177,
        '6713e3dbea2a037f0be9401744a8b2be4c6190294a23c496165c212972a82f61'
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      block_identifier: {
        index: 4853177,
        hash: '6713e3dbea2a037f0be9401744a8b2be4c6190294a23c496165c212972a82f61'
      },
      balances: [
        {
          value: '111979582',
          currency: {
            decimals: 6,
            symbol: 'ADA'
          }
        }
      ]
    });
  });

  test('should properly count ADA value if there are two new UTXO to the same address', async () => {
    const response = await serverWithMultiassetsSupport.inject({
      method: 'post',
      url: ACCOUNT_BALANCE_ENDPOINT,
      payload: generatePayload(
        CARDANO,
        'mainnet',
        'addr_test1vpfwv0ezc5g8a4mkku8hhy3y3vp92t7s3ul8g778g5yegsgalc6gc',
        197619
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json().balances[0]).toEqual({
      currency: {
        decimals: 6,
        symbol: 'ADA'
      },
      value: '199999482509'
    });
  });

  // should return a list of ma utxos and sum the corresponding ones to obtain the balances
  test('should return payment balance and list of ma balances', async () => {
    const response = await serverWithMultiassetsSupport.inject({
      method: 'post',
      url: ACCOUNT_BALANCE_ENDPOINT,
      payload: generatePayload(
        CARDANO,
        'mainnet',
        'addr_test1vpfwv0ezc5g8a4mkku8hhy3y3vp92t7s3ul8g778g5yegsgalc6gc',
        347898,
        '1f391a9c0d5799e96aae4df2b22c361346bc98d3e46a2c3496632fdcae52f65b'
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json().block_identifier).toEqual({
      index: 347898,
      hash: '1f391a9c0d5799e96aae4df2b22c361346bc98d3e46a2c3496632fdcae52f65b'
    });
    expect(response.json().balances).toHaveLength(address1vpfAccountBalances.length);
    address1vpfAccountBalances.forEach(accountBalance =>
      expect(response.json().balances).toContainEqual(accountBalance)
    );
    expect(response.json().coins).toHaveLength(address1vpfCoins.length);
    address1vpfCoins.forEach(address1vpfCoin => expect(response.json().coins).toContainEqual(address1vpfCoin));
  });

  // eslint-disable-next-line max-len
  test('given a block with ma balances and the total amount of one of them are transferred in the current block, that token balance should not be seen at the address balance for the next block', async () => {
    const responseAtBlock213891 = await serverWithMultiassetsSupport.inject({
      method: 'post',
      url: ACCOUNT_BALANCE_ENDPOINT,
      payload: generatePayload(
        CARDANO,
        'mainnet',
        'addr_test1vpfwv0ezc5g8a4mkku8hhy3y3vp92t7s3ul8g778g5yegsgalc6gc',
        213891,
        'ee0c724096119dd8a1feda1c528ca3c3e54b875bbdc67def25b6a244dab43099'
      )
    });
    const responseAtBlock213892 = await serverWithMultiassetsSupport.inject({
      method: 'post',
      url: ACCOUNT_BALANCE_ENDPOINT,
      payload: generatePayload(
        CARDANO,
        'mainnet',
        'addr_test1vpfwv0ezc5g8a4mkku8hhy3y3vp92t7s3ul8g778g5yegsgalc6gc',
        213892,
        'f2a86b45724e1d6e37796abca3dce176ba817537b7f15a477bf4bd5927d24e1e'
      )
    });

    expect(responseAtBlock213891.statusCode).toEqual(StatusCodes.OK);
    expect(responseAtBlock213891.json().block_identifier).toEqual({
      index: 213891,
      hash: 'ee0c724096119dd8a1feda1c528ca3c3e54b875bbdc67def25b6a244dab43099'
    });

    expect(responseAtBlock213891.json().balances.length).toEqual(balancesAtBlock213891.length);
    balancesAtBlock213891.forEach(accountBalance =>
      expect(responseAtBlock213891.json().balances).toContainEqual(accountBalance)
    );
    expect(responseAtBlock213891.json().coins).toHaveLength(coinsAtBlock213891.length);
    coinsAtBlock213891.forEach(coin => expect(responseAtBlock213891.json().coins).toContainEqual(coin));
    expect(responseAtBlock213892.statusCode).toEqual(StatusCodes.OK);
    expect(responseAtBlock213892.json().block_identifier).toEqual({
      index: 213892,
      hash: 'f2a86b45724e1d6e37796abca3dce176ba817537b7f15a477bf4bd5927d24e1e'
    });
    balancesAtBlock213892.forEach(accountBalance =>
      expect(responseAtBlock213892.json().balances).toContainEqual(accountBalance)
    );
    expect(responseAtBlock213892.json().coins).toHaveLength(coinsAtBlock213892.length);
    coinsAtBlock213892.forEach(coin => expect(responseAtBlock213892.json().coins).toContainEqual(coin));
  });
});
