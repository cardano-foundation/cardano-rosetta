import { OperationType, CatalystLabels, OperatorType } from '../../utils/constants';
import { CoinIdentifier, SearchFilters, CurrencyId } from '../../models';
import { isStakeAddress } from '../../utils/cardano/addresses';

const isNullOrUndefined = (object: any) => object === null || object === undefined;

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
  tx.block_id,
  tx.script_size
`;

const defaultTransactionQuery = (maxBlock?: number) => `
  FROM tx
  JOIN block
    ON block.id = tx.block_id ${maxBlock ? `AND block_no <= ${maxBlock}` : ''}
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
          AND metadata_sig.key = ${CatalystLabels.SIG}
      JOIN tx_metadata AS metadata_data
        ON metadata_data.tx_id = tx.id
          AND metadata_data.key = ${CatalystLabels.DATA}
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
      AND metadata_sig.key = ${CatalystLabels.SIG}
    LEFT JOIN tx_metadata AS metadata_data
      ON metadata_data.tx_id = tx.id
      AND metadata_data.key = ${CatalystLabels.DATA}`,
    where: '(metadata_sig.id IS NOT NULL AND metadata_data.id IS NOT NULL)'
  }),
  [OperationType.WITHDRAWAL]: () => ({
    select: 'LEFT JOIN withdrawal ON withdrawal.tx_id = tx.id',
    where: 'withdrawal.id IS NOT NULL'
  })
};

// Methods for requests with AND operator
/* eslint-disable complexity */
/* eslint-disable max-statements*/
/* eslint-disable-next-line sonarjs/cognitive-complexity */
const withFilters = (query: string, filters: SearchFilters, isTotalCount: boolean): string => {
  const { transactionHash, status, coinIdentifier, limit, offset, currencyIdentifier, address, type } = filters;
  const txOutAlreadyJoined = !!type && type === OperationType.OUTPUT;
  const txInAlreadyJoined = !!type && type === OperationType.INPUT;
  const whereConditions = [];
  let whereSentence = '';
  let leftJoinSentence = '';
  const leftJoinTables = [];
  if (!isNullOrUndefined(status)) {
    whereConditions.push(`tx.valid_contract = ${status}`);
  }
  if (coinIdentifier) {
    const { index } = coinIdentifier;
    // eslint-disable-next-line sonarjs/no-duplicate-string
    !txOutAlreadyJoined && leftJoinTables.push('tx_out ON tx.id = tx_out.tx_id');
    // eslint-disable-next-line sonarjs/no-duplicate-string
    !txInAlreadyJoined && leftJoinTables.push('tx_in ON tx_in.tx_in_id = tx.id');
    leftJoinTables.push(
      'tx_out AS tx_out_in ON tx_in.tx_out_id = tx_out_in.tx_id AND tx_out_in.index = tx_in.tx_out_index',
      'tx AS tx_out_in_tx ON tx_out_in.tx_id = tx_out_in_tx.id'
    );
    // eslint-disable-next-line sonarjs/no-duplicate-string
    whereConditions.push(
      `((tx.hash = $1 AND tx_out.index = ${index}) OR (tx_out_in_tx.hash = $1 AND tx_out_in.index = ${index}))`
    );
  }
  if (transactionHash && !coinIdentifier) {
    // eslint-disable-next-line sonarjs/no-duplicate-string
    whereConditions.push('tx.hash = $1');
  }
  if (currencyIdentifier) {
    const { policy, symbol } = currencyIdentifier;
    !coinIdentifier &&
      leftJoinTables.push(
        'tx_out ON tx.id = tx_out.tx_id',
        'tx_in ON tx_in.tx_in_id = tx.id',
        'tx_out AS tx_out_in ON (tx_in.tx_out_id = tx_out_in.tx_id AND tx_out_in.index = tx_in.tx_out_index)'
      );
    leftJoinTables.push(
      `ma_tx_out ON ma_tx_out.tx_out_id = tx_out.id 
      LEFT JOIN multi_asset AS asset ON asset.id = ma_tx_out.ident`,
      `
        ma_tx_out AS ma_tx_out_in ON ma_tx_out_in.tx_out_id = tx_out_in.id 
      LEFT JOIN multi_asset AS asset_in ON asset_in.id = ma_tx_out_in.ident`
    );
    whereConditions.push(
      `(
        (asset.name= DECODE('${symbol}', 'hex') AND asset.policy = DECODE('${policy}', 'hex')) OR
        (asset_in.name = DECODE('${symbol}', 'hex') AND asset_in.policy = DECODE('${policy}', 'hex'))
      )`
    );
  }
  if (address) {
    const isStake = isStakeAddress(address);
    !currencyIdentifier &&
      !coinIdentifier &&
      leftJoinTables.push(
        'tx_out ON tx.id = tx_out.tx_id',
        'tx_in ON tx_in.tx_in_id = tx.id',
        'tx_out AS tx_out_in ON tx_in.tx_out_id = tx_out_in.tx_id AND tx_in.tx_out_index = tx_out_in.index'
      );
    isStake &&
      leftJoinTables.push(
        'stake_address ON tx_out.stake_address_id = stake_address.id',
        'stake_address AS stake_address_in ON tx_out_in.stake_address_id = stake_address_in.id'
      );
    whereConditions.push(
      `${
        isStake
          ? `(stake_address.view = '${address}' OR stake_address_in.view = '${address}')`
          : `(tx_out.address = '${address}' OR tx_out_in.address = '${address}')`
      }`
    );
  }
  if (whereConditions.length > 0) {
    whereSentence = `WHERE ${whereConditions.join(` ${OperatorType.AND} `)}`;
  }
  if (leftJoinTables.length > 0) {
    leftJoinSentence = `LEFT JOIN ${leftJoinTables.join(' LEFT JOIN ')}`;
  }
  const text = `${query} ${leftJoinSentence} ${whereSentence}`;
  return isTotalCount
    ? `SELECT COUNT(DISTINCT tx.id) AS "totalCount" ${text}`
    : `
    WITH tx_query AS 
      (
        ${transactionQuery}
        ${text}
        GROUP BY tx.id
        ORDER BY tx.id DESC
        LIMIT ${limit}
        OFFSET ${offset}
      )
    ${transactionBlockQuery}
    FROM tx_query AS tx
    JOIN block 
      ON block.id = tx.block_id
    `;
};

const createCoinQuery = (coinIdentifier: CoinIdentifier, filters: SearchFilters, isTotalCount: boolean) => {
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
    conditions.push(
      `${
        isStake
          ? `stake_address.view = '${address}'`
          : `(tx_out.address = '${address}' OR tx_out_in.address = '${address}')`
      }`
    );
  }
  if (conditions.length > 0) {
    whereClause = `${OperatorType.AND} ${conditions.join(` ${OperatorType.AND} `)}`;
  }
  if (joinTables.length > 0) {
    joinClause = `JOIN ${joinTables.join(' JOIN ')}`;
  }
  const text = `
  FROM tx
  LEFT JOIN tx_out ON
    tx.id = tx_out.tx_id
  LEFT JOIN tx_in 
    ON tx_in.tx_in_id = tx.id
  LEFT JOIN tx_out AS tx_out_in ON 
    tx_out_in.tx_id = tx_in.tx_out_id AND
    tx_out_in.index = tx_in.tx_out_index
  LEFT JOIN tx AS tx_out_in_tx ON
    tx_out_in_tx.id = tx_out_in.tx_id
  ${joinClause}
  WHERE 
    ((tx.hash = $1 AND tx_out.index = ${coinIdentifier.index}) OR
    (tx_out_in_tx.hash = $1 AND tx_out_in.index = ${coinIdentifier.index}))
    ${whereClause}`;

  return isTotalCount
    ? `SELECT COUNT(tx.id) AS "totalCount" ${text}`
    : `
      WITH tx_query AS
        (SELECT
          tx.id,
          tx."size",
          tx.fee,
          tx.hash,
          tx.valid_contract,
          tx.script_size,
          tx.block_id
        ${text}
        GROUP BY tx.id
        ORDER BY tx.id DESC
        LIMIT ${limit}
        OFFSET ${offset})
      ${transactionBlockQuery}
      FROM tx_query AS tx
      JOIN block
          ON block.id = tx.block_id
