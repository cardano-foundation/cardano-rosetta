import { OperationType, CatalystLabels, OperatorType } from '../../utils/constants';
import { CoinIdentifier, SearchFilters, CurrencyId } from '../../models';
import { isStakeAddress } from '../../utils/cardano/addresses';

const transactionBlockQuery = `
SELECT 
    tx.hash,
    tx.fee,
    tx.size,
    tx.valid_contract AS "validContract",
    tx.script_size AS "scriptSize",
    block.hash AS "blockHash",
    block.block_no as "blockNo"
`;

const transactionQuery = `
SELECT 
  tx.id,
  tx."size",
  tx.fee,
  tx.hash,
  tx.valid_contract,
  tx.block_id
`;

const defaultTransactionQuery = () => `
  FROM tx
  JOIN block
    ON block.id = tx.block_id
`;

const findTransactionsWithInputs = (conditions: SearchFilters) => {
  const { maxBlock } = conditions;
  return `FROM tx
  JOIN tx_in
      ON tx_in.tx_in_id = tx.id
  JOIN block
      ON block.id = tx.block_id ${maxBlock ? `AND block_no <= ${maxBlock}` : ''}`;
};

const findTransactionsWithOutputs = (conditions: SearchFilters) => {
  const { maxBlock } = conditions;
  return `FROM tx
  JOIN tx_out
      ON tx.id = tx_out.tx_id
  JOIN block
      ON block.id = tx.block_id ${maxBlock ? `AND block_no <= ${maxBlock}` : ''}`;
};

const findTransactionsWithPoolRegistrations = (conditions: SearchFilters) => {
  const { maxBlock } = conditions;
  return `FROM pool_update pu
      JOIN tx 
          ON pu.registered_tx_id = tx.id
      JOIN block
          ON block.id = tx.block_id ${maxBlock ? `AND block_no <= ${maxBlock}` : ''}
      `;
};

const findTransactionsWithPoolRetirements = (conditions: SearchFilters) => {
  const { maxBlock } = conditions;
  return `FROM pool_retire pr
      JOIN tx
          ON tx.id = pr.announced_tx_id
      JOIN block
          ON block.id = tx.block_id ${maxBlock ? `AND block_no <= ${maxBlock}` : ''}
      `;
};

const findTransactionsWithDelegations = (conditions: SearchFilters) => {
  const { maxBlock } = conditions;
  return `FROM delegation d
  JOIN tx
      ON d.tx_id = tx.id
  JOIN block
      ON block.id = tx.block_id ${maxBlock ? `AND block_no <= ${maxBlock}` : ''}
  `;
};

const findTransactionsWithKeyDeregistrations = (conditions: SearchFilters) => {
  const { maxBlock } = conditions;
  return `
      FROM stake_deregistration sd
      JOIN tx
          ON tx.id = sd.tx_id
      JOIN block
          ON block.id = tx.block_id ${maxBlock ? `AND block_no <= ${maxBlock}` : ''}
      `;
};

const findTransactionsWithKeyRegistrations = (conditions: SearchFilters) => {
  const { maxBlock } = conditions;
  return `
      FROM stake_registration sr
      JOIN tx on tx.id = sr.tx_id
      JOIN block
          ON block.id = tx.block_id ${maxBlock ? `AND block_no <= ${maxBlock}` : ''}
      `;
};

const findTransactionsWithVoteRegistrations = (conditions: SearchFilters) => {
  const { maxBlock } = conditions;
  return `
      FROM tx
      JOIN tx_metadata AS metadata_sig
        ON metadata_sig.tx_id = tx.id 
          AND key = ${CatalystLabels.SIG}
      JOIN tx_metadata AS metadata_data
        ON metadata_data.tx_id = tx.id
          AND key = ${CatalystLabels.DATA}
      JOIN block
          ON block.id = tx.block_id ${maxBlock ? `AND block_no <= ${maxBlock}` : ''}
      `;
};

const findTransactionsWithWithdrawals = (conditions: SearchFilters) => {
  const { maxBlock } = conditions;
  return `
      FROM withdrawal w
      JOIN tx on w.tx_id = tx.id
      JOIN block
          ON block.id = tx.block_id ${maxBlock ? `AND block_no <= ${maxBlock}` : ''}
      `;
};

