/* eslint-disable camelcase */
/* eslint-disable wrap-regex */
import CardanoWasm, { BigNum, Ed25519Signature, PublicKey, StakeCredential, Vkey } from 'cardano-serialization-lib';
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
  ATTRIBUTES_LENGTH,
  CHAIN_CODE_LENGTH,
  CurveType,
  EraAddressType,
  NetworkIdentifier,
  PREFIX_LENGTH,
  PoolOperations,
  PUBLIC_KEY_BYTES_LENGTH,
  SIGNATURE_LENGTH,
  StakeAddressPrefix,
  OperationType
} from '../utils/constants';
import { TransactionExtraData } from '../utils/data-mapper';
import { ErrorFactory } from '../utils/errors';
import { hexFormatter } from '../utils/formatters';
import { isEd25519KeyHash } from '../utils/validations';

export interface Signatures {
  signature: string;
  publicKey: string;
  chain_code?: string;
  attributes?: string;
}

export interface UnsignedTransaction {
  hash: string;
  bytes: string;
  addresses: string[];
  metadata?: string;
}

export interface TransactionParsed {
  operations: Components.Schemas.Operation[];
  account_identifier_signers: Components.Schemas.AccountIdentifier[];
}

export interface LinearFeeParameters {
  minFeeA: number;
  minFeeB: number;
}

export interface DepositParameters {
  keyDeposit: number;
  poolDeposit: number;
}

export interface DepositsSum {
  keyRefundsSum: bigint;
  keyDepositsSum: bigint;
  poolDepositsSum: bigint;
}

// Shelley
const SHELLEY_DUMMY_SIGNATURE = new Array(SIGNATURE_LENGTH + 1).join('0');
const SHELLEY_DUMMY_PUBKEY = new Array(PUBLIC_KEY_BYTES_LENGTH + 1).join('0');

// Byron
const BYRON_DUMMY_SIGNATURE = new Array(SIGNATURE_LENGTH + 1).join('0');
const BYRON_DUMMY_PUBKEY = new Array(PUBLIC_KEY_BYTES_LENGTH + 1).join('0');

const CHAIN_CODE_DUMMY = new Array(CHAIN_CODE_LENGTH + 1).join('0');
const ATTRIBUTES_DUMMY = new Array(ATTRIBUTES_LENGTH + 1).join('0');

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
  calculateTxMinimumFee(transactionSize: number, linearFeeParameters: LinearFeeParameters): BigInt;

  /**
   * Generates an hex encoded signed transaction
   *
   * @param unsignedTransaction
   * @param signatures
   */
  buildTransaction(
    logger: Logger,
    unsignedTransaction: string,
    signatures: Signatures[],
    transactionMetadata?: string
  ): string;

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
    extraData: TransactionExtraData
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
    extraData: TransactionExtraData
  ): TransactionParsed;

  /**
   * Returns deposit parameters
   *
   * @param logger
   */
  getDepositParameters(logger: Logger): DepositParameters;
}

const calculateFee = (
  inputAmounts: string[],
  outputAmounts: string[],
  withdrawalAmounts: bigint[],
  depositsSum: DepositsSum
): BigInt => {
  const { keyRefundsSum, keyDepositsSum, poolDepositsSum } = depositsSum;
  const inputsSum = inputAmounts.reduce((acum, current) => acum + BigInt(current), BigInt(0)) * BigInt(-1);
  const outputsSum = outputAmounts.reduce((acum, current) => acum + BigInt(current), BigInt(0));
  const withdrawalsSum = withdrawalAmounts.reduce((acum, current) => acum + current, BigInt(0));
  const fee = inputsSum + withdrawalsSum + keyRefundsSum - outputsSum - keyDepositsSum - poolDepositsSum;
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
  },
  [EraAddressType.Byron]: {
    signature: BYRON_DUMMY_SIGNATURE,
    publicKey: BYRON_DUMMY_PUBKEY,
    chain_code: CHAIN_CODE_DUMMY,
    attributes: ATTRIBUTES_DUMMY
  },
  [AddressType.POOL_KEY_HASH]: {
    signature: SHELLEY_DUMMY_SIGNATURE,
    publicKey: SHELLEY_DUMMY_PUBKEY
  }
};

