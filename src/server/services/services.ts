import fs from 'fs';
import path from 'path';
import { Logger } from 'pino';
import { Repositories } from '../db/repositories';
import { CardanoCli } from '../utils/cardanonode-cli';
import { ErrorFactory } from '../utils/errors';
import accountService, { AccountService } from './account-service';
import blockService, { BlockService } from './block-service';
import cardanoService, { CardanoService } from './cardano-services';
import constructionService, { ConstructionService } from './construction-service';
import networkService, { NetworkService } from './network-service';

export interface Services {
  accountService: AccountService;
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
export const configure = (
  repositories: Repositories,
  cardanoCli: CardanoCli,
  logger: Logger,
  networkId: string
): Services => {
  const blockServiceInstance = blockService(repositories.blockchainRepository, logger);
  const cardanoServiceInstance = cardanoService(logger);
  return {
    accountService: accountService(repositories.networkRepository, blockServiceInstance, logger, networkId),
    blockService: blockServiceInstance,
    constructionService: constructionService(
      cardanoServiceInstance,
      blockServiceInstance,
      cardanoCli,
      networkId,
      process.env.DEFAULT_RELATIVE_TTL,
      logger
    ),
    networkService: networkService(
      repositories.networkRepository,
      blockServiceInstance,
      loadTopologyFile(),
      logger,
      networkId
    ),
    cardanoService: cardanoServiceInstance
  };
};
