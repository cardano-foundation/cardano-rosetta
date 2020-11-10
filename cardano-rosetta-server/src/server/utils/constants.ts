import rosettaApiJson from '../openApi.json';
import packageJson from '../../../package.json';

export const ROSETTA_VERSION = rosettaApiJson.info.version;
export const MIDDLEWARE_VERSION = packageJson.version;

export const CARDANO = 'cardano';
export const ADA = 'ADA';
export const ADA_DECIMALS = 6;
export const VIN = 'Vin';
export const VOUT = 'Vout';
export const SIGNATURE_TYPE = 'ed25519';

export enum operationType {
  INPUT = 'input',
  OUTPUT = 'output'
}

enum operationTypeStatus {
  SUCCESS = 'success'
}

export const SUCCESS_STATUS = 'success';

export const MAINNET = 'mainnet';
export const TESTNET = 'testnet';

export const SUCCESS_OPERATION_STATE = {
  status: operationTypeStatus.SUCCESS,
  successful: true
};

export enum AddressType {
  ENTERPRISE = 'Enterprise',
  BASE = 'Base',
  REWARD = 'Reward'
}
