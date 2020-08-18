import { FastifyRequest } from 'fastify';
import { CardanoService, PUBLIC_KEY_BYTES_LENGTH } from '../services/cardano-services';
import { ConstructionService } from '../services/construction-service';
import {
  constructPayloadsForTransactionBody,
  decodeExtraData,
  encodeExtraData,
  getNetworkIdentifierByRequestParameters,
  mapToConstructionHashResponse
} from '../utils/data-mapper';
import { ErrorFactory } from '../utils/errors';
import { withNetworkValidation } from './controllers-helper';
import { CardanoCli } from '../utils/cardanonode-cli';

export interface ConstructionController {
  constructionDerive(
    request: FastifyRequest<unknown, unknown, unknown, unknown, Components.Schemas.ConstructionDeriveRequest>
  ): Promise<Components.Schemas.ConstructionDeriveResponse | Components.Schemas.Error>;

  constructionPreprocess(
    request: FastifyRequest<unknown, unknown, unknown, unknown, Components.Schemas.ConstructionPreprocessRequest>
  ): Promise<Components.Schemas.ConstructionPreprocessResponse | Components.Schemas.Error>;

  constructionMetadata(
    request: FastifyRequest<unknown, unknown, unknown, unknown, Components.Schemas.ConstructionMetadataRequest>
  ): Promise<Components.Schemas.ConstructionMetadataResponse | Components.Schemas.Error>;

  constructionPayloads(
    request: FastifyRequest<unknown, unknown, unknown, unknown, Components.Schemas.ConstructionPayloadsRequest>
  ): Promise<Components.Schemas.ConstructionPayloadsResponse | Components.Schemas.Error>;

  constructionCombine(
    request: FastifyRequest<unknown, unknown, unknown, unknown, Components.Schemas.ConstructionCombineRequest>
  ): Promise<Components.Schemas.ConstructionCombineResponse | Components.Schemas.Error>;

  constructionParse(
    request: FastifyRequest<unknown, unknown, unknown, unknown, Components.Schemas.ConstructionParseRequest>
  ): Promise<Components.Schemas.ConstructionParseResponse | Components.Schemas.Error>;

  constructionHash(
    request: FastifyRequest<unknown, unknown, unknown, unknown, Components.Schemas.ConstructionHashRequest>
  ): Promise<Components.Schemas.TransactionIdentifierResponse | Components.Schemas.Error>;

  constructionSubmit(
    request: FastifyRequest<unknown, unknown, unknown, unknown, Components.Schemas.ConstructionSubmitRequest>
  ): Promise<Components.Schemas.TransactionIdentifierResponse | Components.Schemas.Error>;
}

const isKeyValid = (publicKeyBytes: string, curveType: string): boolean =>
  publicKeyBytes.length === PUBLIC_KEY_BYTES_LENGTH && curveType === 'edwards25519';

