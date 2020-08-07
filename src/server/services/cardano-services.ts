import CardanoWasm, { TransactionOutputs, TransactionInputs, BigNum } from '@emurgo/cardano-serialization-lib-nodejs';
import { Logger } from 'fastify';
import { ErrorFactory } from '../utils/errors';
import { hashFormatter, hexFormatter } from '../utils/formatters';

const PUBLIC_KEY_LENGTH = 32;
const PUBLIC_KEY_BYTES_LENGTH = 64;
const TRANSACTION_HASH_LENGTH = 64;

export enum NetworkIdentifier {
  CARDANO_TESTNET_NETWORK = 0,
  CARDANO_MAINNET_NETWORK
}

export interface Signatures {
  signature: string;
  publicKey: string;
}
export interface UnsignedTransaction {
  hash: string;
  bytes: string;
  addresses: string[];
}

export interface CardanoService {
  generateAddress(networkId: NetworkIdentifier, publicKey: Components.Schemas.PublicKey): string | null;
  getHashOfSignedTransaction(signedTransaction: string): string;
  buildTransaction(unsignedTransaction: string, signatures: Signatures[]): string;
  getWitnessesForTransaction(signatures: Signatures[]): CardanoWasm.TransactionWitnessSet;
  parseInputs(inputs: Components.Schemas.Operation[]): CardanoWasm.TransactionInputs;
  validateAndParseInputs(inputs: Components.Schemas.Operation[]): CardanoWasm.TransactionInput[];
  parseOutputs(outputs: Components.Schemas.Operation[]): CardanoWasm.TransactionOutputs;
  validateOutputs(outputs: Components.Schemas.Operation[]): CardanoWasm.TransactionOutput[];
  createTransactionBody(
    inputs: CardanoWasm.TransactionInputs,
    outputs: CardanoWasm.TransactionOutputs,
    fee: BigInt,
    ttl: number
  ): CardanoWasm.TransactionBody;
  createUnsignedTransaction(operations: Components.Schemas.Operation[], ttl: string): UnsignedTransaction;
}

