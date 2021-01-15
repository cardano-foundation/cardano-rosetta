#!/usr/bin/env node
import { createManager } from './manager';
import { createLogger, LogLevelString } from 'bunyan';
import { Logger } from 'ts-log';

const logger: Logger = createLogger({
  name: 'cardano-db-sync-manager',
  level: (process.argv[6] as LogLevelString) || (process.env.LOGGER_MIN_SEVERITY as LogLevelString) || 'info'
});

createManager(
  {
    cardanoCliPath: process.argv[3] || process.env.CARDANO_CLI_PATH || 'cardano-cli',
    cardanoDbSyncPath: process.argv[2] || process.env.CARDANO_DB_SYNC_PATH || 'cardano-db-sync',
    lastKnownMajorProtocolVersion:
      Number(process.argv[5]) || Number(process.env.LAST_KNOWN_MAJOR_PROTOCOL_VERSION) || 2,
    networkMagic: process.argv[4] || process.env.NETWORK_MAGIC || 'mainnet',
    onFatalError: () => process.exit(1)
  },
  logger
)
  .start()
  .catch((error) => {
    logger.error(error);
    process.exit(1);
  });
