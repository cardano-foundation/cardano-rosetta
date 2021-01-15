export type ProtocolParameters = {
  poolDeposit: number;
  protocolVersion: {
    minor: number;
    major: number;
  };
  minUTxOValue: number;
  decentralisationParam: number;
  maxTxSize: number;
  minPoolCost: number;
  minFeeA: number;
  maxBlockBodySize: number;
  minFeeB: number;
  eMax: number;
  extraEntropy: {
    tag: string;
  };
  maxBlockHeaderSize: number;
  keyDeposit: number;
  nOpt: number;
  rho: number;
  tau: number;
  a0: number;
};
