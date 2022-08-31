/* eslint-disable unicorn/no-nested-ternary */
import { OperationType, CatalystLabels, OperatorType } from '../../utils/constants';
import { CoinIdentifier, SearchFilters, CurrencyId } from '../../models';
import { isStakeAddress } from '../../utils/cardano/addresses';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

const poolRegistrationJoin = 'JOIN pool_update pu ON pu.registered_tx_id = tx.id';

const poolRetirementJoin = 'JOIN pool_retire pr ON tx.id = pr.announced_tx_id';

const delegationJoin = 'JOIN delegation d ON d.tx_id = tx.id';

const keyDeregistrationJoin = 'JOIN stake_deregistration sd ON tx.id = sd.tx_id';

const keyRegistrationJoin = 'JOIN stake_registration sr ON tx.id = sr.tx_id';

const voteRegistrationJoin = `
      JOIN tx_metadata AS metadata_sig
        ON metadata_sig.tx_id = tx.id 
          AND metadata_sig.key = ${CatalystLabels.SIG}
      JOIN tx_metadata AS metadata_data
        ON metadata_data.tx_id = tx.id
          AND metadata_data.key = ${CatalystLabels.DATA}
      `;

const withdrawalJoin = 'JOIN withdrawal w ON w.tx_id = tx.id';

