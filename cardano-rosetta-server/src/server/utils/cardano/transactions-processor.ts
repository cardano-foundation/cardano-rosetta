import CardanoWasm, { AuxiliaryData, BigNum } from '@emurgo/cardano-serialization-lib-nodejs';
import cbor from 'cbor';
import { Logger } from 'fastify';
import {
  ADA,
  ADA_DECIMALS,
  CatalystDataIndexes,
  CatalystLabels,
  CatalystSigIndexes,
  CurveType,
  OperationType,
  RelayType,
  StakingOperations
} from '../constants';
import { mapAmount, TransactionExtraData } from '../data-mapper';
import { ErrorFactory } from '../errors';
import { hexFormatter, remove0xPrefix } from '../formatters';
import { generateRewardAddress, getAddressFromHexString, getAddressPrefix, parseAddress } from './addresses';
import { getStakingCredentialFromHex } from './staking-credentials';
import { usingAutoFree } from '../freeable';

const compareStrings = (a: string, b: string): number => {
  if (a === b) return 0;
  if (a > b) return 1;
  return -1;
};

const QUARTER = 4;

/* eslint-disable camelcase */
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
  type: OperationType.INPUT
});

const parsePoolMetadata = (poolParameters: CardanoWasm.PoolParams): Components.Schemas.PoolMetadata | undefined =>
  // eslint-disable-next-line consistent-return
  usingAutoFree(scope => {
    const metadata = scope.manage(poolParameters.pool_metadata());
    if (metadata) {
      const hash = Buffer.from(scope.manage(metadata.pool_metadata_hash()).to_bytes()).toString('hex');
      const url = scope.manage(metadata.url()).url();
      return { url, hash };
    }
  });

export const parsePoolOwners = (
  logger: Logger,
  network: number,
  poolParameters: CardanoWasm.PoolParams
): Array<string> =>
  usingAutoFree(scope => {
    const poolOwners: Array<string> = [];
    const owners = scope.manage(poolParameters.pool_owners());
    const ownersCount = owners.len();
    for (let index = 0; index < ownersCount; index++) {
      const owner = scope.manage(owners.get(index));
      const address = generateRewardAddress(
        logger,
        network,
        scope.manage(CardanoWasm.StakeCredential.from_keyhash(owner))
      );
      poolOwners.push(address);
    }
    return poolOwners;
  });

export const parsePoolRewardAccount = (
  logger: Logger,
  network: number,
  poolParameters: CardanoWasm.PoolParams
): string =>
  usingAutoFree(scope =>
    generateRewardAddress(logger, network, scope.manage(scope.manage(poolParameters.reward_account()).payment_cred()))
  );

const parseIpv4 = (wasmIp?: CardanoWasm.Ipv4): string | undefined => {
  if (wasmIp) {
    const ip = wasmIp.ip().toString();
    return ip.replaceAll(',', '.');
  }
  return wasmIp;
};

const parseIpv6 = (wasmIp?: CardanoWasm.Ipv6): string | undefined => {
  if (wasmIp) {
    const parsedIp = Buffer.from(wasmIp.ip()).toString('hex');
    const finalParse = [];
    for (let index = 0; index < parsedIp.length; index += QUARTER) {
      const end = index + QUARTER;
      finalParse.push(parsedIp.slice(index, end));
    }
    return finalParse.join(':');
  }
  return wasmIp;
};

const parsePoolRelays = (poolParameters: CardanoWasm.PoolParams): Array<Components.Schemas.Relay> =>
  usingAutoFree(scope => {
    const poolRelays: Array<Components.Schemas.Relay> = [];
    const relays = scope.manage(poolParameters.relays());
    const relaysCount = relays.len();
    for (let index = 0; index < relaysCount; index++) {
      const relay = scope.manage(relays.get(index));
      const multiHostRelay = scope.manage(relay.as_multi_host_name());
      if (multiHostRelay) {
        poolRelays.push({ type: RelayType.MULTI_HOST_NAME, dnsName: scope.manage(multiHostRelay.dns_name()).record() });
        continue;
      }
      const singleHostName = scope.manage(relay.as_single_host_name());
      if (singleHostName) {
        poolRelays.push({
          type: RelayType.SINGLE_HOST_NAME,
          dnsName: scope.manage(singleHostName.dns_name()).record(),
          port: singleHostName.port()?.toString()
        });
        continue;
      }
      const singleHostAddr = scope.manage(relay.as_single_host_addr());
      if (singleHostAddr) {
        const ipv4 = parseIpv4(scope.manage(singleHostAddr.ipv4()));
        const ipv6 = parseIpv6(scope.manage(singleHostAddr.ipv6()));
        poolRelays.push({ type: RelayType.SINGLE_HOST_ADDR, port: singleHostAddr.port()?.toString(), ipv4, ipv6 });
      }
    }
    return poolRelays;
  });

