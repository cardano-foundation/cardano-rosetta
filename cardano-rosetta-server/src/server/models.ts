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

export interface Utxo {
  value: string;
  transactionHash: string;
  index: number;
}

export interface TransactionInput {
  address: string;
  value: string;
  sourceTransactionHash: string;
  sourceTransactionIndex: number;
}

export interface TransactionOutput {
  address: string;
  value: string;
  index: number;
}

export interface Withdrawal {
  stakeAddress: string;
  amount: string;
}

export interface Transaction {
  hash: string;
  blockHash: string;
  fee: string;
  size: number;
}

export interface PopulatedTransaction extends Transaction {
  inputs: TransactionInput[];
  outputs: TransactionOutput[];
  withdrawals: Withdrawal[];
}

export interface Network {
  networkName: string;
}

export interface BlockUtxos {
  block: Block;
  utxos: Utxo[];
}
