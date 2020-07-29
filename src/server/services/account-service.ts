import { Logger } from 'fastify';
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

const parseUtxoDetails = (utxoDetails: Utxo[], logger: Logger): Components.Schemas.Coin[] => {
  logger.info(`[accountBalance] About to parse ${utxoDetails.length} utxo details`);
  return utxoDetails.map(utxoDetail => ({
    amount: { value: utxoDetail.value, currency: { symbol: ADA, decimals: ADA_DECIMALS } },
    coin_identifier: { identifier: `${utxoDetail.transactionHash}:${utxoDetail.index}` }
  }));
};

const configure = (
  networkRepository: NetworkRepository,
  blockService: BlockService,
  logger: Logger
): AccountService => ({
  accountBalance: async accountBalanceRequest =>
    withNetworkValidation(
      accountBalanceRequest.network_identifier,
      networkRepository,
      accountBalanceRequest,
      async () => {
        logger.debug({ accountBalanceRequest }, '[accountBalance] Request received');
        logger.info(`[accountBalance] Looking for block: ${accountBalanceRequest.block_identifier || 'latest'}`);
        const block = await blockService.findBlock(accountBalanceRequest.block_identifier || {});
        if (block === null) {
          logger.error('[accountBalance] Block not found');
          throw ErrorFactory.blockNotFoundError();
        }
        const accountAddress = accountBalanceRequest.account_identifier;
        logger.info(`[accountBalance] Looking for utxo details for address: ${accountAddress}`);
        const utxoDetails = await blockService.findUtxoByAddressAndBlock(accountAddress.address, block.hash);
        logger.debug(`[accountBalance] Found ${utxoDetails.length} utxo details for addres ${accountAddress}: `);
        logger.info(`[accountBalance] Computing balance available for address ${accountAddress}`);
        const balanceForAddress = utxoDetails.reduce((acum, current) => acum + Number(current.value), 0).toString();
        logger.info(`[accountBalance] Balance for address ${accountAddress} is: `, balanceForAddress);
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
          coins: parseUtxoDetails(utxoDetails, logger)
        };
      },
      logger
    )
});

export default configure;
