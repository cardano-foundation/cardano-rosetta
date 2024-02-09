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
export const CHAIN_CODE_LENGTH = 64;

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
  STAKE_KEY_DEREGISTRATION = 'stakeKeyDeregistration',
  POOL_REGISTRATION = 'poolRegistration',
  POOL_REGISTRATION_WITH_CERT = 'poolRegistrationWithCert',
  POOL_RETIREMENT = 'poolRetirement',
  VOTE_REGISTRATION = 'voteRegistration'
}

export enum RelayType {
  SINGLE_HOST_ADDR = 'single_host_addr',
  SINGLE_HOST_NAME = 'single_host_name',
  MULTI_HOST_NAME = 'multi_host_name'
}

export const OPERATION_TYPES: string[] = Object.values(OperationType);

export const StakingOperations = [
  OperationType.STAKE_DELEGATION,
  OperationType.STAKE_KEY_REGISTRATION,
  OperationType.STAKE_KEY_DEREGISTRATION,
  OperationType.WITHDRAWAL
];

export const PoolOperations = [
  OperationType.POOL_RETIREMENT,
  OperationType.POOL_REGISTRATION,
  OperationType.POOL_REGISTRATION_WITH_CERT
];

export const VoteOperations = [OperationType.VOTE_REGISTRATION];

export enum OperationTypeStatus {
  SUCCESS = 'success',
  INVALID = 'invalid'
}

export enum CurveType {
  secp256k1 = 'secp256k1',
  secp256r1 = 'secp256r1',
  edwards25519 = 'edwards25519',
  tweedle = 'tweedle'
}

export const SUCCESS_STATUS = 'success';

export const MAINNET = 'mainnet';
export const PREPROD = 'preprod';
export const PREVIEW = 'preview';
export const PREPROD_NETWORK_MAGIC = 1;
export const PREVIEW_NETWORK_MAGIC = 2;

export const SUCCESS_OPERATION_STATE = {
  status: OperationTypeStatus.SUCCESS,
  successful: true
};
export const INVALID_OPERATION_STATE = {
  status: OperationTypeStatus.INVALID,
  successful: false
};

export const OPERATIONS_STATUSES: string[] = Object.values(OperationTypeStatus);

export enum AddressType {
  ENTERPRISE = 'Enterprise',
  BASE = 'Base',
  REWARD = 'Reward',
  POOL_KEY_HASH = 'Pool_Hash'
}

export enum NetworkIdentifier {
  CARDANO_TESTNET_NETWORK = 0,
  CARDANO_MAINNET_NETWORK
}

export enum EraAddressType {
  Shelley,
  Byron
}

export enum CatalystLabels {
  DATA = '61284',
  SIG = '61285'
}

/* eslint-disable no-magic-numbers */
// unlike @typescript-eslint/no-magic-numbers, the base rule doesn't have a `ignoreEnums` option
export enum CatalystDataIndexes {
  VOTING_KEY = 1,
  STAKE_KEY = 2,
  REWARD_ADDRESS = 3,
  VOTING_NONCE = 4
}

export enum CatalystSigIndexes {
  VOTING_SIGNATURE = 1
}
/* eslint-disable no-magic-numbers */

export enum OperatorType {
  AND = 'and',
  OR = 'or'
}
