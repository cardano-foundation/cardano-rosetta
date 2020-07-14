import rosettaApiJson from '../../../rosetta-specifications/api.json';
import packageJson from '../../../package.json';

export const rosettaVersion = rosettaApiJson.info.version;
export const middlewareVersion = packageJson.version;

export const CARDANO = 'cardano';

export const transferOperationType = 'TRANSFER';

export const successOperationState = {
  status: 'SUCCESS',
  successful: true
};
