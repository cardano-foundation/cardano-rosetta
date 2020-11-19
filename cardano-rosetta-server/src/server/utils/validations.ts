import { PUBLIC_KEY_BYTES_LENGTH, AddressType } from './constants';

export const isKeyValid = (publicKeyBytes: string, curveType: string): boolean =>
  publicKeyBytes.length === PUBLIC_KEY_BYTES_LENGTH && curveType === 'edwards25519';

export const isAddressTypeValid = (type: string): boolean =>
  [...Object.values(AddressType), '', undefined].includes(type);
