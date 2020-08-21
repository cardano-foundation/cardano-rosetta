import { CARDANO } from '../../utils/constants';
import { ErrorFactory } from '../../utils/errors';
import { Logger } from 'fastify';

export const withNetworkValidation = async <T, R>(
  networkIdentifier: Components.Schemas.NetworkIdentifier,
  parameters: T,
  nextFn: (param: T) => R,
  logger: Logger,
  networkId: string
): Promise<R> => {
  logger.debug('[withNetworkValidation] About to validate requests network identifier parameter', networkIdentifier);
  const blockchain: string = networkIdentifier.blockchain;
  const network: string = networkIdentifier.network;

  if (blockchain !== CARDANO) {
    logger.error('[withNetworkValidation] Blockchain parameter is not cardano: ', blockchain);
    throw ErrorFactory.invalidBlockchainError();
  }

  const networkExists = networkId === network;
  if (!networkExists) {
    logger.error('[withNetworkValidation] Network parameter is not supported: ', network);
    throw ErrorFactory.networkNotFoundError();
  }
  logger.debug('[withNetworkValidation] Network parameters are within expected');
  return await nextFn(parameters);
};
