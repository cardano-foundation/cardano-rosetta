/* eslint-disable no-magic-numbers */
import { FastifyInstance } from 'fastify';
import StatusCodes from 'http-status-codes';
import { Pool } from 'pg';
import {
  block23236WithTransactions,
  transactionWithPoolRegistration,
  transaction5407534WithTokenBundle,
  transaction987aOnGenesis,
  transactionBlock4490558WithRegistrations,
  transactionBlock4490559WithDelegation,
  transactionBlock4597861WithWithdrawals,
  transactionBlock4853177WithDeregistration,
  transactionBlock4853177WithPoolRetirement,
  transactionWithPoolRegistrationWithMultipleOwners,
  transactionWithBadFormedVote,
  transactionWithVoteOperation
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
  beforeAll(async () => {
    database = setupDatabase();
    server = setupServer(database);
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
          network: 'preprod'
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
    const transaction = '896cf8fefad1eaf0fa056ba3adf28bfb26b06d1beed64cf790deb595dcb2687a';
    const response = await server.inject({
      method: 'post',
      url: BLOCK_TRANSACTION_ENDPOINT,
      payload: {
        ...generatePayload(4491210, 'ddb008b4a1cad00db90f524b5ba94da94f84b2aabe7de6ff4a0d27d89ed222dd'),
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
    const transaction = '8d67291066037f46f092bfc098241cc7143fa1ec2b14b6c23b945878ccf9fe0f';
    const response = await server.inject({
      method: 'post',
      url: BLOCK_TRANSACTION_ENDPOINT,
      payload: {
        ...generatePayload(5407534, '6d48a3e7af71698268ea3efaf67a2f012e237b19e10131eb77cd22448fd4183c'),
        // eslint-disable-next-line camelcase
        transaction_identifier: {
          hash: transaction
        }
      }
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({ transaction: transaction5407534WithTokenBundle });
  });

  test('should return transaction pool registrations', async () => {
    const transaction = '29a76dd58c6309cd9cde855c0c50d81d63f921959359b1e544401ac1dbc9b472';
    const response = await server.inject({
      method: 'post',
      url: BLOCK_TRANSACTION_ENDPOINT,
      payload: {
        ...generatePayload(4597779, '8839b697618eb1b3167bcd2658e10008d9c1d11bd32b305abf497371cd79dafa'),
        // eslint-disable-next-line camelcase
        transaction_identifier: {
          hash: transaction
        }
      }
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual(transactionWithPoolRegistration);
  });

  test('should return transaction pool registrations with multiple owners', async () => {
    const transaction = '51d67e194d749df2abf4e2e11cea63ca6e1c630042a366f555939e795a6ddecf';
    const response = await server.inject({
      method: 'post',
      url: BLOCK_TRANSACTION_ENDPOINT,
      payload: {
        ...generatePayload(4490593, 'a5f1a0e14e1ca218fd07e1601792545945c8cb552d7978967e230d6d3b2710fd'),
        // eslint-disable-next-line camelcase
        transaction_identifier: {
          hash: transaction
        }
      }
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual(transactionWithPoolRegistrationWithMultipleOwners);
  });

  // TODO: deprecated. pending to be implemented
  // test('should return operation status as invalid when there is an invalid transaction', async () => {
  //   const invalidTxHash = '0c2d516c9eaf0d9f641506f1f64be3f660a49e622f4651ed1b19d6edeaefaf4c';
  //   const blockNumber = 25050;
  //   const blockHash = '1f58250b82bc7c7c408028ba01173bdfa37fc82dde34060c5b49a3ea644d9439';

  //   const response = await serverWithAlonzoSupport.inject({
  //     method: 'post',
  //     url: BLOCK_TRANSACTION_ENDPOINT,
  //     payload: {
  //       ...generatePayload(blockNumber, blockHash),
  //       // eslint-disable-next-line camelcase
  //       transaction_identifier: {
  //         hash: invalidTxHash
  //       }
  //     }
  //   });

  //   expect(response.statusCode).toEqual(StatusCodes.OK);
  //   expect(response.json()).toEqual(invalidAlonzoTransaction);
  // });

  test('should return vote registration operations', async () => {
    const txHash = 'adeb7b6845f3f4b0e74275588412cf00912b615e4bbf76d111326ce899260c59';
    const blockNumber = 5593749;
    const blockHash = '1c42fd317888b2aafe9f84787fdd3b90b95be06687a217cf4e6ca95130157eb5';

    const response = await server.inject({
      method: 'post',
      url: BLOCK_TRANSACTION_ENDPOINT,
      payload: {
        ...generatePayload(blockNumber, blockHash),
        // eslint-disable-next-line camelcase
        transaction_identifier: {
          hash: txHash
        }
      }
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual(transactionWithVoteOperation);
  });

  test('should not return a vote registration operation when it is bad formed', async () => {
    const txHash = 'cacbc12afa3a1d2ec0186971d5c9035c79bfa1250ca7a6af580d1b8d9e04db8c';
    const blockNumber = 5406810;
    const blockHash = '0cea06f7b3003a5c0efc27fff117fa9e2a08603e1b0049c3b5c719abf6a617f1';

    const response = await server.inject({
      method: 'post',
      url: BLOCK_TRANSACTION_ENDPOINT,
      payload: {
        ...generatePayload(blockNumber, blockHash),
        // eslint-disable-next-line camelcase
        transaction_identifier: {
          hash: txHash
        }
      }
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual(transactionWithBadFormedVote);
  });
});
