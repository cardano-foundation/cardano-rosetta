/* eslint-disable no-magic-numbers */
/* eslint-disable camelcase */
/* eslint-disable new-cap */
/* eslint-disable no-console */
import {
  constructionDerive,
  constructionPreprocess,
  constructionMetadata,
  constructionPayloads,
  constructionCombine,
  constructionSubmit,
  signPayloads,
  waitForBalanceToBe,
  buildOperation,
  generateKeys,
} from "./commons";
const logger = console;

const PRIVATE_KEY =
  "41d9523b87b9bd89a4d07c9b957ae68a7472d8145d7956a692df1a8ad91957a2c117d9dd874447f47306f50a650f1e08bf4bec2cfcb2af91660f23f2db912977";
const SEND_FUNDS_ADDRESS =
  "addr1qqr585tvlc7ylnqvz8pyqwauzrdu0mxag3m7q56grgmgu7sxu2hyfhlkwuxupa9d5085eunq2qywy7hvmvej456flknsug829n";

const doRun = async (): Promise<void> => {
  const keyAddressMapper = {};
  const keys = generateKeys(PRIVATE_KEY);
  logger.info(
    `[doRun] secretKey ${Buffer.from(keys.secretKey).toString("hex")}`
  );
  const address = await constructionDerive(
    Buffer.from(keys.publicKey).toString("hex")
  );
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
