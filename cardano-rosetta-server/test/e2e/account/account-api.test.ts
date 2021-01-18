/* eslint-disable camelcase */
/* eslint-disable no-magic-numbers */
import { FastifyInstance } from 'fastify';
import StatusCodes from 'http-status-codes';
import { Pool } from 'pg';
import { CARDANO } from '../../../src/server/utils/constants';
import { latestBlockIdentifier, vpfHashAccountBalances, vpfHashCoins } from '../fixture-data';
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

  test('should return payment balance and ma balances', async () => {
    const launchpad = setupDatabase(process.env.DB_CONNECTION_STRING, 'launchpad');
    const launchpadServer = setupServer(launchpad);
    const response = await launchpadServer.inject({
      method: 'post',
      url: ACCOUNT_BALANCE_ENDPOINT,
      payload: generatePayload(
        CARDANO,
        'mainnet',
        'addr_test1qqmjn5wngx6upkgfwsfgfpqnxkxcfk7k047g650f6djz0wqs4kce4pd7nvws40s54ql2c063fhsxhda5vsyu6gcdp53qyvy896',
        347898,
        '1f391a9c0d5799e96aae4df2b22c361346bc98d3e46a2c3496632fdcae52f65b'
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      block_identifier: {
        index: 347898,
        hash: '1f391a9c0d5799e96aae4df2b22c361346bc98d3e46a2c3496632fdcae52f65b'
      },
      balances: [
        {
          value: '22991000000',
          currency: {
            decimals: 6,
            symbol: 'ADA'
          }
        },
        {
          value: '2',
          currency: {
            decimals: 0,
            symbol: 'berrycoin',
            metadata: {
              policy: 'cbc34df5cb851e6fe5035a438d534ffffc87af012f3ff2d4db94288b'
            }
          }
        }
      ],
      coins: [
        {
          amount: { value: '10000000000', currency: { symbol: 'ADA', decimals: 6 } },
          coin_identifier: { identifier: '8c84514aef54ba5612f86482783e1ad6175871073ea2458c9ab336b5ff1c389e:1' }
        },
        {
          amount: { value: '9991000000', currency: { symbol: 'ADA', decimals: 6 } },
          coin_identifier: { identifier: '38b7df053b5cea5db05ebaf96e62c91d196afd935ff8895f3b15bb571ab0d124:0' }
        },
        {
          amount: {
            value: '2',
            currency: {
              symbol: 'berrycoin',
              decimals: 0,
              metadata: {
                policy: 'cbc34df5cb851e6fe5035a438d534ffffc87af012f3ff2d4db94288b'
              }
            }
          },
          coin_identifier: { identifier: '38b7df053b5cea5db05ebaf96e62c91d196afd935ff8895f3b15bb571ab0d124:0' }
        },
        {
          amount: { value: '1000000000', currency: { symbol: 'ADA', decimals: 6 } },
          coin_identifier: { identifier: '95ea0b831e80c5dcb55d560606bc760e0a03d103c7447decce98246b67b7008d:0' }
        },
        {
          amount: { value: '1000000000', currency: { symbol: 'ADA', decimals: 6 } },
          coin_identifier: { identifier: '7320005fdfbc793df2f6803ac9d7d2da81c73654d07a45d46ad66f0c8095e26d:1' }
        },
        {
          amount: { value: '1000000000', currency: { symbol: 'ADA', decimals: 6 } },
          coin_identifier: { identifier: '6f85c5723abe2ec362e942823c0911e5fdc054970ba941a461ff446637d8f1e1:1' }
        }
      ]
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
    expect(response.json().balances.length).toEqual(vpfHashAccountBalances.length);
    vpfHashAccountBalances.forEach(accountBalance => expect(response.json().balances).toContainEqual(accountBalance));
    expect(response.json().coins.length).toEqual(vpfHashCoins.length);
    vpfHashCoins.forEach(vpfHashCoin => expect(response.json().coins).toContainEqual(vpfHashCoin));
  });
});
