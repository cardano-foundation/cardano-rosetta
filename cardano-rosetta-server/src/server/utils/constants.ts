import rosettaApiJson from '../openApi.json';
import packageJson from '../../../package.json';

export const ROSETTA_VERSION = rosettaApiJson.info.version;
export const MIDDLEWARE_VERSION = packageJson.version;

export const CARDANO = 'cardano';
export const ADA = 'ADA';
export const ADA_DECIMALS = 6;
export const MULTI_ASSET_DECIMALS = 0;
export const VIN = 'Vin';
export const VOUT = 'Vout';
export const SIGNATURE_TYPE = 'ed25519';
export const PREFIX_LENGTH = 10;

// Nibbles
export const SIGNATURE_LENGTH = 128;
export const PUBLIC_KEY_BYTES_LENGTH = 64;
export const POLICY_ID_LENGTH = 56;
export const ASSET_NAME_LENGTH = 64;

export enum NonStakeAddressPrefix {
  MAIN = 'addr',
  TEST = 'addr_test'
}

export enum StakeAddressPrefix {
  MAIN = 'stake',
  TEST = 'stake_test'
}
export interface AddressPrefix {
  MAIN: string;
  TEST: string;
}

export enum OperationType {
  INPUT = 'input',
  OUTPUT = 'output',
  STAKE_KEY_REGISTRATION = 'stakeKeyRegistration',
  STAKE_DELEGATION = 'stakeDelegation',
  WITHDRAWAL = 'withdrawal',
  STAKE_KEY_DEREGISTRATION = 'stakeKeyDeregistration'
}

export const OPERATION_TYPES = Object.values(OperationType);

export const StakingOperations = [
  OperationType.STAKE_DELEGATION,
  OperationType.STAKE_KEY_REGISTRATION,
  OperationType.STAKE_KEY_DEREGISTRATION,
  OperationType.WITHDRAWAL
];

enum OperationTypeStatus {
  SUCCESS = 'success'
}

export enum CurveType {
  secp256k1 = 'secp256k1',
  secp256r1 = 'secp256r1',
  edwards25519 = 'edwards25519',
  tweedle = 'tweedle'
}

export const SUCCESS_STATUS = 'success';

export const MAINNET = 'mainnet';
export const TESTNET = 'testnet';
export const MAIN_TESTNET_NETWORK_MAGIC = 1097911063;

export const SUCCESS_OPERATION_STATE = {
  status: OperationTypeStatus.SUCCESS,
  successful: true
};

export enum AddressType {
  ENTERPRISE = 'Enterprise',
  BASE = 'Base',
  REWARD = 'Reward'
}

export enum NetworkIdentifier {
  CARDANO_TESTNET_NETWORK = 0,
  CARDANO_MAINNET_NETWORK
}

export enum EraAddressType {
  Shelley,
  Byron
}
