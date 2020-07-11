import { hashFormatter } from '../utils/formatters';
import { Pool } from 'pg';

export interface Block {
  hash: string;
  number: number;
  createdAt: number;
  previousBlockHash: string;
  transactionsCount: number;
  createdBy: string;
  size: number;
  epochNo: number;
  slotNo: number;
  // transactions: Transaction[];
}

export interface BlockchainRepository {
  /**
   * Finds a block based on the given block number or hash. If non sent, latest (tip) block information
   * is retrieved
   *
   * @param blockNumber
   * @param blockHash
   */
  findBlock(number?: number, blockHash?: string): Promise<Block | null>;
}

const findBlockQuery = (blockNumber?: number, blockHash?: string) => `
SELECT 
  b1.number,
  b1.hash,
  b1."createdAt",
  b1."previousBlockHash",
  b1."transactionsCount",
  b1."createdBy",
  b1.size,
  b1."transactionsCount",
  b1."epochNo",
  b1."slotNo"
FROM 
  "Block" b1
WHERE
  ${blockNumber ? 'b1.number = $1' : '$1 = $1'} AND
  ${blockHash ? 'b1.hash = $2' : '$2 = $2'}
LIMIT 1
`;

export const configure = (databaseInstance: Pool): BlockchainRepository => ({
  async findBlock(blockNumber?: number, blockHash?: string): Promise<Block | null> {
    const query = findBlockQuery(blockNumber, blockHash);
    // Add paramter or short-circuit it
    const parameters = [
      blockNumber ? blockNumber : true,
      blockHash ? Buffer.from(blockHash.replace('0x', ''), 'hex') : true
    ];
    const result = await databaseInstance.query(query, parameters);
    /* eslint-disable camelcase */
    if (result.rows.length === 1) {
      const {
        number,
        hash,
        createdAt,
        previousBlockHash,
        transactionsCount,
        createdBy,
        size,
        epochNo,
        slotNo
      } = result.rows[0];
      return {
        number,
        hash: hashFormatter(hash),
        createdAt,
        previousBlockHash: hashFormatter(previousBlockHash),
        transactionsCount,
        createdBy,
        size,
        epochNo,
        slotNo
      };
    }
    return null;
  }
});
