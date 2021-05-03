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
  generateKeys,
} from "./commons";
const logger = console;

const SEND_FUNDS_ADDRESS =
  "addr1qqr585tvlc7ylnqvz8pyqwauzrdu0mxag3m7q56grgmgu7sxu2hyfhlkwuxupa9d5085eunq2qywy7hvmvej456flknsug829n";
const keys = {
  publicKey: Buffer.from(
    "dacc560aed9739c1dda740409b2afaefbbbaf570c740b7ba7aee4dfcd456bf78",
    "hex"
  ),
  secretKey: Buffer.from(
    "e8bc43076146116a9ea3432c99ad504a28eb1412d3a4f900609fcebd60e1a45ecfafbb93a73dbae1c4c66241b45526201932a380ca059dbb70096433a132b4a4",
    "hex"
  ),
};
// Byron address corresponding to previous keys
const address = '2cWKMJemoBaixGk8fx6VPVidMFjx2jg7Kn6AX1BFtqr7oXaSPdgdY7UvFiFvNgq9tJmki';

const doRun = async (): Promise<void> => {
  const keyAddressMapper = {};
  keyAddressMapper[address] = keys;
  const { unspents, balances } = await waitForBalanceToBe(
    address,
    (response) => response.coins.length !== 0
  );
  const builtOperations = buildOperation(
    unspents,
    balances,
    address,
    SEND_FUNDS_ADDRESS
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
  logger.info(
    `[doRun] transaction with hash ${hashResponse.transaction_identifier.hash} sent`
  );
  await waitForBalanceToBe(address, (response) => response.coins.length === 0);
};

doRun()
  .then(() => logger.info("Send Transaction finished"))
  .catch(console.error);
