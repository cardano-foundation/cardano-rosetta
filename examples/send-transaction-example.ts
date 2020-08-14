/* eslint-disable no-magic-numbers */
/* eslint-disable camelcase */
/* eslint-disable new-cap */
/* eslint-disable no-console */
import delay from 'delay';
import * as NaCl from 'tweetnacl';
import axios from 'axios';

const logger = console;

const httpClient = axios.create({
  baseURL: 'http://localhost:8080'
});

const PRIVATE_KEY =
  '41d9523b87b9bd89a4d07c9b957ae68a7472d8145d7956a692df1a8ad91957a2c117d9dd874447f47306f50a650f1e08bf4bec2cfcb2af91660f23f2db912977';
const SEND_FUNDS_ADDRESS =
  'addr1qqr585tvlc7ylnqvz8pyqwauzrdu0mxag3m7q56grgmgu7sxu2hyfhlkwuxupa9d5085eunq2qywy7hvmvej456flknsug829n';

// FIXME: look for this using the service
const network_identifier = {
  blockchain: 'cardano',
  network: 'testnet'
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore https://github.com/nodejs/help/issues/2203#issuecomment-602552451
const generateKeys = (secretKey?: string) =>
  secretKey ? NaCl.sign.keyPair.fromSecretKey(Buffer.from(secretKey, 'hex')) : NaCl.sign.keyPair();

const constructionDerive = async (publicKey: string): Promise<string> => {
  logger.info(`[constructionDerive] Fetching an address for pub key ${publicKey}`);
  const response = await httpClient.post('/construction/derive', {
    network_identifier,
    public_key: {
      hex_bytes: publicKey,
      curve_type: 'edwards25519'
    },
    metadata: {}
  });
  const address = response.data.address;
  logger.debug(`[constructionDerive] Retrieved address ${address}`);
  return address;
};

const accountBalance = async (address: string) => {
  let fetchAccountBalance;
  do {
    const response = await httpClient.post('/account/balance', {
      network_identifier,
      account_identifier: {
        address
      }
    });
    if (response.data.coins.length === 0) {
      logger.debug('No unspent found, retrying in a few seconds');
      await delay(30 * 1000);
    } else {
      const [balance] = response.data.balances;
      logger.info(`[waitForFunds] Funds found! ${balance.value} ${balance.currency.symbol}`);
      fetchAccountBalance = response.data;
    }
  } while (!fetchAccountBalance);
  return fetchAccountBalance;
};

const constructionMetadata = async (relative_ttl: number) => {
  const response = await httpClient.post('/construction/metadata', { network_identifier, options: { relative_ttl } });
  return response.data.metadata;
};

const buildOperation = (unspents: any, metadata: any, address: string, destination: string) => {
  const inputs = unspents.coins.map((coin: any, index: number) => {
    const operation = {
      operation_identifier: {
        index,
        network_index: 0
      },
      related_operations: [],
      type: 'transfer',
      status: 'success',
      account: {
        address,
        metadata: {}
      },
      amount: coin.amount,
      coin_change: {
        coin_identifier: coin.coin_identifier,
        coin_action: 'coin_created'
      }
    };
    operation.amount.value = `-${operation.amount.value}`;
    return operation;
  });
  // TODO: No proper fees estimation is being done (it should be transaction size based)
  const totalBalance = BigInt(unspents.balances[0].value);
  const outputAmount = (totalBalance * BigInt(95)) / BigInt(100);
  const outputs = [
    {
      operation_identifier: {
        index: inputs.length,
        network_index: 0
      },
      related_operations: [],
      type: 'transfer',
      status: 'success',
      account: {
        address: destination,
        metadata: {}
      },
      amount: {
        value: outputAmount.toString(),
        currency: {
          symbol: 'ADA',
          decimals: 6
        },
        metadata: {}
      }
    }
  ];
  return {
    network_identifier,
    operations: inputs.concat(outputs),
    metadata
  };
};

const constructionPayloads = async (operations: any) => {
  const response = await httpClient.post('/construction/payloads', operations);
  return response.data;
};

const signPayloads = (payloads: any, keys: NaCl.SignKeyPair) =>
  payloads.map((signing_payload: any) => ({
    signing_payload,
    public_key: {
      hex_bytes: Buffer.from(keys.publicKey).toString('hex'),
      curve_type: 'edwards25519'
    },
    signature_type: 'ed25519',
    hex_bytes: Buffer.from(NaCl.sign.detached(Buffer.from(signing_payload.hex_bytes, 'hex'), keys.secretKey)).toString(
      'hex'
    )
  }));

const constructionCombine = async (unsigned_transaction: any, signatures: any) => {
  const response = await httpClient.post('/construction/combine', {
    network_identifier,
    unsigned_transaction,
    signatures
  });
  return response.data;
};

// TODO: uncomment when submit is done
// const constructionSubmit = async (signed_transaction: any) => {
//  const response = await httpClient.post('/construction/submit', {
//    network_identifier,
//    signed_transaction
//  });
//  return response.data;
// };

const doRun = async (): Promise<void> => {
  const keys = generateKeys(PRIVATE_KEY);
  logger.info(`[doRun] secretKey ${Buffer.from(keys.secretKey).toString('hex')}`);
  const address = await constructionDerive(Buffer.from(keys.publicKey).toString('hex'));
  const unspents = await accountBalance(address);
  const metadata = await constructionMetadata(1000);
  const operations = buildOperation(unspents, metadata, address, SEND_FUNDS_ADDRESS);
  const payloads = await constructionPayloads(operations);
  // TODO: PARSE
  const signatures = signPayloads(payloads.payloads, keys);
  const combined = await constructionCombine(payloads.unsigned_transaction, signatures);
  logger.info(`[doRun] signed transaction is ${combined.signed_transaction}`);
  // TODO: PARSE
  // TODO: Uncomment on https://github.com/input-output-hk/cardano-rosetta/pull/106
  // const hashResponse = await constructionSubmit(combined.signed_transaction);
  // logger.info(`[doRun] transaction with hash ${hashResponse.transaction_identifier.hash} sent`);
};

doRun()
  .then(() => logger.info('Send Transaction finished'))
  .catch(console.error);
