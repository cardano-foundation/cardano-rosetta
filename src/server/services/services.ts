import accountService, { AccountService } from './account-service';
import blockService, { BlockService } from './block-service';
import constructionService, { ConstructionService } from './construction-service';
import networkService, { NetworkService } from './network-service';
import { Repositories } from '../db/repositories';

export interface Services
  extends AccountService,
    BlockService,
    ConstructionService,
    NetworkService,
    // eslint-disable-next-line @typescript-eslint/ban-types
    NodeJS.Dict<Function> {}

/**
 * Configures all the services required by the app
 *
 * @param repositories repositories to be used by the services
 */
export const configure = (repositories: Repositories): Services => ({
  ...accountService,
  ...blockService(repositories.blockchainRepository),
  ...constructionService,
  ...networkService(repositories.networkRepository)
});
