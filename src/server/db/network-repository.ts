import { Pool } from 'pg';

export interface Network {
  networkName: string;
}

export interface NetworkRepository {
  findAllNetworksSupported(): Promise<Network[] | null>;
}

const findAllNetworksQuery = `SELECT 
    m.network_name as "networkName"
 FROM
    meta m`;

export const configure = (databaseInstance: Pool): NetworkRepository => ({
  async findAllNetworksSupported(): Promise<Network[] | null> {
    const networksResult = await databaseInstance.query(findAllNetworksQuery);
    if (networksResult.rows.length > 0) {
      return networksResult.rows;
    }
    return null;
  }
});
