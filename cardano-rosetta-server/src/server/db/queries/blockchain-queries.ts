import { CatalystLabels } from '../../utils/constants';
import { CurrencyId } from '../../models';

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

const currenciesQuery = (currencies: CurrencyId[]): string =>
  `SELECT 
    tx_out_id
   FROM ma_tx_out
   JOIN multi_asset as asset
    ON asset.id = ma_tx_out.ident
   WHERE (${currencies
     .map(
       ({ symbol, policy }) => `asset.name = DECODE('${symbol}', 'hex') AND asset.policy = DECODE('${policy}', 'hex')`
     )
     .join('OR ')})`;

// AND (block.block_no = $2 OR (block.block_no is null AND $2 = 0))
// This condition is made because genesis block has block_no = null
// Also, genesis number is 0, thats why $2 = 0.
const findTransactionsByBlock = (blockNumber?: number, blockHash?: string): string => `
SELECT 
  tx.hash,
  tx.fee,
  tx.size,
  tx.valid_contract AS "validContract",
  tx.script_size AS "scriptSize",
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
  tx.hash,
  tx.fee,
  tx.size,
  tx.valid_contract AS "validContract",
  tx.script_size AS "scriptSize",
  block.hash as "blockHash"
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
  asset.policy as policy,
  asset.name as name,
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
LEFT JOIN multi_asset as asset
  ON asset.id = source_ma_tx_out.ident
WHERE
  tx.hash = ANY ($1)
ORDER BY policy, name, id`;

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
  asset.policy as policy,
  asset.name as name,
  ma_tx_out.quantity as quantity
FROM tx
JOIN tx_out
  ON tx.id = tx_out.tx_id
LEFT JOIN ma_tx_out
  ON ma_tx_out.tx_out_id = tx_out.id
LEFT JOIN multi_asset as asset
  ON asset.id = ma_tx_out.ident
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
  updateId: number;
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
ORDER BY d.id DESC
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

export interface FindTransactionMetadata extends FindTransactionFieldResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signature: any;
}

const poolRegistrationQuery = `
  WITH pool_registration AS (
  SELECT
    tx.hash as "txHash",
    tx.id as "txId",
    pu.id as "updateId",
    pu.vrf_key_hash as "vrfKeyHash",
    pu.pledge as pledge,
    pu.margin as margin,
    pu.fixed_cost as cost,
    sa."view" AS address,
    ph.hash_raw as "poolHash",
    pm.url as "metadataUrl",
    pm.hash as "metadataHash"
  FROM pool_update pu
  JOIN tx 
    ON pu.registered_tx_id = tx.id
  JOIN pool_hash ph
    ON ph.id = pu.hash_id
  JOIN stake_address sa 
    ON sa.id = pu.reward_addr_id
  LEFT JOIN pool_metadata_ref pm
    ON pu.meta_id = pm.id
  WHERE
    tx.hash = ANY ($1)
  )
`;

const findTransactionPoolRegistrationsData = `
  ${poolRegistrationQuery}
    SELECT *
    FROM pool_registration
`;

const findTransactionPoolOwners = `
${poolRegistrationQuery}
    SELECT 
      po.pool_update_id AS "updateId",
      sa."view" AS "owner",
      pr."txHash"
    FROM pool_registration pr
    JOIN pool_owner po
      ON  po.pool_update_id = pr."updateId"
    JOIN stake_address sa
      ON po.addr_id = sa.id
    ORDER BY po.id DESC
`;

const findTransactionPoolRelays = `
${poolRegistrationQuery}
    SELECT
      prelay.update_id as "updateId",
      prelay.ipv4 as ipv4,
      prelay.ipv6 as ipv6,
      prelay.port as port,
      prelay.dns_name as "dnsName",
      pr."txHash"
    FROM pool_registration pr
    JOIN pool_relay prelay
    ON prelay.update_id = pr."updateId"
`;

