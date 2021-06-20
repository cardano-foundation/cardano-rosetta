import { ErrorFactory, Errors, ErrorUtils, nodeOutputToError } from '../../../src/server/utils/errors';

describe('Node to Rosetta error (ApiError) mapper test', () => {
  const errors: nodeOutputToError[] = [
    {
      error: Errors.OUTSIDE_VALIDITY_INTERVAL_UTXO,
      inputPattern: new RegExp('OutsideValidityIntervalUTxO'),
      retriable: false
    }
  ];

  it('should resolve ApiError from node error', async () => {
    const resolved = ErrorUtils.resolveApiErrorFromNodeSourced('OutsideValidityIntervalUTxO', errors);

    await expect(resolved).resolves.toEqual(ErrorFactory.sendOutsideValidityIntervalUtxoError());
  });

  it('should not resolve ApiError from node error', async () => {
    const resolved = ErrorUtils.resolveApiErrorFromNodeSourced('Some', errors);

    await expect(resolved).rejects.toMatch('error not found');
  });
});
