import StatusCodes from 'http-status-codes';
import { BlockchainRepository } from '../db/blockchain-repository';
import ApiError from '../api-error';

/* eslint-disable camelcase */
export interface BlockService {
  block(request: Components.Schemas.BlockRequest): Promise<Components.Schemas.BlockResponse | Components.Schemas.Error>;
  blockTransaction(
    request: Components.Schemas.BlockTransactionRequest
  ): Promise<Components.Schemas.BlockTransactionResponse | Components.Schemas.Error>;
}

const configure = (repository: BlockchainRepository): BlockService => ({
  async block(request) {
    const result = await repository.findBlock(request.block_identifier.index, request.block_identifier.hash);
    if (result !== null) {
      return {
        block: {
          block_identifier: {
            hash: result.hash,
            index: result.number
          },
          parent_block_identifier: {
            index: result.parent.number,
            hash: result.parent.hash
          },
          timestamp: result.time,
          transactions: []
          // TODO: Do we need to consider metadata as well with slot, epoch, size, slot leader?
        }
      };
    }
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Block not found', false);
  },
  async blockTransaction(request) {
    return {
      transaction: {
        transaction_identifier: {
          hash: '0x2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f'
        },
        operations: [
          {
            operation_identifier: {
              index: 1,
              network_index: 0
            },
            related_operations: [
              {
                index: 0,
                operation_identifier: {
                  index: 0
                }
              }
            ],
            type: 'Transfer',
            status: 'Reverted',
            account: {
              address: '0x3a065000ab4183c6bf581dc1e55a605455fc6d61',
              sub_account: {
                address: '0x6b175474e89094c44da98b954eedeac495271d0f',
                metadata: {}
              },
              metadata: {}
            },
            amount: {
              value: '1238089899992',
              currency: {
                symbol: 'BTC',
                decimals: 8,
                metadata: {
                  Issuer: 'Satoshi'
                }
              },
              metadata: {}
            },
            metadata: {
              asm: '03301a8259a12e35694cc22ebc45fee635f4993064190f6ce96e7fb19a03bb6be2',
              hex: '192293847312348239457438932489'
            }
          }
        ],
        metadata: {
          size: 12378,
          lockTime: 1582272577
        }
      }
    };
  }
});

export default configure;
