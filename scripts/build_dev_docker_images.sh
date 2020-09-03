#!/usr/bin/env bash

set -euo pipefail
DIR="$(dirname "$(readlink -fm "$0")")"
BUILD_CONTEXT="$(dirname $DIR)"
export DOCKER_BUILDKIT=1

${DIR}/build_source_images.sh $BUILD_CONTEXT

docker build \
  -f dev.Dockerfile \
  -t cardano-rosetta:dev \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  --cache-from inputoutput/cardano-rosetta:master \
  $BUILD_CONTEXT

docker build \
  --build-arg=NETWORK=testnet \
  -f dev.Dockerfile \
  -t cardano-rosetta:dev-testnet \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  --cache-from inputoutput/cardano-rosetta:master \
  $BUILD_CONTEXT
