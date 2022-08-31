/* eslint-disable max-len */
/* eslint-disable camelcase */
/* eslint-disable no-magic-numbers */
import { Pool } from 'pg';
import { FastifyInstance } from 'fastify';
import StatusCodes from 'http-status-codes';
import { setupDatabase, setupServer } from '../utils/test-utils';
import { CARDANO, MAINNET, OperationType } from '../../../src/server/utils/constants';
import {
  searchTransactionsWithNoFilter,
  searchTxsWithNoFiltersMaxBlock,
  searchTxWithCoinFilter,
  searchLastTxWithNoFilters,
  searchFilteredByTxHash,
  searchWithCurrencyFilter,
  searchTxWithAddressFilter,
  searchTxWithStakeAddressFilter,
  searchTxWithInputFilter,
  searchTxWithOutputFilter,
  searchTxWithPoolRetirementFilter,
  searchTxWithPoolRegistrationFilter,
  searchTxWithDeregistrationFilter,
  searchTxWithDelegationFilter,
  searchTxWithKeyRegistrationFilter,
  searchTxWithVoteRegistrationFilter,
  searchTxWithWithdrawalFilter,
  searchTxWithInputBlockFilter,
  searchTxWithOutputBlockFilter,
  searchTxWithPoolRegistrationBlockFilters,
  searchTxWithDelegationBlockFilter,
  searchTxWithDeregistrationBlock,
  searchTxWithKeyRegistrationBlockFilters,
  searchTxsWithVoteRegistrationBlockFilters,
  searchTxsWithWithdrawalBlockFilters,
  searchTxsWithComposedFilters,
  searchTxsWithOrComposedFilters,
  searchTxsAllFiltersWithInput,
  searchTxsWithAllFiltersAndInputsOrOperator,
  searchTxsAllFiltersWithOutput,
  searchTxsWithAllFiltersPoolRegistrationOrOperator,
  searchTxWithAllFiltersPoolRetirementOrOperator,
  searchTxWithAllFiltersDelegationsOrOperator,
  searchTxWithAllFiltersDeregistrationsOrOperator,
  searchTxWithAllFiltersStakeRegistrationOrOperator,
  searchTxWithAllFiltersVoteRegistrationOrOperator,
  searchTxWithAllFiltersWithdrawalOrOperator,
  searchTxsWithPoolRegistrationCoinFilters,
  searchTxWithCoinPoolRetirementFilters,
  searchTxWithCoinDelegationFilters,
  searchTxWithCoinDeregistrationFilters,
  searchTxsWithCoinStakeRegistrationFilters,
  searchTxComposedWithdrawal,
  searchTxByAddressWithInputs,
  searchTxWithCoinSpent
} from '../fixture-data';

const SEARCH_TRANSACTIONS_ENDPOINT = '/search/transactions';

const OR_OPERATOR: Components.Schemas.Operator = 'or';

const SUCCESS_STATUS = 'success';

