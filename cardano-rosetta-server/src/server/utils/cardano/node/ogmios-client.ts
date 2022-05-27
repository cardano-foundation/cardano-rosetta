/* eslint-disable no-console */
/* eslint-disable no-magic-numbers */
/* eslint-disable no-useless-return */
import pRetry from 'p-retry';
import { DataFetcher } from './data-fetcher';
import {
  ConnectionConfig,
  createConnectionObject,
  createInteractionContext,
  createTxSubmissionClient,
  getServerHealth,
  // Schema,
  TxSubmission
} from '@cardano-ogmios/client';
import { dummyLogger } from 'ts-log';

const MODULE_NAME = 'OgmiosClient';

export interface OgmiosClient {
  submitTransaction(transaction: string): Promise<void>;
  shutdown(): Promise<void>;
}

export const configure = async (ogmiosConnectionConfig?: ConnectionConfig): Promise<OgmiosClient> => {
  const logger = dummyLogger;
  const serverHealthFetcher = new DataFetcher(
    'ServerHealth',
    () => getServerHealth({ connection: createConnectionObject(ogmiosConnectionConfig) }),
    30000
  );
  let txSubmissionClient: TxSubmission.TxSubmissionClient | undefined;
  await pRetry(
    async () => {
      await serverHealthFetcher.initialize();
      txSubmissionClient = await createTxSubmissionClient(
        await createInteractionContext(
          error => {
            logger.error({ module: MODULE_NAME, error: error.name }, error.message);
          },
          logger.info,
          {
            connection: ogmiosConnectionConfig,
            interactionType: 'LongRunning'
          }
        )
      );
    },
    {
      factor: 1.2,
      retries: 100,
      onFailedAttempt: () => logger.info('Establishing connection to cardano-node')
    }
  );
  return {
    submitTransaction: async (transaction: string) => {
      if (serverHealthFetcher.value.networkSynchronization < 0.95) {
        throw new Error('Operation requires synced node');
      }
      logger.info('[submitTransaction] About to submit transaction', transaction);
      await txSubmissionClient?.submitTx(transaction);
      logger.info('[submitTransaction] transaction successfully sent', transaction);
    },
    shutdown: async () => {
      await Promise.all([txSubmissionClient?.shutdown, serverHealthFetcher?.shutdown]);
    }
  };
};
