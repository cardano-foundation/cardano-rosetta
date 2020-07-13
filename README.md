# Cardano Rosetta Server

Caradano [Rosetta API specification v1.4.0](https://github.com/coinbase/rosetta-specifications) server implementation. This web service allows you to query and interact with Cardano network through a unified API.

## TOC

## Running

### Configuration

There must be a `.env` file in the root directory with the following configs:

```
# App port
PORT=8080
# App address to bind to
BIND_ADDRESS=127.0.0.1
# PostgresDB connection string
DB_CONNECTION_STRING="postgresql://postgres:password@127.0.0.1:5432/db"
```

// TODO

## Develop

### Requirements

In order to setup the repository you will need to have:

- `node@v14.5.0`
- `yarn@1.22.4` 


### Setup

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