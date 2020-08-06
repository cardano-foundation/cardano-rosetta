import ApiError from '../api-error';

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
  NOT_IMPLEMENTED: { message: 'Not implemented', code: 5001 },
  TOPOLOGY_FILE_NOT_FOUND: { message: 'Topology file not found', code: 5002 },
  PAGE_SIZE_NOT_FOUND: { message: 'Page size config not found', code: 5003 },
  ADDRESS_GENERATION_ERROR: { message: 'Address generation error', code: 5004 },
  INVALID_PUBLIC_KEY_FORMAT: { message: 'Invalid public key format', code: 4007 },
  PARSE_SIGNED_TRANSACTION_ERROR: { message: 'Parse signed transaction error', code: 5005 },
  CANT_CREATE_SIGN_TRANSACTION: { message: 'Cant create signed transaction', code: 5006 }
};

export const buildApiError = (error: Error, retriable: boolean, details?: string): ApiError =>
  new ApiError(error.code, error.message, retriable, details);

type CreateErrorFunction = () => ApiError;
const blockNotFoundError: CreateErrorFunction = () => buildApiError(Errors.BLOCK_NOT_FOUND, false);
const invalidBlockchainError: CreateErrorFunction = () => buildApiError(Errors.INVALID_BLOCKCHAIN, false);
const networkNotFoundError: CreateErrorFunction = () => buildApiError(Errors.NETWORK_NOT_FOUND, false);
const networksNotFoundError: CreateErrorFunction = () => buildApiError(Errors.NETWORKS_NOT_FOUND, false);
const topoloyFileNotFound: CreateErrorFunction = () => buildApiError(Errors.TOPOLOGY_FILE_NOT_FOUND, false);
const notImplentedError: CreateErrorFunction = () => buildApiError(Errors.NOT_IMPLEMENTED, false);
const genesisBlockNotFound: CreateErrorFunction = () => buildApiError(Errors.GENESIS_BLOCK_NOT_FOUND, false);
const transactionNotFound: CreateErrorFunction = () => buildApiError(Errors.TRANSACTION_NOT_FOUND, false);
const pageSizeNotFund: CreateErrorFunction = () => buildApiError(Errors.PAGE_SIZE_NOT_FOUND, false);
const addressGenerationError: CreateErrorFunction = () => buildApiError(Errors.ADDRESS_GENERATION_ERROR, false);
const invalidPublicKeyFormat: CreateErrorFunction = () => buildApiError(Errors.INVALID_PUBLIC_KEY_FORMAT, false);
const parseSignedTransactionError: CreateErrorFunction = () =>
  buildApiError(Errors.PARSE_SIGNED_TRANSACTION_ERROR, false);
const cantCreateSignTransaction: CreateErrorFunction = () => buildApiError(Errors.CANT_CREATE_SIGN_TRANSACTION, false);

export const ErrorFactory = {
  blockNotFoundError,
  networkNotFoundError,
  invalidBlockchainError,
  networksNotFoundError,
  notImplentedError,
  topoloyFileNotFound,
  genesisBlockNotFound,
  transactionNotFound,
  pageSizeNotFund,
  addressGenerationError,
  invalidPublicKeyFormat,
  parseSignedTransactionError,
  cantCreateSignTransaction
};
