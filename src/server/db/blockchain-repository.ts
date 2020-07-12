import { hashFormatter, hashStringToBuffer } from '../utils/formatters';
import { Pool } from 'pg';

export interface Block {
  hash: string;
  number: number;
  createdAt: number;
  previousBlockHash: string;
  transactionsCount: number;
  createdBy: string;
  size: number;
  epochNo: number;
  slotNo: number;
}

export interface TransactionInput {
  address: string;
  value: string;
  sourceTransactionHash: string;
  sourceTransactionIndex: number;
}

export interface TransactionOutput {
  address: string;
  value: string;
  index: number;
}

export interface Transaction {
  hash: string;
  blockHash: string;
  fee: string;
  size: number;
  inputs: TransactionInput[];
  outputs: TransactionOutput[];
}

export interface BlockchainRepository {
  /**
   * Finds a block based on the given block number or hash. If non sent, latest (tip) block information
   * is retrieved
   *
   * @param blockNumber
   * @param blockHash
   */
  findBlock(number?: number, blockHash?: string): Promise<Block | null>;

  /**
   * Returns, if any, the transactions a block contains
   *
   * @param number block number to look transactions for
   * @param blockHash block hash to look transactions for
   */
  findTransactionsByBlock(number?: number, blockHash?: string): Promise<Transaction[]>;

  /**
   * Returns the tip of the chain block number
   */
  findLatestBlockNumber(): Promise<number>;
}

const findBlockQuery = (blockNumber?: number, blockHash?: string) => `
SELECT 
  *
FROM 
  "Block"
WHERE
  ${blockNumber ? 'number = $1' : '$1 = $1'} AND
  ${blockHash ? 'hash = $2' : '$2 = $2'}
LIMIT 1
`;

const findTransactionsByBlockQuery = (blockNumber?: number, blockHash?: string) => `
SELECT 
  tx.*,
  block.hash as blockHash
FROM tx
JOIN block ON block.id = tx.block
WHERE
  ${blockNumber ? 'block.block_no = $1' : '$1 = $1'} AND
  ${blockHash ? 'block.hash = $2' : '$2 = $2'}
`;

const findTransactionsInputsQuery = `
SELECT 
  *
FROM 
  "TransactionInput"
WHERE
  "txHash" = ANY ($1)
`;

const findTransactionsOutputsQuery = `
SELECT 
  *
FROM 
  "TransactionOutput"
WHERE
  "txHash" = ANY ($1)
`;

export const configure = (databaseInstance: Pool): BlockchainRepository => ({
  async findBlock(blockNumber?: number, blockHash?: string): Promise<Block | null> {
    const query = findBlockQuery(blockNumber, blockHash);
    // Add paramter or short-circuit it
    const parameters = [
      blockNumber ? blockNumber : true,
      blockHash ? Buffer.from(blockHash.replace('0x', ''), 'hex') : true
    ];
    const result = await databaseInstance.query(query, parameters);
    /* eslint-disable camelcase */
    if (result.rows.length === 1) {
      const {
        number,
        hash,
        createdAt,
        previousBlockHash,
        transactionsCount,
        createdBy,
        size,
        epochNo,
        slotNo
      } = result.rows[0];
      return {
        number,
        hash: hashFormatter(hash),
        createdAt,
        previousBlockHash: hashFormatter(previousBlockHash),
        transactionsCount,
        createdBy,
        size,
        epochNo,
        slotNo
      };
    }
    return null;
  },

  async findTransactionsByBlock(blockNumber?: number, blockHash?: string): Promise<Transaction[]> {
    // FIXME: We could add some types here although it's easier to map the results without them
    // Yet this implementation looks like re-implementing an ORM we found it might not be worthy
    // to actually include one for this single API. There are no other method that require
    // fetching results from multiple tables

    const query = findTransactionsByBlockQuery(blockNumber, blockHash);
    // Add paramter or short-circuit it
    const parameters = [blockNumber ? blockNumber : true, blockHash ? hashStringToBuffer(blockHash) : true];
    const result = await databaseInstance.query(query, parameters);
    if (result.rows.length > 0) {
      // Fetch the transactions first
      let transactionsMap = result.rows.reduce(
        (mappedTransactions, row) => ({
          ...mappedTransactions,
          [hashFormatter(row.hash)]: {
            hash: hashFormatter(row.hash),
            blockHash: row.blockHash,
            fee: row.fee,
            size: row.size,
            inputs: [],
            outputs: []
          }
        }),
        {}
      );
      const transactionsHashes = Object.keys(transactionsMap).map(hashStringToBuffer);
      // Look for inputs and outputs based on found tx hashes
      const inputs = await databaseInstance.query(findTransactionsInputsQuery, [transactionsHashes]);
      const outputs = await databaseInstance.query(findTransactionsOutputsQuery, [transactionsHashes]);
      // Parse transaction inputs result set
      transactionsMap = inputs.rows.reduce((updatedTransactionsMap, input) => {
        const transaction = updatedTransactionsMap[hashFormatter(input.txHash)];
        const transactionWithInputs: Transaction = {
          ...transaction,
          inputs: transaction.inputs.concat({
            address: input.address,
            value: input.value,
            sourceTransactionHash: hashFormatter(input.sourceTxHash),
            sourceTransactionIndex: input.sourceTxIndex
          })
        };
        return {
          ...updatedTransactionsMap,
          [transaction.hash]: transactionWithInputs
        };
      }, transactionsMap);
      // Parse transaction outputs result set
      transactionsMap = outputs.rows.reduce((updatedTransactionsMap, output) => {
        const transaction = updatedTransactionsMap[hashFormatter(output.txHash)];
        const transactionWithOutputs = {
          ...transaction,
          outputs: transaction.outputs.concat({
            address: output.address,
            value: output.value,
            index: output.indx
          })
        };
        return {
          ...updatedTransactionsMap,
          [transaction.hash]: transactionWithOutputs
        };
      }, transactionsMap);

      return Object.values(transactionsMap);
    }
    return [];
  },

  async findLatestBlockNumber(): Promise<number> {
    const result = await databaseInstance.query('SELECT "blockHeight" FROM "Cardano"');
    return result.rows[0].blockHeight;
  }
});
