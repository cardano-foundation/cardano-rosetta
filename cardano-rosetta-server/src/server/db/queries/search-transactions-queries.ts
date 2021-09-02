import { OperationType, CatalystLabels, OperatorType } from '../../utils/constants';
import { CoinIdentifier, SearchFilters, CurrencyId } from '../../models';
import { isStakeAddress } from '../../utils/cardano/addresses';

const withLimitAndOffset = (query: string) => `
    ${query} 
    LIMIT $1 
    OFFSET $2
`;

/* eslint-disable complexity */
/* eslint-disable max-statements*/
/* eslint-disable-next-line sonarjs/cognitive-complexity */
const withConditions = (query: string, filters: SearchFilters): string => {
  const { maxBlock, transactionHash, status, coinIdentifier, currencyIdentifier, address } = filters;
  const whereConditions = [];
  let whereSentence = '';
  let joinSentence = '';
  const joinTables = [];
  if (maxBlock) {
    whereConditions.push(`block.block_no <= ${maxBlock}`);
  }
  if (status !== undefined || status !== null) {
    whereConditions.push(`tx.valid_contract = ${status}`);
  }
  if (coinIdentifier) {
    const { hash, index } = coinIdentifier;
    if (!currencyIdentifier) {
      // eslint-disable-next-line sonarjs/no-duplicate-string
      joinTables.push('tx_out ON tx.id = tx_out.tx_id');
    }
    whereConditions.push(`tx.hash = ${hash}`);
    whereConditions.push(`tx_out.index = ${index}`);
  }
  if (transactionHash && !coinIdentifier) {
    whereConditions.push(`tx.hash = ${transactionHash}`);
  }
  if (currencyIdentifier) {
    const { policy, symbol } = currencyIdentifier;
    joinTables.push('tx_out ON tx.id = tx_out.tx_id');
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
  return `${query} ${joinSentence} ${whereSentence}`;
};

const transactionQuery = `
SELECT 
    tx.hash,
    tx.fee,
    tx.size,
    tx.valid_contract AS "validContract",
    tx.script_size AS "scriptSize",
    block.hash AS "blockHash",
    block.block_no as "blockNo"
`;

const totalCountQuery = 'SELECT COUNT(1) AS "totalCount"';

const DEFAULT_TRANSACTION_QUERY = `
  ${transactionQuery} 
  FROM tx
  JOIN block
    ON block.id = tx.block_id
`;

const getQuery = (isTotalCount: boolean): string => (isTotalCount ? totalCountQuery : transactionQuery);

const createCoinQuery = (coinIdentifier: CoinIdentifier, filters: SearchFilters) => {
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
    txOutTxClause = `AND (${txOutTxConditions.join(` ${operator} `)})`;
    txInTxClause = `AND (${txInTxConditions.join(` ${operator} `)})`;
  }
  if (conditions.length > 0) {
    whereClause = `AND ${conditions.join(' AND')}`;
  }
  if (joinTables.length > 0) {
    joinClause = `JOIN ${joinTables.join(' JOIN')}`;
  }

  return `
      SELECT
        tx_out_tx.id
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
        ${whereClause}
`;
};

const createCurrencyQuery = (currencyId: CurrencyId, filters: SearchFilters) => {
  const { policy, symbol } = currencyId;
  const { coinIdentifier, transactionHash, address, maxBlock, status } = filters;
  const conditions = [];
  let whereClause = '';
  let joinClause = '';
  const joinTables = [];
  if (maxBlock) {
    conditions.push(`block.block_no <= ${maxBlock}`);
  }
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
  const query = `
  ${transactionQuery}
  FROM tx
  JOIN tx_out
    ON tx_out.tx_id = tx.id
  JOIN ma_tx_out
    ON ma_tx_out.tx_out_id = tx_out.id
      AND ma_tx_out.name = DECODE('${symbol}', 'hex')
      AND ma_tx_out.policy = DECODE('${policy}', 'hex')
    `;
  if (conditions.length > 0) {
    whereClause = `WHERE ${conditions.join(' AND')}`;
  }
  if (joinTables.length > 0) {
    joinClause = `JOIN ${joinTables.join(' JOIN')}`;
  }
  return query.concat(` ${joinClause}`).concat(` ${whereClause}`);
};

