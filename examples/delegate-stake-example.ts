/* eslint-disable no-magic-numbers */
/* eslint-disable camelcase */
/* eslint-disable new-cap */
/* eslint-disable no-console */
import {
  buildDelegationOperation,
  buildRegistrationOperation,
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

const SEND_FUNDS_ADDRESS =
  "addr_test1qqr585tvlc7ylnqvz8pyqwauzrdu0mxag3m7q56grgmgu7sxu2hyfhlkwuxupa9d5085eunq2qywy7hvmvej456flknswgndm3";
const STAKE_POOL_KEY_HASH =
  "6be215192dc01e5ca4cfba0959586f581a865bfccc2984478dad1657";

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
  const builtRegistrationOperation = buildRegistrationOperation(
    stakingPublicKey,
    currentIndex
  );
  const builtDelegationOperation = buildDelegationOperation(
    stakingPublicKey,
    currentIndex + 1,
    STAKE_POOL_KEY_HASH
  );
  builtOperations.operations.push(builtRegistrationOperation);
  builtOperations.operations.push(builtDelegationOperation);
  logger.info(`[doRun] operations to be sent are ${JSON.stringify(builtOperations.operations)}`);
  const preprocess = await constructionPreprocess(
    builtOperations.operations,
    1000
  );
  const metadata = await constructionMetadata(preprocess);
  const payloads = await constructionPayloads({
    operations: builtOperations.operations,
    metadata
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
