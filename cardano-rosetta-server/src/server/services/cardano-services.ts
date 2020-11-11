/* eslint-disable camelcase */
import CardanoWasm, { BigNum, Ed25519Signature, PublicKey, Vkey } from '@emurgo/cardano-serialization-lib-nodejs';
import cbor from 'cbor';
import { Logger } from 'fastify';
import { ErrorFactory } from '../utils/errors';
import { hexFormatter } from '../utils/formatters';
import { ADA, ADA_DECIMALS, operationType, AddressType } from '../utils/constants';

// Nibbles
export const SIGNATURE_LENGTH = 128;
export const PUBLIC_KEY_BYTES_LENGTH = 64;

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

export interface LinearFeeParameters {
  minFeeA: number;
  minFeeB: number;
}

export enum EraAddressType {
  Shelley,
  Byron
}

const SHELLEY_DUMMY_SIGNATURE = new Array(SIGNATURE_LENGTH + 1).join('0');
const SHELLEY_DUMMY_PUBKEY = new Array(PUBLIC_KEY_BYTES_LENGTH + 1).join('0');

export interface CardanoService {
  /**
   * Derives a Shelley bech32 Enterprise address for the given public key
   *
   * @param networkId cardano network
   * @param publicKey public key hex string representation
   * @param stakingCredential hex string representation
   * @param type Address type: either Enterprise, Base or Reward
   */
  generateAddress(
    logger: Logger,
    networkId: NetworkIdentifier,
    publicKey: string,
    stakingCredential?: string,
    type?: AddressType
  ): string | null;

  /**
   * Returns the era address type (either Shelley or Byron) based on an encoded string
   *
   * @param address to be parsed
   */
  getEraAddressType(address: string): EraAddressType | null;

  /**
   * Returns the transaction hash for the given signed transaction.
   *
   * @param signedTransaction
   */
  getHashOfSignedTransaction(logger: Logger, signedTransaction: string): string;

  /**
   * Creates an unsigned transaction for the given operation.
   *
   * @param operations
   * @param ttl
   */
  createUnsignedTransaction(
    logger: Logger,
    operations: Components.Schemas.Operation[],
    ttl: number
  ): UnsignedTransaction;

  /**
   * Calculates the transaction size in bytes for the given operations
   *
   * @param logger
   * @param operations
   * @param ttl
   */
  calculateTxSize(logger: Logger, operations: Components.Schemas.Operation[], ttl: number): number;

  /**
   * Updates calculated tx size if ttl was replaced with a different value
   *
   * @param previousTxSize in bytes
   * @param previousTtl value
   * @param newTtl value
   */
  updateTxSize(previousTxSize: number, previousTtl: number, newTtl: number): number;

  /**
   * Returns the transaction minimum fee given the transaction size using the
   * linear fee calculation formula
   *
   * @param transactionSize in bytes
   */
  calculateTxMinimumFee(transactionSize: number): BigInt;

  /**
   * Generates an hex encoded signed transaction
   *
   * @param unsignedTransaction
   * @param signatures
   */
  buildTransaction(logger: Logger, unsignedTransaction: string, signatures: Signatures[]): string;

  /**
   * Parses a signed transaction using COmpontens.Schemas.Operation
   *
   * @param networkId
   * @param transaction
   * @param extraData
   */
  parseSignedTransaction(
    logger: Logger,
    networkId: NetworkIdentifier,
    transaction: string,
    extraData: Components.Schemas.Operation[]
  ): TransactionParsed;

  /**
   * Parses an usigned transaction using COmpontens.Schemas.Operation
   *
   * @param networkId
   * @param transaction
   * @param extraData
   */
  parseUnsignedTransaction(
    logger: Logger,
    networkId: NetworkIdentifier,
    transaction: string,
    extraData: Components.Schemas.Operation[]
  ): TransactionParsed;
}

