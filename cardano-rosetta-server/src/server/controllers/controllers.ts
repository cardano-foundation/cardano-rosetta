import { Services } from '../services/services';
import { ErrorFactory } from '../utils/errors';
import blockController, { BlockController } from './block-controller';
import accountController, { AccountController } from './account-controller';
import networkController, { NetworkController } from './network-controller';
import constructionController, { ConstructionController } from './construction-controller';
import { CardanoCli } from '../utils/cardanonode-cli';
import { CardanoNode } from '../utils/cardano-node';

export interface Controllers extends BlockController, AccountController, NetworkController, ConstructionController {}

const loadPageSize = (): number => {
  const pageSize = process.env.PAGE_SIZE;
  if (pageSize === undefined) {
    throw ErrorFactory.pageSizeNotFund();
  }
  return Number(pageSize);
};

/**
 * Configures all the controllers required by the app
 *
 * @param services App services
 */
export const configure = (
  services: Services,
  cardanoCli: CardanoCli,
  cardanoNode: CardanoNode,
  networkId: string
): Controllers => ({
  ...blockController(services.blockService, loadPageSize(), networkId),
  ...accountController(services.blockService, networkId),
  ...networkController(services.networkService, networkId, cardanoNode),
  ...constructionController(services.constructionService, services.cardanoService, cardanoCli, networkId)
});
