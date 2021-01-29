import execa from 'execa';
import fs from 'fs';
import tempWrite from 'temp-write';
import { Logger } from 'fastify';

export interface CardanoCli {
  /**
   * This function invokes `cardano-cli shelley transaction submit`
   *
   * @param signedTransaction cbor hex encoded signed transaction
   * @param isMainnet true if the server is running mainnet, false otherwise
   */
  submitTransaction(logger: Logger, signedTransaction: string, isMainnet: boolean): Promise<void>;
}

const SUPPORTED_ERAS = ['Tx MaryEra', 'TxSignedShelley'];

/**
 * This function returns true if DecoderErrorDeserialiseFailure is thrown.
 *
 * It's not the best way to detect if an era mismatch but it has been agreed
 * it's the simplest one we can do.
 *
 * @param errorMessage
 */
const isWrongEra = (errorMessage: string): boolean => errorMessage.includes('DecoderErrorDeserialiseFailure');

export type ProcessExecutorResult = execa.ExecaChildProcess;

export type ProcessExecutor = (file: string, arguments_?: readonly string[]) => ProcessExecutorResult;

const defaultExecutor: ProcessExecutor = (file: string, arguments_) => execa(file, arguments_);

export const configure = (
  cardanoCliPath: string,
  networkMagic: number,
  processExecutor = defaultExecutor
): CardanoCli => ({
  async submitTransaction(logger, signedTransaction, isMainnet): Promise<void> {
    for (const era of SUPPORTED_ERAS) {
      logger.info(`[submitTransaction] About to create temp file for transaction ${signedTransaction}`);
      const cardanoCliFileContent = `{
        "type": "${era}",
        "description": "",
        "cborHex": "${signedTransaction}"
      }`;
      logger.info(cardanoCliFileContent, '[submitTransaction] cardano-cli file');
      const file = await tempWrite(cardanoCliFileContent);
      logger.info(`[submitTransaction] File created at ${file}`);
      try {
        // `--testnet-magic` flag is used even if it's mainnet as we are using the proper networkMagic
        logger.info(`[submitTransaction] Invoking cardano-cli at ${cardanoCliPath} using ${networkMagic} networkMagic`);
        const commonParameters = ['transaction', 'submit', '--tx-file', file];
        const parameters = isMainnet
          ? commonParameters.concat('--mainnet')
          : commonParameters.concat('--testnet-magic', networkMagic.toString());
        const { stdout } = await processExecutor(cardanoCliPath, parameters);
        logger.info('[submitTransaction] transaction successfully sent', stdout.toString());
        return;
      } catch (error) {
        if (isWrongEra(error.stderr.toString())) {
          logger.error(`[submitTransaction] Era mismatch when using era ${era}`);
        } else {
          logger.error(error, '[submitTransaction] Command failed');
          throw new Error(error.stderr.toString());
        }
      } finally {
        await fs.promises.unlink(file);
      }
    }
    // eslint-disable-next-line quotes
    throw new Error("Transaction wasn't processed. Era not supported.");
  }
});
