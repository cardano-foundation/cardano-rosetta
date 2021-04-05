import { FastifyRequest } from 'fastify';
import { withNetworkValidation } from '../controllers/controllers-helper';
import { BlockService } from '../services/block-service';
import { CardanoService } from '../services/cardano-services';
import { NetworkService } from '../services/network-service';
import { mapToAccountBalanceResponse, mapToAccountCoinsResponse } from '../utils/data-mapper';
import { ErrorFactory } from '../utils/errors';
import { isPolicyIdValid, isTokenNameValid } from '../utils/validations';
import { ADA } from '../utils/constants';
export interface AccountController {
  accountBalance(
    request: FastifyRequest<unknown, unknown, unknown, unknown, Components.Schemas.AccountBalanceRequest>
  ): Promise<Components.Schemas.AccountBalanceResponse | Components.Schemas.Error>;
  accountCoins(
    request: FastifyRequest<unknown, unknown, unknown, unknown, Components.Schemas.AccountCoinsRequest>
  ): Promise<Components.Schemas.AccountCoinsResponse | Components.Schemas.Error>;
}

const configure = (
  blockService: BlockService,
  cardanoService: CardanoService,
  networkService: NetworkService
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
        if (cardanoService.getEraAddressType(accountAddress) === null)
          throw ErrorFactory.invalidAddressError(accountAddress);
        logger.info(`[accountBalance] Looking for block: ${accountBalanceRequest.block_identifier || 'latest'}`);
        const blockBalanceData = await blockService.findBalanceDataByAddressAndBlock(
          logger,
          accountAddress,
          accountBalanceRequest.block_identifier?.index,
          accountBalanceRequest.block_identifier?.hash
        );
        const toReturn = mapToAccountBalanceResponse(blockBalanceData);
        logger.debug(toReturn, '[accountBalance] About to return ');
        return toReturn;
      },
      request.log,
      networkService
    ),
  accountCoins: async request =>
    withNetworkValidation(
      request.body.network_identifier,
      request,
      async () => {
        const logger = request.log;
        const accountCoinsRequest = request.body;
        const accountAddress = accountCoinsRequest.account_identifier.address;
        const { currencies } = accountCoinsRequest;
        logger.debug({ accountBalanceRequest: request.body }, '[accountCoins] Request received');
        if (cardanoService.getEraAddressType(accountAddress) === null)
          throw ErrorFactory.invalidAddressError(accountAddress);
        currencies?.forEach(({ symbol, metadata }) => {
          if (!isTokenNameValid(symbol)) throw ErrorFactory.invalidTokenNameError(`Given name is ${symbol}`);
          if (!isPolicyIdValid(metadata.policyId))
            throw ErrorFactory.invalidPolicyIdError(`Given policy id is ${metadata.policyId}`);
        });
        // if ADA is requested as currency then all coins will be returned
        const currenciesRequested =
          currencies && !currencies.map(currency => currency.symbol).includes(ADA) ? currencies : [];
        const blockUtxos = await blockService.findCoinsDataByAddress(logger, accountAddress, currenciesRequested);
        const toReturn = mapToAccountCoinsResponse(blockUtxos);
        logger.debug(toReturn, '[accountCoins] About to return ');
        return toReturn;
      },
      request.log,
      networkService
    )
});

export default configure;
