# Cardano Rosetta
[![CI][img_src_CI]][workflow_CI] [![Nightly][img_src_Nightly]][workflow_Nightly] [![Postman Send Transaction Example](https://github.com/input-output-hk/cardano-rosetta/actions/workflows/postman_send_transaction_example.yml/badge.svg)](https://github.com/input-output-hk/cardano-rosetta/actions/workflows/postman_send_transaction_example.yml)

An implementation of [Rosetta] for [Cardano], targeting the version defined in the [OpenApi 
schema]. Skip to [run](#run) if wishing to use a pre-built image from the [Docker Hub repository]. 


## Build

### [From anywhere]

```console
docker build -t cardano-rosetta:1.4.0-beta.0 https://github.com/input-output-hk/cardano-rosetta.
git#1.4.0-beta.0
```
### With local source code
```
docker build -t cardano-rosetta .
```

**_Optionally_**  specify a [network] name, other than `mainnet`, using a build argument:

```console
  --build-arg NETWORK=testnet
```

**_Optionally_** use cached build layers to reduce the initialization time. Suits dev and demo 
use-cases:

### mainnet
```console
export DOCKER_BUILDKIT=1
docker build \
    --build-arg BUILDKIT_INLINE_CACHE=1 \
    --cache-from=inputoutput/cardano-rosetta:master \
    -t inputoutput/cardano-rosetta:1.4.0-beta.1 \
    https://github.com/input-output-hk/cardano-rosetta.git#1.4.0-beta.1
```

### testnet
```console
export DOCKER_BUILDKIT=1
docker build \
    --build-arg BUILDKIT_INLINE_CACHE=1 \
    --cache-from=inputoutput/cardano-rosetta:master \
    -t inputoutput/cardano-rosetta:1.4.0-beta.1-testnet \
    https://github.com/input-output-hk/cardano-rosetta.git#1.4.0-beta.1
```

### alonzo-purple
```console
export DOCKER_BUILDKIT=1
docker build \
    --build-arg BUILDKIT_INLINE_CACHE=1 \
    --cache-from=inputoutput/cardano-rosetta:master \
    -t inputoutput/cardano-rosetta:1.4.0-beta.1-alonzo-purple \
    https://github.com/input-output-hk/cardano-rosetta.git#1.4.0-beta.1
```

## Run
Run the locally built or pre-built images and mount a single volume into the [standard storage 
location], map the server port to the host, and allocate a suitably-sized `/dev/shm`. See the 
complete [Docker run reference] for full control.

### mainnet
```console
docker run \
  --name cardano-rosetta \
  -p 8080:8080 \
  -v cardano-rosetta:/data \
  --shm-size=2g \
  inputoutput/cardano-rosetta:1.4.0-beta.1
```

### testnet
```console
docker run \
  --name cardano-rosetta-testnet \
  -p 8081:8080 \
  -v cardano-rosetta-testnet:/data \
  --shm-size=2g \
  inputoutput/cardano-rosetta:1.4.0-beta.1-testnet
```

### alonzo-purple
```console
docker run \
  --name cardano-rosetta-alonzo-purple \
  -p 8082:8080 \
  -v cardano-rosetta-alonzo-purple:/data \
  --shm-size=2g \
  inputoutput/cardano-rosetta:1.4.0-beta.1-alonzo-purple
```

### Configuration

Set ENVs for optional runtime configuration
```console
-e MODE=offline
```

#### `MODE`
See Rosetta docs for information on [modes]
- `online` - default
- `offline`

#### `DEFAULT_RELATIVE_TTL`
Specify the TTL without needing to access an online method. Default: `1000`

#### `LOGGER_MIN_SEVERITY`
- `trace`
- `debug`
- `info` - default
- `warn`
- `error`
- `fatal`

#### `PAGE_SIZE`
Default: `25`

### Upgrading
As per the release notes, you **_may_** be required to refresh the state managed by 
`cardano-db-sync`. This can be achieved without requiring a network re-sync using the following 
command:

```console
docker stop cardano-rosetta && \
docker rm cardano-rosetta && \
docker run --rm -v cardano-rosetta:/data ubuntu rm -rf /data/postgresql /data/db-sync
```
Now create a new container using the run instructions above. Sync progress will be logged by the new container. 

## Documentation

| Link                               | Audience                                                     |
| ---                                | ---                                                          |
| [Construction API Documentation]   | Users of the Cardano Rosetta Construction API                |
| [Data API Documentation]           | Users of the Cardano Rosetta Data API                        |
| [Cardano Rosetta Docs]             | Cardano Rosetta specific documentation                       |
| [Developer]                        | Core or external developers of cardano-rosetta-server        |
| [Maintainer]                       | Solution maintainer                                          |
| [QA]                               | Quality Assurance Engineers                                  |

<hr/>

<p align="center">
  <a href="https://github.com/input-output-hk/cardano-rosetta/blob/master/LICENSE.md"><img src="https://img.shields.io/github/license/input-output-hk/cardano-rosetta.svg?style=for-the-badge" /></a>
</p>

[img_src_CI]: https://github.com/input-output-hk/cardano-rosetta/workflows/CI/badge.svg
[workflow_CI]: https://github.com/input-output-hk/cardano-rosetta/actions?query=workflow%3ACI
[img_src_Nightly]: https://github.com/input-output-hk/cardano-rosetta/workflows/Nightly/badge.svg
[workflow_Nightly]: https://github.com/input-output-hk/cardano-rosetta/actions?query=workflow%3ANightly
[Rosetta]: https://www.rosetta-api.org/docs/welcome.html
[Cardano]: https://cardano.org/
[OpenApi schema]: cardano-rosetta-server/src/server/openApi.json#L4
[Docker Hub repository]: https://hub.docker.com/r/inputoutput/cardano-rosetta/tags?page=1&ordering=last_updated
[From anywhere]: https://www.rosetta-api.org/docs/node_deployment.html#build-anywhere
[network]: config/network
[standard storage location]: https://www.rosetta-api.org/docs/standard_storage_location.html
[Docker run reference]: https://docs.docker.com/engine/reference/run/
[modes]: https://www.rosetta-api.org/docs/node_deployment.html#multiple-modes
[docs]: cardano-rosetta-server/README.md
[Construction API Documentation]: https://www.rosetta-api.org/docs/construction_api_introduction.html
[Data API Documentation]: https://www.rosetta-api.org/docs/data_api_introduction.html
[Cardano Rosetta Docs]: ./docs
[Developer]: cardano-rosetta-server/README.md
[Maintainer]: docs/MAINTAINER.md
[QA]: docs/QA.md
