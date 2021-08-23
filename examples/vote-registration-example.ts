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
const STAKING_PUBLIC_KEY =
  "86870efc99c453a873a16492ce87738ec79a0ebd064379a62e2c9cf4e119219e";
const REWARD_ADDRESS =
  "stake_test1uzhr5zn6akj2affzua8ylcm8t872spuf5cf6tzjrvnmwemcehgcjm";
const VOTING_PUBLIC_KEY =
  "0036ef3e1f0d3f5989e2d155ea54bdb2a72c4c456ccb959af4c94868f473f5a0";
const VOTING_NONCE = 2854355;
const VOTING_SIGNATURE =
  "a4552118506696de13da2db9d58549fa274b4d988967a939dc3fc886fc145bdc310ef10234ef5260de2e967d13c9f244342817472acb4cd4aaba47ad1086d102";

const buildVoteOperation = (
  stakingKey: string,
  rewardAddress: string,
  votingKey: string,
  votingSignature: string,
  votingNonce: number,
  currentIndex: number
) => ({
  operation_identifier: {
    index: currentIndex + 1,
  },
  type: "voteRegistration",
  status: "success",
  metadata: {
    voteRegistrationMetadata: {
      rewardAddress,
      stakeKey: {
        hex_bytes: stakingKey,
        curve_type: "edwards25519",
      },
      votingKey: {
        hex_bytes: votingKey,
        curve_type: "edwards25519",
      },
      votingNonce,
      votingSignature,
    },
  },
});

const doRun = async (): Promise<void> => {
  const keyAddressMapper = {};
  const paymentKeys = generateKeys(PRIVATE_KEY);
  logger.info(
    `[doRun] payment secretKey ${Buffer.from(paymentKeys.secretKey).toString(
      "hex"
    )}`
  );
  const paymentAddress = await constructionDerive(
    Buffer.from(paymentKeys.publicKey).toString("hex")
  );

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
    false
  );
  const currentIndex = builtOperations.operations.length - 1;
  const builtVoteOperation = buildVoteOperation(
    STAKING_PUBLIC_KEY,
    REWARD_ADDRESS,
    VOTING_PUBLIC_KEY,
    VOTING_SIGNATURE,
    VOTING_NONCE,
    currentIndex
  );
  builtOperations.operations.push(builtVoteOperation);
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
  .then(() => logger.info("Vote Registration finished"))
  .catch(console.error);
