 #!/usr/bin/env bash

# As Cardano Rosetta is mostly some queries and data mapping it makes no sense to mock repository
# queries as, after that, it's just some data mapping nad that's it. In order to test our queries
# we can populate the test db with some real mainnet data. We are already importing a mainned snapshot
# but using a whole mainnet snapshot will be huge (+3GB) so, alternatively, we selecting and importing
# some blocks data. It's not an ideal solution as we need to relax some constraints to do so
# but still is better than inserting data manually. This script uses a similar process as 
# `pg_dump` using COPY statements
#
# This script helps dumping some information based on block ids.
#
# To run this file, grab a mainnet db-sync postgres db and execute
#
# $ bash dump_blocks.sh
#
# A resulting file like `fixture_data.sql` can then be either importer or compressed `tar` to be used
# in our e2e tests

OUT_FILE='/tmp/fixture_data.sql'
DB='cexplorer'

# Block Ids. Ideally we need to export them in batches of 3 as when we skip Epoch Boundary Blocks checking 3 blocks 
# before the one we are interested, so, if you are willing to fetch a block, please state B-2, B-1, B
# See: cardano-rosetta-server/src/server/db/queries/blockchain-queries.ts#findBlock
BLOCKS_TO_EXPORT="4877060,4877061,4877062,4619398,4490735,4490736,4490737" 
echo "-- Dumping blocks with id $BLOCKS_TO_EXPORT" > $OUT_FILE;

echo "ALTER TABLE public.block DISABLE TRIGGER ALL;" >> $OUT_FILE;
echo 'COPY public.block (id, hash, epoch_no, slot_no, epoch_slot_no, block_no, previous_id, merkel_root, slot_leader_id, size, "time", tx_count, proto_major, proto_minor, vrf_key, op_cert) FROM stdin WITH CSV;' >> $OUT_FILE
psql -c "\copy (SELECT * from block WHERE id in ($BLOCKS_TO_EXPORT)) to STDOUT WITH CSV" $DB >> $OUT_FILE;
echo "\." >> $OUT_FILE;

echo "-- Dumping transactions" >> $OUT_FILE;
echo "ALTER TABLE public.tx DISABLE TRIGGER ALL;" >> $OUT_FILE;
echo 'COPY public.tx (id, hash, block_id, block_index, out_sum, fee, deposit, size) FROM stdin WITH CSV;' >> $OUT_FILE;
psql -c "\copy (SELECT * from tx WHERE block_id in ($BLOCKS_TO_EXPORT)) to STDOUT WITH CSV" $DB >> $OUT_FILE;
echo "\." >> $OUT_FILE;

SELECT_TX_ID="(SELECT id from tx WHERE block_id IN ($BLOCKS_TO_EXPORT))"

echo "-- Dumping transaction inputs" >> $OUT_FILE;
echo "ALTER TABLE public.tx_in DISABLE TRIGGER ALL;" >> $OUT_FILE;
echo 'COPY public.tx_in (id, tx_in_id, tx_out_id, tx_out_index) FROM stdin WITH CSV;' >> $OUT_FILE;
psql -c "\copy (SELECT * from tx_in WHERE tx_in_id IN $SELECT_TX_ID) to STDOUT WITH CSV" $DB >> $OUT_FILE;
echo "\." >> $OUT_FILE;

# Inputs require the source tx to be able to compute the amount
# TODO: Check if this query can be imporved as it's a copy from the one we use to query the data
INPUT_TX_QUERY="
  tx
JOIN tx_in
  ON tx_in.tx_in_id = tx.id
JOIN tx_out as source_tx_out
  ON tx_in.tx_out_id = source_tx_out.tx_id
  AND tx_in.tx_out_index = source_tx_out.index
JOIN tx as source_tx
  ON source_tx_out.tx_id = source_tx.id
WHERE
  tx.id = ANY ($SELECT_TX_ID) AND
  source_tx.id NOT IN ($SELECT_TX_ID)
"
WITHDRAWAL_ADDRESSES_QUERY="
SELECT addr_id 
FROM withdrawal 
WHERE tx_id IN $SELECT_TX_ID"

REGISTRATION_ADDRESSES_QUERY="
SELECT addr_id 
FROM stake_registration 
WHERE tx_id IN $SELECT_TX_ID"

REWARD_ADDRESSES_QUERY="
SELECT addr_id
FROM reward 
WHERE block_id IN ($BLOCKS_TO_EXPORT)"

echo "-- Dumping transaction inputs references where spent outputs were defined" >> $OUT_FILE;
echo 'COPY public.tx (id, hash, block_id, block_index, out_sum, fee, deposit, size) FROM stdin WITH CSV;' >> $OUT_FILE;
psql -c "\copy (SELECT source_tx.* FROM $INPUT_TX_QUERY) to STDOUT WITH CSV" $DB >> $OUT_FILE;
echo "\." >> $OUT_FILE;

echo "ALTER TABLE public.tx_out DISABLE TRIGGER ALL;" >> $OUT_FILE;

