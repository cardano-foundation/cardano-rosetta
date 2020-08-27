import execa from 'execa';
import { Logger } from 'fastify';

export interface CardanoNode {
  /**
   * This function invokes `cardano-node --version`
   */
  getCardanoNodeVersion(logger: Logger): Promise<string>;
}

export const configure = (cardanoNodePath: string): CardanoNode => ({
  async getCardanoNodeVersion(logger): Promise<string> {
    logger.info(`[getCardanoNodeVersion] Invoking cardano-node --version at ${cardanoNodePath}`);
    const parameters = ['--version'];
    const { stdout, failed, stderr } = await execa(cardanoNodePath, parameters);
    if (failed) {
      throw new Error(stderr.toString());
    }
    return stdout;
  }
});
