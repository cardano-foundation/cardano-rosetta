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
  buildOperation, getPaymentKeys, constructionDerive,
} from "./commons";
import {vars} from "./variables";
const logger = console;


const EXPECTED_TOKEN = {
  policy: vars.TOKEN_POLICY,
  symbol: vars.TOKEN_SYMBOL,
};

const PAYMENT_KEYS = getPaymentKeys();

const doRun = async (): Promise<void> => {
  const keyAddressMapper = {};
  const address = await constructionDerive(
      Buffer.from(PAYMENT_KEYS.publicKey.to_raw_key().as_bytes()).toString("hex")
  );
  keyAddressMapper[address] = PAYMENT_KEYS;

  const coinsCondition = (response) => response.coins.length !== 0;
  const balanceCondition = (response) =>
    response.balances?.some(
      (balance) =>
        balance.currency.symbol === EXPECTED_TOKEN.symbol &&
        balance.currency?.metadata?.policyId === EXPECTED_TOKEN.policy
    );

  logger.info(`[doRun] address ${address} expects to receive funds.`);
  const { unspents, balances } = await waitForBalanceToBe(
      address,
    coinsCondition,
    balanceCondition
  );
  // TODO need to check the operations to refactor the buildOperation
  const builtOperations = buildOperation(
    unspents,
    balances,
    address,
    vars.SEND_FUNDS_ADDRESS
  );
  // TODO adding correct fee estimation

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
    vars.SEND_FUNDS_ADDRESS,
    (response) => response.coins.length === 0
  );
};

doRun()
  .then(() => logger.info("Send Transaction finished"))
  .catch(console.error);
