import { FastifyRequest } from 'fastify';
import { BlockService } from '../services/block-service';
import { ErrorFactory } from '../utils/errors';
import { mapToRosettaBlock, mapToRosettaTransaction } from '../utils/data-mapper';
import { withNetworkValidation } from './controllers-helper';

export interface BlockController {
  block(
    request: FastifyRequest<unknown, unknown, unknown, unknown, Components.Schemas.BlockRequest>
  ): Promise<Components.Schemas.BlockResponse | Components.Schemas.Error>;
  blockTransaction(
    request: FastifyRequest<unknown, unknown, unknown, unknown, Components.Schemas.BlockTransactionRequest>
  ): Promise<Components.Schemas.BlockTransactionResponse | Components.Schemas.Error>;
}

const configure = (blockService: BlockService, PAGE_SIZE: number, networkId: string): BlockController => ({
  async block(request) {
    const { hash, index } = request.body.block_identifier;

    const log = request.log;

    log.info({ hash, index }, '[block] Looking for block');
    const block = await blockService.findBlock(log, index, hash);
    if (block !== null) {
      log.info('[block] Block was found');
      const transactionsFound = await blockService.findTransactionsByBlock(log, block);
      if (transactionsFound.length > PAGE_SIZE) {
        log.info('[block] Returning only transactions hashes since the number of them is bigger than PAGE_SIZE');
        return {
          block: mapToRosettaBlock(block, []),
          // eslint-disable-next-line camelcase
          other_transactions: transactionsFound.map(transaction => ({
            hash: transaction.hash
          }))
        };
      }
      log.info('[block] Looking for blocks transactions full data');
      const transactions = await blockService.fillTransactions(log, transactionsFound);
      return {
        block: mapToRosettaBlock(block, transactions)
      };
    }
    log.error('[block] Block was not found');
    throw ErrorFactory.blockNotFoundError();
  },

  blockTransaction: async request =>
    withNetworkValidation(
      request.body.network_identifier,
      request.body,
      async () => {
        const blockTransactionRequest = request.body;
        const log = request.log;
        const transactionHash = blockTransactionRequest.transaction_identifier.hash;
        log.info(
          `[blockTransaction] Looking for transaction for hash ${transactionHash} and block ${blockTransactionRequest.block_identifier}`
        );
        const transaction = await blockService.findTransaction(
          request.log,
          blockTransactionRequest.transaction_identifier.hash,
          blockTransactionRequest.block_identifier.index,
          blockTransactionRequest.block_identifier.hash
        );
        if (transaction === null) {
          log.error('[blockTransaction] No transaction found');
          throw ErrorFactory.transactionNotFound();
        }
        const response = mapToRosettaTransaction(transaction);
        log.debug({ response }, '[blockTransaction] Returning response ');
        return {
          transaction: response
        };
      },
      request.log,
      networkId
    )
});

export default configure;
