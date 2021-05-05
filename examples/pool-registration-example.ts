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
    "e1a37517351be84cc54bb34fcb31064fb0a7648c7f20e08ce872e082a943360e55ad29a820ecb70f5b49557f566f6635b4258a1c4a8a2039ce71f703deec698b",
    "hex"
  ),
  publicKey: Buffer.from(
    "55ad29a820ecb70f5b49557f566f6635b4258a1c4a8a2039ce71f703deec698b",
    "hex"
  ),
};

const POOL_KEY_HASH =
  "138864a67cbf60d7a70eceb814b749711df2af65a6ba5512efad68f2";

// staking keys
const stakeAddress =
  "stake_test1uqwzh620u8rrzckxs66xgt9v35hv3qfjnq3suxhpzdyc9aqwkdr0e";

const stakingKeys = {
  secretKey: Buffer.from(
    "2fa32eeaf905c3c4083ed8caac87e925e629bd038fb09b605091c105425cb04038b132eb550d1eb7d5645d04d2c7e7c554cfd2b7663211049183a8b0a01554d0",
    "hex"
  ),
  publicKey: Buffer.from(
    "38b132eb550d1eb7d5645d04d2c7e7c554cfd2b7663211049183a8b0a01554d0",
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

// vrf key hash
const VRF_KEY_HASH = "9586F48442694EF028BCF67605B4EF650AB9F0F1CD81E181D2DB8D9D5A387E84";

const buildPoolRegistrationOperation = (
  rewardAddress: string,
  currentIndex: number,
  poolKeyHash: string,
  vrfKeyHash: string
) => ({
  operation_identifier: { index: currentIndex + 1 },
  type: "poolRegistration",
  status: "success",
  account: { address: poolKeyHash },
  metadata: {
    poolRegistrationParams: {
      vrfKeyHash: vrfKeyHash,
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
    POOL_KEY_HASH,
    VRF_KEY_HASH
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
