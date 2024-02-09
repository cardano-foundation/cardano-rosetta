/* eslint-disable camelcase */

import cbor from 'cbor';
import {
  BalanceAtBlock,
  Block,
  BlockUtxos,
  BlockUtxosMultiAssets,
  Network,
  PopulatedTransaction,
  TokenBundle,
  Utxo
} from '../models';
import { NetworkStatus } from '../services/network-service';
import {
  ADA,
  ADA_DECIMALS,
  CARDANO,
  MAINNET,
  MULTI_ASSET_DECIMALS,
  NetworkIdentifier,
  OperationType,
  OperationTypeStatus,
  PoolOperations,
  SIGNATURE_TYPE,
  StakingOperations,
  VoteOperations,
  CurveType
} from './constants';
import { hexStringFormatter } from './formatters';

const COIN_SPENT_ACTION = 'coin_spent';
const COIN_CREATED_ACTION = 'coin_created';

export interface TransactionExtraData {
  operations: Components.Schemas.Operation[];
  transactionMetadataHex?: string;
}

export const mapAmount = (
  value: string,
  symbol = ADA,
  decimals = ADA_DECIMALS,
  metadata?: { policyId?: string }
): Components.Schemas.Amount => ({
  value,
  currency: {
    symbol: hexStringFormatter(symbol),
    decimals,
    metadata
  }
});

const mapValue = (value: string, spent: boolean): string => (spent ? `-${value}` : value);

const mapTokenBundle = (tokenBundle: TokenBundle, spent: boolean): Components.Schemas.TokenBundleItem[] =>
  [...tokenBundle.tokens.entries()].map(([policyId, tokens]) => ({
    policyId,
    tokens: tokens.map(t => ({
      currency: { symbol: hexStringFormatter(t.name), decimals: 0 },
      value: mapValue(t.quantity, spent)
    }))
  }));

const mapTokenBundleToMetadata = (
  spent: boolean,
  tokenBundle?: TokenBundle
): Components.Schemas.OperationMetadata | undefined =>
  tokenBundle ? { tokenBundle: mapTokenBundle(tokenBundle, spent) } : undefined;

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
  coin_change?: Components.Schemas.CoinChange,
  tokenBundleMetadata?: Components.Schemas.OperationMetadata
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
  related_operations: relatedOperations,
  metadata: tokenBundleMetadata
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

const isBlockUtxos = (block: BlockUtxos | BalanceAtBlock): block is BlockUtxos => block.hasOwnProperty('utxos');

/**
 * Converts a Cardano Transaction into a Rosetta one
 *
 * @param transaction to be mapped
 */
