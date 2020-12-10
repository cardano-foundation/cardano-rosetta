import { BlockService } from '../../../src/server/services/block-service';
import configure, { TopologyConfig } from '../../../src/server/services/network-service';
import { withNetworkValidation } from '../../../src/server/controllers/controllers-helper';
import { Logger } from 'fastify';

describe('Network Service', () => {
  const NETWORK_MAGIC = 123;
  const TESTNET_NETWORK_MAGIC = 1097911063;

  let blockService: BlockService;
  let topologyConfig: TopologyConfig;

  describe('Network type detection', () => {
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

  describe('Network validation helper', () => {
    const logger: Logger = {
      ...console,
      // eslint-disable-next-line no-console
      fatal: console.error
    };

    it('Should properly detect an invalid network', async () => {
      const service = configure('testnet', NETWORK_MAGIC, blockService, topologyConfig);
      const validation = async () =>
        await withNetworkValidation(
          { blockchain: 'cardano', network: 'testnet' },
          undefined,
          () => {
            fail('It should have thrown an error');
          },
          // eslint-disable-next-line no-console
          // eslint-disable-next-line no-console
          logger,
          service
        );
      await expect(validation()).rejects.toThrow('Network not found');
    });

    it('Should properly detect mainnet', async () => {
      const service = configure('mainnet', NETWORK_MAGIC, blockService, topologyConfig);
      const validation = async () =>
        await withNetworkValidation(
          { blockchain: 'cardano', network: 'mainnet' },
          undefined,
          () => true,
          logger,
          service
        );
      await expect(validation()).resolves.toBe(true);
    });

    it('Should properly detect testnet', async () => {
      const service = configure('testnet', TESTNET_NETWORK_MAGIC, blockService, topologyConfig);
      const validation = async () =>
        await withNetworkValidation(
          { blockchain: 'cardano', network: 'testnet' },
          undefined,
          () => true,
          logger,
          service
        );
      await expect(validation()).resolves.toBe(true);
    });

    it('Should properly detect another network', async () => {
      const service = configure('testnet', NETWORK_MAGIC, blockService, topologyConfig);
      const validation = async () =>
        await withNetworkValidation(
          { blockchain: 'cardano', network: NETWORK_MAGIC.toString() },
          undefined,
          () => true,
          logger,
          service
        );
      await expect(validation()).resolves.toBe(true);
    });
  });
});
