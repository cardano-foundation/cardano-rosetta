/* eslint-disable camelcase */

import cbor from 'cbor';
import { NetworkIdentifier } from '../services/cardano-services';
import { NetworkStatus } from '../services/network-service';
import {
  ADA,
  ADA_DECIMALS,
  CARDANO,
  MAINNET,
  operationType,
  SIGNATURE_TYPE,
  stakingOperations,
  SUCCESS_STATUS
} from './constants';
import { Block, BlockUtxos, BalanceAtBlock, Network, PopulatedTransaction, Utxo } from '../models';

const COIN_SPENT_ACTION = 'coin_spent';
const COIN_CREATED_ACTION = 'coin_created';

export const mapAmount = (lovelace: string): Components.Schemas.Amount => ({
  value: lovelace,
  currency: {
    symbol: ADA,
    decimals: ADA_DECIMALS
  }
});

/**
 * Creates a Rosetta operation for the given information ready to be consumed by clients
 *
 * @param index
 * @param type
 * @param status
 * @param address
 * @param value
 * @param relatedOperations
 */
const createOperation = (
  index: number,
  type: string,
  status: string,
  address: string,
  value: string,
  relatedOperations?: Components.Schemas.OperationIdentifier[],
  network_index?: number,
  coin_change?: Components.Schemas.CoinChange
  // eslint-disable-next-line max-params
): Components.Schemas.Operation => ({
  operation_identifier: {
    index,
    network_index
  },
  type,
  status,
  account: {
    address
  },
  amount: mapAmount(value),
  coin_change,
  related_operations: relatedOperations
});

const getCoinChange = (
  index: number,
  hash: string,
  coinAction: Components.Schemas.CoinAction
): Components.Schemas.CoinChange => ({
  coin_identifier: {
    identifier: `${hash}:${index}`
  },
  coin_action: coinAction
});

const getOperationIndexes = (operations: Components.Schemas.Operation[]): Components.Schemas.OperationIdentifier[] =>
  operations.map(operation => ({
    index: operation.operation_identifier.index
  }));

const getOperationCurrentIndex = (
  operationsList: Array<Components.Schemas.Operation[]>,
  relativeIndex: number
): number =>
  operationsList.reduce((accumulator, currentOperations) => accumulator + currentOperations.length, relativeIndex);

/**
 * Converts a Cardano Transaction into a Rosetta one
 *
 * @param transaction to be mapped
 */
export const mapToRosettaTransaction = (transaction: PopulatedTransaction): Components.Schemas.Transaction => {
  const inputsAsOperations = transaction.inputs.map((input, index) =>
    createOperation(
      index,
      operationType.INPUT,
      SUCCESS_STATUS,
      input.address,
      `-${input.value}`,
      undefined,
      undefined,
      getCoinChange(input.sourceTransactionIndex, input.sourceTransactionHash, COIN_SPENT_ACTION)
    )
  );
  const totalOperations = [inputsAsOperations];
  const withdrawalsAsOperations: Components.Schemas.Operation[] = transaction.withdrawals.map((withdrawal, index) => ({
    operation_identifier: {
      index: getOperationCurrentIndex(totalOperations, index)
    },
    type: operationType.WITHDRAWAL,
    status: SUCCESS_STATUS,
    account: {
      address: withdrawal.stakeAddress
    },
    metadata: {
      withdrawalAmount: mapAmount(`-${withdrawal.amount}`)
    }
  }));
  totalOperations.push(withdrawalsAsOperations);
  const registrationsAsOperations: Components.Schemas.Operation[] = transaction.registrations.map(
    (registration, index) => ({
      operation_identifier: {
        index: getOperationCurrentIndex(totalOperations, index)
      },
      type: operationType.STAKE_KEY_REGISTRATION,
      status: SUCCESS_STATUS,
      account: {
        address: registration.stakeAddress
      },
      metadata: {
        depositAmount: mapAmount(registration.amount)
      }
    })
  );
  totalOperations.push(registrationsAsOperations);
  const deregistrationsAsOperations: Components.Schemas.Operation[] = transaction.deregistrations.map(
    (deregistration, index) => ({
      operation_identifier: {
        index: getOperationCurrentIndex(totalOperations, index)
      },
      type: operationType.STAKE_KEY_DEREGISTRATION,
      status: SUCCESS_STATUS,
      account: {
        address: deregistration.stakeAddress
      },
      metadata: {
        fundAmount: mapAmount(deregistration.amount)
      }
    })
  );
  totalOperations.push(deregistrationsAsOperations);
  const delegationsAsOperations: Components.Schemas.Operation[] = transaction.delegations.map((delegation, index) => ({
    operation_identifier: {
      index: getOperationCurrentIndex(totalOperations, index)
    },
    type: operationType.STAKE_KEY_REGISTRATION,
    status: SUCCESS_STATUS,
    account: {
      address: delegation.stakeAddress
    },
    metadata: {
      pool_key_hash: delegation.poolHash
    }
  }));
  totalOperations.push(delegationsAsOperations);
  // Output related operations are all the inputs.This will iterate over the collection again
  // but it's better for the sake of clarity and tx are bounded by block size (it can be
  // refactored to use a reduce)
  const relatedOperations = getOperationIndexes(inputsAsOperations)
    .concat(getOperationIndexes(withdrawalsAsOperations))
    .concat(getOperationIndexes(deregistrationsAsOperations));

  const outputsAsOperations = transaction.outputs.map((output, index) =>
    createOperation(
      getOperationCurrentIndex(totalOperations, index),
      operationType.OUTPUT,
      SUCCESS_STATUS,
      output.address,
      output.value,
      relatedOperations,
      output.index,
      getCoinChange(output.index, transaction.hash, COIN_CREATED_ACTION)
    )
  );
  totalOperations.push(outputsAsOperations);

  const operations = totalOperations.reduce((accum, operation) => accum.concat(operation), []);
  return {
    transaction_identifier: {
      hash: transaction.hash
    },
    operations
  };
};

