import { Logger } from 'ts-log';
import { createCardanoCli, Tip } from './cardano-cli';
import pRetry, { FailedAttemptError } from 'p-retry';
import delay from 'delay';
import execa from 'execa';
import fs from 'fs-extra';

type Delta = number;

export type Config = {
  cardanoCliPath: string;
  cardanoDbSyncPath: string;
  lastKnownMajorProtocolVersion: number;
  networkMagic: string;
  onFatalError: () => void;
};

export interface Manager {
  start(): Promise<void>;
}

export const createManager = (config: Config, logger: Logger): Manager => {
  const cardanoCli = createCardanoCli(config.cardanoCliPath, config.networkMagic, logger);
  const onFailedAttemptFor = (operation: string) => ({ attemptNumber, message, retriesLeft }: FailedAttemptError) => {
    const nextAction = retriesLeft > 0 ? 'retrying...' : 'exiting';
    logger.warn(message);
    logger.info(`${operation}: Attempt ${attemptNumber} of ${attemptNumber + retriesLeft}, ${nextAction}`);
    if (retriesLeft === 0) {
      logger.error(message);
      config.onFatalError();
    }
  };
  return {
    async start() {
      let lastTip: Tip;
      logger.debug('start', {
        module: 'Manager',
        value: {
          networkMagic: config.networkMagic,
          lastKnownMajorProtocolVersion: config.lastKnownMajorProtocolVersion
        }
      });
      await pRetry(
        async () => {
          await fs.stat(process.env.CARDANO_NODE_SOCKET_PATH as string);
        },
        {
          factor: 1.5,
          onFailedAttempt: onFailedAttemptFor('Discovering cardano-node socket'),
          retries: 39
        }
      );
      const sampleChainGrowth = async (secondsDelay: number): Promise<Delta> => {
        lastTip = await cardanoCli.getTip();
        logger.debug('growth sample started', { module: 'Manager', value: lastTip });
        await delay(secondsDelay * 1000);
        const newTip = await cardanoCli.getTip();
        logger.debug('growth sample stopped', { module: 'Manager', value: newTip });
        return newTip.blockNo - lastTip.blockNo;
      };
      await pRetry(
        async () => {
          const currentProtocolParameters = await cardanoCli.getProtocolParameters();
          if (currentProtocolParameters === undefined) {
            throw new Error('cardano-node is synchronizing. Not in most recent era yet');
          }
          logger.debug('currentProtocolVersion.major', {
            module: 'Manager',
            value: currentProtocolParameters.protocolVersion.major
          });
          if (currentProtocolParameters.protocolVersion.major < config.lastKnownMajorProtocolVersion) {
            throw new Error('cardano-node is synchronizing. Not in most recent era yet');
          }
          const delta = await sampleChainGrowth(9);
          logger.debug('delta', { module: 'Manager', value: delta });
          if (delta > 3) {
            throw new Error('cardano-node is synchronizing.');
          } else {
            // To reduce the likelihood of a temporary pause due to network conditions or
            // epoch boundary processing, a second sample is captured after a short delay
            // to have more confidence.
            await delay(6000);
            const confirmationDelta = await sampleChainGrowth(9);
            logger.debug('confirmationDelta', { module: 'Manager', value: confirmationDelta });
            if (confirmationDelta > 3) {
              throw new Error('cardano-node is synchronizing.');
            }
          }
        },
        {
          factor: 1.5,
          maxTimeout: 60 * 1000,
          onFailedAttempt: onFailedAttemptFor('Waiting for cardano-node to sync'),
          retries: 499
        }
      );
      const subprocess = execa(config.cardanoDbSyncPath, [
        '--config',
        '/config/cardano-db-sync/config.json',
        '--schema-dir',
        '/cardano-db-sync/schema/',
        '--socket-path',
        '/ipc/node.socket',
        '--state-dir',
        '/data/db-sync'
      ]);
      subprocess.stdout?.pipe(process.stdout);
      logger.info('starting cardano-db-sync ');
      await subprocess;
    }
  };
};
