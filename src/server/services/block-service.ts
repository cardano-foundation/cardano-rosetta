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
  findBlock(log: Logger, number?: number, hash?: string): Promise<Block | null>;
  findTransactionsByBlock(log: Logger, block: Block): Promise<Transaction[]>;
  fillTransactions(log: Logger, transactions: Transaction[]): Promise<TransactionWithInputsAndOutputs[]>;
  findTransaction(
    log: Logger,
    transactionHash: string,
    blockNumber: number,
    blockHash: string
  ): Promise<TransactionWithInputsAndOutputs | null>;
  getGenesisBlock(): Promise<GenesisBlock>;
  getLatestBlock(): Promise<Block>;
  findUtxoByAddressAndBlock(log: Logger, address: string, number?: number, hash?: string): Promise<BlockUtxos>;
}

export interface BlockFindResult {
  block: Block;
  transactions: TransactionWithInputsAndOutputs[];
  transactionHashes: string[];
}

const configure = (repository: BlockchainRepository, logger: Logger): BlockService => ({
  async findBlock(log, number, hash) {
    log.info({ number, hash }, '[findBlock] Looking for block:');
    // cardano doesn't have block zero but we need to map it to genesis
    const searchBlockZero = number === 0; // We need to manually check for the block hash if sent to server
    log.info(`[findBlock] Do we have to look for genesisBlock? ${searchBlockZero}`);
    if (searchBlockZero) {
      log.info('[findBlock] Looking for genesis block');
      const genesis = await repository.findGenesisBlock();
      const isHashInvalidIfGiven = hash && genesis?.hash !== hash;
      if (isHashInvalidIfGiven) {
        log.error('[findBlock] The requested block has an invalid block hash parameter');
        throw ErrorFactory.blockNotFoundError();
      }
      return repository.findBlock(undefined, genesis?.hash);
    }
    const searchLatestBlock = hash === undefined && number === undefined;
    log.info(`[findBlock] Do we have to look for latestBlock? ${searchLatestBlock}`);
    const blockNumber = searchLatestBlock ? await repository.findLatestBlockNumber() : number;
    log.info(`[findBlock] Looking for block with blockNumber ${blockNumber}`);
    const response = await repository.findBlock(blockNumber, hash);
    log.info('[findBlock] Block was found');
    log.debug({ response }, '[findBlock] Returning response:');
    return response;
  },
  findTransactionsByBlock(log, block): Promise<Transaction[]> {
    // This condition is needed as genesis tx count for mainnet is zero
    const blockMightContainTransactions = block.transactionsCount !== 0 || block.previousBlockHash === block.hash;
    log.debug(`[findTransactionsByBlock] Does requested block contains transactions? ${blockMightContainTransactions}`);
    if (blockMightContainTransactions) {
      return repository.findTransactionsByBlock(block.number, block.hash);
    }
    return Promise.resolve([]);
  },
  fillTransactions(log: Logger, transactions): Promise<TransactionWithInputsAndOutputs[]> {
    if (transactions.length === 0) return Promise.resolve([]);
    return repository.fillTransaction(transactions);
  },
  async getLatestBlock() {
    logger.info('[getLatestBlock] About to look for latest block');
    const latestBlockNumber = await repository.findLatestBlockNumber();
    logger.info(`[getLatestBlock] Latest block number is ${latestBlockNumber}`);
    const latestBlock = await repository.findBlock(latestBlockNumber);
    if (!latestBlock) {
      logger.error('[getLatestBlock] Latest block not found');
      throw ErrorFactory.blockNotFoundError();
    }
    logger.debug({ latestBlock }, '[getLatestBlock] Returning latest block');
    return latestBlock;
  },
  async getGenesisBlock() {
    logger.info('[getGenesisBlock] About to look for genesis block');
    const genesisBlock = await repository.findGenesisBlock();
    if (!genesisBlock) {
      logger.error('[getGenesisBlock] Genesis block not found');
      throw ErrorFactory.genesisBlockNotFound();
    }
    logger.debug({ genesisBlock }, '[getGenesisBlock] Returning genesis block');
    return genesisBlock;
  },
  async findUtxoByAddressAndBlock(log, address, number, hash) {
    const block = await this.findBlock(log, number, hash);
    if (block === null) {
      log.error('[findUtxoByAddressAndBlock] Block not found');
      throw ErrorFactory.blockNotFoundError();
    }
    log.info(`[findUtxoByAddressAndBlock] Looking for utxos for address ${address} and block ${block.hash}`);
    const utxoDetails = await repository.findUtxoByAddressAndBlock(address, block.hash);
    log.debug(
      utxoDetails,
      `[findUtxoByAddressAndBlock] Found ${utxoDetails.length} utxo details for address ${address}`
    );
    return {
      block,
      utxos: utxoDetails
    };
  },
  findTransaction(log, transactionHash, blockNumber, blockHash) {
    return repository.findTransactionByHashAndBlock(transactionHash, blockNumber, blockHash);
  }
});

export default configure;
