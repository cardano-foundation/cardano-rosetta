import { Logger } from 'fastify';
import { Block, GenesisBlock, Network } from '../models';
import { PREPROD, PREPROD_NETWORK_MAGIC, PREVIEW, PREVIEW_NETWORK_MAGIC } from '../utils/constants';
import { BlockService } from './block-service';
import fs from 'fs';
import path from 'path';
import systemInformation from 'systeminformation';

const filePath = process.env.EXEMPTION_TYPES_PATH;
let exemptionsFile: Components.Schemas.BalanceExemption[] = [];

export interface NetworkStatus {
  latestBlock: Block;
  genesisBlock: GenesisBlock;
  peers: Peer[];
}

export interface NetworkService {
  getSupportedNetwork(): Network;
  getExemptionTypes(logger: Logger): Components.Schemas.BalanceExemption[];
  getNetworkStatus(logger: Logger): Promise<NetworkStatus>;
}

interface Producer {
  port: number;
}
interface AccessPoint {
  port: number;
}
interface PublicRoot {
  publicRoots: {
    accessPoints: AccessPoint[];
  };
}
export interface TopologyConfig {
  Producers?: Producer[];
  PublicRoots?: PublicRoot[];
}

export interface Peer {
  addr: string;
}

const getPublicRoots = (publicRoots?: PublicRoot[]) =>
  publicRoots?.map(pr => pr.publicRoots.accessPoints.map(ap => ({ port: ap.port }))).flat() || [];

const getPeersFromConfig = async (logger: Logger, topologyFile: TopologyConfig): Promise<Peer[]> => {
  logger.info('[getPeersFromConfig] Looking for peers from topologyFile');
  const producersPort = (topologyFile?.Producers || getPublicRoots(topologyFile.PublicRoots))
    .filter(i => i !== undefined)
    .map(p => p!.port.toString());

  const peers = (await systemInformation.networkConnections())
    .filter(item => producersPort.includes(item.peerPort))
    .map(i => ({ addr: i.peerAddress }));

  logger.debug(`[getPeersFromConfig] Found ${peers.length} peers`);
  return peers;
};

const getExemptionFile = (logger: Logger): Components.Schemas.BalanceExemption[] => {
  if (exemptionsFile === []) {
    try {
      exemptionsFile = JSON.parse(filePath ? fs.readFileSync(path.resolve(filePath)).toString() : filePath);
      return exemptionsFile;
    } catch (error) {
      logger.error('[getExemptionFile]', error);
      return [];
    }
  } else {
    return exemptionsFile;
  }
};

const configure = (
  networkId: string,
  networkMagic: number,
  blockchainService: BlockService,
  topologyFile: TopologyConfig
): NetworkService => ({
  getSupportedNetwork() {
    if (networkId === 'mainnet') return { networkId };
    if (networkMagic === PREPROD_NETWORK_MAGIC) return { networkId: PREPROD };
    if (networkMagic === PREVIEW_NETWORK_MAGIC) return { networkId: PREVIEW };
    return { networkId: networkMagic.toString() };
  },
  getNetworkStatus: async logger => {
    logger.info('[networkStatus] Looking for latest block');
    const latestBlock = await blockchainService.getLatestBlock(logger);
    logger.debug({ latestBlock }, '[networkStatus] Latest block found');
    logger.info('[networkStatus] Looking for genesis block');
    const genesisBlock = await blockchainService.getGenesisBlock(logger);
    logger.debug({ genesisBlock }, '[networkStatus] Genesis block found');
    return {
      latestBlock,
      genesisBlock,
      peers: await getPeersFromConfig(logger, topologyFile)
    };
  },
  getExemptionTypes(logger: Logger) {
    return getExemptionFile(logger);
  }
});

export default configure;
