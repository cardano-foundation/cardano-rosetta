/* eslint-disable camelcase */
/* eslint-disable wrap-regex */
import CardanoWasm, {
  BigNum,
  Ed25519Signature,
  PublicKey,
  StakeRegistration,
  StakeDeregistration,
  StakeDelegation,
  Vkey
} from '@emurgo/cardano-serialization-lib-nodejs';
import cbor from 'cbor';
import { Logger } from 'fastify';
import { ErrorFactory } from '../utils/errors';
import { hexFormatter } from '../utils/formatters';
import {
  ADA,
  ADA_DECIMALS,
  operationType,
  AddressType,
  SIGNATURE_LENGTH,
  PUBLIC_KEY_BYTES_LENGTH,
  stakeType,
  PREFIX_LENGTH
} from '../utils/constants';
import { isKeyValid } from '../utils/validations';

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
   * This function returns a the address prefix based on a string encoded one
   *
   * @param address to be parsed
   */
  getPrefixFromAddress(address: string): string;

  /**
   * Returns true if the address's prefix belongs to stake address
   *
   * @param address
   */
  isStakeAddress(address: string): boolean;

  /**
   * Creates an unsigned transaction for the given operation.
   *
   * @param operations
   * @param ttl
   */
  createUnsignedTransaction(
    logger: Logger,
    networkId: NetworkIdentifier,
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
  calculateTxSize(
    logger: Logger,
    networkId: NetworkIdentifier,
    operations: Components.Schemas.Operation[],
    ttl: number
  ): number;

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

const calculateFee = (
  inputAmounts: string[],
  outputAmounts: string[],
  refundsSum: bigint,
  depositsSum: bigint,
  withdrawalAmounts: bigint[]
): BigInt => {
  const inputsSum = inputAmounts.reduce((acum, current) => acum + BigInt(current), BigInt(0)) * BigInt(-1);
  const outputsSum = outputAmounts.reduce((acum, current) => acum + BigInt(current), BigInt(0));
  if (outputsSum > inputsSum) {
    throw ErrorFactory.outputsAreBiggerThanInputsError();
  }
  const withdrawalsSum = withdrawalAmounts.reduce((acum, current) => acum + current, BigInt(0));
  return inputsSum + withdrawalsSum + refundsSum - outputsSum - depositsSum;
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

const getStakingCredentialFromHex = (
  logger: Logger,
  staking_credential?: {
    hex_bytes: string;
    curve_type: string;
  }
): CardanoWasm.StakeCredential => {
  if (!staking_credential?.hex_bytes) {
    logger.error('[getStakingCredentialFromHex] Staking key not provided');
    throw ErrorFactory.missingStakingKeyError();
  }
  if (!isKeyValid(staking_credential.hex_bytes, staking_credential.curve_type)) {
    logger.info('[constructionPayloads] Staking key has an invalid format');
    throw ErrorFactory.invalidStakingKeyFormat();
  }
  const stakingKeyBuffer = Buffer.from(staking_credential.hex_bytes, 'hex');
  const stakingKey = CardanoWasm.PublicKey.from_bytes(stakingKeyBuffer);
  return CardanoWasm.StakeCredential.from_keyhash(stakingKey.hash());
};

const validateAndParseTransactionOutput = (
  logger: Logger,
  output: Components.Schemas.Operation
): CardanoWasm.TransactionOutput => {
  // eslint-disable-next-line camelcase
  let address;
  try {
    address = output.account && CardanoWasm.Address.from_bech32(output.account.address);
  } catch (error) {
    throw ErrorFactory.transactionOutputDeserializationError(error.toString());
  }
  if (!address) {
    logger.error('[validateAndParseTransactionOutput] Output has missing address field');
    throw ErrorFactory.transactionOutputsParametersMissingError('Output has missing address field');
  }
  const value = output.amount?.value;
  if (!value) {
    logger.error('[validateAndParseTransactionOutput] Output has missing amount value field');
    throw ErrorFactory.transactionOutputsParametersMissingError('Output has missing amount value field');
  }
  if (/^-\d+/.test(value)) {
    logger.error('[validateAndParseTransactionOutput] Output has negative value');
    throw ErrorFactory.transactionOutputsParametersMissingError('Output has negative amount value');
  }
  try {
    return CardanoWasm.TransactionOutput.new(address, BigNum.new(BigInt(output.amount?.value)));
  } catch (error) {
    throw ErrorFactory.transactionOutputDeserializationError(error.toString());
  }
};

const validateAndParseTransactionInput = (
  logger: Logger,
  input: Components.Schemas.Operation
): CardanoWasm.TransactionInput => {
  if (!input.coin_change) {
    logger.error('[validateAndParseTransactionInput] Input has missing coin_change');
    throw ErrorFactory.transactionInputsParametersMissingError('Input has missing coin_change field');
  }
  const [transactionId, index] = input.coin_change && input.coin_change.coin_identifier.identifier.split(':');
  if (!(transactionId && index)) {
    logger.error('[validateAndParseTransactionInput] Input has missing transactionId and index');
    throw ErrorFactory.transactionInputsParametersMissingError('Input has invalid coin_identifier field');
  }
  const value = input.amount?.value;
  if (!value) {
    logger.error('[validateAndParseTransactionInput] Input has missing amount value field');
    throw ErrorFactory.transactionInputsParametersMissingError('Input has missing amount value field');
  }
  if (/^\+?\d+/.test(value)) {
    logger.error('[validateAndParseTransactionInput] Input has positive value');
    throw ErrorFactory.transactionInputsParametersMissingError('Input has positive amount value');
  }
  try {
    return CardanoWasm.TransactionInput.new(
      CardanoWasm.TransactionHash.from_bytes(Buffer.from(transactionId, 'hex')),
      Number(index)
    );
  } catch (error) {
    throw ErrorFactory.transactionInputDeserializationError(
      'There was an error deserializating transaction input: '.concat(error)
    );
  }
};

const getUniqueAddresses = (addresses: string[]) => [...new Set(addresses)];

const processStakeKeyRegistration = (
  logger: Logger,
  operation: Components.Schemas.Operation
): CardanoWasm.Certificate => {
  logger.info('[processStakeKeyRegistration] About to process stake key registration');
  const credential = getStakingCredentialFromHex(logger, operation.metadata?.staking_credential);
  return CardanoWasm.Certificate.new_stake_registration(StakeRegistration.new(credential));
};

const processStakeKeyDeRegistration = (
  logger: Logger,
  operation: Components.Schemas.Operation
): CardanoWasm.Certificate => {
  logger.info('[processStakeKeyDeRegistration] About to process stake key deregistration');
  const credential = getStakingCredentialFromHex(logger, operation.metadata?.staking_credential);
  return CardanoWasm.Certificate.new_stake_deregistration(StakeDeregistration.new(credential));
};

const processStakeDelegation = (logger: Logger, operation: Components.Schemas.Operation): CardanoWasm.Certificate => {
  logger.info('[processStakeDelegation] About to process stake key delegation');
  const credential = getStakingCredentialFromHex(logger, operation.metadata?.staking_credential);
  const poolKeyHash = operation.metadata?.pool_key_hash;
  if (!poolKeyHash) {
    logger.error('[processStakeDelegation] no pool key hash provided for stake delegation');
    throw ErrorFactory.missingPoolKeyError();
  }
  return CardanoWasm.Certificate.new_stake_delegation(
    StakeDelegation.new(credential, CardanoWasm.Ed25519KeyHash.from_bytes(Buffer.from(poolKeyHash, 'hex')))
  );
};

const processWithdrawal = (
  logger: Logger,
  network: NetworkIdentifier,
  operation: Components.Schemas.Operation
): CardanoWasm.RewardAddress => {
  logger.info('[processWithdrawal] About to process withdrawal');
  const credential = getStakingCredentialFromHex(logger, operation.metadata?.staking_credential);
  return CardanoWasm.RewardAddress.new(network, credential);
};

const processOperations = (
  logger: Logger,
  network: NetworkIdentifier,
  operations: Components.Schemas.Operation[],
  minKeyDeposit: number
) => {
  const transactionInputs = CardanoWasm.TransactionInputs.new();
  const transactionOutputs = CardanoWasm.TransactionOutputs.new();
  const certificates = CardanoWasm.Certificates.new();
  const withdrawals = CardanoWasm.Withdrawals.new();
  const addresses: string[] = [];
  const inputAmounts: string[] = [];
  const outputAmounts: string[] = [];
  const withdrawalAmounts: bigint[] = [];
  let stakeKeyRegistrationsCount = 0;
  let stakeKeyDeRegistrationsCount = 0;
  operations.forEach(operation => {
    switch (operation.type) {
      case operationType.INPUT: {
        transactionInputs.add(validateAndParseTransactionInput(logger, operation));
        addresses.push(operation.account!.address);
        inputAmounts.push(operation.amount!.value);
        break;
      }
      case operationType.OUTPUT: {
        transactionOutputs.add(validateAndParseTransactionOutput(logger, operation));
        outputAmounts.push(operation.amount!.value);
        break;
      }
      case operationType.STAKE_KEY_REGISTRATION: {
        certificates.add(processStakeKeyRegistration(logger, operation));
        stakeKeyRegistrationsCount++;
        break;
      }
      case operationType.STAKE_KEY_DEREGISTRATION: {
        certificates.add(processStakeKeyDeRegistration(logger, operation));
        stakeKeyDeRegistrationsCount++;
        break;
      }
      case operationType.STAKE_DELEGATION: {
        certificates.add(processStakeDelegation(logger, operation));
        break;
      }
      case operationType.WITHDRAWAL: {
        const rewardAddress = processWithdrawal(logger, network, operation);
        const withdrawalAmount = BigInt(operation.amount?.value);
        withdrawalAmounts.push(withdrawalAmount);
        withdrawals.insert(rewardAddress, BigNum.new(withdrawalAmount));
        break;
      }
      default: {
        logger.error(`[processOperations] Operation with id ${operation.operation_identifier} has invalid type`);
        throw ErrorFactory.invalidOperationTypeError();
      }
    }
  });
  logger.info('[processOperations] About to calculate fee');
  const refundsSum = stakeKeyDeRegistrationsCount * minKeyDeposit;
  const depositsSum = stakeKeyRegistrationsCount * minKeyDeposit;
  const fee = calculateFee(inputAmounts, outputAmounts, BigInt(refundsSum), BigInt(depositsSum), withdrawalAmounts);
  return {
    transactionInputs,
    transactionOutputs,
    certificates,
    withdrawals,
    addresses: getUniqueAddresses(addresses),
    fee
  };
};

const createTransactionBody = (
  inputs: CardanoWasm.TransactionInputs,
  outputs: CardanoWasm.TransactionOutputs,
  fee: BigInt,
  ttl: number
): CardanoWasm.TransactionBody =>
  CardanoWasm.TransactionBody.new(inputs, outputs, BigNum.from_str(fee.toString()), ttl);

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

const configure = (linearFeeParameters: LinearFeeParameters, minKeyDeposit: number): CardanoService => ({
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
  getPrefixFromAddress(address) {
    return address.slice(0, PREFIX_LENGTH);
  },
  isStakeAddress(address) {
    const addressPrefix = this.getPrefixFromAddress(address);
    return [stakeType.STAKE as string, stakeType.STAKE_TEST as string].some(type => addressPrefix.includes(type));
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

  createUnsignedTransaction(logger, network, operations, ttl) {
    logger.info(
      `[createUnsignedTransaction] About to create an unsigned transaction with ${operations.length} operations`
    );
    const { transactionInputs, transactionOutputs, certificates, withdrawals, addresses, fee } = processOperations(
      logger,
      network,
      operations,
      minKeyDeposit
    );

    logger.info('[createUnsignedTransaction] About to create transaction body');
    const transactionBody = createTransactionBody(transactionInputs, transactionOutputs, fee, ttl);

    if (certificates.len() > 0) transactionBody.set_certs(certificates);
    if (withdrawals.len() > 0) transactionBody.set_withdrawals(withdrawals);

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

  calculateTxSize(logger, network, operations, ttl) {
    const { bytes, addresses } = this.createUnsignedTransaction(logger, network, operations, ttl);
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