const calculateFee = (inputs: Components.Schemas.Operation[], outputs: Components.Schemas.Operation[]): BigInt => {
  const inputsSum = inputs.reduce((acum, current) => acum + BigInt(current.amount?.value), BigInt(0)) * BigInt(-1);
  const outputsSum = outputs.reduce((acum, current) => acum + BigInt(current.amount?.value), BigInt(0));
  if (outputsSum > inputsSum) {
    throw ErrorFactory.outputsAreBiggerThanInputsError();
  }
  return inputsSum - outputsSum;
};

const getAddressPrefix = (network: number) =>
  network === NetworkIdentifier.CARDANO_MAINNET_NETWORK ? 'addr' : 'addr_test';

// Prefix according to: https://github.com/cardano-foundation/CIPs/tree/master/CIP5#specification
const getStakeAddressPrefix = (network: number) =>
  network === NetworkIdentifier.CARDANO_MAINNET_NETWORK ? 'stake' : 'stake_test';

const parseInputToOperation = (input: CardanoWasm.TransactionInput, index: number): Components.Schemas.Operation => ({
  operation_identifier: { index },
  coin_change: {
    coin_identifier: {
      identifier: `${hexFormatter(Buffer.from(input.transaction_id().to_bytes()))}:${input.index()}`
    },
    // FIXME: we have this as a constant in `block-service`. We should move to a conversation module.
    coin_action: 'coin_spent'
  },
  status: '',
  type: operationType.INPUT
});

const parseOutputToOperation = (
  output: CardanoWasm.TransactionOutput,
  index: number,
  relatedOperations: Components.Schemas.OperationIdentifier[],
  addressPrefix: string
): Components.Schemas.Operation => ({
  operation_identifier: { index },
  related_operations: relatedOperations,
  account: { address: output.address().to_bech32(addressPrefix) },
  amount: { value: output.amount().to_str(), currency: { symbol: ADA, decimals: ADA_DECIMALS } },
  status: '',
  type: operationType.OUTPUT
});

const getRelatedOperationsFromInputs = (
  inputs: Components.Schemas.Operation[]
): Components.Schemas.OperationIdentifier[] => inputs.map(input => ({ index: input.operation_identifier.index }));

const parseOperationsFromTransactionBody = (
  transactionBody: CardanoWasm.TransactionBody,
  extraData: Components.Schemas.Operation[],
  network: number
): Components.Schemas.Operation[] => {
  const operations = [];
  const inputsCount = transactionBody.inputs().len();
  const outputsCount = transactionBody.outputs().len();
  let currentIndex = 0;
  while (currentIndex < inputsCount) {
    const input = transactionBody.inputs().get(currentIndex);
    const inputParsed = parseInputToOperation(input, operations.length);
    operations.push({ ...inputParsed, ...extraData[currentIndex], status: '' });
    currentIndex++;
  }
  currentIndex = 0;
  // till this line operations only contains inputs
  const relatedOperations = getRelatedOperationsFromInputs(operations);
  while (currentIndex < outputsCount) {
    const output = transactionBody.outputs().get(currentIndex++);
    const outputParsed = parseOutputToOperation(
      output,
      operations.length,
      relatedOperations,
      getAddressPrefix(network)
    );
    operations.push(outputParsed);
  }
  return operations;
};

const createTransactionBody = (
  inputs: CardanoWasm.TransactionInputs,
  outputs: CardanoWasm.TransactionOutputs,
  fee: BigInt,
  ttl: number
): CardanoWasm.TransactionBody => CardanoWasm.TransactionBody.new(inputs, outputs, BigNum.new(fee), ttl);

const validateAndParseTransactionOutputs = (
  logger: Logger,
  outputs: Components.Schemas.Operation[]
): CardanoWasm.TransactionOutputs => {
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
    const value = Number(output.amount?.value);
    if (!value) {
      logger.error('[validateAndParseTransactionOutputs] Output has missing amount value field');
      throw ErrorFactory.transactionOutputsParametersMissingError('Output has missing amount value field');
    }
    if (value <= 0) {
      logger.error('[validateAndParseTransactionOutputs] Output has negative value');
      throw ErrorFactory.transactionOutputsParametersMissingError('Output has negative amount value');
    }
    try {
      transactionOutputs.add(CardanoWasm.TransactionOutput.new(address, BigNum.new(BigInt(value))));
    } catch (error) {
      throw ErrorFactory.transactionOutputDeserializationError(error.toString());
    }
  });
  return transactionOutputs;
};

