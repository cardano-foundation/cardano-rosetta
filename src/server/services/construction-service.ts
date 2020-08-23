import { BlockService } from './block-service';

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
  calculateTtl(ttlOffset: number): Promise<BigInt>;
}

const configure = (blockService: BlockService, defaultRelativeTTL: number): ConstructionService => ({
  calculateRelativeTtl: relativeTtl => (relativeTtl ? relativeTtl : defaultRelativeTTL),

  calculateTtl: async ttlOffset => {
    const latestBlock = await blockService.getLatestBlock();
    return BigInt(latestBlock.slotNo) + BigInt(ttlOffset);
  }
});

export default configure;
