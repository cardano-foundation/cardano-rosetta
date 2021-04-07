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
  POOL_KEY_MISSING: { message: 'Pool key hash is required for stake delegation', code: 4020 },
  INVALID_POOL_KEY_HASH: { message: 'Provided pool key hash has invalid format', code: 4021 },
  TOKEN_BUNDLE_ASSETS_MISSING: { message: 'Assets are required for output operation token bundle', code: 4022 },
  TOKEN_ASSET_VALUE_MISSING: { message: 'Asset value is required for token asset', code: 4023 },
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
  SEND_TRANSACTION_ERROR: { message: 'Error when sending the transaction', code: 5006 }
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
const missingPoolKeyError: CreateErrorFunction = type => buildApiError(Errors.POOL_KEY_MISSING, false, type);
const invalidPoolKeyError: CreateErrorFunction = details => buildApiError(Errors.INVALID_POOL_KEY_HASH, false, details);
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
const tokenBundleAssetsMissingError: CreateErrorFunction = type =>
  buildApiError(Errors.TOKEN_BUNDLE_ASSETS_MISSING, false, type);
const tokenAssetValueMissingError: CreateErrorFunction = type =>
  buildApiError(Errors.TOKEN_ASSET_VALUE_MISSING, false, type);

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
  invalidPublicKeyFormat,
  invalidStakingKeyFormat,
  missingStakingKeyError,
  missingPoolKeyError,
  invalidPoolKeyError,
  parseSignedTransactionError,
  cantBuildSignedTransaction,
  cantBuildWitnessesSet,
  transactionInputsParametersMissingError,
  transactionOutputsParametersMissingError,
  outputsAreBiggerThanInputsError,
  cantCreateSignedTransactionFromBytes,
  cantCreateUnsignedTransactionFromBytes,
  sendTransactionError,
  transactionInputDeserializationError,
  transactionOutputDeserializationError,
  invalidAddressError,
  invalidAddressTypeError,
  invalidOperationTypeError,
  tokenBundleAssetsMissingError,
  tokenAssetValueMissingError
};

export const configNotFoundError: CreateServerErrorFunction = () =>
  new ServerError('Environment configurations needed to run server were not found');
