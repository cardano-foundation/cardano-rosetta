import { Network, NetworkRepository } from '../db/network-repository';
import {
  CARDANO,
  MIDDLEWARE_VERSION,
  operationType,
  ROSETTA_VERSION,
  SUCCESS_OPERATION_STATE
} from '../utils/constants';
import { ErrorFactory } from '../utils/errors';
import { BlockService } from './block-service';
import { withNetworkValidation } from './utils/services-helper';

/* eslint-disable camelcase */
export interface NetworkService {
  networkList(
    request: Components.Schemas.MetadataRequest
  ): Promise<Components.Schemas.NetworkListResponse | Components.Schemas.Error>;

  networkStatus(
    request: Components.Schemas.NetworkRequest
  ): Promise<Components.Schemas.NetworkStatusResponse | Components.Schemas.Error>;

  networkOptions(
    request: Components.Schemas.NetworkRequest
  ): Promise<Components.Schemas.NetworkOptionsResponse | Components.Schemas.Error>;
}

interface Producer {
  addr: string;
}

interface TopologyConfig {
  Producers: Producer[];
}

interface Peer {
  addr: string;
}

const getPeersFromConfig = (topologyFile: TopologyConfig) => {
  const { Producers } = topologyFile;
  return Producers.map((peer: Peer) => ({
    peer_id: peer.addr
  }));
};

const configure = (
  networkRepository: NetworkRepository,
  blockchainService: BlockService,
  topologyFile: TopologyConfig
): NetworkService => ({
  async networkList() {
    const networkIdentifiers = await networkRepository.findAllNetworksSupported();
    if (networkIdentifiers !== null) {
      return {
        network_identifiers: networkIdentifiers.map(({ networkName }: Network) => ({
          network: networkName,
          blockchain: CARDANO
        }))
      };
    }
    throw ErrorFactory.networkNotFoundError();
  },
  networkStatus: async networkStatusRequest =>
    withNetworkValidation(
      networkStatusRequest.network_identifier,
      networkRepository,
      networkStatusRequest,
      async () => {
        // fetch latest block
        const latestBlock = await blockchainService.getLatestBlock();

        // fetch genesis block
        const genesisBlock = await blockchainService.getGenesisBlock();

        // peer must be queried from some node file, filePath should be place on .env
        return {
          current_block_identifier: {
            index: latestBlock.number,
            hash: latestBlock.hash
          },
          current_block_timestamp: latestBlock.createdAt,
          genesis_block_identifier: {
            index: genesisBlock.index,
            hash: genesisBlock.hash
          },
          peers: getPeersFromConfig(topologyFile)
        };
      }
    ),
  networkOptions: async networkOptionsRequest =>
    withNetworkValidation(
      networkOptionsRequest.network_identifier,
      networkRepository,
      networkOptionsRequest,
      async () => ({
        version: {
          // FIXME unhardcode node_version. It'll be done in issue #28
          rosetta_version: ROSETTA_VERSION,
          node_version: '1.0.2',
          middleware_version: MIDDLEWARE_VERSION,
          metadata: {}
        },
        allow: {
          operation_statuses: [SUCCESS_OPERATION_STATE],
          operation_types: [operationType.TRANSFER],
          errors: Object.values(ErrorFactory).map(fn => fn()),
          historical_balance_lookup: true
        }
      })
    )
});

export default configure;
