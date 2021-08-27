import { OperationType, CatalystLabels } from '../../utils/constants';

const coinsQuery = '';
const currenciesQuery = '';

const findTransactionsWithInputs = `
    SELECT 
        tx.hash
    FROM tx
    JOIN tx_in
        ON tx_in.tx_in_id = tx.id
    JOIN tx_out as source_tx_out
        ON tx_in.tx_out_id = source_tx_out.tx_id
        AND tx_in.tx_out_index = source_tx_out.index
    JOIN tx as source_tx
        ON source_tx_out.tx_id = source_tx.id
`;

const findTransactionsWithOutputs = `
    SELECT
        tx.hash
    FROM tx
    JOIN tx_out
        ON tx.id = tx_out.tx_id
`;

const findTransactionsWithPoolRegistrations = `
    SELECT
        tx.hash,
    FROM pool_update pu
    JOIN tx 
        ON pu.registered_tx_id = tx.id
    JOIN pool_hash ph
        ON ph.id = pu.hash_id
`;

const findTransactionsWithPoolRetirements = `
    SELECT 
        tx.hash
    FROM pool_retire pr 
    JOIN pool_hash ph 
        ON pr.hash_id = ph.id
    JOIN tx
        ON tx.id = pr.announced_tx_id
`;

const findTransactionsWithDelegations = `
    SELECT 
        tx.hash
    FROM delegation d
    JOIN stake_address sa
        ON d.addr_id = sa.id
    JOIN pool_hash ph
        ON d.pool_hash_id = ph.id
    JOIN tx
        ON d.tx_id = tx.id
`;

const findTransactionsWithKeyDeregistrations = `
    SELECT 
        tx.hash
    FROM stake_deregistration sd
    JOIN stake_address sa
        ON sd.addr_id = sa.id
    JOIN tx
        ON tx.id = sd.tx_id
`;

const findTransactionsWithKeyRegistrations = `
    SELECT 
        tx.hash
    FROM stake_registration sr
    JOIN tx on tx.id = sr.tx_id
    JOIN stake_address sa on sr.addr_id = sa.id
`;

const findTransactionsWithVoteRegistrations = `
WITH metadata AS (
    SELECT
      metadata.json,
      metadata.key,
      tx.hash AS tx_hash,
      tx.id AS tx_id
    FROM tx_metadata AS metadata
    JOIN tx
      ON tx.id = metadata.tx_id
    WHERE tx.hash = ANY($1)
    ),
    metadata_data AS (
      SELECT 
        json AS data,
        metadata.tx_hash,
        metadata.tx_id
      FROM metadata
      WHERE key = ${CatalystLabels.DATA}
    ),
    metadata_sig AS (
      SELECT 
        json AS signature,
        metadata.tx_hash,
        metadata.tx_id
      FROM metadata
      WHERE key = ${CatalystLabels.SIG}
    )
    SELECT 
      metadata_data.tx_hash AS hash
    FROM metadata_data
    INNER JOIN metadata_sig
      ON metadata_data.tx_id = metadata_sig.tx_id
`;

const findTransactionsWithWithdrawals = `
    SELECT 
        tx.hash
    FROM withdrawal w
    JOIN tx on w.tx_id = tx.id
    JOIN stake_address sa on w.addr_id = sa.id
`;

const queryTypeMapping: { [type: string]: string } = {
  [OperationType.INPUT]: findTransactionsWithInputs,
  [OperationType.OUTPUT]: findTransactionsWithOutputs,
  [OperationType.POOL_REGISTRATION]: findTransactionsWithPoolRegistrations,
  [OperationType.POOL_REGISTRATION_WITH_CERT]: findTransactionsWithPoolRegistrations,
  [OperationType.POOL_RETIREMENT]: findTransactionsWithPoolRetirements,
  [OperationType.STAKE_DELEGATION]: findTransactionsWithDelegations,
  [OperationType.STAKE_KEY_DEREGISTRATION]: findTransactionsWithKeyDeregistrations,
  [OperationType.STAKE_KEY_REGISTRATION]: findTransactionsWithKeyRegistrations,
  [OperationType.VOTE_REGISTRATION]: findTransactionsWithVoteRegistrations,
  [OperationType.WITHDRAWAL]: findTransactionsWithWithdrawals
};

const SearchQueries = {
  getQueryByType: (type: string) => queryTypeMapping[type]
};

export default SearchQueries;
