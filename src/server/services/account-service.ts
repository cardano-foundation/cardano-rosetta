import { NetworkRepository } from '../db/network-repository';
import { ADA, ADA_DECIMALS } from '../utils/constants';
import { ErrorFactory } from '../utils/errors';
import { BlockService } from './block-service';
import { withNetworkValidation } from './utils/services-helper';
import { Utxo } from '../db/blockchain-repository';

/* eslint-disable camelcase */
export interface AccountService {
  accountBalance(
    request: Components.Schemas.AccountBalanceRequest
  ): Promise<Components.Schemas.AccountBalanceResponse | Components.Schemas.Error>;
}

const parseUtxoDetails = (utxoDetails: Utxo[]): Components.Schemas.Coin[] =>
  utxoDetails.map(utxoDetail => ({
    amount: { value: utxoDetail.value, currency: { symbol: ADA, decimals: ADA_DECIMALS } },
    coin_identifier: { identifier: utxoDetail.transactionHash }
  }));

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
        const utxoDetails = await blockService.findUtxoByAddressAndBlock(accountAddress.address, block.hash);
        const balanceForAddress = utxoDetails.reduce((acum, current) => acum + Number(current.value), 0).toString();
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
          coins: parseUtxoDetails(utxoDetails)
        };
      }
    )
});

export default configure;
