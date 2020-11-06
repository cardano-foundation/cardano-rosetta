/* eslint-disable camelcase */
import { Pool } from 'pg';
import { FastifyInstance } from 'fastify';
import StatusCodes from 'http-status-codes';
import { setupDatabase, setupServer, testInvalidNetworkParameters } from '../utils/test-utils';

const CONSTRUCTION_DERIVE_ENDPOINT = '/construction/derive';
const INVALID_PUBLIC_KEY_FORMAT = 'Invalid public key format';

type PublicKey = {
  hex_bytes: string;
  curve_type: string;
};

type DeriveMetadata = {
  staking_credential?: PublicKey;
  address_type?: string;
};

const generateMetadata = (addressType?: string, stakingKey?: string, curveType?: string): DeriveMetadata => {
  const metadata: DeriveMetadata = {};
  if (addressType) metadata.address_type = addressType;
  if (stakingKey)
    metadata.staking_credential = {
      hex_bytes: stakingKey,
      curve_type: curveType || 'edwards25519'
    };
  return metadata;
};

type GeneratePayloadInput = {
  blockchain: string;
  network: string;
  key?: string;
  curveType?: string;
  type?: string;
  stakingKey?: string;
};

type DerivePayload = {
  network_identifier: {
    blockchain: string;
    network: string;
  };
  public_key: PublicKey;
  metadata?: DeriveMetadata;
};

const generatePayload = ({
  blockchain,
  network,
  key,
  curveType,
  type,
  stakingKey
}: GeneratePayloadInput): DerivePayload => ({
  network_identifier: {
    blockchain,
    network
  },
  public_key: {
    hex_bytes: key || '1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F',
    curve_type: curveType || 'edwards25519'
  },
  metadata: generateMetadata(type, stakingKey, curveType)
});

describe(CONSTRUCTION_DERIVE_ENDPOINT, () => {
  let database: Pool;
  let server: FastifyInstance;

  beforeAll(async () => {
    database = setupDatabase(true);
    server = setupServer(database);
  });

  afterAll(async () => {
    await database.end();
  });

  // eslint-disable-next-line max-len
  test('Should return the address corresponding to the public key and mainnet network when providing a valid public key', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_DERIVE_ENDPOINT,
      payload: generatePayload({ blockchain: 'cardano', network: 'mainnet' })
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json().address).toEqual('addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx');
  });

  test('Should return an error when the public key has a lower length than 32', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_DERIVE_ENDPOINT,
      payload: generatePayload({ blockchain: 'cardano', network: 'mainnet', key: 'smallPublicKey' })
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({ code: 4007, message: INVALID_PUBLIC_KEY_FORMAT, retriable: false });
  });

  test('Should return an error when the public key has a bigger length than 32', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_DERIVE_ENDPOINT,
      payload: generatePayload({
        blockchain: 'cardano',
        network: 'mainnet',
        key: 'ThisIsABiggerPublicKeyForTestingPurposesThisIsABiggerPublicKeyForTestingPurposes'
      })
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({ code: 4007, message: INVALID_PUBLIC_KEY_FORMAT, retriable: false });
  });

  testInvalidNetworkParameters(
    CONSTRUCTION_DERIVE_ENDPOINT,
    (blockchain, network) => generatePayload({ blockchain, network }),
    () => server
  );

  test('Should return an error when the curve type is invalid', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_DERIVE_ENDPOINT,
      payload: generatePayload({
        blockchain: 'cardano',
        network: 'mainnet',
        key: '1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F',
        curveType: 'secp256k1'
      })
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({ code: 4007, message: INVALID_PUBLIC_KEY_FORMAT, retriable: false });
  });

  test('Should return an error when the address has an invalid format', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_DERIVE_ENDPOINT,
      payload: generatePayload({
        blockchain: 'cardano',
        network: 'mainnet',
        key: '1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F__'
      })
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({ code: 4007, message: INVALID_PUBLIC_KEY_FORMAT, retriable: false });
  });

  test('Should return an error when the staking key has an invalid format', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_DERIVE_ENDPOINT,
      payload: generatePayload({
        blockchain: 'cardano',
        network: 'mainnet',
        type: 'Enterprise',
        stakingKey: '1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F__'
      })
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({ code: 4007, message: INVALID_PUBLIC_KEY_FORMAT, retriable: false });
  });
});
