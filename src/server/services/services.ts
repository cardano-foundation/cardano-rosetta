import StatusCodes from 'http-status-codes';
import accountService, { AccountService } from './account-service';
import blockService, { BlockService } from './block-service';
import constructionService, { ConstructionService } from './construction-service';
import networkService, { NetworkService } from './network-service';
import { Repositories } from '../db/repositories';
import { buildApiError, errorMessage } from '../utils/errors';

export interface Services
  extends AccountService,
    BlockService,
    ConstructionService,
    NetworkService,
    // eslint-disable-next-line @typescript-eslint/ban-types
    NodeJS.Dict<Function> {}

const loadTopologyFile = () => {
  const topologyPath = process.env.TOPOLOGY_FILE_PATH;
  if (topologyPath === undefined) {
    throw buildApiError(StatusCodes.INTERNAL_SERVER_ERROR, errorMessage.TOPOLOGY_FILE_NOT_FOUND, false);
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require(topologyPath);
};
/**
 * Configures all the services required by the app
 *
 * @param repositories repositories to be used by the services
 */
export const configure = (repositories: Repositories): Services => {
  const blockServiceInstance = blockService(repositories.blockchainRepository);
  return {
    ...accountService,
    ...blockServiceInstance,
    ...constructionService,
    ...networkService(repositories.networkRepository, blockServiceInstance, loadTopologyFile())
  };
};
