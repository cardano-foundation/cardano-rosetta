import { Logger } from 'fastify';
import {
  Block,
  BlockUtxos,
  BlockUtxosMultiAssets,
  BalanceAtBlock,
  GenesisBlock,
  Transaction,
  TransactionCount,
  PopulatedTransaction
} from '../models';
import { ErrorFactory } from '../utils/errors';
import { BlockchainRepository } from '../db/blockchain-repository';
import { CardanoService } from './cardano-services';

/* eslint-disable camelcase */
export interface BlockService {
  /**
   * Finds a block for the given number or hash. If non of them are sent, it will
   * return the latest block
   *
   * @param logger
   * @param number
   * @param hash
   */
  findBlock(logger: Logger, number?: number, hash?: string): Promise<Block | null>;

  /**
   * Returns teh transactions for the given Block. It doesn't return the transactions
   * input and outputs, to do so please see {fillTransactions}
   *
   * @param logger
   * @param block
   */
  findTransactionsByBlock(logger: Logger, block: Block): Promise<Transaction[]>;

  /**
   * Returns transactions alongside with it's inputs and outputs
   * @param logger
   * @param transactions
   */
  fillTransactions(logger: Logger, transactions: Transaction[]): Promise<PopulatedTransaction[]>;

  /**
   * Looks for a transaction based on it's hash but also on the block it's supposed to
   * be contained. It will return an error if not found.
   *
   * @param logger
   * @param transactionHash
   * @param blockNumber
   * @param blockHash
   */
  findTransaction(
    logger: Logger,
    transactionHash: string,
    blockNumber: number,
    blockHash: string
  ): Promise<PopulatedTransaction | null>;

  /**
   * Returns the genesis block.
   *
   * @param logger
   */
  getGenesisBlock(logger: Logger): Promise<GenesisBlock>;

  /**
   * Returns the best block (tip of the chain)
   * @param logger
   */
  getLatestBlock(logger: Logger): Promise<Block>;

  /**
   * Returns the unspents for a given address at a certain block.
   *
   * @param logger
   * @param address
   * @param number
   * @param hash
   */
  findBalanceDataByAddressAndBlock(
    logger: Logger,
    address: string,
    number?: number,
    hash?: string
  ): Promise<BlockUtxosMultiAssets | BalanceAtBlock>;

  /**
   * Returns the coins for a given address.
   *
   * @param logger
   * @param address
   */
  findCoinsDataByAddress(
    logger: Logger,
    address: string,
    currencies: Components.Schemas.Currency[]
  ): Promise<BlockUtxos>;

  /**
   * Returns the transactions that matches the given filters
   *
   * @param logger
   * @param filters
   */
  findTransactionsByFilters(
    logger: Logger,
    conditions: Components.Schemas.SearchTransactionsRequest,
    limit: number,
    offset: number
  ): Promise<TransactionCount>;
}