const findTransactionsWithInputs = (isTotalCount: boolean, conditions?: SearchFilters) => {
  const query = `
    ${getQuery(isTotalCount)}
    FROM tx
    JOIN tx_in
        ON tx_in.tx_in_id = tx.id
    JOIN block
        ON block.id = tx.block_id ${conditions?.maxBlock ? `AND block_no <= ${conditions.maxBlock}` : ''}
`;

  if (!isTotalCount && conditions) {
    const queryWithConditions = withConditions(query, conditions);
    return `${queryWithConditions} ORDER BY block.id DESC`;
  }
  return query;
};

const findTransactionsWithOutputs = (isTotalCount: boolean, conditions?: SearchFilters) => {
  const query = `
  ${getQuery(isTotalCount)}
  FROM tx
  JOIN tx_out
      ON tx.id = tx_out.tx_id
`;
  if (!isTotalCount && conditions) {
    const queryWithConditions = withConditions(query, conditions);
    return `${queryWithConditions} ORDER BY block.id DESC`;
  }
  return query;
};

const findTransactionsWithPoolRegistrations = (isTotalCount: boolean, conditions?: SearchFilters) => {
  const query = `
  ${getQuery(isTotalCount)}
  FROM pool_update pu
  JOIN tx 
      ON pu.registered_tx_id = tx.id
  JOIN pool_hash ph
      ON ph.id = pu.hash_id
  JOIN block
      ON block.id = tx.block_id
  `;
  if (!isTotalCount && conditions) {
    const queryWithConditions = withConditions(query, conditions);
    return `${queryWithConditions} ORDER BY block.id DESC`;
  }
  return query;
};

const findTransactionsWithPoolRetirements = (isTotalCount: boolean, conditions?: SearchFilters) => {
  const query = `
  ${getQuery(isTotalCount)}
  FROM pool_retire pr 
  JOIN pool_hash ph 
      ON pr.hash_id = ph.id
  JOIN tx
      ON tx.id = pr.announced_tx_id
  JOIN block
      ON block.id = tx.block_id
  `;
  if (!isTotalCount && conditions) {
    const queryWithConditions = withConditions(query, conditions);
    return `${queryWithConditions} ORDER BY block.id DESC`;
  }
  return query;
};

const findTransactionsWithDelegations = (isTotalCount: boolean, conditions?: SearchFilters) => {
  const query = `
  ${getQuery(isTotalCount)}
  FROM delegation d
  JOIN stake_address sa
      ON d.addr_id = sa.id
  JOIN pool_hash ph
      ON d.pool_hash_id = ph.id
  JOIN tx
      ON d.tx_id = tx.id
  JOIN block
      ON block.id = tx.block_id
  `;
  if (!isTotalCount && conditions) {
    const queryWithConditions = withConditions(query, conditions);
    return `${queryWithConditions} ORDER BY block.id DESC`;
  }
  return query;
};

const findTransactionsWithKeyDeregistrations = (isTotalCount: boolean, conditions?: SearchFilters) => {
  const query = `
  ${getQuery(isTotalCount)}
  FROM stake_deregistration sd
  JOIN stake_address sa
      ON sd.addr_id = sa.id
  JOIN tx
      ON tx.id = sd.tx_id
  JOIN block
      ON block.id = tx.block_id
  `;
  if (!isTotalCount && conditions) {
    const queryWithConditions = withConditions(query, conditions);
    return `${queryWithConditions} ORDER BY block.id DESC`;
  }
  return query;
};

const findTransactionsWithKeyRegistrations = (isTotalCount: boolean, conditions?: SearchFilters) => {
  const query = `
  ${getQuery(isTotalCount)}
  FROM stake_registration sr
  JOIN tx on tx.id = sr.tx_id
  JOIN stake_address sa on sr.addr_id = sa.id
  JOIN block
      ON block.id = tx.block_id
  `;
  if (!isTotalCount && conditions) {
    const queryWithConditions = withConditions(query, conditions);
    return `${queryWithConditions} ORDER BY block.id DESC`;
  }
  return query;
};

