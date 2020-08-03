import CardanoWasm, { EnterpriseAddress } from '@emurgo/cardano-serialization-lib-nodejs';
import { Logger } from 'fastify';
import { ErrorFactory } from '../utils/errors';

const PUBLIC_KEY_LENGTH = 32;

// TODO check if this is valid
export enum NetworkIdentifier {
  CARDANO_MAINNET_NETWORK = 1
}

export interface CardanoService {
  generateAddress(networkId: NetworkIdentifier, publicKey: Components.Schemas.PublicKey): EnterpriseAddress | null;
  parseInputs(inputs: Components.Schemas.Operation[]): CardanoWasm.TransactionInput[];
  parseOutputs(outputs: Components.Schemas.Operation[]): CardanoWasm.TransactionOutput[];
  createTransactionBody(
    inputs: CardanoWasm.TransactionInput[],
    outputs: CardanoWasm.TransactionOutput[],
    fee: string,
    ttl: number
  ): CardanoWasm.TransactionBody;
  createUnsignedTransaction(operations: Components.Schemas.Operation[], ttl: number): string;
}

const isKeyValid = (key: Buffer, curveType: string): boolean =>
  key.length === PUBLIC_KEY_LENGTH && curveType === 'edwards25519';

const configure = (logger: Logger): CardanoService => ({
  generateAddress(network, publicKey) {
    logger.info(
      `[generateAddress] About to generate address from public key ${publicKey} and network identifier ${network}`
    );
    const publicKeyBuffer = Buffer.from(publicKey.hex_bytes, 'hex');

    logger.info('[generateAddress] About to check if public key has valid length and curve type');
    if (!isKeyValid(publicKeyBuffer, publicKey.curve_type)) {
      logger.info('[generateAddress] Public key has an invalid format');
      throw ErrorFactory.invalidPublicKeyFormat();
    }
    logger.info('[generateAddress] Public key has a valid format');

    const pub = CardanoWasm.PublicKey.from_bytes(publicKeyBuffer);

    logger.info('[generateAddress] Deriving cardano address from valid public key');
    const address = CardanoWasm.EnterpriseAddress.new(
      NetworkIdentifier.CARDANO_MAINNET_NETWORK,
      CardanoWasm.StakeCredential.from_keyhash(pub.hash())
    );
    if (!address) {
      return null;
    }
    logger.info(`[generateAddress] base address is ${address}`);
    return address;
  }
});

export default configure;
