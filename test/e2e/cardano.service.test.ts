/* eslint-disable camelcase */
import pino from 'pino';
import cardanoService from '../../src/server/services/cardano-services';

const configLogger = () =>
  pino({
    name: 'cardano-rosetta',
    level: process.env.LOGGER_LEVEL,
    enabled: process.env.LOGGER_ENABLED !== 'false'
  });

const MAINNET = 1;
const TESTNET = 0;

/**
 * This test suite does NOT assert any other network than mainnet or testnet
 * because whenever we call this, we have already
 * validated that network is either MAINNET or TESTNET
 */

describe('Cardano service TEST', () => {
  const fakeLogger = configLogger();
  const cardanoServiceInstance = cardanoService(fakeLogger);
  // `cardano-cli shelley address build --payment-verification-key-file verif.txt  --out-file /tmp/address.txt --mainnet`
  test('Should return a valid address when mainnet network and a valid public key is received', () => {
    const result = cardanoServiceInstance.generateAddress(MAINNET, {
      hex_bytes: '1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F',
      curve_type: 'edwards25519'
    });
    expect(result).toEqual('addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx');
  });

  // Test created using
  // `cardano-cli shelley address build --payment-verification-key-file verif.txt  --out-file /tmp/address.txt --testnet-magic 0`
  test('Should return a valid address when testnet network and a valid public key is received', () => {
    const result = cardanoServiceInstance.generateAddress(TESTNET, {
      hex_bytes: '1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F',
      curve_type: 'edwards25519'
    });
    expect(result).toEqual('addr_test1vza5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7c6mzywr');
  });
});
