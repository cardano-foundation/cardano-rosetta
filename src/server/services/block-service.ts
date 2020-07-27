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
import { triggerAsyncId } from 'async_hooks';

/* eslint-disable camelcase */
export interface BlockService {
  block(request: Components.Schemas.BlockRequest): Promise<Components.Schemas.BlockResponse | Components.Schemas.Error>;
  blockTransaction(
    request: Components.Schemas.BlockTransactionRequest
  ): Promise<Components.Schemas.BlockTransactionResponse | Components.Schemas.Error>;
  getGenesisBlock(): Promise<GenesisBlock>;
  getLatestBlock(): Promise<Block>;
  findBalanceByAddressAndBlock(address: string, blockHash: string): Promise<string>;
  findUtxoByAddressAndBlock(address: string, blockHash: string): Promise<Utxo[]>;
  findBlock(blockIdentifier: PartialBlockIdentifier): Promise<Block | null>;
}

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
  network_index?: number
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
  related_operations: relatedOperations
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
      output.index
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
  networkRepository: NetworkRepository
): BlockService => ({
  async findBlock(blockIdentifier) {
    // cardano doesn't have block zero but we need to map it to genesis
    const searchBlockZero = blockIdentifier.index === 0; // We need to manually check for the block hash if sent to server
    if (searchBlockZero) {
      const genesis = await repository.findGenesisBlock();
      const isHashInvalidIfGiven = blockIdentifier.hash && genesis?.hash !== blockIdentifier.hash;
      if (isHashInvalidIfGiven) {
        throw ErrorFactory.blockNotFoundError();
      }
      return repository.findBlock(undefined, genesis?.hash);
    }

    const searchLatestBlock = blockIdentifier.hash === undefined && blockIdentifier.index === undefined;
    const blockNumber = searchLatestBlock ? await repository.findLatestBlockNumber() : blockIdentifier.index;
    return repository.findBlock(blockNumber, blockIdentifier.hash);
  },
  async block(request) {
    // cardano doesn't have block zero but we need to map it to genesis
    let block;
    if (request.block_identifier.index === 0) {
      block = await this.getGenesisBlock();
      // We need to manually check for the block index if sent on the request
      const isHashInvalidIfGiven = request.block_identifier.hash && block.hash !== request.block_identifier.hash;
      if (isHashInvalidIfGiven) {
        throw ErrorFactory.blockNotFoundError();
      }
    }
    block = await this.findBlock(request.block_identifier);
    if (block !== null) {
      // This condition is needed as genesis tx count for mainnet is zero
      const blockContainsTransactions = block.transactionsCount !== 0 || block.previousBlockHash === block.hash;
      let transactions: TransactionWithInputsAndOutputs[] = [];
      if (blockContainsTransactions) {
        const { number, hash } = block;
        const transactionsFound = await repository.findTransactionsByBlock(number, hash);
        if (transactionsFound.length > PAGE_SIZE) {
          return {
            block: mapToRosettaBlock(block, []),
            other_transactions: transactionsFound.map(transaction => ({
              hash: transaction.hash
            }))
          };
        }
        transactions = await repository.fillTransaction(transactionsFound);
      }
      return {
        block: mapToRosettaBlock(block, transactions)
      };
    }
    throw ErrorFactory.blockNotFoundError();
  },
  async getLatestBlock() {
    const latestBlockNumber = await repository.findLatestBlockNumber();
    const latestBlock = await repository.findBlock(latestBlockNumber);
    if (!latestBlock) throw ErrorFactory.blockNotFoundError();
    return latestBlock;
  },
  async getGenesisBlock() {
    const latestBlock = await repository.findGenesisBlock();
    if (!latestBlock) throw ErrorFactory.genesisBlockNotFound();
    return latestBlock;
  },
  async findBalanceByAddressAndBlock(address, blockHash) {
    return await repository.findBalanceByAddressAndBlock(address, blockHash);
  },
  async findUtxoByAddressAndBlock(address, blockHash) {
    return await repository.findUtxoByAddressAndBlock(address, blockHash);
  },
  blockTransaction: async blockTransactionRequest =>
    withNetworkValidation(
      blockTransactionRequest.network_identifier,
      networkRepository,
      blockTransactionRequest,
      async () => {
        const transaction = await repository.findTransactionByHash(blockTransactionRequest.transaction_identifier.hash);
        if (transaction === null) {
          throw ErrorFactory.transactionNotFound();
        }
        return {
          transaction: mapToRosettaTransaction(transaction)
        };
      }
    )
});

export default configure;