echo "-- Dumping spent outputs" >> $OUT_FILE;
echo 'COPY public.tx_out (id, tx_id, index, address, address_raw, payment_cred, stake_address_id, value) FROM stdin WITH CSV;' >> $OUT_FILE;
psql -c "\copy (SELECT source_tx_out.* FROM $INPUT_TX_QUERY) to STDOUT WITH CSV" $DB >> $OUT_FILE;
echo "\." >> $OUT_FILE;

echo "-- Dumping transactions outputs" >> $OUT_FILE;
echo 'COPY public.tx_out (id, tx_id, index, address, address_raw, payment_cred, stake_address_id, value) FROM stdin WITH CSV;' >> $OUT_FILE;
psql -c "\copy (SELECT * from tx_out WHERE tx_id IN $SELECT_TX_ID) to STDOUT WITH CSV" $DB >> $OUT_FILE;
echo "\." >> $OUT_FILE;

echo "-- Dumping transactions withdrawals" >> $OUT_FILE;
echo "ALTER TABLE public.withdrawal DISABLE TRIGGER ALL;" >> $OUT_FILE;
echo 'COPY public.withdrawal (id, addr_id, amount, tx_id) FROM stdin WITH CSV;' >> $OUT_FILE;
psql -c "\copy (SELECT * from withdrawal WHERE tx_id IN $SELECT_TX_ID) to STDOUT WITH CSV" $DB >> $OUT_FILE;
echo "\." >> $OUT_FILE;

echo "-- Dumping Block transaction withdrawals stake addresses" >> $OUT_FILE;
echo "ALTER TABLE public.stake_address DISABLE TRIGGER ALL;" >> $OUT_FILE;
echo 'COPY public.stake_address (id, hash_raw, view, registered_tx_id) FROM stdin WITH CSV;' >> $OUT_FILE;
psql -c "\copy (SELECT * from stake_address WHERE id IN ($WITHDRAWAL_ADDRESSES_QUERY)) to STDOUT WITH CSV" $DB >> $OUT_FILE;
echo "\." >> $OUT_FILE;

echo "-- Dumping Block transactions stake_registrations" >> $OUT_FILE;
echo "ALTER TABLE public.stake_registration DISABLE TRIGGER ALL;" >> $OUT_FILE;
echo 'COPY public.stake_registration (id, addr_id, cert_index, tx_id) FROM stdin WITH CSV;' >> $OUT_FILE;
psql -c "\copy (SELECT * FROM stake_registration WHERE tx_id IN $SELECT_TX_ID) to STDOUT WITH CSV" $DB >> $OUT_FILE;
echo "\." >> $OUT_FILE;

echo "-- Dumping Block transactions stake_registrations stake addresses" >> $OUT_FILE;
echo "ALTER TABLE public.stake_address DISABLE TRIGGER ALL;" >> $OUT_FILE;
echo 'COPY public.stake_address (id, hash_raw, view, registered_tx_id) FROM stdin WITH CSV;' >> $OUT_FILE;
psql -c "\copy (SELECT * from stake_address WHERE id IN ($REGISTRATION_ADDRESSES_QUERY) AND id NOT IN ($WITHDRAWAL_ADDRESSES_QUERY)) to STDOUT WITH CSV" $DB >> $OUT_FILE;
echo "\." >> $OUT_FILE;

echo "-- Dumping Block rewards" >> $OUT_FILE;
echo "ALTER TABLE public.reward DISABLE TRIGGER ALL;" >> $OUT_FILE;
echo 'COPY public.reward (id, addr_id, amount, epoch_no, pool_id, block_id) FROM stdin WITH CSV;' >> $OUT_FILE;
psql -c "\copy (SELECT * from reward WHERE block_id in ($BLOCKS_TO_EXPORT)) to STDOUT WITH CSV" $DB >> $OUT_FILE;
echo "\." >> $OUT_FILE;

echo "-- Dumping Block rewards stake_addresses" >> $OUT_FILE;
echo "ALTER TABLE public.stake_address DISABLE TRIGGER ALL;" >> $OUT_FILE;
echo 'COPY public.stake_address (id, hash_raw, view, registered_tx_id) FROM stdin WITH CSV;' >> $OUT_FILE;
psql -c "\copy (SELECT * from stake_address WHERE id IN ($REWARD_ADDRESSES_QUERY) AND id NOT IN ($WITHDRAWAL_ADDRESSES_QUERY) AND id NOT IN ($REGISTRATION_ADDRESSES_QUERY)) to STDOUT WITH CSV" $DB >> $OUT_FILE;
echo "\." >> $OUT_FILE;

echo "-- Dumping Block rewards pool_hashes" >> $OUT_FILE;
echo "ALTER TABLE public.pool_hash DISABLE TRIGGER ALL;" >> $OUT_FILE;
echo 'COPY public.pool_hash (id, hash_raw, view) FROM stdin WITH CSV;' >> $OUT_FILE;
psql -c "\copy (SELECT * from pool_hash WHERE id IN (SELECT pool_id FROM reward WHERE block_id in ($BLOCKS_TO_EXPORT))) to STDOUT WITH CSV" $DB >> $OUT_FILE;
