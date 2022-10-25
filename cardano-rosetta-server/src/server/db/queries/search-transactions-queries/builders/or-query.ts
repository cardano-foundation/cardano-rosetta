import { OperationType, CatalystLabels, OperatorType } from '../../../../utils/constants';
import { SearchFilters, CurrencyId } from '../../../../models';
import { isStakeAddress } from '../../../../utils/cardano/addresses';
import {
  TYPES_TO_IGNORE,
  buildFromSentenceWithInputsAndOutputs,
  isNullOrUndefined,
  generateOutputCoinWhereCondition,
  generateInputCoinWhereCondition,
  generateTxQuery,
  withFilters
} from './commons';

const queryOrTypeMapping: {
  [type: string]: { select: string; where: string; joinedTxOut?: boolean };
} = {
  [OperationType.INPUT]: {
    select: 'LEFT JOIN tx_in ON tx_in.tx_in_id = tx.id',
    where: 'tx_in.id IS NOT NULL'
  },
  [OperationType.OUTPUT]: {
    select: 'LEFT JOIN tx_out ON tx_out.tx_id = tx.id',
    where: 'tx_out.id IS NOT NULL'
  },
  [OperationType.POOL_REGISTRATION]: {
    select: 'LEFT JOIN pool_update pu ON tx.id = pu.registered_tx_id',
    where: 'pu.id IS NOT NULL'
  },
  [OperationType.POOL_REGISTRATION_WITH_CERT]: {
    select: 'LEFT JOIN pool_update pu ON tx.id = pu.registered_tx_id',
    where: 'pu.id IS NOT NULL'
  },
  [OperationType.POOL_RETIREMENT]: {
    select: 'LEFT JOIN pool_retire pr ON tx.id = pr.announced_tx_id',
    where: 'pr.id IS NOT NULL'
  },
  [OperationType.STAKE_DELEGATION]: {
    select: 'LEFT JOIN delegation d ON tx.id = d.tx_id',
    where: 'd.id IS NOT NULL'
  },
  [OperationType.STAKE_KEY_DEREGISTRATION]: {
    select: 'LEFT JOIN stake_deregistration sd ON sd.tx_id = tx.id',
    where: 'sd.id IS NOT NULL'
  },
  [OperationType.STAKE_KEY_REGISTRATION]: {
    select: 'LEFT JOIN stake_registration sr ON sr.tx_id = tx.id',
    where: 'sr.id IS NOT NULL'
  },
  [OperationType.VOTE_REGISTRATION]: {
    select: `
        LEFT JOIN tx_metadata AS metadata_sig
          ON metadata_sig.tx_id = tx.id 
          AND metadata_sig.key = ${CatalystLabels.SIG}
        LEFT JOIN tx_metadata AS metadata_data
          ON metadata_data.tx_id = tx.id
          AND metadata_data.key = ${CatalystLabels.DATA}`,
    where: '(metadata_sig.id IS NOT NULL AND metadata_data.id IS NOT NULL)'
  },
  [OperationType.WITHDRAWAL]: {
    select: 'LEFT JOIN withdrawal ON withdrawal.tx_id = tx.id',
    where: 'withdrawal.id IS NOT NULL'
  }
};

const buildCommonJoinSentence = (
  { type, address, currencyIdentifier }: { type?: string; address?: string; currencyIdentifier?: CurrencyId },
  whereClause: string
) => `  
    ${type ? `${TYPES_TO_IGNORE.includes(type as OperationType) ? '' : queryOrTypeMapping[type].select}` : ''}
    ${
      address && isStakeAddress(address)
        ? `
    LEFT JOIN stake_address ON tx_out.stake_address_id = stake_address.id
    `
        : ''
    }
    ${
      currencyIdentifier
        ? `
           LEFT JOIN ma_tx_out ON ma_tx_out.tx_out_id = tx_out.id 
           LEFT JOIN multi_asset asset ON asset.id = ma_tx_out.ident
           `
        : ''
    }
    ${whereClause}`;

