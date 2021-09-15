/* eslint-disable no-magic-numbers */
/* eslint-disable camelcase */
/* eslint-disable new-cap */
/* eslint-disable no-console */
import {
  constructionPreprocess,
  constructionMetadata,
  constructionPayloads,
  constructionCombine,
  constructionSubmit,
  waitForBalanceToBe,
  buildOperation,
} from "./commons";

import { PrivateKey } from "@emurgo/cardano-serialization-lib-nodejs";
const logger = console;

const SEND_FUNDS_ADDRESS =
  "addr1qqr585tvlc7ylnqvz8pyqwauzrdu0mxag3m7q56grgmgu7sxu2hyfhlkwuxupa9d5085eunq2qywy7hvmvej456flknsug829n";
const keys = {
  publicKey: Buffer.from(
    "73fea80d424276ad0978d4fe5310e8bc2d485f5f6bb3bf87612989f112ad5a7d",
    "hex"
  ),
  secretKey: Buffer.from(
    "b813a62becba674d8e29ce907ee3533f622d41e155768d58793cbad373e1a45e47f9d20ab7f78b023a2cf363c2217400a8c658dfd1c8057c4f62b6f6746d1c41",
    "hex"
  ),
};
const CHAIN_CODE =
  "dd75e154da417becec55cdd249327454138f082110297d5e87ab25e15fad150f";

const signPayloads = (payloads: any, keyAddressMapper: any) =>
  payloads.map((signing_payload: any) => {
    const {
      account_identifier: { address },
    } = signing_payload;
    const { publicKey, secretKey } = keyAddressMapper[address];
    return {
      signing_payload: {
        ...signing_payload,
        account_identifier: {
          ...signing_payload.account_identifier,
          metadata: {
            chain_code: CHAIN_CODE,
          },
        },
      },
      public_key: {
        hex_bytes: Buffer.from(publicKey).toString("hex"),
        curve_type: "edwards25519",
      },
      signature_type: "ed25519",
      hex_bytes: Buffer.from(
        PrivateKey.from_extended_bytes(secretKey)
          .sign(Buffer.from(signing_payload.hex_bytes, "hex"))
          .to_bytes()
      ).toString("hex"),
    };
  });

// Byron address corresponding to previous keys
const address =
  "FHnt4NL7yPYGFit5s7BgG13FwEgSeofJgntqYsmzRVRzBoJYUgMSKM5VmiWCHpk";

const doRun = async (): Promise<void> => {
  const keyAddressMapper = {};
  keyAddressMapper[address] = keys;
  const { unspents, balances } = await waitForBalanceToBe(
    address,
    (response) => response.coins.length !== 0
  );
  const builtOperations = buildOperation(
    unspents,
    balances,
    address,
    SEND_FUNDS_ADDRESS
  );
  const preprocess = await constructionPreprocess(
    builtOperations.operations,
    1000
  );
  const metadata = await constructionMetadata(preprocess);
  const payloads = await constructionPayloads({
    operations: builtOperations.operations,
    metadata,
  });
  const signatures = signPayloads(payloads.payloads, keyAddressMapper);
  const combined = await constructionCombine(
    payloads.unsigned_transaction,
    signatures
  );
  logger.info(`[doRun] signed transaction is ${combined.signed_transaction}`);
  const hashResponse = await constructionSubmit(combined.signed_transaction);
  logger.info(
    `[doRun] transaction with hash ${hashResponse.transaction_identifier.hash} sent`
  );
  await waitForBalanceToBe(address, (response) => response.coins.length === 0);
};

doRun()
  .then(() => logger.info("Send Transaction finished"))
  .catch(console.error);
