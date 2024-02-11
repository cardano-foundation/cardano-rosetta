import ApiError from '../api-error';
import ServerError from '../server-error';

export interface Error {
  message: string;
  code: number;
}

export enum ErrorTypes {
  BLOCK_NOT_FOUND,
  NETWORK_NOT_FOUND,
  NETWORKS_NOT_FOUND,
  INVALID_BLOCKCHAIN,
  NOT_IMPLEMENTED,
  TOPOLOGY_FILE_NOT_FOUND,
  GENESIS_BLOCK_NOT_FOUND
}

export const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return `Error: ${error.message}`;
  return String(error);
};

export const Errors = {
  BLOCK_NOT_FOUND: { message: 'Block not found', code: 4001 },
  NETWORK_NOT_FOUND: { message: 'Network not found', code: 4002 },
  NETWORKS_NOT_FOUND: { message: 'Networks not found', code: 4003 },
  INVALID_BLOCKCHAIN: { message: 'Invalid blockchain', code: 4004 },
  GENESIS_BLOCK_NOT_FOUND: { message: 'Genesis block not found', code: 4005 },
  TRANSACTION_NOT_FOUND: { message: 'Transaction not found', code: 4006 },
  INVALID_PUBLIC_KEY_FORMAT: { message: 'Invalid public key format', code: 4007 },
  TRANSACTION_INPUTS_PARAMETERS_MISSING_ERROR: {
    message: 'Transaction inputs parameters errors in operations array',
    code: 4008
  },
  TRANSACTION_OUTPUTS_PARAMETERS_MISSING_ERROR: {
    message: 'Transaction outputs parameters errors in operations array',
    code: 4009
  },
  OUTPUTS_BIGGER_THAN_INPUTS_ERROR: {
    message: 'The transaction you are trying to build has more outputs than inputs',
    code: 4010
  },
  CANT_CREATE_SIGNED_TRANSACTION_ERROR: {
    message: 'Cant create signed transaction from transaction bytes',
    code: 4011
  },
  CANT_CREATE_UNSIGNED_TRANSACTION_ERROR: {
    message: 'Cant create unsigned transaction from transaction bytes',
    code: 4012
  },
  TRANSACTION_INPUT_DESERIALIZATION_ERROR: {
    message: 'Cant deserialize transaction input from transaction body',
    code: 4013
  },
  TRANSACTION_OUTPUT_DESERIALIZATION_ERROR: {
    message: 'Cant deserialize transaction output from transaction body',
    code: 4014
  },
  INVALID_ADDRESS: {
    message: 'Provided address is invalid',
    code: 4015
  },
  INVALID_ADDRESS_TYPE: {
    message: 'Provided address type is invalid',
    code: 4016
  },
  INVALID_STAKING_KEY_FORMAT: { message: 'Invalid staking key format', code: 4017 },
  STAKING_KEY_MISSING: { message: 'Staking key is required for this type of address', code: 4018 },
  INVALID_OPERATION_TYPE: {
    message: 'Provided operation type is invalid',
    code: 4019
  },
  POOL_KEY_MISSING: { message: 'Pool key hash is required to operate', code: 4020 },
  TOKEN_BUNDLE_ASSETS_MISSING: { message: 'Assets are required for output operation token bundle', code: 4021 },
  TOKEN_ASSET_VALUE_MISSING: { message: 'Asset value is required for token asset', code: 4022 },
  INVALID_POLICY_ID: { message: 'Invalid policy id', code: 4023 },
  INVALID_TOKEN_NAME: { message: 'Invalid token name', code: 4024 },
  INVALID_POOL_KEY_HASH: { message: 'Provided pool key hash has invalid format', code: 4025 },
  POOL_CERT_MISSING: { message: 'Pool registration certificate is required for pool registration', code: 4026 },
  INVALID_POOL_CERT: { message: 'Invalid pool registration certificate format', code: 4027 },
  INVALID_POOL_CERT_TYPE: { message: 'Invalid certificate type. Expected pool registration certificate', code: 4028 },
  POOL_REGISTRATION_PARAMS_MISSING: { message: 'Pool registration parameters were expected', code: 4029 },
  INVALID_POOL_RELAYS: { message: 'Pool relays are invalid', code: 4030 },
  INVALID_POOL_METADATA: { message: 'Pool metadata is invalid', code: 4031 },
  DNS_NAME_MISSING: { message: 'Dns name expected for pool relay', code: 4032 },
  INVALID_POOL_RELAY_TYPE: { message: 'Invalid pool relay type received', code: 4033 },
  INVALID_POOL_OWNERS: { message: 'Invalid pool owners received', code: 4034 },
  INVALID_POOL_REGISTRATION_PARAMS: { message: 'Invalid pool registration parameters received', code: 4035 },
  MISSING_METADATA_PARAMETERS_FOR_POOL_RETIREMENT: {
    message: 'Mandatory parameter is missing: Epoch',
    code: 4036
  },
  OUTSIDE_VALIDITY_INTERVAL_UTXO: {
    message: 'Error when sending the transaction - OutsideValidityIntervalUTxO',
    code: 4037
  },
  UNSPECIFIED_ERROR: { message: 'An error occurred', code: 5000 },
  NOT_IMPLEMENTED: { message: 'Not implemented', code: 5001 },
  ADDRESS_GENERATION_ERROR: { message: 'Address generation error', code: 5002 },
  PARSE_SIGNED_TRANSACTION_ERROR: { message: 'Parse signed transaction error', code: 5003 },
  CANT_CREATE_SIGN_TRANSACTION: {
    message: 'Cant create signed transaction probably because of unsigned transaction bytes',
    code: 5004
  },
  CANT_BUILD_WITNESSES_SET: {
    message: 'Cant build witnesses set for transaction probably because of provided signatures',
    code: 5005
  },
  SEND_TRANSACTION_ERROR: { message: 'Error when sending the transaction', code: 5006 },
  VOTING_NONCE_NOT_VALID: { message: 'Voting nonce not valid', code: 5007 },
  INVALID_VOTING_SIGNATURE: { message: 'Invalid voting signature', code: 5008 },
  MISSING_VOTING_KEY: { message: 'Voting key is missing', code: 5009 },
  INVALID_VOTING_KEY_FORMAT: { message: 'Voting key format is invalid', code: 5010 },
  MISSING_VOTE_REGISTRATION_METADATA: { message: 'Missing vote registration metadata', code: 5011 },
  CHAIN_CODE_MISSING: { message: 'Missing chain code', code: 5012 },
  INVALID_OPERATION_STATUS: { message: 'Invalid operation status', code: 5013 },
  STATUS_SUCCESS_MATCH_ERROR: { message: 'Given operation status and success state does not match', code: 5014 },
  TX_HASH_COIN_NOT_MATCH: { message: 'Transaction hash does not match to given coin identifier', code: 5015 },
  ADDRESS_AND_ACCOUNT_ID_NOT_MATCH: { message: 'Address and account identifier does not match', code: 5016 },
  BAD_FORMED_COIN_ERROR: { message: 'Coin identifier has an invalid format', code: 5017 }
};