const findTransactionsWithVoteRegistrations = (isTotalCount: boolean, conditions?: SearchFilters) => {
  const query = `
  WITH metadata_data_tx AS (
      SELECT
          tx_metadata.tx_id
      FROM tx_metadata
      WHERE key = ${CatalystLabels.DATA}
  )
  ${getQuery(isTotalCount)}
  FROM metadata_data_tx
  JOIN tx_metadata
      ON tx_metadata.tx_id = metadata_data_tx.tx_id
  JOIN tx
      ON tx.id = metadata_data_tx.tx_id
  JOIN block
      ON block.id = tx.block_id
  WHERE tx_metadata.key = ${CatalystLabels.SIG}
  `;
  if (!isTotalCount && conditions) {
    const queryWithConditions = withConditions(query, conditions);
    return `${queryWithConditions} ORDER BY block.id DESC`;
  }
  return query;
};

const findTransactionsWithWithdrawals = (isTotalCount: boolean, conditions?: SearchFilters) => {
  const query = `
  ${getQuery(isTotalCount)}
  FROM withdrawal w
  JOIN tx on w.tx_id = tx.id
  JOIN stake_address sa on w.addr_id = sa.id
  JOIN block
      ON block.id = tx.block_id
  `;
  if (!isTotalCount && conditions) {
    const queryWithConditions = withConditions(query, conditions);
    return `${queryWithConditions} ORDER BY block.id DESC`;
  }
  return query;
};

const queryTypeMapping: { [type: string]: (isTotalCount: boolean, conditions?: SearchFilters) => string } = {
  [OperationType.INPUT]: (isTotalCount, conditions) => findTransactionsWithInputs(isTotalCount, conditions),
  [OperationType.OUTPUT]: (isTotalCount, conditions) => findTransactionsWithOutputs(isTotalCount, conditions),
  [OperationType.POOL_REGISTRATION]: (isTotalCount, conditions) =>
    findTransactionsWithPoolRegistrations(isTotalCount, conditions),
  [OperationType.POOL_REGISTRATION_WITH_CERT]: (isTotalCount, conditions) =>
    findTransactionsWithPoolRegistrations(isTotalCount, conditions),
  [OperationType.POOL_RETIREMENT]: (isTotalCount, conditions) =>
    findTransactionsWithPoolRetirements(isTotalCount, conditions),
  [OperationType.STAKE_DELEGATION]: (isTotalCount, conditions) =>
    findTransactionsWithDelegations(isTotalCount, conditions),
  [OperationType.STAKE_KEY_DEREGISTRATION]: (isTotalCount, conditions) =>
    findTransactionsWithKeyDeregistrations(isTotalCount, conditions),
  [OperationType.STAKE_KEY_REGISTRATION]: (isTotalCount, conditions) =>
    findTransactionsWithKeyRegistrations(isTotalCount, conditions),
  [OperationType.VOTE_REGISTRATION]: (isTotalCount, conditions) =>
    findTransactionsWithVoteRegistrations(isTotalCount, conditions),
  [OperationType.WITHDRAWAL]: (isTotalCount, conditions) => findTransactionsWithWithdrawals(isTotalCount, conditions)
};

const getQueryWithAndOperator = (filters: SearchFilters) => {
  let query = DEFAULT_TRANSACTION_QUERY;
  const { coinIdentifier, currencyIdentifier, type, transactionHash, address, maxBlock, status } = filters;
  if (type) {
    query = queryTypeMapping[type](false, filters);
    return query;
  }
  if (currencyIdentifier) {
    query = createCurrencyQuery(currencyIdentifier, filters);
    return query;
  }
  if (coinIdentifier) {
    query = createCoinQuery(coinIdentifier, filters);
    return query;
  }
  return withConditions(query, filters);
};

const createComposedQuery = (conditions: SearchFilters) => {
  const query = getQueryWithAndOperator(conditions);
  return { data: withLimitAndOffset(transactionQuery.concat(` ${query}`)), count: totalCountQuery.concat(` ${query}`) };
};

const SearchQueries = {
  generateComposedQuery: (conditions: SearchFilters): { data: string; count: string } => createComposedQuery(conditions)
};

export default SearchQueries;
