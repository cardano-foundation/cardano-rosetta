#!/usr/bin/env bash

set -euo pipefail

REPO_ROOT="$(dirname "$(dirname "$(readlink -fm "$0")")")"

docker build --target=nodejs-builder -t nodejs-builder $REPO_ROOT
docker build --target=haskell-builder -t haskell-builder $REPO_ROOT
docker build --target=runtime-base -t runtime-base $REPO_ROOT
docker build -f dev.Dockerfile -t cardano-rosetta:dev $REPO_ROOT
docker build --build-arg=NETWORK=testnet -f dev.Dockerfile -t cardano-rosetta:dev-testnet $REPO_ROOT