// eslint-disable-next-line complexity, sonarjs/cognitive-complexity
export const getQueryWithOrOperator = (filters: SearchFilters) => {
  const {
    maxBlock,
    coinIdentifier,
    currencyIdentifier,
    status,
    transactionHash,
    address,
    type,
    offset,
    limit
  } = filters;
  const statusExists = !isNullOrUndefined(status);
  const conditions = [];
  let whereClause = '';
  let outputsWhere = '';
  let inputsWhere = '';
  let outputsJoins = buildCommonJoinSentence({ type, address, currencyIdentifier }, whereClause);
  let inputsJoins = buildCommonJoinSentence({ type, address, currencyIdentifier }, whereClause);

  if (!coinIdentifier && transactionHash) {
    conditions.push('tx.hash =  $1');
  }
  if (currencyIdentifier) {
    conditions.push(`(asset.name = DECODE('${currencyIdentifier.symbol}', 'hex') 
        AND asset.policy = DECODE('${currencyIdentifier.policy}', 'hex'))`);
  }
  if (address) {
    conditions.push(
      `${isStakeAddress(address) ? `stake_address.view = '${address}'` : `tx_out.address = '${address}'`}`
    );
  }
  if (type) {
    if (type === OperationType.INPUT) outputsJoins += ` ${queryOrTypeMapping[type].select} `;
    conditions.push(queryOrTypeMapping[type].where);
  }
  if (conditions.length > 0 || statusExists) {
    let statusCondition = '';
    if (!isNullOrUndefined(status))
      statusCondition = conditions.length > 0 ? `AND tx.valid_contract = ${status}` : `tx.valid_contract = ${status}`;
    whereClause = `WHERE ${
      conditions.length > 0 ? `(${conditions.join(` ${OperatorType.OR} `)})` : ''
    } ${statusCondition}`;
    outputsWhere = inputsWhere = whereClause;
  }
  if (coinIdentifier) {
    const operator = conditions.length > 0 ? ` ${OperatorType.OR} ` : ' WHERE ';
    outputsWhere += operator + generateOutputCoinWhereCondition(coinIdentifier);
    inputsWhere += operator + generateInputCoinWhereCondition(coinIdentifier);
    inputsJoins += ' LEFT JOIN tx AS tx_out_tx ON tx_out_tx.id = tx_in.tx_out_id ';
  }
  const requiresToQueryInputsAndOutputs = coinIdentifier || currencyIdentifier || address;
  const from = requiresToQueryInputsAndOutputs
    ? buildFromSentenceWithInputsAndOutputs({
        maxBlock,
        inputsJoins,
        outputsJoins,
        outputsWhere,
        inputsWhere
      })
    : `
  FROM tx
  JOIN block
    ON block.id = tx.block_id ${maxBlock ? ` AND block_no <= ${maxBlock}` : ''}
  ${type ? queryOrTypeMapping[type].select : ''}
  ${whereClause}
`;

  return generateTxQuery({ from, offset, limit });
};

export const createComposedCountQuery = (filters: SearchFilters) => {
  const { type, operator, currencyIdentifier, coinIdentifier, maxBlock, offset, limit, status, address } = filters;
  const mustFilters = { operator, maxBlock, status, offset, limit };
  const countQueries = [];
  if (type) {
    countQueries.push(withFilters({ ...mustFilters, type }, true));
  }
  if (currencyIdentifier) {
    countQueries.push(withFilters({ ...mustFilters, currencyIdentifier }, true));
  }
  if (coinIdentifier) {
    countQueries.push(withFilters({ ...mustFilters, coinIdentifier }, true));
  }
  if (address) {
    countQueries.push(withFilters({ ...mustFilters, address }, true));
  }
  if (countQueries.length === 0) countQueries.push(withFilters(filters, true));
  return `SELECT SUM("totalCount") AS "totalCount" FROM (${countQueries.join(' UNION ALL ')}) filters_count`;
};
