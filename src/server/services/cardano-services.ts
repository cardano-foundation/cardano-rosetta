import CardanoWasm, { TransactionOutputs, TransactionInputs, BigNum } from '@emurgo/cardano-serialization-lib-nodejs';
import { Logger } from 'fastify';
import { ErrorFactory } from '../utils/errors';
import { hexFormatter } from '../utils/formatters';

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
  getTransactionInputs(inputs: Components.Schemas.Operation[]): CardanoWasm.TransactionInputs;
  validateAndParseTransactionInputs(inputs: Components.Schemas.Operation[]): CardanoWasm.TransactionInputs;
  getTransactionOutputs(outputs: Components.Schemas.Operation[]): CardanoWasm.TransactionOutputs;
  validateAndParseTransactionOutputs(outputs: Components.Schemas.Operation[]): CardanoWasm.TransactionOutputs;
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
    const address = enterpriseAddress
      .to_address()
      .to_bech32(network === NetworkIdentifier.CARDANO_MAINNET_NETWORK ? 'addr' : 'addr_test');
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
      return hexFormatter(hashBuffer);
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
      return hexFormatter(Buffer.from(CardanoWasm.Transaction.new(transactionBody, witnesses).to_bytes()));
    } catch (error) {
      logger.error({ error }, '[buildTransaction] There was an error building signed transaction');
      throw ErrorFactory.cantBuildSignedTransaction();
    }
  },
  validateAndParseTransactionInputs(inputs) {
    const transactionInputs = CardanoWasm.TransactionInputs.new();
    inputs.forEach(input => {
      // eslint-disable-next-line camelcase
      if (!input.coin_change) {
        logger.error('[validateAndParseTransactionInputs] Inputs have missing parameters');
        throw ErrorFactory.transactionInputsParametersMissingError();
      }
      const [transactionId, index] = input.coin_change && input.coin_change.coin_identifier.identifier.split(':');
      if (!(transactionId && index)) {
        logger.error('[validateAndParseTransactionInputs] Inputs have missing parameters');
        throw ErrorFactory.transactionInputsParametersMissingError();
      }
      transactionInputs.add(
        CardanoWasm.TransactionInput.new(
          CardanoWasm.TransactionHash.from_bytes(Buffer.from(transactionId, 'hex')),
          Number(index)
        )
      );
    });
    return transactionInputs;
  },
  getTransactionInputs(inputs) {
    try {
      logger.info(`[getTransactionInputs] About to parse ${inputs.length} inputs`);
      const transactionInputs = this.validateAndParseTransactionInputs(inputs);
      logger.info('[getTransactionInputs] Transaction inputs were created');
      return transactionInputs;
    } catch (error) {
      logger.error('[getTransactionInputs] There was an error parsing inputs, parameters are not valid');
      throw ErrorFactory.transactionInputsParametersMissingError();
    }
  },
  validateAndParseTransactionOutputs(outputs) {
    const transactionOutputs = CardanoWasm.TransactionOutputs.new();
    outputs.forEach(output => {
      // eslint-disable-next-line camelcase
      const address = output.account && CardanoWasm.Address.from_bech32(output.account.address);
      const value = output.amount && BigNum.from_str(output.amount.value);
      if (!(address && value)) {
        logger.error('[validateAndParseTransactionOutputs] Outputs have missing parameters');
        throw ErrorFactory.transactionOutputsParametersMissingError();
      }
      transactionOutputs.add(CardanoWasm.TransactionOutput.new(address, value));
    });
    return transactionOutputs;
  },
  getTransactionOutputs(outputs) {
    try {
      logger.info(`[getTransactionOutputs] About to parse ${outputs.length} outputs`);
      const transactionOutputs = this.validateAndParseTransactionOutputs(outputs);
      logger.info('[getTransactionOutputs] Transaction outputs were created');
      return transactionOutputs;
    } catch (error) {
      logger.error('[getTransactionOutputs] There was an erryqor parsing outputs, parameters are not valid');
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
      this.getTransactionInputs(inputs),
      this.getTransactionOutputs(outputs),
      fee,
      Number(ttl)
    );
    logger.info('[createUnsignedTransaction] Extracting addresses that will sign transaction from inputs');
    const addresses = inputs.map(input => {
      if (input.account) return input.account?.address;
      // This logic is not necessary (because it is made on this.getTransactionInputs(..)) but ts expects me to do it again
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
      hash: hexFormatter(Buffer.from(bodyHash)),
      addresses
    };
  },
  createTransactionBody(inputs, outputs, fee, ttl) {
    return CardanoWasm.TransactionBody.new(inputs, outputs, BigNum.new(fee), ttl);
  }
});

export default configure;
