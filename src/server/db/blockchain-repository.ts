import { Pool, QueryResult } from 'pg';
import moment from 'moment';
import { hexFormatter, hashStringToBuffer, replace0xOnHash } from '../utils/formatters';
import Queries, {
  FindTransaction,
  FindTransactionsInputs,
  FindTransactionsOutputs,
  FindUtxo
} from './queries/blockchain-queries';
import { Logger } from 'fastify';
import { Block, TransactionWithInputsAndOutputs, GenesisBlock, Utxo, Transaction } from '../models';

export interface BlockchainRepository {
  /**
   * Finds a block based on the given block number or hash. If non sent, latest (tip) block information
   * is retrieved
   *
   * @param blockNumber
   * @param blockHash
   */
  findBlock(logger: Logger, number?: number, blockHash?: string): Promise<Block | null>;

  /**
   * Looks for transactions given the hashes
   *
   * @param hashes
   */
  fillTransaction(logger: Logger, transactions: Transaction[]): Promise<TransactionWithInputsAndOutputs[]>;

  /**
   * Returns, if any, the transactions a block contains
   *
   * @param number block number to look transactions for
   * @param blockHash block hash to look transactions for
   */
  findTransactionsByBlock(logger: Logger, number?: number, blockHash?: string): Promise<Transaction[]>;

  /**
   * Returns the transaction for the given hash if any
   *
   * @param hash hex formatted transaction hash
   */
  findTransactionByHashAndBlock(
    logger: Logger,
    hash: string,
    blockNumber: number,
    blockHash: string
  ): Promise<TransactionWithInputsAndOutputs | null>;

  /**
   * Returns the tip of the chain block number
   */
  findLatestBlockNumber(logger: Logger): Promise<number>;

  /**
   * Returns the genesis block
   */
  findGenesisBlock(logger: Logger): Promise<GenesisBlock | null>;

  /**
   * Returns an array containing all utxo for address till block identified by blockIdentifier if present, else the last
   * @param address account's address to count balance
   * @param blockIdentifier block information, when value is not undefined balance should be count till requested block
   */
  findUtxoByAddressAndBlock(logger: Logger, address: string, blockHash: string): Promise<Utxo[]>;
}

/**
 * Maps from a transaction query result to a Transaction Array
 */
