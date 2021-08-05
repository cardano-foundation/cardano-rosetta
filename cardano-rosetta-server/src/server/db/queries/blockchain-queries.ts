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

export interface CurrencyId {
  symbol: string;
  policy: string;
}

const currenciesQuery = (currencies: CurrencyId[]): string =>
  `SELECT tx_out_id 
   FROM ma_tx_out 
   WHERE (${currencies
     .map(({ symbol, policy }) => `name = DECODE('${symbol}', 'hex') AND policy = DECODE('${policy}', 'hex')`)
     .join('OR ')})`;

// AND (block.block_no = $2 OR (block.block_no is null AND $2 = 0))
// This condition is made because genesis block has block_no = null
// Also, genesis number is 0, thats why $2 = 0.
const findTransactionsByBlock = (blockNumber?: number, blockHash?: string): string => `
SELECT 
  tx.*,
  block.hash as "blockHash"
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
  tx.hash = ANY ($1)
ORDER BY policy, name`;

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
ORDER BY 
  policy,
  name, 
  id
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

export interface FindTransactionPoolRegistrationsData extends FindTransactionFieldResult {
  poolId: number;
  updateId: number;
  vrfKeyHash: Buffer;
  pledge: string;
  margin: string;
  cost: string;
  address: Buffer;
  poolHash: Buffer;
  metadataUrl: string;
  metadataHash: Buffer;
}

export interface FindTransactionPoolOwners extends FindTransactionFieldResult {
  poolId: number;
  owner: Buffer;
}
export interface FindTransactionPoolRelays extends FindTransactionFieldResult {
  updateId: number;
  vrfKeyHash: Buffer;
  ipv4: string;
  ipv6: string;
  dnsName: string;
  port: string;
}

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

export interface FindMaBalance {
  name: Buffer;
  policy: Buffer;
  value: string;
}

export interface FindPoolRetirements extends FindTransactionFieldResult {
  address: Buffer;
  poolKeyHash: Buffer;
  epoch: number;
}

const poolRegistrationQuery = `
  WITH pool_registration AS (
  SELECT
    tx.hash as "txHash",
    tx.id as "txId",
    pu.id as "updateId",
    ph.id as "poolId",
    pu.vrf_key_hash as "vrfKeyHash",
    pu.pledge as pledge,
    pu.margin as margin,
    pu.fixed_cost as cost,
    pu.reward_addr as address,
    ph.hash_raw as "poolHash",
    pm.url as "metadataUrl",
    pm.hash as "metadataHash"
  FROM pool_update pu
  JOIN tx 
    ON pu.registered_tx_id = tx.id
  JOIN pool_hash ph
    ON ph.id = pu.hash_id
  LEFT JOIN pool_metadata_ref pm
    ON pu.meta_id = pm.id
  WHERE
    tx.hash = ANY ($1)
  )
`;

const FindTransactionPoolRegistrationsData = `
  ${poolRegistrationQuery}
    SELECT *
    FROM pool_registration
`;

const findTransactionPoolOwners = `
${poolRegistrationQuery}
    SELECT 
      po.pool_hash_id AS "poolId",
      sa."view" AS "owner"
    FROM pool_registration pr
    JOIN pool_owner po
      ON  (po.pool_hash_id = pr."poolId" 
      AND po.registered_tx_id = pr."txId")
    JOIN stake_address sa
      ON po.addr_id = sa.id
`;

const findTransactionPoolRelays = `
${poolRegistrationQuery}
    SELECT
      prelay.update_id as "updateId",
      prelay.ipv4 as ipv4,
      prelay.ipv6 as ipv6,
      prelay.port as port,
      prelay.dns_name as "dnsName"
    FROM pool_registration pr
    JOIN pool_relay prelay
    ON prelay.update_id = pr."updateId"
`;

const utxoQuery = `
WITH utxo AS (
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
	  tx_out.address = $1 AND
	  tx_in_tx.id IS NULL
)`;

const findPoolRetirements = `
SELECT 
  pr.retiring_epoch AS "epoch",
  ph.hash_raw AS "address",
  tx.hash as "txHash"
FROM pool_retire pr 
INNER JOIN pool_hash ph 
  ON pr.hash_id = ph.id
INNER JOIN tx
  ON tx.id = pr.announced_tx_id
WHERE tx.hash = ANY($1)
`;

const findUtxoByAddressAndBlock = (currencies?: CurrencyId[]): string => `
  ${utxoQuery}
  SELECT
    utxo.value,
    utxo."txHash",
    utxo.index,
    ma_tx_out.name as "name",
    ma_tx_out.policy as "policy",
    ma_tx_out.quantity
  FROM utxo
  LEFT JOIN ma_tx_out 
  ON ma_tx_out.tx_out_id = utxo.tx_out_id 
    ${currencies && currencies.length > 0 ? `WHERE utxo.tx_out_id IN (${currenciesQuery(currencies)})` : ''}
  ORDER BY
    utxo."txHash", utxo.index, ma_tx_out.policy, ma_tx_out.name
`;

const findMaBalanceByAddressAndBlock = `
  ${utxoQuery}
  SELECT
      ma_tx_out.name as "name",
      ma_tx_out.policy as "policy",
      SUM(ma_tx_out.quantity) as value
  FROM utxo
      LEFT JOIN ma_tx_out 
      ON ma_tx_out.tx_out_id = utxo.tx_out_id 
  WHERE ma_tx_out.policy IS NOT NULL
  GROUP  BY ma_tx_out.name, ma_tx_out.policy
  ORDER BY ma_tx_out.policy, ma_tx_out.name
`;

const findBalanceByAddressAndBlock = `
  SELECT (SELECT COALESCE(SUM(r.amount),0) 
      FROM reward r
    JOIN stake_address ON 
        stake_address.id = r.addr_id
    WHERE stake_address.view = $1
    AND r.spendable_epoch <= (SELECT epoch_no FROM block WHERE hash = $2))- 
    (SELECT COALESCE(SUM(w.amount),0) 
    FROM withdrawal w
    JOIN tx ON tx.id = w.tx_id AND 
      tx.block_id <= (SELECT id FROM block WHERE hash = $2)
    JOIN stake_address ON stake_address.id = w.addr_id
    WHERE stake_address.view = $1) 
    AS balance
`;

const findLatestMinFeeAAndMinFeeB = `
SELECT 
  min_fee_a, min_fee_b FROM epoch_param 
WHERE 
  min_fee_a is not null and min_fee_b is not null 
ORDER BY id 
DESC LIMIT 1
`;

const Queries = {
  findBalanceByAddressAndBlock,
  findBlock,
  findLatestBlockNumber,
  findGenesisBlock,
  findMaBalanceByAddressAndBlock,
  findTransactionByHashAndBlock,
  findTransactionDelegations,
  findTransactionDeregistrations,
  findTransactionPoolOwners,
  findTransactionPoolRelays,
  FindTransactionPoolRegistrationsData,
  findTransactionRegistrations,
  findTransactionWithdrawals,
  findTransactionsByBlock,
  findTransactionsInputs,
  findPoolRetirements,
  findTransactionsOutputs,
  findUtxoByAddressAndBlock,
  findLatestMinFeeAAndMinFeeB
};

export default Queries;
