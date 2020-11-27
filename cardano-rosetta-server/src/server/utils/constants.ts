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
export const PREFIX_LENGTH = 10;

// Nibbles
export const SIGNATURE_LENGTH = 128;
export const PUBLIC_KEY_BYTES_LENGTH = 64;

export enum stakeType {
  STAKE = 'stake',
  STAKE_TEST = 'stake_test'
}

export enum operationType {
  INPUT = 'input',
  OUTPUT = 'output',
  STAKE_KEY_REGISTRATION = 'stakeKeyRegistration',
  STAKE_DELEGATION = 'stakeDelegation',
  WITHDRAWAL = 'withdrawal',
  STAKE_KEY_DEREGISTRATION = 'stakeKeyDeregistration'
}

export const stakingOperations = [
  operationType.STAKE_DELEGATION,
  operationType.STAKE_KEY_REGISTRATION,
  operationType.STAKE_KEY_DEREGISTRATION,
  operationType.WITHDRAWAL
];

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
