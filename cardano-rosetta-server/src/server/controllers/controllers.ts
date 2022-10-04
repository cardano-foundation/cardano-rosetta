import { FastifyRequest } from 'fastify';
import { Services } from '../services/services';
import blockController, { BlockController } from './block-controller';
import accountController, { AccountController } from './account-controller';
import networkController, { NetworkController } from './network-controller';
import constructionController, { ConstructionController } from './construction-controller';
import searchController from './search-controller';
import { CardanoCli } from '../utils/cardano/cli/cardanonode-cli';
import { CardanoNode } from '../utils/cardano/cli/cardano-node';

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
  cardanoCli: CardanoCli,
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
      cardanoCli,
      services.networkService
    )
  };
  if (!disableSearchApi)
    return {
      ...toReturn,
      ...searchController(services.blockService, services.cardanoService, pageSize, services.networkService)
    };
  return toReturn;
};
