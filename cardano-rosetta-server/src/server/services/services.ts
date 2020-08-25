import fs from 'fs';
import path from 'path';
import { Repositories } from '../db/repositories';
import { ErrorFactory } from '../utils/errors';
import blockService, { BlockService } from './block-service';
import cardanoService, { CardanoService } from './cardano-services';
import constructionService, { ConstructionService } from './construction-service';
import networkService, { NetworkService } from './network-service';

export interface Services {
  blockService: BlockService;
  constructionService: ConstructionService;
  networkService: NetworkService;
  cardanoService: CardanoService;
}
const loadTopologyFile = () => {
  const topologyPath = process.env.TOPOLOGY_FILE_PATH;
  if (topologyPath === undefined) {
    throw ErrorFactory.topoloyFileNotFound();
  }
  return JSON.parse(fs.readFileSync(path.resolve(topologyPath)).toString());
};

/**
 * Configures all the services required by the app
 *
 * @param repositories repositories to be used by the services
 */
export const configure = (repositories: Repositories): Services => {
  const blockServiceInstance = blockService(repositories.blockchainRepository);
  const cardanoServiceInstance = cardanoService();
  return {
    blockService: blockServiceInstance,
    constructionService: constructionService(blockServiceInstance, process.env.DEFAULT_RELATIVE_TTL),
    networkService: networkService(repositories.networkRepository, blockServiceInstance, loadTopologyFile()),
    cardanoService: cardanoServiceInstance
  };
};
