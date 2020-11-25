/* eslint-disable camelcase */
import { Pool } from 'pg';
import { FastifyInstance } from 'fastify';
import StatusCodes from 'http-status-codes';
import { setupDatabase, setupServer, testInvalidNetworkParameters } from '../utils/test-utils';
import { CARDANO, MAINNET } from '../../../src/server/utils/constants';
import { generateNetworkPayload } from './common';
import { latestBlockIdentifier } from '../fixture-data';

const NETWORK_STATUS_ENDPOINT = '/network/status';
const peers = [{ peer_id: 'relays-new.cardano-mainnet.iohk.io' }];
const genesis_block_identifier = {
  hash: '5f20df933584822601f9e3f8c024eb5eb252fe8cefb24d1317dc3d432e940ebb',
  index: 0 // FIXME this is not ok
};

describe('/network/status endpoint', () => {
  let database: Pool;
  let server: FastifyInstance;
  beforeAll(async () => {
    database = setupDatabase(false);
    server = setupServer(database);
  });

  afterAll(async () => {
    await database.end();
  });

  // eslint-disable-next-line max-len
  test('If requested with valid payload, it should properly return an object containing proper status information', async () => {
    const response = await server.inject({
      method: 'post',
      url: NETWORK_STATUS_ENDPOINT,
      payload: generateNetworkPayload(CARDANO, MAINNET)
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json().genesis_block_identifier).toEqual(genesis_block_identifier);
    expect(response.json().current_block_identifier).toEqual(latestBlockIdentifier);
    expect(response.json().peers).toEqual(peers);
  });

  testInvalidNetworkParameters(
    NETWORK_STATUS_ENDPOINT,
    (blockchain, network) => generateNetworkPayload(blockchain, network),
    () => server
  );
});
