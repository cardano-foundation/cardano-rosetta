import { PUBLIC_KEY_BYTES_LENGTH, ADA, AddressType, CurveType, ASSET_NAME_LENGTH, POLICY_ID_LENGTH } from './constants';
import { ErrorFactory } from './errors';
import { hexStringToBuffer, isEmptyHexString } from './formatters';
import CardanoWasm from 'cardano-serialization-lib';

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
export const isEd25519KeyHash = (hash: string): boolean => {
  let edd25519Hash: CardanoWasm.Ed25519KeyHash;
  try {
    edd25519Hash = CardanoWasm.Ed25519KeyHash.from_bytes(Buffer.from(hash, 'hex'));
  } catch (error) {
    return false;
  }
  return !!edd25519Hash;
};
export const isEd25519Signature = (hash: string): boolean => {
  let ed25519Signature: CardanoWasm.Ed25519Signature;
  try {
    ed25519Signature = CardanoWasm.Ed25519Signature.from_bytes(hexStringToBuffer(hash));
  } catch (error) {
    return false;
  }
  return !!ed25519Signature;
};
