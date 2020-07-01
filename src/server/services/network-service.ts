import { FastifyRequest } from 'fastify';

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

const networkService: NetworkService = {
  async networkList(req) {
    return {
      network_identifiers: [
        {
          blockchain: 'bitcoin',
          network: 'mainnet',
          sub_network_identifier: {
            network: 'shard 1',
            metadata: {
              producer: '0x52bc44d5378309ee2abf1539bf71de1b7d7be3b5',
            },
          },
        },
      ],
    };
  },
  async networkStatus(req) {
    return {
      current_block_identifier: {
        index: 1123941,
        hash: '0x1f2cc6c5027d2f201a5453ad1119574d2aed23a392654742ac3c78783c071f85',
      },
      current_block_timestamp: 1582833600000,
      genesis_block_identifier: {
        index: 1123941,
        hash: '0x1f2cc6c5027d2f201a5453ad1119574d2aed23a392654742ac3c78783c071f85',
      },
      peers: [
        {
          peer_id: '0x52bc44d5378309ee2abf1539bf71de1b7d7be3b5',
          metadata: {},
        },
      ],
    };
  },
  async networkOptions(req) {
    return {
      version: {
        rosetta_version: '1.2.5',
        node_version: '1.0.2',
        middleware_version: '0.2.7',
        metadata: {},
      },
      allow: {
        operation_statuses: [
          {
            status: 'SUCCESS',
            successful: true,
          },
        ],
        operation_types: ['TRANSFER'],
        errors: [
          {
            code: 0,
            message: 'string',
            retriable: true,
          },
        ],
        historical_balance_lookup: true,
      },
    };
  },
};

export default networkService;
