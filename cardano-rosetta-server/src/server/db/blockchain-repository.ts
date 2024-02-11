import { Logger } from 'fastify';
import moment from 'moment';
import { Pool, QueryResult } from 'pg';
import {
  Block,
  FindTransaction,
  FindTransactionWithToken,
  GenesisBlock,
  PolicyId,
  PopulatedTransaction,
  Token,
  Transaction,
  TransactionCount,
  TransactionInOut,
  TransactionPoolRegistrations,
  Utxo,
  MaBalance,
  TotalCount,
  SearchFilters,
  ProtocolParameters
} from '../models';
import {
  hexStringToBuffer,
  hexFormatter,
  isEmptyHexString,
  remove0xPrefix,
  coinIdentifierFormatter
} from '../utils/formatters';
import Queries, {
  FindBalance,
  FindTransactionDelegations,
  FindTransactionDeregistrations,
  FindTransactionFieldResult,
  FindTransactionInOutResult,
  FindTransactionRegistrations,
  FindTransactionsInputs,
  FindTransactionsOutputs,
  FindTransactionPoolRegistrationsData,
  FindTransactionPoolRelays,
  FindTransactionPoolOwners,
  FindTransactionWithdrawals,
  FindTransactionMetadata,
  FindPoolRetirements,
  FindUtxo,
  FindMaBalance
} from './queries/blockchain-queries';
import { generateComposedQuery } from './queries/search-transactions-queries';
import { ADA, CatalystDataIndexes, CatalystSigIndexes, OperatorType } from '../utils/constants';
import {
  isVoteDataValid,
  isVoteSignatureValid,
  validateAndGetStatus,
  validateTransactionCoinMatch,
  validateAccountIdAddressMatch,
  validateOperationType,
  validateCurrencies
} from '../utils/validations';
import { getAddressFromHexString } from '../utils/cardano/addresses';
import { usingAutoFree } from '../utils/freeable';

type TransactionsMap = NodeJS.Dict<PopulatedTransaction>;

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
   * Get the protocol parameters
   */
  getProtocolParameters(logger: Logger): Promise<Components.Schemas.ProtocolParameters>;

  /**
   * Returns an array containing all utxo for address till block identified by blockIdentifier if present, else the last
   * @param address account's address to count balance
   * @param blockIdentifier block information, when value is not undefined balance should be count till requested block
   */
  findUtxoByAddressAndBlock(
    logger: Logger,
    address: string,
    blockHash: string,
    currencies?: Components.Schemas.Currency[]
  ): Promise<Utxo[]>;

  /**
   * Returns an array containing all multi asset balances for the provided address till block identified by
   * blockIdentifier is present. Otherwise, it returns the last one.
   * @param address account's address to count balance
   * @param blockIdentifier block information, when value is not undefined balance should be count till requested block
   */
  findMultiAssetByAddressAndBlock(logger: Logger, address: string, blockHash: string): Promise<MaBalance[]>;
  /**
   * Returns the balance for address till block identified by blockIdentifier if present, else the last
   * @param address account's address to count balance
   * @param blockIdentifier block information, when value is not undefined balance should be count till requested block
   */
  findBalanceByAddressAndBlock(logger: Logger, address: string, blockHash: string): Promise<string>;
  /**
   * Returns if any, the transactions matches the requested filters
   * @param filters conditions to filter transactions by
   */
  findTransactionsByFilters(
    logger: Logger,
    parameters: Components.Schemas.SearchTransactionsRequest,
    limit: number,
    offset: number
  ): Promise<TransactionCount>;
}

/**
 * Maps from a transaction query result to a Transaction Array
 */
const parseTransactionRows = (result: QueryResult<FindTransaction>): Transaction[] =>
  result.rows.map(row => ({
    hash: hexFormatter(row.hash),
    blockHash: hexFormatter(row.blockHash),
    blockNo: row.blockNo,
    fee: row.fee,
    size: row.size,
    scriptSize: row.scriptSize,
    validContract: row.validContract
  }));

/**
 * Maps from a total count query result to a number
 */
