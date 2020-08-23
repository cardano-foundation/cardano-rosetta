import { Logger } from 'fastify';
import {
  Block,
  BlockchainRepository,
  GenesisBlock,
  Transaction,
  TransactionWithInputsAndOutputs,
  Utxo
} from '../db/blockchain-repository';
import { ErrorFactory } from '../utils/errors';

export interface BlockUtxos {
  block: Block;
  utxos: Utxo[];
}

/* eslint-disable camelcase */
export interface BlockService {
  findBlock(logger: Logger, number?: number, hash?: string): Promise<Block | null>;
  findTransactionsByBlock(logger: Logger, block: Block): Promise<Transaction[]>;
  fillTransactions(logger: Logger, transactions: Transaction[]): Promise<TransactionWithInputsAndOutputs[]>;
  findTransaction(
    logger: Logger,
    transactionHash: string,
    blockNumber: number,
    blockHash: string
  ): Promise<TransactionWithInputsAndOutputs | null>;
  getGenesisBlock(logger: Logger): Promise<GenesisBlock>;
  getLatestBlock(logger: Logger): Promise<Block>;
  findUtxoByAddressAndBlock(logger: Logger, address: string, number?: number, hash?: string): Promise<BlockUtxos>;
}

export interface BlockFindResult {
  block: Block;
  transactions: TransactionWithInputsAndOutputs[];
  transactionHashes: string[];
}

const configure = (repository: BlockchainRepository): BlockService => ({
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
  fillTransactions(logger: Logger, transactions): Promise<TransactionWithInputsAndOutputs[]> {
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
  async findUtxoByAddressAndBlock(logger, address, number, hash) {
    const block = await this.findBlock(logger, number, hash);
    if (block === null) {
      logger.error('[findUtxoByAddressAndBlock] Block not found');
      throw ErrorFactory.blockNotFoundError();
    }
    logger.info(`[findUtxoByAddressAndBlock] Looking for utxos for address ${address} and block ${block.hash}`);
    const utxoDetails = await repository.findUtxoByAddressAndBlock(logger, address, block.hash);
    logger.debug(
      utxoDetails,
      `[findUtxoByAddressAndBlock] Found ${utxoDetails.length} utxo details for address ${address}`
    );
    return {
      block,
      utxos: utxoDetails
    };
  },
  findTransaction(logger, transactionHash, blockNumber, blockHash) {
    return repository.findTransactionByHashAndBlock(logger, transactionHash, blockNumber, blockHash);
  }
});

export default configure;