const parsePoolMargin = (poolParameters: CardanoWasm.PoolParams): Components.Schemas.PoolMargin =>
  usingAutoFree(scope => ({
    denominator: scope.manage(scope.manage(poolParameters.margin()).denominator()).to_str(),
    numerator: scope.manage(scope.manage(poolParameters.margin()).numerator()).to_str()
  }));

const parsePoolRegistration = (
  logger: Logger,
  network: number,
  poolRegistration: CardanoWasm.PoolRegistration
): Components.Schemas.PoolRegistrationParams =>
  usingAutoFree(scope => {
    const poolParameters = scope.manage(poolRegistration.pool_params());
    return {
      vrfKeyHash: Buffer.from(scope.manage(poolParameters.vrf_keyhash()).to_bytes()).toString('hex'),
      rewardAddress: parsePoolRewardAccount(logger, network, poolParameters),
      pledge: scope.manage(poolParameters.pledge()).to_str(),
      cost: scope.manage(poolParameters.cost()).to_str(),
      poolOwners: parsePoolOwners(logger, network, poolParameters),
      relays: parsePoolRelays(poolParameters),
      margin: parsePoolMargin(poolParameters),
      poolMetadata: parsePoolMetadata(poolParameters)
    };
  });

/**
 * Create policy id or asset name keys array
 * @param  {CardanoWasm.Assets|CardanoWasm.MultiAsset} collection
 * @returns CardanoWasm
 */
const keys = (
  collection: CardanoWasm.Assets | CardanoWasm.MultiAsset
): (CardanoWasm.AssetName | CardanoWasm.ScriptHash)[] => {
  const keysArray = [];
  for (let index = 0; index < collection.len(); index++) {
    keysArray.push(collection.keys().get(index));
  }
  return keysArray;
};

const parseAsset = (
  logger: Logger,
  assets: CardanoWasm.Assets,
  key: CardanoWasm.AssetName
): Components.Schemas.Amount =>
  usingAutoFree(scope => {
    // When getting the key we are obtaining a cbor encoded string instead of the actual name.
    // This might need to be changed in the serialization lib in the future
    const assetSymbol = hexFormatter(cbor.decode(Buffer.from(key.to_bytes())));
    const assetValue = scope.manage(assets.get(key));
    if (!assetValue) {
      logger.error(`[parseTokenBundle] asset value for symbol: '${assetSymbol}' not provided`);
      throw ErrorFactory.tokenAssetValueMissingError();
    }
    return mapAmount(assetValue.to_str(), assetSymbol, 0);
  });

const parseTokenAsset = (
  logger: Logger,
  multiassets: CardanoWasm.MultiAsset,
  multiassetKey: CardanoWasm.ScriptHash
): Components.Schemas.TokenBundleItem =>
  usingAutoFree(scope => {
    const policyId = hexFormatter(Buffer.from(multiassetKey.to_bytes()));
    const assets = scope.manage(multiassets.get(multiassetKey));
    if (!assets) {
      logger.error(`[parseTokenBundle] assets for policyId: '${policyId}' not provided`);
      throw ErrorFactory.tokenBundleAssetsMissingError();
    }

    return {
      policyId,
      tokens: (keys(assets) as CardanoWasm.AssetName[])
        .map(key => parseAsset(logger, assets, key))
        .sort((assetA, assetB) => compareStrings(assetA.currency.symbol, assetB.currency.symbol))
    };
  });

