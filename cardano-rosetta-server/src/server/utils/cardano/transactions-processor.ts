import CardanoWasm from 'cardano-serialization-lib';
import { Logger } from 'fastify';
import { ADA, ADA_DECIMALS, CurveType, OperationType } from '../constants';
import { ErrorFactory } from '../errors';
import { hexFormatter } from '../formatters';
import { generateRewardAddress, getAddressPrefix } from './addresses';
import { getStakingCredentialFromHex } from './staking-credentials';

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

const parseOutputToOperation = (
  output: CardanoWasm.TransactionOutput,
  index: number,
  relatedOperations: Components.Schemas.OperationIdentifier[],
  addressPrefix: string
): Components.Schemas.Operation => ({
  operation_identifier: { index },
  related_operations: relatedOperations,
  account: { address: output.address().to_bech32(addressPrefix) },
  amount: {
    value: output
      .amount()
      .coin()
      .to_str(),
    currency: { symbol: ADA, decimals: ADA_DECIMALS }
  },
  status: '',
  type: OperationType.OUTPUT
});

const parseCertToOperation = (
  cert: CardanoWasm.Certificate,
  index: number,
  hash: string,
  type: string,
  address: string
): Components.Schemas.Operation => {
  const operation: Components.Schemas.Operation = {
    operation_identifier: { index },
    status: '',
    type,
    account: { address },
    metadata: {
      staking_credential: { hex_bytes: hash, curve_type: CurveType.edwards25519 }
    }
  };
  const delegationCert = cert.as_stake_delegation();
  if (delegationCert) {
    operation.metadata!.pool_key_hash = Buffer.from(delegationCert.pool_keyhash().to_bytes()).toString('hex');
  }
  return operation;
};

const parseCertsToOperations = (
  logger: Logger,
  transactionBody: CardanoWasm.TransactionBody,
  stakingOps: Components.Schemas.Operation[],
  certsCount: number,
  network: number
): Components.Schemas.Operation[] => {
  const parsedOperations = [];
  logger.info(`[parseCertsToOperations] About to parse ${certsCount} certs`);
  for (let i = 0; i < certsCount; i++) {
    const stakingOperation = stakingOps[i];
    const hex = stakingOperation.metadata?.staking_credential?.hex_bytes;
    if (!hex) {
      logger.error('[parseCertsToOperations] Staking key not provided');
      throw ErrorFactory.missingStakingKeyError();
    }
    const credential = getStakingCredentialFromHex(logger, stakingOperation.metadata?.staking_credential);
    const address = generateRewardAddress(logger, network, credential);
    const cert = transactionBody.certs()!.get(i);
    const parsedOperation = parseCertToOperation(
      cert,
      stakingOperation.operation_identifier.index,
      hex,
      stakingOperation.type,
      address
    );
    parsedOperations.push(parsedOperation);
  }

  return parsedOperations;
};

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
) => {
  logger.info(`[parseWithdrawalsToOperations] About to parse ${withdrawalsCount} withdrawals`);
  for (let i = 0; i < withdrawalsCount; i++) {
    const withdrawalOperation = withdrawalOps[i];
    const credential = getStakingCredentialFromHex(logger, withdrawalOperation.metadata!.staking_credential);
    const address = generateRewardAddress(logger, network, credential);
    const parsedOperation = parseWithdrawalToOperation(
      withdrawalOperation.amount!.value,
      withdrawalOperation.metadata!.staking_credential!.hex_bytes,
      withdrawalOperation.operation_identifier.index,
      address
    );
    operations.push(parsedOperation);
  }
};

const getRelatedOperationsFromInputs = (
  inputs: Components.Schemas.Operation[]
): Components.Schemas.OperationIdentifier[] => inputs.map(input => ({ index: input.operation_identifier.index }));

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
  extraData: Components.Schemas.Operation[],
  network: number
): Components.Schemas.Operation[] => {
  const operations = [];
  const inputsCount = transactionBody.inputs().len();
  const outputsCount = transactionBody.outputs().len();
  logger.info(`[parseOperationsFromTransactionBody] About to parse ${inputsCount} inputs`);
  for (let i = 0; i < inputsCount; i++) {
    const input = transactionBody.inputs().get(i);
    const inputParsed = parseInputToOperation(input, operations.length);
    const inputExtraData = extraData.find(
      data => data.operation_identifier.index === inputParsed.operation_identifier.index
    );
    operations.push({ ...inputParsed, ...inputExtraData, status: '' });
  }
  // till this line operations only contains inputs
  const relatedOperations = getRelatedOperationsFromInputs(operations);
  logger.info(`[parseOperationsFromTransactionBody] About to parse ${outputsCount} outputs`);
  for (let i = 0; i < outputsCount; i++) {
    const output = transactionBody.outputs().get(i);
    const outputParsed = parseOutputToOperation(
      output,
      operations.length,
      relatedOperations,
      getAddressPrefix(network)
    );
    const outputExtraData = extraData.find(
      data => data.operation_identifier.index === outputParsed.operation_identifier.index
    );
    operations.push({ ...outputParsed, ...outputExtraData, status: '' });
  }
  const stakingOps = extraData.filter(({ type }) =>
    [
      OperationType.STAKE_KEY_REGISTRATION,
      OperationType.STAKE_KEY_DEREGISTRATION,
      OperationType.STAKE_DELEGATION
    ].includes(type as OperationType)
  );
  const certsCount = transactionBody.certs()?.len() || 0;
  const parsedCertOperations = parseCertsToOperations(logger, transactionBody, stakingOps, certsCount, network);
  operations.push(...parsedCertOperations);

  const withdrawalOps = extraData.filter(({ type }) => type === OperationType.WITHDRAWAL);
  const withdrawalsCount = transactionBody.withdrawals()?.len() || 0;
  parseWithdrawalsToOperations(logger, withdrawalOps, withdrawalsCount, operations, network);

  return operations;
};
