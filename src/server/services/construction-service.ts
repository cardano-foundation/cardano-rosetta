import { Logger } from 'pino';
import cbor from 'cbor';
import { CardanoService, NetworkIdentifier } from './cardano-services';
import { NetworkRepository } from '../db/network-repository';
import { withNetworkValidation } from '../controllers/controllers-helper';
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

/**
 * Rosetta Api requires some information during the workflow that's not available in an UTXO based blockchain,
 * for example input amounts. Because of that we need to encode some extra data to be able to recover it, for example,
 * when parsing the transaction. For further explanation see:
 * https://community.rosetta-api.org/t/implementing-the-construction-api-for-utxo-model-coins/100/3
 *
 * CBOR is being used to follow standard Cardano serialization library
 *
 * @param transaction
 * @param extraData
 */
// TODO: this function is going to be moved when implementing https://github.com/input-output-hk/cardano-rosetta/issues/56
const encodeExtraData = async (transaction: string, extraData: Components.Schemas.Operation[]): Promise<string> =>
  (await cbor.encodeAsync([transaction, extraData])).toString('hex');

const decodeExtraData = async (encoded: string): Promise<[string, Components.Schemas.Operation[]]> => {
  const [decoded] = await cbor.decodeAll(encoded);
  return decoded;
};

const configure = (
  cardanoService: CardanoService,
  blockService: BlockService,
  cardanoCli: CardanoCli,
  networkId: string,
  defaultRelativeTTL: number,
  logger: Logger
  // FIXME: This parameters might probably change on https://github.com/input-output-hk/cardano-rosetta/issues/117 so it's better fix it there
  // eslint-disable-next-line max-params
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
        const [signedTransaction] = await decodeExtraData(request.signed_transaction);
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
        ({ options: { relative_ttl: request.metadata ? request.metadata.relative_ttl : defaultRelativeTTL } }),
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
        logger.info(operations, '[constuctionPayloads] Operations about to be processed');
        const unsignedTransaction = cardanoService.createUnsignedTransaction(operations, ttl);
        const payloads = constructPayloadsForTransactionBody(unsignedTransaction.hash, unsignedTransaction.addresses);
        // FIXME: we have this as a constant in `block-service`. We should move to a conversion module.
        // eslint-disable-next-line camelcase
        const extraData: Components.Schemas.Operation[] = operations
          // eslint-disable-next-line camelcase
          .filter(operation => operation.coin_change?.coin_action === 'coin_spent');
        // .map(operation => ({ account: operation.account, amount: operation.amount }));
        logger.info({ unsignedTransaction, extraData }, '[createUnsignedTransaction] About to return');

        return {
          // eslint-disable-next-line camelcase
          unsigned_transaction: await encodeExtraData(unsignedTransaction.bytes, extraData),
          payloads
        };
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
        const [transaction, extraData] = await decodeExtraData(request.unsigned_transaction);
        const signedTransaction = cardanoService.buildTransaction(
          transaction,
          request.signatures.map(signature => ({
            signature: signature.hex_bytes,
            publicKey: signature.public_key.hex_bytes
          }))
        );
        logger.info({ signedTransaction }, '[constructionCombine] About to return signed transaction');
        // eslint-disable-next-line camelcase
        return { signed_transaction: await encodeExtraData(signedTransaction, extraData) };
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
        const networkIdentifier = getNetworkIdentifierByRequestParameters(request.network_identifier);
        logger.info(request.transaction, '[constructionParse] Processing');
        const [transaction, extraData] = await decodeExtraData(request.transaction);
        logger.info({ transaction, extraData }, '[constructionParse] Decoded');
        if (signed) {
          return {
            // eslint-disable-next-line camelcase
            network_identifier: request.network_identifier,
            ...cardanoService.parseSignedTransaction(networkIdentifier, transaction, extraData)
          };
        }
        return {
          // eslint-disable-next-line camelcase
          network_identifier: request.network_identifier,
          ...cardanoService.parseUnsignedTransaction(networkIdentifier, transaction, extraData)
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
          const [signedTransaction] = await decodeExtraData(request.signed_transaction);
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
