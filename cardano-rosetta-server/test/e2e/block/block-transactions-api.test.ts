/* eslint-disable no-magic-numbers */
import { FastifyInstance } from 'fastify';
import StatusCodes from 'http-status-codes';
import { Pool } from 'pg';
import {
  block23236WithTransactions,
  launchpad235546WithPoolRegistration,
  transaction344050WithTokenBundle,
  transaction987aOnGenesis,
  transactionBlock4490558WithRegistrations,
  transactionBlock4490559WithDelegation,
  transactionBlock4597861WithWithdrawals,
  transactionBlock4853177WithDeregistration,
  transactionBlock4853177WithPoolRetirement,
  launchpad236643PoolRegistrationWithSeveralOwners
} from '../fixture-data';
import { setupDatabase, setupServer } from '../utils/test-utils';

const TRANSACTION_NOT_FOUND = 'Transaction not found';

const generatePayload = (index?: number, hash?: string, blockchain?: string, network?: string) => ({
  // eslint-disable-next-line camelcase
  network_identifier: {
    blockchain: blockchain || 'cardano',
    network: network || 'mainnet'
  },
  // eslint-disable-next-line camelcase
  block_identifier: {
    index,
    hash
  }
});

describe('/block/transactions endpoint', () => {
  let database: Pool;
  let server: FastifyInstance;
  let multiassetsDatabase: Pool;
  let serverWithMultiassetsSupport: FastifyInstance;
  beforeAll(async () => {
    database = setupDatabase();
    server = setupServer(database);

    multiassetsDatabase = setupDatabase(process.env.DB_CONNECTION_STRING, 'launchpad');
    serverWithMultiassetsSupport = setupServer(multiassetsDatabase);
  });

  afterAll(async () => {
    await database.end();
  });

  const BLOCK_TRANSACTION_ENDPOINT = '/block/transaction';
  test('should return the transaction if a valid hash is sent', async () => {
    const { index, hash } = block23236WithTransactions.block.block_identifier;
    const [transaction] = block23236WithTransactions.block.transactions;
    const response = await server.inject({
      method: 'post',
      url: BLOCK_TRANSACTION_ENDPOINT,
      payload: {
        ...generatePayload(index, hash),
        // eslint-disable-next-line camelcase
        transaction_identifier: {
          hash: transaction.transaction_identifier.hash
        }
      }
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({ transaction });
  });

  test('should return an error if the transaction doesnt exist', async () => {
    const { index, hash } = block23236WithTransactions.block.block_identifier;
    const response = await server.inject({
      method: 'post',
      url: BLOCK_TRANSACTION_ENDPOINT,
      payload: {
        ...generatePayload(index, hash),
        // eslint-disable-next-line camelcase
        transaction_identifier: {
          // Last digit was changed from 4 to 5
          hash: 'abbeb108ebc3990c7f031113bcb8ce8f306a1eec8f313acffcdcd256379208f5'
        }
      }
    });

    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({ code: 4006, message: TRANSACTION_NOT_FOUND, retriable: false });
  });
  test('should fail if incorrect network identifier is sent', async () => {
    const { index, hash } = block23236WithTransactions.block.block_identifier;
    const [transaction] = block23236WithTransactions.block.transactions;
    const response = await server.inject({
      method: 'post',
      url: BLOCK_TRANSACTION_ENDPOINT,
      payload: {
        ...generatePayload(index, hash),
        // eslint-disable-next-line camelcase
        network_identifier: {
          blockchain: 'cardano',
          network: 'testnet'
        },
        // eslint-disable-next-line camelcase
        transaction_identifier: {
          hash: transaction.transaction_identifier.hash
        }
      }
    });

    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({ message: 'Network not found', code: 4002, retriable: false });
  });
  test('should fail if incorrect blockchain identifier is sent', async () => {
    const { index, hash } = block23236WithTransactions.block.block_identifier;
    const [transaction] = block23236WithTransactions.block.transactions;
    const response = await server.inject({
      method: 'post',
      url: BLOCK_TRANSACTION_ENDPOINT,
      payload: {
        ...generatePayload(index, hash),
        // eslint-disable-next-line camelcase
        network_identifier: {
          blockchain: 'incorrect',
          network: 'mainnet'
        },
        // eslint-disable-next-line camelcase
        transaction_identifier: {
          hash: transaction.transaction_identifier.hash
        }
      }
    });

    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({ message: 'Invalid blockchain', code: 4004, retriable: false });
  });

  test('should fail if requested block index does not correspond to requested block hash', async () => {
    const { hash } = block23236WithTransactions.block.block_identifier;
    const [transaction] = block23236WithTransactions.block.transactions;
    const response = await server.inject({
      method: 'post',
      url: BLOCK_TRANSACTION_ENDPOINT,
      payload: {
        ...generatePayload(1234, hash),
        // eslint-disable-next-line camelcase
        transaction_identifier: {
          hash: transaction.transaction_identifier.hash
        }
      }
    });

    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({ message: TRANSACTION_NOT_FOUND, code: 4006, retriable: false });
  });
  test('should fail if requested block hash does not correspond to requested block index', async () => {
    const { index } = block23236WithTransactions.block.block_identifier;
    const [transaction] = block23236WithTransactions.block.transactions;
    const response = await server.inject({
      method: 'post',
      url: BLOCK_TRANSACTION_ENDPOINT,
      payload: {
        ...generatePayload(index, 'fakeHash'),
        // eslint-disable-next-line camelcase
        transaction_identifier: {
          hash: transaction.transaction_identifier.hash
        }
      }
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({ message: TRANSACTION_NOT_FOUND, code: 4006, retriable: false });
  });

  test('should return transaction for genesis block when requested', async () => {
    const genesisIndex = 0;
    const genesisHash = '5f20df933584822601f9e3f8c024eb5eb252fe8cefb24d1317dc3d432e940ebb';
    const transaction = '927edb96f3386ab91b5f5d85d84cb4253c65b1c2f65fa7df25f81fab1d62987a';
    const response = await server.inject({
      method: 'post',
      url: BLOCK_TRANSACTION_ENDPOINT,
      payload: {
        ...generatePayload(genesisIndex, genesisHash),
        // eslint-disable-next-line camelcase
        transaction_identifier: {
          hash: transaction
        }
      }
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual(transaction987aOnGenesis);
  });

  test('should return transaction withdrawals', async () => {
    const transaction = '2974845ecc7e02e86285d32961c69f3945662a80d5e2caae8a1086e652936f42';
    const response = await server.inject({
      method: 'post',
      url: BLOCK_TRANSACTION_ENDPOINT,
      payload: {
        ...generatePayload(4597861, 'e73be90cd5e2b0bf3acb86e3bed575931ab0ff1e7d5bfca94cff6166ef010060'),
        // eslint-disable-next-line camelcase
        transaction_identifier: {
          hash: transaction
        }
      }
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual(transactionBlock4597861WithWithdrawals);
  });

  test('should return transaction registrations', async () => {
    const transaction = '91f88c21679fdc95cb0712dc8a755eab20fdf9e919871c3c668515c830572090';
    const response = await server.inject({
      method: 'post',
      url: BLOCK_TRANSACTION_ENDPOINT,
      payload: {
        ...generatePayload(4490558, '600fc0fc8b9d4bcb777536cd9168703d0645ab4986fe8d3bdae4011ad0ee5919'),
        // eslint-disable-next-line camelcase
        transaction_identifier: {
          hash: transaction
        }
      }
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual(transactionBlock4490558WithRegistrations);
  });

  test('should return transaction delegations', async () => {
    const transaction = 'f0024159d124a128db522031c4a3e7b255ee511600afa92ff52b2504702e4e1d';
    const response = await server.inject({
      method: 'post',
      url: BLOCK_TRANSACTION_ENDPOINT,
      payload: {
        ...generatePayload(4490559, 'd5c4088f55024cb5a087c1588ff362d6c5c1a95ada0608044192c320b41c5987'),
        // eslint-disable-next-line camelcase
        transaction_identifier: {
          hash: transaction
        }
      }
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual(transactionBlock4490559WithDelegation);
  });

  test('should return transaction deregistrations', async () => {
    const transaction = '5fe53eece38ff4eb102c33c6cbdf34947c8232eefaae0731fdf8f746b81763fc';
    const response = await server.inject({
      method: 'post',
      url: BLOCK_TRANSACTION_ENDPOINT,
      payload: {
        ...generatePayload(4853177, '6713e3dbea2a037f0be9401744a8b2be4c6190294a23c496165c212972a82f61'),
        // eslint-disable-next-line camelcase
        transaction_identifier: {
          hash: transaction
        }
      }
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual(transactionBlock4853177WithDeregistration);
  });

  test('should return a pool retirement transaction', async () => {
    const transaction = 'dcbff41c50c5b4012d49be5be75b11a0c5289515258ef4cf108eb6ec4ed5f37a';
    const response = await serverWithMultiassetsSupport.inject({
      method: 'post',
      url: BLOCK_TRANSACTION_ENDPOINT,
      payload: {
        ...generatePayload(236746, 'b389d1c4975563bf4199afeaa1434dfd1b406e30ac4eda884a03ecef8cd0a87a'),
        // eslint-disable-next-line camelcase
        transaction_identifier: {
          hash: transaction
        }
      }
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual(transactionBlock4853177WithPoolRetirement);
  });

  test('should be able to return multiasset token transactions with several tokens in the bundle', async () => {
    const transaction = '863783d4460647b8227411eb7b0cf8fac82c29f6f4ac52baf7e4d74fabb7884b';
    const response = await serverWithMultiassetsSupport.inject({
      method: 'post',
      url: BLOCK_TRANSACTION_ENDPOINT,
      payload: {
        ...generatePayload(344050, '50dfb1d3d82d89d392d3c5118e43d60146a37eea0d6fe81bf475133e21b6d82f'),
        // eslint-disable-next-line camelcase
        transaction_identifier: {
          hash: transaction
        }
      }
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({ transaction: transaction344050WithTokenBundle });
  });

  test('should return transaction pool registrations', async () => {
    const transaction = '2468895f6f8e7b00a298aab49647712ff55b453e35d14e32f737691a014c26eb';
    const response = await serverWithMultiassetsSupport.inject({
      method: 'post',
      url: BLOCK_TRANSACTION_ENDPOINT,
      payload: {
        ...generatePayload(235546, 'beb6a8ac14ec7f51ef63f0db92ec4e7e03236f2b664b80fda568fba15191ab72'),
        // eslint-disable-next-line camelcase
        transaction_identifier: {
          hash: transaction
        }
      }
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual(launchpad235546WithPoolRegistration);
  });
  test('should return transaction pool registrations with several owners', async () => {
    const transaction = 'ea8e02abc93b863c386d25e31132866ddd61703f913b71d22af7d51843dd2bbe';
    const response = await serverWithMultiassetsSupport.inject({
      method: 'post',
      url: BLOCK_TRANSACTION_ENDPOINT,
      payload: {
        ...generatePayload(279711, 'f9db8c8da4fd42fb19f7c7f8b627faf3122dc63d3bd5b85172c5141c009fc2c0'),
        // eslint-disable-next-line camelcase
        transaction_identifier: {
          hash: transaction
        }
      }
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual(launchpad236643PoolRegistrationWithSeveralOwners);
  });
});
