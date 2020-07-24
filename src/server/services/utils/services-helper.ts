import { NetworkRepository } from '../../db/network-repository';
import { CARDANO } from '../../utils/constants';
import { ErrorFactory } from '../../utils/errors';

export const withNetworkValidation = async <T, R>(
  networkIdentifier: Components.Schemas.NetworkIdentifier,
  repository: NetworkRepository,
  parameters: T,
  nextFn: (param: T) => R
): Promise<R> => {
  const blockchain: string = networkIdentifier.blockchain;
  const network: string = networkIdentifier.network;

  if (blockchain !== CARDANO) {
    throw ErrorFactory.invalidBlockchainError();
  }

  const networkExists = await repository.networkExists(network);
  if (!networkExists) {
    throw ErrorFactory.networkNotFoundError();
  }
  return await nextFn(parameters);
};
