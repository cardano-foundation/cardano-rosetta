import { Pool } from 'pg';
import { findNetworkByNetworkName, findAllNetworksQuery } from './queries/network-queries';

export interface Network {
  networkName: string;
}

export interface NetworkRepository {
  findAllNetworksSupported(): Promise<Network[] | null>;
  findNetworkByNetworkName(networkName: string): Promise<Network | null>;
}

export const configure = (databaseInstance: Pool): NetworkRepository => ({
  async findAllNetworksSupported(): Promise<Network[] | null> {
    const networksResult = await databaseInstance.query(findAllNetworksQuery);
    if (networksResult.rows.length > 0) {
      return networksResult.rows;
    }
    return null;
  },
  async findNetworkByNetworkName(networkName): Promise<Network | null> {
    const networkResults = await databaseInstance.query(findNetworkByNetworkName, [networkName]);
    if (networkResults.rows.length === 1) {
      return networkResults.rows[0].networkName;
    }
    return null;
  }
});