export const buildApiError = (error: Error, retriable: boolean, details?: string): ApiError =>
  new ApiError(error.code, error.message, retriable, details);

type CreateErrorFunction = (details?: string) => ApiError;
type CreateServerErrorFunction = () => ServerError;
const blockNotFoundError: CreateErrorFunction = () => buildApiError(Errors.BLOCK_NOT_FOUND, false);
const invalidBlockchainError: CreateErrorFunction = () => buildApiError(Errors.INVALID_BLOCKCHAIN, false);
const networkNotFoundError: CreateErrorFunction = () => buildApiError(Errors.NETWORK_NOT_FOUND, false);
const networksNotFoundError: CreateErrorFunction = () => buildApiError(Errors.NETWORKS_NOT_FOUND, false);
const unspecifiedError: CreateErrorFunction = details => buildApiError(Errors.UNSPECIFIED_ERROR, true, details);
const notImplementedError: CreateErrorFunction = () => buildApiError(Errors.NOT_IMPLEMENTED, false);
const genesisBlockNotFound: CreateErrorFunction = () => buildApiError(Errors.GENESIS_BLOCK_NOT_FOUND, false);
const transactionNotFound: CreateErrorFunction = () => buildApiError(Errors.TRANSACTION_NOT_FOUND, false);
const addressGenerationError: CreateErrorFunction = () => buildApiError(Errors.ADDRESS_GENERATION_ERROR, false);
const invalidPublicKeyFormat: CreateErrorFunction = () => buildApiError(Errors.INVALID_PUBLIC_KEY_FORMAT, false);
const invalidStakingKeyFormat: CreateErrorFunction = () => buildApiError(Errors.INVALID_STAKING_KEY_FORMAT, false);
const missingStakingKeyError: CreateErrorFunction = type => buildApiError(Errors.STAKING_KEY_MISSING, false, type);
const missingChainCodeError: CreateErrorFunction = type => buildApiError(Errors.CHAIN_CODE_MISSING, false, type);
const missingDnsNameError: CreateErrorFunction = type => buildApiError(Errors.DNS_NAME_MISSING, false, type);
const missingPoolCertError: CreateErrorFunction = type => buildApiError(Errors.POOL_CERT_MISSING, false, type);
const missingPoolKeyError: CreateErrorFunction = type => buildApiError(Errors.POOL_KEY_MISSING, false, type);
const missingPoolRegistrationParameters: CreateErrorFunction = type =>
  buildApiError(Errors.POOL_REGISTRATION_PARAMS_MISSING, false, type);
