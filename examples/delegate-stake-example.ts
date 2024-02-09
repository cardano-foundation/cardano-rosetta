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
  generateKeys, getPaymentPrivateKey, getPaymentKeys, getStakeKeys, getPaymentPublicKeyAsHex,
} from "./commons";
import { vars } from "./variables";
const logger = console;


const doRun = async (): Promise<void> => {
  const keyAddressMapper = {};

  const paymentKeys = getPaymentKeys();
  logger.info(
    `[doRun] payment secretKey ${paymentKeys.secretKey.to_hex()}`
  );

  const stakingKeys = getStakeKeys();
  logger.info(
    `[doRun] staking secretKey ${stakingKeys.secretKey.to_hex()}`
  );
  const stakeAddress = await constructionDerive(stakingKeys.publicKey.to_raw_key().to_hex(), "Reward");

  logger.info(`[doRun] stake address is ${stakeAddress}`);

  keyAddressMapper[stakeAddress] = stakingKeys;

  const paymentAddress = await constructionDerive(
    paymentKeys.publicKey.to_raw_key().to_hex(),
    "Base",
    stakingKeys.publicKey.to_raw_key().to_hex()
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
  const builtRegistrationOperation = buildRegistrationOperation(
      stakingKeys.publicKey.to_raw_key().to_hex(),
    currentIndex
  );
  const builtDelegationOperation = buildDelegationOperation(
      stakingKeys.publicKey.to_raw_key().to_hex(),
    currentIndex + 1,
    vars.STAKE_POOL_KEY_HASH
  );
  builtOperations.operations.push(builtRegistrationOperation);
  builtOperations.operations.push(builtDelegationOperation);
  logger.info(`[doRun] operations to be sent are ${JSON.stringify(builtOperations.operations)}`);
  const preprocess = await constructionPreprocess(
    builtOperations.operations,
    100
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
