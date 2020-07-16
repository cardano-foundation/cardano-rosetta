import { Pool } from 'pg';
import { findNetworkByNetworkName, findAllNetworksQuery } from './queries/network-queries';

export interface Network {
  networkName: string;
}

export interface NetworkRepository {
  findAllNetworksSupported(): Promise<Network[] | null>;
  networkExists(networkName: string): Promise<boolean>;
}

export const configure = (databaseInstance: Pool): NetworkRepository => ({
  async findAllNetworksSupported(): Promise<Network[] | null> {
    const networksResult = await databaseInstance.query(findAllNetworksQuery);
    if (networksResult.rows.length > 0) {
      return networksResult.rows;
    }
    return null;
  },
  async networkExists(networkName): Promise<boolean> {
    const networkResults = await databaseInstance.query(findNetworkByNetworkName, [networkName]);
    return networkResults.rows[0].count > 0;
  }
});