const findTransactionMetadata = `
WITH metadata AS (
  SELECT
    metadata.json,
    metadata.key,
    tx.hash AS "txHash",
    tx.id AS "txId"
  FROM tx_metadata AS metadata
  JOIN tx
    ON tx.id = metadata.tx_id
  WHERE tx.hash = ANY($1)
  ),
  metadata_data AS (
    SELECT 
      json AS data,
      metadata."txHash",
      metadata."txId"
    FROM metadata
    WHERE key = ${CatalystLabels.DATA}
  ),
  metadata_sig AS (
    SELECT 
      json AS signature,
      metadata."txHash",
      metadata."txId"
    FROM metadata
    WHERE key = ${CatalystLabels.SIG}
  )
  SELECT 
    data,
    signature,
    metadata_data."txHash"
  FROM metadata_data
  INNER JOIN metadata_sig
    ON metadata_data."txId" = metadata_sig."txId"
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
	  tx_in_tx.block_id <= (select id from block where hash = $2) AND
    tx_in_tx.valid_contract = TRUE
	JOIN tx AS tx_out_tx ON
	  tx_out_tx.id = tx_out.tx_id AND
	  tx_out_tx.block_id <= (select id from block where hash = $2) AND
    tx_out_tx.valid_contract = TRUE
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
    asset.name as "name",
    asset.policy as "policy",
    ma_tx_out.quantity
  FROM utxo
  LEFT JOIN ma_tx_out
    ON ma_tx_out.tx_out_id = utxo.tx_out_id 
  LEFT JOIN multi_asset as asset
    ON asset.id = ma_tx_out.ident
    ${currencies && currencies.length > 0 ? `WHERE utxo.tx_out_id IN (${currenciesQuery(currencies)})` : ''}
  ORDER BY
    utxo."txHash", utxo.index, asset.policy, asset.name
`;

const findMaBalanceByAddressAndBlock = `
  ${utxoQuery}
  SELECT
      asset.name as "name",
      asset.policy as "policy",
      SUM(ma_tx_out.quantity) as value
  FROM utxo
      LEFT JOIN ma_tx_out 
      ON ma_tx_out.tx_out_id = utxo.tx_out_id
  JOIN multi_asset as asset
  ON asset.id = ma_tx_out.ident
  WHERE asset.policy IS NOT NULL
  GROUP  BY asset.name, asset.policy
  ORDER BY asset.policy, asset.name
`;

const findBalanceByAddressAndBlock = `
  SELECT (SELECT COALESCE(SUM(r.amount),0) 
      FROM reward r
    JOIN stake_address ON 
        stake_address.id = r.addr_id
    WHERE stake_address.view = $1
    AND r.spendable_epoch <= (SELECT epoch_no FROM block WHERE hash = $2)
  ) - (
    SELECT COALESCE(SUM(w.amount),0) 
    FROM withdrawal w
    JOIN tx ON tx.id = w.tx_id AND 
      tx.valid_contract = TRUE AND
      tx.block_id <= (SELECT id FROM block WHERE hash = $2)
    JOIN stake_address ON stake_address.id = w.addr_id
    WHERE stake_address.view = $1) 
    AS balance
`;

const findProtocolParameters = `
  SELECT 
    coins_per_utxo_size,
    max_tx_size,
    max_val_size,
    key_deposit,
    max_collateral_inputs,
    min_fee_a,
    min_fee_b,
    min_pool_cost,
    pool_deposit,
    protocol_major
  FROM epoch_param  
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
  findTransactionMetadata,
  findTransactionPoolOwners,
  findTransactionPoolRelays,
  findTransactionPoolRegistrationsData,
  findTransactionRegistrations,
  findTransactionWithdrawals,
  findTransactionsByBlock,
  findTransactionsInputs,
  findPoolRetirements,
  findTransactionsOutputs,
  findUtxoByAddressAndBlock,
  findProtocolParameters
};

export default Queries;
