/* eslint-disable camelcase */
import StatusCodes from 'http-status-codes';
import { Pool } from 'pg';
import { FastifyInstance } from 'fastify';
import { setupDatabase, setupServer } from '../utils/test-utils';
import {
  CONSTRUCTION_COMBINE_PAYLOAD,
  CONSTRUCTION_INVALID_TRANSACTION,
  CONSTRUCTION_SIGNED_TRANSACTION_WITH_EXTRADATA
} from '../fixture-data';
import { SIGNATURE_TYPE } from '../../../src/server/utils/constants';

const CONSTRUCTION_COMBINE_ENDPOINT = '/construction/combine';

describe(CONSTRUCTION_COMBINE_ENDPOINT, () => {
  let database: Pool;
  let server: FastifyInstance;

  beforeAll(async () => {
    database = setupDatabase(true);
    server = setupServer(database);
  });

  afterAll(async () => {
    await database.end();
  });

  test('Should return signed transaction when providing valid unsigned transaction and signatures', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_COMBINE_ENDPOINT,
      payload: CONSTRUCTION_COMBINE_PAYLOAD
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json().signed_transaction).toEqual(CONSTRUCTION_SIGNED_TRANSACTION_WITH_EXTRADATA);
  });

  test('Should return error when providing valid unsigned transaction but invalid signatures', async () => {
    const payload = {
      network_identifier: {
        blockchain: 'cardano',
        network: 'mainnet'
      },
      unsigned_transaction:
        // eslint-disable-next-line max-len
        'a4008182582010c3c63f2a97ce531730fd2bd708cda1eb08920f79d2abeeb833c7089f13c54e00018182582b82d818582183581c0b40138c75daebf910edf9cb34024528cab10c74ed2a897c37b464b0a0001a777c6af614021a0002b4f60314',
      signatures: [
        {
          signing_payload: {
            address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkx',
            hex_bytes: '31fc9813a71d8db12a4f2e3382ab0671005665b70d0cd1a9fb6c4a4e9ceabc90',
            signature_type: SIGNATURE_TYPE
          },
          public_key: {
            hex_bytes: '58201b400d60aaf34eaf6dcbab9bba46001a23497886cf11066f7846933d30e5ad3f',
            curve_type: 'edwards25519'
          },
          signature_type: SIGNATURE_TYPE,
          hex_bytes: 'signatureHexInvalidBytes'
        }
      ]
    };
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_COMBINE_ENDPOINT,
      payload
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 5005,
      message: 'Cant build witnesses set for transaction probably because of provided signatures',
      retriable: false
    });
  });

  test('Should return error when providing valid signatures but invalid transactions', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_COMBINE_ENDPOINT,
      payload: { ...CONSTRUCTION_COMBINE_PAYLOAD, unsigned_transaction: CONSTRUCTION_INVALID_TRANSACTION }
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 5004,
      message: 'Cant create signed transaction probably because of unsigned transaction bytes',
      retriable: false
    });
  });
});
