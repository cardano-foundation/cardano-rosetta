/* eslint-disable no-magic-numbers */
/* eslint-disable camelcase */
/* eslint-disable new-cap */
/* eslint-disable no-console */
import delay from "delay";
import * as NaCl from "tweetnacl";
import axios from "axios";
import * as Bip39 from "bip39";
import * as CardanoWasm from "@emurgo/cardano-serialization-lib-nodejs";
import { vars } from "./variables";
import {Ed25519Signature} from "@emurgo/cardano-serialization-lib-nodejs";
const logger = console;

const httpClient = axios.create({
  baseURL: vars.BASE_URL,
});

const network_identifier = vars.NETWORK_IDENTIFIER;
const generateKeys = (secretKey?: string) =>
  secretKey
    ? NaCl.sign.keyPair.fromSecretKey(Buffer.from(secretKey, "hex"))
    : NaCl.sign.keyPair();

const constructionDerive = async (
  publicKey: string,
  addressType?: string,
  stakingKey?: string
): Promise<string> => {
  logger.info(
    `[constructionDerive] Fetching an address for pub key ${publicKey}`
  );
  const request = {
    network_identifier,
    public_key: {
      hex_bytes: publicKey,
      curve_type: "edwards25519",
    },
    metadata: {},
  };
  if (addressType) {
    request.metadata = { address_type: addressType };
    if (stakingKey)
      request.metadata = Object.assign({}, request.metadata, {
        staking_credential: {
          hex_bytes: stakingKey,
          curve_type: "edwards25519",
        },
      });
  }
  const response = await httpClient.post("/construction/derive", request);
  const address = response.data.account_identifier.address;
  logger.debug(`[constructionDerive] Retrieved address ${address}`);
  return address;
};

const waitForBalanceToBe = async (
  address: string,
  coinsCond: (param: any) => boolean = () => true,
  balanceCond: (param: any) => boolean = () => true
) => {
  let fetchAccountBalance;
  let fetchAccountCoins;
  do {
    const response = await httpClient.post("/account/coins", {
      network_identifier,
      account_identifier: {
        address,
      },
    });
    const responseBalance = await httpClient.post("/account/balance", {
      network_identifier,
      account_identifier: {
        address,
      },
    });
    if (coinsCond(response.data) && balanceCond(responseBalance.data)) {
      const { balances } = responseBalance.data;
      logger.info("[waitForBalanceToBe] Funds found!");
      balances.forEach((balance) =>
        logger.info(
          `[waitForBalanceToBe] ${balance.value} amount of ${balance.currency.symbol}`
        )
      );
      fetchAccountBalance = responseBalance.data;
      fetchAccountCoins = response.data;
    } else {
      logger.debug(
        "[waitForBalanceToBe] Condition not met, waiting for a few seconds."
      );
      await delay(30 * 1000);
    }
  } while (!fetchAccountBalance || !fetchAccountCoins);
  return { balances: fetchAccountBalance, unspents: fetchAccountCoins };
};

const depositParameters = {
  keyDeposit: "2000000",
  poolDeposit: "500000000",
};

const constructionPreprocess = async (
  operations: any,
  relative_ttl: number,
  deposit_parameters = depositParameters
) => {
  const response = await httpClient.post("/construction/preprocess", {
    network_identifier: network_identifier,
    operations: operations,
    metadata: { relative_ttl, deposit_parameters },
  });
  return response.data.options;
};
const constructionMetadata = async (options: any) => {
  const response = await httpClient.post("/construction/metadata", {
    network_identifier,
    options,
  });
  return response.data;
};

