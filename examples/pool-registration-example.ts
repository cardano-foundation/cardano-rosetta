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
  generateKeys,
  signPayloads,
  waitForBalanceToBe,
  buildOperation,
} from "./commons";
const logger = console;

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

// staking keys
const stakeAddress =
  "stake_test1uzm2t6xd7pqq8wk6wngrqxul0hjeqphf8dl5glfudk77u7czj5qk0";

const stakingKeys = {
  secretKey: Buffer.from(
    "e3b26eccf92f0b58377a8176829ac1ba8ddcdc3996a777defef4db297de9397a262ebd72a95c40ed6c779651bb1c7a76ab8f2ebafd4c3b9aa8daca5b9de7a257",
    "hex"
  ),
  publicKey: Buffer.from(
    "262ebd72a95c40ed6c779651bb1c7a76ab8f2ebafd4c3b9aa8daca5b9de7a257",
    "hex"
  ),
};

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

// owner staking keys
const ownerAddress =
  "stake_test1uzly0q2cnpxrjrqm9vpnr9dwkr0j945gulhhgs3dx33l47sfnz8a7";

const ownerKeys = {
  secretKey: Buffer.from(
    "36fd67052b79b46425054d57d82da2f0f2e2dc5c5d4dcbeb9b244fca8ac74c7eacc912f01c207532754f4d47c853e87a8950b788f8dfa0c8d1dfd2a564760a83",
    "hex"
  ),
  publicKey: Buffer.from(
    "acc912f01c207532754f4d47c853e87a8950b788f8dfa0c8d1dfd2a564760a83",
    "hex"
  ),
};

const buildPoolRegistrationOperation = (
  rewardAddress: string,
  currentIndex: number,
  poolKeyHash: string
) => ({
  operation_identifier: { index: currentIndex + 1 },
  type: "poolRegistration",
  status: "success",
  account: { address: poolKeyHash },
  metadata: {
    poolRegistrationParams: {
      vrfKeyHash:
        "9586F48442694EF028BCF67605B4EF650AB9F0F1CD81E181D2DB8D9D5A387E84",
      rewardAddress: rewardAddress,
      pledge: "4000000",
      cost: "340000000",
      poolOwners: [ownerAddress],
      relays: [
        {
          type: "multi_host_name",
          dnsName: "relays-new.cardano-testnet.iohkdev.io",
        },
      ],
      margin: {
        numerator: "1",
        denominator: "1",
      },
    },
  },
});

const doRun = async (): Promise<void> => {
  const keyAddressMapper = {};
  const stakingPublicKey = Buffer.from(stakingKeys.publicKey).toString("hex");

  keyAddressMapper[stakeAddress] = stakingKeys;
  keyAddressMapper[ownerAddress] = ownerKeys;
  keyAddressMapper[POOL_KEY_HASH] = coldKeys;

  // const paymentKeys = generateKeys();
  // logger.info(
  //   `[doRun] secretKey ${Buffer.from(paymentKeys.secretKey).toString("hex")}`
  // );
  // const paymentPublicKey = Buffer.from(paymentKeys.publicKey).toString("hex");

  // const paymentAddress = await constructionDerive(
  //   paymentPublicKey,
  //   "Base",
  //   stakingPublicKey
  // );

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
    true,
    45 // outputs percentage of total inputs
  );
  const currentIndex = builtOperations.operations.length - 1;
  const builtRegistrationOperation = buildRegistrationOperation(
    stakingPublicKey,
    currentIndex
  );
  const builtDelegationOperation = buildDelegationOperation(
    stakingPublicKey,
    currentIndex + 1,
    POOL_KEY_HASH
  );
  const builtPoolRegistrationOperation = buildPoolRegistrationOperation(
    stakeAddress,
    currentIndex + 2,
    POOL_KEY_HASH
  );
  builtOperations.operations.push(builtRegistrationOperation);
  builtOperations.operations.push(builtPoolRegistrationOperation);
  builtOperations.operations.push(builtDelegationOperation);
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
