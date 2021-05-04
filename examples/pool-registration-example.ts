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
    "45ad0a9123f966e5d584140c1fe49d8f8430ee9f55c8c4177bdf632191dca496cb18b6cb54eb79376134cd6c19f8d4bf2f9dfe1503d53547c4f8800897b50d3a",
    "hex"
  ),
  publicKey: Buffer.from(
    "cb18b6cb54eb79376134cd6c19f8d4bf2f9dfe1503d53547c4f8800897b50d3a",
    "hex"
  ),
};

const POOL_KEY_HASH =
  "1677d50dcecc49c58bdad62cf2ad9bef6e7adb8a722665c11a0cfec2";

// staking keys
const stakeAddress =
  "stake_test1uqjy86pepurr07029f0pnjh8pld2pkey5qk3wxrthve6wrsrre4cp";

const stakingKeys = {
  secretKey: Buffer.from(
    "24dc9e946a6242f6571e0f2cda0193afaf93bf4a30a4211970d3f83695874a6e99ddae6333170907688233365ab90470adc34812482b93268019935cfcec0a67",
    "hex"
  ),
  publicKey: Buffer.from(
    "99ddae6333170907688233365ab90470adc34812482b93268019935cfcec0a67",
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

  const paymentKeys = generateKeys();
  logger.info(
    `[doRun] secretKey ${Buffer.from(paymentKeys.secretKey).toString("hex")}`
  );
  const paymentPublicKey = Buffer.from(paymentKeys.publicKey).toString("hex");

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
