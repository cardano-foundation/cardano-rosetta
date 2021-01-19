const findBlock = (blockNumber?: number, blockHash?: string): string => `
SELECT 
  b.hash as hash,
  b.block_no as number,
  (b.time at time zone 'utc') as "createdAt",
  CASE
    WHEN b2.block_no IS NOT NULL THEN b2.block_no
    WHEN b3.block_no IS NOT NULL THEN b3.block_no
    ELSE 0
  END AS "previousBlockNumber",
  CASE
    WHEN b2.block_no IS NOT NULL THEN b2.hash
    WHEN b3.block_no IS NOT NULL THEN b3.hash
    WHEN b.block_no = 1 THEN b3.hash -- block 1
    ELSE b.hash -- genesis
  END AS "previousBlockHash",
  b.tx_count as "transactionsCount",
  s.description as "createdBy",
  b.size as size,
  b.epoch_no as "epochNo",
  b.slot_no as "slotNo"
FROM 
  block b 
  LEFT JOIN slot_leader s ON b.slot_leader_id = s.id
  LEFT JOIN block b2 ON b.previous_id = b2.id
  LEFT JOIN block b3 ON b2.previous_id = b3.id
WHERE
  ${blockNumber ? 'b.block_no = $1' : '$1 = $1'} AND
  ${blockHash ? 'b.hash = $2' : '$2 = $2'}
LIMIT 1
`;

export interface FindTransaction {
  hash: Buffer;
  blockHash: Buffer;
  fee: string;
  size: number;
}

// AND (block.block_no = $2 OR (block.block_no is null AND $2 = 0))
// This condition is made because genesis block has block_no = null
// Also, genesis number is 0, thats why $2 = 0.
const findTransactionsByBlock = (blockNumber?: number, blockHash?: string): string => `
SELECT 
  tx.*,
  block.hash as blockHash
FROM tx
JOIN block ON block.id = tx.block_id
WHERE
  ${blockNumber ? '(block.block_no = $1 OR (block.block_no is null AND $1 = 0))' : '$1 = $1'} AND
  ${blockHash ? 'block.hash = $2' : '$2 = $2'}
`;

export interface FindTransactionFieldResult {
  txHash: Buffer;
}

export interface FindTransactionInOutResult extends FindTransactionFieldResult {
  id: number;
  address: string;
  value: string;
  policy?: Buffer;
  name?: Buffer;
  quantity?: string;
}

// AND (block.block_no = $2 OR (block.block_no is null AND $2 = 0))
// This condition is made because genesis block has block_no = null
// Also, genesis number is 0, thats why $2 = 0.
const findTransactionByHashAndBlock = `
SELECT 
  tx.*,
  block.hash as blockHash
FROM tx
JOIN block ON block.id = tx.block_id
WHERE
  tx.hash = $1
AND (block.block_no = $2 OR (block.block_no is null AND $2 = 0))
AND block.hash = $3
`;

export interface FindTransactionsInputs extends FindTransactionInOutResult {
  sourceTxHash: Buffer;
  sourceTxIndex: number;
}

const findTransactionsInputs = `SELECT
  tx_in.id as id,
  source_tx_out.address as address,
  source_tx_out.value as value,
  tx.hash as "txHash",
  source_tx.hash as "sourceTxHash",
  tx_in.tx_out_index as "sourceTxIndex",
  source_ma_tx_out.policy as policy,
  source_ma_tx_out.name as name,
  source_ma_tx_out.quantity as quantity
FROM
  tx
JOIN tx_in
  ON tx_in.tx_in_id = tx.id
JOIN tx_out as source_tx_out
  ON tx_in.tx_out_id = source_tx_out.tx_id
  AND tx_in.tx_out_index = source_tx_out.index
JOIN tx as source_tx
  ON source_tx_out.tx_id = source_tx.id
LEFT JOIN ma_tx_out as source_ma_tx_out
  ON source_ma_tx_out.tx_out_id = source_tx_out.id
WHERE
  tx.hash = ANY ($1)`;

const findGenesisBlock = `
SELECT
  hash,
  block_no as index
FROM
  block
WHERE
  previous_id IS NULL
LIMIT 1`;

export interface FindTransactionsOutputs extends FindTransactionInOutResult {
  index: number;
}

