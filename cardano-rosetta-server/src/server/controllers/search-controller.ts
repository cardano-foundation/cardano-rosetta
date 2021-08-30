import { FastifyRequest } from 'fastify';
import { withNetworkValidation } from '../controllers/controllers-helper';
import { BlockService } from '../services/block-service';
import { CardanoService } from '../services/cardano-services';
import { NetworkService } from '../services/network-service';
import { mapToSearchTransactionsResponse } from '../utils/index-mapper';

export interface SearchController {
  searchTransactions(
    request: FastifyRequest<unknown, unknown, unknown, unknown, Components.Schemas.SearchTransactionsRequest>
  ): Promise<Components.Schemas.SearchTransactionsResponse | Components.Schemas.Error>;
}

const configure = (
  blockService: BlockService,
  cardanoService: CardanoService,
  PAGE_SIZE: number,
  networkService: NetworkService
): SearchController => ({
  searchTransactions: async request =>
    withNetworkValidation(
      request.body.network_identifier,
      request,
      async () => {
        const logger = request.log;
        const searchTransactionsRequest = request.body;
        logger.debug({ searchTransactionsRequest }, '[searchTransactions] Request received');
        let limit = searchTransactionsRequest.limit;
        if (limit === undefined || limit > PAGE_SIZE) {
          limit = PAGE_SIZE;
        }
        const offset = searchTransactionsRequest.offset || 0;
        const conditions = { ...searchTransactionsRequest, limit, offset };
        const transactionsFound = await blockService.findTransactionsByConditions(logger, conditions);
        logger.info('[searchTransactions] Looking for transactions full data');
        const transactions = await blockService.fillTransactions(logger, transactionsFound.transactions);
        const { poolDeposit } = await cardanoService.getDepositParameters(logger);
        const parameters = {
          transactions,
          poolDeposit,
          offset,
          limit,
          totalCount: transactionsFound.totalCount
        };
        const toReturn = mapToSearchTransactionsResponse(parameters);
        logger.debug(toReturn, '[searchTransactions] About to return ');
        return toReturn;
      },
      request.log,
      networkService
    )
});

export default configure;