const parseTotalCount = (result: QueryResult<TotalCount>): number => result.rows[0].totalCount;

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
        blockNo: transaction.blockNo,
        fee: transaction.fee,
        size: transaction.size,
        scriptSize: transaction.scriptSize,
        validContract: transaction.validContract,
        inputs: [],
        outputs: [],
        withdrawals: [],
        registrations: [],
        deregistrations: [],
        delegations: [],
        poolRegistrations: [],
        poolRetirements: [],
        voteRegistrations: []
      }
    };
  }, {});

const mapToTransactionPoolRegistrations = (
  poolRegistrations: FindTransactionPoolRegistrationsData[],
  poolOwners: FindTransactionPoolOwners[],
  poolRelays: FindTransactionPoolRelays[]
): TransactionPoolRegistrations[] =>
  poolRegistrations.map(poolRegistration => {
    const owners = poolOwners.filter(owner => owner.updateId === poolRegistration.updateId).map(o => o.owner);

    const relays = poolRelays
      .filter(relay => relay.updateId === poolRegistration.updateId)
      .map(r => ({
        ipv4: r.ipv4,
        ipv6: r.ipv6,
        dnsName: r.dnsName,
        port: r.port
      }));
    return {
      txHash: poolRegistration.txHash,
      vrfKeyHash: poolRegistration.vrfKeyHash,
      pledge: poolRegistration.pledge,
      margin: poolRegistration.margin,
      cost: poolRegistration.cost,
      address: poolRegistration.address,
      poolHash: poolRegistration.poolHash,
      owners,
      relays,
      metadataUrl: poolRegistration.metadataUrl,
      metadataHash: poolRegistration.metadataHash
    };
  });

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
 * Checks if operation has a token
 * @param  {FindTransactionInOutResult} operation
 * @returns operationisFindTransactionWithToken
 */
const hasToken = (operation: FindTransactionInOutResult): operation is FindTransactionWithToken =>
  operation.policy !== null && operation.name !== null && operation.quantity !== null;

const tryAddToken = <T extends TransactionInOut>(inOut: T, findResult: FindTransactionInOutResult): T => {
  if (hasToken(findResult)) {
    const { policy, name, quantity } = findResult;
    const policyAsHex = hexFormatter(policy);
    const nameAsHex = hexFormatter(name);
    const tokenBundle = inOut.tokenBundle ?? { tokens: new Map<PolicyId, Token[]>() };
    if (!tokenBundle.tokens.has(policyAsHex)) {
      tokenBundle.tokens.set(policyAsHex, []);
    }
    tokenBundle.tokens.get(policyAsHex)?.push({ name: nameAsHex, quantity });

    return {
      ...inOut,
      tokenBundle
    };
  }
  return inOut;
};

/**
 * Input and output information to be queries from the db is quite similar and,
 * in both cases, multi assets needs to processed.
 *
 * This function, if properly configured, processes both cases and updates the
 * proper collection accordingly.
 *
 * @param row query result row to be processed
 * @param transaction to be populated
 * @param getCollection returns the input or output collection
 * @param createInstance created a new instance of TransactionInput or TransactionOutput
 * @param updateCollection properly sets the collection into the PopulatedTransactionObject
 */
const parseInOutRow = <T extends TransactionInOut, F extends FindTransactionInOutResult>(
  row: F,
  transaction: PopulatedTransaction,
  getCollection: (transaction: PopulatedTransaction) => T[],
  createInstance: (queryResult: F) => T,
  updateCollection: (populatedTransaction: PopulatedTransaction, collection: T[]) => PopulatedTransaction
): PopulatedTransaction => {
  // Get the collection where the input or output is stored
  const collection = getCollection(transaction);
  // Look for it in case it already exists. This is the case when there are multi-assets associated
  // to the same output so several rows will be returned for the same input or output
  const index = collection.findIndex(index_ => index_.id === row.id);
  if (index !== -1) {
    // If it exists, it means that several MA were returned so we need to try to add the token
    const updated = tryAddToken(collection[index], row);
    // Proper item is updated in a copy of he collection
    const newCollection = [...collection];
    newCollection[index] = updated;
    // Collection is updated in the PopulatedTransaction and then returned
    return updateCollection(
      {
        ...transaction
      },
      newCollection
    );
  }
  // If it's a new input or output create an instance
  const newInstance = createInstance(row);
  // Then we try to populate it's token if any
  const newInOut = tryAddToken(newInstance, row);
  return updateCollection(
    {
      ...transaction
    },
    collection.concat(newInOut)
  );
};

