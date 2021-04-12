/* eslint-disable camelcase */
/* eslint-disable wrap-regex */
import CardanoWasm, {
  BigNum,
  Ed25519Signature,
  PublicKey,
  StakeCredential,
  Vkey
} from '@emurgo/cardano-serialization-lib-nodejs';
import cbor from 'cbor';
import { Logger } from 'fastify';
import {
  generateBaseAddress,
  generateEnterpriseAddress,
  generateRewardAddress,
  getEraAddressType
} from '../utils/cardano/addresses';
import * as OperationsProcessor from '../utils/cardano/operations-processor';
import { getStakingCredentialFromHex } from '../utils/cardano/staking-credentials';
import * as TransactionProcessor from '../utils/cardano/transactions-processor';
import {
  AddressType,
  CurveType,
  EraAddressType,
  NetworkIdentifier,
  PREFIX_LENGTH,
  PUBLIC_KEY_BYTES_LENGTH,
  SIGNATURE_LENGTH,
  StakeAddressPrefix
} from '../utils/constants';
import { ErrorFactory } from '../utils/errors';
import { hexFormatter } from '../utils/formatters';

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
  account_identifier_signers: Components.Schemas.AccountIdentifier[];
}

export interface LinearFeeParameters {
  minFeeA: number;
  minFeeB: number;
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
  ): string;

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
  const withdrawalsSum = withdrawalAmounts.reduce((acum, current) => acum + current, BigInt(0));
  const fee = inputsSum + withdrawalsSum + refundsSum - outputsSum - depositsSum;
  if (fee < 0) {
    throw ErrorFactory.outputsAreBiggerThanInputsError();
  }
  return fee;
};

const addressesToAccountIdentifiers = (addresses: string[]) => addresses.map(address => ({ address }));
const getUniqueAddresses = (addresses: string[]) => [...new Set(addresses)];
const getUniqueAccountIdentifiers = (addresses: string[]) =>
  addressesToAccountIdentifiers(getUniqueAddresses(addresses));

const signatureProcessor: { [eraType: string]: Signatures } = {
  [EraAddressType.Shelley]: {
    signature: SHELLEY_DUMMY_SIGNATURE,
    publicKey: SHELLEY_DUMMY_PUBKEY
  } // FIXME: handle this properly when supporting byron in a separate PR
};

const getSignerFromOperation = (
  logger: Logger,
  network: NetworkIdentifier,
  operation: Components.Schemas.Operation
): string => {
  if (operation.account?.address) return operation.account?.address;
  const credential = getStakingCredentialFromHex(logger, operation.metadata?.staking_credential);
  return generateRewardAddress(logger, network, credential);
};

const processOperations = (
  logger: Logger,
  network: NetworkIdentifier,
  operations: Components.Schemas.Operation[],
  minKeyDeposit: number
) => {
  logger.info('[processOperations] About to calculate fee');
  const result = OperationsProcessor.convert(logger, network, operations);
  const refundsSum = result.stakeKeyDeRegistrationsCount * minKeyDeposit;
  const depositsSum = result.stakeKeyRegistrationsCount * minKeyDeposit;
  const fee = calculateFee(
    result.inputAmounts,
    result.outputAmounts,
    BigInt(refundsSum),
    BigInt(depositsSum),
    result.withdrawalAmounts
  );
  logger.info(`[processOperations] Calculated fee: ${fee}`);
  return {
    transactionInputs: result.transactionInputs,
    transactionOutputs: result.transactionOutputs,
    certificates: result.certificates,
    withdrawals: result.withdrawals,
    addresses: getUniqueAddresses(result.addresses),
    fee
  };
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
    logger.info(`[getWitnessesForTransaction] ${vkeyWitnesses.len()} witnesses were extracted to sign transaction`);
    witnesses.set_vkeys(vkeyWitnesses);
    return witnesses;
  } catch (error) {
    logger.error({ error }, '[getWitnessesForTransaction] There was an error building witnesses set for transaction');
    throw ErrorFactory.cantBuildWitnessesSet();
  }
};

const configure = (linearFeeParameters: LinearFeeParameters, minKeyDeposit: number): CardanoService => ({
  generateAddress(logger, network, publicKeyString, stakingCredentialString, type = AddressType.ENTERPRISE) {
    logger.info(
      `[generateAddress] About to generate address from public key ${JSON.stringify(
        publicKeyString
      )} and network identifier ${network}`
    );

    const publicKeyBuffer = Buffer.from(publicKeyString, 'hex');
    const pub = CardanoWasm.PublicKey.from_bytes(publicKeyBuffer);
    const paymentCredential = StakeCredential.from_keyhash(pub.hash());

    if (type === AddressType.REWARD) {
      return generateRewardAddress(logger, network, paymentCredential);
    }

    if (type === AddressType.BASE) {
      if (!stakingCredentialString) {
        logger.error('[constructionDerive] No staking key was provided for base address creation');
        throw ErrorFactory.missingStakingKeyError();
      }
      const stakingCredential = getStakingCredentialFromHex(logger, {
        hex_bytes: stakingCredentialString,
        curve_type: CurveType.edwards25519
      });

      return generateBaseAddress(logger, network, paymentCredential, stakingCredential);
    }

    return generateEnterpriseAddress(logger, network, paymentCredential);
  },

  getEraAddressType(address) {
    try {
      return getEraAddressType(address);
    } catch (error) {
      return null;
    }
  },
  getPrefixFromAddress(address) {
    return address.slice(0, PREFIX_LENGTH);
  },
  isStakeAddress(address) {
    const addressPrefix = this.getPrefixFromAddress(address);
    return [StakeAddressPrefix.MAIN as string, StakeAddressPrefix.TEST as string].some(type =>
      addressPrefix.includes(type)
    );
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
    const transactionBody = CardanoWasm.TransactionBody.new(
      transactionInputs,
      transactionOutputs,
      BigNum.from_str(fee.toString()),
      ttl
    );

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
      const eraAddressType = this.getEraAddressType(address);
      if (eraAddressType === null) throw ErrorFactory.invalidAddressError(address);
      return signatureProcessor[eraAddressType];
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
      const operations = TransactionProcessor.convert(logger, parsed.body(), extraData, networkId);
      logger.info('[parseSignedTransaction] About to get signatures from parsed transaction');
      logger.info(operations, '[parseSignedTransaction] Returning operations');
      const accountIdentifierSigners = getUniqueAccountIdentifiers(
        extraData.map(data => getSignerFromOperation(logger, networkId, data))
      );
      return { operations, account_identifier_signers: accountIdentifierSigners };
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
      const operations = TransactionProcessor.convert(logger, parsed, extraData, networkId);
      logger.info(operations, `[parseUnsignedTransaction] Returning ${operations.length} operations`);
      return { operations, account_identifier_signers: [] };
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
