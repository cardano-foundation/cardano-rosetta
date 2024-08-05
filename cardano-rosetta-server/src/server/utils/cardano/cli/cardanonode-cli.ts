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

export const SUPPORTED_ERAS = [
  'Witnessed Tx BabbageEra',
  'Tx AlonzoEra',
  'Tx MaryEra',
  'Tx AllegraEra',
  'TxSignedShelley'
];

const wrongErraDetectRegex = /The era of the node and the tx do not match|DecoderErrorDeserialiseFailure/;
/**
 * This function returns true if DecoderErrorDeserialiseFailure is thrown.
 *
 * It's not the best way to detect if an era mismatch but it avoids a race condition
 *
 * @param errorMessage
 */
const isWrongEra = (errorMessage: string): boolean => errorMessage.match(wrongErraDetectRegex) !== null;

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
      logger.debug(`[submitTransaction] About to create temp file for transaction ${signedTransaction}`);
      const cardanoCliFileContent = `{
        "type": "${era}",
        "description": "",
        "cborHex": "${signedTransaction}"
      }`;
      logger.debug(cardanoCliFileContent, '[submitTransaction] cardano-cli file');
      const file = await tempWrite(cardanoCliFileContent);
      logger.debug(`[submitTransaction] File created at ${file}`);
      try {
        // `--testnet-magic` flag is used even if it's mainnet as we are using the proper networkMagic
        logger.debug(
          `[submitTransaction] Invoking cardano-cli at ${cardanoCliPath} using ${networkMagic} networkMagic`
        );
        const commonParameters = ['transaction', 'submit', '--tx-file', file];
        const parameters = isMainnet
          ? commonParameters.concat('--mainnet')
          : commonParameters.concat('--testnet-magic', networkMagic.toString());
        const { stdout } = await processExecutor(cardanoCliPath, parameters);
        logger.info('[submitTransaction] transaction successfully sent', stdout.toString());
        return;
      } catch (error) {
        const error_ = error as ProcessExecutorResult;
        logger.error(error_, '[submitTransaction] Command failed');
        if (error_.stderr === null) return;
        if (isWrongEra(error_.stderr.toString())) {
          logger.debug(`[submitTransaction] Era mismatch when using era ${era}`);
        } else {
          throw new Error(error_.stderr.toString());
        }
      } finally {
        await fs.promises.unlink(file);
      }
    }
    throw new Error('Transaction not submitted. Era not supported.');
  }
});
