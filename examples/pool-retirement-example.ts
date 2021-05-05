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
  generateKeys,
  signPayloads,
  waitForBalanceToBe,
  buildOperation,
} from "./commons";
const logger = console;

const PRIVATE_KEY =
  "41d9523b87b9bd89a4d07c9b957ae68a7472d8145d7956a692df1a8ad91957a2c117d9dd874447f47306f50a650f1e08bf4bec2cfcb2af91660f23f2db912977";

const SEND_FUNDS_ADDRESS =
  "addr_test1qqr585tvlc7ylnqvz8pyqwauzrdu0mxag3m7q56grgmgu7sxu2hyfhlkwuxupa9d5085eunq2qywy7hvmvej456flknswgndm3";

// cold keys
const coldKeys = {
  secretKey: Buffer.from(
    "e1a37517351be84cc54bb34fcb31064fb0a7648c7f20e08ce872e082a943360e55ad29a820ecb70f5b49557f566f6635b4258a1c4a8a2039ce71f703deec698b",
    "hex"
  ),
  publicKey: Buffer.from(
    "55ad29a820ecb70f5b49557f566f6635b4258a1c4a8a2039ce71f703deec698b",
    "hex"
  ),
};

const POOL_KEY_HASH =
  "138864a67cbf60d7a70eceb814b749711df2af65a6ba5512efad68f2";

const EPOCH_TO_RETIRE = 135;

const buildPoolRetirementOperation = (
  currentIndex: number,
  poolKeyHash: string,
  epochToRetire: number
) => ({
  operation_identifier: { index: currentIndex + 1 },
  type: "poolRetirement",
  status: "success",
  account: { address: poolKeyHash },
  metadata: {
    epoch: epochToRetire,
  },
});

const doRun = async (): Promise<void> => {
  const keyAddressMapper = {};
  keyAddressMapper[POOL_KEY_HASH] = coldKeys;

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
    SEND_FUNDS_ADDRESS,
    true
  );

  const currentIndex = builtOperations.operations.length - 1;

  const builtPoolRetirementOperation = buildPoolRetirementOperation(
    currentIndex,
    POOL_KEY_HASH,
    EPOCH_TO_RETIRE
  );
  builtOperations.operations.push(builtPoolRetirementOperation);
  logger.info(
    `[doRun] operations to be sent are ${JSON.stringify(
      builtOperations.operations
    )}`
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
  const transactionHash = hashResponse.transaction_identifier.hash;
  logger.info(`[doRun] transaction with hash ${transactionHash} sent`);
};

doRun()
  .then(() => logger.info("Pool Registration finished"))
  .catch(console.error);
