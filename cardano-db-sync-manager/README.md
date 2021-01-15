# cardano-db-sync-manager

Simple utility to govern the startup based on the sync state of cardano-node.
It works by sampling the chain growth at an interval and ensures the current
protocol version matches the expectation, as defined in the Shelley genesis.

## Develop

### Requirements

- `node@v14.5.0`
- `yarn@1.22.4`

### Config
Can be set via ENV or passed as arguments in this order:
1. `CARDANO_CLI_PATH`
2. `CARDANO_DB_SYNC_PATH`
3. `LAST_KNOWN_MAJOR_PROTOCOL_VERSION` - As per `cardano-node` config file
4. `NETWORK_MAGIC` - As per shelley genesis file

- `LOGGER_MIN_SEVERITY`

```
yarn install
yarn build
node ./dist/index.js cardano-cli cardano-db-sync 2 mainnet debug
```