const configure = (repository: BlockchainRepository, cardanoService: CardanoService): BlockService => ({
  async findBlock(logger, number, hash) {
    logger.info({ number, hash }, '[findBlock] Looking for block:');
    // cardano doesn't have block zero but we need to map it to genesis
    const searchBlockZero = number === 0; // We need to manually check for the block hash if sent to server
    logger.info(`[findBlock] Do we have to look for genesisBlock? ${searchBlockZero}`);
    if (searchBlockZero) {
      logger.info('[findBlock] Looking for genesis block');
      const genesis = await repository.findGenesisBlock(logger);
      const isHashInvalidIfGiven = hash && genesis?.hash !== hash;
      if (isHashInvalidIfGiven) {
        logger.error('[findBlock] The requested block has an invalid block hash parameter');
        throw ErrorFactory.blockNotFoundError();
      }
      return repository.findBlock(logger, undefined, genesis?.hash);
    }
    const searchLatestBlock = hash === undefined && number === undefined;
    logger.info(`[findBlock] Do we have to look for latestBlock? ${searchLatestBlock}`);
    const blockNumber = searchLatestBlock ? await repository.findLatestBlockNumber(logger) : number;
    logger.info(`[findBlock] Looking for block with blockNumber ${blockNumber}`);
    const response = await repository.findBlock(logger, blockNumber, hash);
    logger.info('[findBlock] Block was found');
    logger.debug({ response }, '[findBlock] Returning response:');
    return response;
  },
  findTransactionsByBlock(logger, block): Promise<Transaction[]> {
    // This condition is needed as genesis tx count for mainnet is zero
    const blockMightContainTransactions = block.transactionsCount !== 0 || block.previousBlockHash === block.hash;
    logger.debug(
      `[findTransactionsByBlock] Does requested block contains transactions? ${blockMightContainTransactions}`
    );
    if (blockMightContainTransactions) {
      return repository.findTransactionsByBlock(logger, block.number, block.hash);
    }
    return Promise.resolve([]);
  },
  fillTransactions(logger: Logger, transactions): Promise<PopulatedTransaction[]> {
    if (transactions.length === 0) return Promise.resolve([]);
    return repository.fillTransaction(logger, transactions);
  },
  async getLatestBlock(logger: Logger) {
    logger.info('[getLatestBlock] About to look for latest block');
    const latestBlockNumber = await repository.findLatestBlockNumber(logger);
    logger.info(`[getLatestBlock] Latest block number is ${latestBlockNumber}`);
    const latestBlock = await repository.findBlock(logger, latestBlockNumber);
    if (!latestBlock) {
      logger.error('[getLatestBlock] Latest block not found');
      throw ErrorFactory.blockNotFoundError();
    }
    logger.debug({ latestBlock }, '[getLatestBlock] Returning latest block');
    return latestBlock;
  },
  async getGenesisBlock(logger: Logger) {
    logger.info('[getGenesisBlock] About to look for genesis block');
    const genesisBlock = await repository.findGenesisBlock(logger);
    if (!genesisBlock) {
      logger.error('[getGenesisBlock] Genesis block not found');
      throw ErrorFactory.genesisBlockNotFound();
    }
    logger.debug({ genesisBlock }, '[getGenesisBlock] Returning genesis block');
    return genesisBlock;
  },
  async findBalanceDataByAddressAndBlock(logger, address, number, hash) {
    const block = await this.findBlock(logger, number, hash);
    if (block === null) {
      logger.error('[findBalanceDataByAddressAndBlock] Block not found');
      throw ErrorFactory.blockNotFoundError();
    }

    logger.info(`[findBalanceDataByAddressAndBlock] Looking for utxos for address ${address} and block ${block.hash}`);
    if (cardanoService.isStakeAddress(address)) {
      logger.debug(`[findBalanceDataByAddressAndBlock] About to get balance for ${address}`);
      const balance = await repository.findBalanceByAddressAndBlock(logger, address, block.hash);
      logger.debug(
        balance,
        `[findBalanceDataByAddressAndBlock] Found stake balance of ${balance} for address ${address}`
      );
      return {
        block,
        balance
      };
    }
    const utxoDetails = await repository.findUtxoByAddressAndBlock(logger, address, block.hash);
    const maBalances = await repository.findMultiAssetByAddressAndBlock(logger, address, block.hash);
    logger.debug(
      utxoDetails,
      `[findBalanceDataByAddressAndBlock] Found ${utxoDetails.length} utxo details for address ${address}`
    );
    return {
      block,
      utxos: utxoDetails,
      maBalances
    };
  },
  async findCoinsDataByAddress(logger, address, currencies) {
    const block = await this.findBlock(logger);
    if (block === null) {
      logger.error('[findCoinsDataByAddress] Block not found');
      throw ErrorFactory.blockNotFoundError();
    }
    logger.info(
      `[findCoinsDataByAddress] Looking for utxos for address ${address} and ${currencies.length} specified currencies`
    );
    const utxoDetails = await repository.findUtxoByAddressAndBlock(logger, address, block.hash, currencies);
    logger.debug(utxoDetails, `[findCoinsByAddress] Found ${utxoDetails.length} coin details for address ${address}`);
    return {
      block,
      utxos: utxoDetails
    };
  },
  findTransaction(logger, transactionHash, blockNumber, blockHash) {
    return repository.findTransactionByHashAndBlock(logger, transactionHash, blockNumber, blockHash);
  },
  async findTransactionsByFilters(logger, filters, limit, offset) {
    logger.debug(filters, '[findTransactionsByParameters] Looking for transactions with filters');
    const foundTransactions = await repository.findTransactionsByFilters(logger, filters, limit, offset);
    logger.info(`[findTransactionsByParameters] ${foundTransactions} transactions were found`);
    return foundTransactions;
  }
});

export default configure;
