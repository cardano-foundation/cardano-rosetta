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
} from '@emurgo/cardano-serialization-lib-nodejs';
import { Logger } from 'fastify';
import { NetworkIdentifier, OperationType, RelayType } from '../constants';
import { ErrorFactory } from '../errors';
import { hexStringToBuffer } from '../formatters';
import { isPolicyIdValid, isTokenNameValid } from '../validations';
import { generateRewardAddress, generateAddress } from './addresses';
import { getStakingCredentialFromHex } from './staking-credentials';

const isPositiveNumber = (value: string): boolean => /^\+?\d+/.test(value);

const validateAndParseTokenBundle = (
  logger: Logger,
  tokenBundle: Components.Schemas.TokenBundleItem[]
): CardanoWasm.MultiAsset =>
  tokenBundle.reduce((multiAssets, { policyId, tokens }) => {
    if (!isPolicyIdValid(policyId)) {
      logger.error(`[validateAndParseTokenBundle] PolicyId ${policyId} is not valid`);
      throw ErrorFactory.transactionOutputsParametersMissingError(`PolicyId ${policyId} is not valid`);
    }
    const policy = ScriptHash.from_bytes(hexStringToBuffer(policyId));
    const assetsToAdd = tokens.reduce((assets, { currency: { symbol: tokenName }, value: assetValue }) => {
      if (!isTokenNameValid(tokenName)) {
        logger.error(`[validateAndParseTokenBundle] Token name ${tokenName} is not valid`);
        throw ErrorFactory.transactionOutputsParametersMissingError(`Token name ${tokenName} is not valid`);
      }
      const assetName = AssetName.new(hexStringToBuffer(tokenName));
      if (assets.get(assetName) !== undefined) {
        logger.error(
          `[validateAndParseTokenBundle] Token name ${tokenName} has already been added for policy ${policyId}`
        );
        throw ErrorFactory.transactionOutputsParametersMissingError(
          `Token name ${tokenName} has already been added for policy ${policyId} and will be overriden`
        );
      }
      if (assetValue === undefined || !assetValue[0]) {
        logger.error(
          `[validateAndParseTokenBundle] Token with name ${tokenName} for policy ${policyId} has no value or is empty`
        );
        throw ErrorFactory.transactionOutputsParametersMissingError(
          `Token with name ${tokenName} for policy ${policyId} has no value or is empty`
        );
      }
      if (!isPositiveNumber(assetValue)) {
        logger.error(`[validateAndParseTokenBundle] Asset ${tokenName} has negative or invalid value '${assetValue}'`);
        throw ErrorFactory.transactionOutputsParametersMissingError(
          `Asset ${tokenName} has negative or invalid value '${assetValue}'`
        );
      }
      assets.insert(assetName, BigNum.from_str(assetValue));
      return assets;
    }, Assets.new());
    multiAssets.insert(policy, assetsToAdd);
    return multiAssets;
  }, MultiAsset.new());

