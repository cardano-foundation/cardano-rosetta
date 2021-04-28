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
} from "./commons";
const logger = console;

const PAYMENT_ADDRESS =
  "addr_test1qpzu48r4qv85a4meuxjjentanh4389cuefx07uqdvyq0lmg85v9kxr57rn7fy0jvlte69gjekwlu74240lxgpatsegjsa93kqf";
const SEND_FUNDS_ADDRESS =
  "addr1qqr585tvlc7ylnqvz8pyqwauzrdu0mxag3m7q56grgmgu7sxu2hyfhlkwuxupa9d5085eunq2qywy7hvmvej456flknsug829n";
const WITHDRAWAL_AMOUNT = "513664403";

const PAYMENT_KEYS = {
  secretKey: Buffer.from(
    "a25e7990c35b84ee4ef8dbfa2fabab6f7a39c0424ca0b8aaf0e26af50b0f3218bd3a406e3d5d6bdde69de1b19b14305b87378aba3525dfe14f49620900bbd7a7",
    "hex"
  ),
  publicKey: Buffer.from(
    "bd3a406e3d5d6bdde69de1b19b14305b87378aba3525dfe14f49620900bbd7a7",
    "hex"
  ),
};

const STAKING_KEYS = {
  secretKey: Buffer.from(
    "5279a3b4697bd4ddb9255ba7f03fad5556f18a134ad4564baac693a4a4939003ab872cec116c85468bb12d78629e2190dc8a014447907f9669601d9669a81333",
    "hex"
  ),
  publicKey: Buffer.from(
    "ab872cec116c85468bb12d78629e2190dc8a014447907f9669601d9669a81333",
    "hex"
  ),
};
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
    SEND_FUNDS_ADDRESS
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
