# Cardano Rosetta

An implementation of the [Rosetta API v1.4.0](https://github.com/coinbase/rosetta-specifications) 
for [Cardano](https://cardano.org/).

## Build

The Dockerfile can be [built anywhere](https://www.rosetta-api.org/docs/node_deployment.html#build-anywhere)

```console
wget --secure-protocol=TLSv1_2 https://raw.githubusercontent.com/input-output-hk/cardano-rosetta/0.1.0/Dockerfile
docker build -t cardano-rosetta:0.1.0 .
```

**_Optionally_**  specify a network name, or override the managed dependencies using build args
flags in the `docker build` command. [See releases](docs/MAINTAINER.md#Internal-Software), and 
[networks](config/network). `NETWORK` defaults to `mainnet`

```console
  --build-arg=NETWORK=testnet
  --build-arg=A_DEP_VERSION=2.0.1
```

## Run

Mount a single volume into the [standard storage location](https://www.rosetta-api.org/docs/standard_storage_location.html) 
mapping the server port to the host.

```console
docker run -p 8080:8080 -v cardano-mainnet:/data cardano-rosetta:0.0.1 cardano-rosetta-mainnet
```
## Documentation

| Link                                                                                               | Audience                                                     |
| ---                                                                                                | ---                                                          |
| [Construction API Documentation]                                                                   | Users of the Cardano Rosetta Construction API                |
| [Data API Documentation]                                                                           | Users of the Cardano Rosetta Data API                        |
| [Developer]                                                                                        | Core or external developers of cardano-rosetta-server        |
| [Maintainer]                                                                                       | Solution maintainer                                          |
| [QA]                                                                                               | Quality Assurance Engineers                                  |

[Construction API Documentation]: https://www.rosetta-api.org/docs/construction_api_introduction.html
[Data API Documentation]: https://www.rosetta-api.org/docs/data_api_introduction.html
[Developer]: cardano-rosetta-server/README.md
[Maintainer]: docs/MAINTAINER.md
[QA]: docs/QA.md