/**
 * Returns a Rosetta block based on a Cardano block and it's transactions
 *
 * @param block cardano block
 * @param transactions cardano transactions for the given block
 */
export const mapToRosettaBlock = (block: Block, transactions: PopulatedTransaction[]): Components.Schemas.Block => ({
  block_identifier: {
    hash: block.hash,
    index: block.number
  },
  parent_block_identifier: {
    index: block.previousBlockNumber,
    hash: block.previousBlockHash
  },
  timestamp: block.createdAt,
  metadata: {
    transactionsCount: block.transactionsCount,
    createdBy: block.createdBy,
    size: block.size,
    epochNo: block.epochNo,
    slotNo: block.slotNo
  },
  transactions: transactions.map(mapToRosettaTransaction)
});

/**
 * Processes AccountBalance response utxo section
 * @param utxoDetails
 */
const parseUtxoDetails = (utxoDetails: Utxo[]): Components.Schemas.Coin[] =>
  utxoDetails.map(utxoDetail => ({
    amount: mapAmount(utxoDetail.value),
    coin_identifier: { identifier: `${utxoDetail.transactionHash}:${utxoDetail.index}` }
  }));

/**
 * Generates an AccountBalance response object
 * @param blockBalanceData
 * @param accountAddress
 */
export const mapToAccountBalanceResponse = (
  blockBalanceData: BlockUtxos | BalanceAtBlock
): Components.Schemas.AccountBalanceResponse => {
  // FIXME: handle this in a better way
  if (blockBalanceData.hasOwnProperty('utxos')) {
    const balanceForAddress = (blockBalanceData as BlockUtxos).utxos
      .reduce((acum, current) => acum + BigInt(current.value), BigInt(0))
      .toString();
    return {
      block_identifier: {
        index: blockBalanceData.block.number,
        hash: blockBalanceData.block.hash
      },
      balances: [mapAmount(balanceForAddress)],
      coins: parseUtxoDetails((blockBalanceData as BlockUtxos).utxos)
    };
  }
  return {
    block_identifier: {
      index: blockBalanceData.block.number,
      hash: blockBalanceData.block.hash
    },
    balances: [mapAmount((blockBalanceData as BalanceAtBlock).balance)]
  };
};

export const mapToNetworkList = (networkIdentifiers: Network[]): Components.Schemas.NetworkListResponse => ({
  network_identifiers: networkIdentifiers.map(({ networkName }: Network) => ({
    network: networkName,
    blockchain: CARDANO
  }))
});

export const mapToNetworkStatusResponse = (networkStatus: NetworkStatus): Components.Schemas.NetworkStatusResponse => {
  const { latestBlock, genesisBlock, peers } = networkStatus;
  return {
    current_block_identifier: {
      index: latestBlock.number,
      hash: latestBlock.hash
    },
    current_block_timestamp: latestBlock.createdAt,
    genesis_block_identifier: {
      index: genesisBlock.number,
      hash: genesisBlock.hash
    },
    peers: peers.map(peer => ({
      peer_id: peer.addr
    }))
  };
};

/**
 * Returns the CardanoNetoworkIdentifier based on the Rosetta API one
 *
 * @param networkRequestParameters
 */
export const getNetworkIdentifierByRequestParameters = (
  networkRequestParameters: Components.Schemas.NetworkIdentifier
): NetworkIdentifier => {
  if (networkRequestParameters.network === MAINNET) {
    return NetworkIdentifier.CARDANO_MAINNET_NETWORK;
  }
  return NetworkIdentifier.CARDANO_TESTNET_NETWORK;
};

/**
 * Rosetta Api requires some information during the workflow that's not available in an UTXO based blockchain,
 * like input amounts. Because of that we need to encode some extra data to be able to recover it, for example,
 * when parsing the transaction. For further explanation see:
 * https://community.rosetta-api.org/t/implementing-the-construction-api-for-utxo-model-coins/100/3
 *
 * CBOR is being used to follow standard Cardano serialization library
 *
 * @param transaction
 * @param extraData
 */
export const encodeExtraData = async (
  transaction: string,
  operations: Components.Schemas.Operation[]
): Promise<string> => {
  const extraData: Components.Schemas.Operation[] = operations
    // eslint-disable-next-line camelcase
    .filter(
      operation =>
        operation.coin_change?.coin_action === COIN_SPENT_ACTION ||
        stakingOperations.includes(operation.type as operationType)
    );

  return (await cbor.encodeAsync([transaction, extraData])).toString('hex');
};

export const decodeExtraData = async (encoded: string): Promise<[string, Components.Schemas.Operation[]]> => {
  const [decoded] = await cbor.decodeAll(encoded);
  return decoded;
};

export const mapToConstructionHashResponse = (
  transactionHash: string
): Components.Schemas.TransactionIdentifierResponse => ({
  transaction_identifier: { hash: transactionHash }
});

interface TransactionExtraData {
  account: Components.Schemas.AccountIdentifier | undefined;
  amount: Components.Schemas.Amount | undefined;
}

/**
 * It maps the transaction body and the addresses to the Rosetta's SigningPayload
 * @param transactionBodyHash
 * @param addresses
 */
export const constructPayloadsForTransactionBody = (
  transactionBodyHash: string,
  addresses: string[]
): Components.Schemas.SigningPayload[] =>
  addresses.map(address => ({ address, hex_bytes: transactionBodyHash, signature_type: SIGNATURE_TYPE }));
