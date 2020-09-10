import { Pool } from 'pg';
import { findAllNetworksQuery } from './queries/network-queries';
import { Logger } from 'fastify';
import { Network } from '../models';

export interface NetworkRepository {
  findAllSupportedNetworks(logger: Logger): Promise<Network[] | null>;
}

export const configure = (databaseInstance: Pool): NetworkRepository => ({
  async findAllSupportedNetworks(logger: Logger): Promise<Network[] | null> {
    logger.debug('[findAllNetworksSupported] About to run findAllNetworksQuery');
    const networksResult = await databaseInstance.query(findAllNetworksQuery);
    logger.debug(`[findAllNetworksSupported] Found ${networksResult.rowCount} networks`);
    if (networksResult.rows.length > 0) {
      return networksResult.rows;
    }
    return null;
  }
});
