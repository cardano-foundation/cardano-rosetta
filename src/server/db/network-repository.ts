import { Pool } from 'pg';
import { findNetworkByNetworkName, findAllNetworksQuery } from './queries/network-queries';
import { Logger } from 'pino';

export interface Network {
  networkName: string;
}

export interface NetworkRepository {
  findAllNetworksSupported(): Promise<Network[] | null>;
  networkExists(networkName: string): Promise<boolean>;
}

export const configure = (databaseInstance: Pool, logger: Logger): NetworkRepository => ({
  async findAllNetworksSupported(): Promise<Network[] | null> {
    logger.debug('[findAllNetworksSupported] About to run findAllNetworksQuery');
    const networksResult = await databaseInstance.query(findAllNetworksQuery);
    logger.debug(`[findAllNetworksSupported] Found ${networksResult.rowCount} networks`);
    if (networksResult.rows.length > 0) {
      return networksResult.rows;
    }
    return null;
  },
  async networkExists(networkName): Promise<boolean> {
    logger.debug(`[networkExists] About to find if network ${networkName} exists`);
    const networkResults = await databaseInstance.query(findNetworkByNetworkName, [networkName]);
    logger.debug(`[networkExists] Found ${networkResults.rows[0].count} networks`);
    return networkResults.rows[0].count > 0;
  }
});
