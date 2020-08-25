import { Pool } from 'pg';
import { findNetworkByNetworkName, findAllNetworksQuery } from './queries/network-queries';
import { Logger } from 'fastify';
import { Network } from '../models';

export interface NetworkRepository {
  findAllSupportedNetworks(logger: Logger): Promise<Network[] | null>;
  networkExists(logger: Logger, networkName: string): Promise<boolean>;
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
  },
  async networkExists(logger: Logger, networkName): Promise<boolean> {
    logger.debug(`[networkExists] About to find if network ${networkName} exists`);
    const networkResults = await databaseInstance.query(findNetworkByNetworkName, [networkName]);
    logger.debug(`[networkExists] Found ${networkResults.rows[0].count} networks`);
    return networkResults.rows[0].count > 0;
  }
});
