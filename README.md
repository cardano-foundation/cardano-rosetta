# Cardano Rosetta
[![CI][img_src_CI]][workflow_CI] [![Nightly][img_src_Nightly]][workflow_Nightly]

An implementation of [Rosetta] for [Cardano], targeting the version defined in the [OpenApi 
schema]. Skip to [run](#run) if wishing to use a pre-built image from the [Docker Hub repository]. 


## Build
Build [from anywhere], _optionally_ specifying a [network] name other than `mainnet` as a 
build argument, and accessing cached build layers to reduce the initialization time. You can also 
build with local source by replacing the GitHub link with `.`

<details open>
  <summary>mainnet</summary>

```console
DOCKER_BUILDKIT=1 \
docker build \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  --cache-from=inputoutput/cardano-rosetta:master \
  -t inputoutput/cardano-rosetta:1.6.0 \
  https://github.com/input-output-hk/cardano-rosetta.git#1.6.0
```

</details>

<details>
  <summary>testnet</summary>

```console
DOCKER_BUILDKIT=1 \
docker build \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  --build-arg NETWORK=testnet \
  --cache-from=inputoutput/cardano-rosetta:master \
  -t inputoutput/cardano-rosetta:1.6.0-testnet \
  https://github.com/input-output-hk/cardano-rosetta.git#1.6.0
```

</details>

## Run
Run the locally or pre-built images and mount a single volume into the [standard storage 
location], map the server port to the host, and allocate a suitably-sized `/dev/shm`. See the 
complete [Docker run reference] for full control.

<details open>
  <summary>mainnet</summary>

```console
docker run \
  --name cardano-rosetta \
  -p 8080:8080 \
  -v cardano-rosetta:/data \
  --shm-size=2g \
  inputoutput/cardano-rosetta:1.6.0
```

</details>

<details>
  <summary>testnet</summary>

```console
docker run \
  --name cardano-rosetta-testnet \
  -p 8081:8080 \
  -v cardano-rosetta-testnet:/data \
  --shm-size=2g \
  inputoutput/cardano-rosetta:1.6.0-testnet
```

</details>

:information_source: _A trusted DB snapshot can be used to speed up the initial sync, however
the internal instance of `cardano-node` must be synced past the snapshot point for it to be
applied. This can be achieved by observing logs emitted from `cardano-node` indicating it's 
close to the network tip, before then following the instructions in the [Upgrading section](#upgrading)._

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
`cardano-db-sync`. This can be achieved without requiring a network re-sync using one of the two 
following approached:

#### 1. Apply a Trusted `cardano-db-sync` Snapshot
Run the build command with the addition of an argument providing a version and network-specific 
link, sourced from the `cardano-db-sync` [release notes](https://github.com/input-output-hk/cardano-db-sync/releases).
For example:

##### Build
<details open>
  <summary>mainnet</summary>

```console
DOCKER_BUILDKIT=1 \
docker build \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  --build-arg SNAPSHOT_URL=https://update-cardano-mainnet.iohk.io/cardano-db-sync/11/db-sync-snapshot-schema-11-block-6426045-x86_64.tgz \
  --cache-from=inputoutput/cardano-rosetta:master \
  -t inputoutput/cardano-rosetta:1.6.0-apply-snapshot \
  https://github.com/input-output-hk/cardano-rosetta.git#1.6.0
```

</details>

<details>
  <summary>testnet</summary>

```console
DOCKER_BUILDKIT=1 \
docker build \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  --build-arg NETWORK=testnet \
  --build-arg SNAPSHOT_URL=https://updates-cardano-testnet.s3.amazonaws.com/cardano-db-sync/11/db-sync-snapshot-schema-11-block-3022711-x86_64.tgz \
  --cache-from=inputoutput/cardano-rosetta:master \
  -t inputoutput/cardano-rosetta:1.6.0-testnet-apply-snapshot \
  https://github.com/input-output-hk/cardano-rosetta.git#1.6.0
```

</details>

##### Run

<details open>
  <summary>mainnet</summary>

```console
docker run \
  --name cardano-rosetta \
  -p 8080:8080 \
  -v cardano-rosetta:/data \
  --shm-size=2g \
  inputoutput/cardano-rosetta:1.6.0-apply-snapshot
```

</details>

<details>
  <summary>testnet</summary>

```console
docker run \
  --name cardano-rosetta-testnet \
  -p 8081:8080 \
  -v cardano-rosetta-testnet:/data \
  --shm-size=2g \
  inputoutput/cardano-rosetta:1.6.0-testnet-apply-snapshot
```

</details>

:information_source: _Build a new image as per the [standard build instructions] if you need to 
recreate the container, otherwise the data will be dropped and restored again._

:information_source: _The snapshot will only be applied if `cardano-node` is synced past the 
snapshot point, since the benefit of using it would be eliminated given `cardano-db-sync` rolls back
to genesis under these conditions. For best results, ensure the node is close to the network tip
prior to upgrading._ 

#### 2. Re-sync From Genesis
A _trustless_ approach to rebuild the DB, by syncing from genesis at the cost of an extended sync 
duration:
```console
docker stop cardano-rosetta && \
docker rm cardano-rosetta && \
docker run --rm -v cardano-rosetta:/data ubuntu rm -rf /data/postgresql /data/db-sync
```
... then start a container as per usual. Sync progress will be logged by the new container. 

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
[from anywhere]: https://www.rosetta-api.org/docs/node_deployment.html#build-anywhere
[network]: config/network
[standard storage location]: https://www.rosetta-api.org/docs/standard_storage_location.html
[Docker run reference]: https://docs.docker.com/engine/reference/run/
[modes]: https://www.rosetta-api.org/docs/node_deployment.html#multiple-modes
[docs]: cardano-rosetta-server/README.md
[standard build instructions]: #build
[Construction API Documentation]: https://www.rosetta-api.org/docs/construction_api_introduction.html
[Data API Documentation]: https://www.rosetta-api.org/docs/data_api_introduction.html
[Cardano Rosetta Docs]: ./docs
[Developer]: cardano-rosetta-server/README.md
[Maintainer]: docs/MAINTAINER.md
[QA]: docs/QA.md
