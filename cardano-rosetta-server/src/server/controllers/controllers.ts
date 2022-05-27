import { FastifyRequest } from 'fastify';
import { Services } from '../services/services';
import blockController, { BlockController } from './block-controller';
import accountController, { AccountController } from './account-controller';
import networkController, { NetworkController } from './network-controller';
import constructionController, { ConstructionController } from './construction-controller';
import searchController, { SearchController } from './search-controller';
import { CardanoNode } from '../utils/cardano/node/cardano-node';
import { OgmiosClient } from '../utils/cardano/node/ogmios-client';

export interface Controllers extends BlockController, AccountController, NetworkController, ConstructionController {
  searchTransactions?(
    request: FastifyRequest<unknown, unknown, unknown, unknown, Components.Schemas.SearchTransactionsRequest>
  ): Promise<Components.Schemas.SearchTransactionsResponse | Components.Schemas.Error>;
}

/**
 * Configures all the controllers required by the app
 *
 * @param services App services
 */
export const configure = (
  services: Services,
  ogmiosClient: OgmiosClient,
  cardanoNode: CardanoNode,
  pageSize: number,
  disableSearchApi = false
): Controllers => {
  const toReturn = {
    ...blockController(services.blockService, services.cardanoService, pageSize, services.networkService),
    ...accountController(services.blockService, services.cardanoService, services.networkService),
    ...networkController(services.networkService, cardanoNode),
    ...constructionController(
      services.constructionService,
      services.cardanoService,
      ogmiosClient,
      services.networkService,
      services.blockService
    )
  };
  if (!disableSearchApi)
    return {
      ...toReturn,
      ...searchController(services.blockService, services.cardanoService, pageSize, services.networkService)
    };
  return toReturn;
};
