/* eslint-disable camelcase */
/* eslint-disable no-magic-numbers */
import { FastifyInstance } from 'fastify';
import StatusCodes from 'http-status-codes';
import { Pool } from 'pg';
import { CARDANO } from '../../../src/server/utils/constants';
import {
  latestBlockIdentifier,
  address1vpfAccountBalances,
  balancesAtBlock213891,
  balancesAtBlock213892
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
      balances: [{ currency: { decimals: 6, symbol: 'ADA' }, value: '21063' }],
      block_identifier: latestBlockIdentifier
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
      }
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
      ]
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
  // At this point the total amount of rewards is 1658277357 (at epoch 224)
  // and the total amount of withdrawals is 112588803 (at block 4597861)
  test('should sum all rewards and subtract all withdrawals till block 4853177', async () => {
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
          value: '1545688554',
          currency: {
            decimals: 6,
            symbol: 'ADA'
          }
        }
      ]
    });
  });

  // should return a list of ma utxos and sum the corresponding ones to obtain the balances
  test('should return payment balance and list of ma balances', async () => {
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_BALANCE_ENDPOINT,
      payload: generatePayload(
        CARDANO,
        'mainnet',
        'addr1v87w8qgp8adh98jt3rkd57nptzz96ejf40fqgz50y6zrexqr8mz54',
        5406842,
        'c2c6a77e1c1ce1c75043bbf468d3af1e0f6e865e01f4285535be83773ec059f8'
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      block_identifier: {
        index: 5406842,
        hash: 'c2c6a77e1c1ce1c75043bbf468d3af1e0f6e865e01f4285535be83773ec059f8'
      },
      balances: [
        { value: '24800000', currency: { symbol: 'ADA', decimals: 6 } },
        {
          value: '1000000',
          currency: {
            symbol: '64697361736d',
            decimals: 0,
            metadata: { policyId: '41fa383bbfccd0378c6855326129fbef8e631a27d938dc238a2fc97c' }
          }
        },
        {
          value: '1000000',
          currency: {
            symbol: '72617473',
            decimals: 0,
            metadata: { policyId: 'd0cec3ba7bc826892d18ee2c7acd14be050b04a7c15c0ec98647c563' }
          }
        }
      ]
    });
  });

  // eslint-disable-next-line max-len
  test(
    'given a block with ma balances and the total amount of one of them are transferred in the current block, ' +
      'that token balance should not be seen at the address balance for the next block',
    async () => {
      const responseAtBlock5406841 = await server.inject({
        method: 'post',
        url: ACCOUNT_BALANCE_ENDPOINT,
        payload: generatePayload(
          CARDANO,
          'mainnet',
          'addr1vy5l62qysq3j6u4jsw0u73e8teus5x36ghd04lv0vsvqvys770xjw',
          5406841,
          '185107d5ecd969cb4961949ab279703476dbc668f833f80a2d075a9c2d1e80cc'
        )
      });
      const responseAtBlock5406842 = await server.inject({
        method: 'post',
        url: ACCOUNT_BALANCE_ENDPOINT,
        payload: generatePayload(
          CARDANO,
          'mainnet',
          'addr1vy5l62qysq3j6u4jsw0u73e8teus5x36ghd04lv0vsvqvys770xjw',
          5406842,
          'c2c6a77e1c1ce1c75043bbf468d3af1e0f6e865e01f4285535be83773ec059f8'
        )
      });

      expect(responseAtBlock5406841.statusCode).toEqual(StatusCodes.OK);
      expect(responseAtBlock5406841.json().block_identifier).toEqual({
        index: 5406841,
        hash: '185107d5ecd969cb4961949ab279703476dbc668f833f80a2d075a9c2d1e80cc'
      });
      expect(responseAtBlock5406841.json()).toEqual({
        block_identifier: { index: 5406841, hash: '185107d5ecd969cb4961949ab279703476dbc668f833f80a2d075a9c2d1e80cc' },
        balances: [
          { value: '110370442', currency: { decimals: 6, symbol: 'ADA' } },
          {
            value: '35000000000000',
            currency: {
              decimals: 0,
              symbol: '494e4459',
              metadata: { policyId: '5d9d887de76a2c9d057b3e5d34d5411f7f8dc4d54f0c06e8ed2eb4a9' }
            }
          },
          {
            value: '21000000000000',
            currency: {
              decimals: 0,
              symbol: '4c51',
              metadata: { policyId: 'da8c30857834c6ae7203935b89278c532b3995245295456f993e1d24' }
            }
          }
        ]
      });
      expect(responseAtBlock5406842.statusCode).toEqual(StatusCodes.OK);
      expect(responseAtBlock5406842.json()).toEqual({
        block_identifier: {
          index: 5406842,
          hash: 'c2c6a77e1c1ce1c75043bbf468d3af1e0f6e865e01f4285535be83773ec059f8'
        },
        balances: [
          { value: '107181709', currency: { symbol: 'ADA', decimals: 6 } },
          {
            value: '35000000000000',
            currency: {
              decimals: 0,
              symbol: '494e4459',
              metadata: { policyId: '5d9d887de76a2c9d057b3e5d34d5411f7f8dc4d54f0c06e8ed2eb4a9' }
            }
          }
        ]
      });
    }
  );

  test('should return balances for ma with empty name', async () => {
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_BALANCE_ENDPOINT,
      payload: generatePayload(
        CARDANO,
        'mainnet',
        'addr1qx5d5d8aqn0970nl3km63za5q87fwh2alm79zwuxvh6rh9lg96s8las2lwer5psc7yr59kmafzkz2l5jz4dyxghs7pvqj24sft',
        5455974,
        '16d14ca745d5956021e20656175bd8b548798ea04a27d9bf5e9f2090ea200434'
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    const balanceWithEmptyToken = [
      { value: '106236428', currency: { symbol: 'ADA', decimals: 6 } },
      {
        value: '97614924',
        currency: {
          symbol: '4552474f',
          decimals: 0,
          metadata: { policyId: '5ee467ea4ef07b6f41d88d26ea4c872db6f47ddf27c0d7d3745462a8' }
        }
      },
      {
        value: '999999999999',
        currency: {
          symbol: '7370616365636f696e73',
          decimals: 0,
          metadata: { policyId: '5ee467ea4ef07b6f41d88d26ea4c872db6f47ddf27c0d7d3745462a8' }
        }
      },
      {
        value: '44999685001',
        currency: {
          symbol: '416461',
          decimals: 0,
          metadata: { policyId: '7a8414dcb7037abcc155a8edb7d56f7a3d24fa14d57635c5fd5a185f' }
        }
      },
      {
        value: '9223372036854775000',
        currency: {
          symbol: '54686973546f6b656e57696c6c53656c664465737472756374496e53657665',
          decimals: 0,
          metadata: { policyId: '7a8414dcb7037abcc155a8edb7d56f7a3d24fa14d57635c5fd5a185f' }
        }
      },
      {
        value: '9223372036854775807',
        currency: {
          symbol: '\\x',
          decimals: 0,
          metadata: { policyId: '9b9ddbada8dc9cd08509ed660d5b3a65da8f36178def7ced99fa0333' }
        }
      },
      {
        value: '998000000',
        currency: {
          symbol: '4469616d6f6e64',
          decimals: 0,
          metadata: { policyId: '9b9ddbada8dc9cd08509ed660d5b3a65da8f36178def7ced99fa0333' }
        }
      },
      {
        value: '1000000000000000001',
        currency: {
          symbol: '46726565646f6d546f4e6176616c6e79436f696e',
          decimals: 0,
          metadata: { policyId: '9b9ddbada8dc9cd08509ed660d5b3a65da8f36178def7ced99fa0333' }
        }
      },
      {
        value: '45000000000000000',
        currency: {
          symbol: '4c6f76656c616365',
          decimals: 0,
          metadata: { policyId: '9b9ddbada8dc9cd08509ed660d5b3a65da8f36178def7ced99fa0333' }
        }
      },
      {
        value: '999000000',
        currency: {
          symbol: 'd091d180d0b8d0bbd0bbd0b8d0b0d0bdd182',
          decimals: 0,
          metadata: { policyId: '9b9ddbada8dc9cd08509ed660d5b3a65da8f36178def7ced99fa0333' }
        }
      }
    ];
    expect(response.json()).toEqual({
      block_identifier: {
        index: 5455974,
        hash: '16d14ca745d5956021e20656175bd8b548798ea04a27d9bf5e9f2090ea200434'
      },
      balances: balanceWithEmptyToken
    });
  });
});
