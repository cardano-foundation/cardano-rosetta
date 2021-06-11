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
  waitForBalanceToBe,
  buildOperation,
} from "./commons";
import * as CardanoWasm from "@emurgo/cardano-serialization-lib-nodejs";
import * as Bip39 from "bip39";
const logger = console;

function harden(num: number): number {
  return 0x80000000 + num;
}

const mnemonic =
  "gasp below arrange frown canvas heart pet hole lunar card matter mom very bounce rug tobacco debris raw margin assist source also tuition cluster";

const SEND_FUNDS_ADDRESS =
  "addr1qqr585tvlc7ylnqvz8pyqwauzrdu0mxag3m7q56grgmgu7sxu2hyfhlkwuxupa9d5085eunq2qywy7hvmvej456flknsug829n";

const doRun = async (): Promise<void> => {
  const entropy = Bip39.mnemonicToEntropy(mnemonic);
  // See https://github.com/cardano-foundation/CIPs/blob/master/CIP-1852/CIP-1852.md
  // The code is based on https://github.com/Emurgo/cardano-serialization-lib/blob/2c21b9d9afad3f90865ea85a2330f491aa019786/example/index.spec.ts#L26
  const account = CardanoWasm.Bip32PrivateKey.from_bip39_entropy(
    Buffer.from(entropy, "hex"),
    Buffer.from("")
  )
    .derive(harden(1852))
    .derive(harden(1815))
    .derive(harden(0)); // account #0

  const bip32PrivKey = account.derive(0).derive(0);

  const pubKey = bip32PrivKey.to_public().to_raw_key().as_bytes();

  const pubKeyAsHex = Buffer.from(pubKey).toString("hex");
  const address = await constructionDerive(pubKeyAsHex);
  // keyAddressMapper[address] = keys;
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
  const signatures = payloads.payloads.map((signing_payload: any) => {
    const {
      account_identifier: { address },
    } = signing_payload;
    return {
      signing_payload,
      public_key: {
        hex_bytes: pubKeyAsHex,
        curve_type: "edwards25519",
      },
      signature_type: "ed25519",
      hex_bytes: Buffer.from(
        CardanoWasm.make_vkey_witness(
          CardanoWasm.TransactionHash.from_bytes(
            Buffer.from(signing_payload.hex_bytes, "hex")
          ),
          bip32PrivKey.to_raw_key()
        )
          .signature()
          .to_bytes()
      ).toString("hex"),
    };
  });

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