const getPoolSigners = (
  logger: Logger,
  network: NetworkIdentifier,
  operation: Components.Schemas.Operation
): string[] => {
  const signers = [];
  switch (operation.type) {
    case OperationType.POOL_REGISTRATION: {
      const poolRegistrationParameters = operation.metadata?.poolRegistrationParams;
      if (operation.account?.address) signers.push(operation.account?.address);
      if (poolRegistrationParameters) {
        const { rewardAddress, poolOwners } = poolRegistrationParameters;
        signers.push(rewardAddress);
        signers.push(...poolOwners);
      }
      break;
    }
    case OperationType.POOL_REGISTRATION_WITH_CERT: {
      const poolCertAsHex = operation.metadata?.poolRegistrationCert;
      const { addresses } = OperationsProcessor.validateAndParsePoolRegistrationCert(
        logger,
        network,
        poolCertAsHex,
        operation.account?.address
      );
      signers.push(...addresses);
      break;
    }
    // pool retirement case
    default: {
      if (operation.account?.address) signers.push(operation.account?.address);
      break;
    }
  }
  logger.info(`[getPoolSigners] About to return ${signers.length} signers for ${operation.type} operation`);
  return signers;
};

const getSignerFromOperation = (
  logger: Logger,
  network: NetworkIdentifier,
  operation: Components.Schemas.Operation
): Array<string> => {
  if (PoolOperations.includes(operation.type as OperationType)) {
    return getPoolSigners(logger, network, operation);
  }
  if (operation.account?.address) {
    return [operation.account.address];
  }
  if (operation.type === OperationType.VOTE_REGISTRATION) {
    return [];
  }
  const credential = getStakingCredentialFromHex(logger, operation.metadata?.staking_credential);
  return [generateRewardAddress(logger, network, credential)];
};

const processOperations = (
  logger: Logger,
  network: NetworkIdentifier,
  operations: Components.Schemas.Operation[],
  depositParameters: DepositParameters
) => {
  logger.info('[processOperations] About to calculate fee');
  const { keyDeposit: minKeyDeposit, poolDeposit } = depositParameters;
  const result = OperationsProcessor.convert(logger, network, operations);
  const refundsSum = result.stakeKeyDeRegistrationsCount * minKeyDeposit;
  const keyDepositsSum = result.stakeKeyRegistrationsCount * minKeyDeposit;
  const poolDepositsSum = result.poolRegistrationsCount * poolDeposit;

  const depositsSum = {
    keyRefundsSum: BigInt(refundsSum),
    keyDepositsSum: BigInt(keyDepositsSum),
    poolDepositsSum: BigInt(poolDepositsSum)
  };
  const fee = calculateFee(result.inputAmounts, result.outputAmounts, result.withdrawalAmounts, depositsSum);
  logger.info(`[processOperations] Calculated fee: ${fee}`);
  return {
    transactionInputs: result.transactionInputs,
    transactionOutputs: result.transactionOutputs,
    certificates: result.certificates,
    withdrawals: result.withdrawals,
    addresses: getUniqueAddresses(result.addresses),
    fee,
    voteRegistrationMetadata: result.voteRegistrationMetadata
  };
};

const getWitnessesForTransaction = (logger: Logger, signatures: Signatures[]): CardanoWasm.TransactionWitnessSet => {
  try {
    const witnesses = CardanoWasm.TransactionWitnessSet.new();
    const vkeyWitnesses = CardanoWasm.Vkeywitnesses.new();
    const bootstrapWitnesses = CardanoWasm.BootstrapWitnesses.new();
    logger.info('[getWitnessesForTransaction] Extracting witnesses from signatures');
    signatures.forEach(signature => {
      const vkey: Vkey = Vkey.new(PublicKey.from_bytes(Buffer.from(signature.publicKey, 'hex')));
      const ed25519Signature: Ed25519Signature = Ed25519Signature.from_bytes(Buffer.from(signature.signature, 'hex'));
      if (signature.chain_code && signature.attributes) {
        // byron case
        const chainCode = Buffer.from(signature.chain_code, 'hex');
        const attributes = Buffer.from(signature.attributes, 'hex');
        bootstrapWitnesses.add(CardanoWasm.BootstrapWitness.new(vkey, ed25519Signature, chainCode, attributes));
      } else {
        vkeyWitnesses.add(CardanoWasm.Vkeywitness.new(vkey, ed25519Signature));
      }
    });
    logger.info(`[getWitnessesForTransaction] ${vkeyWitnesses.len()} witnesses were extracted to sign transaction`);
    if (vkeyWitnesses.len() > 0) witnesses.set_vkeys(vkeyWitnesses);
    if (bootstrapWitnesses.len() > 0) witnesses.set_bootstraps(bootstrapWitnesses);
    return witnesses;
  } catch (error) {
    logger.error({ error }, '[getWitnessesForTransaction] There was an error building witnesses set for transaction');
    throw ErrorFactory.cantBuildWitnessesSet();
  }
};

