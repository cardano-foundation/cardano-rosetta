import accountService from './account-service';
import networkService from './network-service';
import constructionService from './construction-service';
import blockService from './block-service';

const services = {
  ...accountService,
  ...blockService,
  ...constructionService,
  ...networkService
};

export default services;
