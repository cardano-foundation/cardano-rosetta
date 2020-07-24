import { Repositories } from '../db/repositories';
import { ErrorFactory } from '../utils/errors';
import accountService, { AccountService } from './account-service';
import blockService, { BlockService } from './block-service';
import constructionService, { ConstructionService } from './construction-service';
import networkService, { NetworkService } from './network-service';

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
    throw ErrorFactory.topoloyFileNotFound();
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require(topologyPath);
};

const loadPageSize = (): number => {
  const pageSize = process.env.PAGE_SIZE;
  if (pageSize === undefined) {
    throw ErrorFactory.pageSizeNotFund();
  }
  return Number(pageSize);
};
/**
 * Configures all the services required by the app
 *
 * @param repositories repositories to be used by the services
 */
export const configure = (repositories: Repositories): Services => {
  const blockServiceInstance = blockService(
    repositories.blockchainRepository,
    loadPageSize(),
    repositories.networkRepository
  );
  return {
    ...accountService(repositories.networkRepository, blockServiceInstance),
    ...blockServiceInstance,
    ...constructionService,
    ...networkService(repositories.networkRepository, blockServiceInstance, loadTopologyFile())
  };
};
