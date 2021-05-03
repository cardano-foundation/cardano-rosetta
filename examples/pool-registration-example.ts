/* eslint-disable no-magic-numbers */
/* eslint-disable camelcase */
/* eslint-disable new-cap */
/* eslint-disable no-console */
import {
  buildDelegationOperation,
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

const coldKeys = {
  privateKey: Buffer.from(
    "4e14d6b87dc1c2fb2b077dd3a861f8e2966793285dbf069aab9559f11a54d615969c8ef677173916b06d366617c895c6667f49fe014a9498b280aa22e7a15bc2",
    "hex"
  ),
  publicKey: Buffer.from(
    "969c8ef677173916b06d366617c895c6667f49fe014a9498b280aa22e7a15bc2",
    "hex"
  ),
};
const POOL_KEY_HASH =
  "ef776aeaf431fb31a90e58d0d5cf7b891dbdeb3116f51dd6483591d1";

const REWARD_ADDRESS =
  "e0734ea1bff2690fd8d2439584c549eb5da51e450f4d6e5c8210bb828f";

const stakingKeys = {
  privateKey: Buffer.from(
    "bff0aa615cde3494d55a7aeffca9c6b1737e9304f96447250183f9b1a6b9fb5d91af9ec2ca3b1e62416f1aaa22a75446deb113526906d14fa766f57481c2979e",
    "hex"
  ),
  publicKey: Buffer.from(
    "91af9ec2ca3b1e62416f1aaa22a75446deb113526906d14fa766f57481c2979e",
    "hex"
  ),
};

const paymentKeys = {
  privateKey: Buffer.from(
    "d7f9df87b5cd44e979bafb007b882c40c970d429e37d90b5dbaca40344f5e5777de218220642953feeff2f0f52dc1bdcc1fb5da08e0a5c9616cda23f7fd18992",
    "hex"
  ),
  publicKey: Buffer.from(
    "7de218220642953feeff2f0f52dc1bdcc1fb5da08e0a5c9616cda23f7fd18992",
    "hex"
  ),
};

const OWNER_ADDRESS = 'e0be478158984c390c1b2b033195aeb0df22d688e7ef74422d3463fafa';
const ownerAddress = 'stake_test1uzly0q2cnpxrjrqm9vpnr9dwkr0j945gulhhgs3dx33l47sfnz8a7';


const ownerKeys = {
  privateKey: Buffer.from(
    "36fd67052b79b46425054d57d82da2f0f2e2dc5c5d4dcbeb9b244fca8ac74c7eacc912f01c207532754f4d47c853e87a8950b788f8dfa0c8d1dfd2a564760a83",
    "hex"
  ),
  publicKey: Buffer.from(
    "acc912f01c207532754f4d47c853e87a8950b788f8dfa0c8d1dfd2a564760a83",
    "hex"
  ),
};

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
      pledge: "0",
      cost: "340000000",
      poolOwners: ['e0be478158984c390c1b2b033195aeb0df22d688e7ef74422d3463fafa'],
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
  const paymentPublicKey = Buffer.from(paymentKeys.publicKey).toString("hex");

  const stakingPublicKey = Buffer.from(stakingKeys.publicKey).toString("hex");
  const stakeAddress =
    "stake_test1upe5agdl7f5slkxjgw2cf32fadw628j9paxkuhyzzzac9rcatcdje";
  logger.info(`[doRun] stake address is ${stakeAddress}`);
  keyAddressMapper[stakeAddress] = stakingKeys;
  keyAddressMapper[ownerAddress] = ownerKeys;
  keyAddressMapper[POOL_KEY_HASH] = coldKeys;

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
    45
  );
  const currentIndex = builtOperations.operations.length - 1;
  const builtRegistrationOperation = buildRegistrationOperation(
    stakingPublicKey,
    currentIndex
  );
  const builtPoolRegistrationOperation = buildPoolRegistrationOperation(
    REWARD_ADDRESS,
    currentIndex,
    POOL_KEY_HASH
  );
  builtOperations.operations.push(builtRegistrationOperation);
  builtOperations.operations.push(builtPoolRegistrationOperation);
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
