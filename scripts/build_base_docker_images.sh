#!/usr/bin/env bash

set -euo pipefail

REPO_ROOT="$(dirname "$(dirname "$(readlink -fm "$0")")")"

docker build --target=ubuntu-nodejs -t ubuntu-nodejs $REPO_ROOT
docker build --target=nodejs-builder -t nodejs-builder $REPO_ROOT
docker build -f dev.Dockerfile -t cardano-rosetta:dev $REPO_ROOT