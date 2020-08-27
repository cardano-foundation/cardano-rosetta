# Cardano Rosetta Server

A Node.js web service querying the postgres database produced by `cardano-db-sync`, 
and interfacing with `cardano-node` via `cardano-cli`.  

## Develop

### Requirements

- `node@v14.5.0`
- `yarn@1.22.4`
- `docker`
- `docker-compose`

There must be a `.env` or `.env.test` file in the root directory with the following configs:

```
# App port
PORT=8080
# Application log level {silent, fatal, error, warn, info, debug, trace, all}
LOGGER_LEVEL="debug"
# App address to bind to
BIND_ADDRESS=0.0.0.0
# PostgresDB connection string
DB_CONNECTION_STRING="postgresql://postgres:mysecretpassword@127.0.0.1:5432/cardano-test"
# cardano-node topology absolute file path
TOPOLOGY_FILE_PATH="/etc/node/topology-test.json"
# Absolute path to the cardano-cli binary https://github.com/input-output-hk/cardano-node/tree/master/cardano-cli
CARDANOCLI_PATH="/etc/node/cardano-cli"
# cardano-node genesis absolute file pat
GENESIS_PATH="/etc/node/testnet-genesis.json"
# cardano-node socket
CARDANO_NODE_SOCKET_PATH=/tmp/node.socket
# max amount of transactions to be returned in `/block` endpoint. Otherwise only hashes will be sent
PAGE_SIZE=25
DEFAULT_RELATIVE_TTL=1000
```

### Install packages from offline cache
The offline cache enables reproducible builds.
```
yarn --offline
```

### Run tests
```
yarn test
```

### Start the Service Dependencies
```
yarn testnet:services:up
```
### Stop the Service Dependencies
```
yarn testnet:services:down
```

### Start a Local Instance

```
yarn dev
```



### Configure Rosetta Spec Types

Rosetta openapi spec file is used to:

- Generate Typescript types to be used in the app
- To generate validation schemas that are used by Fastify to improve JSON rendering. For further details see [Fastify Documentation](https://www.fastify.io/docs/v2.10.x/Validation-and-Serialization/#serialization).

To do so, the following steps are required:

1. Download the specs from [here](https://github.com/coinbase/rosetta-specifications/blob/master/api.json)
2. Place them `src/server/openApi.json`
3. Introduce as many changes as you need (`metadata` fields need to be populated manually to allow Fastify to return the fields)
4. Execute `yarn generate-rosetta-types`

### Build Dev Docker image

As it's more convenient to build a Cardano Rosetta image using local source code during development, a 
[`dev.Dockerfile`](../../dev.Dockerfile) is maintained to patch in only the source-accessing layers 
resulting in almost identical runtime images. The spec-compliant builds that must clone the 
source code, [will be](https://github.com/input-output-hk/cardano-rosetta/issues/126) used during 
CI, and for performing the manual QA steps prior to release.

```
./scripts/build_dev_docker_images.sh
```
Your local docker engine will now have the following loaded:
- `cardano-rosetta:dev`
- `cardano-rosetta:dev-testnet`

### Run a Dev Image

**_Optionally_** mount a single volume into the [standard storage location](https://www.rosetta-api.org/docs/standard_storage_location.html) 
mapping the server port to the host.

```console
docker run -p 8080:8080 -v cardano-rosetta-testnet:/data cardano-rosetta:dev-testnet cardano-rosetta-testnet
```