/**
 * Updates the transaction inputs
 *
 * @param populatedTransaction
 * @param input
 */
const parseInputsRow = (
  populatedTransaction: PopulatedTransaction,
  input: FindTransactionsInputs
): PopulatedTransaction =>
  parseInOutRow(
    input,
    populatedTransaction,
    transaction => transaction.inputs,
    queryResult => ({
      id: queryResult.id,
      address: queryResult.address,
      value: queryResult.value,
      sourceTransactionHash: hexFormatter(queryResult.sourceTxHash),
      sourceTransactionIndex: queryResult.sourceTxIndex
    }),
    (updatedTransaction, updatedCollection) => ({ ...updatedTransaction, inputs: updatedCollection })
  );

/**
 * Parses a pool retirement row into a pool retirement object
 *
 * @param transaction
 * @param deregistration
 */
const parsePoolRetirementRow = (
  transaction: PopulatedTransaction,
  poolRetirement: FindPoolRetirements
): PopulatedTransaction => ({
  ...transaction,
  poolRetirements: transaction.poolRetirements.concat({
    epoch: poolRetirement.epoch,
    address: hexFormatter(poolRetirement.address)
  })
});

/**
 * Parses a vote row into a vote object
 *
 * @param transaction
 * @param vote
 */
const parseVoteRow = (transaction: PopulatedTransaction, metadata: FindTransactionMetadata): PopulatedTransaction =>
  usingAutoFree(scope => {
    const { data, signature } = metadata;
    if (isVoteDataValid(data) && isVoteSignatureValid(signature)) {
      const rewardAddress = getAddressFromHexString(scope, remove0xPrefix(data[CatalystDataIndexes.REWARD_ADDRESS]));
      if (rewardAddress !== undefined) {
        const votingKey = remove0xPrefix(data[CatalystDataIndexes.VOTING_KEY]);
        const stakeKey = remove0xPrefix(data[CatalystDataIndexes.STAKE_KEY]);
        const votingNonce = data[CatalystDataIndexes.VOTING_NONCE];
        const votingSignature = remove0xPrefix(signature[CatalystSigIndexes.VOTING_SIGNATURE]);
        return {
          ...transaction,
          voteRegistrations: transaction.voteRegistrations.concat({
            votingKey,
            stakeKey,
            rewardAddress: rewardAddress.to_bech32(),
            votingNonce,
            votingSignature
          })
        };
      }
    }
    return transaction;
  });

/**
 * Updates the transaction appending outputs
 *
 * @param populatedTransaction
 * @param output
 */
const parseOutputsRow = (
  populatedTransaction: PopulatedTransaction,
  output: FindTransactionsOutputs
): PopulatedTransaction =>
  parseInOutRow(
    output,
    populatedTransaction,
    transaction => transaction.outputs,
    queryResult => ({
      id: queryResult.id,
      address: queryResult.address,
      value: queryResult.value,
      index: queryResult.index
    }),
    (updatedTransaction, updatedCollection) => ({ ...updatedTransaction, outputs: updatedCollection })
  );

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

const parsePoolRegistrationsRows = (
  transaction: PopulatedTransaction,
  poolRegistration: TransactionPoolRegistrations
): PopulatedTransaction => ({
  ...transaction,
  poolRegistrations: transaction.poolRegistrations.concat({
    vrfKeyHash: hexFormatter(poolRegistration.vrfKeyHash),
    pledge: poolRegistration.pledge,
    margin: poolRegistration.margin,
    cost: poolRegistration.cost,
    address: hexFormatter(poolRegistration.address),
    poolHash: hexFormatter(poolRegistration.poolHash),
    owners: poolRegistration.owners.map(o => hexFormatter(o)),
    relays: poolRegistration.relays,
    metadataUrl: poolRegistration.metadataUrl,
    metadataHash: poolRegistration.metadataHash ? hexFormatter(poolRegistration.metadataHash) : undefined
  })
});

