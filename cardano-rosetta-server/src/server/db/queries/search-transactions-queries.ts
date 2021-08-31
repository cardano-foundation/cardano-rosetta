import { OperationType, CatalystLabels } from '../../utils/constants';
import { SearchFilters } from '../../models';

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
  return query.concat(whereClause);
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

const coinsQuery = `
    WITH coin AS (
      SELECT
        tx_out.value as value,
        tx_out_tx.hash as "txHash",
        tx_out.index as index,
        tx_out.id as tx_out_id
      FROM tx_out
      LEFT JOIN tx_in ON 
        tx_out.tx_id = tx_in.tx_out_id AND 
        tx_out.index::smallint = tx_in.tx_out_index::smallint 
      LEFT JOIN tx as tx_in_tx ON 
        tx_in_tx.id = tx_in.tx_in_id AND
        tx_in_tx.block_id <= (select id from block where hash = $2)
      JOIN tx AS tx_out_tx ON
        tx_out_tx.id = tx_out.tx_id AND
        tx_out_tx.block_id <= (select id from block where hash = $2)
      WHERE 
        tx_out_tx.hash = $1 AND
        tx_out.index = $2 AND
        tx_in_tx.id IS NULL
    )
`;

const currencyQuery = `SELECT tx_out_id 
   FROM ma_tx_out 
   WHERE 
     name = DECODE($1, 'hex') AND policy = DECODE($2, 'hex')`;

const findTransactionsWithInputs = (isTotalCount: boolean) => `
    ${getQuery(isTotalCount)}
    FROM tx
    JOIN tx_in
        ON tx_in.tx_in_id = tx.id
    JOIN tx_out as source_tx_out
        ON tx_in.tx_out_id = source_tx_out.tx_id
        AND tx_in.tx_out_index = source_tx_out.index
    JOIN tx as source_tx
        ON source_tx_out.tx_id = source_tx.id
    JOIN block
        ON block.id = tx.block_id
    ORDER BY block.id DESC 
`;

const findTransactionsWithOutputs = (isTotalCount: boolean) => `
    ${getQuery(isTotalCount)}
    FROM tx
    JOIN tx_out
        ON tx.id = tx_out.tx_id
`;

const findTransactionsWithPoolRegistrations = (isTotalCount: boolean) => `
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

const findTransactionsWithPoolRetirements = (isTotalCount: boolean) => `
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

const findTransactionsWithDelegations = (isTotalCount: boolean) => `
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

const findTransactionsWithKeyDeregistrations = (isTotalCount: boolean) => `
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

const findTransactionsWithKeyRegistrations = (isTotalCount: boolean) => `
    ${getQuery(isTotalCount)}
    FROM stake_registration sr
    JOIN tx on tx.id = sr.tx_id
    JOIN stake_address sa on sr.addr_id = sa.id
    JOIN block
        ON block.id = tx.block_id
    ORDER BY block.id DESC 
`;

const findTransactionsWithVoteRegistrations = (isTotalCount: boolean) => `
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

const findTransactionsWithWithdrawals = (isTotalCount: boolean) => `
    ${getQuery(isTotalCount)}
    FROM withdrawal w
    JOIN tx on w.tx_id = tx.id
    JOIN stake_address sa on w.addr_id = sa.id
    JOIN block
        ON block.id = tx.block_id
    ORDER BY block.id DESC 
`;

const queryTypeMapping: { [type: string]: (isTotalCount: boolean) => string } = {
  [OperationType.INPUT]: isTotalCount => findTransactionsWithInputs(isTotalCount),
  [OperationType.OUTPUT]: isTotalCount => findTransactionsWithOutputs(isTotalCount),
  [OperationType.POOL_REGISTRATION]: isTotalCount => findTransactionsWithPoolRegistrations(isTotalCount),
  [OperationType.POOL_REGISTRATION_WITH_CERT]: isTotalCount => findTransactionsWithPoolRegistrations(isTotalCount),
  [OperationType.POOL_RETIREMENT]: isTotalCount => findTransactionsWithPoolRetirements(isTotalCount),
  [OperationType.STAKE_DELEGATION]: isTotalCount => findTransactionsWithDelegations(isTotalCount),
  [OperationType.STAKE_KEY_DEREGISTRATION]: isTotalCount => findTransactionsWithKeyDeregistrations(isTotalCount),
  [OperationType.STAKE_KEY_REGISTRATION]: isTotalCount => findTransactionsWithKeyRegistrations(isTotalCount),
  [OperationType.VOTE_REGISTRATION]: isTotalCount => findTransactionsWithVoteRegistrations(isTotalCount),
  [OperationType.WITHDRAWAL]: isTotalCount => findTransactionsWithWithdrawals(isTotalCount)
};

const SearchQueries = {
  getQueriesByType: (type: string, conditions: SearchFilters): { data: string; count: string } => ({
    data: withLimitAndOffset(withFilters(queryTypeMapping[type](false), conditions)),
    count: queryTypeMapping[type](true)
  })
};

export default SearchQueries;
