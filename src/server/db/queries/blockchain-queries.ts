const findBlock = (blockNumber?: number, blockHash?: string): string => `
SELECT 
  *
FROM 
  "Block"
WHERE
  ${blockNumber ? 'number = $1' : '$1 = $1'} AND
  ${blockHash ? 'hash = $2' : '$2 = $2'}
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
