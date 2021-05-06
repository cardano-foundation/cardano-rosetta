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
    "9f3a28abb4d964f9cde42d39957870ef119cfb90e6e2748bf094a904940ed30c2c6ddc4db68547e4e39dd04828c23325ec9768aeaa6ad3cc98b909af5f3e67c3",
    "hex"
  ),
  publicKey: Buffer.from(
    "2c6ddc4db68547e4e39dd04828c23325ec9768aeaa6ad3cc98b909af5f3e67c3",
    "hex"
  ),
};

const POOL_KEY_HASH =
  "1b917c6a73c2399c9b07f2ca2c529a4b49dc5f5aa96336c1ace5afdb";

// staking keys
const stakeAddress =
  "stake_test1uz0tcpxdntxw3p6xr2m9dfqgzny45k2ktuly3ff84wtz6lgvaatf9";

const stakingKeys = {
  secretKey: Buffer.from(
    "ffe5fb76c8d65ad95d26001c3ff13b1d2e6926d6b85d1a9f09a3edecac1df352aea0676d28c9191b99e5605f26f1dc256ce7aa0c9d9b61383d9fbc64f05eb733",
    "hex"
  ),
  publicKey: Buffer.from(
    "aea0676d28c9191b99e5605f26f1dc256ce7aa0c9d9b61383d9fbc64f05eb733",
    "hex"
  ),
};

// owner staking keys
const ownerAddress =
  "stake_test1urq8pshmhv973rgydrhvfkz0zags9kxeppxh2uvj3568ruqpuz8rx";

const ownerKeys = {
  secretKey: Buffer.from(
    "44c851b6bac8c1b80ce13c51ad792a9afbeee671fc4b16efd73c3a0d71a0ab223c1a0a04fa3ed24af8002aaac15ad6e36b672a0f2ef972fd857e1bee90489134",
    "hex"
  ),
  publicKey: Buffer.from(
    "3c1a0a04fa3ed24af8002aaac15ad6e36b672a0f2ef972fd857e1bee90489134",
    "hex"
  ),
};

// owner two staking keys
const ownerTwoAddress =
  "stake_test1uzxzv442nj7c0rld7s4kcq3uknlkph58g57keac5xrcx9qqh44dzh";

const ownerTwoKeys = {
  secretKey: Buffer.from(
    "597553330bca9065d2e533bd32f6bde651435f4e1736d6bacfe6bf4c860a83f8ca3e53e47c5fc715e1c8b6923d1b68009fe588db5424a52b3bd87395449d6242",
    "hex"
  ),
  publicKey: Buffer.from(
    "ca3e53e47c5fc715e1c8b6923d1b68009fe588db5424a52b3bd87395449d6242",
    "hex"
  ),
};

// pool cert
const POOL_REGISTRATION_CERT =
  "8a03581c1b917c6a73c2399c9b07f2ca2c529a4b49dc5f5aa96336c1ace5afdb582074511e297e8d8670729af5a4eb08ff8b49f0247f1100f28ce5599b44f07b57b41b000000ba22eeea801a1443fd00d81e820101581de09ebc04cd9acce887461ab656a40814c95a59565f3e48a527ab962d7d82581cc070c2fbbb0be88d0468eec4d84f175102d8d9084d7571928d3471f0581c8c2656aa9cbd878fedf42b6c023cb4ff60de87453d6cf71430f06280818202782872656c6179732e63617264616e6f2d6c61756e63687061642e636861696e6372756369616c2e696ff6";

const buildPoolRegistrationWithCertOperation = (
  currentIndex: number,
  poolKeyHash: string,
  poolCert: string
) => ({
  operation_identifier: { index: currentIndex + 1 },
  type: "poolRegistrationWithCert",
  status: "success",
  account: { address: poolKeyHash },
  metadata: {
    poolRegistrationCert: poolCert,
  },
});

const doRun = async (): Promise<void> => {
  const keyAddressMapper = {};
  const stakingPublicKey = Buffer.from(stakingKeys.publicKey).toString("hex");

  keyAddressMapper[stakeAddress] = stakingKeys;
  keyAddressMapper[ownerAddress] = ownerKeys;
  keyAddressMapper[ownerTwoAddress] = ownerTwoKeys;
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
  const builtPoolRegistrationOperation = buildPoolRegistrationWithCertOperation(
    currentIndex + 2,
    POOL_KEY_HASH,
    POOL_REGISTRATION_CERT
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
  .then(() => logger.info("Pool Registration With Cert finished"))
  .catch(console.error);
