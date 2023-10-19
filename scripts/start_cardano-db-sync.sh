#!/usr/bin/env bash

set -euo pipefail
CARDANO_DB_SYNC_EXE=$1

# Workaround for: https://github.com/input-output-hk/cardano-db-sync/issues/433
sleep 5;
exec $CARDANO_DB_SYNC_EXE \
  --config /config/cardano-db-sync/config.json \
  --schema-dir /cardano-db-sync/schema/ \
  --socket-path /ipc/node.socket \
  --state-dir /data/db-sync
