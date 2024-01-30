import { BlockService } from './block-service';
import { Logger } from 'fastify';

export interface ConstructionService {
  /**
   * Returns the relative ttl if specified or the default one otherwise.
   *
   * @param relativeTtl
   */
  calculateRelativeTtl(relativeTtl?: number): number;

  /**
   * Calculates the absolute ttl based on a delta
   *
   * @param ttlOffset
   */
  calculateTtl(logger: Logger, ttlOffset: number): Promise<number>;
}

const configure = (blockService: BlockService, defaultRelativeTTL: number): ConstructionService => ({
  calculateRelativeTtl: relativeTtl => relativeTtl ?? defaultRelativeTTL,

  calculateTtl: async (logger, ttlOffset) => {
    const latestBlock = await blockService.getLatestBlock(logger);
    return Number(latestBlock.slotNo) + ttlOffset;
  }
});

export default configure;
