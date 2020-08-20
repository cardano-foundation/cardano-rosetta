/* eslint-disable camelcase */
import CardanoWasm, { BigNum, Vkey, PublicKey, Ed25519Signature } from '@emurgo/cardano-serialization-lib-nodejs';
import { Logger } from 'fastify';
import { ErrorFactory } from '../utils/errors';
import { hexFormatter } from '../utils/formatters';
import { SUCCESS_STATUS, TRANSFER_OPERATION_TYPE, ADA, ADA_DECIMALS } from '../utils/constants';

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

export interface TransactionParsed {
  operations: Components.Schemas.Operation[];
  signers: string[];
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
  parseSignedTransaction(transaction: string): TransactionParsed;
  parseUnsignedTransaction(transaction: string): TransactionParsed;
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

const parseInputToOperation = (input: CardanoWasm.TransactionInput, index: number): Components.Schemas.Operation => ({
  operation_identifier: { index },
  coin_change: {
    coin_identifier: {
      identifier: `${hexFormatter(Buffer.from(input.transaction_id().to_bytes()))}:${input.index()}`
    },
    coin_action: 'coin_created'
  },
  status: '',
  type: TRANSFER_OPERATION_TYPE
});

const parseOutputToOperation = (
  output: CardanoWasm.TransactionOutput,
  index: number,
  relatedOperations: Components.Schemas.OperationIdentifier[]
): Components.Schemas.Operation => ({
  operation_identifier: { index },
  related_operations: relatedOperations,
  account: { address: output.address().to_bech32() },
  amount: { value: output.amount().to_str(), currency: { symbol: ADA, decimals: ADA_DECIMALS } },
  status: '',
  type: TRANSFER_OPERATION_TYPE
});

const getRelatedOperationsFromInputs = (
  inputs: Components.Schemas.Operation[]
): Components.Schemas.OperationIdentifier[] => inputs.map(input => ({ index: input.operation_identifier.index }));

const parseOperationsFromTransactionBody = (
  transactionBody: CardanoWasm.TransactionBody
): Components.Schemas.Operation[] => {
  const operations = [];
  const inputsCount = transactionBody.inputs().len();
  const outputsCount = transactionBody.outputs().len();
  let currentIndex = 0;
  while (currentIndex < inputsCount) {
    const input = transactionBody.inputs().get(currentIndex++);
    const inputParsed = parseInputToOperation(input, operations.length);
    operations.push(inputParsed);
  }
  currentIndex = 0;
  // till this line operations only contains inputs
  const relatedOperations = getRelatedOperationsFromInputs(operations);
  while (currentIndex < outputsCount) {
    const output = transactionBody.outputs().get(currentIndex++);
    const outputParsed = parseOutputToOperation(output, operations.length, relatedOperations);
    operations.push(outputParsed);
  }
  return operations;
};

const getSignatures = (witnessesSet: CardanoWasm.TransactionWitnessSet): string[] => {
  if (!witnessesSet.vkeys()) {
    return [];
  }
  const signatures = [];
  const witnessesKeys = witnessesSet.vkeys();
  const witnessesLength = witnessesKeys ? witnessesKeys.len() : 0;
  let currentWitnessLength = 0;
  while (witnessesKeys && currentWitnessLength < witnessesLength) {
    signatures.push(
      hexFormatter(
        Buffer.from(
          witnessesKeys
            .get(currentWitnessLength++)
            .vkey()
            .public_key()
            .hash()
            .to_bytes()
        )
      )
    );
  }
  return signatures;
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
        const vkey: Vkey = Vkey.new(PublicKey.from_bytes(Buffer.from(signature.publicKey, 'hex')));
        const ed25519Signature: Ed25519Signature = Ed25519Signature.from_bytes(Buffer.from(signature.signature, 'hex'));
        vkeyWitnesses.add(CardanoWasm.Vkeywitness.new(vkey, ed25519Signature));
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
      if (!input.coin_change) {
        logger.error('[validateAndParseTransactionInputs] Input has missing coin_change');
        throw ErrorFactory.transactionInputsParametersMissingError('Input has missing coin_change field');
      }
      const [transactionId, index] = input.coin_change && input.coin_change.coin_identifier.identifier.split(':');
      if (!(transactionId && index)) {
        logger.error('[validateAndParseTransactionInputs] Input has missing transactionId and index');
        throw ErrorFactory.transactionInputsParametersMissingError('Input has invalid coin_identifier field');
      }
      try {
        transactionInputs.add(
          CardanoWasm.TransactionInput.new(
            CardanoWasm.TransactionHash.from_bytes(Buffer.from(transactionId, 'hex')),
            Number(index)
          )
        );
      } catch (error) {
        throw ErrorFactory.transactionInputDeserializationError(
          'There was an error deserializating transaction input: '.concat(error)
        );
      }
    });
    return transactionInputs;
  },
  getTransactionInputs(inputs) {
    logger.info(`[getTransactionInputs] About to parse ${inputs.length} inputs`);
    const transactionInputs = this.validateAndParseTransactionInputs(inputs);
    logger.info('[getTransactionInputs] Transaction inputs were created');
    return transactionInputs;
  },
  validateAndParseTransactionOutputs(outputs) {
    const transactionOutputs = CardanoWasm.TransactionOutputs.new();
    outputs.forEach(output => {
      // eslint-disable-next-line camelcase
      let address;
      try {
        address = output.account && CardanoWasm.Address.from_bech32(output.account.address);
      } catch (error) {
        throw ErrorFactory.transactionOutputDeserializationError(error.toString());
      }
      if (!address) {
        logger.error('[validateAndParseTransactionOutputs] Output has missing address field');
        throw ErrorFactory.transactionOutputsParametersMissingError('Output has missing address field');
      }
      const value = output.amount && BigNum.from_str(output.amount.value);
      if (!value) {
        logger.error('[validateAndParseTransactionOutputs] Output has missing amount value field');
        throw ErrorFactory.transactionOutputsParametersMissingError('Output has missing amount value field');
      }
      try {
        transactionOutputs.add(CardanoWasm.TransactionOutput.new(address, value));
      } catch (error) {
        throw ErrorFactory.transactionOutputDeserializationError(error.toString());
      }
    });
    return transactionOutputs;
  },
  getTransactionOutputs(outputs) {
    logger.info(`[getTransactionOutputs] About to parse ${outputs.length} outputs`);
    const transactionOutputs = this.validateAndParseTransactionOutputs(outputs);
    logger.info('[getTransactionOutputs] Transaction outputs were created');
    return transactionOutputs;
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
      throw ErrorFactory.transactionInputsParametersMissingError('Input has missing account address field');
    });

    const transactionBytes = hexFormatter(Buffer.from(transactionBody.to_bytes()));
    logger.info('[createUnsignedTransaction] Hashing transaction body');
    const bodyHash = CardanoWasm.hash_transaction(transactionBody).to_bytes();
    const toReturn = {
      bytes: transactionBytes,
      hash: hexFormatter(Buffer.from(bodyHash)),
      addresses
    };
    logger.info(
      toReturn,
      '[createUnsignedTransaction] Returning unsigned transaction, hash to sign and addresses that will sign hash'
    );
    return toReturn;
  },
  createTransactionBody(inputs, outputs, fee, ttl) {
    return CardanoWasm.TransactionBody.new(inputs, outputs, BigNum.new(fee), ttl);
  },
  parseSignedTransaction(transaction) {
    try {
      const transactionBuffer = Buffer.from(transaction, 'hex');
      logger.info('[parseSignedTransaction] About to create signed transaction from bytes');
      const parsed = CardanoWasm.Transaction.from_bytes(transactionBuffer);
      logger.info('[parseSignedTransaction] About to parse operations from transaction body');
      const operations = parseOperationsFromTransactionBody(parsed.body());
      logger.info('[parseSignedTransaction] About to get signatures from parsed transaction');
      const signatures = getSignatures(parsed.witness_set());
      logger.info(
        `[parseSignedTransaction] Returning ${operations.length} operations and ${signatures.length} signers`
      );
      return { operations, signers: signatures };
    } catch (error) {
      logger.error({ error }, '[parseUnsignedTransaction] Cant instantiate signed transaction from transaction bytes');
      throw ErrorFactory.cantCreateSignedTransactionFromBytes();
    }
  },
  parseUnsignedTransaction(transaction) {
    try {
      const transactionBuffer = Buffer.from(transaction, 'hex');
      logger.info('[parseUnsignedTransaction] About to create unsigned transaction from bytes');
      const parsed = CardanoWasm.TransactionBody.from_bytes(transactionBuffer);
      logger.info('[parseUnsignedTransaction] About to parse operations from transaction body');
      const operations = parseOperationsFromTransactionBody(parsed);
      logger.info(operations, `[parseUnsignedTransaction] Returning ${operations.length} operations`);
      return { operations, signers: [] };
    } catch (error) {
      logger.error(
        { error },
        '[parseUnsignedTransaction] Cant instantiate unsigned transaction from transaction bytes'
      );
      throw ErrorFactory.cantCreateUnsignedTransactionFromBytes();
    }
  }
});

export default configure;
