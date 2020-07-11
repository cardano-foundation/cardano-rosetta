import { hashFormatter } from '../utils/formatters';
import { Pool } from 'pg';

export interface Block {
  hash: string;
  number: number;
  time: number;
  parent: {
    hash: string;
    number: number;
  };
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
  b1.block_no,
  b1.hash,
  b1.time,
  b2.block_no as parent_block_no,
  b2.hash as parent_hash
FROM 
  BLOCK b1
LEFT JOIN block b2 on (b1.block_no - 1) = b2.block_no
WHERE
  ${blockNumber ? 'b1.block_no = $1' : '$1 = $1'} AND
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
      const { block_no, hash, time, parent_block_no, parent_hash } = result.rows[0];
      return {
        number: block_no,
        hash: hashFormatter(hash),
        time,
        parent: {
          number: parent_block_no,
          hash: hashFormatter(parent_hash)
        }
      };
    }
    return null;
  }
});