export const mapToRosettaTransaction = (
  transaction: PopulatedTransaction,
  poolDeposit: string
): Components.Schemas.Transaction => {
  const status = transaction.validContract ? OperationTypeStatus.SUCCESS : OperationTypeStatus.INVALID;
  const inputsAsOperations = transaction.inputs.map((input, index) =>
    createOperation(
      index,
      OperationType.INPUT,
      status,
      input.address,
      mapValue(input.value, true),
      undefined,
      undefined,
      getCoinChange(input.sourceTransactionIndex, input.sourceTransactionHash, COIN_SPENT_ACTION),
      mapTokenBundleToMetadata(true, input.tokenBundle)
    )
  );
  const totalOperations = [inputsAsOperations];
  const withdrawalsAsOperations: Components.Schemas.Operation[] = transaction.withdrawals.map((withdrawal, index) => ({
    operation_identifier: {
      index: getOperationCurrentIndex(totalOperations, index)
    },
    type: OperationType.WITHDRAWAL,
    status,
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
      type: OperationType.STAKE_KEY_REGISTRATION,
      status,
      account: {
        address: registration.stakeAddress
      },
      metadata: {
        depositAmount: mapAmount(registration.amount)
      }
    })
  );
  totalOperations.push(registrationsAsOperations);
  const poolRetirementOperations: Components.Schemas.Operation[] = transaction.poolRetirements.map(
    (poolRetirement, index) => ({
      operation_identifier: {
        index: getOperationCurrentIndex(totalOperations, index)
      },
      type: OperationType.POOL_RETIREMENT,
      status,
      account: {
        address: poolRetirement.address
      },
      metadata: {
        epoch: poolRetirement.epoch
      }
    })
  );
  totalOperations.push(poolRetirementOperations);

  const deregistrationsAsOperations: Components.Schemas.Operation[] = transaction.deregistrations.map(
    (deregistration, index) => ({
      operation_identifier: {
        index: getOperationCurrentIndex(totalOperations, index)
      },
      type: OperationType.STAKE_KEY_DEREGISTRATION,
      status,
      account: {
        address: deregistration.stakeAddress
      },
      metadata: {
        refundAmount: mapAmount(deregistration.amount)
      }
    })
  );
  totalOperations.push(deregistrationsAsOperations);
  const delegationsAsOperations: Components.Schemas.Operation[] = transaction.delegations.map((delegation, index) => ({
    operation_identifier: {
      index: getOperationCurrentIndex(totalOperations, index)
    },
    type: OperationType.STAKE_DELEGATION,
    status,
    account: {
      address: delegation.stakeAddress
    },
    metadata: {
      pool_key_hash: delegation.poolHash
    }
  }));
  totalOperations.push(delegationsAsOperations);
  const poolRegistrationsAsOperations: Components.Schemas.Operation[] = transaction.poolRegistrations.map(
    (poolRegistration, index) => ({
      operation_identifier: {
        index: getOperationCurrentIndex(totalOperations, index)
      },
      type: OperationType.POOL_REGISTRATION,
      status,
      account: {
        // public cold key
        address: poolRegistration.poolHash
      },
      metadata: {
        // if this protocol value changes this amount may not be accurate
        depositAmount: mapAmount(poolDeposit),
        poolRegistrationParams: {
          pledge: poolRegistration.pledge,
          rewardAddress: poolRegistration.address,
          cost: poolRegistration.cost,
          poolOwners: poolRegistration.owners,
          margin_percentage: poolRegistration.margin,
          vrfKeyHash: poolRegistration.vrfKeyHash,
          relays: poolRegistration.relays
        }
      }
    })
  );
  totalOperations.push(poolRegistrationsAsOperations);
  const voteRegistrationsAsOperations: Components.Schemas.Operation[] = transaction.voteRegistrations.map(
    (voteRegistration, index) => ({
      operation_identifier: {
        index: getOperationCurrentIndex(totalOperations, index)
      },
      type: OperationType.VOTE_REGISTRATION,
      status,
      metadata: {
        voteRegistrationMetadata: {
          stakeKey: {
            hex_bytes: voteRegistration.stakeKey,
            curve_type: CurveType.edwards25519
          },
          votingKey: {
            hex_bytes: voteRegistration.votingKey,
            curve_type: CurveType.edwards25519
          },
          rewardAddress: voteRegistration.rewardAddress,
          votingNonce: voteRegistration.votingNonce,
          votingSignature: voteRegistration.votingSignature
        }
      }
    })
  );
  totalOperations.push(voteRegistrationsAsOperations);
  // Output related operations are all the inputs.This will iterate over the collection again
  // but it's better for the sake of clarity and tx are bounded by block size (it can be
  // refactored to use a reduce)
  const relatedOperations = getOperationIndexes(inputsAsOperations)
    .concat(getOperationIndexes(withdrawalsAsOperations))
    .concat(getOperationIndexes(deregistrationsAsOperations));

  const outputsAsOperations = transaction.outputs.map((output, index) =>
    createOperation(
      getOperationCurrentIndex(totalOperations, index),
      OperationType.OUTPUT,
      status,
      output.address,
      output.value,
      relatedOperations,
      output.index,
      getCoinChange(output.index, transaction.hash, COIN_CREATED_ACTION),
      mapTokenBundleToMetadata(false, output.tokenBundle)
    )
  );
  totalOperations.push(outputsAsOperations);

  const operations = totalOperations.flat();
  const { size, scriptSize, hash } = transaction;
  return {
    transaction_identifier: {
      hash
    },
    operations,
    metadata: {
      size,
      scriptSize
    }
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
  transactions: PopulatedTransaction[],
  poolDeposit: string
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
    slotNo: Number(block.slotNo)
  },
  transactions: transactions.map(t => mapToRosettaTransaction(t, poolDeposit))
});

const areEqualUtxos = (firstUtxo: Utxo, secondUtxo: Utxo) =>
  firstUtxo.index === secondUtxo.index && firstUtxo.transactionHash === secondUtxo.transactionHash;

const updateMetadataCoin = (
  coin: Components.Schemas.Coin,
  policy: string,
  quality: string,
  name: string
): Components.Schemas.Coin => {
  const updatedCoin: Components.Schemas.Coin = coin;
  const coinId = coin.coin_identifier.identifier;
  if (updatedCoin.metadata && updatedCoin.metadata[coinId]) {
    const existsPolicyId = updatedCoin.metadata[coinId].find(
      (tokenBundle: Components.Schemas.TokenBundleItem) => tokenBundle.policyId === policy
    );
    if (existsPolicyId) {
      const policyIndx = updatedCoin.metadata[coinId]
        .map((c: Components.Schemas.TokenBundleItem) => c.policyId)
        .indexOf(policy);
      updatedCoin.metadata[coinId][policyIndx].tokens.push(
        mapAmount(quality, name, MULTI_ASSET_DECIMALS, { policyId: policy })
      );
    } else {
      const tokenBundle: Components.Schemas.TokenBundleItem = {
        policyId: policy,
        tokens: [mapAmount(quality, name, MULTI_ASSET_DECIMALS, { policyId: policy })]
      };
      updatedCoin.metadata[coinId].push(tokenBundle);
    }
  } else {
    const tokenBundle: Components.Schemas.TokenBundleItem = {
      policyId: policy,
      tokens: [mapAmount(quality, name, MULTI_ASSET_DECIMALS, { policyId: policy })]
    };
    updatedCoin.metadata = {
      [coinId]: [tokenBundle]
    };
  }
  return updatedCoin;
};

