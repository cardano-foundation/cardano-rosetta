/* eslint-disable camelcase */
/* eslint-disable wrap-regex */
import CardanoWasm, {
  BigNum,
  Ed25519Signature,
  PublicKey,
  StakeCredential,
  Vkey,
  AuxiliaryData
} from '@emurgo/cardano-serialization-lib-nodejs';
import cbor from 'cbor';
import { BlockchainRepository } from '../db/blockchain-repository';
import { Logger } from 'fastify';
import {
  generateBaseAddress,
  generateEnterpriseAddress,
  generateRewardAddress,
  getEraAddressType,
  isStakeAddress
} from '../utils/cardano/addresses';
import * as OperationsProcessor from '../utils/cardano/operations-processor';
import { getStakingCredentialFromHex } from '../utils/cardano/staking-credentials';
import * as TransactionProcessor from '../utils/cardano/transactions-processor';
import {
  AddressType,
  CHAIN_CODE_LENGTH,
  CurveType,
  EraAddressType,
  NetworkIdentifier,
  PoolOperations,
  PUBLIC_KEY_BYTES_LENGTH,
  SIGNATURE_LENGTH,
  OperationType
} from '../utils/constants';
import { TransactionExtraData } from '../utils/data-mapper';
import { ErrorFactory } from '../utils/errors';
import { hexFormatter, hexStringToBuffer, bytesToHex } from '../utils/formatters';
import { isEd25519KeyHash } from '../utils/validations';
import { ManagedFreeableScope, usingAutoFree } from '../utils/freeable';

export interface Signatures {
  signature: string;
  publicKey: string;
  chainCode?: string;
  address?: string;
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
  keyDeposit: string;
  poolDeposit: string;
}

export interface DepositsSum {
  keyRefundsSum: bigint;
  keyDepositsSum: bigint;
  poolDepositsSum: bigint;
}

// Shelley
const SHELLEY_DUMMY_SIGNATURE = Array.from({ length: SIGNATURE_LENGTH + 1 }).join('0');
const SHELLEY_DUMMY_PUBKEY = Array.from({ length: PUBLIC_KEY_BYTES_LENGTH + 1 }).join('0');

// Byron
const BYRON_DUMMY_SIGNATURE = Array.from({ length: SIGNATURE_LENGTH + 1 }).join('0');
const BYRON_DUMMY_PUBKEY = Array.from({ length: PUBLIC_KEY_BYTES_LENGTH + 1 }).join('0');

// Cold keys
const COLD_DUMMY_SIGNATURE = Array.from({ length: SIGNATURE_LENGTH + 1 }).join('0');
const COLD_DUMMY_PUBKEY = Array.from({ length: PUBLIC_KEY_BYTES_LENGTH + 1 }).join('0');

const CHAIN_CODE_DUMMY = Array.from({ length: CHAIN_CODE_LENGTH + 1 }).join('0');

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
   * Returns protocol parameters
   *
   * @param logger
   */
  getProtocolParameters(logger: Logger): Promise<Components.Schemas.ProtocolParameters>;

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
    ttl: number,
    depositParameters: DepositParameters
  ): UnsignedTransaction;

  /**
   * Calculates the transaction size in bytes for the given operations
   *
   * @param logger
   * @param operations
   * @param ttl
   * @param depositParameters
   */
  calculateTxSize(
    logger: Logger,
    networkId: NetworkIdentifier,
    operations: Components.Schemas.Operation[],
    ttl: number,
    depositParameters?: Components.Schemas.DepositParameters
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
   * protocol parameters
   *
   * @param transactionSize in bytes
   */
  calculateTxMinimumFee(transactionSize: number, protocolParameters: Components.Schemas.ProtocolParameters): bigint;

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
}

