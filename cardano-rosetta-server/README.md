# Cardano Rosetta Server

A Node.js web service querying the postgres database produced by `cardano-db-sync`,
and interfacing with `cardano-node` via `cardano-cli`.

## Develop

### Requirements

- `node@v18.8.0`
- `yarn@1.22.4`
- `docker`
- `docker-compose`

There must be a `.env` or `.env.test` file in the root directory with the following configs:

```
# App port
PORT=8080
# Application log level [ trace | debug | info | warn | error | fatal ]
LOGGER_LEVEL="debug"
# App address to bind to
BIND_ADDRESS=0.0.0.0
# PostgresDB connection string
DB_CONNECTION_STRING="postgresql://postgres:mysecretpassword@127.0.0.1:5432/cardano-test"
# cardano-node topology absolute file path
TOPOLOGY_FILE_PATH="/etc/node/topology-test.json"
# Absolute path to the cardano-cli binary https://github.com/input-output-hk/cardano-node/tree/master/cardano-cli
CARDANO_CLI_PATH="/etc/node/cardano-cli"
# Absolute path to the cardano-node binary https://github.com/input-output-hk/cardano-node/tree/master/cardano-node
CARDANO_NODE_PATH="/etc/node/cardano-node"
# cardano-node genesis absolute file path
GENESIS_SHELLEY_PATH="/etc/node/testnet-genesis.json"
# cardano-node socket
CARDANO_NODE_SOCKET_PATH=/tmp/node.socket
# max amount of transactions to be returned in `/block` endpoint. Otherwise only hashes will be sent
PAGE_SIZE=25
# relative ttl to be used if any is sent during the request
DEFAULT_RELATIVE_TTL=1000
# Exemption types file path
EXEMPTION_TYPES_PATH="/etc/node/exemptions.json"
# request payload limit
BODY_LIMIT=1048576
# disables Search Api if its true
DISABLE_SEARCH_API=false
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

## Generating test data

In order to execute e2e tests a postgres docker container is started and a DB is populated with real mainnet data. This way, we can count on real data that will require too much effort to be populated (lots of inserts and data thats liked and it might take too much time to generate interesting scenarios).

There are two ways to import it and both are described below. It's worth mentioning that we rely upon naming convention so please pay attention to it.

**⚠ IMPORTANT NOTE: If `cardano-db-sync` is updated and it introduces a new schema, tests will still work as they were created with previous one. A manual update following the steps described below is required.**

### 1. DB dump

In order to populate a large dataset, `pg_dump` can be used. Our current test cases require `[Genesis, ~65k]` block range. Not all blocks are used although different checks find it very useful, for example, when checking account balance up to certain block.

Steps to generate and use a new snapshot are:

1. Run a cardano node (it could be Cardano Rosetta)
2. When the node has reached the block you wish to export, execute `pg_dump $DB > network.bak`. For example, if you are using default Cardano Rosetta db running a mainnet node, you can run `pg_dump -U postgres cexplorer > mainnet.bak`.
3. Generate a `tar` file for `mainnet.bak` and place it in `/cardano-rosetta-server/test/e2e/jest-setup/mainnet-db-snapshot.tar`.
4. Jest, before running will [pick up the file and load it into the container](./test/e2e/jest-setup/docker.ts). It will load the snapshot based on the network name.

### 2. Import specific blocks

After introducing staking, it has been realized that it would be impossible to import a mainnet dump as staking operations where introduced after block 4M leading to a `db-snapshot.tar` that is +3.5GB. To avoid such thing which is not practical, a new way to import data has been introduced that helps importing specific blocks.

Steps to do so:

1. Run a mainnet node
2. Edit [dump block script](./test/e2e/block/dump_blocks.sh) and specify the block ids to be exported
3. Change the credentials if needed, current default ones don't require any password and connect to a db named `cexplorer`
4. A file will stored at `/tmp/fixture_data.sql` containing some sql statements (basically the same ones as `pg_dump` creates)
5. Rename `/tmp/fixture_data.sql` to `/tmp/network-fixture-data.sql`, for example, if running for launchpad it will end up being `/tmp/launchpad-fixture-data.sql`
6. Generate a `tar` file for `network-fixture-data.sql` and place it in `/cardano-rosetta-server/test/e2e/jest-setup/network-fixture-data.tar`, for example `launchpad-fixture-data.tar`
7. Jest wil pick it up as with the full snapshot db.

Two things are worth mentioning:

1. Data to be exported needs to be defined in the `dump_blocks.sh` script. If a new table is needed, the script needs to be updated.
2. In order to be able to selectively import data some constraints had to be disabled.

## Using different snapshots when running tests

A new db will be created for each snapshot (See [this file](./test/e2e/jest-setup/docker.ts) for details). You can use any of them when running e2e tests. Default is `mainnet` and can be used like:

```typescript
beforeAll(async () => {
  database = setupDatabase();
  server = setupServer(database);
});
afterAll(async () => {
  await database.end();
});
```

If a different snapshot needs to be used (`mainnet` being the default), a db connection based on snapshot name can be created:

```typescript
test('Launchpad', async () => {
  const launchpad = setupDatabase(process.env.DB_CONNECTION_STRING, 'launchpad');
  const launchpadServer = setupServer(launchpad);

  const response = await launchpadServer.inject({
    method: 'post',
    url: '/block',
    payload: generatePayload(1)
  });
  expect(response.statusCode).toEqual(StatusCodes.OK);
  expect(response.json().block.block_identifier.hash).toEqual(
    'da5cfaff39fde97c797cf5a6c3657d10b603cea1daa830f9a83b3a5cc62e4e8a'
  );
});
```

### Improvements

- Introduce a way to check current schema in order to throw an error if `cardano-db-sync` is updated but it doesn't match the snapshot.
- Automate snapshots generation as it currently is a semi-manual process.