const buildOperationsToPayAda = (
    unspents: any,
    balances: any,
    address: string,
    destination: string,
    ada_to_pay: number
    ) => {
      let availableAda = balances.balances.reduce((acc: number , value ) => value.currency.symbol == "ADA" ? acc + Number(value.value) : acc, 0);
      if (availableAda < ada_to_pay) {
          throw new Error(`Not enough funds to pay ${ada_to_pay} ADA`);
      }
      // lets find the first unspent that has enough ada
      let unspentsEnoughToPayAda = unspents.coins.filter((coin: any) => Number(coin.amount.value) > ada_to_pay && coin.amount.currency.symbol == "ADA");
      if(unspentsEnoughToPayAda.length == 0) {
        throw new Error(`No UTXO is big enough to pay ${ada_to_pay} ADA. Multiple UTXOs are not supported yet.`);
      }
      const utxoToPay = unspentsEnoughToPayAda.sort((a: any, b: any) => Number(a.amount.value) - Number(b.amount.value))[0];
      let operations = [];
      operations.push({
        operation_identifier: {
          index: 0,
          network_index: 0,
        },
        related_operations: [],
        type: "input",
        status: "success",
        account: {
          address,
          metadata: {},
        },
        amount: {
          value: "-" + utxoToPay.amount.value,
          currency: {
            symbol: "ADA",
            decimals: 6,
          },
        },
        coin_change: {
          coin_identifier: utxoToPay.coin_identifier,
          coin_action: "coin_created",
        },
        metadata: {},
      });
      operations.push({
          operation_identifier: {
          index: 1,
          network_index: 0,
          },
          related_operations: [],
          type: "output",
          status: "success",
          account: {
          address: destination,
          metadata: {},
          },
          amount: {
          value: ada_to_pay.toString(),
          currency: {
              symbol: "ADA",
              decimals: 6,
          },
          },
          metadata: {},
      });
      // change if needed
      if(Number(utxoToPay.amount.value) > ada_to_pay) {
          operations.push({
              operation_identifier: {
                index: 2,
                network_index: 0,
              },
              related_operations: [],
              type: "output",
              status: "success",
              account: {
                address,
                metadata: {},
              },
              amount: {
                value: (Number(utxoToPay.amount.value) - ada_to_pay).toString(),
                currency: {
                    symbol: "ADA",
                    decimals: 6,
                },
              },
              metadata: {},
          });
      }
        return operations;
    };

const buildOperation = (
  unspents: any,
  balances: any,
  address: string,
  destination: string,
  isRegisteringStakeKey: boolean = false,
  outputsPerc: number = 95
) => {
  let tokenBundle = [];
  const inputs = unspents.coins.map((coin: any, index: number) => {
    const operation = {
      operation_identifier: {
        index,
        network_index: 0,
      },
      related_operations: [],
      type: "input",
      status: "success",
      account: {
        address,
        metadata: {},
      },
      amount: coin.amount,
      coin_change: {
        coin_identifier: coin.coin_identifier,
        coin_action: "coin_created",
      },
      metadata: {},
    };
    if (coin.metadata) {
      const coinsWithMa = Object.keys(coin.metadata);
      const coinTokenBundleItems = coinsWithMa.reduce(
        (tokenBundleList, coinWithMa) => {
          const tokenBundleItems = coin.metadata[coinWithMa];
          return tokenBundleList.concat(tokenBundleItems);
        },
        []
      );
      tokenBundle.push(...coinTokenBundleItems);
      operation.metadata = { tokenBundle };
    }
    operation.amount.value = `-${operation.amount.value}`;
    return operation;
  });
  // TODO: No proper fees estimation is being done (it should be transaction size based)
  const adaBalance = BigInt(balances.balances[0].value);
  let outputAmount = (adaBalance * BigInt(outputsPerc)) / BigInt(100);
  if (isRegisteringStakeKey) {
    let i = 0;
    do {
      let dividend = outputsPerc - i;
      outputAmount = (adaBalance * BigInt(dividend)) / BigInt(100);
      i += 5;
      if (outputAmount < 2500000)
        throw new Error(
          `outputAmount=${outputAmount} is too low. Try with more funds.`
        );
    } while (adaBalance - outputAmount <= 2000000);
  }

  const outputOp = {
    operation_identifier: {
      index: inputs.length,
      network_index: 0,
    },
    related_operations: [],
    type: "output",
    status: "success",
    account: {
      address: destination,
      metadata: {},
    },
    amount: {
      value: outputAmount.toString(),
      currency: {
        symbol: "ADA",
        decimals: 6,
      },
      metadata: {},
    },
    metadata: {},
  };
  if (tokenBundle.length > 0) outputOp.metadata = { tokenBundle };
  const outputs = [outputOp];

  return {
    network_identifier,
    operations: inputs.concat(outputs),
  };
};