const findTransactionsOutputs = `
SELECT
  tx_out.id as id,
  address,
  value,
  tx.hash as "txHash",
  index,
  ma_tx_out.policy as policy,
  ma_tx_out.name as name,
  ma_tx_out.quantity as quantity
FROM tx
JOIN tx_out
  ON tx.id = tx_out.tx_id
LEFT JOIN ma_tx_out
  ON ma_tx_out.tx_out_id = tx_out.id
WHERE
  tx.hash = ANY ($1)
`;

export interface FindTransactionWithdrawals extends FindTransactionFieldResult {
  address: string;
  amount: string;
}

export interface FindTransactionRegistrations extends FindTransactionFieldResult {
  address: string;
  amount: string;
}
export interface FindTransactionDeregistrations extends FindTransactionFieldResult {
  address: string;
  amount: string;
}
export interface FindTransactionDelegations extends FindTransactionFieldResult {
  address: string;
  poolHash: Buffer;
}

const findTransactionWithdrawals = `
SELECT 
  amount,
  sa.view as "address",
  tx.hash as "txHash"
FROM withdrawal w
INNER JOIN tx on w.tx_id = tx.id
INNER JOIN stake_address sa on w.addr_id = sa.id
WHERE
  tx.hash = ANY ($1)
`;

const findTransactionRegistrations = `
SELECT 
  tx.deposit as "amount",
  sa.view as "address",
  tx.hash as "txHash"
FROM stake_registration sr
INNER JOIN tx on tx.id = sr.tx_id
INNER JOIN stake_address sa on sr.addr_id = sa.id
WHERE
  tx.hash = ANY ($1)
`;

const findTransactionDeregistrations = `
SELECT 
  sa.view as "address",
  tx.deposit as "amount",
  tx.hash as "txHash"
FROM stake_deregistration sd
INNER JOIN stake_address sa
  ON sd.addr_id = sa.id
INNER JOIN tx
  ON tx.id = sd.tx_id
WHERE tx.hash = ANY($1)
`;

const findTransactionDelegations = `
SELECT 
  sa.view as "address",
  ph.hash_raw as "poolHash",
  tx.hash as "txHash"
FROM delegation d
INNER JOIN stake_address sa
  ON d.addr_id = sa.id
INNER JOIN pool_hash ph
  ON d.pool_hash_id = ph.id
INNER JOIN tx
  ON d.tx_id = tx.id
WHERE tx.hash = ANY($1)
`;

const findLatestBlockNumber = `
SELECT
  block_no as "blockHeight"
FROM block
WHERE block_no IS NOT NULL
ORDER BY block_no DESC
LIMIT 1
`;

export interface FindBalance {
  balance: string;
}

export interface FindUtxo {
  value: string;
  txHash: Buffer;
  index: number;
  policy: Buffer;
  name: Buffer;
  quantity: string;
}

const findUtxoByAddressAndBlock = `
  SELECT
    tx_out.value as value,
    tx_out_tx.hash as "txHash",
    tx_out.index as index,
    ma_tx_out.name as "name",
    ma_tx_out.policy as "policy",
    ma_tx_out.quantity
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
  LEFT JOIN ma_tx_out ON
  ma_tx_out.tx_out_id = tx_out.id	
  WHERE 
	  tx_out.address = $1 AND
    tx_in_tx.id IS NULL
  ORDER BY
    tx_out_tx.hash, tx_out.index, ma_tx_out.policy, ma_tx_out.name
`;

const findBalanceByAddressAndBlock = `SELECT (SELECT COALESCE(SUM(r.amount),0) 
  FROM reward r
  JOIN stake_address ON 
    stake_address.id = r.addr_id
  JOIN block ON
    block.id = r.block_id
  WHERE stake_address.view = $1
  AND block.id <= (SELECT id FROM block WHERE hash = $2))- 
  (SELECT COALESCE(SUM(w.amount),0) 
  FROM withdrawal w
  JOIN tx ON tx.id = w.tx_id AND 
    tx.block_id <= (SELECT id FROM block WHERE hash = $2)
  JOIN stake_address ON stake_address.id = w.addr_id
  WHERE stake_address.view = $1) 
  AS balance
`;

const Queries = {
  findBlock,
  findTransactionsByBlock,
  findTransactionByHashAndBlock,
  findTransactionsInputs,
  findTransactionsOutputs,
  findTransactionWithdrawals,
  findTransactionRegistrations,
  findTransactionDeregistrations,
  findTransactionDelegations,
  findLatestBlockNumber,
  findGenesisBlock,
  findUtxoByAddressAndBlock,
  findBalanceByAddressAndBlock
};

export default Queries;
