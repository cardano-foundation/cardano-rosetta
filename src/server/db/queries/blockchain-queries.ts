const findBlock = (blockNumber?: number, blockHash?: string): string => `
SELECT 
  b.hash as hash,
  b.block_no as number,
  b.time as "createdAt",
  b2.hash as "previousBlockHash",
  b.tx_count as "transactionsCount",
  s.description as "createdBy",
  b.size as size,
  b.epoch_no as "epochNo",
  b.slot_no as "slotNo"
FROM 
  block b 
  JOIN slot_leader s ON b.slot_leader = s.id
  LEFT JOIN block b2 ON b.previous = b2.id
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

const findTransactionsByBlock = (blockNumber?: number, blockHash?: string): string => `
SELECT 
  tx.*,
  block.hash as blockHash
FROM tx
JOIN block ON block.id = tx.block
WHERE
  ${blockNumber ? 'block.block_no = $1' : '$1 = $1'} AND
  ${blockHash ? 'block.hash = $2' : '$2 = $2'}
`;

const findTransactionByHash = `
SELECT 
  tx.*,
  block.hash as blockHash
FROM tx
JOIN block ON block.id = tx.block
WHERE
  tx.hash = $1
`;

export interface FindTransactionsInputs {
  txHash: Buffer;
  address: string;
  value: string;
  sourceTxHash: Buffer;
  sourceTxIndex: number;
}

const findTransactionsInputs = `SELECT
  source_tx_out.address as address,
  source_tx_out.value as value,
  tx.hash as "txHash",
  source_tx.hash as "sourceTxHash",
  tx_in.tx_out_index as "sourceTxIndex"
FROM
  tx
JOIN tx_in
  ON tx_in.tx_in_id = tx.id
JOIN tx_out as source_tx_out
  ON tx_in.tx_out_id = source_tx_out.tx_id
  AND tx_in.tx_out_index = source_tx_out.index
JOIN tx as source_tx
  ON source_tx_out.tx_id = source_tx.id
WHERE
  tx.hash = ANY ($1)`;

const findGenesisBlock = `
SELECT
  hash,
  block_no as index
FROM
  block
WHERE
  previous IS NULL
LIMIT 1`;

export interface FindTransactionsOutputs {
  address: string;
  value: string;
  index: number;
  txHash: Buffer;
}

const findTransactionsOutputs = `
SELECT
  address,
  value,
  tx.hash as "txHash",
  index
FROM tx
JOIN tx_out
  ON tx.id = tx_out.tx_id
WHERE
  tx.hash = ANY ($1)
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
  index: number;
  txHash: Buffer;
}

const findUtxoFieldsByAddressAndBlock = (selectFields: string): string => `
${selectFields}
FROM tx
JOIN tx_out
  ON tx.id = tx_out.tx_id
LEFT OUTER JOIN tx_in
  ON tx_out.tx_id = tx_in.tx_out_id
    AND tx_out.index = tx_in.tx_out_index
WHERE tx_in.tx_in_id is null
  AND tx_out.address = $1
  AND tx.block <= (SELECT id FROM block WHERE block_no = $2)`;

const selectUtxoDetail = `SELECT
  tx_out.value as value,
  tx.hash as "txHash",
  tx_out.index as index`;

const findUtxoByAddressAndBlock = findUtxoFieldsByAddressAndBlock(selectUtxoDetail);

const selectBalanceFromUtxo = 'SELECT cast(sum(tx_out.value) AS TEXT) as balance ';

const findBalanceByAddressAndBlock = findUtxoFieldsByAddressAndBlock(selectBalanceFromUtxo);

const Queries = {
  findBlock,
  findTransactionsByBlock,
  findTransactionByHash,
  findTransactionsInputs,
  findTransactionsOutputs,
  findLatestBlockNumber,
  findGenesisBlock,
  findBalanceByAddressAndBlock,
  findUtxoByAddressAndBlock
};

export default Queries;
