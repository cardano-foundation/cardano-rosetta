/* eslint-disable camelcase */
import { Pool } from 'pg';
import { FastifyInstance } from 'fastify';
import StatusCodes from 'http-status-codes';
import { setupDatabase, setupServer } from '../utils/test-utils';
import { CARDANO, MAINNET } from '../../../src/server/utils/constants';
import {
  searchTransactionsWithNoFilter,
  searchTxsWithNoFiltersMaxBlock,
  searchLastTxWithNoFilters,
  searchNotSucceededTx
} from '../fixture-data';

const SEARCH_TRANSACTIONS_ENDPOINT = '/search/transactions';

const OR_OPERATOR: Components.Schemas.Operator = 'or';

const AND_OPERATOR: Components.Schemas.Operator = 'and';

interface CurrencyId {
  symbol: string;
  policy: string;
  decimals: number;
}

interface SearchTransactionsFilters {
  operator?: Components.Schemas.Operator;
  maxBlock?: number;
  offset?: number;
  limit?: number;
  transactionHash?: string;
  accountIdentifier?: string;
  address?: string;
  coinIdentifier?: string;
  currency?: CurrencyId;
  success?: boolean;
  status?: string;
  type?: string;
}

export const generateSearchTransactionsPayload = (
  blockchain: string,
  network: string,
  parameters: SearchTransactionsFilters
): Components.Schemas.SearchTransactionsRequest => {
  const {
    operator,
    maxBlock,
    offset,
    limit,
    transactionHash,
    accountIdentifier,
    address,
    coinIdentifier,
    currency,
    success,
    status,
    type
  } = parameters;
  const toReturn: Components.Schemas.SearchTransactionsRequest = {
    // eslint-disable-next-line camelcase
    network_identifier: {
      blockchain,
      network
    },
    operator,
    max_block: maxBlock,
    offset,
    limit,
    address,
    success,
    status,
    type
  };
  if (transactionHash) {
    toReturn.transaction_identifier = {
      hash: transactionHash
    };
  }
  if (accountIdentifier) {
    toReturn.account_identifier = {
      address: accountIdentifier
    };
  }
  if (coinIdentifier) {
    toReturn.coin_identifier = {
      identifier: coinIdentifier
    };
  }
  if (currency) {
    toReturn.currency = {
      symbol: currency.symbol,
      decimals: currency.decimals,
      metadata: {
        policyId: currency.policy
      }
    };
  }
  return toReturn;
};

describe('/search/transactions endpoint', () => {
  let database: Pool;
  let server: FastifyInstance;
  let alonzoDatabase: Pool;
  let serverWithAlonzoSupport: FastifyInstance;
  beforeAll(async () => {
    database = setupDatabase();
    server = setupServer(database);
    alonzoDatabase = setupDatabase(process.env.DB_CONNECTION_STRING, 'purple');
    serverWithAlonzoSupport = setupServer(alonzoDatabase);
  });

  afterAll(async () => {
    await database.end();
  });

  test('Should bring last transactions when no filters are passed', async () => {
    const response = await server.inject({
      method: 'post',
      url: SEARCH_TRANSACTIONS_ENDPOINT,
      payload: generateSearchTransactionsPayload(CARDANO, MAINNET, { limit: 2 })
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      transactions: searchTransactionsWithNoFilter,
      total_count: 33458,
      next_offset: 2
    });
  });

  test('Should bring last transactions when no filters are passed with OR operator', async () => {
    const response = await server.inject({
      method: 'post',
      url: SEARCH_TRANSACTIONS_ENDPOINT,
      payload: generateSearchTransactionsPayload(CARDANO, MAINNET, { operator: OR_OPERATOR, limit: 2 })
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    // expect(response.json()).toEqual({
    //   transactions: searchTransactionsWithNoFilter,
    //   total_count: 33458,
    //   next_offset: 2
    // });
  });

  test('Should correctly apply request offset and bring the last tx besides limit passed', async () => {
    const response = await server.inject({
      method: 'post',
      url: SEARCH_TRANSACTIONS_ENDPOINT,
      payload: generateSearchTransactionsPayload(CARDANO, MAINNET, { offset: 33457, limit: 2 })
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      transactions: searchLastTxWithNoFilters,
      total_count: 33458
    });
  });

  test('Should correctly apply max block filter', async () => {
    const response = await server.inject({
      method: 'post',
      url: SEARCH_TRANSACTIONS_ENDPOINT,
      payload: generateSearchTransactionsPayload(CARDANO, MAINNET, { limit: 2, maxBlock: 3337 })
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      transactions: searchTxsWithNoFiltersMaxBlock,
      total_count: 2
    });
  });

  test('Should bring transactions that did not succeeded', async () => {
    const response = await serverWithAlonzoSupport.inject({
      method: 'post',
      url: SEARCH_TRANSACTIONS_ENDPOINT,
      payload: generateSearchTransactionsPayload(CARDANO, MAINNET, { success: false, limit: 2 })
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      transactions: searchNotSucceededTx,
      total_count: 1
    });
  });
});
