import { FastifyRequest } from 'fastify';
import { withNetworkValidation } from '../controllers/controllers-helper';
import { BlockService } from '../services/block-service';
import { mapToAccountBalanceResponse } from '../utils/data-mapper';

export interface AccountController {
  accountBalance(
    request: FastifyRequest<unknown, unknown, unknown, unknown, Components.Schemas.AccountBalanceRequest>
  ): Promise<Components.Schemas.AccountBalanceResponse | Components.Schemas.Error>;
}

const configure = (blockService: BlockService, networkId: string): AccountController => ({
  accountBalance: async request =>
    withNetworkValidation(
      request.body.network_identifier,
      request,
      async () => {
        const logger = request.log;
        const accountBalanceRequest = request.body;
        const accountAddress = accountBalanceRequest.account_identifier.address;
        logger.debug({ accountBalanceRequest: request }, '[accountBalance] Request received');
        logger.info(`[accountBalance] Looking for block: ${accountBalanceRequest.block_identifier || 'latest'}`);
        const blockUtxos = await blockService.findUtxoByAddressAndBlock(
          logger,
          accountBalanceRequest.account_identifier.address,
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
