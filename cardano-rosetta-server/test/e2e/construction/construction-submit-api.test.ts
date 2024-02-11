/* eslint-disable max-len */
/* eslint-disable no-magic-numbers */
/* eslint-disable camelcase */
import StatusCodes from 'http-status-codes';
import { Pool } from 'pg';
import { FastifyInstance } from 'fastify';
import { cardanoCliMock, setupOfflineDatabase, setupServer } from '../utils/test-utils';
import { Errors } from '../../../src/server/utils/errors';
import {
  CONSTRUCTION_SIGNED_TRANSACTION_WITH_EXTRA_DATA,
  CONSTRUCTION_SIGNED_TRANSACTION_WITH_EXTRA_DATA_INVALID_TTL,
  INVALID_CONSTRUCTION_SIGNED_TRANSACTION_WITH_EXTRA_DATA
} from '../fixture-data';

const CONSTRUCTION_SUBMIT_ENDPOINT = '/construction/submit';

const generatePayloadWithSignedTransaction = (blockchain: string, network: string, signedTransaction: string) => ({
  network_identifier: { blockchain, network },
  signed_transaction: signedTransaction
});

const ERROR_WHEN_CALLING_CARDANO_CLI = 'Error when calling cardano-cli';
const ERROR_OUTSIDE_VALIDITY_INTERVAL_UTXO = 'Error when sending the transaction - OutsideValidityIntervalUTxO';

describe(CONSTRUCTION_SUBMIT_ENDPOINT, () => {
  let database: Pool;
  let server: FastifyInstance;

  beforeAll(async () => {
    database = setupOfflineDatabase();
    server = setupServer(database);
  });

  afterAll(async () => {
    await database.end();
  });

  it('Should return an error if an invalid network is sent', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_SUBMIT_ENDPOINT,
      payload: generatePayloadWithSignedTransaction(
        'cardano',
        'preprod',
        // eslint-disable-next-line max-len
        '83a400818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018182581d61a6274badf4c9ca583df893a73139625ff4dc73aaa3082e67d6d5d08e0102182a030aa10081825820e7d33eeb6f1df124f9f4c226428bc46b4c93ac4bc89dacc85748d1a2b47ded135840f39ee9a72d5de64b5a8ccffb7830cd7af4438944ffb16698f7e3b3a11ae684e14f213c5ac38a50852bf1d531f13f02fc0510610f7b549bec10d01dfe81ee080ef6'
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({ ...Errors.NETWORK_NOT_FOUND, retriable: false });
  });

  it('Should return an error if an invalid network is sent', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_SUBMIT_ENDPOINT,
      payload: generatePayloadWithSignedTransaction(
        'bitcoin',
        'mainnet',
        // eslint-disable-next-line max-len
        '83a400818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018182581d61a6274badf4c9ca583df893a73139625ff4dc73aaa3082e67d6d5d08e0102182a030aa10081825820e7d33eeb6f1df124f9f4c226428bc46b4c93ac4bc89dacc85748d1a2b47ded135840f39ee9a72d5de64b5a8ccffb7830cd7af4438944ffb16698f7e3b3a11ae684e14f213c5ac38a50852bf1d531f13f02fc0510610f7b549bec10d01dfe81ee080ef6'
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({ ...Errors.INVALID_BLOCKCHAIN, retriable: false });
  });

  it('Should return the transaction identifier is request is valid', async () => {
    const mock = cardanoCliMock.submitTransaction as jest.Mock;
    mock.mockClear();
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_SUBMIT_ENDPOINT,
      payload: generatePayloadWithSignedTransaction(
        'cardano',
        'mainnet',
        CONSTRUCTION_SIGNED_TRANSACTION_WITH_EXTRA_DATA
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(mock.mock.calls.length).toBe(1);
    expect(response.json()).toEqual({
      transaction_identifier: { hash: '333a6ccaaa639f7b451ce93764f54f654ef499fdb7b8b24374ee9d99eab9d795' }
    });
  });

  it('Should return an error if there is a problem when sending the transaction', async () => {
    const mock = cardanoCliMock.submitTransaction as jest.Mock;
    mock.mockClear();
    mock.mockImplementation(() => {
      throw new Error(ERROR_WHEN_CALLING_CARDANO_CLI);
    });
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_SUBMIT_ENDPOINT,
      payload: generatePayloadWithSignedTransaction(
        'cardano',
        'mainnet',
        CONSTRUCTION_SIGNED_TRANSACTION_WITH_EXTRA_DATA
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect((cardanoCliMock.submitTransaction as jest.Mock).mock.calls.length).toBe(1);
    expect(response.json()).toEqual({
      code: 5006,
      details: {
        message: `Error: ${ERROR_WHEN_CALLING_CARDANO_CLI}`
      },
      message: 'Error when sending the transaction',
      retriable: true
    });
  });

  it('Should return an non retriable error if there is OutsideValidityIntervalUTxO error from the node', async () => {
    const mock = cardanoCliMock.submitTransaction as jest.Mock;
    mock.mockClear();
    mock.mockImplementation(() => {
      throw new Error(ERROR_OUTSIDE_VALIDITY_INTERVAL_UTXO);
    });
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_SUBMIT_ENDPOINT,
      payload: generatePayloadWithSignedTransaction(
        'cardano',
        'mainnet',
        CONSTRUCTION_SIGNED_TRANSACTION_WITH_EXTRA_DATA_INVALID_TTL
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect((cardanoCliMock.submitTransaction as jest.Mock).mock.calls.length).toBe(1);
    expect(response.json()).toEqual({
      code: 4037,
      message: ERROR_OUTSIDE_VALIDITY_INTERVAL_UTXO,
      retriable: false
    });
  });

  it('Should return an error and not submit the transaction when there is an error getting transaction hash', async () => {
    const mock = cardanoCliMock.submitTransaction as jest.Mock;
    mock.mockClear();
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_SUBMIT_ENDPOINT,
      payload: generatePayloadWithSignedTransaction(
        'cardano',
        'mainnet',
        INVALID_CONSTRUCTION_SIGNED_TRANSACTION_WITH_EXTRA_DATA
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect((cardanoCliMock.submitTransaction as jest.Mock).mock.calls.length).toBe(0);
    expect(response.json()).toEqual({ ...Errors.PARSE_SIGNED_TRANSACTION_ERROR, retriable: false });
  });
});
