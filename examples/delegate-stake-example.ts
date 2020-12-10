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
  getStatus,
  lookForTransaction,
} from "./commons";

const logger = console;

const SEND_FUNDS_ADDRESS =
  "addr_test1qqr585tvlc7ylnqvz8pyqwauzrdu0mxag3m7q56grgmgu7sxu2hyfhlkwuxupa9d5085eunq2qywy7hvmvej456flknswgndm3";
const STAKE_POOL_KEY_HASH =
  "6be215192dc01e5ca4cfba0959586f581a865bfccc2984478dad1657";

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
  const keyAddressMapper = {};
  const paymentKeys = generateKeys();
  logger.info(
    `[doRun] payment secretKey ${Buffer.from(paymentKeys.secretKey).toString(
      "hex"
    )}`
  );
  const paymentPublicKey = Buffer.from(paymentKeys.publicKey).toString("hex");

  const stakingKeys = generateKeys();
  logger.info(
    `[doRun] staking secretKey ${Buffer.from(stakingKeys.secretKey).toString(
      "hex"
    )}`
  );
  const stakingPublicKey = Buffer.from(stakingKeys.publicKey).toString("hex");

  const stakeAddress = await constructionDerive(stakingPublicKey, "Reward");
  logger.info(`[doRun] stake address is ${stakeAddress}`);
  keyAddressMapper[stakeAddress] = stakingKeys;

  const paymentAddress = await constructionDerive(
    paymentPublicKey,
    "Base",
    stakingPublicKey
  );

  keyAddressMapper[paymentAddress] = paymentKeys;
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
  builtOperations.operations.push(builtDelegationOperation);
  console.log(JSON.stringify(builtOperations.operations));
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
  .then(() => logger.info("Stake Delegation finished"))
  .catch(console.error);