const populateTransactions = async (
  databaseInstance: Pool,
  transactionsMap: TransactionsMap
): Promise<PopulatedTransaction[]> => {
  const transactionsHashes = Object.keys(transactionsMap).map(element => hexStringToBuffer(element));
  const operationsQueries = [
    Queries.findTransactionsInputs,
    Queries.findTransactionsOutputs,
    Queries.findTransactionWithdrawals,
    Queries.findTransactionRegistrations,
    Queries.findTransactionDeregistrations,
    Queries.findTransactionDelegations,
    Queries.findTransactionMetadata,
    Queries.findTransactionPoolRegistrationsData,
    Queries.findTransactionPoolOwners,
    Queries.findTransactionPoolRelays,
    Queries.findPoolRetirements
  ];
  const [
    inputs,
    outputs,
    withdrawals,
    registrations,
    deregistrations,
    delegations,
    votes,
    poolsData,
    poolsOwners,
    poolsRelays,
    poolRetirements
  ] = await Promise.all(
    operationsQueries.map(operationQuery => databaseInstance.query(operationQuery, [transactionsHashes]))
  );
  transactionsMap = populateTransactionField(transactionsMap, inputs.rows, parseInputsRow);
  transactionsMap = populateTransactionField(transactionsMap, outputs.rows, parseOutputsRow);
  transactionsMap = populateTransactionField(transactionsMap, withdrawals.rows, parseWithdrawalsRow);
  transactionsMap = populateTransactionField(transactionsMap, registrations.rows, parseRegistrationsRow);
  transactionsMap = populateTransactionField(transactionsMap, deregistrations.rows, parseDeregistrationsRow);
  transactionsMap = populateTransactionField(transactionsMap, delegations.rows, parseDelegationsRow);
  transactionsMap = populateTransactionField(transactionsMap, poolRetirements.rows, parsePoolRetirementRow);
  transactionsMap = populateTransactionField(transactionsMap, votes.rows, parseVoteRow);

  const mappedPoolRegistrations = mapToTransactionPoolRegistrations(poolsData.rows, poolsOwners.rows, poolsRelays.rows);
  transactionsMap = populateTransactionField(transactionsMap, mappedPoolRegistrations, parsePoolRegistrationsRows);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore it will never be undefined
  return Object.values(transactionsMap);
};

