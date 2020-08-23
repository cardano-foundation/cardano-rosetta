import { Logger } from 'fastify';
import { Block, GenesisBlock } from '../db/blockchain-repository';
import { Network, NetworkRepository } from '../db/network-repository';
import { BlockService } from './block-service';

export interface NetworkStatus {
  latestBlock: Block;
  genesisBlock: GenesisBlock;
  peers: Peer[];
}

export interface NetworkService {
  findAllNetworksSupported(): Promise<Network[] | null>;
  getNetworkStatus(log: Logger): Promise<NetworkStatus>;
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

const getPeersFromConfig = (log: Logger, topologyFile: TopologyConfig): Peer[] => {
  log.info('[getPeersFromConfig] Looking for peers from topologyFile');
  const { Producers } = topologyFile;
  log.debug(`[getPeersFromConfig] Found ${Producers.length} peers`);
  return Producers;
};

const configure = (
  networkRepository: NetworkRepository,
  blockchainService: BlockService,
  topologyFile: TopologyConfig
): NetworkService => ({
  async findAllNetworksSupported() {
    return networkRepository.findAllNetworksSupported();
  },
  getNetworkStatus: async log => {
    log.info('[networkStatus] Looking for latest block');
    const latestBlock = await blockchainService.getLatestBlock();
    log.debug({ latestBlock }, '[networkStatus] Latest block found');
    log.info('[networkStatus] Looking for genesis block');
    const genesisBlock = await blockchainService.getGenesisBlock();
    log.debug({ genesisBlock }, '[networkStatus] Genesis block found');

    return {
      latestBlock,
      genesisBlock,
      peers: getPeersFromConfig(log, topologyFile)
    };
  }
});

export default configure;
