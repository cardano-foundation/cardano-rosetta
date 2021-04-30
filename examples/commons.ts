/* eslint-disable no-magic-numbers */
/* eslint-disable camelcase */
/* eslint-disable new-cap */
/* eslint-disable no-console */
import delay from "delay";
import * as NaCl from "tweetnacl";
import axios from "axios";

const logger = console;

const httpClient = axios.create({
  baseURL: "http://localhost:8080",
});

const network_identifier = {
  blockchain: "cardano",
  network: "testnet",
};

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
          `[waitForBalanceToBe] ${balance.value} ${balance.currency.symbol}`
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
const constructionPreprocess = async (
  operations: any,
  relative_ttl: number
) => {
  const response = await httpClient.post("/construction/preprocess", {
    network_identifier,
    operations,
    metadata: { relative_ttl },
  });
  return response.data.options;
};
const constructionMetadata = async (options: any) => {
  const response = await httpClient.post("/construction/metadata", {
    network_identifier,
    options,
  });
  return response.data.metadata;
};

const buildOperation = (
  unspents: any,
  balances: any,
  address: string,
  destination: string,
  isRegisteringStakeKey: boolean = false,
  outputsPerc: number
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
      let dividend = 45 - i;
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
    const { publicKey, privateKey } = keyAddressMapper[address];
    return {
      signing_payload,
      public_key: {
        hex_bytes: Buffer.from(publicKey).toString("hex"),
        curve_type: "edwards25519",
      },
      signature_type: "ed25519",
      hex_bytes: Buffer.from(
        NaCl.sign.detached(
          Buffer.from(signing_payload.hex_bytes, "hex"),
          privateKey
        )
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

export {
  buildDelegationOperation,
  buildOperation,
  constructionDerive,
  constructionPreprocess,
  constructionMetadata,
  constructionPayloads,
  constructionCombine,
  constructionSubmit,
  signPayloads,
  waitForBalanceToBe,
  generateKeys,
};
