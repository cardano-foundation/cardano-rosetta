/* eslint-disable consistent-return */
import execa from 'execa';
import { ProtocolParameters } from './protocol-parameters';
import { Logger } from 'ts-log';

export type Tip = {
  blockNo: number;
  headerHash: string;
  slotNo: number;
};

export interface CardanoCli {
  getProtocolParameters(): Promise<ProtocolParameters | void>;
  getTip(): Promise<Tip>;
}

export const createCardanoCli = (cardanoCliPath: string, networkArgument: string, logger: Logger): CardanoCli => ({
  getProtocolParameters: async (eras = ['shelley', 'allegra', 'mary']) => {
    for (const era of eras) {
      logger.trace(`trying ${era} command`, { module: 'CardanoCli' });
      try {
        const { stdout } = await execa(cardanoCliPath, [
          'query',
          'protocol-parameters',
          '--testnet-magic',
          networkArgument,
          `--${era}-era`
        ]);
        return JSON.parse(stdout);
      } catch (error) {
        if (error.stderr.toString().match(/EraMismatch/g) === null) {
          throw new Error(error.stderr.toString());
        }
        logger.trace(error.stderr.toString());
      }
    }
  },
  getTip: async () => {
    logger.debug('getTip', { module: 'CardanoCli' });
    const { stdout } = await execa(cardanoCliPath, ['query', 'tip', '--testnet-magic', networkArgument]);
    return JSON.parse(stdout);
  }
});
