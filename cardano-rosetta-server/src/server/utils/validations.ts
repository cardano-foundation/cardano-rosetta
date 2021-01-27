import { PUBLIC_KEY_BYTES_LENGTH, AddressType, CurveType, ASSET_NAME_LENGTH, POLICY_ID_LENGTH } from './constants';

export const VALID_CURVE_TYPE = CurveType.edwards25519;

export const isKeyValid = (publicKeyBytes: string, curveType: string): boolean =>
  publicKeyBytes.length === PUBLIC_KEY_BYTES_LENGTH && curveType === CurveType.edwards25519;

export const isAddressTypeValid = (type: string): boolean =>
  [...Object.values(AddressType), '', undefined].includes(type);

export const isTokenNameValid = (name: string): boolean =>
  new RegExp(`^[0-9a-fA-F]{0,${ASSET_NAME_LENGTH}}$`).test(name);

export const isPolicyIdValid = (policyId: string): boolean =>
  new RegExp(`^[0-9a-fA-F]{${POLICY_ID_LENGTH}}$`).test(policyId);
