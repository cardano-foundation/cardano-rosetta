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

export interface Transaction {
  hash: string;
  blockHash: string;
  fee: string;
  size: number;
}

export interface TransactionWithInputsAndOutputs extends Transaction {
  inputs: TransactionInput[];
  outputs: TransactionOutput[];
}

export interface Network {
  networkName: string;
}

export interface BlockUtxos {
  block: Block;
  utxos: Utxo[];
}
