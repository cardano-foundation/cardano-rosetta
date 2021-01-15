/* eslint-disable camelcase */
import { FastifyInstance } from 'fastify';
import StatusCodes from 'http-status-codes';
import { Pool } from 'pg';
import { setupOfflineDatabase, setupServer, testInvalidNetworkParameters } from '../utils/test-utils';

const CONSTRUCTION_DERIVE_ENDPOINT = '/construction/derive';
const INVALID_PUBLIC_KEY_FORMAT = 'Invalid public key format';
const INVALID_STAKING_KEY_FORMAT = 'Invalid staking key format';
const STAKING_KEY_MISSING = 'Staking key is required for this type of address';
const INVALID_ADDRESS_TYPE = 'Provided address type is invalid';

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
    database = setupOfflineDatabase();
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
    expect(response.json()).toEqual({ code: 4017, message: INVALID_STAKING_KEY_FORMAT, retriable: false });
  });

  test('Should return an error when the address type has an invalid value', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_DERIVE_ENDPOINT,
      payload: generatePayload({
        blockchain: 'cardano',
        network: 'mainnet',
        type: 'Invalid',
        stakingKey: '1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F'
      })
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({ code: 4016, message: INVALID_ADDRESS_TYPE, retriable: true });
  });

  // eslint-disable-next-line max-len
  test('Should return the Base address corresponding to the public key, staking key and mainnet network when providing valid keys', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_DERIVE_ENDPOINT,
      payload: generatePayload({
        blockchain: 'cardano',
        network: 'mainnet',
        type: 'Base',
        key: '159abeeecdf167ccc0ea60b30f9522154a0d74161aeb159fb43b6b0695f057b3',
        stakingKey: '964774728c8306a42252adbfb07ccd6ef42399f427ade25a5933ce190c5a8760'
      })
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    // Address generated locally with following command (using private keys attached to issue #198):
    // eslint-disable-next-line max-len
    // cat addr.prv | ./cardano-address key public | ./cardano-address address payment  --network-tag 1 | ./cardano-address address delegation $(cat stake.prv | ./cardano-address key public)
    expect(response.json().address).toEqual(
      'addr1q9dhy809valxaer3nlvg2h5nudd62pxp6lu0cs36zczhfr98y6pah6lvppk8xft57nef6yexqh6rr204yemcmm3emhzsgg4fg0'
    );
  });

  test('Should return an error when the address type is Base but no staking credentials are provided', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_DERIVE_ENDPOINT,
      payload: generatePayload({
        blockchain: 'cardano',
        network: 'mainnet',
        type: 'Base',
        key: '159abeeecdf167ccc0ea60b30f9522154a0d74161aeb159fb43b6b0695f057b3'
      })
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({ code: 4018, message: STAKING_KEY_MISSING, retriable: false });
  });

  // eslint-disable-next-line max-len
  test('Should return the Reward address corresponding to the public key and mainnet network when providing a valid public key', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_DERIVE_ENDPOINT,
      payload: generatePayload({
        blockchain: 'cardano',
        network: 'mainnet',
        type: 'Reward',
        key: '964774728c8306a42252adbfb07ccd6ef42399f427ade25a5933ce190c5a8760'
      })
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    // eslint-disable-next-line max-len
    // https://cardanoscan.io/address/015b721de5677e6ee4719fd8855e93e35ba504c1d7f8fc423a1605748ca72683dbebec086c732574f4f29d132605f431a9f526778dee39ddc5
    expect(response.json().address).toEqual('stake1uxnjdq7ma0kqsmrny460fu5azvnqtap3486jvaudacuam3g3yc4nu');
  });

  test('Should return an error when the staking key has a lower length than 32', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_DERIVE_ENDPOINT,
      payload: generatePayload({ blockchain: 'cardano', network: 'mainnet', stakingKey: 'smallPublicKey' })
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({ code: 4017, message: INVALID_STAKING_KEY_FORMAT, retriable: false });
  });

  test('Should return an error when the staking key has a bigger length than 32', async () => {
    const response = await server.inject({
      method: 'post',
      url: CONSTRUCTION_DERIVE_ENDPOINT,
      payload: generatePayload({
        blockchain: 'cardano',
        network: 'mainnet',
        stakingKey: 'ThisIsABiggerPublicKeyForTestingPurposesThisIsABiggerPublicKeyForTestingPurposes'
      })
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({ code: 4017, message: INVALID_STAKING_KEY_FORMAT, retriable: false });
  });
});
