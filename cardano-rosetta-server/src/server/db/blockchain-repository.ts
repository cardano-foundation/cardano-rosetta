import { Logger } from 'fastify';
import moment from 'moment';
import { Pool, QueryResult } from 'pg';
import {
  Block,
  FindTransactionWithToken,
  GenesisBlock,
  PolicyId,
  PopulatedTransaction,
  Token,
  Transaction,
  TransactionInput,
  TransactionIO,
  TransactionOutput,
  Utxo
} from '../models';
import { hashStringToBuffer, hexFormatter } from '../utils/formatters';
import Queries, {
  FindBalance,
  FindTransaction,
  FindTransactionDelegations,
  FindTransactionDeregistrations,
  FindTransactionFieldResult,
  FindTransactionIOResult,
  FindTransactionRegistrations,
  FindTransactionsInputs,
  FindTransactionsOutputs,
  FindTransactionWithdrawals,
  FindUtxo
} from './queries/blockchain-queries';

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
  fillTransaction(logger: Logger, transactions: Transaction[]): Promise<PopulatedTransaction[]>;

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
  ): Promise<PopulatedTransaction | null>;

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

  /**
   * Returns the balance for address till block identified by blockIdentifier if present, else the last
   * @param address account's address to count balance
   * @param blockIdentifier block information, when value is not undefined balance should be count till requested block
   */
  findBalanceByAddressAndBlock(logger: Logger, address: string, blockHash: string): Promise<string>;
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
const mapTransactionsToDict = (transactions: Transaction[]): TransactionsMap =>
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
        outputs: [],
        withdrawals: [],
        registrations: [],
        deregistrations: [],
        delegations: []
      }
    };
  }, {});

type TransactionsMap = NodeJS.Dict<PopulatedTransaction>;

const populateTransactionField = <T extends FindTransactionFieldResult>(
  transactionsMap: TransactionsMap,
  queryResults: T[],
  populateTransaction: (transaction: PopulatedTransaction, result: T) => PopulatedTransaction
): TransactionsMap =>
  queryResults.reduce((updatedTransactionsMap, row) => {
    const transaction = updatedTransactionsMap[hexFormatter(row.txHash)];
    // This case is not supposed to happen but still this if is required
    if (transaction) {
      const updatedTransaction: PopulatedTransaction = populateTransaction(transaction, row);
      return {
        ...updatedTransactionsMap,
        [transaction.hash]: updatedTransaction
      };
    }
    return updatedTransactionsMap;
  }, transactionsMap);

/**
 * Finds or creates a transaction input or output in given transaction
 * @param  {T[]} transactions
 * @param  {number} id
 * @param  {()=>T} create
 * @returns T
 */
const findOrCreateTransactionIO = <T extends TransactionIO>(transactions: T[], id: number, create: () => T): T => {
  let transaction = transactions.find(t => t.id === id);
  if (!transaction) {
    transaction = create();
    transactions.push();
  }
  return transaction;
};
/**
 * Checks if operation has a token
 * @param  {FindTransactionIOResult} operation
 * @returns operationisFindTransactionWithToken
 */
const hasToken = (operation: FindTransactionIOResult): operation is FindTransactionWithToken =>
  operation.policy !== undefined && operation.name !== undefined && operation.quantity !== undefined;

/**
 * Add token to token bundle of given transaction operation
 * @param  {TransactionIO} transaction
 * @param  {string} policy
 * @param  {string} name
 * @param  {number} quantity
 * @returns void
 */
const addToken = (transaction: TransactionIO, policy: string, name: string, quantity: number): void => {
  const tokenBundle = transaction.tokenBundle ?? { tokens: new Map<PolicyId, Token[]>() };
  if (!tokenBundle.tokens.has(policy)) {
    tokenBundle.tokens.set(policy, []);
  }
  tokenBundle.tokens.get(policy)?.push({ name, quantity });
};

/**
 * Updates the transaction inputs
 *
 * @param transaction
 * @param input
 */
const parseInputsRow = (transaction: PopulatedTransaction, input: FindTransactionsInputs): PopulatedTransaction => {
  const transactionInput: TransactionInput = findOrCreateTransactionIO(transaction.inputs, input.id, () => ({
    id: input.id,
    address: input.address,
    value: input.value,
    sourceTransactionHash: hexFormatter(input.sourceTxHash),
    sourceTransactionIndex: input.sourceTxIndex
  }));
  if (hasToken(input)) {
    addToken(transactionInput, input.policy, input.name, input.quantity);
  }
  return transaction;
};

/**
 * Updates the transaction appending outputs
 *
 * @param transaction
 * @param output
 */
const parseOutputsRow = (transaction: PopulatedTransaction, output: FindTransactionsOutputs): PopulatedTransaction => {
  const transactionOutput: TransactionOutput = findOrCreateTransactionIO(transaction.outputs, output.id, () => ({
    id: output.id,
    address: output.address,
    value: output.value,
    index: output.index
  }));
  if (hasToken(output)) {
    addToken(transactionOutput, output.policy, output.name, output.quantity);
  }
  return transaction;
};