export const mapToAccountCoinsResponse = (blockCoinsData: BlockUtxos): Components.Schemas.AccountCoinsResponse => {
  const mappedUtxos = blockCoinsData.utxos.reduce((adaCoins, current, index) => {
    const previousValue = blockCoinsData.utxos[index - 1];
    const coinId = `${current.transactionHash}:${current.index}`;
    if (!previousValue || !areEqualUtxos(previousValue, current)) {
      adaCoins.set(coinId, {
        coin_identifier: {
          identifier: coinId
        },
        amount: mapAmount(current.value)
      });
    }
    if (current.policy && current.name !== undefined && current.quantity) {
      // MultiAsset
      const relatedCoin = adaCoins.get(coinId);
      if (relatedCoin) {
        const updatedCoin = updateMetadataCoin(relatedCoin, current.policy, current.quantity, current.name);
        adaCoins.set(coinId, updatedCoin);
      }
    }
    return adaCoins;
  }, new Map<string, Components.Schemas.Coin>());
  return {
    block_identifier: {
      index: blockCoinsData.block.number,
      hash: blockCoinsData.block.hash
    },
    coins: [...mappedUtxos.values()]
  };
};

/**
 * Generates an AccountBalance response object
 * @param blockBalanceData
 * @param accountAddress
 */
export const mapToAccountBalanceResponse = (
  blockBalanceData: BlockUtxosMultiAssets | BalanceAtBlock
): Components.Schemas.AccountBalanceResponse => {
  if (isBlockUtxos(blockBalanceData)) {
    const maBalances =
      blockBalanceData.maBalances.length > 0
        ? blockBalanceData.maBalances.map(maBalance =>
            mapAmount(maBalance.value, maBalance.name, MULTI_ASSET_DECIMALS, { policyId: maBalance.policy })
          )
        : [];
    const adaBalance = blockBalanceData.utxos.reduce((totalAmount, current, index) => {
      const previousValue = blockBalanceData.utxos[index - 1];
      // This function accumulates ADA value. As there might be several, one for each multi-asset, we need to
      // avoid counting them twice
      if (!previousValue || !areEqualUtxos(previousValue, current)) {
        totalAmount += BigInt(current.value);
      }
      return totalAmount;
    }, BigInt(0));
    const totalBalance = [mapAmount(adaBalance.toString()), ...maBalances];
    return {
      block_identifier: {
        index: blockBalanceData.block.number,
        hash: blockBalanceData.block.hash
      },
      balances: totalBalance.length === 0 ? [mapAmount('0')] : totalBalance
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

export const mapToNetworkList = (network: Network): Components.Schemas.NetworkListResponse => ({
  network_identifiers: [
    {
      network: network.networkId,
      blockchain: CARDANO
    }
  ]
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
export const encodeExtraData = async (transaction: string, extraData: TransactionExtraData): Promise<string> => {
  const { operations, transactionMetadataHex } = extraData;
  const extraOperations: Components.Schemas.Operation[] = operations
    // eslint-disable-next-line camelcase
    .filter(
      operation =>
        operation.coin_change?.coin_action === COIN_SPENT_ACTION ||
        StakingOperations.includes(operation.type as OperationType) ||
        PoolOperations.includes(operation.type as OperationType) ||
        VoteOperations.includes(operation.type as OperationType)
    );
  const toEncode: TransactionExtraData = {
    operations: extraOperations
  };
  if (transactionMetadataHex) {
    toEncode.transactionMetadataHex = transactionMetadataHex;
  }
  const encoded = await cbor.encodeAsync([transaction, toEncode]);
  return encoded.toString('hex');
};

export const decodeExtraData = async (encoded: string): Promise<[string, TransactionExtraData]> => {
  const [decoded] = await cbor.decodeAll(encoded);
  return decoded;
};

export const mapToConstructionHashResponse = (
  transactionHash: string
): Components.Schemas.TransactionIdentifierResponse => ({
  transaction_identifier: { hash: transactionHash }
});

/**
 * It maps the transaction body and the addresses to the Rosetta's SigningPayload
 * @param transactionBodyHash
 * @param addresses
 */
export const constructPayloadsForTransactionBody = (
  transactionBodyHash: string,
  addresses: string[]
): Components.Schemas.SigningPayload[] =>
  addresses.map(address => ({
    account_identifier: {
      address
    },
    hex_bytes: transactionBodyHash,
    signature_type: SIGNATURE_TYPE
  }));

// if ADA is requested then all coins will be returned
export const filterRequestedCurrencies = (currencies?: Components.Schemas.Currency[]): Components.Schemas.Currency[] =>
  currencies && !currencies.map(currency => currency.symbol).includes(ADA) ? currencies : [];