const invalidPoolRegistrationCert: CreateErrorFunction = type => buildApiError(Errors.INVALID_POOL_CERT, false, type);
const invalidPoolRegistrationCertType: CreateErrorFunction = type =>
  buildApiError(Errors.INVALID_POOL_CERT_TYPE, false, type);
const invalidPoolKeyError: CreateErrorFunction = details => buildApiError(Errors.INVALID_POOL_KEY_HASH, false, details);
const invalidPoolRelaysError: CreateErrorFunction = details =>
  buildApiError(Errors.INVALID_POOL_RELAYS, false, details);
const invalidPoolRegistrationParameters: CreateErrorFunction = details =>
  buildApiError(Errors.INVALID_POOL_REGISTRATION_PARAMS, false, details);
const invalidPoolRelayTypeError: CreateErrorFunction = details =>
  buildApiError(Errors.INVALID_POOL_RELAY_TYPE, false, details);
const invalidPoolOwnersError: CreateErrorFunction = details =>
  buildApiError(Errors.INVALID_POOL_OWNERS, false, details);
const invalidPoolMetadataError: CreateErrorFunction = details =>
  buildApiError(Errors.INVALID_POOL_METADATA, false, details);
const parseSignedTransactionError: CreateErrorFunction = () =>
  buildApiError(Errors.PARSE_SIGNED_TRANSACTION_ERROR, false);
const cantBuildWitnessesSet: CreateErrorFunction = () => buildApiError(Errors.CANT_BUILD_WITNESSES_SET, false);
const cantBuildSignedTransaction: CreateErrorFunction = () => buildApiError(Errors.CANT_CREATE_SIGN_TRANSACTION, false);
const transactionInputsParametersMissingError: CreateErrorFunction = (details?: string) =>
  buildApiError(Errors.TRANSACTION_INPUTS_PARAMETERS_MISSING_ERROR, false, details);
const transactionOutputsParametersMissingError: CreateErrorFunction = (details?: string) =>
  buildApiError(Errors.TRANSACTION_OUTPUTS_PARAMETERS_MISSING_ERROR, false, details);
const outputsAreBiggerThanInputsError: CreateErrorFunction = () =>
  buildApiError(Errors.OUTPUTS_BIGGER_THAN_INPUTS_ERROR, false);
const missingMetadataParametersForPoolRetirement: CreateErrorFunction = () =>
  buildApiError(Errors.MISSING_METADATA_PARAMETERS_FOR_POOL_RETIREMENT, false);
const cantCreateSignedTransactionFromBytes: CreateErrorFunction = () =>
  buildApiError(Errors.CANT_CREATE_SIGNED_TRANSACTION_ERROR, false);
const cantCreateUnsignedTransactionFromBytes: CreateErrorFunction = () =>
  buildApiError(Errors.CANT_CREATE_UNSIGNED_TRANSACTION_ERROR, false);
const sendTransactionError: CreateErrorFunction = (details?: string) =>
  buildApiError(Errors.SEND_TRANSACTION_ERROR, true, details);
const transactionInputDeserializationError: CreateErrorFunction = (details?: string) =>
  buildApiError(Errors.TRANSACTION_INPUT_DESERIALIZATION_ERROR, false, details);
const transactionOutputDeserializationError: CreateErrorFunction = (details?: string) =>
  buildApiError(Errors.TRANSACTION_OUTPUT_DESERIALIZATION_ERROR, false, details);
const invalidAddressError: CreateErrorFunction = address => buildApiError(Errors.INVALID_ADDRESS, true, address);
const invalidAddressTypeError: CreateErrorFunction = type => buildApiError(Errors.INVALID_ADDRESS_TYPE, true, type);
const invalidOperationTypeError: CreateErrorFunction = type => buildApiError(Errors.INVALID_OPERATION_TYPE, true, type);
const invalidPolicyIdError: CreateErrorFunction = (details?: string) =>
  buildApiError(Errors.INVALID_POLICY_ID, false, details);
const invalidTokenNameError: CreateErrorFunction = (details?: string) =>
  buildApiError(Errors.INVALID_TOKEN_NAME, false, details);
const tokenBundleAssetsMissingError: CreateErrorFunction = type =>
  buildApiError(Errors.TOKEN_BUNDLE_ASSETS_MISSING, false, type);
const tokenAssetValueMissingError: CreateErrorFunction = type =>
  buildApiError(Errors.TOKEN_ASSET_VALUE_MISSING, false, type);
const sendOutsideValidityIntervalUtxoError: CreateErrorFunction = (details?: string) =>
  buildApiError(Errors.OUTSIDE_VALIDITY_INTERVAL_UTXO, false, details);
