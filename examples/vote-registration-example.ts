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
  generateKeys, getPaymentKeys, getStakeKeys,
} from "./commons";
import {vars} from "./variables";
const logger = console;

// TODO create rewards adress
const REWARD_ADDRESS =
  "stake_test1uzhr5zn6akj2affzua8ylcm8t872spuf5cf6tzjrvnmwemcehgcjm";

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
  const stakeKeys = getStakeKeys();
  const paymentKeys = getPaymentKeys();
  console.log(stakeKeys.publicKey.to_raw_key().to_hex());
  console.log(paymentKeys.publicKey.to_hex());
  const keyAddressMapper = {};

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
    vars.SEND_FUNDS_ADDRESS,
    false
  );
  const currentIndex = builtOperations.operations.length - 1;
  const builtVoteOperation = buildVoteOperation(
    stakeKeys.publicKey.to_hex(),
    REWARD_ADDRESS,
    vars.VOTING_PUBLIC_KEY,
    vars.VOTING_SIGNATURE,
    vars.VOTING_NONCE,
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
