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
  OUPUTS_BIGGER_THAN_INPUTS_ERROR: {
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
type CreateServerErrorFcuntion = () => ServerError;
const blockNotFoundError: CreateErrorFunction = () => buildApiError(Errors.BLOCK_NOT_FOUND, false);
const invalidBlockchainError: CreateErrorFunction = () => buildApiError(Errors.INVALID_BLOCKCHAIN, false);
const networkNotFoundError: CreateErrorFunction = () => buildApiError(Errors.NETWORK_NOT_FOUND, false);
const networksNotFoundError: CreateErrorFunction = () => buildApiError(Errors.NETWORKS_NOT_FOUND, false);
const notImplentedError: CreateErrorFunction = () => buildApiError(Errors.NOT_IMPLEMENTED, false);
const genesisBlockNotFound: CreateErrorFunction = () => buildApiError(Errors.GENESIS_BLOCK_NOT_FOUND, false);
const transactionNotFound: CreateErrorFunction = () => buildApiError(Errors.TRANSACTION_NOT_FOUND, false);
const addressGenerationError: CreateErrorFunction = () => buildApiError(Errors.ADDRESS_GENERATION_ERROR, false);
const invalidPublicKeyFormat: CreateErrorFunction = () => buildApiError(Errors.INVALID_PUBLIC_KEY_FORMAT, false);
const parseSignedTransactionError: CreateErrorFunction = () =>
  buildApiError(Errors.PARSE_SIGNED_TRANSACTION_ERROR, false);
const cantBuildWitnessesSet: CreateErrorFunction = () => buildApiError(Errors.CANT_BUILD_WITNESSES_SET, false);
const cantBuildSignedTransaction: CreateErrorFunction = () => buildApiError(Errors.CANT_CREATE_SIGN_TRANSACTION, false);
const transactionInputsParametersMissingError: CreateErrorFunction = (details?: string) =>
  buildApiError(Errors.TRANSACTION_INPUTS_PARAMETERS_MISSING_ERROR, false, details);
const transactionOutputsParametersMissingError: CreateErrorFunction = (details?: string) =>
  buildApiError(Errors.TRANSACTION_OUTPUTS_PARAMETERS_MISSING_ERROR, false, details);
const outputsAreBiggerThanInputsError: CreateErrorFunction = () =>
  buildApiError(Errors.OUPUTS_BIGGER_THAN_INPUTS_ERROR, false);
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

export const ErrorFactory = {
  blockNotFoundError,
  networkNotFoundError,
  invalidBlockchainError,
  networksNotFoundError,
  notImplentedError,
  genesisBlockNotFound,
  transactionNotFound,
  addressGenerationError,
  invalidPublicKeyFormat,
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
  transactionOutputDeserializationError
};

export const configNotFoundError: CreateServerErrorFcuntion = () =>
  new ServerError('Environment configurations needed to run server were not found');
