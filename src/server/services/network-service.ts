import StatusCodes from 'http-status-codes';
import { NetworkRepository } from '../db/network-repository';
import ApiError from '../api-error';
import {
  CARDANO,
  TRANSFER_OPERATION_TYPE,
  SUCCESS_OPERATION_STATE,
  ROSETTA_VERSION,
  MIDDLEWARE_VERSION
} from '../utils/constants';
import { errors } from '../utils/errors';

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

const validateNetwork = async (
  networkIdentifier: Components.Schemas.NetworkIdentifier,
  repository: NetworkRepository
) => {
  const blockchain: string = networkIdentifier.blockchain;
  const network: string = networkIdentifier.network;

  if (blockchain !== CARDANO) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid blockchain', false);
  }

  const networkIdentifiersSupported = await repository.findNetworkByNetworkName(network);
  if (!networkIdentifiersSupported) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Network not found', false);
  }
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
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Networks not found', false);
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
  async networkOptions(request) {
    await validateNetwork(request.network_identifier, repository);
    return {
      version: {
        // FIXME unhardcode node_version. It'll be done in issue #28
        rosetta_version: ROSETTA_VERSION,
        node_version: '1.0.2',
        middleware_version: MIDDLEWARE_VERSION,
        metadata: {}
      },
      allow: {
        operation_statuses: [SUCCESS_OPERATION_STATE],
        operation_types: [TRANSFER_OPERATION_TYPE],
        // TODO for each custom error we add to this implementation we should add it here (update that array)
        errors,
        historical_balance_lookup: true
      }
    };
  }
});

export default configure;
