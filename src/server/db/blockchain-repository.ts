import { Pool, QueryResult } from 'pg';
import { hashFormatter, hashStringToBuffer, replace0xOnHash } from '../utils/formatters';
import Queries, {
  FindTransactionsInputs,
  FindTransactionsOutputs,
  FindBalance,
  FindUtxo,
  FindTransaction
} from './queries/blockchain-queries';

export interface Block {
  hash: string;
  number: number;
  createdAt: number;
  previousBlockHash: string;
  previousBlockNumber: number;
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
}

export interface TransactionWithInputsAndOutputs extends Transaction {
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
   * Looks for transactions given the hashes
   *
   * @param hashes
   */
  fillTransaction(transactions: Transaction[]): Promise<TransactionWithInputsAndOutputs[]>;

  /**
   * Returns, if any, the transactions a block contains
   *
   * @param number block number to look transactions for
   * @param blockHash block hash to look transactions for
   */
  findTransactionsByBlock(number?: number, blockHash?: string): Promise<Transaction[]>;

  /**
   * Returns the transaction for the given hash if any
   *
   * @param hash hex formatted transaction hash
   */
  findTransactionByHashAndBlock(
    hash: string,
    blockIdentifier: Components.Schemas.BlockIdentifier
  ): Promise<TransactionWithInputsAndOutputs | null>;

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
  findBalanceByAddressAndBlock(address: string, blockHash: string): Promise<string>;

  /**
   * Returns an array containing all utxo for address till block identified by blockIdentifier if present, else the last
   * @param address account's address to count balance
   * @param blockIdentifier block information, when value is not undefined balance should be count till requested block
   */
  findUtxoByAddressAndBlock(address: string, blockHash: string): Promise<Utxo[]>;
}

/**
 * Maps from a transaction query result to a Transaction Array
 */
const parseTransactionRows = (result: QueryResult<FindTransaction>): Transaction[] =>
  result.rows.map(row => ({
    hash: hashFormatter(row.hash),
    blockHash: row.blockHash && hashFormatter(row.blockHash),
    fee: row.fee,
    size: row.size
  }));

/**
 * Creates a map of transactions where they key is the transaction hash
 *
 * @param transactions a list of transaction rows returned by the DB
 */
const mapTransactionsToDict = (transactions: Transaction[]): NodeJS.Dict<TransactionWithInputsAndOutputs> =>
  transactions.reduce((mappedTransactions, transaction) => {
    const hash = transaction.hash;
    return {
      ...mappedTransactions,
      [hash]: {
        hash,
        blockHash: transaction.blockHash,
        fee: transaction.fee,
        size: transaction.size,
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
const parseInputsRows = (
  transactionsMap: NodeJS.Dict<TransactionWithInputsAndOutputs>,
  inputs: FindTransactionsInputs[]
) =>
  inputs.reduce((updatedTransactionsMap, input) => {
    const transaction = updatedTransactionsMap[hashFormatter(input.txHash)];
    // This case is not supposed to happen but still this if is required
    if (transaction) {
      const transactionWithInputs: TransactionWithInputsAndOutputs = {
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
const parseOutputRows = (
  transactionsMap: NodeJS.Dict<TransactionWithInputsAndOutputs>,
  outputs: FindTransactionsOutputs[]
) =>
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

/**
 * This function returns an array of _proper_ transactions based on a FindTransaction query result, ie,
 * parses the transaction and adds the corresponding inputs and outputs
 *
 * @param databaseInstance
 * @param result
 */
const processTransactionsQueryResult = async (
  databaseInstance: Pool,
  result: QueryResult<FindTransaction>
): Promise<TransactionWithInputsAndOutputs[]> => {
  // Fetch the transactions first
  let transactionsMap = mapTransactionsToDict(parseTransactionRows(result));
  const transactionsHashes = Object.keys(transactionsMap).map(hashStringToBuffer);
  // Look for inputs and outputs based on found tx hashes
  const inputs: QueryResult<FindTransactionsInputs> = await databaseInstance.query(Queries.findTransactionsInputs, [
    transactionsHashes
  ]);
  const outputs: QueryResult<FindTransactionsOutputs> = await databaseInstance.query(Queries.findTransactionsOutputs, [
    transactionsHashes
  ]);
  transactionsMap = parseInputsRows(transactionsMap, inputs.rows);
  transactionsMap = parseOutputRows(transactionsMap, outputs.rows);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore it will never be undefined
  return Object.values(transactionsMap);
};

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
        previousBlockNumber,
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
        previousBlockHash: previousBlockHash && hashFormatter(previousBlockHash),
        previousBlockNumber,
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
    const result: QueryResult<FindTransaction> = await databaseInstance.query(query, parameters);
    if (result.rows.length > 0) {
      return parseTransactionRows(result);
    }
    return [];
  },

  async fillTransaction(transactions: Transaction[]): Promise<TransactionWithInputsAndOutputs[]> {
    if (transactions.length > 0) {
      // Fetch the transactions first
      let transactionsMap = mapTransactionsToDict(transactions);
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
  async findTransactionByHashAndBlock(
    hash: string,
    blockIdentifier: Components.Schemas.BlockIdentifier
  ): Promise<TransactionWithInputsAndOutputs | null> {
    const blockNumber = blockIdentifier.index;
    const blockHash = blockIdentifier.hash;
    const result: QueryResult<FindTransaction> = await databaseInstance.query(Queries.findTransactionByHashAndBlock, [
      hashStringToBuffer(hash),
      blockNumber ? blockNumber : true,
      blockHash ? hashStringToBuffer(blockHash) : true
    ]);
    if (result.rows.length > 0) {
      const [transaction] = await processTransactionsQueryResult(databaseInstance, result);
      return transaction || null;
    }
    return null;
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
  async findBalanceByAddressAndBlock(address, blockHash): Promise<string> {
    const parameters = [replace0xOnHash(address), hashStringToBuffer(blockHash)];
    const result: QueryResult<FindBalance> = await databaseInstance.query(
      Queries.findBalanceByAddressAndBlock,
      parameters
    );
    if (result.rows[0].balance === null) {
      return '0';
    }
    return result.rows[0].balance;
  },
  async findUtxoByAddressAndBlock(address, blockHash): Promise<Utxo[]> {
    const parameters = [replace0xOnHash(address), hashStringToBuffer(blockHash)];
    const result: QueryResult<FindUtxo> = await databaseInstance.query(Queries.findUtxoByAddressAndBlock, parameters);
    return result.rows.map(utxo => ({
      value: utxo.value,
      index: utxo.index,
      transactionHash: hashFormatter(utxo.txHash)
    }));
  }
});
