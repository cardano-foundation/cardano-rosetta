import StatusCodes from 'http-status-codes';
import { NetworkRepository, Network } from '../db/network-repository';
import { BlockService } from './block-service';
import {
  CARDANO,
  SUCCESS_OPERATION_STATE,
  ROSETTA_VERSION,
  MIDDLEWARE_VERSION,
  operationType
} from '../utils/constants';
import { errors, buildApiError, errorMessage } from '../utils/errors';

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

const ẁithNetworkValidation = async <T, R>(
  networkIdentifier: Components.Schemas.NetworkIdentifier,
  repository: NetworkRepository,
  parameters: T,
  nextFn: (param: T) => R
) => {
  const blockchain: string = networkIdentifier.blockchain;
  const network: string = networkIdentifier.network;

  if (blockchain !== CARDANO) {
    throw buildApiError(StatusCodes.BAD_REQUEST, errorMessage.INVALID_BLOCKCHAIN, false);
  }

  const networkExists = await repository.networkExists(network);
  if (!networkExists) {
    throw buildApiError(StatusCodes.BAD_REQUEST, errorMessage.NETWORK_NOT_FOUND, false);
  }
  return await nextFn(parameters);
};

const configure = (networkRepository: NetworkRepository, blockchainService: BlockService): NetworkService => ({
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
    throw buildApiError(StatusCodes.BAD_REQUEST, errorMessage.NETWORKS_NOT_FOUND, false);
  },
  networkStatus: async networkStatusRequest =>
    ẁithNetworkValidation(
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
            index: genesisBlock.number,
            hash: genesisBlock.hash
          },
          peers: [
            {
              peer_id: '0x52bc44d5378309ee2abf1539bf71de1b7d7be3b5',
              metadata: {}
            }
          ]
        };
      }
    ),
  networkOptions: async networkOptionsRequest =>
    ẁithNetworkValidation(
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
          // TODO for each custom error we add to this implementation we should add it here (update that array)
          errors,
          historical_balance_lookup: true
        }
      })
    )
});

export default configure;
