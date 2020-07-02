/* eslint-disable camelcase */
import blockSerice from '../src/server/services/block-service';

test('Example test', async () => {
  await blockSerice.block({ network_identifier: { blockchain: '', network: '' }, block_identifier: { index: 0 } });
  expect(true).toBeTruthy;
});
