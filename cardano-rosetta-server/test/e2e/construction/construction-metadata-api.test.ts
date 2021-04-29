/* eslint-disable no-magic-numbers */
/* eslint-disable camelcase */
import StatusCodes from 'http-status-codes';
import { Pool } from 'pg';
import { FastifyInstance } from 'fastify';
import {
  linearFeeParameters,
  setupDatabase,
  setupOfflineDatabase,
  setupServer,
  testInvalidNetworkParameters
} from '../utils/test-utils';
import { latestLaunchpadBlockSlot, TRANSACTION_SIZE_IN_BYTES } from '../fixture-data';

const CONSTRUCTION_METADATA_ENDPOINT = '/construction/metadata';

const generateMetadataPayload = (blockchain: string, network: string, relativeTtl: number) => ({
  network_identifier: {
    blockchain,
    network
  },
  options: {
    relative_ttl: relativeTtl,
    transaction_size: TRANSACTION_SIZE_IN_BYTES
  }
});

describe(CONSTRUCTION_METADATA_ENDPOINT, () => {
  let multiassetsDatabase: Pool;
  let server: FastifyInstance;

  beforeAll(async () => {
    multiassetsDatabase = setupOfflineDatabase();
    server = setupServer(multiassetsDatabase);
  });

  afterAll(async () => {
    await multiassetsDatabase.end();
  });

  beforeAll(async () => {
    multiassetsDatabase = setupDatabase(process.env.DB_CONNECTION_STRING, 'launchpad');
    server = setupServer(multiassetsDatabase);
  });

  test('Should return a valid TTL when the parameters are valid', async () => {
    const relativeTtl = 100;
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_METADATA_ENDPOINT,
      payload: generateMetadataPayload('cardano', 'mainnet', relativeTtl)
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      metadata: {
        ttl: (latestLaunchpadBlockSlot + relativeTtl).toString()
      },
      suggested_fee: [
        {
          currency: {
            decimals: 6,
            symbol: 'ADA'
          },
          // ttl is encoded as 5 bytes but metadaa comes with one already
          value: (
            (TRANSACTION_SIZE_IN_BYTES + 4) * linearFeeParameters.minFeeA +
            linearFeeParameters.minFeeB
          ).toString()
        }
      ]
    });
  });

  testInvalidNetworkParameters(
    CONSTRUCTION_METADATA_ENDPOINT,
    (blockchain, network) => generateMetadataPayload(blockchain, network, 100),
    () => server
  );
});
