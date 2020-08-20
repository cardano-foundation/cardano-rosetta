# Cardano Rosetta

Caradano [Rosetta API specification v1.4.0](https://github.com/coinbase/rosetta-specifications) 
implementation. This web service allows you to query and interact with the Cardano network through 
a unified API.

## Deploy

### Build

The Dockerfile can be [built anywhere](https://www.rosetta-api.org/docs/node_deployment.html#build-anywhere)

```console
wget --secure-protocol=TLSv1_2 https://raw.githubusercontent.com/input-output-hk/cardano-rosetta/0.1.0/Dockerfile
docker build -t cardano-rosetta:0.0.1 .
```

**_Optionally_**  specify a network name, or override the managed dependencies using build args
flags in the `docker build` command. [See releases](docs/MAINTAINER.md#Internal-Software), and 
[networks](config/network). `NETWORK` defaults to `mainnet`

```console
  --build-arg=NETWORK=testnet
  --build-arg=A_DEP_VERSION=2.0.1
```

### Run

Mount a single volume into the [standard storage location](https://www.rosetta-api.org/docs/standard_storage_location.html) 
mapping the server port to the host.

```console
docker run -p 8080:8080 -v cardano-mainnet:/data cardano-rosetta:0.0.1 cardano-rosetta-mainnet
```

### Check

```console
go get github.com/coinbase/rosetta-cli
rosetta-cli check
```

## Develop

### Requirements

In order to setup the repository you will need to have:

- `node@v14.5.0`
- `yarn@1.22.4`
- `docker`
- `docker-compose`

There must be a `.env` file in the root directory with the following configs:

```
# App port
PORT=8080
# Application log level {off, fatal, error, warn, info, debug, trace, all}
LOGGER_LEVEL="debug"
LOGGER_ENABLED="true"
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
```

### Configure Rosetta Spec types

Rosetta openapi spec file is used to:

- Generate Typescript types to be used in the app
- To generate validation schemas that are used by Fastify to improve JSON rendering. For further details see [Fastify Documentation](https://www.fastify.io/docs/v2.10.x/Validation-and-Serialization/#serialization).

To do so, the following steps are required:

1. Download the specs from [here](https://github.com/coinbase/rosetta-specifications/blob/master/api.json)
2. Place them `src/server/openApi.json`
3. Introduce as many changes as you need (`metadata` fields need to be populated manually to allow Fastify to return the fields)
4. Execute `yarn generate-rosetta-types`

### Build Dev Docker images

Build network-specific images, suitable for [development](./dev.Dockerfile) 

```
./scripts/build_dev_docker_images.sh
```
Your local docker engine will now have the following loaded:
- `cardano-rosetta:dev`
- `cardano-rosetta:dev-testnet`

### Install packages from offline cache

```
yarn --offline
```

### Run tests

```
yarn test
```

### Start local instance

```
yarn dev
```