const parseTokenBundle = (
  logger: Logger,
  output: CardanoWasm.TransactionOutput
): Components.Schemas.OperationMetadata | undefined =>
  usingAutoFree(scope => {
    const multiassets = scope.manage(scope.manage(output.amount()).multiasset());
    let tokenBundle: Components.Schemas.TokenBundleItem[] = [];
    if (multiassets) {
      logger.info(`[parseTokenBundle] About to parse ${multiassets.len()} multiassets from token bundle`);
      tokenBundle = (keys(multiassets) as CardanoWasm.ScriptHash[])
        .map(key => parseTokenAsset(logger, multiassets, key))
        .sort((tokenA, tokenB) => compareStrings(tokenA.policyId, tokenB.policyId));
    }
    return multiassets ? { tokenBundle } : undefined;
  });

const parseOutputToOperation = (
  logger: Logger,
  output: CardanoWasm.TransactionOutput,
  index: number,
  relatedOperations: Components.Schemas.OperationIdentifier[],
  address: string
): Components.Schemas.Operation =>
  usingAutoFree(scope => ({
    operation_identifier: { index },
    related_operations: relatedOperations,
    account: { address },
    amount: {
      value: scope.manage(scope.manage(output.amount()).coin()).to_str(),
      currency: { symbol: ADA, decimals: ADA_DECIMALS }
    },
    status: '',
    type: OperationType.OUTPUT,
    metadata: parseTokenBundle(logger, output)
  }));

const parsePoolCertToOperation = (
  logger: Logger,
  network: number,
  cert: CardanoWasm.Certificate,
  index: number,
  type: string
): Components.Schemas.Operation => {
  const operation: Components.Schemas.Operation = {
    operation_identifier: { index },
    status: '',
    type,
    metadata: {}
  };

  if (type === OperationType.POOL_RETIREMENT) {
    const poolRetirementCert = cert.as_pool_retirement();
    if (poolRetirementCert) {
      operation.metadata!.epoch = poolRetirementCert.epoch();
    }
  } else {
    const poolRegistrationCert = cert.as_pool_registration();
    if (poolRegistrationCert) {
      if (type === OperationType.POOL_REGISTRATION) {
        operation.metadata!.poolRegistrationParams = parsePoolRegistration(logger, network, poolRegistrationCert);
      } else {
        const parsedPoolCert = Buffer.from(poolRegistrationCert.to_bytes()).toString('hex');
        operation.metadata!.poolRegistrationCert = parsedPoolCert;
      }
    }
  }
  return operation;
};

const parseCertToOperation = (
  cert: CardanoWasm.Certificate,
  index: number,
  hash: string,
  type: string,
  address: string
): Components.Schemas.Operation =>
  usingAutoFree(scope => {
    const operation: Components.Schemas.Operation = {
      operation_identifier: { index },
      status: '',
      type,
      account: { address },
      metadata: {
        staking_credential: { hex_bytes: hash, curve_type: CurveType.edwards25519 }
      }
    };
    const delegationCert = scope.manage(cert.as_stake_delegation());
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (delegationCert)
      operation.metadata!.pool_key_hash = Buffer.from(scope.manage(delegationCert.pool_keyhash()).to_bytes()).toString(
        'hex'
      );
    return operation;
  });

