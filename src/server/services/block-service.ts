import StatusCodes from 'http-status-codes';
import { BlockchainRepository, Transaction, Block } from '../db/blockchain-repository';
import { NotImplementedError } from '../api-error';
import { buildApiError, errorMessage } from '../utils/errors';
import { SUCCESS_STATUS, TRANSFER_OPERATION_TYPE } from '../utils/constants';
/* eslint-disable camelcase */
export interface BlockService {
  block(request: Components.Schemas.BlockRequest): Promise<Components.Schemas.BlockResponse | Components.Schemas.Error>;
  blockTransaction(
    request: Components.Schemas.BlockTransactionRequest
  ): Promise<Components.Schemas.BlockTransactionResponse | Components.Schemas.Error>;
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
    const result = searchLatestBlock
      ? await repository.findLatestBlockNumber().then(blockIndex => repository.findBlock(blockIndex))
      : await repository.findBlock(request.block_identifier.index, request.block_identifier.hash);
    if (result !== null) {
      const transactions = await repository.findTransactionsByBlock(
        request.block_identifier.index,
        request.block_identifier.hash
      );
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
  }
});

export default configure;
