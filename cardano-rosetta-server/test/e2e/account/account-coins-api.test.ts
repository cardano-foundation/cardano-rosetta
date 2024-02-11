/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable camelcase */
/* eslint-disable no-magic-numbers */
import { FastifyInstance } from 'fastify';
import StatusCodes from 'http-status-codes';
import { Pool } from 'pg';
import { CARDANO, ASSET_NAME_LENGTH, POLICY_ID_LENGTH } from '../../../src/server/utils/constants';
import {
  latestBlockIdentifier,
  coinsWithSpecifiedTokens,
  coinsWithEmptyMa,
  allCoinsOfAddr1q8,
  coinsWithEmptyNameToken
} from '../fixture-data';
import { setupDatabase, setupServer } from '../utils/test-utils';

const generatePayload = (
  blockchain: string,
  network: string,
  address: string,
  currencies?: Components.Schemas.Currency[]
) => ({
  // eslint-disable-next-line camelcase
  network_identifier: {
    blockchain,
    network
  },
  account_identifier: { address },
  currencies
});

const ACCOUNT_COINS_ENDPOINT = '/account/coins';

describe('/account/coins endpoint', () => {
  let database: Pool;
  let server: FastifyInstance;

  beforeAll(async () => {
    database = setupDatabase();
    server = setupServer(database);
  });

  afterAll(async () => {
    await database.end();
  });

  test('should only consider coins till latest block', async () => {
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_COINS_ENDPOINT,
      payload: generatePayload(
        CARDANO,
        'mainnet',
        'DdzFFzCqrhsdufpFxByLTQmktKJnTrudktaHq1nK2MAEDLXjz5kbRcr5prHi9gHb6m8pTvhgK6JbFDZA1LTiTcP6g8KuPSF1TfKP8ewp'
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      block_identifier: latestBlockIdentifier,
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
      url: ACCOUNT_COINS_ENDPOINT,
      payload: generatePayload(CARDANO, 'mainnet', 'fakeAddress')
    });

    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4015,
      message: 'Provided address is invalid',
      retriable: true,
      details: { message: 'fakeAddress' }
    });
  });
  test('should have no coins for an account with zero balance', async () => {
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_COINS_ENDPOINT,
      payload: generatePayload(
        CARDANO,
        'mainnet',
        'DdzFFzCqrhsszHTvbjTmYje5hehGbadkT6WgWbaqCy5XNxNttsPNF13eAjjBHYT7JaLJz2XVxiucam1EvwBRPSTiCrT4TNCBas4hfzic'
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      block_identifier: latestBlockIdentifier,
      coins: []
    });
  });
  test('should no return coins for stake accounts', async () => {
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_COINS_ENDPOINT,
      payload: generatePayload(CARDANO, 'mainnet', 'stake1uyqq2a22arunrft3k9ehqc7yjpxtxjmvgndae80xw89mwyge9skyp')
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      block_identifier: latestBlockIdentifier,
      coins: []
    });
  });

  test('should return coins with multi assets currencies', async () => {
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_COINS_ENDPOINT,
      payload: generatePayload(
        CARDANO,
        'mainnet',
        'addr1q8a3rmnxnp986vy3tzz3vd3mdk9lmjnnw6w68uaaa8g4t4u5lddnau28pea3mdy84uls504lsc7uk9zyzmqtcxyy7jyqqjm7sg'
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      block_identifier: latestBlockIdentifier,
      coins: allCoinsOfAddr1q8
    });
  });
  test('should return coins for ma with empty name', async () => {
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_COINS_ENDPOINT,
      payload: generatePayload(
        CARDANO,
        'mainnet',
        'addr1qx5d5d8aqn0970nl3km63za5q87fwh2alm79zwuxvh6rh9lg96s8las2lwer5psc7yr59kmafzkz2l5jz4dyxghs7pvqj24sft'
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      block_identifier: latestBlockIdentifier,
      coins: coinsWithEmptyMa
    });
  });
  test('should return coins for one specified currency', async () => {
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_COINS_ENDPOINT,
      payload: generatePayload(
        CARDANO,
        'mainnet',
        'addr1q8a3rmnxnp986vy3tzz3vd3mdk9lmjnnw6w68uaaa8g4t4u5lddnau28pea3mdy84uls504lsc7uk9zyzmqtcxyy7jyqqjm7sg',
        [
          {
            decimals: 0,
            symbol: '46555a5a',
            metadata: {
              policyId: 'cebbcd14c5b11ca83d7ef93b02acfc0bcb372066bdee259f6cd9ae6c'
            }
          }
        ]
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      block_identifier: latestBlockIdentifier,
      coins: [
        {
          coin_identifier: { identifier: '038e318f0deef63f44be78a8224c06d3faae683f48eb0215a448ab13fd1eb540:0' },
          amount: {
            value: '2000000',
            currency: { decimals: 6, symbol: 'ADA' }
          },
          metadata: {
            '038e318f0deef63f44be78a8224c06d3faae683f48eb0215a448ab13fd1eb540:0': [
              {
                policyId: 'cebbcd14c5b11ca83d7ef93b02acfc0bcb372066bdee259f6cd9ae6c',
                tokens: [
                  {
                    value: '1000000',
                    currency: {
                      symbol: '46555a5a',
                      decimals: 0,
                      metadata: { policyId: 'cebbcd14c5b11ca83d7ef93b02acfc0bcb372066bdee259f6cd9ae6c' }
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    });
  });
  test('should return coins for multiple specified currencies', async () => {
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_COINS_ENDPOINT,
      payload: generatePayload(
        CARDANO,
        'mainnet',
        'addr1q8a3rmnxnp986vy3tzz3vd3mdk9lmjnnw6w68uaaa8g4t4u5lddnau28pea3mdy84uls504lsc7uk9zyzmqtcxyy7jyqqjm7sg',
        [
          {
            decimals: 0,
            symbol: '46555a5a',
            metadata: {
              policyId: 'cebbcd14c5b11ca83d7ef93b02acfc0bcb372066bdee259f6cd9ae6c'
            }
          },
          {
            decimals: 0,
            symbol: '4f47',
            metadata: {
              policyId: '818c4c891e543a4d9487b6c18e8b7ed7f0f0870158c45f94e547e7b1'
            }
          }
        ]
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      block_identifier: latestBlockIdentifier,
      coins: coinsWithSpecifiedTokens
    });
  });
  test('should return all coins when ADA is specified as currency', async () => {
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_COINS_ENDPOINT,
      payload: generatePayload(
        CARDANO,
        'mainnet',
        'addr1q8a3rmnxnp986vy3tzz3vd3mdk9lmjnnw6w68uaaa8g4t4u5lddnau28pea3mdy84uls504lsc7uk9zyzmqtcxyy7jyqqjm7sg',
        [
          {
            decimals: 6,
            symbol: 'ADA'
          }
        ]
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      block_identifier: latestBlockIdentifier,
      coins: allCoinsOfAddr1q8
    });
  });
  test('should return coins for multi asset currency with empty name', async () => {
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_COINS_ENDPOINT,
      payload: generatePayload(
        CARDANO,
        'mainnet',
        'addr1qx5d5d8aqn0970nl3km63za5q87fwh2alm79zwuxvh6rh9lg96s8las2lwer5psc7yr59kmafzkz2l5jz4dyxghs7pvqj24sft',
        [
          {
            decimals: 0,
            symbol: '\\x',
            metadata: {
              policyId: '9b9ddbada8dc9cd08509ed660d5b3a65da8f36178def7ced99fa0333'
            }
          }
        ]
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      block_identifier: latestBlockIdentifier,
      coins: coinsWithEmptyNameToken
    });
  });

  test('should fail when querying for a currency with non hex string symbol', async () => {
    const invalidSymbol = 'thisIsANonHexString';
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_COINS_ENDPOINT,
      payload: generatePayload(CARDANO, 'mainnet', 'addr_test1vre2sc6w0zftnhselly9fd6kqqnmfmklful9zcmdh92mewszqs66y', [
        {
          decimals: 0,
          symbol: invalidSymbol,
          metadata: {
            policyId: '181aace621eea2b6cb367adb5000d516fa785087bad20308c072517e'
          }
        }
      ])
    });

    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4024,
      message: 'Invalid token name',
      retriable: false,
      details: { message: 'Given name is thisIsANonHexString' }
    });
  });
  test('should fail when querying for a currency with a symbol longer than expected', async () => {
    const invalidSymbol = Array.from({ length: ASSET_NAME_LENGTH + 2 }).join('0');
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_COINS_ENDPOINT,
      payload: generatePayload(CARDANO, 'mainnet', 'addr_test1vre2sc6w0zftnhselly9fd6kqqnmfmklful9zcmdh92mewszqs66y', [
        {
          decimals: 0,
          symbol: invalidSymbol,
          metadata: {
            policyId: '181aace621eea2b6cb367adb5000d516fa785087bad20308c072517e'
          }
        }
      ])
    });

    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4024,
      message: 'Invalid token name',
      retriable: false,
      details: { message: 'Given name is 00000000000000000000000000000000000000000000000000000000000000000' }
    });
  });
  test('should fail when querying for a currency with a policy id longer than expected', async () => {
    const invalidPolicy = Array.from({ length: POLICY_ID_LENGTH + 1 }).join('w');
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_COINS_ENDPOINT,
      payload: generatePayload(CARDANO, 'mainnet', 'addr_test1vre2sc6w0zftnhselly9fd6kqqnmfmklful9zcmdh92mewszqs66y', [
        {
          decimals: 0,
          symbol: '486173414e616d65',
          metadata: {
            policyId: invalidPolicy
          }
        }
      ])
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4023,
      message: 'Invalid policy id',
      retriable: false,
      details: { message: 'Given policy id is wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww' }
    });
  });
  test('should fail when querying for a currency with a non hex policy id', async () => {
    const invalidPolicy = 'thisIsANonHexString';
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_COINS_ENDPOINT,
      payload: generatePayload(CARDANO, 'mainnet', 'addr_test1vre2sc6w0zftnhselly9fd6kqqnmfmklful9zcmdh92mewszqs66y', [
        {
          decimals: 0,
          symbol: '486173414e616d65',
          metadata: {
            policyId: invalidPolicy
          }
        }
      ])
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4023,
      message: 'Invalid policy id',
      retriable: false,
      details: { message: 'Given policy id is thisIsANonHexString' }
    });
  });
});
