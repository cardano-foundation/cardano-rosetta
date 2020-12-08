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
  "addr_test1qqr585tvlc7ylnqvz8pyqwauzrdu0mxag3m7q56grgmgu7sxu2hyfhlkwuxupa9d5085eunq2qywy7hvmvej456flknswgndm3";
const PRIVATE_STAKING_KEY =
  "f42bc82d827351122647bf4690f7f06e4e3fe95ab581277ce4783bff6bf885f3bddf3bb8b65cf197864ae82ac39dcaeca3956c3bd58af1fb3bf97d720e33cb47";
const STAKE_POOL_KEY_HASH =
  "22a8dc80b6fb4852150960c2e3896fa0a03498f514afc474c33152b6";

const buildRegistrationOperation = (
  stakingKey: string,
  currentIndex: number
) => ({
  operation_identifier: { index: currentIndex + 1 },
  type: "stakeKeyRegistration",
  status: "success",
  metadata: {
    staking_credential: {
      hex_bytes: stakingKey,
      curve_type: "edwards25519",
    },
  },
});

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

const doRun = async (): Promise<void> => {
  const paymentKeys = generateKeys(PRIVATE_KEY);
  logger.info(
    `[doRun] payment secretKey ${Buffer.from(paymentKeys.secretKey).toString(
      "hex"
    )}`
  );
  const paymentPublicKey = Buffer.from(paymentKeys.publicKey).toString("hex");

  const stakingKeys = generateKeys(PRIVATE_STAKING_KEY);
  logger.info(
    `[doRun] staking secretKey ${Buffer.from(stakingKeys.secretKey).toString(
      "hex"
    )}`
  );
  const stakingPublicKey = Buffer.from(stakingKeys.publicKey).toString("hex");

  const stakeAddress = await constructionDerive(stakingPublicKey, "Reward");
  console.log(`[doRun] stake address is ${stakeAddress}`);
  const paymentAddress = await constructionDerive(
    paymentPublicKey,
    "Base",
    stakingPublicKey
  );
  const unspents = await waitForBalanceToBe(
    paymentAddress,
    (response) => response.coins.length !== 0
  );
  const builtOperations = buildOperation(
    unspents,
    paymentAddress,
    SEND_FUNDS_ADDRESS
  );
  const totalOperations = builtOperations.operations.length;
  const builtRegistrationOperation = buildRegistrationOperation(
    stakingPublicKey,
    totalOperations
  );
  const builtDelegationOperation = buildDelegationOperation(
    stakingPublicKey,
    totalOperations + 1,
    STAKE_POOL_KEY_HASH
  );
  builtOperations.operations.push(builtRegistrationOperation);
  // builtOperations.operations.push(builtDelegationOperation);
  const preprocess = await constructionPreprocess(
    builtOperations.operations,
    1000
  );
  const metadata = await constructionMetadata(preprocess);
  const payloads = await constructionPayloads({
    operations: builtOperations.operations,
    metadata,
  });
  console.log(payloads);
  const signatures = signPayloads(payloads.payloads, paymentKeys);
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
  .then(() => logger.info("Stake Delegation finished"))
  .catch(console.error);