const queryAndTypeMapping: { [type: string]: (conditions: SearchFilters) => string } = {
  [OperationType.INPUT]: conditions => findTransactionsWithInputs(conditions),
  [OperationType.OUTPUT]: conditions => findTransactionsWithOutputs(conditions),
  [OperationType.POOL_REGISTRATION]: conditions => findTransactionsWithPoolRegistrations(conditions),
  [OperationType.POOL_REGISTRATION_WITH_CERT]: conditions => findTransactionsWithPoolRegistrations(conditions),
  [OperationType.POOL_RETIREMENT]: conditions => findTransactionsWithPoolRetirements(conditions),
  [OperationType.STAKE_DELEGATION]: conditions => findTransactionsWithDelegations(conditions),
  [OperationType.STAKE_KEY_DEREGISTRATION]: conditions => findTransactionsWithKeyDeregistrations(conditions),
  [OperationType.STAKE_KEY_REGISTRATION]: conditions => findTransactionsWithKeyRegistrations(conditions),
  [OperationType.VOTE_REGISTRATION]: conditions => findTransactionsWithVoteRegistrations(conditions),
  [OperationType.WITHDRAWAL]: conditions => findTransactionsWithWithdrawals(conditions)
};

const queryOrTypeMapping: {
  [type: string]: () => { select: string; where: string; joinedTxOut?: boolean };
} = {
  [OperationType.INPUT]: () => ({
    select: 'LEFT JOIN tx_in ON tx_in.tx_in_id = tx.id',
    where: 'tx_in.id IS NOT NULL'
  }),
  [OperationType.OUTPUT]: () => ({
    select: 'LEFT JOIN tx_out ON tx_out.tx_id = tx.id',
    where: 'tx_out.id IS NOT NULL'
  }),
  [OperationType.POOL_REGISTRATION]: () => ({
    select: 'LEFT JOIN pool_update pu ON tx.id = pu.registered_tx_id',
    where: 'pu.id IS NOT NULL'
  }),
  [OperationType.POOL_REGISTRATION_WITH_CERT]: () => ({
    select: 'LEFT JOIN pool_update pu ON tx.id = pu.registered_tx_id',
    where: 'pu.id IS NOT NULL'
  }),
  [OperationType.POOL_RETIREMENT]: () => ({
    select: 'LEFT JOIN pool_retire pr ON tx.id = pr.announced_tx_id',
    where: 'pr.id IS NOT NULL'
  }),
  [OperationType.STAKE_DELEGATION]: () => ({
    select: 'LEFT JOIN delegation d ON tx.id = d.tx_id',
    where: 'd.id IS NOT NULL'
  }),
  [OperationType.STAKE_KEY_DEREGISTRATION]: () => ({
    select: 'LEFT JOIN stake_deregistration sd ON sd.tx_id = tx.id',
    where: 'sd.id IS NOT NULL'
  }),
  [OperationType.STAKE_KEY_REGISTRATION]: () => ({
    select: 'LEFT JOIN stake_registration sr ON sr.tx_id = tx.id',
    where: 'sr.id IS NOT NULL'
  }),
  [OperationType.VOTE_REGISTRATION]: () => ({
    select: `
    LEFT JOIN tx_metadata AS metadata_sig
      ON metadata_sig.tx_id = tx.id 
      AND key = ${CatalystLabels.SIG}
    LEFT JOIN tx_metadata AS metadata_data
      ON metadata_data.tx_id = tx.id
      AND key = ${CatalystLabels.DATA}`,
    where: '(metadata_sig.id IS NOT NULL AND metadata_data.id IS NOT NULL)'
  }),
  [OperationType.WITHDRAWAL]: () => ({
    select: 'LEFT JOIN withdrawal ON withdrawal.tx_id = tx.id',
    where: 'withdrawal.id IS NOT NULL'
  })
};

