import { PopulatedTransaction } from '../models';
import { mapToRosettaTransaction } from './data-mapper';

export interface SearchTransactionsMapperParameters {
  transactions: PopulatedTransaction[];
  poolDeposit: string;
  offset: number;
  limit: number;
  totalCount: number;
}

export const mapToSearchTransactionsResponse = (
  parameters: SearchTransactionsMapperParameters
): Components.Schemas.SearchTransactionsResponse => {
  const { transactions, poolDeposit, totalCount, offset, limit } = parameters;
  /* eslint-disable camelcase */
  const blockTransactions = transactions.map(tx => ({
    block_identifier: {
      index: tx.blockNo,
      hash: tx.blockHash
    },
    transaction: mapToRosettaTransaction(tx, poolDeposit)
  }));
  const nextOffset = offset + limit;
  const toReturn: Components.Schemas.SearchTransactionsResponse = {
    transactions: blockTransactions,
    total_count: totalCount
  };
  if (nextOffset < totalCount) {
    toReturn.next_offset = nextOffset;
  }
  return toReturn;
};
