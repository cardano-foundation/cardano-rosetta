/* eslint-disable wrap-regex */
import CardanoWasm, {
  AssetName,
  Assets,
  BigNum,
  MultiAsset,
  ScriptHash,
  StakeDelegation,
  StakeDeregistration,
  StakeRegistration,
  Value
} from 'cardano-serialization-lib';
import { Logger } from 'fastify';
import { NetworkIdentifier, OperationType } from '../constants';
import { ErrorFactory } from '../errors';
import { isPolicyIdValid, isTokenNameValid } from '../validations';
import { generateRewardAddress } from './addresses';
import { getStakingCredentialFromHex } from './staking-credentials';

/**
 * This function validates and parses token bundles that might be attached to unspents
 *
 * @param tokenBundle bundle to be parsed
 */
const validateAndParseTokenBundle = (tokenBundle: Components.Schemas.TokenBundleItem[]): CardanoWasm.MultiAsset =>
  tokenBundle.reduce((multiAssets, multiAsset) => {
    const polictyId = multiAsset.policyId;
    if (!isPolicyIdValid(polictyId))
      throw ErrorFactory.transactionOutputsParametersMissingError(`PolictyId ${polictyId} is not valid`);
    const policy = ScriptHash.from_bytes(Buffer.from(multiAsset.policyId, 'hex'));
    const assetsToAdd = multiAsset.tokens.reduce((assets, asset) => {
      const tokenName = asset.currency.symbol;
      if (!isTokenNameValid(asset.currency.symbol))
        throw ErrorFactory.transactionOutputsParametersMissingError(`Token name ${tokenName} is not valid`);
      const assetName = AssetName.new(Buffer.from(tokenName, 'hex'));
      if (assets.get(assetName) !== undefined) {
        throw ErrorFactory.transactionOutputsParametersMissingError(
          `Token name ${tokenName} has already been added for policy ${multiAsset.policyId} and will be overriden`
        );
      }
      assets.insert(assetName, BigNum.from_str(asset.value));
      return assets;
    }, Assets.new());
    multiAssets.insert(policy, assetsToAdd);
    return multiAssets;
  }, MultiAsset.new());

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
  const outputValue = output.amount?.value;
  if (!output.amount || !outputValue) {
    logger.error('[validateAndParseTransactionOutput] Output has missing amount value field');
    throw ErrorFactory.transactionOutputsParametersMissingError('Output has missing amount value field');
  }
  if (/^-\d+/.test(outputValue)) {
    logger.error('[validateAndParseTransactionOutput] Output has negative value');
    throw ErrorFactory.transactionOutputsParametersMissingError('Output has negative amount value');
  }
  const value = Value.new(BigNum.from_str(output.amount?.value));
  if (output.metadata?.tokenBundle) value.set_multiasset(validateAndParseTokenBundle(output.metadata.tokenBundle));
  try {
    return CardanoWasm.TransactionOutput.new(address, value);
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

const processStakeKeyRegistration = (
  logger: Logger,
  operation: Components.Schemas.Operation
): CardanoWasm.Certificate => {
  logger.info('[processStakeKeyRegistration] About to process stake key registration');
  // eslint-disable-next-line camelcase
  const credential = getStakingCredentialFromHex(logger, operation.metadata?.staking_credential);
  return CardanoWasm.Certificate.new_stake_registration(StakeRegistration.new(credential));
};

const processOperationCertification = (
  logger: Logger,
  network: NetworkIdentifier,
  operation: Components.Schemas.Operation
): { certificate: CardanoWasm.Certificate; address: string } => {
  logger.info(`[processOperationCertification] About to process operation of type ${operation.type}`);
  // eslint-disable-next-line camelcase
  const credential = getStakingCredentialFromHex(logger, operation.metadata?.staking_credential);
  const address = generateRewardAddress(logger, network, credential);
  if (operation.type === OperationType.STAKE_DELEGATION) {
    // eslint-disable-next-line camelcase
    const poolKeyHash = operation.metadata?.pool_key_hash;
    if (!poolKeyHash) {
      logger.error('[processOperationCertification] no pool key hash provided for stake delegation');
      throw ErrorFactory.missingPoolKeyError();
    }
    const certificate = CardanoWasm.Certificate.new_stake_delegation(
      StakeDelegation.new(credential, CardanoWasm.Ed25519KeyHash.from_bytes(Buffer.from(poolKeyHash, 'hex')))
    );
    return { certificate, address };
  }
  return {
    certificate: CardanoWasm.Certificate.new_stake_deregistration(StakeDeregistration.new(credential)),
    address
  };
};

const processWithdrawal = (
  logger: Logger,
  network: NetworkIdentifier,
  operation: Components.Schemas.Operation
): { reward: CardanoWasm.RewardAddress; address: string } => {
  logger.info('[processWithdrawal] About to process withdrawal');
  // eslint-disable-next-line camelcase
  const credential = getStakingCredentialFromHex(logger, operation.metadata?.staking_credential);
  const address = generateRewardAddress(logger, network, credential);
  return { reward: CardanoWasm.RewardAddress.new(network, credential), address };
};

const operationProcessor: (
  logger: Logger,
  operation: Components.Schemas.Operation,
  network: NetworkIdentifier,
  resultAccumulator: ProcessOperationsResult
) => {
  [type: string]: () => ProcessOperationsResult;
} = (logger, operation, network, resultAccumulator) => ({
  [OperationType.INPUT]: () => {
    resultAccumulator.transactionInputs.add(validateAndParseTransactionInput(logger, operation));
    resultAccumulator.addresses.push(operation.account!.address);
    resultAccumulator.inputAmounts.push(operation.amount!.value);
    return resultAccumulator;
  },
  [OperationType.OUTPUT]: () => {
    resultAccumulator.transactionOutputs.add(validateAndParseTransactionOutput(logger, operation));
    resultAccumulator.outputAmounts.push(operation.amount!.value);
    return resultAccumulator;
  },
  [OperationType.STAKE_KEY_REGISTRATION]: () => {
    resultAccumulator.certificates.add(processStakeKeyRegistration(logger, operation));
    resultAccumulator.stakeKeyRegistrationsCount++;
    return resultAccumulator;
  },
  [OperationType.STAKE_KEY_DEREGISTRATION]: () => {
    const { certificate, address } = processOperationCertification(logger, network, operation);
    resultAccumulator.certificates.add(certificate);
    resultAccumulator.addresses.push(address);
    resultAccumulator.stakeKeyDeRegistrationsCount++;
    return resultAccumulator;
  },
  [OperationType.STAKE_DELEGATION]: () => {
    const { certificate, address } = processOperationCertification(logger, network, operation);
    resultAccumulator.certificates.add(certificate);
    resultAccumulator.addresses.push(address);
    return resultAccumulator;
  },
  [OperationType.WITHDRAWAL]: () => {
    const { reward, address } = processWithdrawal(logger, network, operation);
    const withdrawalAmount = BigInt(operation.amount?.value);
    resultAccumulator.withdrawalAmounts.push(withdrawalAmount);
    resultAccumulator.withdrawals.insert(reward, BigNum.from_str(withdrawalAmount.toString()));
    resultAccumulator.addresses.push(address);
    return resultAccumulator;
  }
});

export interface ProcessOperationsResult {
  transactionInputs: CardanoWasm.TransactionInputs;
  transactionOutputs: CardanoWasm.TransactionOutputs;
  certificates: CardanoWasm.Certificates;
  withdrawals: CardanoWasm.Withdrawals;
  addresses: string[];
  inputAmounts: string[];
  outputAmounts: string[];
  withdrawalAmounts: bigint[];
  stakeKeyRegistrationsCount: number;
  stakeKeyDeRegistrationsCount: number;
}

/**
 * Processes the given operations and generates according Cardano related objects to be used
 * to build a transaction.
 *
 * Extra information is added as it might be required and we are traversing the operations
 * already.
 *
 * @param logger
 * @param network
 * @param operations
 */
export const convert = (
  logger: Logger,
  network: NetworkIdentifier,
  operations: Components.Schemas.Operation[]
): ProcessOperationsResult => {
  const result: ProcessOperationsResult = {
    transactionInputs: CardanoWasm.TransactionInputs.new(),
    transactionOutputs: CardanoWasm.TransactionOutputs.new(),
    certificates: CardanoWasm.Certificates.new(),
    withdrawals: CardanoWasm.Withdrawals.new(),
    addresses: [],
    inputAmounts: [],
    outputAmounts: [],
    withdrawalAmounts: [],
    stakeKeyRegistrationsCount: 0,
    stakeKeyDeRegistrationsCount: 0
  };

  return operations.reduce<ProcessOperationsResult>((previousResult, operation) => {
    const type = operation.type;
    const processor = operationProcessor(logger, operation, network, previousResult);
    if (!processor[type]) {
      logger.error(`[processOperations] Operation with id ${operation.operation_identifier} has invalid type`);
      throw ErrorFactory.invalidOperationTypeError();
    }
    return processor[type]();
  }, result);
};