const queryAndTypeMapping: { [type: string]: string } = {
  [OperationType.POOL_REGISTRATION]: poolRegistrationJoin,
  [OperationType.POOL_REGISTRATION_WITH_CERT]: poolRegistrationJoin,
  [OperationType.POOL_RETIREMENT]: poolRetirementJoin,
  [OperationType.STAKE_DELEGATION]: delegationJoin,
  [OperationType.STAKE_KEY_DEREGISTRATION]: keyDeregistrationJoin,
  [OperationType.STAKE_KEY_REGISTRATION]: keyRegistrationJoin,
  [OperationType.VOTE_REGISTRATION]: voteRegistrationJoin,
  [OperationType.WITHDRAWAL]: withdrawalJoin
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

const typesToIgnore = [OperationType.INPUT, OperationType.OUTPUT];

const generateInputCoinWhereCondition = (coinIdentifier: CoinIdentifier) =>
  `(tx_out."index" = ${coinIdentifier.index} AND (tx.hash = $1 OR tx_out_tx.hash = $1))`;
const generateOutputCoinWhereCondition = (coinIdentifier: CoinIdentifier) =>
  `(tx_out."index" = ${coinIdentifier?.index} AND tx.hash = $1)`;

// Methods for requests with AND operator
/* eslint-disable complexity */
/* eslint-disable max-statements*/
/* eslint-disable-next-line sonarjs/cognitive-complexity */
const withFilters = (filters: SearchFilters, isTotalCount: boolean): string => {
  const {
    transactionHash,
    status,
    coinIdentifier,
    limit,
    offset,
    currencyIdentifier,
    address,
    maxBlock,
    type
  } = filters;
  const whereConditions = [];
  let whereSentence = '';
  let joinSentence = '';
  const joinTables = [];
  if (!isNullOrUndefined(status)) {
    whereConditions.push(`tx.valid_contract = ${status}`);
  }
  if (transactionHash && !coinIdentifier) {
    // eslint-disable-next-line sonarjs/no-duplicate-string
    whereConditions.push('tx.hash = $1');
  }
  if (currencyIdentifier) {
    const { policy, symbol } = currencyIdentifier;
    joinTables.push(
      `ma_tx_out ON ma_tx_out.tx_out_id = tx_out.id 
      JOIN multi_asset AS asset ON asset.id = ma_tx_out.ident`
    );
    whereConditions.push(
      `
        (asset.name= DECODE('${symbol}', 'hex') AND asset.policy = DECODE('${policy}', 'hex'))
      `
    );
  }
  if (address) {
    const isStake = isStakeAddress(address);
    isStake && joinTables.push('stake_address ON tx_out.stake_address_id = stake_address.id');
    whereConditions.push(`${isStake ? `stake_address.view = '${address}'` : `tx_out.address = '${address}'`}`);
  }
  if (whereConditions.length > 0) {
    whereSentence = `WHERE ${whereConditions.join(` ${OperatorType.AND} `)}`;
  }
  if (joinTables.length > 0) {
    joinSentence = `JOIN ${joinTables.join(' JOIN ')}`;
  }
  const typeJoin = !!type && !typesToIgnore.includes(type as OperationType) ? queryAndTypeMapping[type] : '';
  const outputsQuery = `
  SELECT
      tx.id,
      tx."size",
      tx.fee,
      tx.hash,
      tx.valid_contract,
      tx.block_id,
      tx.script_size
  FROM tx_out
  JOIN tx ON tx_out.tx_id = tx.id
  ${typeJoin}
  ${joinSentence}
  ${whereSentence}
  ${
    coinIdentifier
      ? whereConditions.length > 0
        ? ` AND ${generateOutputCoinWhereCondition(coinIdentifier)}`
        : ` WHERE ${generateOutputCoinWhereCondition(coinIdentifier)}`
      : ''
  }
  `;

  const text = `
    FROM
    (
      SELECT
          tx.id,
          tx."size",
          tx.fee,
          tx.hash,
          tx.valid_contract,
          tx.block_id,
          tx.script_size
      FROM tx_out
      JOIN tx_in
        ON tx_out.tx_id = tx_in.tx_out_id
        AND tx_in.tx_out_index = tx_out.index
      JOIN tx ON tx.id = tx_in.tx_in_id
      ${
        coinIdentifier // eslint-disable-next-line sonarjs/no-duplicate-string
          ? 'JOIN tx AS tx_out_tx ON tx_out_tx.id = tx_in.tx_out_id'
          : ''
      }
      ${typeJoin}
      ${joinSentence}
      ${whereSentence}
      ${
        coinIdentifier
          ? whereConditions.length > 0
            ? ` AND ${generateInputCoinWhereCondition(coinIdentifier)}`
            : ` WHERE ${generateInputCoinWhereCondition(coinIdentifier)}`
          : ''
      }
      ${whereConditions.length === 0 && type === OperationType.INPUT ? '' : `UNION ${outputsQuery}`}
    ) as txs
    JOIN block ON block.id = txs.block_id ${maxBlock ? ` AND block.block_no <= ${maxBlock}` : ''}
  `;
  return isTotalCount
    ? `SELECT COUNT(DISTINCT txs.id) AS "totalCount" ${text}`
    : `
  WITH tx_query AS (
    select
      DISTINCT txs.id,
        txs."size",
        txs.fee,
        txs.hash,
        txs.valid_contract,
        txs.block_id,
        txs.script_size,
        block.hash AS block_hash,
        block.block_no AS block_no
      ${text}
      ORDER BY id DESC
      LIMIT ${limit}
      OFFSET ${offset}
    )
    SELECT 
      hash,
      fee,
      size,
      valid_contract AS "validContract",
      script_size AS "scriptSize",
      block_hash AS "blockHash",
      block_no as "blockNo"
    FROM tx_query 
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
    conditions.push(`${isStake ? `stake_address.view = '${address}'` : `tx_out.address = '${address}'`}`);
  }
  if (conditions.length > 0) {
    whereClause = `${OperatorType.AND} ${conditions.join(` ${OperatorType.AND} `)}`;
  }
  if (joinTables.length > 0) {
    joinClause = `JOIN ${joinTables.join(' JOIN ')}`;
  }
  const text = `
      FROM
      (
        SELECT
            tx.id,
            tx."size",
            tx.fee,
            tx.hash,
            tx.valid_contract,
            tx.block_id,
            tx.script_size
        FROM tx_out
        JOIN tx_in
          ON tx_out.tx_id = tx_in.tx_out_id
          AND tx_in.tx_out_index = tx_out.index
        JOIN tx ON tx.id = tx_in.tx_in_id
        JOIN tx AS tx_out_tx 
          ON tx_out_tx.id = tx_in.tx_out_id
        ${joinClause}
        WHERE 
          ${generateInputCoinWhereCondition(coinIdentifier)}
          ${whereClause}
        UNION
        SELECT
            tx.id,
            tx."size",
            tx.fee,
            tx.hash,
            tx.valid_contract,
            tx.block_id,
            tx.script_size
        FROM tx_out
        JOIN tx ON tx_out.tx_id = tx.id
        ${joinClause}
        WHERE 
          (tx.hash = $1 AND tx_out.index = ${coinIdentifier.index})
          ${whereClause}
      ) as txs
      JOIN block ON block.id = txs.block_id ${maxBlock ? ` AND block.block_no <= ${maxBlock}` : ''}
    `;

  return isTotalCount
    ? `SELECT COUNT(DISTINCT txs.id) AS "totalCount" ${text}`
    : `
    WITH tx_query AS (
      select
        DISTINCT txs.id,
          txs."size",
          txs.fee,
          txs.hash,
          txs.valid_contract,
          txs.block_id,
          txs.script_size,
          block.hash AS block_hash,
          block.block_no AS block_no
        ${text}
        ORDER BY id DESC
        LIMIT ${limit}
        OFFSET ${offset}
      )
      SELECT 
        hash,
        fee,
        size,
        valid_contract AS "validContract",
        script_size AS "scriptSize",
        block_hash AS "blockHash",
        block_no as "blockNo"
      FROM tx_query 
`;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
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
  if (!coinIdentifier && transactionHash) {
    conditions.push('tx.hash = $1');
  }
  if (address) {
    const isStake = isStakeAddress(address);
    isStake && joinTables.push('stake_address ON tx_out.stake_address_id = stake_address.id');
    conditions.push(`${isStake ? `stake_address.view = '${address}'` : `tx_out.address = '${address}'`}`);
  }
  if (conditions.length > 0) {
    whereClause = `WHERE ${conditions.join(` ${OperatorType.AND} `)}`;
  }
  if (joinTables.length > 0) {
    joinClause = `JOIN ${joinTables.join(' JOIN ')}`;
  }
  const text = `
    FROM
    (
      SELECT
          tx.id,
          tx."size",
          tx.fee,
          tx.hash,
          tx.valid_contract,
          tx.block_id,
          tx.script_size
      FROM tx_out
      JOIN tx_in
        ON tx_out.tx_id = tx_in.tx_out_id
        AND tx_in.tx_out_index = tx_out.index
      JOIN tx ON tx.id = tx_in.tx_in_id
      JOIN ma_tx_out
       ON ma_tx_out.tx_out_id = tx_out.id
      ${coinIdentifier ? 'JOIN tx AS tx_out_tx ON tx_out_tx.id = tx_in.tx_out_id' : ''}
      JOIN multi_asset asset
        ON asset.id = ma_tx_out.ident
        AND asset.name = DECODE('${symbol}', 'hex')
        AND asset.policy = DECODE('${policy}', 'hex')
      ${joinClause}
      ${whereClause}
      ${
        coinIdentifier
          ? conditions.length > 0
            ? ` AND ${generateInputCoinWhereCondition(coinIdentifier)}`
            : ` WHERE ${generateInputCoinWhereCondition(coinIdentifier)}`
          : ''
      }
      UNION
      SELECT
          tx.id,
          tx."size",
          tx.fee,
          tx.hash,
          tx.valid_contract,
          tx.block_id,
          tx.script_size
      FROM tx_out
      JOIN tx ON tx_out.tx_id = tx.id
      JOIN ma_tx_out
        ON ma_tx_out.tx_out_id = tx_out.id
      JOIN multi_asset asset
        ON asset.id = ma_tx_out.ident
        AND asset.name = DECODE('${symbol}', 'hex')
        AND asset.policy = DECODE('${policy}', 'hex')
      ${joinClause}
      ${whereClause}
      ${
        coinIdentifier
          ? conditions.length > 0
            ? ` AND ${generateOutputCoinWhereCondition(coinIdentifier)}`
            : ` WHERE ${generateOutputCoinWhereCondition(coinIdentifier)}`
          : ''
      }
    ) as txs
    JOIN block ON block.id = txs.block_id ${maxBlock ? ` AND block.block_no <= ${maxBlock}` : ''}
  `;
  return isTotalCount
    ? `SELECT COUNT(DISTINCT txs.id) AS "totalCount" ${text}`
    : `
    WITH tx_query AS (
      select
        DISTINCT txs.id,
          txs."size",
          txs.fee,
          txs.hash,
          txs.valid_contract,
          txs.block_id,
          txs.script_size,
          block.hash AS block_hash,
          block.block_no AS block_no
        ${text}
        ORDER BY id DESC
        LIMIT ${limit}
        OFFSET ${offset}
      )
      SELECT 
        hash,
        fee,
        size,
        valid_contract AS "validContract",
        script_size AS "scriptSize",
        block_hash AS "blockHash",
        block_no as "blockNo"
      FROM tx_query 
`;
};

const getQueryWithAndOperator = (filters: SearchFilters, isTotalCount = false) => {
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
  `
      : ''
  } 
  ${isStakeAddress(address) ? 'LEFT JOIN stake_address ON tx_out.stake_address_id = stake_address.id' : ''}`
    : '';

const generateCoinWhere = (coinIdentifier: CoinIdentifier) => `
    (tx_out."index" = ${coinIdentifier.index} AND tx.hash = $1)
`;

const generateJoinSentences = (
  txInAlreadyJoined = false,
  { type, address, currencyIdentifier }: { type?: string; address?: string; currencyIdentifier?: CurrencyId },
  whereClause: string
) => `  
${
  type
    ? `${
        (type === OperationType.INPUT && txInAlreadyJoined) || type === OperationType.OUTPUT
          ? ''
          : queryOrTypeMapping[type]().select
      }`
    : ''
}
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

const generateOutputsInputsSubQuery = ({
  maxBlock,
  coinIdentifier,
  currencyIdentifier,
  status,
  transactionHash,
  address,
  type,
  offset,
  limit
}: // eslint-disable-next-line sonarjs/cognitive-complexity
SearchFilters) => {
  const statusExists = !isNullOrUndefined(status);
  const whereConditions = [];
  let whereClause = '';
  if (!coinIdentifier && transactionHash) {
    whereConditions.push('tx.hash =  $1');
  }
  if (currencyIdentifier) {
    whereConditions.push(`(asset.name = DECODE('${currencyIdentifier.symbol}', 'hex') 
    AND asset.policy = DECODE('${currencyIdentifier.policy}', 'hex'))`);
  }
  if (address) {
    whereConditions.push(
      `${isStakeAddress(address) ? `stake_address.view = '${address}'` : `tx_out.address = '${address}'`}`
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

  const subQuery = `
  WITH tx_query AS (   
	  select 
	    DISTINCT txs.id,
	    txs."size",
	    txs.fee,
	    txs.hash,
	    txs.valid_contract,
	    txs.block_id,
	    txs.script_size,
      block.hash AS block_hash,
      block.block_no AS block_no
    FROM
    (
      SELECT
          tx.id,
          tx."size",
          tx.fee,
          tx.hash,
          tx.valid_contract,
          tx.block_id,
          tx.script_size
      FROM tx_out
      JOIN tx_in 
        ON tx_out.tx_id = tx_in.tx_out_id
        AND tx_in.tx_out_index = tx_out.index
      JOIN tx ON tx.id = tx_in.tx_in_id
      ${coinIdentifier ? 'JOIN tx AS tx_out_tx ON tx_out_tx.id = tx_in.tx_out_id' : ''}
      ${generateJoinSentences(true, { type, address, currencyIdentifier }, whereClause)}
      ${
        coinIdentifier
          ? whereConditions.length > 0
            ? ` OR ${generateInputCoinWhereCondition(coinIdentifier)}`
            : ` WHERE ${generateInputCoinWhereCondition(coinIdentifier)}`
          : ''
      }
      UNION
      SELECT
          tx.id,
          tx."size",
          tx.fee,
          tx.hash,
          tx.valid_contract,
          tx.block_id,
          tx.script_size
      FROM tx_out
      JOIN tx ON tx_out.tx_id = tx.id
      ${generateJoinSentences(false, { type, address, currencyIdentifier }, whereClause)}
      ${
        coinIdentifier
          ? whereConditions.length > 0
            ? ` OR ${generateOutputCoinWhereCondition(coinIdentifier)}`
            : ` WHERE ${generateOutputCoinWhereCondition(coinIdentifier)}`
          : ''
      }
    ) as txs
    JOIN block ON block.id = txs.block_id ${maxBlock ? ` AND block.block_no <= ${maxBlock}` : ''}
    ORDER BY id DESC
    LIMIT ${limit}
    OFFSET ${offset}
  )   
  `;

  return `
    ${subQuery}
    SELECT 
      hash,
      fee,
      size,
      valid_contract AS "validContract",
      script_size AS "scriptSize",
      block_hash AS "blockHash",
      block_no as "blockNo"
    FROM tx_query
  `;
};

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
  if (coinIdentifier || currencyIdentifier || address) return generateOutputsInputsSubQuery(filters);
  if (transactionHash) {
    whereConditions.push(`${coinIdentifier ? generateCoinWhere(coinIdentifier) : 'tx.hash =  $1'}`);
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
  ${generateAddressSelect(address, coinIdentifier, txOutAlreadyJoined, txInAlreadyJoined)}
  ${currencyIdentifier && !txOutAlreadyJoined && !address ? 'LEFT JOIN tx_out ON tx_out.tx_id = tx.id' : ''}
  ${
    currencyIdentifier
      ? `LEFT JOIN ma_tx_out ON ma_tx_out.tx_out_id = tx_out.id 
         LEFT JOIN multi_asset asset ON asset.id = ma_tx_out.ident`
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
