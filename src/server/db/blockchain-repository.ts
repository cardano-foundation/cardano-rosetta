import { Pool, QueryResult } from 'pg';
import { hashFormatter, hashStringToBuffer, replace0xOnHash } from '../utils/formatters';
import Queries, {
  FindTransactionsByBlock,
  FindTransactionsInputs,
  FindTransactionsOutputs,
  FindBalance,
  FindUtxo
} from './queries/blockchain-queries';

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

export interface GenesisBlock {
  hash: string;
  index: number;
}

export interface BlockIdentifier {
  index: number;
  hash: string;
}

export interface PartialBlockIdentifier {
  index?: number;
  hash?: string;
}

export interface Utxo {
  value: string;
  index: number;
  transactionHash: string;
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

  /**
   * Returns the genesis block
   */
  findGenesisBlock(): Promise<GenesisBlock | null>;
  /*
   * Returns balance available for address till block identified by blockIdentifier if present, else the last
   * @param address account's address to count balance
   * @param blockIdentifier block information, when value is not undefined balance should be count till requested block
   */
  findBalanceByAddressAndBlock(address: string, blockNumber: number): Promise<number>;

  /**
   * Returns an array containing all utxo for address till block identified by blockIdentifier if present, else the last
   * @param address account's address to count balance
   * @param blockIdentifier block information, when value is not undefined balance should be count till requested block
   */
  findUtxoByAddressAndBlock(address: string, blockNumber: number): Promise<Utxo[]>;
}

/**
 * Creates a map of transactions where they key is the transaction hash
 *
 * @param rows a list of transaction rows returned by the DB
 */
const parseTransactionRows = (rows: FindTransactionsByBlock[]): NodeJS.Dict<Transaction> =>
  rows.reduce((mappedTransactions, row) => {
    const hash = hashFormatter(row.hash);
    return {
      ...mappedTransactions,
      [hash]: {
        hash,
        blockHash: row.blockHash,
        fee: row.fee,
        size: row.size,
        inputs: [],
        outputs: []
      }
    };
  }, {});

/**
 * Updates the transactions map appending inputs for each transaction
 *
 * @param transactionsMap
 * @param inputs
 */
const parseInputsRows = (transactionsMap: NodeJS.Dict<Transaction>, inputs: FindTransactionsInputs[]) =>
  inputs.reduce((updatedTransactionsMap, input) => {
    const transaction = updatedTransactionsMap[hashFormatter(input.txHash)];
    // This case is not supposed to happen but still this if is required
    if (transaction) {
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
    }
    return updatedTransactionsMap;
  }, transactionsMap);

/**
 * Updates the transactions map appending output for each transaction
 *
 * @param transactionsMap
 * @param inputs
 */
const parseOutputRows = (transactionsMap: NodeJS.Dict<Transaction>, outputs: FindTransactionsOutputs[]) =>
  outputs.reduce((updatedTransactionsMap, output) => {
    const transaction = updatedTransactionsMap[hashFormatter(output.txHash)];
    if (transaction) {
      const transactionWithOutputs = {
        ...transaction,
        outputs: transaction.outputs.concat({
          address: output.address,
          value: output.value,
          index: output.index
        })
      };
      return {
        ...updatedTransactionsMap,
        [transaction.hash]: transactionWithOutputs
      };
    }
    return updatedTransactionsMap;
  }, transactionsMap);

export const configure = (databaseInstance: Pool): BlockchainRepository => ({
  async findBlock(blockNumber?: number, blockHash?: string): Promise<Block | null> {
    const query = Queries.findBlock(blockNumber, blockHash);
    // Add paramter or short-circuit it
    const parameters = [blockNumber ? blockNumber : true, blockHash ? hashStringToBuffer(blockHash) : true];
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
    const query = Queries.findTransactionsByBlock(blockNumber, blockHash);
    // Add paramter or short-circuit it
    const parameters = [blockNumber ? blockNumber : true, blockHash ? hashStringToBuffer(blockHash) : true];
    const result: QueryResult<FindTransactionsByBlock> = await databaseInstance.query(query, parameters);
    if (result.rows.length > 0) {
      // Fetch the transactions first
      let transactionsMap = parseTransactionRows(result.rows);
      const transactionsHashes = Object.keys(transactionsMap).map(hashStringToBuffer);
      // Look for inputs and outputs based on found tx hashes
      const inputs: QueryResult<FindTransactionsInputs> = await databaseInstance.query(Queries.findTransactionsInputs, [
        transactionsHashes
      ]);
      const outputs: QueryResult<FindTransactionsOutputs> = await databaseInstance.query(
        Queries.findTransactionsOutputs,
        [transactionsHashes]
      );
      transactionsMap = parseInputsRows(transactionsMap, inputs.rows);
      transactionsMap = parseOutputRows(transactionsMap, outputs.rows);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore it will never be undefined
      return Object.values(transactionsMap);
    }
    return [];
  },

  async findLatestBlockNumber(): Promise<number> {
    const result = await databaseInstance.query(Queries.findLatestBlockNumber);
    return result.rows[0].blockHeight;
  },

  async findGenesisBlock(): Promise<GenesisBlock | null> {
    const result = await databaseInstance.query(Queries.findGenesisBlock);
    if (result.rows.length === 1) {
      return { hash: hashFormatter(result.rows[0].hash), index: result.rows[0].index };
    }
    return null;
  },
  async findBalanceByAddressAndBlock(address, blockNumber): Promise<number> {
    const parameters = [replace0xOnHash(address), blockNumber];
    const result: QueryResult<FindBalance> = await databaseInstance.query(
      Queries.findBalanceByAddressAndBlock,
      parameters
    );
    if (result.rows[0].balance === null) {
      return 0;
    }
    return result.rows[0].balance;
  },
  async findUtxoByAddressAndBlock(address, blockNumber): Promise<Utxo[]> {
    const parameters = [replace0xOnHash(address), blockNumber];
    const result: QueryResult<FindUtxo> = await databaseInstance.query(Queries.findUtxoByAddressAndBlock, parameters);
    return result.rows.map(utxo => ({
      value: utxo.value,
      index: utxo.index,
      transactionHash: hashFormatter(utxo.txHash)
    }));
  }
});