const validateAndParseTransactionInputs = (
  logger: Logger,
  inputs: Components.Schemas.Operation[]
): CardanoWasm.TransactionInputs => {
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
    const value = Number(input.amount?.value);
    if (!value) {
      logger.error('[validateAndParseTransactionInputs] Input has missing amount value field');
      throw ErrorFactory.transactionInputsParametersMissingError('Input has missing amount value field');
    }
    if (value >= 0) {
      logger.error('[validateAndParseTransactionInputs] Input has negative value');
      throw ErrorFactory.transactionInputsParametersMissingError('Input has positive amount value');
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
};

const getWitnessesForTransaction = (logger: Logger, signatures: Signatures[]): CardanoWasm.TransactionWitnessSet => {
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
};

const getUniqueAddresses = (addresses: string[]) => [...new Set(addresses)];

const configure = (linearFeeParameters: LinearFeeParameters): CardanoService => ({
  generateAddress(logger, network, publicKey, stakingCredential, type = AddressType.ENTERPRISE) {
    logger.info(
      `[generateAddress] About to generate address from public key ${publicKey} and network identifier ${network}`
    );

    const publicKeyBuffer = Buffer.from(publicKey, 'hex');

    const pub = CardanoWasm.PublicKey.from_bytes(publicKeyBuffer);

    const payment = CardanoWasm.StakeCredential.from_keyhash(pub.hash());

    if (type === AddressType.REWARD) {
      logger.info('[generateAddress] Deriving cardano enterprise address from valid public staking key');
      const rewardAddress = CardanoWasm.RewardAddress.new(network, payment);
      const bech32address = rewardAddress.to_address().to_bech32(getStakeAddressPrefix(network));
      logger.info(`[generateAddress] reward address is ${bech32address}`);
      return bech32address;
    }

    if (type === AddressType.BASE) {
      if (!stakingCredential) {
        logger.error('[constructionDerive] No staking key was provided for base address creation');
        throw ErrorFactory.missingStakingKeyError();
      }
      const stakingKeyBuffer = Buffer.from(stakingCredential, 'hex');

      const staking = CardanoWasm.PublicKey.from_bytes(stakingKeyBuffer);

      logger.info('[generateAddress] Deriving cardano address from valid public key and staking key');
      const baseAddress = CardanoWasm.BaseAddress.new(
        network,
        payment,
        CardanoWasm.StakeCredential.from_keyhash(staking.hash())
      );
      const bech32address = baseAddress.to_address().to_bech32(getAddressPrefix(network));
      logger.info(`[generateAddress] base address is ${bech32address}`);
      return bech32address;
    }

    if (type === AddressType.ENTERPRISE) {
      logger.info('[generateAddress] Deriving cardano enterprise address from valid public key');
      const enterpriseAddress = CardanoWasm.EnterpriseAddress.new(network, payment);
      const bech32address = enterpriseAddress.to_address().to_bech32(getAddressPrefix(network));
      logger.info(`[generateAddress] enterprise address is ${bech32address}`);
      return bech32address;
    }

    logger.info('[generateAddress] Address type has an invalid value');
    throw ErrorFactory.invalidAddressTypeError();
  },

  getEraAddressType(address) {
    if (CardanoWasm.ByronAddress.is_valid(address)) {
      return EraAddressType.Byron;
    }
    try {
      CardanoWasm.Address.from_bech32(address);
      return EraAddressType.Shelley;
    } catch (error) {
      return null;
    }
  },

  getHashOfSignedTransaction(logger, signedTransaction) {
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
  buildTransaction(logger, unsignedTransaction, signatures) {
    logger.info(`[buildTransaction] About to signed a transaction with ${signatures.length} signatures`);
    const witnesses = getWitnessesForTransaction(logger, signatures);
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

  createUnsignedTransaction(logger, operations, ttl) {
    logger.info(
      `[createUnsignedTransaction] About to create an unsigned transaction with ${operations.length} operations`
    );
    const inputs = operations.filter(({ type }) => type === operationType.INPUT);
    const outputs = operations.filter(({ type }) => type === operationType.OUTPUT);

    logger.info('[createUnsignedTransaction] About to calculate fee');
    const fee = calculateFee(inputs, outputs);
    logger.info('[createUnsignedTransaction] About to create transaction body');
    const transactionBody = createTransactionBody(
      validateAndParseTransactionInputs(logger, inputs),
      validateAndParseTransactionOutputs(logger, outputs),
      fee,
      ttl
    );
    logger.info('[createUnsignedTransaction] Extracting addresses that will sign transaction from inputs');
    const addresses = getUniqueAddresses(
      inputs.map(input => {
        if (input.account) return input.account?.address;
        // This logic is not necessary (because it is made on this.getTransactionInputs(..))
        // but ts expects me to do it again
        throw ErrorFactory.transactionInputsParametersMissingError('Input has missing account address field');
      })
    );

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

  calculateTxSize(logger, operations, ttl) {
    const { bytes, addresses } = this.createUnsignedTransaction(logger, operations, ttl);
    // eslint-disable-next-line consistent-return
    const signatures: Signatures[] = getUniqueAddresses(addresses).map(address => {
      switch (this.getEraAddressType(address)) {
        case EraAddressType.Shelley:
          return {
            signature: SHELLEY_DUMMY_SIGNATURE,
            publicKey: SHELLEY_DUMMY_PUBKEY
          };
        case EraAddressType.Byron: // FIXME: handle this properly when supporting byron in a separate PR
        case null:
          throw ErrorFactory.invalidAddressError(address);
      }
    });
    const transaction = this.buildTransaction(logger, bytes, signatures);
    // eslint-disable-next-line no-magic-numbers
    return transaction.length / 2; // transaction is returned as an hex string and we need size in bytes
  },

  updateTxSize(previousTxSize, previousTtl, updatedTtl) {
    return previousTxSize + cbor.encode(updatedTtl).byteLength - cbor.encode(previousTtl).byteLength;
  },

  calculateTxMinimumFee(transactionSize: number): BigInt {
    return BigInt(linearFeeParameters.minFeeA) * BigInt(transactionSize) + BigInt(linearFeeParameters.minFeeB);
  },

  parseSignedTransaction(logger, networkId, transaction, extraData) {
    try {
      const transactionBuffer = Buffer.from(transaction, 'hex');
      logger.info('[parseSignedTransaction] About to create signed transaction from bytes');
      const parsed = CardanoWasm.Transaction.from_bytes(transactionBuffer);
      logger.info('[parseSignedTransaction] About to parse operations from transaction body');
      const operations = parseOperationsFromTransactionBody(parsed.body(), extraData, networkId);
      logger.info('[parseSignedTransaction] About to get signatures from parsed transaction');
      logger.info(operations, '[parseSignedTransaction] Returning operations');
      const signers = extraData.map(data => data.account?.address || '');
      return { operations, signers };
    } catch (error) {
      logger.error({ error }, '[parseSignedTransaction] Cant instantiate signed transaction from transaction bytes');
      throw ErrorFactory.cantCreateSignedTransactionFromBytes();
    }
  },
  parseUnsignedTransaction(logger, networkId, transaction, extraData) {
    try {
      logger.info(transaction, '[parseUnsignedTransaction] About to create unsigned transaction from bytes');
      const transactionBuffer = Buffer.from(transaction, 'hex');
      const parsed = CardanoWasm.TransactionBody.from_bytes(transactionBuffer);
      logger.info(extraData, '[parseUnsignedTransaction] About to parse operations from transaction body');
      const operations = parseOperationsFromTransactionBody(parsed, extraData, networkId);
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
