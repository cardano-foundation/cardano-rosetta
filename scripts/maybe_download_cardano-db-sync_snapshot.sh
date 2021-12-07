#!/usr/bin/env bash

set -euo pipefail
SNAPSHOT_URL=${1:-}
WORKING_DIR=${2:-.}

if [[ "${SNAPSHOT_URL}" =~ ^https://.* ]]; then
  SNAPSHOT_BASENAME="$(basename "${SNAPSHOT_URL}")"
  cd $WORKING_DIR
  echo "Downloading snapshot ${SNAPSHOT_URL} ..."
  curl -LOC - ${SNAPSHOT_URL}
  echo "Downloading sha256sum ${SNAPSHOT_URL}.sha256sum ..."
  curl -LO ${SNAPSHOT_URL}.sha256sum
  echo "Checking sha256sum ..."
  sha256sum -c ${SNAPSHOT_BASENAME}.sha256sum
  rm ${SNAPSHOT_BASENAME}.sha256sum
fi
