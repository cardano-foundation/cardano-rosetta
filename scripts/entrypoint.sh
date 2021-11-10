#!/usr/bin/env bash

set -euo pipefail

DB_NAME=cexplorer
DATA_DIR_DB_SYNC=/data/db-sync
DATA_DIR_POSTGRES=/data/postgresql
DATA_DIR_NODE=/data/node-db
MODE=${MODE:-online}

function createDb {
  gosu postgres createdb -T template0 --owner="postgres" --encoding=UTF8 "${DB_NAME}"
}

if [ "$MODE" == "offline" ]; then
  echo 'Cardano Rosetta: Offline Mode';
  exec gosu postgres pm2-runtime start ecosystem.config.js --env production --only 'cardano-rosetta-server'

elif [ "$MODE" == "online" ]; then
  echo 'Cardano Rosetta';
  if [ ! -d $DATA_DIR_DB_SYNC ]; then
    mkdir -p $DATA_DIR_DB_SYNC
  fi
  if [ ! -d $DATA_DIR_POSTGRES ]; then
    mv /var/lib/postgresql/12/main $DATA_DIR_POSTGRES
    chmod 0700 $DATA_DIR_POSTGRES
  fi
  if [ ! -d $DATA_DIR_NODE ]; then
    mkdir -p $DATA_DIR_NODE
  fi

  chown postgres:postgres -R \
    /config \
    $DATA_DIR_DB_SYNC \
    $DATA_DIR_POSTGRES \
    $DATA_DIR_NODE \
    /ipc

  /etc/init.d/postgresql stop 1> /dev/null  && /etc/init.d/postgresql start 1> /dev/null

  snapshot_count=$(find "/snapshot" -type f -name '*.tgz' | wc -l)
  node_data_count=$(ls -1 ${DATA_DIR_NODE} | wc -l)

  if test "${snapshot_count}" -gt 0 ; then
    if test "${node_data_count}" -gt 0; then
      echo 'Restoring cardano-db-sync snapshot';
      file_count=$(find "$DATA_DIR_DB_SYNC" -type f -name '*.lstate' | wc -l)
      if test "${file_count}" -gt 0 ; then
        echo "Removing existing files from $DATA_DIR_DB_SYNC"
        rm -f ${DATA_DIR_DB_SYNC}/*.lstate
      fi
      tmp_dir=$(gosu postgres mktemp --directory -t db-sync-snapshot-XXXXXXXXXX)
      echo "Extracting tarball"
      gosu postgres tar -zxvf /snapshot/*.tgz --directory "$tmp_dir"
      db_file=$(find "$tmp_dir/" -iname "*.sql")
      lstate_file=$(find "${tmp_dir}/" -iname "*.lstate")
      mv "${lstate_file}" "$DATA_DIR_DB_SYNC"
      echo "Dropping DB $DB_NAME if exists"
      gosu postgres dropdb --if-exists $DB_NAME
      echo "Restoring DB from file"
      createDb
      gosu postgres psql --dbname="${DB_NAME}" -f "${db_file}"
      echo 'Cleaning up';
      rm -r "${tmp_dir}" /snapshot/*
    else
      echo 'Skipping snapshot restoration as cardano-node will be syncing from genesis';
    fi
  fi

  if [ ! "$( gosu postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" )" = '1' ]; then
    echo 'Initializing DB';
    createDb
  fi

  /etc/init.d/postgresql stop 1> /dev/null
  echo 'Starting';
  exec gosu postgres pm2-runtime start ecosystem.config.js --env production

else
  echo "Cardano Rosetta: Invalid MODE: ${MODE}. If set, must be offline or online";
  exit 1
fi