const configure = (depositParameters: DepositParameters): CardanoService => ({
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
  buildTransaction(logger, unsignedTransaction, signatures, metadata) {
    logger.info(`[buildTransaction] About to signed a transaction with ${signatures.length} signatures`);
    const witnesses = getWitnessesForTransaction(logger, signatures);
    try {
      logger.info('[buildTransaction] Instantiating transaction body from unsigned transaction bytes');
      const transactionBody = CardanoWasm.TransactionBody.from_bytes(Buffer.from(unsignedTransaction, 'hex'));
      logger.info('[buildTransaction] Creating transaction using transaction body and extracted witnesses');
      let auxiliaryData;
      if (metadata) {
        logger.info('[buildTransaction] Adding transaction metadata');
        auxiliaryData = CardanoWasm.AuxiliaryData.from_bytes(Buffer.from(metadata, 'hex'));
      }
      return hexFormatter(
        Buffer.from(CardanoWasm.Transaction.new(transactionBody, witnesses, auxiliaryData).to_bytes())
      );
    } catch (error) {
      logger.error({ error }, '[buildTransaction] There was an error building signed transaction');
      throw ErrorFactory.cantBuildSignedTransaction();
    }
  },
  createUnsignedTransaction(logger, network, operations, ttl): UnsignedTransaction {
    logger.info(
      `[createUnsignedTransaction] About to create an unsigned transaction with ${operations.length} operations`
    );
    const {
      transactionInputs,
      transactionOutputs,
      certificates,
      withdrawals,
      addresses,
      fee,
      voteRegistrationMetadata
    } = processOperations(logger, network, operations, depositParameters);

    logger.info('[createUnsignedTransaction] About to create transaction body');
    const transactionBody = CardanoWasm.TransactionBody.new(
      transactionInputs,
      transactionOutputs,
      BigNum.from_str(fee.toString()),
      ttl
    );
    if (voteRegistrationMetadata) {
      logger.info('[createUnsignedTransaction] Hashing vote registration metadata and adding to transaction body');
      const metadataHash = CardanoWasm.hash_auxiliary_data(voteRegistrationMetadata);
      transactionBody.set_auxiliary_data_hash(metadataHash);
    }

    if (certificates.len() > 0) transactionBody.set_certs(certificates);
    if (withdrawals.len() > 0) transactionBody.set_withdrawals(withdrawals);

    const transactionBytes = hexFormatter(Buffer.from(transactionBody.to_bytes()));
    logger.info('[createUnsignedTransaction] Hashing transaction body');
    const bodyHash = CardanoWasm.hash_transaction(transactionBody).to_bytes();
    const toReturn: UnsignedTransaction = {
      bytes: transactionBytes,
      hash: hexFormatter(Buffer.from(bodyHash)),
      addresses
    };
    if (voteRegistrationMetadata) {
      toReturn.metadata = Buffer.from(voteRegistrationMetadata.to_bytes()).toString('hex');
    }
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
      if (eraAddressType !== null) {
        return signatureProcessor[eraAddressType];
      }
      // since pool key hash are passed as address, ed25519 hashes must be included
      if (isEd25519KeyHash(address)) {
        return signatureProcessor[AddressType.POOL_KEY_HASH];
      }
      throw ErrorFactory.invalidAddressError(address);
    });
    const transaction = this.buildTransaction(logger, bytes, signatures);
    // eslint-disable-next-line no-magic-numbers
    return transaction.length / 2; // transaction is returned as an hex string and we need size in bytes
  },

  updateTxSize(previousTxSize, previousTtl, updatedTtl) {
    return previousTxSize + cbor.encode(updatedTtl).byteLength - cbor.encode(previousTtl).byteLength;
  },

  calculateTxMinimumFee(transactionSize: number, linearFeeParameters: LinearFeeParameters): BigInt {
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
        extraData.operations.reduce(
          (accum, data) => accum.concat(getSignerFromOperation(logger, networkId, data)),
          [] as Array<string>
        )
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
      logger.info({ extraData }, '[parseUnsignedTransaction] About to parse operations from transaction body');
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
  },
  getDepositParameters(logger) {
    logger.info(depositParameters, '[getDepositParameters] About to return deposit parameters');
    return depositParameters;
  }
});

export default configure;
