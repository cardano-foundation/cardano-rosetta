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
  signPayloads,
  waitForBalanceToBe,
  buildOperation,
} from "./commons";
const logger = console;

// address with ma balance
const PAYMENT_ADDRESS =
  "addr_test1vpcv26kdu8hr9x939zktp275xhwz4478c8hcdt7l8wrl0ecjftnfa";

const EXPECTED_TOKEN = {
  policy: "3e6fc736d30770b830db70994f25111c18987f1407585c0f55ca470f",
  symbol: "6a78546f6b656e31",
};

const PAYMENT_KEYS = {
  secretKey: Buffer.from(
    "67b638cef68135c4005cb71782b070c4805c9e1077c7ab6145b152206073272974dabdc594506574a9b58f719787d36ea1af291d141d3e5e5ccfe076909ae106",
    "hex"
  ),
  publicKey: Buffer.from(
    "74dabdc594506574a9b58f719787d36ea1af291d141d3e5e5ccfe076909ae106",
    "hex"
  ),
};

const SEND_FUNDS_ADDRESS =
  "addr_test1vz4nrdp83nksz0w3szxpav2peasm0xsdfc44lt2ml20420qclwuqu";

const doRun = async (): Promise<void> => {
  const keyAddressMapper = {};
  keyAddressMapper[PAYMENT_ADDRESS] = PAYMENT_KEYS;

  const responseCondition = (response) =>
    response.coins.length !== 0 &&
    response.balances.some(
      (balance) =>
        balance.currency.symbol === EXPECTED_TOKEN.symbol &&
        balance.currency?.metadata?.policyId === EXPECTED_TOKEN.policy
    );

  const unspents = await waitForBalanceToBe(PAYMENT_ADDRESS, responseCondition);
  const builtOperations = buildOperation(
    unspents,
    PAYMENT_ADDRESS,
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
  await waitForBalanceToBe(
    PAYMENT_ADDRESS,
    (response) => response.coins.length === 0
  );
};

doRun()
  .then(() => logger.info("Send Transaction finished"))
  .catch(console.error);
