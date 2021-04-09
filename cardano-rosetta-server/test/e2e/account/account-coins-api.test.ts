/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable camelcase */
/* eslint-disable no-magic-numbers */
import { FastifyInstance } from 'fastify';
import StatusCodes from 'http-status-codes';
import { Pool } from 'pg';
import { CARDANO, ASSET_NAME_LENGTH, POLICY_ID_LENGTH } from '../../../src/server/utils/constants';
import {
  latestBlockIdentifier,
  latestBlockIdentifierMAServer,
  address1vpfCoins,
  coinIdentifier95e1
} from '../fixture-data';
import { setupDatabase, setupServer } from '../utils/test-utils';

const generatePayload = (
  blockchain: string,
  network: string,
  address: string,
  currencies?: Components.Schemas.Currency[]
) => ({
  // eslint-disable-next-line camelcase
  network_identifier: {
    blockchain,
    network
  },
  account_identifier: { address },
  currencies
});

const ACCOUNT_COINS_ENDPOINT = '/account/coins';

describe('/account/coins endpoint', () => {
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
    await multiassetsDatabase.end();
  });

  test('should only consider coins till latest block', async () => {
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_COINS_ENDPOINT,
      payload: generatePayload(
        CARDANO,
        'mainnet',
        'DdzFFzCqrhsdufpFxByLTQmktKJnTrudktaHq1nK2MAEDLXjz5kbRcr5prHi9gHb6m8pTvhgK6JbFDZA1LTiTcP6g8KuPSF1TfKP8ewp'
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      block_identifier: latestBlockIdentifier,
      coins: [
        {
          coin_identifier: {
            identifier: '4bcf79c0c2967986749fd0ae03f5b54a712d51b35672a3d974707c060c4d8dac:1'
          },
          amount: { value: '10509579714', currency: { decimals: 6, symbol: 'ADA' } }
        },
        {
          coin_identifier: {
            identifier: 'bcc57134d1bd588b00f40142f0fdc17db5f35047e3196cdf26aa7319524c0014:1'
          },
          amount: { value: '999800000', currency: { decimals: 6, symbol: 'ADA' } }
        }
      ]
    });
  });

  test('should return empty if address doesnt exist', async () => {
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_COINS_ENDPOINT,
      payload: generatePayload(CARDANO, 'mainnet', 'fakeAddress')
    });

    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4015,
      message: 'Provided address is invalid',
      retriable: true,
      details: { message: 'fakeAddress' }
    });
  });
  test('should have no coins for an account with zero balance', async () => {
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_COINS_ENDPOINT,
      payload: generatePayload(
        CARDANO,
        'mainnet',
        'DdzFFzCqrhsszHTvbjTmYje5hehGbadkT6WgWbaqCy5XNxNttsPNF13eAjjBHYT7JaLJz2XVxiucam1EvwBRPSTiCrT4TNCBas4hfzic'
      )
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      block_identifier: latestBlockIdentifier,
      coins: []
    });
  });
  test('should no return coins for stake accounts', async () => {
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_COINS_ENDPOINT,
      payload: generatePayload(CARDANO, 'mainnet', 'stake1uyqq2a22arunrft3k9ehqc7yjpxtxjmvgndae80xw89mwyge9skyp')
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      block_identifier: latestBlockIdentifier,
      coins: []
    });
  });

  test('should return coins with multi assets currencies', async () => {
    const response = await serverWithMultiassetsSupport.inject({
      method: 'post',
      url: ACCOUNT_COINS_ENDPOINT,
      payload: generatePayload(CARDANO, 'mainnet', 'addr_test1vpfwv0ezc5g8a4mkku8hhy3y3vp92t7s3ul8g778g5yegsgalc6gc')
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json().block_identifier).toEqual(latestBlockIdentifierMAServer);
    expect(response.json().coins).toHaveLength(address1vpfCoins.length);
    address1vpfCoins.forEach(address1vpfCoin => expect(response.json().coins).toContainEqual(address1vpfCoin));
  });
  test('should return coins for ma with empty name', async () => {
    const response = await serverWithMultiassetsSupport.inject({
      method: 'post',
      url: ACCOUNT_COINS_ENDPOINT,
      payload: generatePayload(CARDANO, 'mainnet', 'addr_test1vre2sc6w0zftnhselly9fd6kqqnmfmklful9zcmdh92mewszqs66y')
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      block_identifier: latestBlockIdentifierMAServer,
      coins: [
        {
          coin_identifier: coinIdentifier95e1,
          amount: {
            currency: { decimals: 6, symbol: 'ADA' },
            value: '4600000'
          },
          metadata: {
            '95e1117558c2d075a4cd110ab0772460340f72a19ac5bc4691c6498e28055339:0': [
              {
                policyId: '181aace621eea2b6cb367adb5000d516fa785087bad20308c072517e',
                tokens: [
                  {
                    value: '20',
                    currency: {
                      decimals: 0,
                      symbol: '\\x',
                      metadata: {
                        policyId: '181aace621eea2b6cb367adb5000d516fa785087bad20308c072517e'
                      }
                    }
                  },
                  {
                    value: '30',
                    currency: {
                      decimals: 0,
                      symbol: '486173414e616d65',
                      metadata: {
                        policyId: '181aace621eea2b6cb367adb5000d516fa785087bad20308c072517e'
                      }
                    }
                  }
                ]
              },
              {
                policyId: 'fc5a8a0aac159f035a147e5e2e3eb04fa3b5e67257c1b971647a717d',
                tokens: [
                  {
                    value: '10',
                    currency: {
                      decimals: 0,
                      symbol: '7376c3a57274',
                      metadata: {
                        policyId: 'fc5a8a0aac159f035a147e5e2e3eb04fa3b5e67257c1b971647a717d'
                      }
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    });
  });
  test('should return coins for one specified currency', async () => {
    const response = await serverWithMultiassetsSupport.inject({
      method: 'post',
      url: ACCOUNT_COINS_ENDPOINT,
      payload: generatePayload(CARDANO, 'mainnet', 'addr_test1vpqwk50mnckqnjvzdd7lhln2685xep2xf84jmhd9njd5kucdqnufv', [
        {
          decimals: 0,
          symbol: '4154414441636f696e',
          metadata: {
            policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518'
          }
        }
      ])
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      block_identifier: latestBlockIdentifierMAServer,
      coins: [
        {
          coin_identifier: { identifier: 'b352ea2f50d47851bda890ba2baed955f2f9aa3667ea69136454fa2a2de11ffe:0' },
          amount: {
            value: '5000000',
            currency: {
              decimals: 6,
              symbol: 'ADA'
            }
          },
          metadata: {
            'b352ea2f50d47851bda890ba2baed955f2f9aa3667ea69136454fa2a2de11ffe:0': [
              {
                policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518',
                tokens: [
                  {
                    value: '1',
                    currency: {
                      symbol: '4154414441636f696e',
                      decimals: 0,
                      metadata: { policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518' }
                    }
                  },
                  {
                    value: '1',
                    currency: {
                      symbol: '61646f736961',
                      decimals: 0,
                      metadata: { policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518' }
                    }
                  }
                ]
              },
              {
                policyId: '438918d2b57ef161987da24bc010b364dc852a70f9d5a3607d4c30cd',
                tokens: [
                  {
                    value: '2',
                    currency: {
                      symbol: '42435348',
                      decimals: 0,
                      metadata: { policyId: '438918d2b57ef161987da24bc010b364dc852a70f9d5a3607d4c30cd' }
                    }
                  }
                ]
              },
              {
                policyId: 'a52d2133008537f40f755932383466434543e87dbf8b99143fa7b5d9',
                tokens: [
                  {
                    value: '1',
                    currency: {
                      symbol: '676f6c64',
                      decimals: 0,
                      metadata: { policyId: 'a52d2133008537f40f755932383466434543e87dbf8b99143fa7b5d9' }
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    });
  });
  test('should return coins for multiple specified currencies', async () => {
    const response = await serverWithMultiassetsSupport.inject({
      method: 'post',
      url: ACCOUNT_COINS_ENDPOINT,
      payload: generatePayload(CARDANO, 'mainnet', 'addr_test1vpqwk50mnckqnjvzdd7lhln2685xep2xf84jmhd9njd5kucdqnufv', [
        {
          decimals: 0,
          symbol: '4154414441636f696e',
          metadata: {
            policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518'
          }
        },
        {
          decimals: 0,
          symbol: '676f6c64',
          metadata: {
            policyId: 'a52d2133008537f40f755932383466434543e87dbf8b99143fa7b5d9'
          }
        }
      ])
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      block_identifier: latestBlockIdentifierMAServer,
      coins: [
        {
          coin_identifier: { identifier: 'b352ea2f50d47851bda890ba2baed955f2f9aa3667ea69136454fa2a2de11ffe:0' },
          amount: {
            value: '5000000',
            currency: {
              decimals: 6,
              symbol: 'ADA'
            }
          },
          metadata: {
            'b352ea2f50d47851bda890ba2baed955f2f9aa3667ea69136454fa2a2de11ffe:0': [
              {
                policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518',
                tokens: [
                  {
                    value: '1',
                    currency: {
                      symbol: '4154414441636f696e',
                      decimals: 0,
                      metadata: { policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518' }
                    }
                  },
                  {
                    value: '1',
                    currency: {
                      symbol: '61646f736961',
                      decimals: 0,
                      metadata: { policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518' }
                    }
                  }
                ]
              },
              {
                policyId: '438918d2b57ef161987da24bc010b364dc852a70f9d5a3607d4c30cd',
                tokens: [
                  {
                    value: '2',
                    currency: {
                      symbol: '42435348',
                      decimals: 0,
                      metadata: { policyId: '438918d2b57ef161987da24bc010b364dc852a70f9d5a3607d4c30cd' }
                    }
                  }
                ]
              },
              {
                policyId: 'a52d2133008537f40f755932383466434543e87dbf8b99143fa7b5d9',
                tokens: [
                  {
                    value: '1',
                    currency: {
                      symbol: '676f6c64',
                      decimals: 0,
                      metadata: { policyId: 'a52d2133008537f40f755932383466434543e87dbf8b99143fa7b5d9' }
                    }
                  }
                ]
              }
            ]
          }
        },
        {
          coin_identifier: { identifier: 'e58247e88790192246039816d27b58501c6686ab1f945cffec5262feedba4d23:0' },
          amount: {
            currency: { decimals: 6, symbol: 'ADA' },
            value: '2000000'
          },
          metadata: {
            'e58247e88790192246039816d27b58501c6686ab1f945cffec5262feedba4d23:0': [
              {
                policyId: 'a52d2133008537f40f755932383466434543e87dbf8b99143fa7b5d9',
                tokens: [
                  {
                    value: '5',
                    currency: {
                      symbol: '676f6c64',
                      decimals: 0,
                      metadata: { policyId: 'a52d2133008537f40f755932383466434543e87dbf8b99143fa7b5d9' }
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    });
  });
  test('should return all coins when ADA is specified as currency', async () => {
    const response = await serverWithMultiassetsSupport.inject({
      method: 'post',
      url: ACCOUNT_COINS_ENDPOINT,
      payload: generatePayload(CARDANO, 'mainnet', 'addr_test1vpqwk50mnckqnjvzdd7lhln2685xep2xf84jmhd9njd5kucdqnufv', [
        {
          decimals: 0,
          symbol: '4154414441636f696e',
          metadata: {
            policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518'
          }
        },
        {
          decimals: 6,
          symbol: 'ADA'
        }
      ])
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      block_identifier: latestBlockIdentifierMAServer,
      coins: [
        {
          coin_identifier: { identifier: '7260f6b728bf49a95095da74ca9ec88cdbfb414eea81eaeb7d1939bbe6745b12:0' },
          amount: {
            currency: { decimals: 6, symbol: 'ADA' },
            value: '2000000'
          },
          metadata: {
            '7260f6b728bf49a95095da74ca9ec88cdbfb414eea81eaeb7d1939bbe6745b12:0': [
              {
                policyId: '438918d2b57ef161987da24bc010b364dc852a70f9d5a3607d4c30cd',
                tokens: [
                  {
                    value: '50',
                    currency: {
                      symbol: '42435348',
                      decimals: 0,
                      metadata: { policyId: '438918d2b57ef161987da24bc010b364dc852a70f9d5a3607d4c30cd' }
                    }
                  }
                ]
              }
            ]
          }
        },
        {
          coin_identifier: { identifier: 'b352ea2f50d47851bda890ba2baed955f2f9aa3667ea69136454fa2a2de11ffe:0' },
          amount: {
            value: '5000000',
            currency: {
              decimals: 6,
              symbol: 'ADA'
            }
          },
          metadata: {
            'b352ea2f50d47851bda890ba2baed955f2f9aa3667ea69136454fa2a2de11ffe:0': [
              {
                policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518',
                tokens: [
                  {
                    value: '1',
                    currency: {
                      symbol: '4154414441636f696e',
                      decimals: 0,
                      metadata: { policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518' }
                    }
                  },
                  {
                    value: '1',
                    currency: {
                      symbol: '61646f736961',
                      decimals: 0,
                      metadata: { policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518' }
                    }
                  }
                ]
              },
              {
                policyId: '438918d2b57ef161987da24bc010b364dc852a70f9d5a3607d4c30cd',
                tokens: [
                  {
                    value: '2',
                    currency: {
                      symbol: '42435348',
                      decimals: 0,
                      metadata: { policyId: '438918d2b57ef161987da24bc010b364dc852a70f9d5a3607d4c30cd' }
                    }
                  }
                ]
              },
              {
                policyId: 'a52d2133008537f40f755932383466434543e87dbf8b99143fa7b5d9',
                tokens: [
                  {
                    value: '1',
                    currency: {
                      symbol: '676f6c64',
                      decimals: 0,
                      metadata: { policyId: 'a52d2133008537f40f755932383466434543e87dbf8b99143fa7b5d9' }
                    }
                  }
                ]
              }
            ]
          }
        },
        {
          coin_identifier: { identifier: 'e58247e88790192246039816d27b58501c6686ab1f945cffec5262feedba4d23:0' },
          amount: {
            currency: { decimals: 6, symbol: 'ADA' },
            value: '2000000'
          },
          metadata: {
            'e58247e88790192246039816d27b58501c6686ab1f945cffec5262feedba4d23:0': [
              {
                policyId: 'a52d2133008537f40f755932383466434543e87dbf8b99143fa7b5d9',
                tokens: [
                  {
                    value: '5',
                    currency: {
                      symbol: '676f6c64',
                      decimals: 0,
                      metadata: { policyId: 'a52d2133008537f40f755932383466434543e87dbf8b99143fa7b5d9' }
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    });
  });
  test('should return coins for multi asset currency with empty name', async () => {
    const response = await serverWithMultiassetsSupport.inject({
      method: 'post',
      url: ACCOUNT_COINS_ENDPOINT,
      payload: generatePayload(CARDANO, 'mainnet', 'addr_test1vre2sc6w0zftnhselly9fd6kqqnmfmklful9zcmdh92mewszqs66y', [
        {
          decimals: 0,
          symbol: '\\x',
          metadata: {
            policyId: '181aace621eea2b6cb367adb5000d516fa785087bad20308c072517e'
          }
        }
      ])
    });
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.json()).toEqual({
      block_identifier: latestBlockIdentifierMAServer,
      coins: [
        {
          coin_identifier: coinIdentifier95e1,
          amount: {
            currency: { decimals: 6, symbol: 'ADA' },
            value: '4600000'
          },
          metadata: {
            '95e1117558c2d075a4cd110ab0772460340f72a19ac5bc4691c6498e28055339:0': [
              {
                policyId: '181aace621eea2b6cb367adb5000d516fa785087bad20308c072517e',
                tokens: [
                  {
                    value: '20',
                    currency: {
                      decimals: 0,
                      symbol: '\\x',
                      metadata: {
                        policyId: '181aace621eea2b6cb367adb5000d516fa785087bad20308c072517e'
                      }
                    }
                  },
                  {
                    value: '30',
                    currency: {
                      decimals: 0,
                      symbol: '486173414e616d65',
                      metadata: {
                        policyId: '181aace621eea2b6cb367adb5000d516fa785087bad20308c072517e'
                      }
                    }
                  }
                ]
              },
              {
                policyId: 'fc5a8a0aac159f035a147e5e2e3eb04fa3b5e67257c1b971647a717d',
                tokens: [
                  {
                    value: '10',
                    currency: {
                      decimals: 0,
                      symbol: '7376c3a57274',
                      metadata: {
                        policyId: 'fc5a8a0aac159f035a147e5e2e3eb04fa3b5e67257c1b971647a717d'
                      }
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    });
  });

  test('should fail when querying for a currency with non hex string symbol', async () => {
    const invalidSymbol = 'thisIsANonHexString';
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_COINS_ENDPOINT,
      payload: generatePayload(CARDANO, 'mainnet', 'addr_test1vre2sc6w0zftnhselly9fd6kqqnmfmklful9zcmdh92mewszqs66y', [
        {
          decimals: 0,
          symbol: invalidSymbol,
          metadata: {
            policyId: '181aace621eea2b6cb367adb5000d516fa785087bad20308c072517e'
          }
        }
      ])
    });

    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4024,
      message: 'Invalid token name',
      retriable: false,
      details: { message: 'Given name is thisIsANonHexString' }
    });
  });
  test('should fail when querying for a currency with a symbol longer than expected', async () => {
    const invalidSymbol = new Array(ASSET_NAME_LENGTH + 2).join('0');
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_COINS_ENDPOINT,
      payload: generatePayload(CARDANO, 'mainnet', 'addr_test1vre2sc6w0zftnhselly9fd6kqqnmfmklful9zcmdh92mewszqs66y', [
        {
          decimals: 0,
          symbol: invalidSymbol,
          metadata: {
            policyId: '181aace621eea2b6cb367adb5000d516fa785087bad20308c072517e'
          }
        }
      ])
    });

    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4024,
      message: 'Invalid token name',
      retriable: false,
      details: { message: 'Given name is 00000000000000000000000000000000000000000000000000000000000000000' }
    });
  });
  test('should fail when querying for a currency with a policy id longer than expected', async () => {
    const invalidPolicy = new Array(POLICY_ID_LENGTH + 1).join('w');
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_COINS_ENDPOINT,
      payload: generatePayload(CARDANO, 'mainnet', 'addr_test1vre2sc6w0zftnhselly9fd6kqqnmfmklful9zcmdh92mewszqs66y', [
        {
          decimals: 0,
          symbol: '486173414e616d65',
          metadata: {
            policyId: invalidPolicy
          }
        }
      ])
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4023,
      message: 'Invalid policy id',
      retriable: false,
      details: { message: 'Given policy id is wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww' }
    });
  });
  test('should fail when querying for a currency with a non hex policy id', async () => {
    const invalidPolicy = 'thisIsANonHexString';
    const response = await server.inject({
      method: 'post',
      url: ACCOUNT_COINS_ENDPOINT,
      payload: generatePayload(CARDANO, 'mainnet', 'addr_test1vre2sc6w0zftnhselly9fd6kqqnmfmklful9zcmdh92mewszqs66y', [
        {
          decimals: 0,
          symbol: '486173414e616d65',
          metadata: {
            policyId: invalidPolicy
          }
        }
      ])
    });
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.json()).toEqual({
      code: 4023,
      message: 'Invalid policy id',
      retriable: false,
      details: { message: 'Given policy id is thisIsANonHexString' }
    });
  });
});
