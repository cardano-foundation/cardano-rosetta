import { Logger } from 'pino';
import { CardanoService, NetworkIdentifier } from './cardano-services';
import { NetworkRepository } from '../db/network-repository';
import { withNetworkValidation } from './utils/services-helper';
import { ErrorFactory } from '../utils/errors';
import { BlockService } from './block-service';
import { MAINNET } from '../utils/constants';

export interface ConstructionService {
  constructionDerive(
    request: Components.Schemas.ConstructionDeriveRequest
  ): Promise<Components.Schemas.ConstructionDeriveResponse | Components.Schemas.Error>;

  constructionPreprocess(
    request: Components.Schemas.ConstructionDeriveRequest
  ): Promise<Components.Schemas.ConstructionDeriveResponse | Components.Schemas.Error>;

  constructionMetadata(
    request: Components.Schemas.ConstructionMetadataRequest
  ): Promise<Components.Schemas.ConstructionMetadataResponse | Components.Schemas.Error>;

  constructionPayloads(
    request: Components.Schemas.ConstructionPayloadsRequest
  ): Promise<Components.Schemas.ConstructionPayloadsResponse | Components.Schemas.Error>;

  constructionCombine(
    request: Components.Schemas.ConstructionCombineRequest
  ): Promise<Components.Schemas.ConstructionCombineResponse | Components.Schemas.Error>;

  constructionParse(
    request: Components.Schemas.ConstructionParseRequest
  ): Promise<Components.Schemas.ConstructionParseResponse | Components.Schemas.Error>;

  constructionHash(
    request: Components.Schemas.ConstructionHashRequest
  ): Promise<Components.Schemas.TransactionIdentifierResponse | Components.Schemas.Error>;

  constructionSubmit(
    request: Components.Schemas.ConstructionSubmitRequest
  ): Promise<Components.Schemas.TransactionIdentifierResponse | Components.Schemas.Error>;
}

const getNetworkIdentifierByRequestParameters = (
  networkRequestParameters: Components.Schemas.NetworkIdentifier
): NetworkIdentifier => {
  if (networkRequestParameters.network === MAINNET) {
    return NetworkIdentifier.CARDANO_MAINNET_NETWORK;
  }
  return NetworkIdentifier.CARDANO_TESTNET_NETWORK;
};

const configure = (
  cardanoService: CardanoService,
  networkRepository: NetworkRepository,
  blockService: BlockService,
  logger: Logger
): ConstructionService => ({
  constructionDerive: async request =>
    withNetworkValidation(
      request.network_identifier,
      networkRepository,
      request,
      async () => {
        const publicKey = request.public_key;
        const networkIdentifier = getNetworkIdentifierByRequestParameters(request.network_identifier);
        const address = cardanoService.generateAddress(networkIdentifier, publicKey);
        if (!address) {
          logger.error('[constructionDerive] There was an error generating address');
          throw ErrorFactory.addressGenerationError();
        }
        return {
          address
        };
      },
      logger
    ),
  constructionHash: async request =>
    withNetworkValidation(
      request.network_identifier,
      networkRepository,
      request,
      async () => {
        const signedTransaction = request.signed_transaction;
        logger.info('[constructionHash] About to get hash of signed transaction');
        const transactionHash = cardanoService.getHashOfSignedTransaction(signedTransaction);
        logger.info('[constructionHash] About to return hash of signed transaction');
        // eslint-disable-next-line camelcase
        return { transaction_identifier: { hash: transactionHash } };
      },
      logger
    ),
  async constructionPreprocess(request) {
    return {
      code: 1,
      message: 'string',
      retriable: true
    };
  },
  constructionMetadata: async request =>
    withNetworkValidation(
      request.network_identifier,
      networkRepository,
      request,
      async () => {
        const ttlOffset = request.options.relative_ttl;
        const latestBlock = await blockService.getLatestBlock();
        const ttl = (BigInt(latestBlock.slotNo) + BigInt(ttlOffset)).toString();
        return { metadata: { ttl } };
      },
      logger
    ),
  async constructionPayloads(request) {
    return {
      code: 3,
      message: 'string',
      retriable: true
    };
  },
  constructionCombine: async request =>
    withNetworkValidation(
      request.network_identifier,
      networkRepository,
      request,
      async () => {
        logger.info('[constructionCombine] Request received to sign a transaction');
        const signedTransaction = cardanoService.signTransaction(
          request.unsigned_transaction,
          request.signatures.map(signature => ({
            signature: signature.hex_bytes,
            publicKey: signature.public_key.hex_bytes
          }))
        );
        logger.info({ signedTransaction }, '[constructionCombine] About to return signed transaction');
        // eslint-disable-next-line camelcase
        return { signed_transaction: signedTransaction };
      },
      logger
    ),
  async constructionParse(request) {
    return {
      code: 5,
      message: 'string',
      retriable: true
    };
  },
  async constructionSubmit(request) {
    return {
      code: 7,
      message: 'string',
      retriable: true
    };
  }
});

export default configure;
