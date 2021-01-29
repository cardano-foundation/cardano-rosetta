import { Logger } from 'fastify';
import { configure } from '../../../../../src/server/utils/cardano/cli/cardanonode-cli';

const logger: Logger = {
  info: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
  fatal: jest.fn(),
  warn: jest.fn(),
  trace: jest.fn()
};

const WRONG_ERA_ERROR =
  'TextEnvelope decode error: DecoderErrorDeserialiseFailure "Shelley Tx" (DeserialiseFailure 102 "expected word")';
describe('CardanoNode CLI', () => {
  it('Should retry if an era mismatch', async () => {
    const executor = jest.fn();
    executor
      .mockRejectedValueOnce({
        stderr: WRONG_ERA_ERROR
      })
      .mockResolvedValueOnce({
        stdout: 'transactionhash',
        failed: false
      });
    // eslint-disable-next-line no-magic-numbers
    const cli = configure('/path', 3, executor);
    await cli.submitTransaction(logger, 'deadbeefdeadbeef', true);
    // eslint-disable-next-line no-magic-numbers
    expect(executor).toBeCalledTimes(2);
  });

  it('Should throw an error if eras are not supported', async () => {
    const executor = jest.fn();
    executor.mockRejectedValue({
      stderr: WRONG_ERA_ERROR
    });
    // eslint-disable-next-line no-magic-numbers
    const cli = configure('/path', 3, executor);
    await expect(cli.submitTransaction(logger, 'deadbeefdeadbeef', true)).rejects.toThrow(
      // eslint-disable-next-line quotes
      "Transaction wasn't processed. Era not supported."
    );
    // eslint-disable-next-line no-magic-numbers
    expect(executor).toBeCalledTimes(2);
  });

  it('Should execute a single call if no errors', async () => {
    const executor = jest.fn();
    executor.mockResolvedValueOnce({
      stdout: 'transactionhash'
    });
    // eslint-disable-next-line no-magic-numbers
    const cli = configure('/path', 3, executor);
    await cli.submitTransaction(logger, 'deadbeefdeadbeef', true);
    // eslint-disable-next-line no-magic-numbers
    expect(executor).toBeCalledTimes(1);
  });

  it('Should throw and error and fail is not related to era mismatch', async () => {
    const executor = jest.fn();
    const error =
      'Error while submitting tx: ApplyTxError [LedgerFailure (UtxowFailure (UtxoFailure (ValueNotConservedUTxO (Value 20000000 (fromList [(PolicyID {policyID = ScriptHash "9e2a4681f2e26df0312e4960584a2c56e1c1206d4d621a4648f0ff97"},fromList [("cats",5),("dogs",5)])])) (Value 20000000 (fromList [(PolicyID {policyID = ScriptHash "9e2a4681f2e26df0312e4960584a2c56e1c1206d4d621a4648f0ff97"},fromList [("",5),("\\202",5)])])))))]]}';
    executor.mockRejectedValue({
      stderr: error
    });
    // eslint-disable-next-line no-magic-numbers
    const cli = configure('/path', 3, executor);
    await expect(cli.submitTransaction(logger, 'deadbeefdeadbeef', true)).rejects.toThrow(error);
    // eslint-disable-next-line no-magic-numbers
    expect(executor).toBeCalledTimes(1);
  });

  it('Should throw if command fails after an era mismatch', async () => {
    const executor = jest.fn();
    const error =
      'Error while submitting tx: ApplyTxError [LedgerFailure (UtxowFailure (UtxoFailure (ValueNotConservedUTxO (Value 20000000 (fromList [(PolicyID {policyID = ScriptHash "9e2a4681f2e26df0312e4960584a2c56e1c1206d4d621a4648f0ff97"},fromList [("cats",5),("dogs",5)])])) (Value 20000000 (fromList [(PolicyID {policyID = ScriptHash "9e2a4681f2e26df0312e4960584a2c56e1c1206d4d621a4648f0ff97"},fromList [("",5),("\\202",5)])])))))]]}';
    executor
      .mockRejectedValueOnce({
        stderr:
          'TextEnvelope decode error: DecoderErrorDeserialiseFailure "Shelley Tx" (DeserialiseFailure 102 "expected word")'
      })
      .mockRejectedValue({
        stderr: error
      });
    // eslint-disable-next-line no-magic-numbers
    const cli = configure('/path', 3, executor);
    await expect(cli.submitTransaction(logger, 'deadbeefdeadbeef', true)).rejects.toThrow(error);
    // eslint-disable-next-line no-magic-numbers
    expect(executor).toBeCalledTimes(2);
  });
});
