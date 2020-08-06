import { Logger } from 'fastify';
import {
  BlockchainRepository,
  TransactionWithInputsAndOutputs,
  Block,
  Utxo,
  PartialBlockIdentifier,
  GenesisBlock
} from '../db/blockchain-repository';
import { ErrorFactory } from '../utils/errors';
import { SUCCESS_STATUS, TRANSFER_OPERATION_TYPE } from '../utils/constants';
import { withNetworkValidation } from './utils/services-helper';
import { NetworkRepository } from '../db/network-repository';

/* eslint-disable camelcase */
export interface BlockService {
  block(request: Components.Schemas.BlockRequest): Promise<Components.Schemas.BlockResponse | Components.Schemas.Error>;
  blockTransaction(
    request: Components.Schemas.BlockTransactionRequest
  ): Promise<Components.Schemas.BlockTransactionResponse | Components.Schemas.Error>;
  getGenesisBlock(): Promise<GenesisBlock>;
  getLatestBlock(): Promise<Block>;
  findUtxoByAddressAndBlock(address: string, blockHash: string): Promise<Utxo[]>;
  findBlock(blockIdentifier: PartialBlockIdentifier): Promise<Block | null>;
}

const COIN_CREATED_ACTION = 'coin_created';

/**
 * Creates a Rosetta operation for the given information ready to be consumed by clients
 *
 * @param index
 * @param type
 * @param status
 * @param address
 * @param value
 * @param relatedOperations
 */
const createOperation = (
  index: number,
  type: string,
  status: string,
  address: string,
  value: string,
  relatedOperations?: Components.Schemas.OperationIdentifier[],
  network_index?: number,
  coin_change?: Components.Schemas.CoinChange
  // eslint-disable-next-line max-params
): Components.Schemas.Operation => ({
  operation_identifier: {
    index,
    network_index
  },
  type,
  status,
  account: {
    address
  },
  amount: {
    value,
    currency: {
      symbol: 'ADA',
      decimals: 6
    }
  },
  coin_change,
  related_operations: relatedOperations
});

const getCoinChange = (index: number, hash: string): Components.Schemas.CoinChange => ({
  coin_identifier: {
    identifier: `${hash}:${index}`
  },
  coin_action: COIN_CREATED_ACTION
});

/**
 * Converts a Cardano Transaction into a Rosetta one
 *
 * @param transaction to be mapped
 */
const mapToRosettaTransaction = (transaction: TransactionWithInputsAndOutputs): Components.Schemas.Transaction => {
  const inputsAsOperations = transaction.inputs.map((input, index) =>
    createOperation(index, TRANSFER_OPERATION_TYPE, SUCCESS_STATUS, input.address, `-${input.value}`)
  );
  // Output related operations are all the inputs.This will iterate over the collection again
  // but it's better for the sake of clarity and tx are bounded by block size (it can be
  // refactored to use a reduce)
  const relatedOperations = inputsAsOperations.map(input => ({
    index: input.operation_identifier.index
  }));
  const outputsAsOperations = transaction.outputs.map((output, index) =>
    createOperation(
      inputsAsOperations.length + index,
      TRANSFER_OPERATION_TYPE,
      SUCCESS_STATUS,
      output.address,
      output.value,
      relatedOperations,
      output.index,
      getCoinChange(output.index, transaction.hash)
    )
  );

  return {
    transaction_identifier: {
      hash: transaction.hash
    },
    operations: inputsAsOperations.concat(outputsAsOperations)
  };
};

/**
 * Returns a Rosetta block based on a Cardano block and it's transactions
 *
 * @param block cardano block
 * @param transactions cardano transactions for the given block
 */
const mapToRosettaBlock = (
  block: Block,
  transactions: TransactionWithInputsAndOutputs[]
): Components.Schemas.Block => ({
  block_identifier: {
    hash: block.hash,
    index: block.number
  },
  parent_block_identifier: {
    index: block.previousBlockNumber,
    hash: block.previousBlockHash
  },
  timestamp: block.createdAt,
  metadata: {
    transactionsCount: block.transactionsCount,
    createdBy: block.createdBy,
    size: block.size,
    epochNo: block.epochNo,
    slotNo: block.slotNo
  },
  transactions: transactions.map(mapToRosettaTransaction)
});

