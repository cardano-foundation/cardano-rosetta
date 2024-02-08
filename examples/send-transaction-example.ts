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
  getPaymentPrivateKeyAsHex,
  getPaymentPrivateKey,
  getPaymentPublicKeyAsHex,
  getPaymentKeys,
  buildOperationsToPayAda,
  substractFee,
} from "./commons";
import { vars } from "./variables";
const logger = console;
/**
 * Test is using vars.PRIVATE_KEY and vars.SEND_FUNDS_ADDRESS
 */
const doRun = async (): Promise<void> => {
  if (vars.MNEMONIC == undefined || vars.SEND_FUNDS_ADDRESS == undefined) {
    logger.error(`Please set the MNEMONIC and SEND_FUNDS_ADDRESS in in variables.ts`);
  }

  const keyAddressMapper = {};
  const keys = getPaymentKeys();
  logger.info(
    `[doRun] secretKey ${Buffer.from(keys.secretKey.as_bytes()).toString("hex")}`
  );

  const address = await constructionDerive(
      Buffer.from(keys.publicKey.to_raw_key().as_bytes()).toString("hex")
  );
  keyAddressMapper[address] = keys;
  const { unspents, balances } = await waitForBalanceToBe(
    address,
    (response) => response.coins.length !== 0, // check if there are any coins
    (response) => Number(response.balances[0].value) > 0, // check if there is ADA
  );

  var builtOperations = buildOperationsToPayAda(
    unspents,
    balances,
    address,
    vars.SEND_FUNDS_ADDRESS,
      vars.LOVELACE_TO_SEND
  );
  const aaa = buildOperation(
      unspents,
      balances,
      address,
      vars.SEND_FUNDS_ADDRESS
  );
  console.log(aaa);
  const preprocess = await constructionPreprocess(
      builtOperations,
    10
  );
  const metadata = await constructionMetadata(preprocess);
  const suggestedFee = metadata.suggested_fee[0].value;
  builtOperations = substractFee(builtOperations, suggestedFee);

  const payloads = await constructionPayloads({
    operations: builtOperations,
    metadata: metadata.metadata,
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
