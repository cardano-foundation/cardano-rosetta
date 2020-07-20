import StatusCodes from 'http-status-codes';
import { NetworkRepository } from '../../db/network-repository';
import { CARDANO } from '../../utils/constants';
import { buildApiError, errorMessage } from '../../utils/errors';

export const withNetworkValidation = async <T, R>(
  networkIdentifier: Components.Schemas.NetworkIdentifier,
  repository: NetworkRepository,
  parameters: T,
  nextFn: (param: T) => R
): Promise<R> => {
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
