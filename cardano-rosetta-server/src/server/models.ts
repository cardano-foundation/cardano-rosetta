/* eslint-disable camelcase */
import { FindTransactionInOutResult } from './db/queries/blockchain-queries';

export interface Block {
  hash: string;
  number: number;
  createdAt: number;
  previousBlockHash: string;
  previousBlockNumber: number;
  transactionsCount: number;
  createdBy: string;
  size: number;
  epochNo: number;
  slotNo: string;
}

export interface GenesisBlock {
  hash: string;
  number: number;
}

export interface BlockIdentifier {
  index: number;
  hash: string;
}

export interface FindTransaction {
  hash: Buffer;
  blockHash: Buffer;
  blockNo: number;
  fee: string;
  size: number;
  scriptSize: number;
  validContract: boolean;
}

export interface CoinIdentifier {
  hash: string;
  index: string;
}

export interface CurrencyId {
  symbol: string;
  policy: string;
}

export interface SearchFilters {
  maxBlock?: number;
  operator: Components.Schemas.Operator;
  status?: boolean;
  type?: string;
  coinIdentifier?: CoinIdentifier;
  currencyIdentifier?: CurrencyId;
  transactionHash?: string;
  address?: string;
  limit: number;
  offset: number;
}

export interface TotalCount {
  totalCount: number;
}

export interface FindTransactionWithToken extends FindTransactionInOutResult {
  policy: Buffer;
  name: Buffer;
  quantity: string;
}

export type PolicyId = string;

export interface Token {
  name: string;
  quantity: string;
}

export interface TokenBundle {
  tokens: Map<PolicyId, Token[]>;
}

export interface Utxo {
  value: string;
  transactionHash: string;
  index: number;
  name?: string;
  policy?: string;
  quantity?: string;
}

export interface MaBalance {
  name: string;
  policy: string;
  value: string;
}

export interface TransactionInOut {
  id: number;
  address: string;
  value: string;
  tokenBundle?: TokenBundle;
}

export interface TransactionInput extends TransactionInOut {
  sourceTransactionHash: string;
  sourceTransactionIndex: number;
}

export interface TransactionOutput extends TransactionInOut {
  index: number;
}

export interface Withdrawal {
  stakeAddress: string;
  amount: string;
}

export interface Registration {
  stakeAddress: string;
  amount: string;
}

export interface Deregistration {
  stakeAddress: string;
  amount: string;
}

export interface PoolRelay {
  ipv4?: string;
  ipv6?: string;
  dnsName?: string;
  port?: string;
}

export interface TransactionPoolRegistrations {
  txHash: Buffer;
  vrfKeyHash: Buffer;
  pledge: string;
  margin: string;
  cost: string;
  address: Buffer;
  poolHash: Buffer;
  owners: Buffer[];
  relays: PoolRelay[];
  metadataUrl?: string;
  metadataHash?: Buffer;
}

export interface PoolRegistration {
  vrfKeyHash: string;
  pledge: string;
  margin: string;
  cost: string;
  address: string;
  poolHash: string;
  owners: string[];
  relays: PoolRelay[];
  metadataUrl?: string;
  metadataHash?: string;
}

export interface PoolRetirement {
  epoch: number;
  address: string;
}

export interface VoteRegistration {
  votingKey: string;
  stakeKey: string;
  rewardAddress: string;
  votingNonce: number;
  votingSignature: string;
}

export interface Delegation {
  stakeAddress: string;
  poolHash: string;
}

export interface Transaction {
  hash: string;
  blockHash: string;
  blockNo: number;
  fee: string;
  size: number;
  validContract: boolean;
  scriptSize: number;
}

export interface TransactionCount {
  totalCount: number;
  transactions: Transaction[];
}

export interface PopulatedTransaction extends Transaction {
  inputs: TransactionInput[];
  outputs: TransactionOutput[];
  withdrawals: Withdrawal[];
  registrations: Registration[];
  deregistrations: Deregistration[];
  delegations: Delegation[];
  poolRegistrations: PoolRegistration[];
  poolRetirements: PoolRetirement[];
  voteRegistrations: VoteRegistration[];
}

export interface Network {
  networkId: string;
}

export interface BlockUtxos {
  block: Block;
  utxos: Utxo[];
}

export interface BlockUtxosMultiAssets extends BlockUtxos {
  maBalances: MaBalance[];
}

export interface BalanceAtBlock {
  block: Block;
  balance: string;
}

export interface ProtocolParameters {
  coins_per_utxo_size?: string;
  max_tx_size: number;
  max_val_size?: number;
  key_deposit: string;
  max_collateral_inputs?: number;
  min_fee_a: number;
  min_fee_b: number;
  min_pool_cost: string;
  pool_deposit: string;
  protocol_major: number;
}
