import { Services } from '../services/services';
import { ErrorFactory } from '../utils/errors';
import blockController, { BlockController } from './block-controller';
import accountController, { AccountController } from './account-controller';

export interface Controllers extends BlockController, AccountController {}

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
export const configure = (services: Services, networkId: string): Controllers => ({
  ...blockController(services.blockService, loadPageSize(), networkId),
  ...accountController(services.blockService, networkId)
});
