import { Logger } from 'fastify';
import { Block, GenesisBlock, Network } from '../models';
import { BlockService } from './block-service';

export interface NetworkStatus {
  latestBlock: Block;
  genesisBlock: GenesisBlock;
  peers: Peer[];
}

export interface NetworkService {
  getSupportedNetwork(): Network;
  getNetworkStatus(logger: Logger): Promise<NetworkStatus>;
}

interface Producer {
  addr: string;
}

export interface TopologyConfig {
  Producers: Producer[];
}

export interface Peer {
  addr: string;
}

const getPeersFromConfig = (logger: Logger, topologyFile: TopologyConfig): Peer[] => {
  logger.info('[getPeersFromConfig] Looking for peers from topologyFile');
  const { Producers } = topologyFile;
  logger.debug(`[getPeersFromConfig] Found ${Producers.length} peers`);
  return Producers;
};

const configure = (
  networkId: string,
  networkMagic: number,
  blockchainService: BlockService,
  topologyFile: TopologyConfig
): NetworkService => ({
  getSupportedNetwork() {
    if (networkId === 'mainnet') return { networkId };
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
      peers: getPeersFromConfig(logger, topologyFile)
    };
  }
});

export default configure;
