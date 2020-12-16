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
const PRIVATE_STAKING_KEY =
  "nqDmxvW0ytblMFnEbMFO8rVgl5V/pYnso/TPOyWz3vylms3kaRPDAg49S/rYyJh+eb+e0X3jeqCBhXgAHNjLCA==";
const WITHDRAWAL_AMOUNT = 10000;

const network_identifier = {
  blockchain: "cardano",
  network: "testnet",
};

const buildWithdrawalOperation = (
  stakingKey: string,
  currentIndex: number,
  withdrawalAmount: number
) => ({
  operation_identifier: {
    index: currentIndex + 1,
  },
  type: "withdrawal",
  status: "success",
  amount: {
    value: withdrawalAmount,
    currency: {
      symbol: "ADA",
      decimals: 6,
    },
  },
  metadata: {
    staking_credential: {
      hex_bytes: stakingKey,
      curve_type: "edwards25519",
    },
  },
});

const doRun = async (): Promise<void> => {
  const keys = generateKeys(PRIVATE_KEY);
  logger.info(
    `[doRun] secretKey ${Buffer.from(keys.secretKey).toString("hex")}`
  );
  const publicKey = Buffer.from(keys.publicKey).toString("hex");

  const stakingKey = Buffer.from(
    generateKeys(PRIVATE_STAKING_KEY).publicKey
  ).toString("hex");
  logger.info(`[doRun] secretKey ${stakingKey}`);
  const address = await constructionDerive(publicKey);
  const unspents = await waitForBalanceToBe(
    address,
    (response) => response.coins.length !== 0
  );
  const builtOperations = buildOperation(unspents, address, SEND_FUNDS_ADDRESS);
  const totalOperations = builtOperations.operations.length;
  const builtDelegationOperation = buildWithdrawalOperation(
    stakingKey,
    totalOperations,
    WITHDRAWAL_AMOUNT
  );
  builtOperations.operations.push(builtDelegationOperation);
  const preprocess = await constructionPreprocess(builtOperations, 1000);
  const metadata = await constructionMetadata(preprocess);
  const payloads = await constructionPayloads({
    network_identifier,
    operations: builtOperations.operations,
    metadata
  });
  const signatures = signPayloads(payloads.payloads, keys);
  const combined = await constructionCombine(
    payloads.unsigned_transaction,
    signatures
  );
  logger.info(`[doRun] signed transaction is ${combined.signed_transaction}`);
  const hashResponse = await constructionSubmit(combined.signed_transaction);
  logger.info(
    `[doRun] transaction with hash ${hashResponse.transaction_identifier.hash} sent`
  );
};

doRun()
  .then(() => logger.info("Stake Registration finished"))
  .catch(console.error);
