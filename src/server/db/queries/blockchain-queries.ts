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
  JOIN block b2 ON b.previous = b2.id
WHERE
  ${blockNumber ? 'b.block_no = $1' : '$1 = $1'} AND
  ${blockHash ? 'b.hash = $2' : '$2 = $2'}
LIMIT 1
`;

export interface FindTransactionsByBlock {
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

export interface FindTransactionsInputs {
  txHash: Buffer;
  address: string;
  value: string;
  sourceTxHash: Buffer;
  sourceTxIndex: number;
}

const findTransactionsInputs = `
SELECT 
  *
FROM 
  "TransactionInput"
WHERE
  "txHash" = ANY ($1)
`;

export interface FindTransactionsOutputs {
  address: string;
  value: string;
  index: number;
  txHash: Buffer;
}

const findTransactionsOutputs = `
SELECT 
  *
FROM 
  "TransactionOutput"
WHERE
  "txHash" = ANY ($1)
`;

const Queries = {
  findBlock,
  findTransactionsByBlock,
  findTransactionsInputs,
  findTransactionsOutputs
};

export default Queries;