const calculateFee = (inputs: Components.Schemas.Operation[], outputs: Components.Schemas.Operation[]): BigInt => {
  const inputsSum = inputs.reduce((acum, current) => acum + BigInt(current.amount?.value), BigInt(0)) * BigInt(-1);
  const outputsSum = outputs.reduce((acum, current) => acum + BigInt(current.amount?.value), BigInt(0));
  if (outputsSum > inputsSum) {
    throw ErrorFactory.outputsAreBiggerThanInputsError();
  }
  return inputsSum - outputsSum;
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
  getWitnessesForTransaction(signatures) {
    try {
      const witnesses = CardanoWasm.TransactionWitnessSet.new();
      const vkeyWitnesses = CardanoWasm.Vkeywitnesses.new();

      logger.info('[getWitnessesForTransaction] Extracting witnesses from signatures');
      signatures.forEach(signature => {
        vkeyWitnesses.add(CardanoWasm.Vkeywitness.from_bytes(Buffer.from(signature.signature, 'hex')));
      });
      logger.info(`[getWitnessesForTransaction] ${vkeyWitnesses.len} witnesses were extracted to sign transaction`);
      witnesses.set_vkeys(vkeyWitnesses);
      return witnesses;
    } catch (error) {
      logger.error({ error }, '[getWitnessesForTransaction] There was an error building witnesses set for transaction');
      throw ErrorFactory.cantBuildWitnessesSet();
    }
  },
  buildTransaction(unsignedTransaction, signatures) {
    logger.info(`[buildTransaction] About to signed a transaction with ${signatures.length} signatures`);
    const witnesses = this.getWitnessesForTransaction(signatures);
    try {
      logger.info('[buildTransaction] Instantiating transaction body from unsigned transaction bytes');
      const transactionBody = CardanoWasm.TransactionBody.from_bytes(Buffer.from(unsignedTransaction, 'hex'));

      logger.info('[buildTransaction] Creating transaction using transaction body and extracted witnesses');
      return hashFormatter(Buffer.from(CardanoWasm.Transaction.new(transactionBody, witnesses).to_bytes()));
    } catch (error) {
      logger.error({ error }, '[buildTransaction] There was an error building signed transaction');
      throw ErrorFactory.cantBuildSignedTransaction();
    }
  },
  validateAndParseInputs(inputs) {
    return inputs.map(input => {
      // eslint-disable-next-line camelcase
      const transactionId =
        input.coin_change &&
        CardanoWasm.TransactionHash.from_bytes(
          Buffer.from(input.coin_change.coin_identifier.identifier.slice(0, TRANSACTION_HASH_LENGTH), 'hex')
        );
      const index = input.operation_identifier.index;
      if (!(transactionId && index)) {
        throw ErrorFactory.transactionInputsParametersMissingError();
      }
      return CardanoWasm.TransactionInput.new(transactionId, index);
    });
  },
  parseInputs(inputs) {
    try {
      logger.info(`[parseInputs] About to parse ${inputs.length} inputs`);
      const transactionInputs = TransactionInputs.new();
      logger.debug('[parseInputs] About to validate and parse inputs');
      const inputsParsed = this.validateAndParseInputs(inputs);
      logger.info('[parseInputs] Creating inputs for transactions body instance');
      inputsParsed.forEach(inputParsed => transactionInputs.add(inputParsed));
      logger.info('[parseInputs] Transaction inputs were created');
      return transactionInputs;
    } catch (error) {
      logger.error('[parseInputs] There was an error parsing inputs, parameters are not valid');
      throw ErrorFactory.transactionInputsParametersMissingError();
    }
  },
  validateOutputs(outputs) {
    return outputs.map(output => {
      // eslint-disable-next-line camelcase
      const address = output.account && CardanoWasm.Address.from_bech32(output.account.address);
      const value = output.amount && BigNum.from_str(output.amount.value);
      if (!(address && value)) {
        throw ErrorFactory.transactionOutputsParametersMissingError();
      }
      return CardanoWasm.TransactionOutput.new(address, value);
    });
  },
  parseOutputs(outputs) {
    try {
      logger.info(`[parseOutputs] About to parse ${outputs.length} outputs`);
      const transactionOutputs = TransactionOutputs.new();
      logger.debug('[parseOutputs] About to validate and parse outputs');
      const outputsParsed = this.validateOutputs(outputs);
      logger.info('[parseOutputs] Creating outputs for transactions body instance');
      outputsParsed.forEach(outputParsed => {
        transactionOutputs.add(outputParsed);
      });
      logger.info('[parseOutputs] Transaction outputs were created');
      return transactionOutputs;
    } catch (error) {
      logger.error('[parseOutputs] There was an error parsing outputs, parameters are not valid');
      throw ErrorFactory.transactionOutputsParametersMissingError();
    }
  },
  createUnsignedTransaction(operations, ttl) {
    logger.info(
      `[createUnsignedTransaction] About to create an unsigned transaction with ${operations.length} operations`
    );
    const inputs = operations.filter(operation => Number(operation.amount?.value) < 0);
    const outputs = operations.filter(operation => Number(operation.amount?.value) > 0);
    logger.info('[createUnsignedTransaction] About to calculate fee');
    const fee = calculateFee(inputs, outputs);
    logger.info('[createUnsignedTransaction] About to create transaction body');
    const transactionBody = this.createTransactionBody(
      this.parseInputs(inputs),
      this.parseOutputs(outputs),
      fee,
      Number(ttl)
    );
    logger.info('[createUnsignedTransaction] Extracting addresses that will sign transaction from inputs');
    const addresses = inputs.map(input => {
      if (input.account) return input.account?.address;
      // This logic is not necessary (because it is made on this.parseInputs(..)) but ts expects me to do it again
      throw ErrorFactory.transactionInputsParametersMissingError();
    });
    const transactionBytes = hexFormatter(Buffer.from(transactionBody.to_bytes()));
    logger.info('[createUnsignedTransaction] Hashing transaction body');
    const bodyHash = CardanoWasm.hash_transaction(transactionBody).to_bytes();
    logger.info(
      '[createUnsignedTransaction] Returning unsigned transaction, hash to sign and addresses that will sign hash'
    );
    return {
      bytes: transactionBytes,
      hash: hashFormatter(Buffer.from(bodyHash)),
      addresses
    };
  },
  createTransactionBody(inputs, outputs, fee, ttl) {
    return CardanoWasm.TransactionBody.new(inputs, outputs, BigNum.new(fee), ttl);
  }
});

export default configure;
