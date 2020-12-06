import { Services } from '../services/services';
import blockController, { BlockController } from './block-controller';
import accountController, { AccountController } from './account-controller';
import networkController, { NetworkController } from './network-controller';
import constructionController, { ConstructionController } from './construction-controller';
import { CardanoCli } from '../utils/cardanonode-cli';
import { CardanoNode } from '../utils/cardano-node';

export interface Controllers extends BlockController, AccountController, NetworkController, ConstructionController {}

/**
 * Configures all the controllers required by the app
 *
 * @param services App services
 */
export const configure = (
  services: Services,
  cardanoCli: CardanoCli,
  cardanoNode: CardanoNode,
  networkId: string,
  pageSize: number
): Controllers => ({
  ...blockController(services.blockService, pageSize, networkId),
  ...accountController(services.blockService, services.cardanoService, networkId),
  ...networkController(services.networkService, networkId, cardanoNode),
  ...constructionController(services.constructionService, services.cardanoService, cardanoCli, networkId)
});
