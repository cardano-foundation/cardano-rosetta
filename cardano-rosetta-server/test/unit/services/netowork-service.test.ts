import { BlockService } from '../../../src/server/services/block-service';
import configure, { TopologyConfig } from '../../../src/server/services/network-service';
import { withNetworkValidation } from '../../../src/server/controllers/controllers-helper';
import { Logger } from 'fastify';

describe('Network Service', () => {
  const NETWORK_MAGIC = 123;
  const PREPROD_NETWORK_MAGIC = 1;

  let blockService: BlockService;
  let topologyConfig: TopologyConfig;

  describe('Network type detection', () => {
    it('Return mainnet if networkId is mainnet', () => {
      const service = configure('mainnet', NETWORK_MAGIC, blockService, topologyConfig);
      expect(service.getSupportedNetwork()).toEqual({ networkId: 'mainnet' });
    });
    it('Return preprod if networkId matches', () => {
      const service = configure('preprod', PREPROD_NETWORK_MAGIC, blockService, topologyConfig);
      expect(service.getSupportedNetwork()).toEqual({ networkId: 'preprod' });
    });
    it('Return the network magic if networkId is not a known network', () => {
      const service = configure('preprod', NETWORK_MAGIC, blockService, topologyConfig);
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
      const service = configure('preprod', NETWORK_MAGIC, blockService, topologyConfig);
      const validation = async () =>
        await withNetworkValidation(
          { blockchain: 'cardano', network: 'preprod' },
          undefined,
          () => {
            fail('It should have thrown an error');
          },
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

    it('Should properly detect preprod', async () => {
      const service = configure('preprod', PREPROD_NETWORK_MAGIC, blockService, topologyConfig);
      const validation = async () =>
        await withNetworkValidation(
          { blockchain: 'cardano', network: 'preprod' },
          undefined,
          () => true,
          logger,
          service
        );
      await expect(validation()).resolves.toBe(true);
    });

    it('Should properly detect another network', async () => {
      const service = configure('preprod', NETWORK_MAGIC, blockService, topologyConfig);
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