const calculateFee = (
  inputAmounts: string[],
  outputAmounts: string[],
  withdrawalAmounts: bigint[],
  depositsSum: DepositsSum
): bigint => {
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

const signatureProcessor: { [eraType: string]: (address: string) => Signatures } = {
  [EraAddressType.Shelley]: (address: string) => ({
    signature: SHELLEY_DUMMY_SIGNATURE,
    publicKey: SHELLEY_DUMMY_PUBKEY,
    address
  }),
  [EraAddressType.Byron]: (address: string) => ({
    signature: BYRON_DUMMY_SIGNATURE,
    publicKey: BYRON_DUMMY_PUBKEY,
    chainCode: CHAIN_CODE_DUMMY,
    address
  }),
  [AddressType.POOL_KEY_HASH]: (address: string) => ({
    signature: COLD_DUMMY_SIGNATURE,
    publicKey: COLD_DUMMY_PUBKEY,
    address
  })
};

const getPoolSigners = (
  logger: Logger,
  network: NetworkIdentifier,
  operation: Components.Schemas.Operation
): string[] =>
  usingAutoFree(scope => {
    const signers = [];
    switch (operation.type) {
      case OperationType.POOL_REGISTRATION: {
        const poolRegistrationParameters = operation.metadata?.poolRegistrationParams;
        if (operation.account?.address) signers.push(operation.account?.address);
        if (poolRegistrationParameters) {
          const { rewardAddress, poolOwners } = poolRegistrationParameters;
          signers.push(rewardAddress, ...poolOwners);
        }
        break;
      }
      case OperationType.POOL_REGISTRATION_WITH_CERT: {
        const poolCertAsHex = operation.metadata?.poolRegistrationCert;
        const { addresses } = OperationsProcessor.validateAndParsePoolRegistrationCert(
          scope,
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
  });

const getSignerFromOperation = (
  scope: ManagedFreeableScope,
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
  const credential = getStakingCredentialFromHex(scope, logger, operation.metadata?.staking_credential);
  return [generateRewardAddress(logger, network, credential)];
};

const processOperations = (
  scope: ManagedFreeableScope,
  logger: Logger,
  network: NetworkIdentifier,
  operations: Components.Schemas.Operation[],
  depositParameters: DepositParameters
) => {
  logger.info('[processOperations] About to calculate fee');
  const { keyDeposit: minKeyDeposit, poolDeposit } = depositParameters;
  const result = OperationsProcessor.convert(scope, logger, network, operations);
  const refundsSum = BigInt(result.stakeKeyDeRegistrationsCount) * BigInt(minKeyDeposit);
  const keyDepositsSum = BigInt(result.stakeKeyRegistrationsCount) * BigInt(minKeyDeposit);
  const poolDepositsSum = BigInt(result.poolRegistrationsCount) * BigInt(poolDeposit);

  const depositsSum = {
    keyRefundsSum: refundsSum,
    keyDepositsSum,
    poolDepositsSum
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

const getEraAddressTypeOrNull = (address: string) => {
  try {
    return getEraAddressType(address);
  } catch {
    return null;
  }
};

const getWitnessesForTransaction = (
  scope: ManagedFreeableScope,
  logger: Logger,
  signatures: Signatures[]
): CardanoWasm.TransactionWitnessSet => {
  try {
    const witnesses = scope.manage(CardanoWasm.TransactionWitnessSet.new());
    const vkeyWitnesses = scope.manage(CardanoWasm.Vkeywitnesses.new());
    const bootstrapWitnesses = scope.manage(CardanoWasm.BootstrapWitnesses.new());
    logger.info('[getWitnessesForTransaction] Extracting witnesses from signatures');
    signatures.forEach(signature => {
      const vkey: Vkey = scope.manage(
        Vkey.new(scope.manage(PublicKey.from_bytes(Buffer.from(signature.publicKey, 'hex'))))
      );
      const ed25519Signature: Ed25519Signature = scope.manage(
        Ed25519Signature.from_bytes(Buffer.from(signature.signature, 'hex'))
      );
      const { address } = signature;
      if (address && getEraAddressTypeOrNull(address) === EraAddressType.Byron) {
        // byron case
        const { chainCode } = signature;
        if (!chainCode) {
          logger.error('[getWitnessesForTransaction] Missing chain code for byron address signature');
          throw ErrorFactory.missingChainCodeError();
        }
        const byronAddress = scope.manage(CardanoWasm.ByronAddress.from_base58(address));
        const bootstrap = scope.manage(
          CardanoWasm.BootstrapWitness.new(
            vkey,
            ed25519Signature,
            hexStringToBuffer(chainCode),
            byronAddress.attributes()
          )
        );
        bootstrapWitnesses.add(bootstrap);
      } else {
        vkeyWitnesses.add(scope.manage(CardanoWasm.Vkeywitness.new(vkey, ed25519Signature)));
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

const configure = (repository: BlockchainRepository, defaultDepositParameters: DepositParameters): CardanoService => ({
  generateAddress(logger, network, publicKeyString, stakingCredentialString, type = AddressType.ENTERPRISE) {
    logger.info(
      `[generateAddress] About to generate address from public key ${JSON.stringify(
        publicKeyString
      )} and network identifier ${network}`
    );

    return usingAutoFree(scope => {
      const publicKeyBuffer = Buffer.from(publicKeyString, 'hex');
      const pub = scope.manage(CardanoWasm.PublicKey.from_bytes(publicKeyBuffer));
      const paymentCredential = scope.manage(StakeCredential.from_keyhash(scope.manage(pub.hash())));

      if (type === AddressType.REWARD) {
        return generateRewardAddress(logger, network, paymentCredential);
      }

      if (type === AddressType.BASE) {
        if (!stakingCredentialString) {
          logger.error('[constructionDerive] No staking key was provided for base address creation');
          throw ErrorFactory.missingStakingKeyError();
        }
        const stakingCredential = getStakingCredentialFromHex(scope, logger, {
          hex_bytes: stakingCredentialString,
          curve_type: CurveType.edwards25519
        });

        return generateBaseAddress(logger, network, paymentCredential, stakingCredential);
      }

      return generateEnterpriseAddress(logger, network, paymentCredential);
    });
  },

  getEraAddressType(address) {
    return getEraAddressTypeOrNull(address);
  },
  isStakeAddress(address) {
    return isStakeAddress(address);
  },
  getHashOfSignedTransaction(logger, signedTransaction) {
    return usingAutoFree(scope => {
      try {
        logger.info(`[getHashOfSignedTransaction] About to hash signed transaction ${signedTransaction}`);
        const signedTransactionBytes = Buffer.from(signedTransaction, 'hex');
        logger.info('[getHashOfSignedTransaction] About to parse transaction from signed transaction bytes');
        const parsed = scope.manage(CardanoWasm.Transaction.from_bytes(signedTransactionBytes));
        logger.info('[getHashOfSignedTransaction] Returning transaction hash');
        const body = scope.manage(parsed.body());
        const hashBuffer = parsed && body && Buffer.from(scope.manage(CardanoWasm.hash_transaction(body)).to_bytes());
        return hexFormatter(hashBuffer);
      } catch (error) {
        logger.error({ error }, '[getHashOfSignedTransaction] There was an error parsing signed transaction');
        throw ErrorFactory.parseSignedTransactionError();
      }
    });
  },
  buildTransaction(logger, unsignedTransaction, signatures, metadata) {
    return usingAutoFree(scope => {
      logger.info(`[buildTransaction] About to signed a transaction with ${signatures.length} signatures`);
      const witnesses = getWitnessesForTransaction(scope, logger, signatures);
      try {
        logger.info('[buildTransaction] Instantiating transaction body from unsigned transaction bytes');
        const transactionBody = scope.manage(
          CardanoWasm.TransactionBody.from_bytes(Buffer.from(unsignedTransaction, 'hex'))
        );
        logger.info('[buildTransaction] Creating transaction using transaction body and extracted witnesses');
        let auxiliaryData: AuxiliaryData | undefined;
        if (metadata) {
          logger.info('[buildTransaction] Adding transaction metadata');
          auxiliaryData = scope.manage(CardanoWasm.AuxiliaryData.from_bytes(hexStringToBuffer(metadata)));
        }
        return bytesToHex(
          scope.manage(CardanoWasm.Transaction.new(transactionBody, witnesses, auxiliaryData)).to_bytes()
        );
      } catch (error) {
        logger.error({ error }, '[buildTransaction] There was an error building signed transaction');
        throw ErrorFactory.cantBuildSignedTransaction();
      }
    });
  },
  createUnsignedTransaction(logger, network, operations, ttl, depositParameters): UnsignedTransaction {
    return usingAutoFree(scope => {
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
      } = processOperations(scope, logger, network, operations, depositParameters);

      logger.info('[createUnsignedTransaction] About to create transaction body');
      const transactionBody = scope.manage(
        CardanoWasm.TransactionBody.new(
          transactionInputs,
          transactionOutputs,
          scope.manage(BigNum.from_str(fee.toString())),
          ttl
        )
      );
      if (voteRegistrationMetadata) {
        logger.info('[createUnsignedTransaction] Hashing vote registration metadata and adding to transaction body');
        const metadataHash = scope.manage(CardanoWasm.hash_auxiliary_data(voteRegistrationMetadata));
        transactionBody.set_auxiliary_data_hash(metadataHash);
      }

      if (certificates.len() > 0) transactionBody.set_certs(certificates);
      if (withdrawals.len() > 0) transactionBody.set_withdrawals(withdrawals);

      const transactionBytes = hexFormatter(Buffer.from(transactionBody.to_bytes()));
      logger.info('[createUnsignedTransaction] Hashing transaction body');
      const bodyHash = scope.manage(CardanoWasm.hash_transaction(transactionBody)).to_bytes();
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
    });
  },

  calculateTxSize(logger, network, operations, ttl, depositParameters) {
    const { bytes, addresses, metadata } = this.createUnsignedTransaction(
      logger,
      network,
      operations,
      ttl,
      depositParameters ?? defaultDepositParameters
    );
    // eslint-disable-next-line consistent-return
    const signatures: Signatures[] = getUniqueAddresses(addresses).map(address => {
      const eraAddressType = this.getEraAddressType(address);
      if (eraAddressType !== null) {
        return signatureProcessor[eraAddressType](address);
      }
      // since pool key hash are passed as address, ed25519 hashes must be included
      if (isEd25519KeyHash(address)) {
        return signatureProcessor[AddressType.POOL_KEY_HASH](address);
      }
      throw ErrorFactory.invalidAddressError(address);
    });
    const transaction = this.buildTransaction(logger, bytes, signatures, metadata);
    // eslint-disable-next-line no-magic-numbers
    return transaction.length / 2; // transaction is returned as an hex string and we need size in bytes
  },

  updateTxSize(previousTxSize, previousTtl, updatedTtl) {
    return previousTxSize + cbor.encode(updatedTtl).byteLength - cbor.encode(previousTtl).byteLength;
  },

  calculateTxMinimumFee(transactionSize: number, protocolParameters: Components.Schemas.ProtocolParameters): bigint {
    const { minFeeCoefficient, minFeeConstant } = protocolParameters;
    return BigInt(minFeeCoefficient) * BigInt(transactionSize) + BigInt(minFeeConstant);
  },

  parseSignedTransaction(logger, networkId, transaction, extraData) {
    return usingAutoFree(scope => {
      try {
        const transactionBuffer = Buffer.from(transaction, 'hex');
        logger.info('[parseSignedTransaction] About to create signed transaction from bytes');
        const parsed = scope.manage(CardanoWasm.Transaction.from_bytes(transactionBuffer));
        logger.info('[parseSignedTransaction] About to parse operations from transaction body');
        const operations = TransactionProcessor.convert(logger, scope.manage(parsed.body()), extraData, networkId);
        logger.info('[parseSignedTransaction] About to get signatures from parsed transaction');
        logger.info(operations, '[parseSignedTransaction] Returning operations');
        const accountIdentifierSigners = getUniqueAccountIdentifiers(
          extraData.operations.reduce(
            (accum, data) => accum.concat(getSignerFromOperation(scope, logger, networkId, data)),
            [] as Array<string>
          )
        );
        return { operations, account_identifier_signers: accountIdentifierSigners };
      } catch (error) {
        logger.error({ error }, '[parseSignedTransaction] Cant instantiate signed transaction from transaction bytes');
        throw ErrorFactory.cantCreateSignedTransactionFromBytes();
      }
    });
  },
  parseUnsignedTransaction(logger, networkId, transaction, extraData) {
    return usingAutoFree(scope => {
      try {
        logger.info(transaction, '[parseUnsignedTransaction] About to create unsigned transaction from bytes');
        const transactionBuffer = Buffer.from(transaction, 'hex');
        const parsed = scope.manage(CardanoWasm.TransactionBody.from_bytes(transactionBuffer));
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
    });
  },
  getProtocolParameters(logger) {
    logger.info('[getProtocolParameters] About to get protocol parameters');
    return repository.getProtocolParameters(logger);
  }
});

export default configure;
