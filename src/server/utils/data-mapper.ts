/* eslint-disable camelcase */

import { TransactionWithInputsAndOutputs, Block, Utxo } from '../db/blockchain-repository';
import { TRANSFER_OPERATION_TYPE, SUCCESS_STATUS, ADA, ADA_DECIMALS, CARDANO } from './constants';
import { BlockUtxos } from '../services/block-service';
import { Logger } from 'fastify';
import { Network } from '../db/network-repository';
import { Peer, NetworkStatus } from '../services/network-service';
import { NetworkStats } from 'dockerode';

const COIN_SPENT_ACTION = 'coin_spent';
const COIN_CREATED_ACTION = 'coin_created';

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
  amount: {
    value,
    currency: {
      symbol: 'ADA',
      decimals: 6
    }
  },
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

/**
 * Converts a Cardano Transaction into a Rosetta one
 *
 * @param transaction to be mapped
 */
export const mapToRosettaTransaction = (
  transaction: TransactionWithInputsAndOutputs
): Components.Schemas.Transaction => {
  const inputsAsOperations = transaction.inputs.map((input, index) =>
    createOperation(
      index,
      TRANSFER_OPERATION_TYPE,
      SUCCESS_STATUS,
      input.address,
      `-${input.value}`,
      undefined,
      undefined,
      getCoinChange(input.sourceTransactionIndex, input.sourceTransactionHash, COIN_SPENT_ACTION)
    )
  );
  // Output related operations are all the inputs.This will iterate over the collection again
  // but it's better for the sake of clarity and tx are bounded by block size (it can be
  // refactored to use a reduce)
  const relatedOperations = inputsAsOperations.map(input => ({
    index: input.operation_identifier.index
  }));
  const outputsAsOperations = transaction.outputs.map((output, index) =>
    createOperation(
      inputsAsOperations.length + index,
      TRANSFER_OPERATION_TYPE,
      SUCCESS_STATUS,
      output.address,
      output.value,
      relatedOperations,
      output.index,
      getCoinChange(output.index, transaction.hash, COIN_CREATED_ACTION)
    )
  );

  return {
    transaction_identifier: {
      hash: transaction.hash
    },
    operations: inputsAsOperations.concat(outputsAsOperations)
  };
};

/**
 * Returns a Rosetta block based on a Cardano block and it's transactions
 *
 * @param block cardano block
 * @param transactions cardano transactions for the given block
 */
export const mapToRosettaBlock = (
  block: Block,
  transactions: TransactionWithInputsAndOutputs[]
): Components.Schemas.Block => ({
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
    amount: { value: utxoDetail.value, currency: { symbol: ADA, decimals: ADA_DECIMALS } },
    coin_identifier: { identifier: `${utxoDetail.transactionHash}:${utxoDetail.index}` }
  }));

/**
 * Generates an AccountBalance response object
 * @param blockUtxos
 * @param accountAddress
 */
export const mapToAccountBalanceResponse = (
  blockUtxos: BlockUtxos,
  accountAddress: string
): Components.Schemas.AccountBalanceResponse => {
  const balanceForAddress = blockUtxos.utxos.reduce((acum, current) => acum + Number(current.value), 0).toString();
  return {
    block_identifier: {
      index: blockUtxos.block.number,
      hash: blockUtxos.block.hash
    },
    balances: [
      {
        value: balanceForAddress,
        currency: {
          symbol: ADA,
          decimals: ADA_DECIMALS,
          metadata: {
            issuer: accountAddress
          }
        },
        metadata: {}
      }
    ],
    coins: parseUtxoDetails(blockUtxos.utxos)
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