const substractFee = (operations: any, fee: number) => {
  var changeOperation = operations[2];
  changeOperation.amount.value = ""+ (Number(changeOperation.amount.value) - (Number(fee) * 2)); // we are paying double fee
  operations[2] = changeOperation;
  return operations;
}

const constructionPayloads = async (payload: any) => {
  const response = await httpClient.post("/construction/payloads", {
    network_identifier,
    ...payload,
  });
  return response.data;
};

const signPayloads = (payloads: any, keyAddressMapper: any) =>
  payloads.map((signing_payload: any) => {
    const {
      account_identifier: { address },
    } = signing_payload;
    const { publicKey, secretKey } = keyAddressMapper[address];
    // let ed25519Signature = Ed25519Signature.from_bytes(Buffer.from(secretKey, "hex"));

    return {
      signing_payload,
      public_key: {
        hex_bytes: Buffer.from(publicKey.to_raw_key().as_bytes()).toString("hex"),
        curve_type: "edwards25519",
      },
      signature_type: "ed25519",
      hex_bytes: Buffer.from(
          CardanoWasm.make_vkey_witness(
              CardanoWasm.TransactionHash.from_bytes(
                  Buffer.from(signing_payload.hex_bytes, "hex")
              ),
              secretKey.to_raw_key()
            ).signature().to_bytes()
      ).toString("hex"),
    };
  });

const constructionCombine = async (
  unsigned_transaction: any,
  signatures: any
) => {
  const response = await httpClient.post("/construction/combine", {
    network_identifier,
    unsigned_transaction,
    signatures,
  });
  return response.data;
};

const constructionSubmit = async (signed_transaction: any) => {
  const response = await httpClient.post("/construction/submit", {
    network_identifier,
    signed_transaction,
  });
  return response.data;
};

const buildDelegationOperation = (
  stakingKey: string,
  currentIndex: number,
  poolKeyHash: string
) => ({
  operation_identifier: {
    index: currentIndex + 1,
  },
  type: "stakeDelegation",
  status: "success",
  metadata: {
    staking_credential: {
      hex_bytes: stakingKey,
      curve_type: "edwards25519",
    },
    pool_key_hash: poolKeyHash,
  },
});

const buildRegistrationOperation = (
  stakingKey: string,
  currentIndex: number
) => ({
  operation_identifier: { index: currentIndex + 1 },
  type: "stakeKeyRegistration",
  status: "success",
  metadata: {
    staking_credential: {
      hex_bytes: stakingKey,
      curve_type: "edwards25519",
    },
  },
});

const buildVoteDrepDelegationOperation = (
    stakingKey: string,
    currentIndex: number
) => ({
  operation_identifier: {
    index: currentIndex + 1,
  },
  type: "dRepVoteDelegation",
  status: "success",
  metadata: {
    staking_credential: {
      hex_bytes: stakingKey,
      curve_type: "edwards25519",
    },
    drep: {
      type: "abstain",
    },
  },
})

const harden = (
  num: number
) => {
  return 0x80000000 + num;
};

const getAccount = (
  mnemonic: string = vars.MNEMONIC,
  accountNumber: number = 0
) : CardanoWasm.Bip32PrivateKey => {
  const entropy = Bip39.mnemonicToEntropy(mnemonic);

  // See https://github.com/cardano-foundation/CIPs/blob/master/CIP-1852/CIP-1852.md
  // The code is based on https://github.com/Emurgo/cardano-serialization-lib/blob/2c21b9d9afad3f90865ea85a2330f491aa019786/example/index.spec.ts#L26
  const account = CardanoWasm.Bip32PrivateKey.from_bip39_entropy(
    Buffer.from(entropy, "hex"),
    Buffer.from("")
  )
    .derive(harden(1852))
    .derive(harden(1815))
    .derive(harden(accountNumber)); // account #0
  return account;
};

