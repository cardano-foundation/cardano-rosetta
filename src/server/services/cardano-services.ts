import CardanoWasm from '@emurgo/cardano-serialization-lib-nodejs';
import { Logger } from 'fastify';
import { ErrorFactory } from '../utils/errors';
import { hashFormatter } from '../utils/formatters';

const PUBLIC_KEY_LENGTH = 32;
const PUBLIC_KEY_BYTES_LENGTH = 64;

export enum NetworkIdentifier {
  CARDANO_TESTNET_NETWORK = 0,
  CARDANO_MAINNET_NETWORK
}

export interface Signatures {
  signature: string;
  publicKey: string;
}

export interface CardanoService {
  generateAddress(networkId: NetworkIdentifier, publicKey: Components.Schemas.PublicKey): string | null;
  getHashOfSignedTransaction(signedTransaction: string): string;
  signTransaction(unsignedTransaction: string, signatures: Signatures[]): string;
}

const isKeyValid = (publicKeyBytes: string, key: Buffer, curveType: string): boolean =>
  publicKeyBytes.length === PUBLIC_KEY_BYTES_LENGTH && key.length === PUBLIC_KEY_LENGTH && curveType === 'edwards25519';

const configure = (logger: Logger): CardanoService => ({
  generateAddress(network, publicKey) {
    logger.info(
      `[generateAddress] About to generate address from public key ${publicKey} and network identifier ${network}`
    );

    const publicKeyBuffer = Buffer.from(publicKey.hex_bytes, 'hex');

    logger.info('[generateAddress] About to check if public key has valid length and curve type');
    if (!isKeyValid(publicKey.hex_bytes, publicKeyBuffer, publicKey.curve_type)) {
      logger.info('[generateAddress] Public key has an invalid format');
      throw ErrorFactory.invalidPublicKeyFormat();
    }
    logger.info('[generateAddress] Public key has a valid format');

    const pub = CardanoWasm.PublicKey.from_bytes(publicKeyBuffer);

    logger.info('[generateAddress] Deriving cardano address from valid public key');
    const enterpriseAddress = CardanoWasm.EnterpriseAddress.new(
      network,
      CardanoWasm.StakeCredential.from_keyhash(pub.hash())
    );
    const address = enterpriseAddress.to_address().to_bech32();
    logger.info(`[generateAddress] base address is ${address}`);
    return address;
  },
  getHashOfSignedTransaction(signedTransaction) {
    try {
      logger.info(`[getHashOfSignedTransaction] About to hash signed transaction ${signedTransaction}`);
      const signedTransactionBytes = Buffer.from(signedTransaction, 'hex');
      logger.info('[getHashOfSignedTransaction] About to parse transaction from signed transaction bytes');
      const parsed = CardanoWasm.Transaction.from_bytes(signedTransactionBytes);
      logger.info('[getHashOfSignedTransaction] Returning transaction hash');
      const hashBuffer = parsed && parsed.body() && Buffer.from(CardanoWasm.hash_transaction(parsed.body()).to_bytes());
      return hashFormatter(hashBuffer);
    } catch (error) {
      logger.error({ error }, '[getHashOfSignedTransaction] There was an error parsing signed transaction');
      throw ErrorFactory.parseSignedTransactionError();
    }
  },
  signTransaction(unsignedTransaction, signatures) {
    try {
      logger.info(`[signTransaction] About to signed a transaction with ${signatures.length} signatures`);
      const witnesses = CardanoWasm.TransactionWitnessSet.new();
      const vkeyWitnesses = CardanoWasm.Vkeywitnesses.new();

      logger.info('[signTransaction] Extracting witnesses from signatures');
      signatures.forEach(signature => {
        vkeyWitnesses.add(CardanoWasm.Vkeywitness.from_bytes(Buffer.from(signature.signature, 'hex')));
      });

      witnesses.set_vkeys(vkeyWitnesses);
      logger.info(`[signTransaction] ${vkeyWitnesses.len} witnesses were extracted to sign transaction`);

      logger.info('[signTransaction] Instantiating transaction body from unsigned transaction bytes');
      const transactionBody = CardanoWasm.TransactionBody.from_bytes(Buffer.from(unsignedTransaction, 'hex'));

      logger.info('[signTransaction] Creating transaction using transaction body and extracted witnesses');
      return hashFormatter(Buffer.from(CardanoWasm.Transaction.new(transactionBody, witnesses).to_bytes()));
    } catch (error) {
      logger.error({ error }, '[signTransaction] There was an error signing transaction');
      throw ErrorFactory.cantCreateSignTransaction();
    }
  }
});

export default configure;