const parseTransactionRows = (result: QueryResult<FindTransaction>): Transaction[] =>
  result.rows.map(row => ({
    hash: hexFormatter(row.hash),
    blockHash: row.blockHash && hexFormatter(row.blockHash),
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
    const transaction = updatedTransactionsMap[hexFormatter(input.txHash)];
    // This case is not supposed to happen but still this if is required
    if (transaction) {
      const transactionWithInputs: TransactionWithInputsAndOutputs = {
        ...transaction,
        inputs: transaction.inputs.concat({
          address: input.address,
          value: input.value,
          sourceTransactionHash: hexFormatter(input.sourceTxHash),
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
    const transaction = updatedTransactionsMap[hexFormatter(output.txHash)];
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
  async findBlock(logger: Logger, blockNumber?: number, blockHash?: string): Promise<Block | null> {
    const query = Queries.findBlock(blockNumber, blockHash);
    logger.debug(`[findBlock] Parameters received for run query blockNumber: ${blockNumber}, blockHash: ${blockHash}`);
    // Add paramter or short-circuit it
    const parameters = [blockNumber ? blockNumber : true, blockHash ? hashStringToBuffer(blockHash) : true];
    const result = await databaseInstance.query(query, parameters);
    /* eslint-disable camelcase */
    if (result.rows.length === 1) {
      logger.debug('[findBlock] Block found!');
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
        hash: hexFormatter(hash),
        // blockTime should be in miliseconds for more precision
        // eslint-disable-next-line no-magic-numbers
        createdAt: moment.utc(createdAt).unix() * 1000,
        previousBlockHash: previousBlockHash && hexFormatter(previousBlockHash),
        previousBlockNumber,
        transactionsCount,
        createdBy,
        size,
        epochNo,
        slotNo
      };
    }
    logger.debug('[findBlock] No block was found');
    return null;
  },

  async findTransactionsByBlock(logger: Logger, blockNumber?: number, blockHash?: string): Promise<Transaction[]> {
    const query = Queries.findTransactionsByBlock(blockNumber, blockHash);
    logger.debug(
      `[findTransactionsByBlock] Parameters received for run query blockNumber: ${blockNumber}, blockHash: ${blockHash}`
    );
    // Add paramter or short-circuit it
    const parameters = [blockNumber ? blockNumber : true, blockHash ? hashStringToBuffer(blockHash) : true];
    logger.debug({ parameters }, '[findTransactionsByBlock] About to run findTransactionsByBlock query with params');
    const result: QueryResult<FindTransaction> = await databaseInstance.query(query, parameters);
    logger.debug(`[findTransactionsByBlock] Found ${result.rowCount} transactions`);
    if (result.rows.length > 0) {
      return parseTransactionRows(result);
    }
    return [];
  },

  async fillTransaction(logger: Logger, transactions: Transaction[]): Promise<TransactionWithInputsAndOutputs[]> {
    if (transactions.length > 0) {
      // Fetch the transactions first
      let transactionsMap = mapTransactionsToDict(transactions);
      const transactionsHashes = Object.keys(transactionsMap).map(hashStringToBuffer);
      logger.debug(
        { transactionsHashes },
        `[fillTransaction] About to query for inputs and outputs given ${transactions.length} transaction's hashes`
      );
      // Look for inputs and outputs based on found tx hashes
      logger.debug('[fillTransaction] About to query for inputs');
      const inputs: QueryResult<FindTransactionsInputs> = await databaseInstance.query(Queries.findTransactionsInputs, [
        transactionsHashes
      ]);
      logger.debug(`[fillTransaction] Found ${inputs.rowCount}`);

      logger.debug('[fillTransaction] About to query for outputs');
      const outputs: QueryResult<FindTransactionsOutputs> = await databaseInstance.query(
        Queries.findTransactionsOutputs,
        [transactionsHashes]
      );
      logger.debug(`[fillTransaction] Found ${outputs.rowCount}`);

      logger.debug('[fillTransaction] Parsing inputs');
      transactionsMap = parseInputsRows(transactionsMap, inputs.rows);
      logger.debug('[fillTransaction] Parsing outputs');
      transactionsMap = parseOutputRows(transactionsMap, outputs.rows);
      logger.debug('[fillTransaction] Returning inputs and outputs as a transaction map');
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore it will never be undefined
      return Object.values(transactionsMap);
    }
    logger.debug('[fillTransaction] Since no transactions were given, no inputs and outputs are looked for');
    return [];
  },
  async findTransactionByHashAndBlock(
    logger: Logger,
    hash: string,
    blockNumber: number,
    blockHash: string
  ): Promise<TransactionWithInputsAndOutputs | null> {
    logger.debug(
      `[findTransactionByHashAndBlock] Parameters received for run query blockNumber: ${blockNumber}, blockHash: ${blockHash}`
    );
    const parameters = [hashStringToBuffer(hash), Number(blockNumber), hashStringToBuffer(blockHash)];
    logger.debug(
      { parameters },
      '[findTransactionByHashAndBlock] About to run findTransactionsByHashAndBlock query with parameters'
    );
    const result: QueryResult<FindTransaction> = await databaseInstance.query(
      Queries.findTransactionByHashAndBlock,
      parameters
    );
    logger.debug(`[findTransactionByHashAndBlock] Found ${result.rowCount} transactions`);
    if (result.rows.length > 0) {
      const [transaction] = await processTransactionsQueryResult(databaseInstance, result);
      return transaction || null;
    }
    return null;
  },

  async findLatestBlockNumber(logger: Logger): Promise<number> {
    logger.debug('[findLatestBlockNumber] About to run findLatestBlockNumber query');
    const result = await databaseInstance.query(Queries.findLatestBlockNumber);
    const latestBlockNumber = result.rows[0].blockHeight;
    logger.debug(`[findLatestBlockNumber] Latest block number is ${latestBlockNumber}`);
    return latestBlockNumber;
  },

  async findGenesisBlock(logger: Logger): Promise<GenesisBlock | null> {
    logger.debug('[findGenesisBlock] About to run findGenesisBlock query');
    const result = await databaseInstance.query(Queries.findGenesisBlock);
    if (result.rows.length === 1) {
      logger.debug('[findGenesisBlock] Genesis block was found');
      return { hash: hexFormatter(result.rows[0].hash), number: result.rows[0].index };
    }
    logger.debug('[findGenesisBlock] Genesis block was not found');
    return null;
  },
  async findUtxoByAddressAndBlock(logger: Logger, address, blockHash): Promise<Utxo[]> {
    const parameters = [replace0xOnHash(address), hashStringToBuffer(blockHash)];
    logger.debug(
      { address, blockHash },
      '[findUtxoByAddressAndBlock] About to run findUtxoByAddressAndBlock query with parameters:'
    );
    const result: QueryResult<FindUtxo> = await databaseInstance.query(Queries.findUtxoByAddressAndBlock, parameters);
    logger.debug(`[findUtxoByAddressAndBlock] Found ${result.rowCount} utxos`);
    return result.rows.map(utxo => ({
      value: utxo.value,
      transactionHash: hexFormatter(utxo.txHash),
      index: utxo.index
    }));
  }
});