const configure = (
  constructionService: ConstructionService,
  cardanoService: CardanoService,
  cardanoCli: CardanoCli,
  networkId: string
): ConstructionController => ({
  constructionDerive: async request =>
    withNetworkValidation(
      request.body.network_identifier,
      request,
      async () => {
        const logger = request.log;
        const publicKey = request.body.public_key;
        const networkIdentifier = getNetworkIdentifierByRequestParameters(request.body.network_identifier);

        logger.info('[constructionDerive] About to check if public key has valid length and curve type');
        if (!isKeyValid(publicKey.hex_bytes, publicKey.curve_type)) {
          logger.info('[constructionDerive] Public key has an invalid format');
          throw ErrorFactory.invalidPublicKeyFormat();
        }
        logger.info('[constructionDerive] Public key has a valid format');

        logger.info(request.body, '[constructionDerive] About to generate address');
        const address = cardanoService.generateAddress(logger, networkIdentifier, publicKey.hex_bytes);
        if (!address) {
          logger.error('[constructionDerive] There was an error generating address');
          throw ErrorFactory.addressGenerationError();
        }
        logger.info(`[constructionDerive] new address is ${address}`);

        return {
          address
        };
      },
      request.log,
      networkId
    ),
  constructionHash: async request =>
    withNetworkValidation(
      request.body.network_identifier,
      request,
      async () => {
        const logger = request.log;
        const [signedTransaction] = await decodeExtraData(request.body.signed_transaction);
        logger.info('[constructionHash] About to get hash of signed transaction');
        const transactionHash = cardanoService.getHashOfSignedTransaction(logger, signedTransaction);
        logger.info('[constructionHash] About to return hash of signed transaction');
        // eslint-disable-next-line camelcase
        return mapToConstructionHashResponse(transactionHash);
      },
      request.log,
      networkId
    ),
  constructionPreprocess: async request =>
    withNetworkValidation(
      request.body.network_identifier,
      request,
      async () => {
        // eslint-disable-next-line camelcase
        const relativeTtl = constructionService.calculateRelativeTtl(request.body.metadata?.relative_ttl);
        // eslint-disable-next-line camelcase
        return { options: { relative_ttl: relativeTtl } };
      },
      request.log,
      networkId
    ),
  constructionMetadata: async request =>
    withNetworkValidation(
      request.body.network_identifier,
      request,
      async () => {
        const ttlOffset = request.body.options.relative_ttl;
        const ttl = (await constructionService.calculateTtl(request.log, ttlOffset)).toString();
        return { metadata: { ttl } };
      },
      request.log,
      networkId
    ),
  constructionPayloads: async request =>
    withNetworkValidation(
      request.body.network_identifier,
      request,
      async () => {
        const logger = request.log;
        const ttl = request.body.metadata.ttl;
        const operations = request.body.operations;
        logger.info(operations, '[constuctionPayloads] Operations about to be processed');
        const unsignedTransaction = cardanoService.createUnsignedTransaction(logger, operations, ttl);
        const payloads = constructPayloadsForTransactionBody(unsignedTransaction.hash, unsignedTransaction.addresses);
        return {
          // eslint-disable-next-line camelcase
          unsigned_transaction: await encodeExtraData(unsignedTransaction.bytes, request.body.operations),
          payloads
        };
      },
      request.log,
      networkId
    ),
  constructionCombine: async request =>
    withNetworkValidation(
      request.body.network_identifier,
      request,
      async () => {
        const logger = request.log;
        logger.info('[constructionCombine] Request received to sign a transaction');
        const [transaction, extraData] = await decodeExtraData(request.body.unsigned_transaction);
        const signedTransaction = cardanoService.buildTransaction(
          logger,
          transaction,
          request.body.signatures.map(signature => ({
            signature: signature.hex_bytes,
            publicKey: signature.public_key.hex_bytes
          }))
        );
        logger.info({ signedTransaction }, '[constructionCombine] About to return signed transaction');
        // eslint-disable-next-line camelcase
        return { signed_transaction: await encodeExtraData(signedTransaction, extraData) };
      },
      request.log,
      networkId
    ),
  constructionParse: async request =>
    withNetworkValidation(
      request.body.network_identifier,
      request,
      async () => {
        const logger = request.log;
        const signed = request.body.signed;
        const networkIdentifier = getNetworkIdentifierByRequestParameters(request.body.network_identifier);
        logger.info(request.body.transaction, '[constructionParse] Processing');
        const [transaction, extraData] = await decodeExtraData(request.body.transaction);
        logger.info({ transaction, extraData }, '[constructionParse] Decoded');
        if (signed) {
          return {
            // eslint-disable-next-line camelcase
            network_identifier: request.body.network_identifier,
            ...cardanoService.parseSignedTransaction(logger, networkIdentifier, transaction, extraData)
          };
        }
        return {
          // eslint-disable-next-line camelcase
          network_identifier: request.body.network_identifier,
          ...cardanoService.parseUnsignedTransaction(logger, networkIdentifier, transaction, extraData)
        };
      },
      request.log,
      networkId
    ),
  constructionSubmit: async request =>
    withNetworkValidation(
      request.body.network_identifier,
      request,
      async () => {
        try {
          const logger = request.log;
          const [signedTransaction] = await decodeExtraData(request.body.signed_transaction);
          logger.info(`[constructionSubmit] About to submit ${signedTransaction}`);
          await cardanoCli.submitTransaction(
            logger,
            signedTransaction,
            request.body.network_identifier.network === 'mainnet'
          );
          logger.info('[constructionHash] About to get hash of signed transaction');
          const transactionHash = cardanoService.getHashOfSignedTransaction(logger, signedTransaction);
          // eslint-disable-next-line camelcase
          return { transaction_identifier: { hash: transactionHash } };
        } catch (error) {
          request.log.error(error);
          return ErrorFactory.sendTransactionError(error.message);
        }
      },
      request.log,
      networkId
    )
});

export default configure;