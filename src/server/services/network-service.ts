import StatusCodes from 'http-status-codes';
import { NetworkRepository } from '../db/network-repository';
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

const configure = (repository: NetworkRepository): NetworkService => ({
  async networkList() {
    const networkIdentifiers = await repository.findAllNetworksSupported();
    if (networkIdentifiers !== null) {
      return {
        network_identifiers: networkIdentifiers.map(({ networkName }) => ({
          network: networkName,
          blockchain: CARDANO
        }))
      };
    }
    throw buildApiError(StatusCodes.BAD_REQUEST, errorMessage.NETWORKS_NOT_FOUND, false);
  },
  async networkStatus(request) {
    return {
      current_block_identifier: {
        index: 1123941,
        hash: '0x1f2cc6c5027d2f201a5453ad1119574d2aed23a392654742ac3c78783c071f85'
      },
      current_block_timestamp: 1582833600000,
      genesis_block_identifier: {
        index: 1123941,
        hash: '0x1f2cc6c5027d2f201a5453ad1119574d2aed23a392654742ac3c78783c071f85'
      },
      peers: [
        {
          peer_id: '0x52bc44d5378309ee2abf1539bf71de1b7d7be3b5',
          metadata: {}
        }
      ]
    };
  },
  networkOptions: async networkOptionsRequest =>
    ẁithNetworkValidation(networkOptionsRequest.network_identifier, repository, networkOptionsRequest, async () => ({
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
    }))
});

export default configure;
