/* eslint-disable wrap-regex */
import CardanoWasm, {
  AssetName,
  Assets,
  BigNum,
  GeneralTransactionMetadata,
  MetadataJsonSchema,
  MetadataList,
  MultiAsset,
  PoolRetirement,
  PublicKey,
  ScriptHash,
  StakeDelegation,
  StakeDeregistration,
  StakeRegistration,
  AuxiliaryData,
  TransactionMetadatum,
  Value
} from '@emurgo/cardano-serialization-lib-nodejs';
import { Logger } from 'fastify';
import {
  CatalystDataIndexes,
  CatalystLabels,
  CatalystSigIndexes,
  NetworkIdentifier,
  OperationType,
  RelayType
} from '../constants';
import { ErrorFactory, getErrorMessage } from '../errors';
import { add0xPrefix, bytesToHex, hexStringToBuffer } from '../formatters';
import { isEd25519Signature, isKeyValid, isPolicyIdValid, isTokenNameValid } from '../validations';
import { generateRewardAddress, generateAddress, parseToRewardAddress } from './addresses';
import { getPublicKey, getStakingCredentialFromHex } from './staking-credentials';
import { parsePoolOwners, parsePoolRewardAccount } from './transactions-processor';
import { ManagedFreeableScope } from '../freeable';
import ApiError from '../../api-error';

const isPositiveNumber = (value: string): boolean => /^\+?\d+/.test(value);

const validateAndParseTokenBundle = (
  scope: ManagedFreeableScope,
  logger: Logger,
  tokenBundle: Components.Schemas.TokenBundleItem[]
): CardanoWasm.MultiAsset =>
  tokenBundle.reduce((multiAssets, { policyId, tokens }) => {
    if (!isPolicyIdValid(policyId)) {
      logger.error(`[validateAndParseTokenBundle] PolicyId ${policyId} is not valid`);
      throw ErrorFactory.transactionOutputsParametersMissingError(`PolicyId ${policyId} is not valid`);
    }
    const policy = scope.manage(ScriptHash.from_bytes(hexStringToBuffer(policyId)));
    const assetsToAdd = tokens.reduce((assets, { currency: { symbol: tokenName }, value: assetValue }) => {
      if (!isTokenNameValid(tokenName)) {
        logger.error(`[validateAndParseTokenBundle] Token name ${tokenName} is not valid`);
        throw ErrorFactory.transactionOutputsParametersMissingError(`Token name ${tokenName} is not valid`);
      }
      const assetName = scope.manage(AssetName.new(hexStringToBuffer(tokenName)));
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
      scope.manage(assets.insert(assetName, scope.manage(BigNum.from_str(assetValue))));
      return assets;
    }, scope.manage(Assets.new()));
    scope.manage(multiAssets.insert(policy, assetsToAdd));
    return multiAssets;
  }, scope.manage(MultiAsset.new()));