const getStakePrivateKey = (
    mnemonic: string = vars.MNEMONIC,
    accountNumber: number = 0
) : CardanoWasm.Bip32PrivateKey => {
  return getAccount(mnemonic, accountNumber).derive(2).derive(0);
};

const getStakePrivateKeyAsHex = (
    mnemonic: string = vars.MNEMONIC,
    accountNumber: number = 0
) => {
  const privKeyBytes = getStakePrivateKey(mnemonic, accountNumber).as_bytes();
  return Buffer.from(privKeyBytes).toString("hex");
}

const getStakePublicKeyAsHex = (
    mnemonic: string = vars.MNEMONIC,
    accountNumber: number = 0
) => {
  const pubKey = getStakePrivateKey(mnemonic, accountNumber).to_public().as_bytes();
  return Buffer.from(pubKey).toString("hex");
}

const getPaymentPrivateKey = (
  mnemonic: string = vars.MNEMONIC,
  accountNumber: number = 0
) : CardanoWasm.Bip32PrivateKey => {
  return getAccount(mnemonic, accountNumber).derive(0).derive(0);
}

const getPaymentPrivateKeyAsHex = (
  mnemonic: string = vars.MNEMONIC,
  accountNumber: number = 0
) => {
  const privKeyBytes = getPaymentPrivateKey(mnemonic, accountNumber).as_bytes();
  return Buffer.from(privKeyBytes).toString("hex");
}

const getPaymentPublicKeyAsHex = (
  mnemonic: string = vars.MNEMONIC,
  accountNumber: number = 0
) => {
  const pubKey = getPaymentPrivateKey(mnemonic, accountNumber).to_public().as_bytes();
  return Buffer.from(pubKey).toString("hex");;
}

const getChainCode = (
  mnemonic: string = vars.MNEMONIC,
  accountNumber: number = 0
) : Uint8Array => {
  return getPaymentPrivateKey().chaincode();
};

// TODO
const getByronAddress = (
  mnemonic: string = vars.MNEMONIC,
  accountNumber: number = 0
) => {
  const byronIcarusAddress = CardanoWasm.ByronAddress.icarus_from_key(getPaymentPrivateKey(mnemonic, accountNumber).to_public(), vars.PROTOCOL_MAGIC);
  return byronIcarusAddress;
};

const getPaymentKeys = (
    mnemonic: string = vars.MNEMONIC,
    accountNumber: number = 0
    ) => {

    const paymentPrivateKey = getPaymentPrivateKey(mnemonic, accountNumber);
    const paymentPublicKey = getPaymentPrivateKey(mnemonic, accountNumber).to_public();
    return {
        secretKey: paymentPrivateKey,
        publicKey: paymentPublicKey,
    };
    };
const getStakeKeys = (
    mnemonic: string = vars.MNEMONIC,
    accountNumber: number = 0
) => {
  const paymentPrivateKey = getStakePrivateKey(mnemonic, accountNumber);
  const paymentPublicKey = getStakePrivateKey(mnemonic, accountNumber).to_public();
  return {
    secretKey: paymentPrivateKey,
    publicKey: paymentPublicKey,
  };
}



export {
  buildDelegationOperation,
  buildOperation,
  buildOperationsToPayAda,
  buildRegistrationOperation,
  buildVoteDrepDelegationOperation,
  constructionDerive,
  constructionPreprocess,
  constructionMetadata,
  constructionPayloads,
  constructionCombine,
  constructionSubmit,
  signPayloads,
  waitForBalanceToBe,
  generateKeys,
  substractFee,
  getAccount,
  getPaymentPrivateKey,
  getPaymentPrivateKeyAsHex,
  getPaymentPublicKeyAsHex,
  getChainCode,
  getByronAddress,
  getStakePrivateKey,
  getStakePrivateKeyAsHex,
  getStakePublicKeyAsHex,
  getPaymentKeys,
  getStakeKeys
};