/* eslint-disable complexity */
/* eslint-disable max-statements*/
/* eslint-disable-next-line sonarjs/cognitive-complexity */
const withConditions = (query: string, filters: SearchFilters, isTotalCount: boolean): string => {
  const { transactionHash, status, coinIdentifier, currencyIdentifier, address } = filters;
  const whereConditions = [];
  let whereSentence = '';
  let joinSentence = '';
  const joinTables = [];

  if (status !== undefined || status !== null) {
    whereConditions.push(`tx.valid_contract = ${status}`);
  }
  if (coinIdentifier) {
    const { hash, index } = coinIdentifier;
    // eslint-disable-next-line sonarjs/no-duplicate-string
    joinTables.push('tx_out ON tx.id = tx_out.tx_id');
    whereConditions.push(`tx.hash = ${hash}`);
    whereConditions.push(`tx_out.index = ${index}`);
  }
  if (transactionHash && !coinIdentifier) {
    whereConditions.push(`tx.hash = ${transactionHash}`);
  }
  if (currencyIdentifier) {
    const { policy, symbol } = currencyIdentifier;
    !coinIdentifier && joinTables.push('tx_out ON tx.id = tx_out.tx_id');
    joinTables.push(`ma_tx_out ON ma_tx_out.tx_out_id = tx_out.id 
                      AND ma_tx_out.name = DECODE('${symbol}', 'hex')
                      AND ma_tx_out.policy = DECODE('${policy}', 'hex')`);
  }
  if (address) {
    const isStake = isStakeAddress(address);
    !currencyIdentifier && !coinIdentifier && joinTables.push('tx_out ON tx.id = tx_out.tx_id');
    isStake && joinTables.push('stake_address ON tx_out.stake_address_id = stake_address.id');
    whereConditions.push(`${isStake ? `stake_address.view = ${address}` : `tx_out.address = ${address}`}`);
  }
  if (whereConditions.length > 0) {
    whereSentence = `WHERE ${whereConditions.join(` ${OperatorType.AND}`)}`;
  }
  if (joinTables.length > 0) {
    joinSentence = `JOIN ${joinTables.join(' JOIN ')}`;
  }
  const text = `${query} ${joinSentence} ${whereSentence}`;
  return isTotalCount
    ? `SELECT COUNT(tx.id) ${text}`
    : `
    WITH tx_query AS 
      (
        ${transactionQuery}
        ${text}
        GROUP BY tx_out_tx.id
        ORDER BT tx_out_tx.id
        LIMIT $1
        OFFSET $2
      )
    ${transactionBlockQuery}
    FROM tx_query AS tx
    JOIN block 
      ON block.id = tx.block_id
    `;
};

const createCoinQuery = (coinIdentifier: CoinIdentifier, filters: SearchFilters, isTotalCount: boolean) => {
  const { maxBlock, operator, status, address } = filters;
  let txOutTxClause = '';
  let txInTxClause = '';
  let joinClause = '';
  let whereClause = '';
  const txInTxConditions = [];
  const txOutTxConditions = [];
  const joinTables = [];
  const conditions = [];
  if (maxBlock) {
    txInTxConditions.push(`tx_in_tx.block_id <= (select id from block where block_no = ${maxBlock})`);
    txOutTxConditions.push(`tx_out_tx.block_id <= (select id from block where block_no = ${maxBlock})`);
  }
  if (status !== undefined || status !== null) {
    txInTxConditions.push(`tx_in_tx.valid_contract = ${status})`);
    txOutTxConditions.push(`tx_out_tx.valid_contract  = ${status})`);
  }
  if (address) {
    const isStake = isStakeAddress(address);
    isStake && joinTables.push('stake_address ON stake_address.id = tx_out.stake_address_id');
    conditions.push(`${isStake ? `stake_address.view = ${address}` : `tx_out.address = ${address}`}`);
  }
  if (txInTxConditions.length > 0 && txOutTxConditions.length > 0) {
    txOutTxClause = ` AND (${txOutTxConditions.join(` ${operator} `)})`;
    txInTxClause = ` AND (${txInTxConditions.join(` ${operator} `)})`;
  }
  if (conditions.length > 0) {
    whereClause = `AND ${conditions.join(' AND ')}`;
  }
  if (joinTables.length > 0) {
    joinClause = `JOIN ${joinTables.join(' JOIN ')}`;
  }
  const text = `
  FROM tx_out
  LEFT JOIN tx_in ON 
    tx_out.tx_id = tx_in.tx_out_id AND 
    tx_out.index::smallint = tx_in.tx_out_index::smallint 
  LEFT JOIN tx as tx_in_tx ON 
    tx_in_tx.id = tx_in.tx_in_id 
    ${txInTxClause}
  JOIN tx AS tx_out_tx ON
    tx_out_tx.id = tx_out.tx_id
    ${txOutTxClause}
  ${joinClause}
  WHERE 
    tx_out_tx.hash = ${coinIdentifier.hash} AND
    tx_out.index = ${coinIdentifier.index} AND
    tx_in_tx.id IS NULL
    ${whereClause}`;

  return isTotalCount
    ? `SELECT COUNT(tx_out_tx.id) ${text}`
    : `
      WITH tx_query AS
        (SELECT
          tx_out_tx.id,
          tx_out_tx."size",
          tx_out_tx.fee,
          tx_out_tx.hash,
          tx_out_tx.valid_contract,
          tx_out_tx.block_id
        ${text}
        GROUP BY tx_out_tx.id
        ORDER BY tx_out_tx.id DESC
        LIMIT $1
        OFFSET $2)
      ${transactionBlockQuery}
      FROM tx_query AS tx
      JOIN block
          ON block.id = tx_block.id
`;
};

