import { Pool } from 'pg';
import * as BlockchainRepository from './blockchain-repository';
import * as NetworkRepository from './network-repository';

export interface Repositories {
  blockchainRepository: BlockchainRepository.BlockchainRepository;
  networkRepository: NetworkRepository.NetworkRepository;
}

/**
 * Configures the repositories with the given DB connection to make them ready
 * to be used
 *
 * @param database connection to be used to run queries
 */
export const configure = (database: Pool): Repositories => ({
  blockchainRepository: BlockchainRepository.configure(database),
  networkRepository: NetworkRepository.configure(database)
});
