import { Logger } from 'fastify';
import { Block, GenesisBlock, Network } from '../models';
import { BlockService } from './block-service';
import { NetworkRepository } from '../db/network-repository';

export interface NetworkStatus {
  latestBlock: Block;
  genesisBlock: GenesisBlock;
  peers: Peer[];
}

export interface NetworkService {
  findAllNetworksSupported(logger: Logger): Promise<Network[] | null>;
  getNetworkStatus(logger: Logger): Promise<NetworkStatus>;
}

interface Producer {
  addr: string;
}

interface TopologyConfig {
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
  networkRepository: NetworkRepository,
  blockchainService: BlockService,
  topologyFile: TopologyConfig
): NetworkService => ({
  async findAllNetworksSupported(logger: Logger) {
    return networkRepository.findAllSupportedNetworks(logger);
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
