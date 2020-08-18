#!/usr/bin/env bash

set -euo pipefail

DB_NAME=cexplorer
DATA_DIR_POSTGRES=/data/postgresql
DATA_DIR_NODE=/data/node-db

if [ ! -d $DATA_DIR_POSTGRES ]; then
  mv /var/lib/postgresql/12/main $DATA_DIR_POSTGRES
  chmod 0700 $DATA_DIR_POSTGRES
fi
if [ ! -d $DATA_DIR_NODE ]; then
 mkdir -p $DATA_DIR_NODE
fi

chown postgres:postgres -R \
  /config \
  $DATA_DIR_POSTGRES \
  $DATA_DIR_NODE \
  /ipc

/etc/init.d/postgresql stop 1> /dev/null && /etc/init.d/postgresql start 1> /dev/null
if [ ! "$( gosu postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" )" = '1' ]; then
  echo 'Initializing PostgreSQL'
  gosu postgres createdb -T template0 --owner="postgres" --encoding=UTF8 "${DB_NAME}"
fi

/etc/init.d/postgresql stop 1> /dev/null
exec gosu postgres pm2-runtime start ecosystem.config.js --env production
