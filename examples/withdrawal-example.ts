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
  buildOperation, getStakeKeys, getPaymentKeys,
} from "./commons";
import {vars} from "./variables";
const logger = console;


const WITHDRAWAL_AMOUNT = "513664403";

const PAYMENT_KEYS = getPaymentKeys();

const STAKING_KEYS = getStakeKeys();
const STAKE_ADDRESS =
  "stake_test1uqr6xzmrp60pelyj8ex04uaz5fvm8070242hlnyq74cv5fgvvwrpp";

const buildWithdrawalOperation = (
  stakingKey: string,
  currentIndex: number
) => ({
  operation_identifier: {
    index: currentIndex + 1,
  },
  type: "withdrawal",
  status: "success",
  amount: {
    value: WITHDRAWAL_AMOUNT,
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
  const PAYMENT_ADDRESS  = await constructionDerive(
      PAYMENT_KEYS.publicKey.to_raw_key().to_hex(),
      "Base",
      STAKING_KEYS.publicKey.to_raw_key().to_hex()
  );

  logger.info(`[doRun] payment address is ${PAYMENT_ADDRESS}`);
  logger.info(`[doRun] staking address is ${STAKE_ADDRESS}`);

  const keyAddressMapper = {};
  const stakingPublicKey = Buffer.from(STAKING_KEYS.publicKey).toString("hex");
  keyAddressMapper[STAKE_ADDRESS] = STAKING_KEYS;
  keyAddressMapper[PAYMENT_ADDRESS] = PAYMENT_KEYS;
  const { unspents, balances } = await waitForBalanceToBe(
    PAYMENT_ADDRESS,
    (response) => response.coins.length !== 0
  );
  const builtOperations = buildOperation(
    unspents,
    balances,
    PAYMENT_ADDRESS,
    vars.SEND_FUNDS_ADDRESS
  );
  const currentIndex = builtOperations.operations.length - 1;
  const builtWithdrawalOperation = buildWithdrawalOperation(
    stakingPublicKey,
    currentIndex
  );
  builtOperations.operations.push(builtWithdrawalOperation);
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
  .then(() => logger.info("Withdrawal finished"))
  .catch(console.error);
