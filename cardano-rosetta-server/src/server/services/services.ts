import { Repositories } from '../db/repositories';
import blockService, { BlockService } from './block-service';
import cardanoService, { CardanoService, LinearFeeParameters } from './cardano-services';
import constructionService, { ConstructionService } from './construction-service';
import networkService, { NetworkService, TopologyConfig } from './network-service';

export interface Services {
  blockService: BlockService;
  constructionService: ConstructionService;
  networkService: NetworkService;
  cardanoService: CardanoService;
}

/**
 * Configures all the services required by the app
 *
 * @param repositories repositories to be used by the services
 */
export const configure = (
  repositories: Repositories,
  topologyFile: TopologyConfig,
  DEFAULT_RELATIVE_TTL: number,
  linearFeeParameters: LinearFeeParameters
): Services => {
  const cardanoServiceInstance = cardanoService(linearFeeParameters);
  const blockServiceInstance = blockService(repositories.blockchainRepository, cardanoServiceInstance);
  return {
    blockService: blockServiceInstance,
    constructionService: constructionService(blockServiceInstance, DEFAULT_RELATIVE_TTL),
    networkService: networkService(repositories.networkRepository, blockServiceInstance, topologyFile),
    cardanoService: cardanoServiceInstance
  };
};