`;
};

const createCurrencyQuery = (currencyId: CurrencyId, filters: SearchFilters, isTotalCount: boolean) => {
  const { policy, symbol } = currencyId;
  const { coinIdentifier, transactionHash, address, maxBlock, status, limit, offset } = filters;
  const conditions = [];
  let whereClause = '';
  let joinClause = '';
  const joinTables = [];
  if (!isNullOrUndefined(status)) {
    conditions.push(`tx.valid_contract = ${status}`);
  }
  if (coinIdentifier) {
    const { index } = coinIdentifier;
    conditions.push('tx.hash = $1');
    conditions.push(`tx_out.index = ${index}`);
  }
  if (!coinIdentifier && transactionHash) {
    conditions.push('tx.hash = $1');
  }
  if (address) {
    const isStake = isStakeAddress(address);
    isStake && joinTables.push('stake_address ON tx_out.stake_address_id = stake_address.id');
    conditions.push(`${isStake ? `stake_address.view = '${address}'` : `tx_out.address = '${address}'`}`);
  }
  const text = `
  FROM tx
  JOIN block
    ON block.id = tx.block_id ${maxBlock ? `AND block.block_no <= ${maxBlock}` : ''}
  JOIN tx_out
    ON tx_out.tx_id = tx.id
  JOIN ma_tx_out
    ON ma_tx_out.tx_out_id = tx_out.id
  JOIN multi_asset asset
    ON asset.id = ma_tx_out.ident
      AND asset.name = DECODE('${symbol}', 'hex')
      AND asset.policy = DECODE('${policy}', 'hex')`;

  const query = isTotalCount
    ? `SELECT COUNT(tx.id) AS "totalCount" ${text}`
    : `
    WITH tx_query AS(
        ${transactionQuery}
        ${text}
      GROUP BY tx.id
      ORDER BY tx.id DESC
      LIMIT ${limit}
      OFFSET ${offset}
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

const getQueryWithAndOperator = (filters: SearchFilters, isTotalCount = false) => {
  const { coinIdentifier, currencyIdentifier, type } = filters;
  if (type) {
    return withFilters(queryAndTypeMapping[type](filters), filters, isTotalCount);
  }
  if (currencyIdentifier) {
    return createCurrencyQuery(currencyIdentifier, filters, isTotalCount);
  }
  if (coinIdentifier) {
    return createCoinQuery(coinIdentifier, filters, isTotalCount);
  }
  const query = defaultTransactionQuery(filters?.maxBlock);
  return withFilters(query, filters, isTotalCount);
};

// Methods for requests with OR operator
const generateCoinSelect = (coinIdentifier?: CoinIdentifier, txOutAlreadyJoined = false, txInAlreadyJoined = false) =>
  coinIdentifier
    ? `
${
  !txOutAlreadyJoined
    ? `
LEFT JOIN tx_out 
  ON tx_out.tx_id = tx.id`
    : ''
}
${
  !txInAlreadyJoined
    ? `LEFT JOIN tx_in 
ON tx_in.tx_in_id = tx.id`
    : ''
}
LEFT JOIN tx_out AS tx_out_in
  ON tx_out_in.index = tx_in.tx_out_index 
  AND tx_out_in.tx_id = tx_in.tx_out_id
LEFT JOIN tx AS tx_out_in_tx
  ON tx_out_in_tx.id = tx_out_in.tx_id
  `
    : '';

const generateAddressSelect = (
  address?: string,
  coinIdentifier?: CoinIdentifier,
  txOutAlreadyJoined = false,
  txInAlreadyJoined = false
) =>
  address
    ? `
  ${
    !coinIdentifier
      ? `
      ${
        !txOutAlreadyJoined
          ? `LEFT JOIN tx_out 
      ON tx_out.tx_id = tx.id`
          : ''
      } 
      ${
        !txInAlreadyJoined
          ? `LEFT JOIN tx_in 
        ON tx_in.tx_in_id = tx.id`
          : ''
      }
      LEFT JOIN tx_out AS tx_out_in
        ON tx_out_in.tx_id = tx_in.tx_out_id
        AND tx_out_in.index = tx_in.tx_out_index 
  `
      : ''
  } 
  ${isStakeAddress(address) ? 'LEFT JOIN stake_address ON tx_out.stake_address_id = stake_address.id' : ''}`
    : '';

const generateCoinWhere = (coinIdentifier: CoinIdentifier) => `
    ((tx_out."index" = ${coinIdentifier.index} AND tx.hash = $1) 
    OR (tx_out_in."index" = ${coinIdentifier.index} AND tx_out_in_tx.hash = $1))
`;

// eslint-disable-next-line sonarjs/cognitive-complexity
const getQueryWithOrOperator = (filters: SearchFilters) => {
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
  const txOutAlreadyJoined = !!type && type === OperationType.OUTPUT;
  const txInAlreadyJoined = !!type && type === OperationType.INPUT;
  const statusExists = !isNullOrUndefined(status);
  const whereConditions = [];
  let whereClause = '';
  if (coinIdentifier || transactionHash) {
    whereConditions.push(`${coinIdentifier ? generateCoinWhere(coinIdentifier) : 'tx.hash =  $1'}`);
  }
  if (currencyIdentifier) {
    whereConditions.push(`(asset.name = DECODE('${currencyIdentifier.symbol}', 'hex') 
    AND asset.policy = DECODE('${currencyIdentifier.policy}', 'hex'))`);
  }
  if (address) {
    whereConditions.push(
      `${
        isStakeAddress(address)
          ? `stake_address.view = '${address}'`
          : `(tx_out.address = '${address}' OR tx_out_in.address = '${address}')`
      }`
    );
  }
  if (type) {
    whereConditions.push(queryOrTypeMapping[type]().where);
  }
  if (whereConditions.length > 0 || statusExists) {
    let statusCondition = '';
    if (!isNullOrUndefined(status))
      statusCondition =
        whereConditions.length > 0 ? `AND tx.valid_contract = ${status}` : `tx.valid_contract = ${status}`;
    whereClause = `WHERE ${
      whereConditions.length > 0 ? `(${whereConditions.join(` ${OperatorType.OR} `)})` : ''
    } ${statusCondition}`;
  }
  const text = `
  FROM tx
  JOIN block
    ON block.id = tx.block_id ${maxBlock ? ` AND block_no <= ${maxBlock}` : ''}
  ${type ? queryOrTypeMapping[type]().select : ''}
  ${generateCoinSelect(coinIdentifier, txOutAlreadyJoined, txInAlreadyJoined)}
  ${generateAddressSelect(address, coinIdentifier, txOutAlreadyJoined, txInAlreadyJoined)}
  ${currencyIdentifier && !txOutAlreadyJoined && !address ? 'LEFT JOIN tx_out ON tx_out.tx_id = tx.id' : ''}
  ${
    currencyIdentifier
      ? 'LEFT JOIN ma_tx_out ON ma_tx_out.tx_out_id = tx_out.id LEFT JOIN multi_asset asset ON asset.id = ma_tx_out.ident'
      : ''
  }
  ${whereClause}
  `;

  return `
  WITH tx_query AS (
		${transactionQuery}
	${text}
  GROUP BY tx.id
  ORDER BY tx.id DESC
  LIMIT ${limit}
  OFFSET ${offset}
  )
  ${transactionBlockQuery}
  FROM tx_query AS tx
  JOIN block 
    ON block.id = tx.block_id
  `;
};

const createComposedCountQuery = (filters: SearchFilters) => {
  const { type, operator, currencyIdentifier, coinIdentifier, maxBlock, offset, limit, status, address } = filters;
  const mustFilters = { operator, maxBlock, status, offset, limit };
  const countQueries = [];
  const defaultTxQuery = defaultTransactionQuery(maxBlock);
  if (type) {
    countQueries.push(withFilters(queryAndTypeMapping[type](filters), { ...mustFilters, type }, true));
  }
  if (currencyIdentifier) {
    countQueries.push(withFilters(defaultTxQuery, { ...mustFilters, currencyIdentifier }, true));
  }
  if (coinIdentifier) {
    countQueries.push(withFilters(defaultTxQuery, { ...mustFilters, coinIdentifier }, true));
  }
  if (address) {
    countQueries.push(withFilters(defaultTxQuery, { ...mustFilters, address }, true));
  }
  if (countQueries.length === 0) countQueries.push(withFilters(defaultTxQuery, filters, true));
  return `SELECT SUM("totalCount") AS "totalCount" FROM (${countQueries.join(' UNION ALL ')}) filters_count`;
};

const createQueryWithAndOperator = (filters: SearchFilters) => ({
  data: getQueryWithAndOperator(filters),
  count: getQueryWithAndOperator(filters, true)
});

const createQueryWithOrOperator = (filters: SearchFilters) => ({
  data: getQueryWithOrOperator(filters),
  count: createComposedCountQuery(filters)
});

const SearchQueries = {
  generateComposedQuery: (filters: SearchFilters): { data: string; count: string } =>
    filters.operator === OperatorType.OR ? createQueryWithOrOperator(filters) : createQueryWithAndOperator(filters)
};

export default SearchQueries;
