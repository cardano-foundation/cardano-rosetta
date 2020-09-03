#!/usr/bin/env bash

set -euo pipefail

BUILD_CONTEXT=$1
export DOCKER_BUILDKIT=1

docker build \
  --target=haskell-builder \
  -t haskell-builder \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  --cache-from inputoutput/cardano-rosetta:master \
  $BUILD_CONTEXT

docker build \
  --target=nodejs-builder \
  -t nodejs-builder \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  --cache-from inputoutput/cardano-rosetta:master \
  $BUILD_CONTEXT

docker build \
  --target=ubuntu-nodejs \
  -t ubuntu-nodejs \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  --cache-from inputoutput/cardano-rosetta:master \
  $BUILD_CONTEXT

docker build \
  --target=runtime-base \
  -t runtime-base \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  --cache-from inputoutput/cardano-rosetta:master \
  $BUILD_CONTEXT