export const configure = (databaseInstance: Pool): BlockchainRepository => ({
  async findBlock(logger: Logger, blockNumber?: number, blockHash?: string): Promise<Block | null> {
    const query = Queries.findBlock(blockNumber, blockHash);
    logger.debug(`[findBlock] Parameters received for run query blockNumber: ${blockNumber}, blockHash: ${blockHash}`);
    // Add paramter or short-circuit it
    const parameters = [blockNumber ?? true, blockHash ? hexStringToBuffer(blockHash) : true];
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
    const parameters = [blockNumber ?? true, blockHash ? hexStringToBuffer(blockHash) : true];
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
    const parameters = [hexStringToBuffer(hash), Number(blockNumber), hexStringToBuffer(blockHash)];
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

  async getProtocolParameters(logger: Logger): Promise<Components.Schemas.ProtocolParameters> {
    logger.debug('[getLinearFeeParameters] About to run findProtocolParameters query');
    const result: QueryResult<ProtocolParameters> = await databaseInstance.query(Queries.findProtocolParameters);
    return {
      coinsPerUtxoSize: result.rows[0].coins_per_utxo_size || '0',
      maxTxSize: result.rows[0].max_tx_size,
      maxValSize: result.rows[0].max_val_size || 0,
      keyDeposit: result.rows[0].key_deposit,
      maxCollateralInputs: result.rows[0].max_collateral_inputs || 0,
      minFeeCoefficient: result.rows[0].min_fee_a,
      minFeeConstant: result.rows[0].min_fee_b,
      minPoolCost: result.rows[0].min_pool_cost,
      poolDeposit: result.rows[0].pool_deposit,
      protocol: result.rows[0].protocol_major
    };
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
  async findUtxoByAddressAndBlock(logger: Logger, address, blockHash, currencies): Promise<Utxo[]> {
    const parameters = [address, hexStringToBuffer(blockHash)];
    logger.debug(
      { address, blockHash },
      '[findUtxoByAddressAndBlock] About to run findUtxoByAddressAndBlock query with parameters:'
    );
    const currenciesIds = currencies?.map(c => ({
      symbol: isEmptyHexString(c.symbol) ? '' : c.symbol,
      policy: c.metadata?.policyId
    }));
    const result: QueryResult<FindUtxo> = await databaseInstance.query(
      Queries.findUtxoByAddressAndBlock(currenciesIds),
      parameters
    );
    logger.debug(`[findUtxoByAddressAndBlock] Found ${result.rowCount} utxos`);
    return result.rows.map(utxo => ({
      value: utxo.value,
      transactionHash: hexFormatter(utxo.txHash),
      index: utxo.index,
      name: utxo.name ? hexFormatter(utxo.name) : utxo.name,
      policy: utxo.policy ? hexFormatter(utxo.policy) : utxo.policy,
      quantity: utxo.quantity
    }));
  },
  async findMultiAssetByAddressAndBlock(logger: Logger, address, blockHash): Promise<MaBalance[]> {
    const parameters = [address, hexStringToBuffer(blockHash)];
    const balancesResult: QueryResult<FindMaBalance> = await databaseInstance.query(
      Queries.findMaBalanceByAddressAndBlock,
      parameters
    );
    logger.debug(`[findMultiAssetByAddressAndBlock] Found balances for ${balancesResult.rowCount} multi assets`);
    return balancesResult.rows.map(multiAssetBalance => ({
      name: multiAssetBalance?.name && hexFormatter(multiAssetBalance.name),
      policy: multiAssetBalance?.policy && hexFormatter(multiAssetBalance.policy),
      value: multiAssetBalance.value
    }));
  },
  async findBalanceByAddressAndBlock(logger: Logger, address, blockHash): Promise<string> {
    const parameters = [address, hexStringToBuffer(blockHash)];
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
  },
  async findTransactionsByFilters(
    logger: Logger,
    conditions: Components.Schemas.SearchTransactionsRequest,
    limit: number,
    offset: number
  ): Promise<TransactionCount> {
    logger.debug('[findTransactionsByConditions] Conditions received to run the query ', {
      conditions
    });
    const {
      type,
      status,
      success,
      operator,
      currency,
      max_block,
      address,
      account_identifier,
      coin_identifier,
      transaction_identifier
    } = conditions;
    const coinIdentifier = coinIdentifierFormatter(coin_identifier?.identifier);
    const transactionHash = transaction_identifier?.hash;
    const conditionsToQueryBy: SearchFilters = {
      maxBlock: max_block,
      operator: operator ?? OperatorType.AND,
      type,
      coinIdentifier,
      status: validateAndGetStatus(status, success),
      transactionHash,
      limit,
      offset,
      address: address || account_identifier?.address
    };
    validateTransactionCoinMatch(transactionHash, coinIdentifier);
    validateAccountIdAddressMatch(address, account_identifier);
    type && validateOperationType(type);
    if (currency && currency.symbol !== ADA) {
      validateCurrencies([currency]);
      const currencyId = {
        symbol: isEmptyHexString(currency.symbol) ? '' : currency.symbol,
        policy: currency.metadata?.policyId
      };
      conditionsToQueryBy.currencyIdentifier = currencyId;
    }
    const { data: dataQuery, count: totalCountQuery } = generateComposedQuery(conditionsToQueryBy);
    logger.debug('[findTransactionsByConditions] About to search transactions');
    const parameters = [];
    if (transactionHash || coinIdentifier)
      parameters.push(transactionHash ? hexStringToBuffer(transactionHash) : hexStringToBuffer(coinIdentifier!.hash));
    const result: QueryResult<FindTransaction> = await databaseInstance.query(dataQuery, parameters);
    logger.debug(`[findTransactionsByConditions] Found ${result.rowCount} transactions`);
    const totalCountResult: QueryResult<TotalCount> = await databaseInstance.query(totalCountQuery, parameters);
    const totalCount = parseTotalCount(totalCountResult);
    logger.debug('[findTransactionsByConditions] Total count obtained ', totalCount);
    if (result.rows.length > 0) {
      return {
        transactions: parseTransactionRows(result),
        totalCount
      };
    }
    return {
      transactions: [],
      totalCount
    };
  }
});
