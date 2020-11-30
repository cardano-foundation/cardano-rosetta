/* eslint-disable camelcase */
/* eslint-disable no-magic-numbers */
import { FastifyInstance } from 'fastify';
import StatusCodes from 'http-status-codes';
import { Pool } from 'pg';
import { setupDatabase, setupServer } from '../utils/test-utils';
import { CARDANO } from '../../../src/server/utils/constants';
import { latestBlock } from '../fixture-data';

const generatePayload = (
  blockchain: string,
  network: string,
  address: string,
) => ({
  // eslint-disable-next-line camelcase
  network_identifier: {
    blockchain,
    network
  },
  account_identifier: { address },
  include_mempool: false
});

const ACCOUNT_COINS_ENDPOINT = '/account/coins';

describe('/account/coins endpoint', () => {
  let database: Pool;
  let server: FastifyInstance;
  beforeAll(async () => {
    database = setupDatabase(false);
    server = setupServer(database);
  });

  afterAll(async () => {
    await database.end();
  });

  test('should return all utxos until last block', async () => {
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_COINS_ENDPOINT,
      payload: generatePayload(
        CARDANO,
        'mainnet',
        'DdzFFzCqrhsdoAvvE5tYdW3CcyHKgsUFXMdWVcsJTNhQzBZqr7GUzuM2tJjc7wyiLiLHGajTjZzLZp9jtUi4juY3ntmjs6ocpt7uV5TG'
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      block_identifier: latestBlock.block.block_identifier,
      coins: [
        {
          coin_identifier: { identifier: 'af0dd90debb1fbaf3854b90686ba2d6f7c95416080e8cda18d9ea3cb6bb195ad:0' },
          amount: { value: '21063', currency: { symbol: 'ADA', decimals: 6 } }
        }
      ]
    });
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
      block_identifier: latestBlock.block.block_identifier,
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
      url: ACCOUNT_COINS_ENDPOINT,
      payload: generatePayload(CARDANO, 'mainnet', 'fakeAddress')
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      block_identifier: {
        hash: 'f1c244bece74921b7aa85fc20f32f65ba17d9596eeb8ce4cf1152f67922e7b74',
        index: 44
      },
      coins: []
    });
  });
});
