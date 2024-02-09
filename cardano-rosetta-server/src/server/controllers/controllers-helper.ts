import { CARDANO } from '../utils/constants';
import { ErrorFactory } from '../utils/errors';
import { Logger } from 'fastify';
import { NetworkService } from '../services/network-service';

export const withNetworkValidation = async <T, R>(
  networkIdentifier: Components.Schemas.NetworkIdentifier,
  parameters: T,
  nextFunction: (parameter: T) => R,
  logger: Logger,
  networkService: NetworkService
): Promise<R> => {
  logger.debug('[withNetworkValidation] About to validate requests network identifier parameter', networkIdentifier);
  const blockchain: string = networkIdentifier.blockchain;
  const network: string = networkIdentifier.network;

  if (blockchain !== CARDANO) {
    logger.error('[withNetworkValidation] Blockchain parameter is not cardano: ', blockchain);
    throw ErrorFactory.invalidBlockchainError();
  }

  const networkExists = networkService.getSupportedNetwork().networkId === network;
  if (!networkExists) {
    logger.error('[withNetworkValidation] Network parameter is not supported: ', network);
    throw ErrorFactory.networkNotFoundError();
  }
  logger.debug('[withNetworkValidation] Network parameters are within expected');
  return await nextFunction(parameters);
};
