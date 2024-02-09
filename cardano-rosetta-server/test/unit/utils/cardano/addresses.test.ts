/* eslint-disable max-len */
import { getAddressFromHexString } from '../../../../src/server/utils/cardano/addresses';
import { usingAutoFree } from '../../../../src/server/utils/freeable';
import { Address } from '@emurgo/cardano-serialization-lib-nodejs';

describe('Addresses', () => {
  describe('getAddressFromHexString', () => {
    it('return an Address from a valid hex string', () => {
      const validAddress =
        '01663f13971437b6e2f09771c06534c4ffd95950ac94390f34e091b5ba8cc49dce93335c74cb3aaf8e0f7eacb8813ae4a107383ee7649985e6';
      expect(usingAutoFree(scope => getAddressFromHexString(scope, validAddress))).toBeInstanceOf(Address);
    });
    it('return undefined from a hex string that does not represent an Address', () => {
      const validAddress = 'fff';
      expect(usingAutoFree(scope => getAddressFromHexString(scope, validAddress))).toEqual(undefined);
    });
  });
});