const INVALID_STATUS = 'invalid';

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
  let serverWithoutSearchApi: FastifyInstance;
  const total_count = 32977;
  beforeAll(async () => {
    database = setupDatabase();
    server = setupServer(database);
    serverWithoutSearchApi = setupServer(database, true);
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
      total_count,
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
    expect(response.json()).toEqual({
      transactions: searchTransactionsWithNoFilter,
      total_count,
      next_offset: 2
    });
  });
  test('Should correctly apply request offset and bring the last tx besides limit passed', async () => {
    const response = await server.inject({
      method: 'post',
      url: SEARCH_TRANSACTIONS_ENDPOINT,
      payload: generateSearchTransactionsPayload(CARDANO, MAINNET, { offset: total_count - 1, limit: 2 })
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      transactions: searchLastTxWithNoFilters,
      total_count
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
  // TODO: deprecated. to be implemented
  // test('Should bring transactions that did not succeeded', async () => {
  //   const response = await serverWithAlonzoSupport.inject({
  //     method: 'post',
  //     url: SEARCH_TRANSACTIONS_ENDPOINT,
  //     payload: generateSearchTransactionsPayload(CARDANO, MAINNET, { success: false, limit: 2 })
  //   });
  //   expect(response.statusCode).toEqual(StatusCodes.OK);
  //   expect(response.json()).toEqual({
  //     transactions: searchNotSucceededTx,
  //     total_count: 1
  //   });
  // });

  // test('Should bring transactions with invalid status', async () => {
  //   const response = await serverWithAlonzoSupport.inject({
  //     method: 'post',
  //     url: SEARCH_TRANSACTIONS_ENDPOINT,
  //     payload: generateSearchTransactionsPayload(CARDANO, MAINNET, { status: INVALID_STATUS, limit: 2 })
  //   });
  //   expect(response.statusCode).toEqual(StatusCodes.OK);
  //   expect(response.json()).toEqual({
  //     transactions: searchNotSucceededTx,
  //     total_count: 1
  //   });
  // });
  test('Should not bring transactions when the offset is equal than the total_count', async () => {
    const response = await server.inject({
      method: 'post',
      url: SEARCH_TRANSACTIONS_ENDPOINT,
      payload: generateSearchTransactionsPayload(CARDANO, MAINNET, { offset: 32977, limit: 2 })
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      transactions: [],
      total_count: 32977
    });
  });
  test('Should not bring transactions when the offset is bigger than the total_count', async () => {
    const response = await server.inject({
      method: 'post',
      url: SEARCH_TRANSACTIONS_ENDPOINT,
      payload: generateSearchTransactionsPayload(CARDANO, MAINNET, { offset: 32977 + 1, limit: 2 })
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      transactions: [],
      total_count: 32977
    });
  });
  test('Should throw an error when status and success fields does not match', async () => {
    const response = await server.inject({
      method: 'post',
      url: SEARCH_TRANSACTIONS_ENDPOINT,
      payload: generateSearchTransactionsPayload(CARDANO, MAINNET, { success: false, status: SUCCESS_STATUS, limit: 2 })
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      message: 'Given operation status and success state does not match',
      code: 5014,
      retriable: false
    });
  });
  test('Should throw an error when given status filter is invalid', async () => {
    const response = await server.inject({
      method: 'post',
      url: SEARCH_TRANSACTIONS_ENDPOINT,
      payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
        success: false,
        status: 'invalidStatus',
        limit: 2
      })
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      message: 'Invalid operation status',
      code: 5013,
      details: { message: 'Given status is invalidStatus' },
      retriable: false
    });
  });
  test('Should throw an error an error when Search API is disabled ', async () => {
    const response = await serverWithoutSearchApi.inject({
      method: 'post',
      url: SEARCH_TRANSACTIONS_ENDPOINT,
      payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
        limit: 2
      })
    });
    expect(response.json()).toEqual({
      code: 5000,
      details: { message: 'An error occurred for request 1: Operation searchTransactions not implemented' },
      message: 'An error occurred',
      retriable: true
    });
  });
  // TX HASH FILTER
  describe('Transaction hash filter', () => {
    const transactionHash = '51d67e194d749df2abf4e2e11cea63ca6e1c630042a366f555939e795a6ddecf';
    test('Should bring transactions that matches the transaction hash filter', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          transactionHash,
          limit: 2
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchFilteredByTxHash,
        total_count: 1
      });
    });
    test('Should bring transactions that matches the transaction hash filter with OR Operator', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          transactionHash,
          limit: 2,
          operator: OR_OPERATOR
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchFilteredByTxHash,
        total_count: 1
      });
    });
    test('Should not return transaction that does not pass the max block filter', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          transactionHash,
          maxBlock: 4490592,
          limit: 2
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: [],
        total_count: 0
      });
    });
    test('Should not return transactions that does not match the hash passed', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          transactionHash: 'ffffffffffffffffffff',
          limit: 2
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: [],
        total_count: 0
      });
    });
    test('Should return zero transactions when the passed hash is invalid', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          transactionHash: 'invalidTxHash',
          limit: 2
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: [],
        total_count: 0
      });
    });
  });

  // COIN IDENTIFIER FILTER
  describe('Coin identifier filter', () => {
    // eslint-disable-next-line sonarjs/no-duplicate-string
    const coinIdentifier = '4bcf79c0c2967986749fd0ae03f5b54a712d51b35672a3d974707c060c4d8dac:1';
    test('Should return the transaction that matches with given coin identifier', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          coinIdentifier,
          limit: 2
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithCoinFilter,
        total_count: 1
      });
    });
    test('Should return the transaction that matches with given coin identifier with OR operator', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          coinIdentifier,
          limit: 2,
          operator: OR_OPERATOR
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithCoinFilter,
        total_count: 1
      });
    });
    test('Should return transactions where the coin was created and spent', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          coinIdentifier: '96ce9dd0565d2d255925dc33461488c8d3bcbca0622616a3cf87bbe9248ca6df:0',
          limit: 2,
          operator: OR_OPERATOR
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithCoinSpent,
        total_count: 2
      });
    });
    test('Should throw an error when given coin is bad formed', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          coinIdentifier: 'hash:hash',
          limit: 2
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.json()).toEqual({
        message: 'Coin identifier has an invalid format',
        details: {
          message: 'Given coin identifier is hash:hash'
        },
        code: 5017,
        retriable: false
      });
    });
    test('Should not return the transaction that matches with given coin identifier when it is above the max block', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          coinIdentifier,
          maxBlock: 55284,
          limit: 2
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: [],
        total_count: 0
      });
    });
    test('Should not return the transaction that matches with given coin identifier when it is not an invalid one', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          coinIdentifier,
          success: false,
          limit: 2
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: [],
        total_count: 0
      });
    });
    // TODO: deprecated. to be implemented
    // test('Should return tx that matches specified coin and is invalid', async () => {
    //   const response = await serverWithAlonzoSupport.inject({
    //     method: 'post',
    //     url: SEARCH_TRANSACTIONS_ENDPOINT,
    //     payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
    //       coinIdentifier: '0c2d516c9eaf0d9f641506f1f64be3f660a49e622f4651ed1b19d6edeaefaf4c:0',
    //       success: false,
    //       limit: 2
    //     })
    //   });
    //   expect(response.statusCode).toEqual(StatusCodes.OK);
    //   expect(response.json()).toEqual({
    //     transactions: searchTxsWithCoinAndInvalidFilters,
    //     total_count: 1
    //   });
    // });
    test('Should throw an error when coin identifier does not match transaction hash filter', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          coinIdentifier,
          transactionHash: 'ffffffffffff',
          limit: 2
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.json()).toEqual({
        message: 'Transaction hash does not match to given coin identifier',
        code: 5015,
        retriable: false
      });
    });
  });
  describe('Currency filters', () => {
    const currency = {
      symbol: '\\x',
      policy: '9b9ddbada8dc9cd08509ed660d5b3a65da8f36178def7ced99fa0333',
      decimals: 0
    };
    test('Should return the transaction that matches with given currency identifier', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          currency,
          limit: 2
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchWithCurrencyFilter,
        total_count: 1
      });
    });
    test('Should return the transaction that matches with given currency identifier with OR operator', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          currency,
          limit: 2,
          operator: OR_OPERATOR
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchWithCurrencyFilter,
        total_count: 1
      });
    });
    test('Should not return the transaction that matches with given currency identifier when it is in an above block', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          currency,
          maxBlock: 5455973,
          limit: 2
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: [],
        total_count: 0
      });
    });
    test('Should not return the transaction that matches with given currency identifier when it does not pass the status filter', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          currency,
          status: INVALID_STATUS,
          limit: 2
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: [],
        total_count: 0
      });
    });
    test('Should ignore currency filter when given currency is ADA', async () => {
      const adaCurrency = {
        symbol: 'ADA',
        policy: '',
        decimals: 8
      };
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          currency: adaCurrency,
          limit: 2
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTransactionsWithNoFilter,
        total_count,
        next_offset: 2
      });
    });
    test('Should throw an error when given currency has invalid name', async () => {
      const invalidCurrency = {
        ...currency,
        symbol: 'thisIsAnInvalidSymbol'
      };
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          currency: invalidCurrency,
          limit: 2
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.json()).toEqual({
        code: 4024,
        message: 'Invalid token name',
        retriable: false,
        details: { message: 'Given name is thisIsAnInvalidSymbol' }
      });
    });
    test('Should throw an error when given currency has invalid policy', async () => {
      const invalidCurrency = {
        ...currency,
        policy: 'thisIsANonHexString'
      };
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          currency: invalidCurrency,
          limit: 2
        })
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
  describe('Address and Account Identifier filters', () => {
    test('Should return transactions that matches with an address filter', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          address: 'addr1vy5l62qysq3j6u4jsw0u73e8teus5x36ghd04lv0vsvqvys770xjw'
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithAddressFilter,
        total_count: 2
      });
    });
    test('Should return txs where the address received and spent funds', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          address:
            'DdzFFzCqrhsje6fw2vbCiDkkgUAs8oMhqH4VkFdiPGGJNo28gbXEXqJ2igZYqnA4Zk3H7b9Wd8iPXnCqPuRDj7Npz4Rx6tVNMZuDSoxk'
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxByAddressWithInputs,
        total_count: 2
      });
    });
    test('Should return transactions that matches with an address filter with OR operator', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          address: 'addr1vy5l62qysq3j6u4jsw0u73e8teus5x36ghd04lv0vsvqvys770xjw',
          operator: OR_OPERATOR
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithAddressFilter,
        total_count: 2
      });
    });
    test('Should return same transactions searching by account identifier or address', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          accountIdentifier: 'addr1vy5l62qysq3j6u4jsw0u73e8teus5x36ghd04lv0vsvqvys770xjw'
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithAddressFilter,
        total_count: 2
      });
    });
    test('Should return same transactions searching by account identifier and address', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          accountIdentifier: 'addr1vy5l62qysq3j6u4jsw0u73e8teus5x36ghd04lv0vsvqvys770xjw',
          address: 'addr1vy5l62qysq3j6u4jsw0u73e8teus5x36ghd04lv0vsvqvys770xjw'
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithAddressFilter,
        total_count: 2
      });
    });
    test('Should return same transactions searching by stake address', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          address: 'stake1u8xg6zywhuny4evs55kr9uan8kptuq7ajf9k44z9k7aua9qevs5p3'
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithStakeAddressFilter,
        total_count: 1
      });
    });
    test('Should return transactions with address and success filters', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          address: 'addr1vy5l62qysq3j6u4jsw0u73e8teus5x36ghd04lv0vsvqvys770xjw',
          success: false
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: [],
        total_count: 0
      });
    });
    test('Should return transactions with address and max block filters', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          address: 'addr1vy5l62qysq3j6u4jsw0u73e8teus5x36ghd04lv0vsvqvys770xjw',
          maxBlock: 5406810
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: [searchTxWithAddressFilter[1]],
        total_count: 1
      });
    });
    test('Should throw an error when address and account identifier does not match', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          accountIdentifier: 'addr1vy5l62qysq3j6u4jsw0u73e8teus5x36ghd04lv0vsvqvys770xjw',
          address: 'stake1u8xg6zywhuny4evs55kr9uan8kptuq7ajf9k44z9k7aua9qevs5p3'
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.json()).toEqual({
        code: 5016,
        message: 'Address and account identifier does not match',
        retriable: false,
        details: {
          // eslint-disable-next-line quotes
          message: `Address stake1u8xg6zywhuny4evs55kr9uan8kptuq7ajf9k44z9k7aua9qevs5p3 does not match account identifier's address addr1vy5l62qysq3j6u4jsw0u73e8teus5x36ghd04lv0vsvqvys770xjw`
        }
      });
    });
  });
  // eslint-disable-next-line max-statements
  describe('Type Filter', () => {
    // eslint-disable-next-line sonarjs/no-identical-functions
    test('Should return transactions with input type filter', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.INPUT
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithInputFilter,
        total_count: 18472,
        next_offset: 2
      });
    });
    test('Should return transactions with input type filter with max block filter', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.INPUT,
          maxBlock: 5593740
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithInputBlockFilter,
        total_count: 18454,
        next_offset: 2
      });
    });
    test('Should return transactions with input type filter with max block filter with OR operator', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.INPUT,
          maxBlock: 5593740,
          operator: OR_OPERATOR
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithInputBlockFilter,
        total_count: 18454,
        next_offset: 2
      });
    });
    test('Should return transactions with input type filter with success filter', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.INPUT,
          success: false
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: [],
        total_count: 0
      });
    });
    test('Should return transactions with input type filter with max block, success filter with OR operator', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.INPUT,
          maxBlock: 5593740,
          operator: OR_OPERATOR,
          success: false
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: [],
        total_count: 0
      });
    });
    test('Should return transactions with output type filter', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.OUTPUT
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithOutputFilter,
        total_count,
        next_offset: 2
      });
    });
    test('Should return transactions with output type with max block filter', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.OUTPUT,
          maxBlock: 5593730
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithOutputBlockFilter,
        total_count: 18454,
        next_offset: 2
      });
    });
    test('Should return transactions with output type with max block filter with OR operator', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.OUTPUT,
          maxBlock: 5593730,
          operator: OR_OPERATOR,
          success: true
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithOutputBlockFilter,
        total_count: 18454,
        next_offset: 2
      });
    });
    test('Should return transactions with output type with max block and success filter', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.OUTPUT,
          maxBlock: 5593730,
          success: false
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: [],
        total_count: 0
      });
    });
    test('Should return transactions with pool registration type filter', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.POOL_REGISTRATION
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithPoolRegistrationFilter,
        total_count: 3,
        next_offset: 2
      });
    });
    test('Should return transactions with pool registration type and max block filter', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.POOL_REGISTRATION,
          maxBlock: 4619220
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithPoolRegistrationBlockFilters,
        total_count: 2
      });
    });
    test('Should return transactions with pool registration type and max block, success filter with OR operator', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.POOL_REGISTRATION,
          maxBlock: 4619220,
          operator: OR_OPERATOR,
          success: true
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithPoolRegistrationBlockFilters,
        total_count: 2
      });
    });
    test('Should return transactions with pool registration with cert type filter', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.POOL_REGISTRATION_WITH_CERT
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithPoolRegistrationFilter,
        total_count: 3,
        next_offset: 2
      });
    });
    test('Should return transactions with pool retirement type filter', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.POOL_RETIREMENT
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithPoolRetirementFilter,
        total_count: 1
      });
    });
    test('Should return transactions with pool retirement type filter and OR Operator', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.POOL_RETIREMENT,
          operator: OR_OPERATOR
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithPoolRetirementFilter,
        total_count: 1
      });
    });
    test('Should return transactions with pool retirement type and max block filter', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.POOL_RETIREMENT,
          maxBlock: 4491209
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: [],
        total_count: 0
      });
    });
    test('Should return transactions with pool retirement type and success filter', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.POOL_RETIREMENT,
          success: false
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: [],
        total_count: 0
      });
    });
    test('Should return transactions with delegation type filter', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.STAKE_DELEGATION
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithDelegationFilter,
        total_count: 63,
        next_offset: 2
      });
    });
    test('Should return transactions with delegation type and max block filter', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.STAKE_DELEGATION,
          maxBlock: 5593740
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithDelegationBlockFilter,
        total_count: 57,
        next_offset: 2
      });
    });
    test('Should return transactions with delegation type and success filter', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.STAKE_DELEGATION,
          maxBlock: 5593740,
          success: false
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: [],
        total_count: 0
      });
    });
    test('Should return transactions with delegation type and max block filter with OR operator', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.STAKE_DELEGATION,
          maxBlock: 5593740,
          operator: OR_OPERATOR,
          success: true
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithDelegationBlockFilter,
        total_count: 57,
        next_offset: 2
      });
    });
    test('Should return transactions with key deregistration type filter', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.STAKE_KEY_DEREGISTRATION
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithDeregistrationFilter,
        total_count: 2
      });
    });
    test('Should return transactions with key deregistration type and max block filters', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.STAKE_KEY_DEREGISTRATION,
          maxBlock: 5406840
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithDeregistrationBlock,
        total_count: 1
      });
    });
    test('Should return transactions with key deregistration type and max block filters with OR operator', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.STAKE_KEY_DEREGISTRATION,
          maxBlock: 5406840,
          operator: OR_OPERATOR,
          success: true
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithDeregistrationBlock,
        total_count: 1
      });
    });
    test('Should return transactions with key registration type filter', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.STAKE_KEY_REGISTRATION
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithKeyRegistrationFilter,
        total_count: 27,
        next_offset: 2
      });
    });
    test('Should return transactions with key registration type and max block filter', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.STAKE_KEY_REGISTRATION,
          maxBlock: 5593740
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithKeyRegistrationBlockFilters,
        total_count: 23,
        next_offset: 2
      });
    });
    test('Should return transactions with key registration type and success filter', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.STAKE_KEY_REGISTRATION,
          maxBlock: 5593740,
          success: false
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: [],
        total_count: 0
      });
    });
    test('Should return transactions with key registration type and max block filter and OR operator', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.STAKE_KEY_REGISTRATION,
          maxBlock: 5593740,
          success: true,
          operator: OR_OPERATOR
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithKeyRegistrationBlockFilters,
        total_count: 23,
        next_offset: 2
      });
    });
    test('Should return transactions with vote registration type filter', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.VOTE_REGISTRATION
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithVoteRegistrationFilter,
        next_offset: 2,
        total_count: 10
      });
    });
    test('Should return transactions with vote registration type and max block filters', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.VOTE_REGISTRATION,
          maxBlock: 5593740
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxsWithVoteRegistrationBlockFilters,
        next_offset: 2,
        total_count: 9
      });
    });
    test('Should return transactions with vote registration type and max block filters with OR operator', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.VOTE_REGISTRATION,
          maxBlock: 5593740,
          operator: OR_OPERATOR
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxsWithVoteRegistrationBlockFilters,
        next_offset: 2,
        total_count: 9
      });
    });
    test('Should return transactions with vote registration type, max block and success filters', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.VOTE_REGISTRATION,
          maxBlock: 5593740,
          success: false
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: [],
        total_count: 0
      });
    });
    test('Should return transactions with withdrawal type filter', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.WITHDRAWAL
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithWithdrawalFilter,
        total_count: 41,
        next_offset: 2
      });
    });
    test('Should return transactions with withdrawal type and max block filters', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.WITHDRAWAL,
          maxBlock: 5593740
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxsWithWithdrawalBlockFilters,
        total_count: 39,
        next_offset: 2
      });
    });
    test('Should return transactions with withdrawal type, max block and success filters', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.WITHDRAWAL,
          maxBlock: 5593740,
          success: false
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: [],
        total_count: 0
      });
    });
    test('Should return transactions with withdrawal type, max block and success filters with OR operator', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.WITHDRAWAL,
          maxBlock: 5593740,
          operator: OR_OPERATOR
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxsWithWithdrawalBlockFilters,
        total_count: 39,
        next_offset: 2
      });
    });
    test('Should throw an error when invalid type filter is received', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: 'invalidType'
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.json()).toEqual({
        message: 'Provided operation type is invalid',
        code: 4019,
        retriable: true
      });
    });
  });
  // eslint-disable-next-line max-statements
  describe('Composed filters', () => {
    const currency = {
      symbol: '46555a5a',
      policy: 'cebbcd14c5b11ca83d7ef93b02acfc0bcb372066bdee259f6cd9ae6c',
      decimals: 0
    };
    const coinIdentifier = '038e318f0deef63f44be78a8224c06d3faae683f48eb0215a448ab13fd1eb540:0';
    test('Should return transactions with input type, max block, coin and success filters', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.INPUT,
          maxBlock: 56740,
          coinIdentifier: '4bcf79c0c2967986749fd0ae03f5b54a712d51b35672a3d974707c060c4d8dac:1',
          success: true
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxsWithComposedFilters,
        total_count: 1
      });
    });
    test(' Should return transactions with input type, max block, coin, success and address filters ', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.INPUT,
          maxBlock: 56740,
          coinIdentifier: '4bcf79c0c2967986749fd0ae03f5b54a712d51b35672a3d974707c060c4d8dac:1',
          success: true,
          address:
            'DdzFFzCqrhsdufpFxByLTQmktKJnTrudktaHq1nK2MAEDLXjz5kbRcr5prHi9gHb6m8pTvhgK6JbFDZA1LTiTcP6g8KuPSF1TfKP8ewp'
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxsWithComposedFilters,
        total_count: 1
      });
    });
    test('Should return transactions with input type, max block, coin, success, address and currency filters', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.INPUT,
          maxBlock: 5412127,
          coinIdentifier,
          success: true,
          currency,
          address:
            'addr1q8a3rmnxnp986vy3tzz3vd3mdk9lmjnnw6w68uaaa8g4t4u5lddnau28pea3mdy84uls504lsc7uk9zyzmqtcxyy7jyqqjm7sg'
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxsAllFiltersWithInput,
        total_count: 1
      });
    });
    test('Should return transactions with output type, max block, coin, success, address and currency filters', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.OUTPUT,
          maxBlock: 5412127,
          coinIdentifier,
          success: true,
          currency,
          address:
            'addr1q8a3rmnxnp986vy3tzz3vd3mdk9lmjnnw6w68uaaa8g4t4u5lddnau28pea3mdy84uls504lsc7uk9zyzmqtcxyy7jyqqjm7sg'
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxsAllFiltersWithOutput,
        total_count: 1
      });
    });
    test('Should return transactions with pool registration type, max block, coin, success and address filters', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.POOL_REGISTRATION,
          maxBlock: 5412127,
          coinIdentifier: '29a76dd58c6309cd9cde855c0c50d81d63f921959359b1e544401ac1dbc9b472:0',
          success: true,
          address:
            'addr1q9wm6dpp9zgund873xluc5wzz3z8dqf04uxvnnafa9tc834sp4f25adz7r8sgwkq3g473htcsramrcwh25twnew0hf2sfma70k'
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxsWithPoolRegistrationCoinFilters,
        total_count: 1
      });
    });
    test('Should return transactions with pool registration type, max block, transaction hash, success and address filters', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.POOL_REGISTRATION,
          maxBlock: 5412127,
          transactionHash: '29a76dd58c6309cd9cde855c0c50d81d63f921959359b1e544401ac1dbc9b472',
          success: true,
          address:
            'addr1q9wm6dpp9zgund873xluc5wzz3z8dqf04uxvnnafa9tc834sp4f25adz7r8sgwkq3g473htcsramrcwh25twnew0hf2sfma70k'
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxsWithPoolRegistrationCoinFilters,
        total_count: 1
      });
    });
    test('Should return transactions with pool registration type, max block, coin, success, address and currency filters', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.POOL_REGISTRATION,
          maxBlock: 5412127,
          coinIdentifier: '29a76dd58c6309cd9cde855c0c50d81d63f921959359b1e544401ac1dbc9b472:0',
          success: true,
          currency,
          address:
            'addr1q9wm6dpp9zgund873xluc5wzz3z8dqf04uxvnnafa9tc834sp4f25adz7r8sgwkq3g473htcsramrcwh25twnew0hf2sfma70k'
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: [],
        total_count: 0
      });
    });
    test('Should return transactions with pool retirement type, max block, coin, success, and address filters', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.POOL_RETIREMENT,
          maxBlock: 5412127,
          coinIdentifier: '896cf8fefad1eaf0fa056ba3adf28bfb26b06d1beed64cf790deb595dcb2687a:0',
          success: true,
          address:
            'addr1q94g4wsgtm6hsxlcafvvt6fyprqtlwnme372sndfphlulyxn8j47n0r6werzg0qr7p3gs8gxw39n65uc8q330ztnhxcq9x6600'
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithCoinPoolRetirementFilters,
        total_count: 1
      });
    });
    test('Should return transactions with pool retirement type, max block, coin, success, address and currency filters', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.POOL_RETIREMENT,
          maxBlock: 5412127,
          coinIdentifier,
          success: true,
          currency,
          address:
            'addr1q8a3rmnxnp986vy3tzz3vd3mdk9lmjnnw6w68uaaa8g4t4u5lddnau28pea3mdy84uls504lsc7uk9zyzmqtcxyy7jyqqjm7sg'
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: [],
        total_count: 0
      });
    });
    test('Should return transactions with delegation type, max block, coin, success, address and currency filters', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.STAKE_DELEGATION,
          maxBlock: 5412127,
          coinIdentifier,
          success: true,
          currency,
          address:
            'addr1q8a3rmnxnp986vy3tzz3vd3mdk9lmjnnw6w68uaaa8g4t4u5lddnau28pea3mdy84uls504lsc7uk9zyzmqtcxyy7jyqqjm7sg'
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: [],
        total_count: 0
      });
    });
    test('Should return transactions with delegation type, max block, coin, success and address filters', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.STAKE_DELEGATION,
          maxBlock: 5412127,
          coinIdentifier: 'a24795549658d1b7d37a9bb3d4bbff4f29b8a107d7926f9c0be3d47e1cef13eb:0',
          success: true,
          address:
            'addr1qxw6e3qvjnh7zpxd0xrcxpq7n5zl0kemkp5l4z0euedfwdrdy6wmax33kvvhuvh9pq67a5rvp8zdsetzptdv989slfvq7k3uas'
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithCoinDelegationFilters,
        total_count: 1
      });
    });
    test('Should return transactions with deregistration type, max block, coin, success, address and currency filters', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.STAKE_KEY_DEREGISTRATION,
          maxBlock: 5412127,
          coinIdentifier,
          success: true,
          currency,
          address:
            'addr1q8a3rmnxnp986vy3tzz3vd3mdk9lmjnnw6w68uaaa8g4t4u5lddnau28pea3mdy84uls504lsc7uk9zyzmqtcxyy7jyqqjm7sg'
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: [],
        total_count: 0
      });
    });
    test('Should return transactions with deregistration type, max block, coin, success and address filters', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.STAKE_KEY_DEREGISTRATION,
          maxBlock: 5412127,
          coinIdentifier: '71667f9e0350a1fd9e5420043a41048f2895f2fd1bceeb2ffc3fa14382db50cd:0',
          success: true,
          address:
            'addr1q87mz3a88qf920qc7cjw0ctstfrrsalswuqcms3h3rvqrs8j9td2t4sk87hkmvgzeccfagup4k449665add5afsp3kxsj80ej8'
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithCoinDeregistrationFilters,
        total_count: 1
      });
    });
    test('Should return transactions with stake registration type, max block, coin, success, address and currency filters', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.STAKE_KEY_REGISTRATION,
          maxBlock: 5412127,
          coinIdentifier,
          success: true,
          currency,
          address:
            'addr1q8a3rmnxnp986vy3tzz3vd3mdk9lmjnnw6w68uaaa8g4t4u5lddnau28pea3mdy84uls504lsc7uk9zyzmqtcxyy7jyqqjm7sg'
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: [],
        total_count: 0
      });
    });
    test('Should return transactions with stake registration type, max block, coin, success and address filters', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.STAKE_KEY_REGISTRATION,
          maxBlock: 5412127,
          coinIdentifier: 'a24795549658d1b7d37a9bb3d4bbff4f29b8a107d7926f9c0be3d47e1cef13eb:0',
          success: true,
          address:
            'addr1qxw6e3qvjnh7zpxd0xrcxpq7n5zl0kemkp5l4z0euedfwdrdy6wmax33kvvhuvh9pq67a5rvp8zdsetzptdv989slfvq7k3uas'
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxsWithCoinStakeRegistrationFilters,
        total_count: 1
      });
    });
    test('Should return transactions with vote registration type, max block, coin, success, address and currency filters', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.VOTE_REGISTRATION,
          maxBlock: 5412127,
          coinIdentifier,
          success: true,
          currency,
          address:
            'addr1q8a3rmnxnp986vy3tzz3vd3mdk9lmjnnw6w68uaaa8g4t4u5lddnau28pea3mdy84uls504lsc7uk9zyzmqtcxyy7jyqqjm7sg'
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: [],
        total_count: 0
      });
    });
    test('Should return transactions with withdrawal type, max block, coin, success, address and currency filters', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.WITHDRAWAL,
          maxBlock: 5412127,
          coinIdentifier,
          success: true,
          currency,
          address:
            'addr1q8a3rmnxnp986vy3tzz3vd3mdk9lmjnnw6w68uaaa8g4t4u5lddnau28pea3mdy84uls504lsc7uk9zyzmqtcxyy7jyqqjm7sg'
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: [],
        total_count: 0
      });
    });
    test('Should return transactions with withdrawal type, max block, coin, success and address filters', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.WITHDRAWAL,
          maxBlock: 5412127,
          coinIdentifier: '89cc7f4e39708e93c4087c5ab556420c0e78c3f97cb941d3a75d5f5bdb7554d2:0',
          success: true,
          address:
            'addr1q9smf87z0akymg929wf5fz33vcsuf8m0uj4cdt0y3rnrs8czghmnrkk5qtuaah9mfpkrt3jfa4qf86tc7hj9fmxve0lqezsgut'
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxComposedWithdrawal,
        total_count: 1
      });
    });
    test('Should return transactions with input type, max block, coin and success filters with OR operator', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.INPUT,
          maxBlock: 56740,
          coinIdentifier: '4bcf79c0c2967986749fd0ae03f5b54a712d51b35672a3d974707c060c4d8dac:1',
          success: true,
          operator: OR_OPERATOR
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxsWithOrComposedFilters,
        total_count: 15886,
        next_offset: 2
      });
    });
    test('Should return transactions with input type, max block, coin, success and address filters with OR operator', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.INPUT,
          maxBlock: 56740,
          coinIdentifier: '4bcf79c0c2967986749fd0ae03f5b54a712d51b35672a3d974707c060c4d8dac:1',
          success: true,
          address:
            'DdzFFzCqrhsdufpFxByLTQmktKJnTrudktaHq1nK2MAEDLXjz5kbRcr5prHi9gHb6m8pTvhgK6JbFDZA1LTiTcP6g8KuPSF1TfKP8ewp',
          operator: OR_OPERATOR
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxsWithOrComposedFilters,
        total_count: 15888,
        next_offset: 2
      });
    });
    test('Should return transactions with input type, max block, coin, success, address and currency filters with OR operator', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.INPUT,
          maxBlock: 5412127,
          coinIdentifier,
          operator: OR_OPERATOR,
          success: true,
          currency,
          address:
            'addr1q8a3rmnxnp986vy3tzz3vd3mdk9lmjnnw6w68uaaa8g4t4u5lddnau28pea3mdy84uls504lsc7uk9zyzmqtcxyy7jyqqjm7sg'
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxsWithAllFiltersAndInputsOrOperator,
        total_count: 18421,
        next_offset: 2
      });
    });
    test('Should return transactions with output type, max block, coin, success, address and currency filters with OR operator', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.OUTPUT,
          maxBlock: 5412127,
          coinIdentifier,
          operator: OR_OPERATOR,
          success: true,
          currency,
          address:
            'addr1q8a3rmnxnp986vy3tzz3vd3mdk9lmjnnw6w68uaaa8g4t4u5lddnau28pea3mdy84uls504lsc7uk9zyzmqtcxyy7jyqqjm7sg'
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxsWithAllFiltersAndInputsOrOperator,
        total_count: 18421,
        next_offset: 2
      });
    });
    test('Should return transactions with pool registration type, max block, coin, success, address and currency filters with OR operator', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.POOL_REGISTRATION,
          maxBlock: 5412127,
          coinIdentifier,
          operator: OR_OPERATOR,
          success: true,
          currency,
          address:
            'addr1q8a3rmnxnp986vy3tzz3vd3mdk9lmjnnw6w68uaaa8g4t4u5lddnau28pea3mdy84uls504lsc7uk9zyzmqtcxyy7jyqqjm7sg'
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxsWithAllFiltersPoolRegistrationOrOperator,
        total_count: 8,
        next_offset: 2
      });
    });
    test('Should return transactions with pool registration with cert type, max block, coin, success, address and currency filters with OR operator', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.POOL_REGISTRATION_WITH_CERT,
          maxBlock: 5412127,
          coinIdentifier,
          operator: OR_OPERATOR,
          success: true,
          currency,
          address:
            'addr1q8a3rmnxnp986vy3tzz3vd3mdk9lmjnnw6w68uaaa8g4t4u5lddnau28pea3mdy84uls504lsc7uk9zyzmqtcxyy7jyqqjm7sg'
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxsWithAllFiltersPoolRegistrationOrOperator,
        total_count: 8,
        next_offset: 2
      });
    });
    test('Should return transactions with pool retirement type, max block, coin, success, address and currency filters with OR operator', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.POOL_RETIREMENT,
          maxBlock: 5412127,
          coinIdentifier,
          operator: OR_OPERATOR,
          success: true,
          currency,
          address:
            'addr1q8a3rmnxnp986vy3tzz3vd3mdk9lmjnnw6w68uaaa8g4t4u5lddnau28pea3mdy84uls504lsc7uk9zyzmqtcxyy7jyqqjm7sg'
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithAllFiltersPoolRetirementOrOperator,
        total_count: 6,
        next_offset: 2
      });
    });
    test('Should return transactions with delegation type, max block, coin, success, address and currency filters with OR operator', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.STAKE_DELEGATION,
          maxBlock: 5412127,
          coinIdentifier,
          operator: OR_OPERATOR,
          success: true,
          currency,
          address:
            'addr1q8a3rmnxnp986vy3tzz3vd3mdk9lmjnnw6w68uaaa8g4t4u5lddnau28pea3mdy84uls504lsc7uk9zyzmqtcxyy7jyqqjm7sg'
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithAllFiltersDelegationsOrOperator,
        total_count: 55,
        next_offset: 2
      });
    });
    test('Should return transactions with deregistration type, max block, coin, success, address and currency filters with OR operator', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.STAKE_KEY_DEREGISTRATION,
          maxBlock: 5412127,
          coinIdentifier,
          operator: OR_OPERATOR,
          success: true,
          currency,
          address:
            'addr1q8a3rmnxnp986vy3tzz3vd3mdk9lmjnnw6w68uaaa8g4t4u5lddnau28pea3mdy84uls504lsc7uk9zyzmqtcxyy7jyqqjm7sg'
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithAllFiltersDeregistrationsOrOperator,
        total_count: 7,
        next_offset: 2
      });
    });
    test('Should return transactions with stake registration type, max block, coin, success, address and currency filters with OR operator', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.STAKE_KEY_REGISTRATION,
          maxBlock: 5412127,
          coinIdentifier,
          operator: OR_OPERATOR,
          success: true,
          currency,
          address:
            'addr1q8a3rmnxnp986vy3tzz3vd3mdk9lmjnnw6w68uaaa8g4t4u5lddnau28pea3mdy84uls504lsc7uk9zyzmqtcxyy7jyqqjm7sg'
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithAllFiltersStakeRegistrationOrOperator,
        total_count: 26,
        next_offset: 2
      });
    });
    test('Should return transactions with vote registration type, max block, coin, success, address and currency filters with OR operator', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.VOTE_REGISTRATION,
          maxBlock: 5412127,
          coinIdentifier,
          operator: OR_OPERATOR,
          success: true,
          currency,
          address:
            'addr1q8a3rmnxnp986vy3tzz3vd3mdk9lmjnnw6w68uaaa8g4t4u5lddnau28pea3mdy84uls504lsc7uk9zyzmqtcxyy7jyqqjm7sg'
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithAllFiltersVoteRegistrationOrOperator,
        total_count: 14,
        next_offset: 2
      });
    });
    test('Should return transactions with withdrawal type, max block, coin, success, address and currency filters with OR operator', async () => {
      const response = await server.inject({
        method: 'post',
        url: SEARCH_TRANSACTIONS_ENDPOINT,
        payload: generateSearchTransactionsPayload(CARDANO, MAINNET, {
          limit: 2,
          type: OperationType.WITHDRAWAL,
          maxBlock: 5412127,
          coinIdentifier,
          operator: OR_OPERATOR,
          success: true,
          currency,
          address:
            'addr1q8a3rmnxnp986vy3tzz3vd3mdk9lmjnnw6w68uaaa8g4t4u5lddnau28pea3mdy84uls504lsc7uk9zyzmqtcxyy7jyqqjm7sg'
        })
      });
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.json()).toEqual({
        transactions: searchTxWithAllFiltersWithdrawalOrOperator,
        total_count: 39,
        next_offset: 2
      });
    });
  });
});
