import { FastifyRequest } from 'fastify';
import { NetworkService } from '../services/network-service';
import { MIDDLEWARE_VERSION, operationType, ROSETTA_VERSION, SUCCESS_OPERATION_STATE } from '../utils/constants';
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

const configure = (networkService: NetworkService, networkId: string): NetworkController => ({
  async networkList(request) {
    const log = request.log;
    log.info('[networkList] Looking for all supported networks');
    const networkIdentifiers = await networkService.findAllNetworksSupported();
    if (networkIdentifiers !== null) {
      log.info(`[networkList] Found ${networkIdentifiers.length} networks supported`);
      const response = mapToNetworkList(networkIdentifiers);
      log.debug({ response }, '[networkList] Returning response:');
      return response;
    }
    log.error('[networkList] There are no networks supported to list');
    throw ErrorFactory.networkNotFoundError();
  },
  networkStatus: async request =>
    withNetworkValidation(
      request.body.network_identifier,
      request,
      async () => {
        const log = request.log;
        log.debug(request, '[networkStatus] Request received:');

        log.info('[networkStatus] Looking for latest block');
        const networkStatus = await networkService.getNetworkStatus(log);

        // peer must be queried from some node file, filePath should be place on .env
        const response = mapToNetworkStatusResponse(networkStatus);
        log.debug({ response }, '[networkStatus] Returning response:');
        return response;
      },
      request.log,
      networkId
    ),
  networkOptions: async request =>
    withNetworkValidation(
      request.body.network_identifier,
      request,
      async () => {
        const log = request.log;
        log.info('[networkOptions] Looking for networkOptions');
        const response = {
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
            errors: Object.values(ErrorFactory)
              .map(fn => fn())
              // Return them sorted by code
              .sort((error1, error2) => error1.code - error2.code),
            historical_balance_lookup: true
          }
        };
        log.info('[networkOptions] All network options has been successfully fetched.');
        log.debug({ response }, '[networkOptions] Returning response:');
        return response;
      },
      request.log,
      networkId
    )
});

export default configure;