const createCurrencyQuery = (currencyId: CurrencyId, filters: SearchFilters, isTotalCount: boolean) => {
  const { policy, symbol } = currencyId;
  const { coinIdentifier, transactionHash, address, maxBlock, status, operator } = filters;
  const conditions = [];
  let whereClause = '';
  let joinClause = '';
  const joinTables = [];
  if (status) {
    conditions.push(`tx.valid_contract <= ${status}`);
  }
  if (coinIdentifier) {
    const { hash, index } = coinIdentifier;
    conditions.push(`tx.hash = ${hash}`);
    conditions.push(`tx_out.index = ${index}`);
  }
  if (!coinIdentifier && transactionHash) {
    conditions.push(`tx.hash = ${transactionHash}`);
  }
  if (address) {
    const isStake = isStakeAddress(address);
    isStake && joinTables.push('stake_address ON tx_out.stake_address_id = stake_address.id');
    conditions.push(`${isStake ? `stake_address.view = ${address}` : `tx_out.address = ${address}`}`);
  }
  const text = `
  FROM tx
  JOIN block
    ON block.id = tx.block_id ${maxBlock ? `AND block.block_no <= ${maxBlock}` : ''}
  JOIN tx_out
    ON tx_out.tx_id = tx.id
  JOIN ma_tx_out
    ON ma_tx_out.tx_out_id = tx_out.id
      AND ma_tx_out.name = DECODE('${symbol}', 'hex')
      AND ma_tx_out.policy = DECODE('${policy}', 'hex')`;

  const query = isTotalCount
    ? `SELECT COUNT(tx.id) ${text}`
    : `
    WITH tx_query AS(
      SELECT
        ${transactionQuery}
        ${text}
      GROUP BY tx.id
      ORDER BY tx.id DESC
      LIMIT $1
      OFFSET $2
    )
    ${transactionBlockQuery}
      FROM tx_query AS tx
      JOIN block 
        ON block.id = tx.block_id
    `;
  if (conditions.length > 0) {
    whereClause = `WHERE ${conditions.join(` ${OperatorType.AND} `)}`;
  }
  if (joinTables.length > 0) {
    joinClause = `JOIN ${joinTables.join(' JOIN ')}`;
  }
  return query.concat(` ${joinClause}`).concat(` ${whereClause}`);
};

const generateCoinSelect = (
  coinIdentifier?: CoinIdentifier,
  maxBlock?: number,
  status?: boolean,
  txOutAlreadyJoined = false
) =>
  coinIdentifier
    ? `
  ${
    !txOutAlreadyJoined
      ? `
  LEFT JOIN tx_out 
    ON tx_out.tx_id = tx.id`
      : ''
  }
  LEFT JOIN tx_in as utxo_tx_in
    ON utxo_tx_in.tx_out_id = tx_out.id 
      AND utxo_tx_in.tx_out_index::smallint = tx_out."index"::smallint
  LEFT JOIN tx as utxo_tx_in_tx
    ON utxo_tx_in_tx.id = utxo_tx_in.tx_in_id 
  ${maxBlock ? `AND utxo_tx_in_tx.block_id <= (select id from block where block_no = ${maxBlock})` : ''}
  ${status !== undefined || status !== null ? `AND utxo_tx_in_tx.valid_contract = ${status})` : ''}`
    : '';