const validateAndParseTransactionOutput = (
  logger: Logger,
  output: Components.Schemas.Operation
): CardanoWasm.TransactionOutput => {
  let address;
  try {
    address = output.account && generateAddress(output.account.address);
  } catch (error) {
    throw ErrorFactory.transactionOutputDeserializationError(
      `Invalid input: ${output.account?.address} - ${error.toString()}`
    );
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
  if (!isPositiveNumber(outputValue)) {
    logger.error(`[validateAndParseTransactionOutput] Output has negative or invalid value '${outputValue}'`);
    throw ErrorFactory.transactionOutputsParametersMissingError('Output has negative amount value');
  }
  const value = Value.new(BigNum.from_str(outputValue));
  if (output.metadata?.tokenBundle)
    value.set_multiasset(validateAndParseTokenBundle(logger, output.metadata.tokenBundle));
  try {
    return CardanoWasm.TransactionOutput.new(address, value);
  } catch (error) {
    throw ErrorFactory.transactionOutputDeserializationError(
      `Invalid input: ${output.account?.address} - ${error.toString()}`
    );
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
  if (isPositiveNumber(value)) {
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

const validateAndParsePoolKeyHash = (logger: Logger, poolKeyHash?: string): CardanoWasm.Ed25519KeyHash => {
  if (!poolKeyHash) {
    logger.error('[validateAndParsePoolKeyHash] no pool key hash provided');
    throw ErrorFactory.missingPoolKeyError();
  }
  let parsedPoolKeyHash: CardanoWasm.Ed25519KeyHash;
  try {
    parsedPoolKeyHash = CardanoWasm.Ed25519KeyHash.from_bytes(Buffer.from(poolKeyHash, 'hex'));
  } catch (error) {
    logger.error('[validateAndParsePoolKeyHash] invalid pool key hash');
    throw ErrorFactory.invalidPoolKeyError(error);
  }
  return parsedPoolKeyHash;
};

const validateAndParsePoolRegistrationCert = (
  logger: Logger,
  poolRegistrationCert?: string,
  poolKeyHash?: string
): { certificate: CardanoWasm.Certificate; poolKeyHash: string } => {
  if (!poolKeyHash) {
    logger.error('[validateAndParsePoolRegistrationCert] no pool key hash provided for pool registration');
    throw ErrorFactory.missingPoolKeyError();
  }
  if (!poolRegistrationCert) {
    logger.error(
      '[validateAndParsePoolRegistrationCert] no pool registration certificate provided for pool registration'
    );
    throw ErrorFactory.missingPoolCertError();
  }
  let parsedCertificate: CardanoWasm.Certificate;
  try {
    parsedCertificate = CardanoWasm.Certificate.from_bytes(Buffer.from(poolRegistrationCert, 'hex'));
  } catch (error) {
    logger.error('[validateAndParsePoolRegistrationCert] invalid pool registration certificate');
    throw ErrorFactory.invalidPoolRegistrationCert(error);
  }
  const poolRegistration = parsedCertificate.as_pool_registration();
  if (!poolRegistration) {
    logger.error('[validateAndParsePoolRegistrationCert] invalid certificate type');
    throw ErrorFactory.invalidPoolRegistrationCertType();
  }
  return { certificate: parsedCertificate, poolKeyHash };
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
    const poolKeyHash = validateAndParsePoolKeyHash(logger, operation.metadata?.pool_key_hash);
    const certificate = CardanoWasm.Certificate.new_stake_delegation(StakeDelegation.new(credential, poolKeyHash));
    return { certificate, address };
  }
  return {
    certificate: CardanoWasm.Certificate.new_stake_deregistration(StakeDeregistration.new(credential)),
    address
  };
};

const validatePort = (logger: Logger, port: string): void => {
  const parsedPort = Number.parseInt(port, 10);
  if (!isPositiveNumber(port) || Number.isNaN(parsedPort)) {
    logger.error(`[validateAndParsePort] Invalid port ${port} received`);
    throw ErrorFactory.invalidPoolRelaysError(`Invalid port ${port} received`);
  }
};

const generateSpecificRelay = (logger: Logger, relay: Components.Schemas.Relay): CardanoWasm.Relay => {
  try {
    switch (relay.type) {
      case RelayType.SINGLE_HOST_ADDR: {
        return CardanoWasm.Relay.new_single_host_addr(
          CardanoWasm.SingleHostAddr.new(
            relay.port ? Number.parseInt(relay.port, 10) : undefined,
            relay.ipv4 ? CardanoWasm.Ipv4.from_bytes(Buffer.from(relay.ipv4, 'hex')) : undefined,
            relay.ipv6 ? CardanoWasm.Ipv6.from_bytes(Buffer.from(relay.ipv6, 'hex')) : undefined
          )
        );
      }
      case RelayType.SINGLE_HOST_NAME: {
        if (!relay.dnsName) {
          throw ErrorFactory.missingDnsNameError();
        }
        return CardanoWasm.Relay.new_single_host_name(
          CardanoWasm.SingleHostName.new(
            relay.port ? Number.parseInt(relay.port, 10) : undefined,
            CardanoWasm.DNSRecordAorAAAA.new(relay.dnsName)
          )
        );
      }
      case RelayType.MULTI_HOST_NAME: {
        if (!relay.dnsName) {
          throw ErrorFactory.missingDnsNameError();
        }
        return CardanoWasm.Relay.new_multi_host_name(
          CardanoWasm.MultiHostName.new(CardanoWasm.DNSRecordSRV.new(relay.dnsName))
        );
      }
      default: {
        throw ErrorFactory.invalidPoolRelayTypeError();
      }
    }
  } catch (error) {
    logger.error('[validateAndParsePoolRelays] invalid pool relay');
    throw ErrorFactory.invalidPoolRelaysError(error);
  }
};

const validateAndParsePoolRelays = (logger: Logger, relays: Components.Schemas.Relay[]): CardanoWasm.Relays => {
  if (relays.length === 0) throw ErrorFactory.invalidPoolRelaysError('Empty relays received');
  const generatedRelays = CardanoWasm.Relays.new();
  for (const relay of relays) {
    relay.port && validatePort(logger, relay.port);
    const generatedRelay = generateSpecificRelay(logger, relay);
    generatedRelays.add(generatedRelay);
  }

  return generatedRelays;
};

const validateAndParsePoolOwners = (logger: Logger, owners: Array<string>): CardanoWasm.Ed25519KeyHashes => {
  try {
    const parsedOwners = CardanoWasm.Ed25519KeyHashes.new();
    owners.forEach(owner => {
      const ownerKey = CardanoWasm.Ed25519KeyHash.from_bytes(Buffer.from(owner, 'hex'));
      parsedOwners.add(ownerKey);
    });
    return parsedOwners;
  } catch (error) {
    logger.error('[validateAndParsePoolOwners] there was an error parsing pool owners');
    throw ErrorFactory.invalidPoolOwnersError(error);
  }
};

const validateAndParsePoolMetadata = (
  logger: Logger,
  metadata?: Components.Schemas.PoolMetadata
): CardanoWasm.PoolMetadata | undefined => {
  let parsedMetadata: CardanoWasm.PoolMetadata | undefined;
  try {
    if (metadata)
      parsedMetadata = CardanoWasm.PoolMetadata.new(
        CardanoWasm.URL.new(metadata.url),
        CardanoWasm.MetadataHash.from_bytes(Buffer.from(metadata.hash, 'hex'))
      );
  } catch (error) {
    logger.error('[validateAndParsePoolMetadata] invalid pool metadata');
    throw ErrorFactory.invalidPoolMetadataError(error);
  }
  return parsedMetadata;
};

const processPoolRegistration = (
  logger: Logger,
  network: NetworkIdentifier,
  operation: Components.Schemas.Operation
): { certificate: CardanoWasm.Certificate; poolKeyHash: string } => {
  logger.info('[processPoolRegistration] About to process pool registration operation');

  if (!operation?.metadata?.poolRegistrationParams) {
    logger.error('[processPoolRegistration] Pool_registration was not provided');
    throw ErrorFactory.missingPoolRegistrationParameters();
  }

  const { pledge, cost } = operation?.metadata?.poolRegistrationParams;
  if (!isPositiveNumber(pledge)) {
    logger.error(`[processPoolRegistration] Given pool pledge ${pledge} is invalid`);
    throw ErrorFactory.invalidPoolRegistrationParameters(`Given pool pledge ${pledge} is invalid`);
  }
  if (!isPositiveNumber(cost)) {
    logger.error(`[processPoolRegistration] Given pool cost ${cost} is invalid`);
    throw ErrorFactory.invalidPoolRegistrationParameters(`Given pool cost ${cost} is invalid`);
  }
  // eslint-disable-next-line camelcase
  const poolKeyHash = validateAndParsePoolKeyHash(logger, operation.metadata?.pool_key_hash);
  // eslint-disable-next-line camelcase
  const credential = getStakingCredentialFromHex(logger, operation.metadata?.staking_credential);
  const rewardAddress = CardanoWasm.RewardAddress.new(network, credential);

  logger.info('[processPoolRegistration] About to generate pool owners');
  const owners = validateAndParsePoolOwners(logger, operation.metadata?.poolRegistrationParams.poolOwners);

  logger.info('[processPoolRegistration] About to generate pool relays');
  const relays = validateAndParsePoolRelays(logger, operation.metadata.poolRegistrationParams.relays);

  logger.info('[processPoolRegistration] About to generate pool metadata');
  const poolMetadata = validateAndParsePoolMetadata(logger, operation.metadata?.poolRegistrationParams.poolMetadata);

  logger.info('[processPoolRegistration] About to generate Pool Registration');
  const wasmPoolRegistration = CardanoWasm.PoolRegistration.new(
    CardanoWasm.PoolParams.new(
      poolKeyHash,
      CardanoWasm.VRFKeyHash.from_bytes(Buffer.from(operation.metadata?.poolRegistrationParams.vrfKeyHash, 'hex')),
      CardanoWasm.BigNum.from_str(operation.metadata.poolRegistrationParams.pledge),
      CardanoWasm.BigNum.from_str(operation.metadata.poolRegistrationParams.cost),
      CardanoWasm.UnitInterval.new(
        // TODO: dummy data since db-sync doesn't support this yet. Margin should be bring from request
        CardanoWasm.BigNum.from_str('1'),
        CardanoWasm.BigNum.from_str('1')
      ),
      rewardAddress,
      owners,
      relays,
      poolMetadata
    )
  );
  logger.info('[processPoolRegistration] Generating Pool Registration certificate');
  const certificate = CardanoWasm.Certificate.new_pool_registration(wasmPoolRegistration);
  logger.info('[processPoolRegistration] Successfully created Pool Registration certificate');

  return { certificate, poolKeyHash: Buffer.from(poolKeyHash.to_bytes()).toString('hex') };
};

const processPoolRegistrationWithCert = (
  logger: Logger,
  operation: Components.Schemas.Operation
): { certificate: CardanoWasm.Certificate; poolKeyHash: string } => {
  const { certificate, poolKeyHash } = validateAndParsePoolRegistrationCert(
    logger,
    operation?.metadata?.poolRegistrationCert,
    // eslint-disable-next-line camelcase
    operation?.metadata?.pool_key_hash
  );
  return { certificate, poolKeyHash };
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    resultAccumulator.addresses.push(operation.account!.address);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    resultAccumulator.inputAmounts.push(operation.amount!.value);
    return resultAccumulator;
  },
  [OperationType.OUTPUT]: () => {
    resultAccumulator.transactionOutputs.add(validateAndParseTransactionOutput(logger, operation));
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
  },
  [OperationType.POOL_REGISTRATION]: () => {
    const { certificate, poolKeyHash } = processPoolRegistration(logger, network, operation);
    resultAccumulator.certificates.add(certificate);
    resultAccumulator.addresses.push(poolKeyHash);
    resultAccumulator.poolRegistrationsCount++;
    return resultAccumulator;
  },
  [OperationType.POOL_REGISTRATION_WITH_CERT]: () => {
    const { certificate, poolKeyHash } = processPoolRegistrationWithCert(logger, operation);
    resultAccumulator.certificates.add(certificate);
    resultAccumulator.addresses.push(poolKeyHash);
    resultAccumulator.poolRegistrationsCount++;
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
  poolRegistrationsCount: number;
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
    stakeKeyDeRegistrationsCount: 0,
    poolRegistrationsCount: 0
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
