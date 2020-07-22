# Cardano Rosetta

Caradano [Rosetta API specification v1.4.0](https://github.com/coinbase/rosetta-specifications) implementation.
This web service allows you to query and interact with the Cardano network through a unified API.

## TOC

## Deploy

### Build :construction:
The Dockerfile can be [built anywhere](https://www.rosetta-api.org/docs/node_deployment.html#build-anywhere)

```console
wget --secure-protocol=TLSv1_2 https://raw.githubusercontent.com/input-output-hk/cardano-rosetta/0.1.0/Dockerfile
docker build -t cardano-rosetta:0.1.0 .
``` 
_Optionally_ override the managed dependencies using build arg flags in the `docker build` command. [See releases](docs/MAINTAINER.md#Internal-Software) 
```console
  --build-arg=A_DEP_VERSION=2.0.1 \
```

### Run :construction:
Mount a single volume into the [standard storage location](https://www.rosetta-api.org/docs/standard_storage_location.html)
```console
docker run --init -v data:/data cardano-rosetta -P
```
### Check  :construction:
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

There must be a `.env` file in the root directory with the following configs:
```
# App port
PORT=8080
# App address to bind to
BIND_ADDRESS=127.0.0.1
# PostgresDB connection string
DB_CONNECTION_STRING="postgresql://postgres:password@127.0.0.1:5432/db"
```

### Build base Docker images
Build base images maintained in the release [Dockerfile](./Dockerfile) for [development](./dev.Dockerfile)
```
./scripts/build_base_docker_images.sh
```
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
