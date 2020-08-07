import CardanoWasm from '@emurgo/cardano-serialization-lib-nodejs';
import { Logger } from 'fastify';
import { ErrorFactory } from '../utils/errors';
import { hashFormatter } from '../utils/formatters';
import { createOperation } from './block-service';
import { SUCCESS_STATUS, TRANSFER_OPERATION_TYPE } from '../utils/constants';
import { create } from 'domain';

const PUBLIC_KEY_LENGTH = 32;
const PUBLIC_KEY_BYTES_LENGTH = 64;

export enum NetworkIdentifier {
  CARDANO_TESTNET_NETWORK = 0,
  CARDANO_MAINNET_NETWORK
}

export interface TransactionParsed {
  operations: Components.Schemas.Operation[];
  signers: string[];
}

export interface CardanoService {
  generateAddress(networkId: NetworkIdentifier, publicKey: Components.Schemas.PublicKey): string | null;
  getHashOfSignedTransaction(signedTransaction: string): string;
  parseTransaction(signed: boolean, transaction: string): TransactionParsed;
}

const getSignatures = (witnessesSet: CardanoWasm.TransactionWitnessSet): string[] => {
  const signatures = [];
  const vkeys = witnessesSet.vkeys();
  if (!vkeys) {
    // fixme
    throw new Error('asdas');
  }
  const signersLength = vkeys.len();
  for (let signersIndex = 0; signersIndex < signersLength; signersIndex++) {
    signatures.push(vkeys.get(signersIndex));
  }
  return signatures.map(vkey =>
    vkey
      ?.vkey()
      // eslint-disable-next-line camelcase
      .public_key()
      // eslint-disable-next-line camelcase
      .to_bech32()
      .toString()
  );
};

const isKeyValid = (publicKeyBytes: string, key: Buffer, curveType: string): boolean =>
  publicKeyBytes.length === PUBLIC_KEY_BYTES_LENGTH && key.length === PUBLIC_KEY_LENGTH && curveType === 'edwards25519';

const getOperationFromInput = (input: CardanoWasm.TransactionInput) => ({
  // eslint-disable-next-line camelcase
  operation_identifier: { index: input.index() },
  type: TRANSFER_OPERATION_TYPE,
  status: SUCCESS_STATUS
});

const parseOperationsFromTransactionBody = (body: CardanoWasm.TransactionBody): Components.Schemas.Operation[] => {
  const operations = [];
  const inputs = body.inputs();
  const inputsLength = inputs.len();
  for (let inputsIndex = 0; inputsIndex < inputsLength; inputsIndex++) {
    const input = inputs.get(inputsIndex);
    operations.push(getOperationFromInput(input));
  }

  const outputs = body.outputs();
  const outputsLength = outputs.len();
  for (let outputsIndex = 0; outputsIndex < outputsLength; outputsIndex++) {
    const output = outputs.get(outputsIndex);
    // FIXME where do i extract index?
    // output.
    // operations.push()
  }
  return operations;
};

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
  parseTransaction(signed, transaction) {
    const transactionBuffer = Buffer.from(transaction, 'hex');
    if (signed) {
      const parsed = CardanoWasm.Transaction.from_bytes(transactionBuffer);
      const operations = parseOperationsFromTransactionBody(parsed.body());
      const signatures = getSignatures(parsed.witness_set());
      return { operations, signers: signatures };
    }
    const parsed = CardanoWasm.TransactionBody.from_bytes(transactionBuffer);
    const operations = parseOperationsFromTransactionBody(parsed);
    return { operations, signers: [] };
  }
});

export default configure;