const validateAndParseTransactionOutput = (
  scope: ManagedFreeableScope,
  logger: Logger,
  output: Components.Schemas.Operation
): CardanoWasm.TransactionOutput => {
  let address;
  try {
    address = output.account && generateAddress(scope, output.account.address);
  } catch (error) {
    throw ErrorFactory.transactionOutputDeserializationError(
      `Invalid input: ${output.account?.address} - ${getErrorMessage(error)}`
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
  const value = scope.manage(Value.new(scope.manage(BigNum.from_str(outputValue))));
  if (output.metadata?.tokenBundle)
    value.set_multiasset(validateAndParseTokenBundle(scope, logger, output.metadata.tokenBundle));
  try {
    return scope.manage(CardanoWasm.TransactionOutput.new(address, value));
  } catch (error) {
    throw ErrorFactory.transactionOutputDeserializationError(
      `Invalid input: ${output.account?.address} - ${getErrorMessage(error)}`
    );
  }
};

const validateAndParseTransactionInput = (
  scope: ManagedFreeableScope,
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
    return scope.manage(
      CardanoWasm.TransactionInput.new(
        scope.manage(CardanoWasm.TransactionHash.from_bytes(Buffer.from(transactionId, 'hex'))),
        Number(index)
      )
    );
  } catch (error) {
    throw ErrorFactory.transactionInputDeserializationError(
      'There was an error deserializating transaction input: '.concat(getErrorMessage(error))
    );
  }
};

const processStakeKeyRegistration = (
  scope: ManagedFreeableScope,
  logger: Logger,
  operation: Components.Schemas.Operation
): CardanoWasm.Certificate => {
  logger.info('[processStakeKeyRegistration] About to process stake key registration');
  // eslint-disable-next-line camelcase
  const credential = getStakingCredentialFromHex(scope, logger, operation.metadata?.staking_credential);
  return scope.manage(CardanoWasm.Certificate.new_stake_registration(scope.manage(StakeRegistration.new(credential))));
};

const validateAndParsePoolKeyHash = (
  scope: ManagedFreeableScope,
  logger: Logger,
  poolKeyHash?: string
): CardanoWasm.Ed25519KeyHash => {
  if (!poolKeyHash) {
    logger.error('[validateAndParsePoolKeyHash] no pool key hash provided');
    throw ErrorFactory.missingPoolKeyError();
  }
  let parsedPoolKeyHash: CardanoWasm.Ed25519KeyHash;
  try {
    parsedPoolKeyHash = scope.manage(CardanoWasm.Ed25519KeyHash.from_bytes(Buffer.from(poolKeyHash, 'hex')));
  } catch (error) {
    logger.error('[validateAndParsePoolKeyHash] invalid pool key hash');
    throw ErrorFactory.invalidPoolKeyError(getErrorMessage(error));
  }
  return parsedPoolKeyHash;
};

const validateAndParseRewardAddress = (
  scope: ManagedFreeableScope,
  logger: Logger,
  rwrdAddress: string
): CardanoWasm.RewardAddress => {
  let rewardAddress: CardanoWasm.RewardAddress | undefined;
  try {
    rewardAddress = parseToRewardAddress(scope, rwrdAddress);
  } catch (error) {
    logger.error(`[validateAndParseRewardAddress] invalid reward address ${rwrdAddress}`);
    throw ErrorFactory.invalidAddressError();
  }
  if (!rewardAddress) throw ErrorFactory.invalidAddressError();
  return rewardAddress;
};

const validateAndParseVotingKey = (
  scope: ManagedFreeableScope,
  logger: Logger,
  votingKey: Components.Schemas.PublicKey
): PublicKey => {
  if (!votingKey.hex_bytes) {
    logger.error('[validateAndParsePublicKey] Voting key not provided');
    throw ErrorFactory.missingVotingKeyError();
  }
  if (!isKeyValid(votingKey.hex_bytes, votingKey.curve_type)) {
    logger.info('[validateAndParsePublicKey] Voting key has an invalid format');
    throw ErrorFactory.invalidVotingKeyFormat();
  }
  const publicKeyBuffer = hexStringToBuffer(votingKey.hex_bytes);
  return scope.manage(PublicKey.from_bytes(publicKeyBuffer));
};

const validateAndParsePoolOwners = (
  scope: ManagedFreeableScope,
  logger: Logger,
  owners: Array<string>
): CardanoWasm.Ed25519KeyHashes => {
  const parsedOwners = scope.manage(CardanoWasm.Ed25519KeyHashes.new());
  try {
    owners.forEach(owner => {
      const rewardAddress = parseToRewardAddress(scope, owner);
      if (rewardAddress) {
        const ownerKey = scope.manage(scope.manage(rewardAddress.payment_cred()).to_keyhash());
        ownerKey && parsedOwners.add(ownerKey);
      }
    });
  } catch (error) {
    logger.error('[validateAndParsePoolOwners] there was an error parsing pool owners');
    throw ErrorFactory.invalidPoolOwnersError(getErrorMessage(error));
  }
  if (parsedOwners.len() !== owners.length)
    throw ErrorFactory.invalidPoolOwnersError('Invalid pool owners addresses provided');
  return parsedOwners;
};

export const validateAndParsePoolRegistrationCert = (
  scope: ManagedFreeableScope,
  logger: Logger,
  network: NetworkIdentifier,
  poolRegistrationCert?: string,
  poolKeyHash?: string
): { certificate: CardanoWasm.Certificate; addresses: string[] } => {
  if (!poolKeyHash) {
    logger.error('[validateAndParsePoolRegistrationCert] no cold key provided for pool registration');
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
    parsedCertificate = scope.manage(CardanoWasm.Certificate.from_bytes(Buffer.from(poolRegistrationCert, 'hex')));
  } catch (error) {
    logger.error('[validateAndParsePoolRegistrationCert] invalid pool registration certificate');
    throw ErrorFactory.invalidPoolRegistrationCert(getErrorMessage(error));
  }
  const poolRegistration = scope.manage(parsedCertificate.as_pool_registration());
  if (!poolRegistration) {
    logger.error('[validateAndParsePoolRegistrationCert] invalid certificate type');
    throw ErrorFactory.invalidPoolRegistrationCertType();
  }
  const poolParameters = scope.manage(poolRegistration.pool_params());
  const ownersAddresses = parsePoolOwners(logger, network, poolParameters);
  const rewardAddress = parsePoolRewardAccount(logger, network, poolParameters);
  return { certificate: parsedCertificate, addresses: [...ownersAddresses, poolKeyHash, rewardAddress] };
};

const processOperationCertification = (
  scope: ManagedFreeableScope,
  logger: Logger,
  network: NetworkIdentifier,
  operation: Components.Schemas.Operation
): { certificate: CardanoWasm.Certificate; address: string } => {
  logger.info(`[processOperationCertification] About to process operation of type ${operation.type}`);
  // eslint-disable-next-line camelcase
  const credential = getStakingCredentialFromHex(scope, logger, operation.metadata?.staking_credential);
  const address = generateRewardAddress(logger, network, credential);
  if (operation.type === OperationType.STAKE_DELEGATION) {
    // eslint-disable-next-line camelcase
    const poolKeyHash = validateAndParsePoolKeyHash(scope, logger, operation.metadata?.pool_key_hash);
    const certificate = scope.manage(
      CardanoWasm.Certificate.new_stake_delegation(scope.manage(StakeDelegation.new(credential, poolKeyHash)))
    );
    return { certificate, address };
  }
  return {
    certificate: scope.manage(
      CardanoWasm.Certificate.new_stake_deregistration(scope.manage(StakeDeregistration.new(credential)))
    ),
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

const parseIpv4 = (scope: ManagedFreeableScope, ip?: string): CardanoWasm.Ipv4 | undefined => {
  if (ip) {
    const parsedIp = Buffer.from(ip.split('.'));
    return scope.manage(CardanoWasm.Ipv4.new(parsedIp));
  }
  return ip as undefined;
};

const parseIpv6 = (scope: ManagedFreeableScope, ip?: string): CardanoWasm.Ipv6 | undefined => {
  if (ip) {
    const parsedIp = Buffer.from(ip.replace(/:/g, ''), 'hex');
    return scope.manage(CardanoWasm.Ipv6.new(parsedIp));
  }
  return ip as undefined;
};

const generateSpecificRelay = (
  scope: ManagedFreeableScope,
  logger: Logger,
  relay: Components.Schemas.Relay
): CardanoWasm.Relay => {
  try {
    switch (relay.type) {
      case RelayType.SINGLE_HOST_ADDR: {
        return scope.manage(
          CardanoWasm.Relay.new_single_host_addr(
            scope.manage(
              CardanoWasm.SingleHostAddr.new(
                relay.port ? Number.parseInt(relay.port, 10) : undefined,
                parseIpv4(scope, relay.ipv4),
                parseIpv6(scope, relay.ipv6)
              )
            )
          )
        );
      }
      case RelayType.SINGLE_HOST_NAME: {
        if (!relay.dnsName) {
          throw ErrorFactory.missingDnsNameError();
        }
        return scope.manage(
          CardanoWasm.Relay.new_single_host_name(
            scope.manage(
              CardanoWasm.SingleHostName.new(
                relay.port ? Number.parseInt(relay.port, 10) : undefined,
                scope.manage(CardanoWasm.DNSRecordAorAAAA.new(relay.dnsName))
              )
            )
          )
        );
      }
      case RelayType.MULTI_HOST_NAME: {
        if (!relay.dnsName) {
          throw ErrorFactory.missingDnsNameError();
        }
        return scope.manage(
          CardanoWasm.Relay.new_multi_host_name(
            scope.manage(CardanoWasm.MultiHostName.new(scope.manage(CardanoWasm.DNSRecordSRV.new(relay.dnsName))))
          )
        );
      }
      default: {
        throw ErrorFactory.invalidPoolRelayTypeError();
      }
    }
  } catch (error) {
    logger.error('[validateAndParsePoolRelays] invalid pool relay');
    throw ErrorFactory.invalidPoolRelaysError(getErrorMessage(error));
  }
};

const validateAndParsePoolRelays = (
  scope: ManagedFreeableScope,
  logger: Logger,
  relays: Components.Schemas.Relay[]
): CardanoWasm.Relays => {
  if (relays.length === 0) throw ErrorFactory.invalidPoolRelaysError('Empty relays received');
  const generatedRelays = scope.manage(CardanoWasm.Relays.new());
  for (const relay of relays) {
    relay.port && validatePort(logger, relay.port);
    const generatedRelay = generateSpecificRelay(scope, logger, relay);
    generatedRelays.add(generatedRelay);
  }

  return generatedRelays;
};

const validateAndParsePoolRegistationParameters = (
  scope: ManagedFreeableScope,
  logger: Logger,
  poolRegistrationParameters: Components.Schemas.PoolRegistrationParams
) => {
  const denominator = poolRegistrationParameters?.margin?.denominator;
  const numerator = poolRegistrationParameters?.margin?.numerator;

  if (!denominator || !numerator) {
    logger.error(
      '[validateAndParsePoolRegistationParameters] Missing margin parameter at pool registration parameters'
    );
    throw ErrorFactory.invalidPoolRegistrationParameters('Missing margin parameter at pool registration parameters');
  }
  const poolParameters: { [key: string]: string } = {
    cost: poolRegistrationParameters.cost,
    pledge: poolRegistrationParameters.pledge,
    numerator,
    denominator
  };
  // eslint-disable-next-line unicorn/prevent-abbreviations
  const parsedPoolParams: { [key: string]: BigNum } = {};
  try {
    Object.keys(poolParameters).forEach(k => {
      const value = poolParameters[k];
      if (!isPositiveNumber(value)) {
        logger.error(`[validateAndParsePoolRegistationParameters] Given ${k} ${value} is invalid`);
        throw ErrorFactory.invalidPoolRegistrationParameters(`Given ${k} ${value} is invalid`);
      }
      parsedPoolParams[k] = scope.manage(CardanoWasm.BigNum.from_str(poolParameters[k]));
    });
    return parsedPoolParams;
  } catch (error) {
    const error_ = error as ApiError;
    logger.error('[validateAndParsePoolRegistationParameters] Given pool parameters are invalid');
    throw ErrorFactory.invalidPoolRegistrationParameters(error_.details?.message ?? getErrorMessage(error));
  }
};

const validateAndParsePoolMetadata = (
  scope: ManagedFreeableScope,
  logger: Logger,
  metadata?: Components.Schemas.PoolMetadata
): CardanoWasm.PoolMetadata | undefined => {
  let parsedMetadata: CardanoWasm.PoolMetadata | undefined;
  try {
    if (metadata)
      parsedMetadata = scope.manage(
        CardanoWasm.PoolMetadata.new(
          scope.manage(CardanoWasm.URL.new(metadata.url)),
          scope.manage(CardanoWasm.PoolMetadataHash.from_bytes(Buffer.from(metadata.hash, 'hex')))
        )
      );
  } catch (error) {
    logger.error('[validateAndParsePoolMetadata] invalid pool metadata');
    throw ErrorFactory.invalidPoolMetadataError(getErrorMessage(error));
  }
  return parsedMetadata;
};

const validateAndParseVoteRegistrationMetadata = (
  scope: ManagedFreeableScope,
  logger: Logger,
  voteRegistrationMetadata: Components.Schemas.VoteRegistrationMetadata
) => {
  const { stakeKey, rewardAddress, votingKey, votingNonce, votingSignature } = voteRegistrationMetadata;

  logger.info('[validateAndParseVoteRegistrationMetadata] About to validate and parse voting key');
  const parsedVotingKey = validateAndParseVotingKey(scope, logger, votingKey);
  logger.info('[validateAndParseVoteRegistrationMetadata] About to validate and parse stake key');
  const parsedStakeKey = getPublicKey(scope, logger, stakeKey);
  logger.info('[validateAndParseVoteRegistrationMetadata] About to validate and parse reward address');
  const parsedAddress = validateAndParseRewardAddress(scope, logger, rewardAddress);

  logger.info('[validateAndParseVoteRegistrationMetadata] About to validate voting nonce');
  if (votingNonce <= 0) {
    logger.error(`[validateAndParseVoteRegistrationMetadata] Given voting nonce ${votingNonce} is invalid`);
    throw ErrorFactory.votingNonceNotValid();
  }

  logger.info('[validateAndParseVoteRegistrationMetadata] About to validate voting signature');
  if (!isEd25519Signature(votingSignature)) {
    logger.error('[validateAndParseVoteRegistrationMetadata] Voting signature has an invalid format');
    throw ErrorFactory.invalidVotingSignature();
  }

  const votingKeyHex = add0xPrefix(bytesToHex(parsedVotingKey.as_bytes()));
  const stakeKeyHex = add0xPrefix(bytesToHex(parsedStakeKey.as_bytes()));
  const rewardAddressHex = add0xPrefix(bytesToHex(scope.manage(parsedAddress.to_address()).to_bytes()));
  const votingSignatureHex = add0xPrefix(votingSignature);

  return {
    votingKey: votingKeyHex,
    stakeKey: stakeKeyHex,
    rewardAddress: rewardAddressHex,
    votingNonce,
    votingSignature: votingSignatureHex
  };
};

const processPoolRegistration = (
  scope: ManagedFreeableScope,
  logger: Logger,
  network: NetworkIdentifier,
  operation: Components.Schemas.Operation
): { certificate: CardanoWasm.Certificate; addresses: string[] } => {
  logger.info('[processPoolRegistration] About to process pool registration operation');

  if (!operation?.metadata?.poolRegistrationParams) {
    logger.error('[processPoolRegistration] Pool_registration was not provided');
    throw ErrorFactory.missingPoolRegistrationParameters();
  }
  const { rewardAddress, poolOwners, relays } = operation.metadata?.poolRegistrationParams;

  const { pledge, cost, numerator, denominator } = validateAndParsePoolRegistationParameters(
    scope,
    logger,
    operation?.metadata?.poolRegistrationParams
  );
  // eslint-disable-next-line camelcase
  const poolKeyHash = validateAndParsePoolKeyHash(scope, logger, operation.account?.address);

  logger.info('[processPoolRegistration] About to validate and parse reward address');
  const parsedAddress = validateAndParseRewardAddress(scope, logger, rewardAddress);

  logger.info('[processPoolRegistration] About to generate pool owners');
  const owners = validateAndParsePoolOwners(scope, logger, poolOwners);

  logger.info('[processPoolRegistration] About to generate pool relays');
  const parsedRelays = validateAndParsePoolRelays(scope, logger, relays);

  logger.info('[processPoolRegistration] About to generate pool metadata');
  const poolMetadata = validateAndParsePoolMetadata(
    scope,
    logger,
    operation.metadata?.poolRegistrationParams.poolMetadata
  );

  logger.info('[processPoolRegistration] About to generate Pool Registration');
  const wasmPoolRegistration = scope.manage(
    CardanoWasm.PoolRegistration.new(
      scope.manage(
        CardanoWasm.PoolParams.new(
          poolKeyHash,
          scope.manage(
            CardanoWasm.VRFKeyHash.from_bytes(Buffer.from(operation.metadata?.poolRegistrationParams.vrfKeyHash, 'hex'))
          ),
          pledge,
          cost,
          scope.manage(CardanoWasm.UnitInterval.new(numerator, denominator)),
          parsedAddress,
          owners,
          parsedRelays,
          poolMetadata
        )
      )
    )
  );
  logger.info('[processPoolRegistration] Generating Pool Registration certificate');
  const certificate = scope.manage(CardanoWasm.Certificate.new_pool_registration(wasmPoolRegistration));
  logger.info('[processPoolRegistration] Successfully created Pool Registration certificate');

  const totalAddresses = [...poolOwners, rewardAddress, operation.account!.address];
  return { certificate, addresses: totalAddresses };
};

const processPoolRegistrationWithCert = (
  scope: ManagedFreeableScope,
  logger: Logger,
  network: NetworkIdentifier,
  operation: Components.Schemas.Operation
): { certificate: CardanoWasm.Certificate; addresses: string[] } => {
  const { certificate, addresses } = validateAndParsePoolRegistrationCert(
    scope,
    logger,
    network,
    operation?.metadata?.poolRegistrationCert,
    operation?.account?.address
  );
  return { certificate, addresses };
};

const processPoolRetirement = (
  scope: ManagedFreeableScope,
  logger: Logger,
  operation: Components.Schemas.Operation
): { certificate: CardanoWasm.Certificate; poolKeyHash: string } => {
  logger.info(`[processPoolRetiring] About to process operation of type ${operation.type}`);
  if (operation.metadata?.epoch && operation.account?.address) {
    const epoch = operation.metadata.epoch;
    const keyHash = validateAndParsePoolKeyHash(scope, logger, operation.account?.address);
    return {
      certificate: scope.manage(
        CardanoWasm.Certificate.new_pool_retirement(scope.manage(PoolRetirement.new(keyHash, epoch)))
      ),
      poolKeyHash: operation.account?.address
    };
  }
  logger.error('[processPoolRetiring] Epoch operation metadata is missing');
  throw ErrorFactory.missingMetadataParametersForPoolRetirement();
};

const processWithdrawal = (
  scope: ManagedFreeableScope,
  logger: Logger,
  network: NetworkIdentifier,
  operation: Components.Schemas.Operation
): { reward: CardanoWasm.RewardAddress; address: string } => {
  logger.info('[processWithdrawal] About to process withdrawal');
  // eslint-disable-next-line camelcase
  const credential = getStakingCredentialFromHex(scope, logger, operation.metadata?.staking_credential);
  const address = generateRewardAddress(logger, network, credential);
  return { reward: scope.manage(CardanoWasm.RewardAddress.new(network, credential)), address };
};

const processVoteRegistration = (
  scope: ManagedFreeableScope,
  logger: Logger,
  operation: Components.Schemas.Operation
): AuxiliaryData => {
  logger.info('[processVoteRegistration] About to process vote registration');
  if (!operation?.metadata?.voteRegistrationMetadata) {
    logger.error('[processVoteRegistration] Vote registration metadata was not provided');
    throw ErrorFactory.missingVoteRegistrationMetadata();
  }

  const { votingKey, stakeKey, rewardAddress, votingNonce, votingSignature } = validateAndParseVoteRegistrationMetadata(
    scope,
    logger,
    operation.metadata.voteRegistrationMetadata
  );
  const registrationMetadata = scope.manage(
    CardanoWasm.encode_json_str_to_metadatum(
      JSON.stringify({
        [CatalystDataIndexes.VOTING_KEY]: votingKey,
        [CatalystDataIndexes.STAKE_KEY]: stakeKey,
        [CatalystDataIndexes.REWARD_ADDRESS]: rewardAddress,
        [CatalystDataIndexes.VOTING_NONCE]: votingNonce
      }),
      MetadataJsonSchema.BasicConversions
    )
  );

  const signatureMetadata = scope.manage(
    CardanoWasm.encode_json_str_to_metadatum(
      JSON.stringify({
        [CatalystSigIndexes.VOTING_SIGNATURE]: votingSignature
      }),
      MetadataJsonSchema.BasicConversions
    )
  );

  const generalMetadata = scope.manage(GeneralTransactionMetadata.new());
  scope.manage(generalMetadata.insert(scope.manage(BigNum.from_str(CatalystLabels.DATA)), registrationMetadata));
  scope.manage(generalMetadata.insert(scope.manage(BigNum.from_str(CatalystLabels.SIG)), signatureMetadata));

  const metadataList = scope.manage(MetadataList.new());
  metadataList.add(scope.manage(TransactionMetadatum.from_bytes(generalMetadata.to_bytes())));
  metadataList.add(scope.manage(TransactionMetadatum.new_list(scope.manage(MetadataList.new()))));

  return scope.manage(AuxiliaryData.from_bytes(metadataList.to_bytes()));
};

const operationProcessor: (
  scope: ManagedFreeableScope,
  logger: Logger,
  operation: Components.Schemas.Operation,
  network: NetworkIdentifier,
  resultAccumulator: ProcessOperationsResult
) => {
  [type: string]: () => ProcessOperationsResult;
} = (scope, logger, operation, network, resultAccumulator) => ({
  [OperationType.INPUT]: () => {
    resultAccumulator.transactionInputs.add(validateAndParseTransactionInput(scope, logger, operation));
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    resultAccumulator.addresses.push(operation.account!.address);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    resultAccumulator.inputAmounts.push(operation.amount!.value);
    return resultAccumulator;
  },
  [OperationType.OUTPUT]: () => {
    resultAccumulator.transactionOutputs.add(validateAndParseTransactionOutput(scope, logger, operation));
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    resultAccumulator.outputAmounts.push(operation.amount!.value);
    return resultAccumulator;
  },
  [OperationType.STAKE_KEY_REGISTRATION]: () => {
    resultAccumulator.certificates.add(processStakeKeyRegistration(scope, logger, operation));
    resultAccumulator.stakeKeyRegistrationsCount++;
    return resultAccumulator;
  },
  [OperationType.STAKE_KEY_DEREGISTRATION]: () => {
    const { certificate, address } = processOperationCertification(scope, logger, network, operation);
    resultAccumulator.certificates.add(certificate);
    resultAccumulator.addresses.push(address);
    resultAccumulator.stakeKeyDeRegistrationsCount++;
    return resultAccumulator;
  },
  [OperationType.STAKE_DELEGATION]: () => {
    const { certificate, address } = processOperationCertification(scope, logger, network, operation);
    resultAccumulator.certificates.add(certificate);
    resultAccumulator.addresses.push(address);
    return resultAccumulator;
  },
  [OperationType.WITHDRAWAL]: () => {
    const { reward, address } = processWithdrawal(scope, logger, network, operation);
    const withdrawalAmount = BigInt(operation.amount?.value || 0);
    resultAccumulator.withdrawalAmounts.push(withdrawalAmount);
    resultAccumulator.withdrawals.insert(reward, scope.manage(BigNum.from_str(withdrawalAmount.toString())));
    resultAccumulator.addresses.push(address);
    return resultAccumulator;
  },
  [OperationType.POOL_REGISTRATION]: () => {
    const { certificate, addresses } = processPoolRegistration(scope, logger, network, operation);
    resultAccumulator.certificates.add(certificate);
    resultAccumulator.addresses.push(...addresses);
    resultAccumulator.poolRegistrationsCount++;
    return resultAccumulator;
  },
  [OperationType.POOL_REGISTRATION_WITH_CERT]: () => {
    const { certificate, addresses } = processPoolRegistrationWithCert(scope, logger, network, operation);
    resultAccumulator.certificates.add(certificate);
    resultAccumulator.addresses.push(...addresses);
    resultAccumulator.poolRegistrationsCount++;
    return resultAccumulator;
  },
  [OperationType.POOL_RETIREMENT]: () => {
    const { certificate, poolKeyHash } = processPoolRetirement(scope, logger, operation);
    resultAccumulator.certificates.add(certificate);
    resultAccumulator.addresses.push(poolKeyHash);
    return resultAccumulator;
  },
  [OperationType.VOTE_REGISTRATION]: () => {
    const voteRegistrationMetadata = processVoteRegistration(scope, logger, operation);
    resultAccumulator.voteRegistrationMetadata = voteRegistrationMetadata;
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
  voteRegistrationMetadata: CardanoWasm.AuxiliaryData | undefined;
}

/**
 * Processes the given operations and generates according Cardano related objects to be used
 * to build a transaction.
 *
 * Extra information is added as it might be required and we are traversing the operations
 * already.
 *
 * @param scope
 * @param logger
 * @param network
 * @param operations
 */
export const convert = (
  scope: ManagedFreeableScope,
  logger: Logger,
  network: NetworkIdentifier,
  operations: Components.Schemas.Operation[]
): ProcessOperationsResult => {
  const result: ProcessOperationsResult = {
    transactionInputs: scope.manage(CardanoWasm.TransactionInputs.new()),
    transactionOutputs: scope.manage(CardanoWasm.TransactionOutputs.new()),
    certificates: scope.manage(CardanoWasm.Certificates.new()),
    withdrawals: scope.manage(CardanoWasm.Withdrawals.new()),
    addresses: [],
    inputAmounts: [],
    outputAmounts: [],
    withdrawalAmounts: [],
    stakeKeyRegistrationsCount: 0,
    stakeKeyDeRegistrationsCount: 0,
    poolRegistrationsCount: 0,
    voteRegistrationMetadata: undefined
  };

  return operations.reduce<ProcessOperationsResult>((previousResult, operation) => {
    const type = operation.type;
    const processor = operationProcessor(scope, logger, operation, network, previousResult);
    if (!processor[type]) {
      logger.error(`[processOperations] Operation with id ${operation.operation_identifier} has invalid type`);
      throw ErrorFactory.invalidOperationTypeError();
    }
    return processor[type]();
  }, result);
};
