import { NetworkRepository } from '../db/network-repository';
import { ADA, ADA_DECIMALS } from '../utils/constants';
import { ErrorFactory } from '../utils/errors';
import { BlockService } from './block-service';
import { withNetworkValidation } from './utils/services-helper';

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
        const block = await blockService.findBlock(accountBalanceRequest.block_identifier || {});
        if (block === null) {
          throw ErrorFactory.blockNotFoundError();
        }
        const accountAddress = accountBalanceRequest.account_identifier;
        const details = await blockService.findUtxoByAddressAndBlock(accountAddress.address, block.hash);
        const balanceForAddress = details.reduce((acum, current) => acum + Number(current.value), 0).toString();
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
              metadata: {}
            }
          ],
          metadata: {
            utxos: details
          }
        };
      }
    )
});

export default configure;