const generateAddressSelect = (address?: string, txOutAlreadyJoined = false) =>
  address
    ? `
  ${
    !txOutAlreadyJoined
      ? `LEFT JOIN tx_out 
  ON tx_out.tx_id = tx.id`
      : ''
  } 
  ${isStakeAddress(address) ? 'LEFT JOIN stake_address ON tx_out.stake_address_id = stake_address.id' : ''}`
    : '';

const generateCoinWhere = (coinIdentifier: CoinIdentifier) => `
  (utxo_tx_in_tx.id is null and (tx_out."index" = ${coinIdentifier.index}
  and tx.hash = ${coinIdentifier.hash}))`;

// eslint-disable-next-line sonarjs/cognitive-complexity
const getQueryWithOrOperator = (filters: SearchFilters, isTotalCount = false) => {
  const { maxBlock, coinIdentifier, currencyIdentifier, status, transactionHash, address, type } = filters;
  const txOutAlreadyJoined = !!type && type === OperationType.OUTPUT;
  const whereConditions = [];
  let whereClause = '';
  if (coinIdentifier || transactionHash) {
    whereConditions.push(`${coinIdentifier ? generateCoinWhere(coinIdentifier) : `tx.hash = ${transactionHash}`}`);
  }
  if (currencyIdentifier) {
    whereConditions.push(`(ma_tx_out.name = DECODE('${currencyIdentifier.symbol}', 'hex') 
    AND ma_tx_out.policy = DECODE('${currencyIdentifier.policy}', 'hex'))`);
  }
  if (address) {
    whereConditions.push(
      `${isStakeAddress(address) ? `stake_address.view = ${address}` : `tx_out.address = ${address}`}`
    );
  }
  if (type) {
    whereConditions.push(queryOrTypeMapping[type]().where);
  }
  if (whereConditions.length > 0) {
    whereClause = whereConditions.join(` ${OperatorType.OR} `);
  }
  const text = `
  FROM tx
  JOIN block
    ON block.id = tx.block_id ${maxBlock ? ` AND block_no <= ${maxBlock}` : ''}
  ${type ? queryOrTypeMapping[type]().select : ''}
  ${generateCoinSelect(coinIdentifier, maxBlock, txOutAlreadyJoined)}
  ${generateAddressSelect(address, txOutAlreadyJoined)}
  ${currencyIdentifier && !txOutAlreadyJoined ? 'LEFT JOIN tx_out ON tx_out.tx_id = tx.id' : ''}
  ${currencyIdentifier ? 'ma_tx_out ON ma_tx_out.tx_out_id = tx_out.id )' : ''} 
  WHERE (
  ${status !== undefined || status !== null ? `tx.valid_contract = ${status} AND ` : ''}
  (${whereClause})
  )`;

  return isTotalCount
    ? `SELECT COUNT(tx.id) ${text}`
    : `
  WITH tx_query AS (
    SELECT 
		tx.id,
		tx."size",
		tx.fee,
		tx.hash,
		tx.valid_contract,
		tx.block_id
	${text}
  GROUP BY tx.id
  ORDER BY tx.id DESC
  LIMIT $1
  OFFSET $2
  )
  ${transactionQuery}
  FROM tx_query AS tx
  JOIN block 
    ON block.id = tx.block_id
  `;
};

const getQueryWithAndOperator = (filters: SearchFilters, isTotalCount = false) => {
  let query = defaultTransactionQuery();
  const { coinIdentifier, currencyIdentifier, type } = filters;
  if (type) {
    query = queryAndTypeMapping[type](filters);
  }
  if (currencyIdentifier) {
    query = createCurrencyQuery(currencyIdentifier, filters, isTotalCount);
    return query;
  }
  if (coinIdentifier) {
    query = createCoinQuery(coinIdentifier, filters, isTotalCount);
    return query;
  }
  return withConditions(query, filters, isTotalCount);
};

const createQueryWithAndOperator = (filters: SearchFilters) => ({
  data: getQueryWithAndOperator(filters),
  count: getQueryWithAndOperator(filters, true)
});

const createQueryWithOrOperator = (filters: SearchFilters) => ({
  data: getQueryWithOrOperator(filters),
  count: getQueryWithOrOperator(filters, true)
});

const SearchQueries = {
  generateComposedQuery: (filters: SearchFilters): { data: string; count: string } =>
    filters.operator === OperatorType.OR ? createQueryWithOrOperator(filters) : createQueryWithAndOperator(filters)
};

export default SearchQueries;
