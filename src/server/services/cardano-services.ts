import CardanoWasm, { TransactionOutputs, TransactionInputs, BigNum } from '@emurgo/cardano-serialization-lib-nodejs';
import { Logger } from 'fastify';
import { ErrorFactory } from '../utils/errors';
import { hashFormatter } from '../utils/formatters';
import { VIN, VOUT } from '../utils/constants';

const PUBLIC_KEY_LENGTH = 32;
const PUBLIC_KEY_BYTES_LENGTH = 64;

export enum NetworkIdentifier {
  CARDANO_TESTNET_NETWORK = 0,
  CARDANO_MAINNET_NETWORK
}

export interface CardanoService {
  generateAddress(networkId: NetworkIdentifier, publicKey: Components.Schemas.PublicKey): string | null;
  getHashOfSignedTransaction(signedTransaction: string): string;
  parseInputs(inputs: Components.Schemas.Operation[]): CardanoWasm.TransactionInputs;
  parseOutputs(outputs: Components.Schemas.Operation[]): CardanoWasm.TransactionOutputs;
  createTransactionBody(
    inputs: CardanoWasm.TransactionInputs,
    outputs: CardanoWasm.TransactionOutputs,
    fee: BigInt,
    ttl: number
  ): CardanoWasm.TransactionBody;
  createUnsignedTransaction(operations: Components.Schemas.Operation[], ttl: string): string;
}

const operationTypeFilter = (type: string) => (operation: Components.Schemas.Operation) => operation.type === type;
// TODO why amount is not required?
const calculateFee = (inputs: Components.Schemas.Operation[], outputs: Components.Schemas.Operation[]): BigInt => {
  const inputsSum = inputs.reduce((acum, current) => acum + BigInt(current.amount?.value), BigInt(0));
  const outputsSum = outputs.reduce((acum, current) => acum + BigInt(current.amount?.value), BigInt(0));
  return outputsSum > inputsSum ? outputsSum - inputsSum : inputsSum - outputsSum;
};

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
  parseInputs(inputs) {
    const transactionInputs = TransactionInputs.new();
    inputs.forEach(input => {
      const inputParsed = CardanoWasm.TransactionInput.new(
        // eslint-disable-next-line camelcase
        input.coin_change?.coin_identifier.identifier,
        input.operation_identifier.index
      );
      transactionInputs.add(inputParsed);
    });
    return transactionInputs;
  },
  parseOutputs(outputs) {
    const transactionOutputs = TransactionOutputs.new();
    outputs.forEach(
      (
        output // eslint-disable-next-line camelcase
      ) => {
        const outputParsed = CardanoWasm.TransactionOutput.new(output.account?.address, output.amount.value);
        transactionOutputs.add(outputParsed);
      }
    );
    return transactionOutputs;
  },
  createUnsignedTransaction(operations, ttl) {
    const inputs = operations.filter(operationTypeFilter(VIN));
    const outputs = operations.filter(operationTypeFilter(VOUT));
    const fee = calculateFee(inputs, outputs);
    const transactionBody = this.createTransactionBody(this.parseInputs(inputs), this.parseOutputs(outputs), fee, ttl);
    return CardanoWasm.Transaction.new(transactionBody);
  },
  createTransactionBody(inputs, outputs, fee, ttl) {
    return CardanoWasm.TransactionBody.new(inputs, outputs, BigNum.new(fee), ttl);
  }
});

export default configure;
