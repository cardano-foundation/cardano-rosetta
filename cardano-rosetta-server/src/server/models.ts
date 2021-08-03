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
  slotNo: number;
}

export interface GenesisBlock {
  hash: string;
  number: number;
}

export interface BlockIdentifier {
  index: number;
  hash: string;
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
  signature: string;
  data: string;
}

export interface Delegation {
  stakeAddress: string;
  poolHash: string;
}

export interface Transaction {
  hash: string;
  blockHash: string;
  fee: string;
  size: number;
  validContract: boolean;
  scriptSize: number;
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
