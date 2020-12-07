import { FastifyRequest } from 'fastify';
import { withNetworkValidation } from '../controllers/controllers-helper';
import { BlockService } from '../services/block-service';
import { CardanoService } from '../services/cardano-services';
import { mapToAccountBalanceResponse } from '../utils/data-mapper';
import { ErrorFactory } from '../utils/errors';

export interface AccountController {
  accountBalance(
    request: FastifyRequest<unknown, unknown, unknown, unknown, Components.Schemas.AccountBalanceRequest>
  ): Promise<Components.Schemas.AccountBalanceResponse | Components.Schemas.Error>;
}

const configure = (
  blockService: BlockService,
  cardanoService: CardanoService,
  networkId: string
): AccountController => ({
  accountBalance: async request =>
    withNetworkValidation(
      request.body.network_identifier,
      request,
      async () => {
        const logger = request.log;
        const accountBalanceRequest = request.body;
        const accountAddress = accountBalanceRequest.account_identifier.address;
        logger.debug({ accountBalanceRequest: request.body }, '[accountBalance] Request received');
        if (cardanoService.getAddressType(accountAddress) === null)
          throw ErrorFactory.invalidAddressError(accountAddress);
        logger.info(`[accountBalance] Looking for block: ${accountBalanceRequest.block_identifier || 'latest'}`);
        const blockUtxos = await blockService.findUtxoByAddressAndBlock(
          logger,
          accountAddress,
          accountBalanceRequest.block_identifier?.index,
          accountBalanceRequest.block_identifier?.hash
        );
        const toReturn = mapToAccountBalanceResponse(blockUtxos);
        logger.debug(toReturn, '[accountBalance] About to return ');
        return toReturn;
      },
      request.log,
      networkId
    )
});

export default configure;
