import { OperatorType } from '../../../../utils/constants';
import { CoinIdentifier, SearchFilters, CurrencyId } from '../../../../models';
import { isStakeAddress } from '../../../../utils/cardano/addresses';
import {
  buildFromSentenceWithInputsAndOutputs,
  isNullOrUndefined,
  generateOutputCoinWhereCondition,
  generateInputCoinWhereCondition,
  generateTxQuery,
  withFilters
} from './commons';

/* eslint-disable-next-line complexity */
export const createCurrencyQuery = (currencyId: CurrencyId, filters: SearchFilters, isTotalCount: boolean) => {
  const { policy, symbol } = currencyId;
  const { coinIdentifier, transactionHash, address, maxBlock, status, limit, offset } = filters;
  const conditions = [];
  let joinClause = '';
  const joinTables = [];
  let outputsWhere = '';
  let inputsWhere = '';

  if (!isNullOrUndefined(status)) {
    conditions.push(`tx.valid_contract = ${status}`);
  }
  if (!coinIdentifier && transactionHash) {
    conditions.push('tx.hash = $1');
  }
  if (address) {
    const isStake = isStakeAddress(address);
    isStake && joinTables.push('stake_address ON tx_out.stake_address_id = stake_address.id');
    conditions.push(`${isStake ? `stake_address.view = '${address}'` : `tx_out.address = '${address}'`}`);
  }
  if (conditions.length > 0) {
    const whereClause = `WHERE ${conditions.join(` ${OperatorType.AND} `)}`;
    outputsWhere = inputsWhere = whereClause;
  }
  if (joinTables.length > 0) {
    joinClause = `JOIN ${joinTables.join(' JOIN ')}`;
  }
  if (coinIdentifier) {
    const operator = conditions.length > 0 ? ` ${OperatorType.AND} ` : ' WHERE ';
    outputsWhere = outputsWhere + operator + generateOutputCoinWhereCondition(coinIdentifier);
    inputsWhere = inputsWhere + operator + generateInputCoinWhereCondition(coinIdentifier);
  }
  const joinSentence = `
        JOIN ma_tx_out
          ON ma_tx_out.tx_out_id = tx_out.id
        JOIN multi_asset asset
          ON asset.id = ma_tx_out.ident
          AND asset.name = DECODE('${symbol}', 'hex')
          AND asset.policy = DECODE('${policy}', 'hex')
        ${joinClause}
        `;
  const from = buildFromSentenceWithInputsAndOutputs({
    maxBlock,
    inputsJoins: `${joinSentence} ${coinIdentifier ? 'JOIN tx AS tx_out_tx ON tx_out_tx.id = tx_in.tx_out_id' : ''}`,
    outputsJoins: joinSentence,
    inputsWhere,
    outputsWhere
  });
  return isTotalCount
    ? `SELECT COUNT(DISTINCT tx.id) AS "totalCount" ${from}`
    : generateTxQuery({ from, offset, limit });
};

export const createCoinQuery = (coinIdentifier: CoinIdentifier, filters: SearchFilters, isTotalCount: boolean) => {
  const { maxBlock, limit, offset, status, address } = filters;
  let joinClause = '';
  let whereClause = '';
  const joinTables = [];
  const conditions = [];
  if (maxBlock) {
    conditions.push(`tx.block_id <= (select id from block where block_no = ${maxBlock})`);
  }
  if (!isNullOrUndefined(status)) {
    conditions.push(`tx.valid_contract  = ${status}`);
  }
  if (address) {
    const isStake = isStakeAddress(address);
    isStake && joinTables.push('stake_address ON stake_address.id = tx_out.stake_address_id');
    conditions.push(`${isStake ? `stake_address.view = '${address}'` : `tx_out.address = '${address}'`}`);
  }
  if (conditions.length > 0) {
    whereClause = `${OperatorType.AND} ${conditions.join(` ${OperatorType.AND} `)}`;
  }
  if (joinTables.length > 0) {
    joinClause = `JOIN ${joinTables.join(' JOIN ')}`;
  }

  const from = buildFromSentenceWithInputsAndOutputs({
    maxBlock,
    inputsJoins: ` JOIN tx AS tx_out_tx ON tx_out_tx.id = tx_in.tx_out_id ${joinClause}`,
    outputsJoins: joinClause,
    inputsWhere: ` WHERE ${generateInputCoinWhereCondition(coinIdentifier)} ${whereClause}`,
    outputsWhere: ` WHERE (tx.hash = $1 AND tx_out.index = ${coinIdentifier.index}) ${whereClause}`
  });

  return isTotalCount
    ? `SELECT COUNT(DISTINCT tx.id) AS "totalCount" ${from}`
    : generateTxQuery({ from, offset, limit });
};

export const getQueryWithAndOperator = (filters: SearchFilters, isTotalCount = false) => {
  const { coinIdentifier, currencyIdentifier, type } = filters;
  if (type) {
    return withFilters(filters, isTotalCount);
  }
  if (currencyIdentifier) {
    return createCurrencyQuery(currencyIdentifier, filters, isTotalCount);
  }
  if (coinIdentifier) {
    return createCoinQuery(coinIdentifier, filters, isTotalCount);
  }
  return withFilters(filters, isTotalCount);
};
