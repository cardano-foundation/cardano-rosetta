import { Logger } from 'pino';
import { CardanoService, NetworkIdentifier } from './cardano-services';
import { NetworkRepository } from '../db/network-repository';
import { withNetworkValidation } from './utils/services-helper';
import { ErrorFactory } from '../utils/errors';
import { MAINNET, SIGNATURE_TYPE } from '../utils/constants';
import { BlockService } from './block-service';
import { CardanoCli } from '../utils/cardanonode-cli';

export interface ConstructionService {
  constructionDerive(
    request: Components.Schemas.ConstructionDeriveRequest
  ): Promise<Components.Schemas.ConstructionDeriveResponse | Components.Schemas.Error>;

  constructionPreprocess(
    request: Components.Schemas.ConstructionPreprocessRequest
  ): Promise<Components.Schemas.ConstructionPreprocessResponse | Components.Schemas.Error>;

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

const constructPayloadsForTransactionBody = (
  transactionBodyHash: string,
  addresses: string[]
): Components.Schemas.SigningPayload[] =>
  // eslint-disable-next-line camelcase
  addresses.map(address => ({ address, hex_bytes: transactionBodyHash, signature_type: SIGNATURE_TYPE }));

const configure = (
  cardanoService: CardanoService,
  blockService: BlockService,
  cardanoCli: CardanoCli,
  logger: Logger,
  networkId: string
): ConstructionService => ({
  constructionDerive: async request =>
    withNetworkValidation(
      request.network_identifier,
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
      logger,
      networkId
    ),
  constructionHash: async request =>
    withNetworkValidation(
      request.network_identifier,
      request,
      async () => {
        const signedTransaction = request.signed_transaction;
        logger.info('[constructionHash] About to get hash of signed transaction');
        const transactionHash = cardanoService.getHashOfSignedTransaction(signedTransaction);
        logger.info('[constructionHash] About to return hash of signed transaction');
        // eslint-disable-next-line camelcase
        return { transaction_identifier: { hash: transactionHash } };
      },
      logger,
      networkId
    ),
  constructionPreprocess: async request =>
    withNetworkValidation(
      request.network_identifier,
      request,
      async () =>
        // eslint-disable-next-line camelcase
        ({ options: { relative_ttl: request.metadata.relative_ttl } }),
      logger,
      networkId
    ),
  constructionMetadata: async request =>
    withNetworkValidation(
      request.network_identifier,
      request,
      async () => {
        const ttlOffset = request.options.relative_ttl;
        const latestBlock = await blockService.getLatestBlock();
        const ttl = (BigInt(latestBlock.slotNo) + BigInt(ttlOffset)).toString();
        return { metadata: { ttl } };
      },
      logger,
      networkId
    ),
  constructionPayloads: async request =>
    withNetworkValidation(
      request.network_identifier,
      request,
      async () => {
        const ttl = request.metadata.ttl;
        const operations = request.operations;
        const unsignedTransaction = cardanoService.createUnsignedTransaction(operations, ttl);
        const payloads = constructPayloadsForTransactionBody(unsignedTransaction.hash, unsignedTransaction.addresses);
        // eslint-disable-next-line camelcase
        return { unsigned_transaction: unsignedTransaction.bytes, payloads };
      },
      logger,
      networkId
    ),
  constructionCombine: async request =>
    withNetworkValidation(
      request.network_identifier,
      request,
      async () => {
        logger.info('[constructionCombine] Request received to sign a transaction');
        const signedTransaction = cardanoService.buildTransaction(
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
      logger,
      networkId
    ),
  constructionParse: async request =>
    withNetworkValidation(
      request.network_identifier,
      request,
      async () => {
        const signed = request.signed;
        if (signed) {
          return {
            // eslint-disable-next-line camelcase
            network_identifier: request.network_identifier,
            ...cardanoService.parseSignedTransaction(request.transaction)
          };
        }
        return {
          // eslint-disable-next-line camelcase
          network_identifier: request.network_identifier,
          ...cardanoService.parseUnsignedTransaction(request.transaction)
        };
      },
      logger,
      networkId
    ),
  constructionSubmit: async request =>
    withNetworkValidation(
      request.network_identifier,
      request,
      async () => {
        try {
          const signedTransaction = request.signed_transaction;
          logger.info(`[constructionSubmit] About to submit ${signedTransaction}`);
          await cardanoCli.submitTransaction(signedTransaction, request.network_identifier.network === 'mainnet');
          logger.info('[constructionHash] About to get hash of signed transaction');
          const transactionHash = cardanoService.getHashOfSignedTransaction(signedTransaction);
          // eslint-disable-next-line camelcase
          return { transaction_identifier: { hash: transactionHash } };
        } catch (error) {
          logger.error(error);
          return ErrorFactory.sendTransactionError(error.message);
        }
      },
      logger,
      networkId
    )
});

export default configure;
