import StatusCodes from 'http-status-codes';
import { withNetworkValidation } from './utils/services-helper';
import { NetworkRepository } from '../db/network-repository';
import { BlockService } from './block-service';
import { ADA, ADA_DECIMALS } from '../utils/constants';
import { buildApiError, errorMessage } from '../utils/errors';

/* eslint-disable camelcase */
export interface AccountService {
  accountBalance(
    request: Components.Schemas.AccountBalanceRequest
  ): Promise<Components.Schemas.AccountBalanceResponse | Components.Schemas.Error>;
}

const configure = (networkRepository: NetworkRepository, blockService: BlockService): AccountService => ({
  accountBalance: async accountBalanceRequest =>
    withNetworkValidation(
      accountBalanceRequest.network_identifier,
      networkRepository,
      accountBalanceRequest,
      async () => {
        // TODO should i use only address here since we dont have subaccounts? Do we have subaccounts?
        const block = await blockService.findBlock(accountBalanceRequest.block_identifier || {});
        if (block === null) {
          throw buildApiError(StatusCodes.BAD_REQUEST, errorMessage.BLOCK_NOT_FOUND, false);
        }
        const accountAddress = accountBalanceRequest.account_identifier;
        const balanceForAddress = await blockService.findBalanceByAddressAndBlock(accountAddress.address, block.number);
        const details = await blockService.findUtxoByAddressAndBlock(accountAddress.address, block.number);
        return {
          block_identifier: {
            index: block.number,
            hash: block.hash
          },
          balances: [
            {
              value: balanceForAddress,
              currency: {
                symbol: ADA,
                decimals: ADA_DECIMALS,
                metadata: {
                  issuer: accountAddress.address
                }
              },
              metadata: { utxo_details: details }
            }
          ],
          metadata: {
            sequence_number: 23
          }
        };
      }
    )
});

export default configure;