const configure = (
  repository: BlockchainRepository,
  PAGE_SIZE: number,
  networkRepository: NetworkRepository,
  logger: Logger
): BlockService => ({
  async findBlock(blockIdentifier) {
    logger.info({ blockIdentifier }, '[findBlock] Looking for block:');
    // cardano doesn't have block zero but we need to map it to genesis
    const searchBlockZero = blockIdentifier.index === 0; // We need to manually check for the block hash if sent to server
    logger.info(`[findBlock] Do we have to look for genesisBlock? ${searchBlockZero}`);
    if (searchBlockZero) {
      logger.info('[findBlock] Looking for genesis block');
      const genesis = await repository.findGenesisBlock();
      const isHashInvalidIfGiven = blockIdentifier.hash && genesis?.hash !== blockIdentifier.hash;
      if (isHashInvalidIfGiven) {
        logger.error('[findBlock] The requested block has an invalid block hash parameter');
        throw ErrorFactory.blockNotFoundError();
      }
      return repository.findBlock(undefined, genesis?.hash);
    }
    const searchLatestBlock = blockIdentifier.hash === undefined && blockIdentifier.index === undefined;
    logger.info(`[findBlock] Do we have to look for latestBlock? ${searchLatestBlock}`);
    const blockNumber = searchLatestBlock ? await repository.findLatestBlockNumber() : blockIdentifier.index;
    logger.info(`[findBlock] Looking for block with blockNumber ${blockNumber}`);
    const response = await repository.findBlock(blockNumber, blockIdentifier.hash);
    logger.info('[findBlock] Block was found');
    logger.debug({ response }, '[findBlock] Returning response:');
    return response;
  },
  async block(request) {
    const blockIdentifier = request.block_identifier;
    logger.info({ blockIdentifier }, '[block] Looking for block');
    const block = await this.findBlock(blockIdentifier);
    if (block !== null) {
      logger.info('[block] Block was found');
      // This condition is needed as genesis tx count for mainnet is zero
      const blockContainsTransactions = block.transactionsCount !== 0 || block.previousBlockHash === block.hash;
      let transactions: TransactionWithInputsAndOutputs[] = [];
      logger.debug(`[block] Does requested block contains transactions? ${blockContainsTransactions}`);
      if (blockContainsTransactions) {
        const { number, hash } = block;
        const transactionsFound = await repository.findTransactionsByBlock(number, hash);
        if (transactionsFound.length > PAGE_SIZE) {
          logger.info('[block] Returning only transactions hashes since the number of them is bigger than PAGE_SIZE');
          return {
            block: mapToRosettaBlock(block, []),
            other_transactions: transactionsFound.map(transaction => ({
              hash: transaction.hash
            }))
          };
        }
        logger.info('[block] Looking for blocks transactions full data');
        transactions = await repository.fillTransaction(transactionsFound);
      }
      return {
        block: mapToRosettaBlock(block, transactions)
      };
    }
    logger.error(`[block] Block was not found ${request.block_identifier}`);
    throw ErrorFactory.blockNotFoundError();
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
  async findUtxoByAddressAndBlock(address, blockHash) {
    logger.info(`[findUtxoByAddressAndBlock] Looking for utxos for address ${address} and block ${blockHash}`);
    return await repository.findUtxoByAddressAndBlock(address, blockHash);
  },
  blockTransaction: async blockTransactionRequest =>
    withNetworkValidation(
      blockTransactionRequest.network_identifier,
      networkRepository,
      blockTransactionRequest,
      async () => {
        const transactionHash = blockTransactionRequest.transaction_identifier.hash;
        logger.info(
          `[blockTransaction] Looking for transaction for hash ${transactionHash} and block ${blockTransactionRequest.block_identifier}`
        );
        const transaction = await repository.findTransactionByHashAndBlock(
          transactionHash,
          blockTransactionRequest.block_identifier
        );
        if (transaction === null) {
          logger.error('[blockTransaction] No transaction found');
          throw ErrorFactory.transactionNotFound();
        }
        const response = mapToRosettaTransaction(transaction);
        logger.debug({ response }, '[blockTransaction] Returning response ');
        return {
          transaction: response
        };
      },
      logger
    )
});

export default configure;
