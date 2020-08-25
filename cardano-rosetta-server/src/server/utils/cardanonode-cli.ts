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

export const configure = (cardanoCliPath: string, networkMagic: number): CardanoCli => ({
  async submitTransaction(logger, signedTransaction, isMainnet): Promise<void> {
    logger.info(`[submitTransaction] About to create temp file for transaction ${signedTransaction}`);
    const file = await tempWrite(`{
      "type": "TxSignedShelley",
      "description": "",
      "cborHex": "${signedTransaction}"
    }`);
    logger.info(`[submitTransaction] File created at ${file}`);
    try {
      // `--testnet-magic` flag is used even if it's mainnet as we are using the proper networkMagic
      logger.info(`[submitTransaction] Invoking cardano-cli at ${cardanoCliPath} using ${networkMagic} networkMagic`);
      const commonParameters = ['shelley', 'transaction', 'submit', '--tx-file', file];
      const parameters = isMainnet
        ? commonParameters.concat('--mainnet')
        : commonParameters.concat('--testnet-magic', networkMagic.toString());
      const { stderr, failed } = await execa(cardanoCliPath, parameters);
      if (failed) {
        throw new Error(stderr.toString());
      }
    } finally {
      await fs.promises.unlink(file);
    }
  }
});
