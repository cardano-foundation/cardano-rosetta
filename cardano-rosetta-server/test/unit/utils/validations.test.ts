/* eslint-disable max-len */
import { isVoteDataValid, isVoteSignatureValid } from '../../../src/server/utils/validations';

describe('Validations', () => {
  describe('isVoteDataValid', () => {
    it('true when vote data metadata format is valid', () => {
      const validDataLabel = {
        '1': '0x8bcec4282239b2cc1a7d8bb294c154c849fc200c7ebd27ef45e610d849bc302a',
        '2': '0x56f29f391a3bb5ff90637b2d2d0a32590214871284b0577e4671b0c1a83f79ba',
        '3':
          '0x01663f13971437b6e2f09771c06534c4ffd95950ac94390f34e091b5ba8cc49dce93335c74cb3aaf8e0f7eacb8813ae4a107383ee7649985e6',
        '4': 26912766
      };
      expect(isVoteDataValid(validDataLabel)).toEqual(true);
    });
    it('true when vote data metadata format is valid besides hex string does not start with 0x', () => {
      const validDataLabel = {
        '1': '8bcec4282239b2cc1a7d8bb294c154c849fc200c7ebd27ef45e610d849bc302a',
        '2': '56f29f391a3bb5ff90637b2d2d0a32590214871284b0577e4671b0c1a83f79ba',
        '3':
          '01663f13971437b6e2f09771c06534c4ffd95950ac94390f34e091b5ba8cc49dce93335c74cb3aaf8e0f7eacb8813ae4a107383ee7649985e6',
        '4': 26912766
      };
      expect(isVoteDataValid(validDataLabel)).toEqual(true);
    });
    it('falsy when there are missing fields', () => {
      const missingFieldsDataLabel = {
        '1': '0x8bcec4282239b2cc1a7d8bb294c154c849fc200c7ebd27ef45e610d849bc302a',
        '2': '0x56f29f391a3bb5ff90637b2d2d0a32590214871284b0577e4671b0c1a83f79ba',
        '4': 26912766
      };
      expect(isVoteDataValid(missingFieldsDataLabel)).toBeFalsy;
    });
    it('false when expected hex string has invalid format', () => {
      const invalidHexStringDataLabel = {
        '1': '0x8bcec4282239b2cc1a7d8bb294c154c849fc200c7ebd27ef45e610d849bc302a',
        '2': 'thisIsNotAHexString',
        '3':
          '0x01663f13971437b6e2f09771c06534c4ffd95950ac94390f34e091b5ba8cc49dce93335c74cb3aaf8e0f7eacb8813ae4a107383ee7649985e6',
        '4': 26912766
      };
      expect(isVoteDataValid(invalidHexStringDataLabel)).toEqual(false);
    });
    it('false when expected number has invalid format', () => {
      const invalidNumberDataLabel = {
        '1': '0x8bcec4282239b2cc1a7d8bb294c154c849fc200c7ebd27ef45e610d849bc302a',
        '2': 'thisIsNotAHexString',
        '3':
          '0x01663f13971437b6e2f09771c06534c4ffd95950ac94390f34e091b5ba8cc49dce93335c74cb3aaf8e0f7eacb8813ae4a107383ee7649985e6',
        '4': 'NaN'
      };
      expect(isVoteDataValid(invalidNumberDataLabel)).toEqual(false);
    });
  });
  describe('isVoteSignatureValid', () => {
    it('true when vote signature metadata format is valid', () => {
      const validSignatureLabel = {
        '1':
          '0xf75f7a54a79352f9d0e2c4de4e8ded8ae9304fa0f3b021754f8d149c90c7b01e1c6bbfdd623c294d82f5e5cbbfc0bd6fd1c674780db4025446e2eafc87f61b0a'
      };
      expect(isVoteSignatureValid(validSignatureLabel)).toEqual(true);
    });
    it('true when vote signature label format is valid besides hex string does not start with 0x', () => {
      const validSignatureLabel = {
        '1':
          'f75f7a54a79352f9d0e2c4de4e8ded8ae9304fa0f3b021754f8d149c90c7b01e1c6bbfdd623c294d82f5e5cbbfc0bd6fd1c674780db4025446e2eafc87f61b0a'
      };
      expect(isVoteSignatureValid(validSignatureLabel)).toEqual(true);
    });
    it('falsy when there is a missing field', () => {
      const invalidSignatureLabel = {
        '2':
          '0xf75f7a54a79352f9d0e2c4de4e8ded8ae9304fa0f3b021754f8d149c90c7b01e1c6bbfdd623c294d82f5e5cbbfc0bd6fd1c674780db4025446e2eafc87f61b0a'
      };
      expect(isVoteSignatureValid(invalidSignatureLabel)).toBeFalsy;
    });
    it('false when expected hex string has invalid format', () => {
      const invalidSignatureLabel = {
        '1': 'thisIsNotAHexString'
      };
      expect(isVoteSignatureValid(invalidSignatureLabel)).toEqual(false);
    });
  });
});
