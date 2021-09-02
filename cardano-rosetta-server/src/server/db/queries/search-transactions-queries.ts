import { OperationType, CatalystLabels } from '../../utils/constants';
import { SearchFilters, TotalCount } from '../../models';

const withLimitAndOffset = (query: string) => `
    ${query} 
    LIMIT $1 
    OFFSET $2
`;

const withFilters = (query: string, filters: SearchFilters): string => {
  const { maxBlock, operator, status } = filters;
  let whereClause = '';
  const conditions = [];
  if (maxBlock) {
    conditions.push(`block.block_no <= ${maxBlock}`);
  }
  if (status !== undefined || status !== null) {
    conditions.push(`tx.valid_contract = ${status}`);
  }
  if (conditions.length > 0) {
    whereClause = `WHERE ${conditions.join(` ${operator} `)}`;
  }
  return query.concat(` ${whereClause}`);
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

const getQuery = (isTotalCount: boolean): string => (isTotalCount ? totalCountQuery : transactionQuery);

const createCoinQuery = (filters: SearchFilters) => {
  const { maxBlock, operator, status } = filters;
  let txOutTxClause = '';
  let txInTxClause = '';
  const txInTxConditions = [];
  const txOutTxConditions = [];
  if (maxBlock) {
    txInTxConditions.push(`tx_in_tx.block_id <= (select id from block where block_no = ${maxBlock})`);
    txOutTxConditions.push(`tx_out_tx.block_id <= (select id from block where block_no = ${maxBlock})`);
  }
  if (status !== undefined || status !== null) {
    txInTxConditions.push(`tx_in_tx.valid_contract = ${status})`);
    txOutTxConditions.push(`tx_out_tx.valid_contract  = ${status})`);
  }
  if (txInTxConditions.length > 0 && txOutTxConditions.length > 0) {
    txOutTxClause = `AND (${txOutTxConditions.join(` ${operator} `)})`;
    txInTxClause = `AND (${txInTxConditions.join(` ${operator} `)})`;
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
      WHERE 
        tx_out_tx.hash = $1 AND
        tx_out.index = $2 AND
        tx_in_tx.id IS NULL
`;
};

const currencyQuery = `SELECT tx_out_id 
   FROM ma_tx_out 
   WHERE 
     name = DECODE($1, 'hex') AND policy = DECODE($2, 'hex')`;

const findTransactionsWithInputs = (isTotalCount: boolean, conditions?: SearchFilters) => {
  const whereConditions = [];
  let whereSentence = '';
  const orderBySentence = 'ORDER BY block.id DESC';
  const query = `
    ${getQuery(isTotalCount)}
    FROM tx
    JOIN tx_in
        ON tx_in.tx_in_id = tx.id
    JOIN block
        ON block.id = tx.block_id ${conditions?.maxBlock ? `AND block_no <= ${conditions.maxBlock}` : ''}
`;
  if (!isTotalCount && conditions) {
    const { coinIdentifier } = conditions;
    if (coinIdentifier) {
      whereConditions.push(`tx.hash = ${coinIdentifier}`);
    }
  }
  if (whereConditions.length > 0) {
    whereSentence = whereConditions.join(` ${conditions?.operator ? conditions?.operator : 'AND'}`);
  }
  return `${query} ${whereSentence} ${orderBySentence}`;
};

const findTransactionsWithOutputs = (isTotalCount: boolean, conditions?: SearchFilters) => `
    ${getQuery(isTotalCount)}
    FROM tx
    JOIN tx_out
        ON tx.id = tx_out.tx_id
`;

const findTransactionsWithPoolRegistrations = (isTotalCount: boolean, conditions?: SearchFilters) => `
    ${getQuery(isTotalCount)}
    FROM pool_update pu
    JOIN tx 
        ON pu.registered_tx_id = tx.id
    JOIN pool_hash ph
        ON ph.id = pu.hash_id
    JOIN block
        ON block.id = tx.block_id
    ORDER BY block.id DESC 
`;

const findTransactionsWithPoolRetirements = (isTotalCount: boolean, conditions?: SearchFilters) => `
    ${getQuery(isTotalCount)}
    FROM pool_retire pr 
    JOIN pool_hash ph 
        ON pr.hash_id = ph.id
    JOIN tx
        ON tx.id = pr.announced_tx_id
    JOIN block
        ON block.id = tx.block_id
    ORDER BY block.id DESC 
`;

const findTransactionsWithDelegations = (isTotalCount: boolean, conditions?: SearchFilters) => `
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
    ORDER BY block.id DESC 
`;

const findTransactionsWithKeyDeregistrations = (isTotalCount: boolean, conditions?: SearchFilters) => `
    ${getQuery(isTotalCount)}
    FROM stake_deregistration sd
    JOIN stake_address sa
        ON sd.addr_id = sa.id
    JOIN tx
        ON tx.id = sd.tx_id
    JOIN block
        ON block.id = tx.block_id
    ORDER BY block.id DESC 
`;

const findTransactionsWithKeyRegistrations = (isTotalCount: boolean, conditions?: SearchFilters) => `
    ${getQuery(isTotalCount)}
    FROM stake_registration sr
    JOIN tx on tx.id = sr.tx_id
    JOIN stake_address sa on sr.addr_id = sa.id
    JOIN block
        ON block.id = tx.block_id
    ORDER BY block.id DESC 
`;

const findTransactionsWithVoteRegistrations = (isTotalCount: boolean, conditions?: SearchFilters) => `
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
    ORDER BY block.id DESC 
`;

const findTransactionsWithWithdrawals = (isTotalCount: boolean, conditions?: SearchFilters) => `
    ${getQuery(isTotalCount)}
    FROM withdrawal w
    JOIN tx on w.tx_id = tx.id
    JOIN stake_address sa on w.addr_id = sa.id
    JOIN block
        ON block.id = tx.block_id
    ORDER BY block.id DESC 
`;

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

const createComposedQuery = (conditions: SearchFilters) => {
  const { type, coinIdentifier, operator } = conditions;
  let typeQuery;
  let coinQuery;
  const selects = [];
  if (type) {
    typeQuery = queryTypeMapping[type](false, conditions);
    selects.push({ query: typeQuery, name: 'type' });
  }
  if (coinIdentifier) {
    coinQuery = createCoinQuery(conditions);
    selects.push({ query: coinQuery, name: 'coin' });
  }
  if (selects.length > 0) {
    const joinOperator = operator === 'and' ? 'INTERSECT' : 'UNION';
    const subQueries = `WITH ${selects.map(select => `${select.name} AS (${select.query})`).join(', ')}`;
    const query = `${subQueries} ${selects
      .map(select => `${transactionQuery} FROM ${select.name}`)
      .join(`${joinOperator}`)}`;
    return { data: withLimitAndOffset(query), count: `${totalCountQuery} FROM (${query})` };
  }
  const text = ` 
  FROM tx
  JOIN block
    ON block.id = tx.block_id
  `;
  return { data: withLimitAndOffset(transactionQuery.concat(` ${text}`)), count: totalCountQuery.concat(` ${text}`) };
};

const SearchQueries = {
  generateComposedQuery: (conditions: SearchFilters): { data: string; count: string } => createComposedQuery(conditions)
};

export default SearchQueries;
