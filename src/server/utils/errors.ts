import StatusCodes from 'http-status-codes';
import ApiError, { NotImplementedError } from '../api-error';

export enum errorMessage {
  BLOCK_NOT_FOUND = 'Block not found',
  NETWORK_NOT_FOUND = 'Network not found',
  NETWORKS_NOT_FOUND = 'Networks not found',
  INVALID_BLOCKCHAIN = 'Invalid blockchain',
  NOT_IMPLEMENTED = 'Not implemented',
  TOPOLOGY_FILE_NOT_FOUND = 'Topology file not found',
  GENESIS_BLOCK_NOT_FOUND = 'Genesis block not found'
}

export const buildApiError = (code: number, message: string, retriable: boolean, details?: string): ApiError =>
  new ApiError(code, message, retriable, details);

// I think we could use these to instantiate ApiError
const blockNotFoundError = buildApiError(StatusCodes.BAD_REQUEST, errorMessage.BLOCK_NOT_FOUND, false);
const invalidBlockchainError = buildApiError(StatusCodes.BAD_REQUEST, errorMessage.INVALID_BLOCKCHAIN, false);
const networkNotFoundError = buildApiError(StatusCodes.BAD_REQUEST, errorMessage.NETWORK_NOT_FOUND, false);
const networksNotFoundError = buildApiError(StatusCodes.BAD_REQUEST, errorMessage.NETWORKS_NOT_FOUND, false);
const topoloyFileNotFound = buildApiError(
  StatusCodes.INTERNAL_SERVER_ERROR,
  errorMessage.TOPOLOGY_FILE_NOT_FOUND,
  false
);
const notImplentedError = new NotImplementedError();
const genesisBlockNotFound = buildApiError(StatusCodes.BAD_REQUEST, errorMessage.GENESIS_BLOCK_NOT_FOUND, false);

export const errors = [
  blockNotFoundError,
  networkNotFoundError,
  invalidBlockchainError,
  networksNotFoundError,
  notImplentedError,
  topoloyFileNotFound,
  genesisBlockNotFound
];
