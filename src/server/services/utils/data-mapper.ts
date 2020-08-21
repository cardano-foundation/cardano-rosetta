/* eslint-disable camelcase */
import cbor from 'cbor';

import { UnsignedTransaction } from '../cardano-services';
import { SIGNATURE_TYPE } from '../../utils/constants';

export const COIN_SPENT_ACTION = 'coin_spent';
export const COIN_CREATED_ACTION = 'coin_created';

interface TransactionExtraData {
  account: Components.Schemas.AccountIdentifier | undefined;
  amount: Components.Schemas.Amount | undefined;
}

/**
 * It maps the transaction body and the addresses to the Rosetta's SigningPayload
 * @param transactionBodyHash
 * @param addresses
 */
const constructPayloadsForTransactionBody = (
  transactionBodyHash: string,
  addresses: string[]
): Components.Schemas.SigningPayload[] =>
  addresses.map(address => ({ address, hex_bytes: transactionBodyHash, signature_type: SIGNATURE_TYPE }));

/**
 * Encodes a standard Cardano unsigned transction alongisde with rosetta-required extra data.
 * CBOR is used as it's the Cardano default encoding
 *
 * @param unsignedTransaction
 * @param extraData
 * @returns hex encoded unsigned transaction
 */
const encodeUnsignedTransaction = async (
  unsignedTransaction: UnsignedTransaction,
  extraData: TransactionExtraData[]
): Promise<string> => {
  const encoded = await cbor.encodeAsync([unsignedTransaction.bytes, extraData]);
  return encoded.toString('hex');
};

/**
 * Maps an unsigned transaction to transaction payloads.
 *
 * As Cardano is a UTXO based blockchain, some information is being lost
 * when transaction is encoded. More precisely, input's account and amount
 * are not encoded (as it only requires a txid and the output number to be spent).
 *
 * It might not be a problem although `rosetta-cli` requires this information to
 * be present when invoking `/construction/parse` so it needs to be added to our
 * responses.
 *
 * See https://community.rosetta-api.org/t/implementing-the-construction-api-for-utxo-model-coins/100/3
 *
 * @param unsignedTransaction
 * @param operations to be encoded alongside with the transaction
 */
export const mapToPayloads = async (
  unsignedTransaction: UnsignedTransaction,
  operations: Components.Schemas.Operation[]
): Promise<Components.Schemas.ConstructionPayloadsResponse> => {
  const payloads = constructPayloadsForTransactionBody(unsignedTransaction.hash, unsignedTransaction.addresses);
  // extra data to be encoded
  const extraData: TransactionExtraData[] = operations
    .filter(operation => operation.coin_change?.coin_action === COIN_SPENT_ACTION)
    .map(operation => ({ account: operation.account, amount: operation.amount }));

  return {
    unsigned_transaction: await encodeUnsignedTransaction(unsignedTransaction, extraData),
    payloads
  };
};
