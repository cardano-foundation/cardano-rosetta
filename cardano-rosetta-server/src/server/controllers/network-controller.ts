import { FastifyRequest } from 'fastify';
import { NetworkService } from '../services/network-service';
import { CardanoNode } from '../utils/cardano/cli/cardano-node';
import {
  INVALID_OPERATION_STATE,
  MIDDLEWARE_VERSION,
  OPERATION_TYPES,
  ROSETTA_VERSION,
  SUCCESS_OPERATION_STATE
} from '../utils/constants';
import { mapToNetworkList, mapToNetworkStatusResponse } from '../utils/data-mapper';
import { ErrorFactory } from '../utils/errors';
import { withNetworkValidation } from './controllers-helper';

/* eslint-disable camelcase */
export interface NetworkController {
  networkList(
    request: FastifyRequest<unknown, unknown, unknown, unknown, Components.Schemas.MetadataRequest>
  ): Promise<Components.Schemas.NetworkListResponse | Components.Schemas.Error>;

  networkStatus(
    request: FastifyRequest<unknown, unknown, unknown, unknown, Components.Schemas.NetworkRequest>
  ): Promise<Components.Schemas.NetworkStatusResponse | Components.Schemas.Error>;

  networkOptions(
    request: FastifyRequest<unknown, unknown, unknown, unknown, Components.Schemas.NetworkRequest>
  ): Promise<Components.Schemas.NetworkOptionsResponse | Components.Schemas.Error>;
}

const configure = (networkService: NetworkService, cardanoNode: CardanoNode): NetworkController => ({
  async networkList(request) {
    const logger = request.log;
    logger.info('[networkList] Looking for all supported networks');
    const networkIdentifier = await networkService.getSupportedNetwork();
    logger.info(`[networkList] Found ${networkIdentifier} network supported`);
    const response = mapToNetworkList(networkIdentifier);
    logger.debug({ response }, '[networkList] Returning response:');
    return response;
  },
  networkStatus: async request =>
    withNetworkValidation(
      request.body.network_identifier,
      request,
      async () => {
        const logger = request.log;
        logger.debug(request, '[networkStatus] Request received:');

        logger.info('[networkStatus] Looking for latest block');
        const networkStatus = await networkService.getNetworkStatus(logger);

        // peer must be queried from some node file, filePath should be place on .env
        const response = mapToNetworkStatusResponse(networkStatus);
        logger.debug({ response }, '[networkStatus] Returning response:');
        return response;
      },
      request.log,
      networkService
    ),
  networkOptions: async request =>
    withNetworkValidation(
      request.body.network_identifier,
      request,
      async () => {
        const logger = request.log;
        logger.info('[networkOptions] Looking for networkOptions');
        const response = {
          version: {
            // FIXME unhardcode node_version. It'll be done in issue #28
            rosetta_version: ROSETTA_VERSION,
            node_version: await cardanoNode.getCardanoNodeVersion(logger),
            middleware_version: MIDDLEWARE_VERSION,
            metadata: {}
          },
          allow: {
            operation_statuses: [SUCCESS_OPERATION_STATE, INVALID_OPERATION_STATE],
            operation_types: OPERATION_TYPES,
            errors: Object.values(ErrorFactory)
              .map(function_ => function_())
              // Return them sorted by code
              .sort((error1, error2) => error1.code - error2.code),
            historical_balance_lookup: true,
            call_methods: [],
            balance_exemptions: networkService.getExemptionTypes(logger),
            mempool_coins: false
          }
        };
        logger.info('[networkOptions] All network options has been successfully fetched.');
        logger.debug({ response }, '[networkOptions] Returning response:');
        return response;
      },
      request.log,
      networkService
    )
});

export default configure;
