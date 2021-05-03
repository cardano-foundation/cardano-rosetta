/* eslint-disable no-magic-numbers */
/* eslint-disable camelcase */
/* eslint-disable new-cap */
/* eslint-disable no-console */
import {
  buildDelegationOperation,
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
    "45ad0a9123f966e5d584140c1fe49d8f8430ee9f55c8c4177bdf632191dca496cb18b6cb54eb79376134cd6c19f8d4bf2f9dfe1503d53547c4f8800897b50d3a",
    "hex"
  ),
  publicKey: Buffer.from(
    "cb18b6cb54eb79376134cd6c19f8d4bf2f9dfe1503d53547c4f8800897b50d3a",
    "hex"
  ),
};

const POOL_KEY_HASH =
  "1677d50dcecc49c58bdad62cf2ad9bef6e7adb8a722665c11a0cfec2";

const buildPoolRetirementOperation = (
  currentIndex: number,
  poolKeyHash: string
) => ({
  operation_identifier: { index: currentIndex + 1 },
  type: "poolRetirement",
  status: "success",
  account: { address: poolKeyHash },
  metadata: {
    epoch: 135
  },
});

const doRun = async (): Promise<void> => {
  const keyAddressMapper = {};

  keyAddressMapper[POOL_KEY_HASH] = coldKeys;

  const paymentKeys = generateKeys(PRIVATE_KEY);
  logger.info(
    `[doRun] secretKey ${Buffer.from(paymentKeys.secretKey).toString("hex")}`
  );
  const paymentPublicKey = Buffer.from(paymentKeys.publicKey).toString("hex");

  const paymentAddress = await constructionDerive(paymentPublicKey);

  keyAddressMapper[paymentAddress] = paymentKeys;
  const { unspents, balances } = await waitForBalanceToBe(
    paymentAddress,
    (response) => response.coins.length !== 0
  );
  const builtOperations = buildOperation(
    unspents,
    balances,
    paymentAddress,
    SEND_FUNDS_ADDRESS,
    true,
    45
  );

  const currentIndex = builtOperations.operations.length - 1;

  const builtPoolRetirementOperation = buildPoolRetirementOperation(
    currentIndex + 1,
    POOL_KEY_HASH
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