const parseCertsToOperations = (
  logger: Logger,
  transactionBody: CardanoWasm.TransactionBody,
  certOps: Components.Schemas.Operation[],
  network: number
): Components.Schemas.Operation[] =>
  usingAutoFree(scope => {
    const parsedOperations = [];
    const certs = scope.manage(transactionBody.certs());
    const certsCount = certs?.len() || 0;
    logger.info(`[parseCertsToOperations] About to parse ${certsCount} certs`);

    for (let index = 0; index < certsCount; index++) {
      const certOperation = certOps[index];
      if (StakingOperations.includes(certOperation.type as OperationType)) {
        const hex = certOperation.metadata?.staking_credential?.hex_bytes;
        if (!hex) {
          logger.error('[parseCertsToOperations] Staking key not provided');
          throw ErrorFactory.missingStakingKeyError();
        }
        const credential = getStakingCredentialFromHex(scope, logger, certOperation.metadata?.staking_credential);
        const address = generateRewardAddress(logger, network, credential);
        const cert = scope.manage(certs?.get(index));
        if (cert) {
          const parsedOperation = parseCertToOperation(
            cert,
            certOperation.operation_identifier.index,
            hex,
            certOperation.type,
            address
          );
          parsedOperations.push(parsedOperation);
        }
      } else {
        const cert = scope.manage(certs?.get(index));
        if (cert) {
          const parsedOperation = parsePoolCertToOperation(
            logger,
            network,
            cert,
            certOperation.operation_identifier.index,
            certOperation.type
          );
          parsedOperations.push({ ...parsedOperation, account: certOperation.account });
        }
      }
    }

    return parsedOperations;
  });

const parseWithdrawalToOperation = (
  value: string,
  hex: string,
  index: number,
  address: string
): Components.Schemas.Operation => ({
  operation_identifier: { index },
  status: '',
  account: { address },
  amount: {
    value,
    currency: {
      symbol: ADA,
      decimals: ADA_DECIMALS
    }
  },
  type: OperationType.WITHDRAWAL,
  metadata: {
    staking_credential: { hex_bytes: hex, curve_type: CurveType.edwards25519 }
  }
});

const parseWithdrawalsToOperations = (
  logger: Logger,
  withdrawalOps: Components.Schemas.Operation[],
  withdrawalsCount: number,
  operations: Components.Schemas.Operation[],
  network: number
) =>
  usingAutoFree(scope => {
    logger.info(`[parseWithdrawalsToOperations] About to parse ${withdrawalsCount} withdrawals`);
    for (let index = 0; index < withdrawalsCount; index++) {
      const withdrawalOperation = withdrawalOps[index];
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const credential = getStakingCredentialFromHex(scope, logger, withdrawalOperation.metadata!.staking_credential);
      const address = generateRewardAddress(logger, network, credential);
      const parsedOperation = parseWithdrawalToOperation(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        withdrawalOperation.amount!.value,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        withdrawalOperation.metadata!.staking_credential!.hex_bytes,
        withdrawalOperation.operation_identifier.index,
        address
      );
      operations.push(parsedOperation);
    }
  });

const getRelatedOperationsFromInputs = (
  inputs: Components.Schemas.Operation[]
): Components.Schemas.OperationIdentifier[] => inputs.map(input => ({ index: input.operation_identifier.index }));

const parseVoteMetadataToOperation = (
  logger: Logger,
  index: number,
  transactionMetadataHex?: string
): Components.Schemas.Operation =>
  usingAutoFree(scope => {
    logger.info('[parseVoteMetadataToOperation] About to parse a vote registration operation');
    if (!transactionMetadataHex) {
      logger.error('[parseVoteMetadataToOperation] Missing vote registration metadata');
      throw ErrorFactory.missingVoteRegistrationMetadata();
    }
    const transactionMetadata = scope.manage(AuxiliaryData.from_bytes(Buffer.from(transactionMetadataHex, 'hex')));

    const metadataList = scope.manage(CardanoWasm.MetadataList.from_bytes(transactionMetadata.to_bytes()));
    const generalMetadata = scope.manage(
      CardanoWasm.GeneralTransactionMetadata.from_bytes(scope.manage(metadataList.get(0)).to_bytes())
    );

    const data = scope.manage(generalMetadata.get(scope.manage(BigNum.from_str(CatalystLabels.DATA))));
    if (!data) throw ErrorFactory.missingVoteRegistrationMetadata();

    const sig = scope.manage(generalMetadata.get(scope.manage(BigNum.from_str(CatalystLabels.SIG))));
    if (!sig) throw ErrorFactory.invalidVotingSignature();

    const dataJson = CardanoWasm.decode_metadatum_to_json_str(data, CardanoWasm.MetadataJsonSchema.BasicConversions);
    const sigJson = CardanoWasm.decode_metadatum_to_json_str(sig, CardanoWasm.MetadataJsonSchema.BasicConversions);

    const dataParsed = JSON.parse(dataJson);
    const sigParsed = JSON.parse(sigJson);

    const rewardAddress = getAddressFromHexString(
      scope,
      remove0xPrefix(dataParsed[CatalystDataIndexes.REWARD_ADDRESS])
    );
    if (rewardAddress === undefined) throw ErrorFactory.invalidAddressError();

    const parsedMetadata: Components.Schemas.VoteRegistrationMetadata = {
      votingKey: {
        hex_bytes: remove0xPrefix(dataParsed[CatalystDataIndexes.VOTING_KEY]),
        curve_type: CurveType.edwards25519
      },
      stakeKey: {
        hex_bytes: remove0xPrefix(dataParsed[CatalystDataIndexes.STAKE_KEY]),
        curve_type: CurveType.edwards25519
      },
      rewardAddress: rewardAddress.to_bech32(),
      votingNonce: dataParsed[CatalystDataIndexes.VOTING_NONCE],
      votingSignature: remove0xPrefix(sigParsed[CatalystSigIndexes.VOTING_SIGNATURE])
    };

    return {
      operation_identifier: { index },
      status: '',
      type: OperationType.VOTE_REGISTRATION,
      metadata: { voteRegistrationMetadata: parsedMetadata }
    };
  });

