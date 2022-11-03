import { FastifyRequest } from 'fastify';
import { BlockService } from '../services/block-service';
import { CardanoService } from '../services/cardano-services';
import { ErrorFactory } from '../utils/errors';
import { mapToRosettaBlock, mapToRosettaTransaction } from '../utils/data-mapper';
import { withNetworkValidation } from './controllers-helper';
import { NetworkService } from '../services/network-service';

export interface BlockController {
  block(
    request: FastifyRequest<unknown, unknown, unknown, unknown, Components.Schemas.BlockRequest>
  ): Promise<Components.Schemas.BlockResponse | Components.Schemas.Error>;
  blockTransaction(
    request: FastifyRequest<unknown, unknown, unknown, unknown, Components.Schemas.BlockTransactionRequest>
  ): Promise<Components.Schemas.BlockTransactionResponse | Components.Schemas.Error>;
}

const configure = (
  blockService: BlockService,
  cardanoService: CardanoService,
  PAGE_SIZE: number,
  networkService: NetworkService
): BlockController => ({
  block: async request =>
    withNetworkValidation(
      request.body.network_identifier,
      request.body,
      async () => {
        const { hash, index } = request.body.block_identifier;

        const logger = request.log;

        logger.info({ hash, index }, '[block] Looking for block');
        const block = await blockService.findBlock(logger, index, hash);
        if (block !== null) {
          logger.info('[block] Block was found');
          const transactionsFound = await blockService.findTransactionsByBlock(logger, block);
          const { poolDeposit } = await cardanoService.getProtocolParameters(logger);
          if (transactionsFound.length > PAGE_SIZE) {
            logger.info('[block] Returning only transactions hashes since the number of them is bigger than PAGE_SIZE');
            return {
              block: mapToRosettaBlock(block, [], poolDeposit),
              // eslint-disable-next-line camelcase
              other_transactions: transactionsFound.map(transaction => ({
                hash: transaction.hash
              }))
            };
          }
          logger.info('[block] Looking for blocks transactions full data');
          const transactions = await blockService.fillTransactions(logger, transactionsFound);
          logger.info(transactions, '[block] transactions already filled');
          return {
            block: mapToRosettaBlock(block, transactions, poolDeposit)
          };
        }
        logger.error('[block] Block was not found');
        throw ErrorFactory.blockNotFoundError();
      },
      request.log,
      networkService
    ),

  blockTransaction: async request =>
    withNetworkValidation(
      request.body.network_identifier,
      request.body,
      async () => {
        const blockTransactionRequest = request.body;
        const logger = request.log;
        const transactionHash = blockTransactionRequest.transaction_identifier.hash;
        logger.info(
          `[blockTransaction] Looking for transaction for hash ${transactionHash} 
          and block ${blockTransactionRequest.block_identifier}`
        );
        const transaction = await blockService.findTransaction(
          request.log,
          blockTransactionRequest.transaction_identifier.hash,
          blockTransactionRequest.block_identifier.index,
          blockTransactionRequest.block_identifier.hash
        );
        if (transaction === null) {
          logger.error('[blockTransaction] No transaction found');
          throw ErrorFactory.transactionNotFound();
        }
        const { poolDeposit } = await cardanoService.getProtocolParameters(logger);
        const response = mapToRosettaTransaction(transaction, poolDeposit);
        logger.debug({ response }, '[blockTransaction] Returning response ');
        return {
          transaction: response
        };
      },
      request.log,
      networkService
    )
});

export default configure;
