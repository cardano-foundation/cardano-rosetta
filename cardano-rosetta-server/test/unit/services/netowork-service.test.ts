import { BlockService } from '../../../src/server/services/block-service';
import configure, { TopologyConfig } from '../../../src/server/services/network-service';

describe('Network Service', () => {
  const NETWORK_MAGIC = 123;
  const TESTNET_NETWORK_MAGIC = 1097911063;

  let blockService: BlockService;
  let topologyConfig: TopologyConfig;

  describe('Address type detection', () => {
    it('Return mainnet if networkId is mainnet', () => {
      const service = configure('mainnet', NETWORK_MAGIC, blockService, topologyConfig);
      expect(service.getSupportedNetwork()).toEqual({ networkId: 'mainnet' });
    });
    it('Return testnet if networkId is the main testnet', () => {
      const service = configure('testnet', TESTNET_NETWORK_MAGIC, blockService, topologyConfig);
      expect(service.getSupportedNetwork()).toEqual({ networkId: 'testnet' });
    });
    it('Return the network magic if networkId is not mainnet', () => {
      const service = configure('testnet', NETWORK_MAGIC, blockService, topologyConfig);
      expect(service.getSupportedNetwork()).toEqual({ networkId: NETWORK_MAGIC.toString() });
    });
  });
});
