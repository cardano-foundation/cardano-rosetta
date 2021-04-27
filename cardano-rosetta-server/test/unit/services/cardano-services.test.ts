import configure, { CardanoService } from '../../../src/server/services/cardano-services';
import { EraAddressType } from '../../../src/server/utils/constants';
const minKeyDeposit = 2000000;
const poolDeposit = 500000000;

describe('Cardano Service', () => {
  let cardanoService: CardanoService;

  beforeAll(() => {
    cardanoService = configure({ minFeeA: 0, minFeeB: 0 }, { keyDeposit: minKeyDeposit, poolDeposit });
  });

  describe('Address type detection', () => {
    it('Should detect a valid bech32 Shelley mainnet address', () => {
      const addressType = cardanoService.getEraAddressType(
        'addr1q9ccruvttlfsqwu47ndmapxmk5xa8cc9ngsgj90290tfpysc6gcpmq6ejwgewr49ja0kghws4fdy9t2zecvd7zwqrheqjze0c7'
      );
      expect(addressType).toBe(EraAddressType.Shelley);
    });

    it('Should properly detect a valid bech32 Shelley testnet address', () => {
      const addressType = cardanoService.getEraAddressType(
        'addr_test1vru64wlzn85v7fecg0mz33lh00wlggqtquvzzuhf6vusyes32jz9w'
      );
      expect(addressType).toBe(EraAddressType.Shelley);
    });

    it('Should detect a valid Byron address', () => {
      const addressType = cardanoService.getEraAddressType(
        'DdzFFzCqrht9fvu17fiXwiuP82kKEhiGsDByRE7PWfMktrd8Jc1jWqKxubpz21mWjUMh8bWsKuP5JUF9CgUefyABDBsq326ybHrEhB7M'
      );
      expect(addressType).toBe(EraAddressType.Byron);
    });

    it('Should detect a valid Icarus address', () => {
      const addressType = cardanoService.getEraAddressType(
        'Ae2tdPwUPEZGvXJ3ebp4LDgBhbxekAH2oKZgfahKq896fehv8oCJxmGJgLt'
      );
      expect(addressType).toBe(EraAddressType.Byron);
    });

    it('Should return null if address is wrong', () => {
      const addressType = cardanoService.getEraAddressType('WRONG');
      expect(addressType).toBe(null);
    });
  });
});
