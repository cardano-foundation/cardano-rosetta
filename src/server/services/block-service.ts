import StatusCodes from 'http-status-codes';
import { NotImplementedError } from '../api-error';
import { buildApiError, errorMessage } from '../utils/errors';
import { BlockchainRepository, Transaction, Block, GenesisBlock } from '../db/blockchain-repository';
import { SUCCESS_STATUS, TRANSFER_OPERATION_TYPE } from '../utils/constants';
/* eslint-disable camelcase */
export interface BlockService {
  block(request: Components.Schemas.BlockRequest): Promise<Components.Schemas.BlockResponse | Components.Schemas.Error>;
  blockTransaction(
    request: Components.Schemas.BlockTransactionRequest
  ): Promise<Components.Schemas.BlockTransactionResponse | Components.Schemas.Error>;
  getGenesisBlock(): Promise<GenesisBlock>;
  getLatestBlock(): Promise<Block>;
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
  relatedOperations?: Components.Schemas.OperationIdentifier[]
  // eslint-disable-next-line max-params
): Components.Schemas.Operation => ({
  operation_identifier: {
    index
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
const mapToRosettaTransaction = (transaction: Transaction): Components.Schemas.Transaction => {
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
      relatedOperations
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
const mapToRosettaBlock = (block: Block, transactions: Transaction[]): Components.Schemas.Block => ({
  block_identifier: {
    hash: block.hash,
    index: block.number
  },
  parent_block_identifier: {
    index: block.number === 0 ? 0 : block.number - 1,
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

const configure = (repository: BlockchainRepository): BlockService => ({
  async block(request) {
    const searchLatestBlock =
      request.block_identifier.hash === undefined && request.block_identifier.index === undefined;
    const blockNumber = searchLatestBlock ? await repository.findLatestBlockNumber() : request.block_identifier.index;
    const result = await repository.findBlock(blockNumber, request.block_identifier.hash);
    if (result !== null) {
      const transactions = await repository.findTransactionsByBlock(blockNumber, request.block_identifier.hash);
      return {
        block: mapToRosettaBlock(result, transactions)
      };
    }
    throw buildApiError(StatusCodes.BAD_REQUEST, errorMessage.BLOCK_NOT_FOUND, false);
  },
  async blockTransaction() {
    // As `block` request returns the block with it's transaction, this endpoint
    // shouldn't return any data
    throw new NotImplementedError();
  },
  async getLatestBlock() {
    const latestBlockNumber = await repository.findLatestBlockNumber();
    const latestBlock = await repository.findBlock(latestBlockNumber);
    if (!latestBlock) throw buildApiError(StatusCodes.BAD_REQUEST, errorMessage.BLOCK_NOT_FOUND, false);
    return latestBlock;
  },
  async getGenesisBlock() {
    const latestBlock = await repository.findGenesisBlock();
    if (!latestBlock) throw buildApiError(StatusCodes.BAD_REQUEST, errorMessage.GENESIS_BLOCK_NOT_FOUND, false);
    return latestBlock;
  }
});

export default configure;