/**
 * Updates the transaction appending withdrawals
 *
 * @param transaction
 * @param withdrawal
 */
const parseWithdrawalsRow = (
  transaction: PopulatedTransaction,
  withdrawal: FindTransactionWithdrawals
): PopulatedTransaction => ({
  ...transaction,
  withdrawals: transaction.withdrawals.concat({
    stakeAddress: withdrawal.address,
    amount: withdrawal.amount
  })
});

/**
 * Updates the transaction appending registrations
 *
 * @param transaction
 * @param registration
 */
const parseRegistrationsRow = (
  transaction: PopulatedTransaction,
  registration: FindTransactionRegistrations
): PopulatedTransaction => ({
  ...transaction,
  registrations: transaction.registrations.concat({
    stakeAddress: registration.address,
    amount: registration.amount
  })
});

/**
 * Updates the transaction appending deregistrations
 *
 * @param transaction
 * @param deregistration
 */
const parseDeregistrationsRow = (
  transaction: PopulatedTransaction,
  deregistration: FindTransactionDeregistrations
): PopulatedTransaction => ({
  ...transaction,
  deregistrations: transaction.deregistrations.concat({
    stakeAddress: deregistration.address,
    amount: deregistration.amount
  })
});

/**
 * Updates the transaction appending delegations
 *
 * @param transaction
 * @param delegation
 */
const parseDelegationsRow = (
  transaction: PopulatedTransaction,
  delegation: FindTransactionDelegations
): PopulatedTransaction => ({
  ...transaction,
  delegations: transaction.delegations.concat({
    stakeAddress: delegation.address,
    poolHash: hexFormatter(delegation.poolHash)
  })
});

const populateTransactions = async (
  databaseInstance: Pool,
  transactionsMap: TransactionsMap
): Promise<PopulatedTransaction[]> => {
  const transactionsHashes = Object.keys(transactionsMap).map(hashStringToBuffer);
  const operationsQueries = [
    Queries.findTransactionsInputs,
    Queries.findTransactionsOutputs,
    Queries.findTransactionWithdrawals,
    Queries.findTransactionRegistrations,
    Queries.findTransactionDeregistrations,
    Queries.findTransactionDelegations
  ];
  const [inputs, outputs, withdrawals, registrations, deregistrations, delegations] = await Promise.all(
    operationsQueries.map(operationQuery => databaseInstance.query(operationQuery, [transactionsHashes]))
  );
  transactionsMap = populateTransactionField(transactionsMap, inputs.rows, parseInputsRow);
  transactionsMap = populateTransactionField(transactionsMap, outputs.rows, parseOutputsRow);
  transactionsMap = populateTransactionField(transactionsMap, withdrawals.rows, parseWithdrawalsRow);
  transactionsMap = populateTransactionField(transactionsMap, registrations.rows, parseRegistrationsRow);
  transactionsMap = populateTransactionField(transactionsMap, deregistrations.rows, parseDeregistrationsRow);
  transactionsMap = populateTransactionField(transactionsMap, delegations.rows, parseDelegationsRow);

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

  async fillTransaction(logger: Logger, transactions: Transaction[]): Promise<PopulatedTransaction[]> {
    if (transactions.length > 0) {
      // Fetch the transactions first
      const transactionsMap = mapTransactionsToDict(transactions);
      return await populateTransactions(databaseInstance, transactionsMap);
    }
    logger.debug('[fillTransaction] Since no transactions were given, no inputs and outputs are looked for');
    return [];
  },
  async findTransactionByHashAndBlock(
    logger: Logger,
    hash: string,
    blockNumber: number,
    blockHash: string
  ): Promise<PopulatedTransaction | null> {
    logger.debug(
      `[findTransactionByHashAndBlock] Parameters received for run query 
      blockNumber: ${blockNumber}, blockHash: ${blockHash}`
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
      const transactionsMap = mapTransactionsToDict(parseTransactionRows(result));
      const [transaction] = await populateTransactions(databaseInstance, transactionsMap);
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
    const parameters = [address, hashStringToBuffer(blockHash)];
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
  },
  async findBalanceByAddressAndBlock(logger: Logger, address, blockHash): Promise<string> {
    const parameters = [address, hashStringToBuffer(blockHash)];
    logger.debug(
      { address, blockHash },
      '[findBalanceByAddressAndBlock] About to run findBalanceByAddressAndBlock query with parameters:'
    );
    const result: QueryResult<FindBalance> = await databaseInstance.query(
      Queries.findBalanceByAddressAndBlock,
      parameters
    );
    logger.debug(`[findBalanceByAddressAndBlock] Found a balance of ${result.rows[0].balance}`);

    return result.rows[0].balance;
  }
});
