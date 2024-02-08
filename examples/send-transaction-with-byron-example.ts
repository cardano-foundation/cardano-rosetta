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
  getPaymentPublicKeyAsHex,
  getPaymentPrivateKeyAsHex,
  getPaymentPrivateKey,
  getByronAddress, getPaymentKeys
} from "./commons";
import { vars } from "./variables";
import { PrivateKey } from "@emurgo/cardano-serialization-lib-nodejs";
const logger = console;



const signPayloads = (payloads: any, keyAddressMapper: any, chaincode: any) =>
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
            chain_code: Buffer.from(chaincode).toString("hex"),
          },
        },
      },
      public_key: {
        hex_bytes: Buffer.from(publicKey.to_raw_key().as_bytes()).toString("hex"),
        curve_type: "edwards25519",
      },
      signature_type: "ed25519",
      hex_bytes: Buffer.from(
        PrivateKey.from_extended_bytes(secretKey.to_raw_key().as_bytes())
          .sign(Buffer.from(signing_payload.hex_bytes, "hex"))
          .to_bytes()
      ).toString("hex"),
    };
  });

const doRun = async (): Promise<void> => {
  const keyAddressMapper = {};
  const keys = getPaymentKeys();
  const address = getByronAddress().to_base58();
  keyAddressMapper[address] = keys;
  logger.info(
      `[doRun] Byron Address ${address.toString()}`
  );
  const { unspents, balances } = await waitForBalanceToBe(
      address,
    (response) => response.coins.length !== 0
  );

  const builtOperations = buildOperation(
    unspents,
    balances,
      address,
    vars.SEND_FUNDS_ADDRESS
  );
  const preprocess = await constructionPreprocess(
    builtOperations.operations,
    10
  );
  const metadata = await constructionMetadata(preprocess);
  const payloads = await constructionPayloads({
    operations: builtOperations.operations,
    metadata,
  });
  const signatures = signPayloads(payloads.payloads, keyAddressMapper, keys.secretKey.chaincode());
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
