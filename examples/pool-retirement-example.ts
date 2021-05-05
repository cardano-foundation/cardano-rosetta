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
    "a9945927a6329a4fa61bc71e4a8c9963198047808cf68a933c67b8dc5b86bf4c281a3bd9b3c03bb591d9a411c23e1cedfd7c1a5bb6c88c76631ebbb00d9539bc",
    "hex"
  ),
  publicKey: Buffer.from(
    "281a3bd9b3c03bb591d9a411c23e1cedfd7c1a5bb6c88c76631ebbb00d9539bc",
    "hex"
  ),
};

const POOL_KEY_HASH =
  "c50d06bd9bbd388b97f36959b2079520744e6fbd0f5e368e03c9e922";

const paymentKeys = {
  secretKey: Buffer.from(
    "5999079ac830afee7a4e94eb538472a538f9fa8c75bdfd8397e67cfda84829f8e1b56e9979563668e65cd628d8b1a644cf7d1bce8af12bf9247326f5d2cdca9c",
    "hex"
  ),
  publicKey: Buffer.from(
    "e1b56e9979563668e65cd628d8b1a644cf7d1bce8af12bf9247326f5d2cdca9c",
    "hex"
  ),
};

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

  // const paymentKeys = generateKeys(PRIVATE_KEY);
  // logger.info(
  //   `[doRun] secretKey ${Buffer.from(paymentKeys.secretKey).toString("hex")}`
  // );
  const paymentPublicKey = Buffer.from(paymentKeys.publicKey).toString("hex");
  const paymentAddress = "addr_test1qpp2t2ptsu5fakh2gwgpzxq5wppexln6hpspullwqw8l953yg05rjrcxxlu752j7r89wwr765rdjfgpdzuvxhwen5u8q6pmdfh";

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
    true
  );

  const currentIndex = builtOperations.operations.length - 1;

  const builtPoolRetirementOperation = buildPoolRetirementOperation(
    currentIndex,
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
