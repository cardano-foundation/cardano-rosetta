import { mapToAccountBalanceResponse } from '../../../src/server/utils/data-mapper';
import { BlockUtxosMultiAssets } from '../../../src/server/models';

describe('Data Mapper', () => {
  describe('mapToAccountBalanceResponse', () => {
    // Test case reported by Coinbase
    // "error": "reconciliation failure: active reconciliation error for
    // addr_test1vrd26p8d9dlknc4fhevzudcfzuul5qm2znquytugqcw583czzqrpm at
    // 1630464 (computed: 37999999978288983ADA, live: 37999999978288984ADA)"
    it('Should properly process BigInt balances', () => {
      const blockUtxos: BlockUtxosMultiAssets = {
        block: {
          hash: '032349b3b569bc1ecb266b79ae28a5e79834377562a627f0dc99fa3cd1bfd546',
          number: 1627535,
          createdAt: new Date().getMilliseconds(), // not needed
          previousBlockHash: '032349b3b569bc1ecb266b79ae28a5e79834377562a627f0dc99fa3cd1bfd546',
          previousBlockNumber: 1627535,
          transactionsCount: 1,
          createdBy: '7ec249d',
          size: 238,
          epochNo: 75,
          slotNo: '0' // not needed
        },
        utxos: [
          {
            value: '37999999989620601',
            transactionHash: 'c09c523b0a94837dacf08e30f8cc6d5915786b883f822981ea2012551f8699ce',
            index: 1
          }
        ],
        maBalances: []
      };
      const mapped = mapToAccountBalanceResponse(blockUtxos);
      expect(mapped).toEqual({
        balances: [
          {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '37999999989620601'
          }
        ],
        // eslint-disable-next-line camelcase
        block_identifier: {
          hash: '032349b3b569bc1ecb266b79ae28a5e79834377562a627f0dc99fa3cd1bfd546',
          index: 1627535
        }
      });
    });
  });
});