const votingNonceNotValid: CreateErrorFunction = () => buildApiError(Errors.VOTING_NONCE_NOT_VALID, false);
const invalidVotingSignature: CreateErrorFunction = () => buildApiError(Errors.INVALID_VOTING_SIGNATURE, false);
const missingVotingKeyError: CreateErrorFunction = () => buildApiError(Errors.MISSING_VOTING_KEY, false);
const invalidVotingKeyFormat: CreateErrorFunction = () => buildApiError(Errors.INVALID_VOTING_KEY_FORMAT, false);
const missingVoteRegistrationMetadata: CreateErrorFunction = () =>
  buildApiError(Errors.MISSING_VOTE_REGISTRATION_METADATA, false);
const invalidOperationStatus: CreateErrorFunction = (details?: string) =>
  buildApiError(Errors.INVALID_OPERATION_STATUS, false, details);
const statusAndSuccessMatchError: CreateErrorFunction = () => buildApiError(Errors.STATUS_SUCCESS_MATCH_ERROR, false);
const txHashAndCoinNotMatchError: CreateErrorFunction = () => buildApiError(Errors.TX_HASH_COIN_NOT_MATCH, false);
const addressAndAccountIdNotMatchError: CreateErrorFunction = (details?: string) =>
  buildApiError(Errors.ADDRESS_AND_ACCOUNT_ID_NOT_MATCH, false, details);
const badFormedCoinError: CreateErrorFunction = (details?: string) =>
  buildApiError(Errors.BAD_FORMED_COIN_ERROR, false, details);
export const ErrorFactory = {
  blockNotFoundError,
  networkNotFoundError,
  invalidBlockchainError,
  networksNotFoundError,
  unspecifiedError,
  notImplementedError,
  genesisBlockNotFound,
  transactionNotFound,
  addressGenerationError,
  invalidPoolRegistrationCert,
  invalidPoolRegistrationCertType,
  invalidPublicKeyFormat,
  invalidStakingKeyFormat,
  missingChainCodeError,
  missingDnsNameError,
  missingStakingKeyError,
  missingPoolCertError,
  missingPoolKeyError,
  missingPoolRegistrationParameters,
  invalidPoolKeyError,
  invalidPoolRegistrationParameters,
  invalidPoolRelaysError,
  invalidPoolRelayTypeError,
  invalidPoolOwnersError,
  invalidPoolMetadataError,
  parseSignedTransactionError,
  cantBuildSignedTransaction,
  cantBuildWitnessesSet,
  transactionInputsParametersMissingError,
  transactionOutputsParametersMissingError,
  outputsAreBiggerThanInputsError,
  cantCreateSignedTransactionFromBytes,
  cantCreateUnsignedTransactionFromBytes,
  missingMetadataParametersForPoolRetirement,
  sendTransactionError,
  sendOutsideValidityIntervalUtxoError,
  transactionInputDeserializationError,
  transactionOutputDeserializationError,
  invalidPolicyIdError,
  invalidTokenNameError,
  invalidAddressError,
  invalidAddressTypeError,
  invalidOperationTypeError,
  tokenBundleAssetsMissingError,
  tokenAssetValueMissingError,
  votingNonceNotValid,
  invalidVotingSignature,
  missingVotingKeyError,
  invalidVotingKeyFormat,
  missingVoteRegistrationMetadata,
  invalidOperationStatus,
  statusAndSuccessMatchError,
  txHashAndCoinNotMatchError,
  addressAndAccountIdNotMatchError,
  badFormedCoinError
};

export const configNotFoundError: CreateServerErrorFunction = () =>
  new ServerError('Environment configurations needed to run server were not found');

export type nodeOutputToError = {
  error: Error;
  inputPattern: RegExp;
  retriable: boolean;
};

const nodeErrorToRosettaErrorMap: Array<nodeOutputToError> = [
  {
    error: Errors.OUTSIDE_VALIDITY_INTERVAL_UTXO,
    inputPattern: new RegExp('OutsideValidityIntervalUTxO'),
    retriable: false
  }
];

const resolveApiErrorFromNodeSourced = (
  nodeErrorMessage: string,
  errorMappings: nodeOutputToError[]
): Promise<ApiError> => {
  const found: nodeOutputToError[] = errorMappings.filter(error => error.inputPattern.test(nodeErrorMessage));
  if (found.length > 0) {
    const error = found[0].error;
    return Promise.resolve(new ApiError(error.code, error.message, found[0].retriable));
  }
  return Promise.reject('error not found');
};

const resolveApiErrorFromNodeError = (nodeErrorMessage: string): Promise<ApiError> =>
  resolveApiErrorFromNodeSourced(nodeErrorMessage, nodeErrorToRosettaErrorMap);

export const ErrorUtils = {
  resolveApiErrorFromNodeSourced,
  resolveApiErrorFromNodeError
};
