# Cardano Rosetta
![CI](https://github.com/input-output-hk/cardano-rosetta/workflows/CI/badge.svg) ![Nightly](https://github.com/input-output-hk/cardano-rosetta/workflows/Nightly/badge.svg)

An implementation of [Rosetta 1.4.1] for [Cardano].

## Build

The Dockerfile can be [built anywhere], initially taking around 30 minutes. 

```console
wget --secure-protocol=TLSv1_2 \
  -O- https://raw.githubusercontent.com/input-output-hk/cardano-rosetta/master/Dockerfile \
  | docker build -t cardano-rosetta:0.1.0 -
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
docker run -p 8080:8080 -v cardano-rosetta:/data --name cardano-rosetta cardano-rosetta:0.1.0 
```
## Documentation

| Link                                                                                               | Audience                                                     |
| ---                                                                                                | ---                                                          |
| [Construction API Documentation]                                                                   | Users of the Cardano Rosetta Construction API                |
| [Data API Documentation]                                                                           | Users of the Cardano Rosetta Data API                        |
| [Developer]                                                                                        | Core or external developers of cardano-rosetta-server        |
| [Maintainer]                                                                                       | Solution maintainer                                          |
| [QA]                                                                                               | Quality Assurance Engineers                                  |

[Rosetta 1.4.1]: https://www.rosetta-api.org/docs/1.4.1/welcome.html
[Cardano]: https://cardano.org/
[built anywhere]: https://www.rosetta-api.org/docs/node_deployment.html#build-anywhere
[Construction API Documentation]: https://www.rosetta-api.org/docs/construction_api_introduction.html
[Data API Documentation]: https://www.rosetta-api.org/docs/data_api_introduction.html
[Developer]: cardano-rosetta-server/README.md
[Maintainer]: docs/MAINTAINER.md
[QA]: docs/QA.md