/**
 * Converts a Cardano Transaction into a Rosetta Operation array.
 *
 * @param logger
 * @param transactionBody
 * @param extraData @see {@link ../data-mapper.ts#encodeExtraData} for further info
 * @param network
 */
export const convert = (
  logger: Logger,
  transactionBody: CardanoWasm.TransactionBody,
  extraData: TransactionExtraData,
  network: number
): Components.Schemas.Operation[] =>
  usingAutoFree(scope => {
    const operations = [];
    const inputs = scope.manage(transactionBody.inputs());
    const outputs = scope.manage(transactionBody.outputs());
    logger.info(`[parseOperationsFromTransactionBody] About to parse ${inputs.len()} inputs`);
    const inputOperations = extraData.operations.filter(({ type }) => type === OperationType.INPUT);
    for (let index = 0; index < inputs.len(); index++) {
      const input = scope.manage(inputs.get(index));
      const inputParsed = parseInputToOperation(input, operations.length);
      operations.push({ ...inputParsed, ...inputOperations[index], status: '' });
    }
    // till this line operations only contains inputs
    const relatedOperations = getRelatedOperationsFromInputs(operations);
    logger.info(`[parseOperationsFromTransactionBody] About to parse ${outputs.len()} outputs`);
    for (let index = 0; index < outputs.len(); index++) {
      const output = scope.manage(outputs.get(index));
      const address = parseAddress(scope.manage(output.address()), getAddressPrefix(network));
      const outputParsed = parseOutputToOperation(logger, output, operations.length, relatedOperations, address);
      operations.push(outputParsed);
    }

    const certOps = extraData.operations.filter(({ type }) =>
      [
        OperationType.STAKE_KEY_REGISTRATION,
        OperationType.STAKE_KEY_DEREGISTRATION,
        OperationType.STAKE_DELEGATION,
        OperationType.POOL_REGISTRATION,
        OperationType.POOL_REGISTRATION_WITH_CERT,
        OperationType.POOL_RETIREMENT
      ].includes(type as OperationType)
    );
    const parsedCertOperations = parseCertsToOperations(logger, transactionBody, certOps, network);
    operations.push(...parsedCertOperations);
    const withdrawalOps = extraData.operations.filter(({ type }) => type === OperationType.WITHDRAWAL);
    const withdrawalsCount = scope.manage(transactionBody.withdrawals())?.len() || 0;
    parseWithdrawalsToOperations(logger, withdrawalOps, withdrawalsCount, operations, network);

    const voteOp = extraData.operations.find(({ type }) => type === OperationType.VOTE_REGISTRATION);
    if (voteOp) {
      const parsedVoteOperations = parseVoteMetadataToOperation(
        logger,
        voteOp.operation_identifier.index,
        extraData.transactionMetadataHex
      );
      operations.push(parsedVoteOperations);
    }

    return operations;
  });
