/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  PUBLIC_KEY_BYTES_LENGTH,
  ADA,
  AddressType,
  CurveType,
  ASSET_NAME_LENGTH,
  POLICY_ID_LENGTH,
  CatalystDataIndexes,
  CatalystSigIndexes,
  SUCCESS_OPERATION_STATE,
  INVALID_OPERATION_STATE,
  OPERATIONS_STATUSES,
  OPERATION_TYPES
} from './constants';
import { ErrorFactory } from './errors';
import { hexStringToBuffer, isEmptyHexString } from './formatters';
import CardanoWasm from '@emurgo/cardano-serialization-lib-nodejs';
import { CoinIdentifier } from '../models';
import { usingAutoFree } from '../utils/freeable';

const tokenNameValidation = new RegExp(`^[0-9a-fA-F]{0,${ASSET_NAME_LENGTH}}$`);

const policyIdValidation = new RegExp(`^[0-9a-fA-F]{${POLICY_ID_LENGTH}}$`);

export const VALID_CURVE_TYPE = CurveType.edwards25519;

export const isKeyValid = (publicKeyBytes: string, curveType: string): boolean =>
  publicKeyBytes.length === PUBLIC_KEY_BYTES_LENGTH && curveType === VALID_CURVE_TYPE;

export const isAddressTypeValid = (type: string): boolean =>
  [...Object.values(AddressType), '', undefined].includes(type);

export const isTokenNameValid = (name: string): boolean => tokenNameValidation.test(name) || isEmptyHexString(name);

export const isPolicyIdValid = (policyId: string): boolean => policyIdValidation.test(policyId);

export const validateCurrencies = (currencies: Components.Schemas.Currency[]): void => {
  currencies.forEach(({ symbol, metadata }) => {
    if (!isTokenNameValid(symbol)) throw ErrorFactory.invalidTokenNameError(`Given name is ${symbol}`);
    if (symbol !== ADA && !isPolicyIdValid(metadata.policyId))
      throw ErrorFactory.invalidPolicyIdError(`Given policy id is ${metadata.policyId}`);
  });
};
export const isEd25519KeyHash = (hash: string): boolean =>
  usingAutoFree(scope => {
    let edd25519Hash: CardanoWasm.Ed25519KeyHash;
    try {
      edd25519Hash = scope.manage(CardanoWasm.Ed25519KeyHash.from_bytes(Buffer.from(hash, 'hex')));
    } catch {
      return false;
    }
    return !!edd25519Hash;
  });

export const isEd25519Signature = (hash: string): boolean =>
  usingAutoFree(scope => {
    let ed25519Signature: CardanoWasm.Ed25519Signature;
    try {
      ed25519Signature = scope.manage(CardanoWasm.Ed25519Signature.from_bytes(hexStringToBuffer(hash)));
    } catch {
      return false;
    }
    return !!ed25519Signature;
  });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHexString = (value: any) => typeof value === 'string' && new RegExp('^(0x)?[0-9a-fA-F]+$').test(value);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateVoteDataFields = (object: any) => {
  const hexStringIndexes = [
    CatalystDataIndexes.REWARD_ADDRESS,
    CatalystDataIndexes.STAKE_KEY,
    CatalystDataIndexes.VOTING_KEY
  ];
  const isValidVotingNonce =
    object[CatalystDataIndexes.VOTING_NONCE] && !Number.isNaN(object[CatalystDataIndexes.VOTING_NONCE]);
  return isValidVotingNonce && hexStringIndexes.every(index => index in object && isHexString(object[index]));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isVoteDataValid = (jsonObject: any): boolean => {
  const isObject = typeof jsonObject === 'object';
  return isObject && validateVoteDataFields(jsonObject);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isVoteSignatureValid = (jsonObject: any): boolean => {
  const isObject = typeof jsonObject === 'object';
  const dataIndexes = Object.keys(CatalystSigIndexes).filter(key => Number.parseInt(key) > 0);
  return isObject && dataIndexes.every(index => index in jsonObject && isHexString(jsonObject[index]));
};

const validateStatus = (status: string): void => {
  const isValid = OPERATIONS_STATUSES.includes(status);
  if (!isValid) {
    throw ErrorFactory.invalidOperationStatus(`Given status is ${status}`);
  }
};

const getOperationState = (status: string) => {
  if (status === SUCCESS_OPERATION_STATE.status) return SUCCESS_OPERATION_STATE;
  return INVALID_OPERATION_STATE;
};

const validateAndGetOperationState = (status: string, success?: boolean): Components.Schemas.OperationStatus => {
  const operationState = getOperationState(status);
  if (success === undefined) return operationState;
  if (success !== operationState.successful) throw ErrorFactory.statusAndSuccessMatchError();
  return operationState;
};

export const validateAndGetStatus = (status?: string, success?: boolean): boolean | undefined => {
  const isStatusUndefined = status === undefined;
  const isSuccessUndefined = success === undefined;

  if (isStatusUndefined && isSuccessUndefined) return;
  // eslint-disable-next-line consistent-return
  if (isStatusUndefined && success !== undefined) return success;
  if (status !== undefined) {
    validateStatus(status);
    const operationState = validateAndGetOperationState(status, success);
    // eslint-disable-next-line consistent-return
    return operationState.successful;
  }
};

export const validateTransactionCoinMatch = (transactionHash?: string, coinIdentifier?: CoinIdentifier): void => {
  if (transactionHash && coinIdentifier && transactionHash !== coinIdentifier.hash) {
    throw ErrorFactory.txHashAndCoinNotMatchError();
  }
};

export const validateAccountIdAddressMatch = (
  address?: string,
  accountIdentifier?: Components.Schemas.AccountIdentifier
): void => {
  if (address && accountIdentifier && address !== accountIdentifier.address) {
    throw ErrorFactory.addressAndAccountIdNotMatchError(
      `Address ${address} does not match account identifier's address ${accountIdentifier.address}`
    );
  }
};

export const validateOperationType = (type: string): void => {
  const isValid = OPERATION_TYPES.includes(type);
  if (!isValid) {
    throw ErrorFactory.invalidOperationTypeError();
  }
};
