/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable max-len */
/* eslint-disable no-magic-numbers */
import cbor from 'cbor';
import { OperationType, SIGNATURE_TYPE, StakingOperations, PoolOperations } from '../../src/server/utils/constants';

/* eslint-disable camelcase */
const slotLeader2b1 = 'ByronGenesis-52df0f2c5539b2b1';
export const block1000WithoutTxs = {
  block: {
    block_identifier: {
      index: 1000,
      hash: 'f84748ae7f413a7f73ddb599fd77e4ed488484c1353c6075a05f30e9c78c9de9'
    },
    parent_block_identifier: {
      index: 999,
      hash: '18c7525617b8747a721c3fb003776826fe60a55e64f6b4f5396d06b1ff88ce02'
    },
    timestamp: 1506223071000,
    metadata: {
      transactionsCount: 0,
      createdBy: 'ByronGenesis-8e8a7b0f4a23f07a',
      size: 669,
      epochNo: 0,
      slotNo: 999
    },
    transactions: []
  }
};

export const latestBlockHash = '6713e3dbea2a037f0be9401744a8b2be4c6190294a23c496165c212972a82f61';
export const latestLaunchpadBlockSlot = 7771280;
export const latestBlockIdentifier = {
  hash: latestBlockHash,
  index: 4853177
};
export const latestBlockIdentifierMAServer = {
  hash: '0700721626036f82476e0deb2eff43845c33823b646250fbf42fa0247149c8e0',
  index: 382908
};
export const block23236WithTransactions = {
  block: {
    block_identifier: {
      index: 23236,
      hash: 'ac04e4fcaa3057a044ea5be02cae03443fe52bb090f21a1ece81bc83c716b428'
    },
    parent_block_identifier: {
      index: 23235,
      hash: '4e1817789d9c78f6a28f98af73673a391794e53da5e9c1f113d446e0e9b574fd'
    },
    timestamp: 1506668071000,
    metadata: {
      transactionsCount: 2,
      createdBy: 'ByronGenesis-64c61078e9577d3b',
      size: 1155,
      epochNo: 1,
      slotNo: 23249
    },
    transactions: [
      {
        transaction_identifier: {
          hash: 'abbeb108ebc3990c7f031113bcb8ce8f306a1eec8f313acffcdcd256379208f4'
        },
        operations: [
          {
            operation_identifier: {
              index: 0
            },
            type: OperationType.INPUT,
            status: 'success',
            account: {
              address: 'Ae2tdPwUPEZH1TtKqx7VsvXUPAv2KaG7TkXJTfyb2bqFCctePknLVgVQyfn'
            },
            amount: {
              value: '-1249999000000',
              currency: {
                symbol: 'ADA',
                decimals: 6
              }
            },
            coin_change: {
              coin_action: 'coin_spent',
              coin_identifier: {
                identifier: '9c239b53d895038e702b7c63b7a9ca3a54385e04a4b8d69227119c2358150a77:0'
              }
            }
          },
          {
            operation_identifier: {
              index: 1,
              network_index: 0
            },
            related_operations: [
              {
                index: 0
              }
            ],
            type: OperationType.OUTPUT,
            status: 'success',
            account: {
              address:
                'DdzFFzCqrhsiQq5Xg68HtwfAb1Qj2WisbxEynbJKZXLPCRzE3E5QskVZWSjmks8e5rBLwsCnM19kEmV6Eh8QvUYmUzDSJbx5eASPqtd3'
            },
            amount: {
              value: '1249999000000',
              currency: {
                symbol: 'ADA',
                decimals: 6
              }
            },
            coin_change: {
              coin_action: 'coin_created',
              coin_identifier: {
                identifier: 'abbeb108ebc3990c7f031113bcb8ce8f306a1eec8f313acffcdcd256379208f4:0'
              }
            }
          }
        ]
      },
      {
        transaction_identifier: {
          hash: 'd864f781436f0122a21335b672fe7943ab1d123f6c2ed770541669d70a870d75'
        },
        operations: [
          {
            operation_identifier: {
              index: 0
            },
            type: OperationType.INPUT,
            status: 'success',
            account: {
              address: 'Ae2tdPwUPEZE74MFSWpMuXKTbh8uyc7GVXT8Rc4dk1kCUfVpX19jk1VW2CW'
            },
            amount: {
              value: '-386848000000',
              currency: {
                symbol: 'ADA',
                decimals: 6
              }
            },
            coin_change: {
              coin_action: 'coin_spent',
              coin_identifier: {
                identifier: 'd967be1c496a5321e0c9424a8cc33e8c161c79f64dad465dd0bfbe0abcfde1ef:0'
              }
            }
          },
          {
            operation_identifier: {
              index: 1,
              network_index: 0
            },
            related_operations: [
              {
                index: 0
              }
            ],
            type: OperationType.OUTPUT,
            status: 'success',
            account: {
              address:
                'DdzFFzCqrhsra7iVHeD6D94CjdHz3rPvPCsGouLHmxv8YZS8xptCPomaooFhLqeexen988tCbx5hTa2iM4wD6JLNjfij8QCZLvmS8eKP'
            },
            amount: {
              value: '386848000000',
              currency: {
                symbol: 'ADA',
                decimals: 6
              }
            },
            coin_change: {
              coin_action: 'coin_created',
              coin_identifier: {
                identifier: 'd864f781436f0122a21335b672fe7943ab1d123f6c2ed770541669d70a870d75:0'
              }
            }
          }
        ]
      }
    ]
  }
};

export const block7134WithTxs = {
  block: {
    block_identifier: {
      index: 7134,
      hash: 'af3d6e553e7ef8552a40e4e8cdeaa7d8305e7439474c7e6e4e0477d5f9492e2d'
    },
    parent_block_identifier: {
      index: 7133,
      hash: '4314cd5fa8a645607b2f7668fd2bc53f40fb418c06de3db0a8e721761e458828'
    },
    timestamp: 1506345751000,
    metadata: {
      transactionsCount: 1,
      createdBy: slotLeader2b1,
      size: 984,
      epochNo: 0,
      slotNo: 7133
    },
    transactions: [
      {
        transaction_identifier: {
          hash: 'c950e0d7d898a392ccf458a75728aa35afd4bd3776f118cbf0e0abb315205bc4'
        },
        operations: [
          {
            operation_identifier: {
              index: 0
            },
            type: OperationType.INPUT,
            status: 'success',
            account: {
              address:
                'DdzFFzCqrhsjEtvKie4apJ4wHKQdG7eyGYrUBDuPoAiPvenD44RmDPJmaHVdVsTR9QjHjQDL1jDU6rS8upHyxspT7VP5PGJHnDZ94nNi'
            },
            amount: {
              value: '-1000000',
              currency: {
                symbol: 'ADA',
                decimals: 6
              }
            },
            coin_change: {
              coin_action: 'coin_spent',
              coin_identifier: {
                identifier: 'a9e4413a5fb61a7a43c7df006ffcaaf3f2ffc9541f54757023968c5a8f8294fd:0'
              }
            }
          },
          {
            operation_identifier: {
              index: 1,
              network_index: 0
            },

            related_operations: [
              {
                index: 0
              }
            ],
            type: OperationType.OUTPUT,
            status: 'success',
            account: {
              address:
                'DdzFFzCqrhswtV8kmjV78zcAC6AgrUNQRhELRmBip5AQkqKw9BWRSuxUyWNNSARLxuFpYc4kEAPyB3XQLsXjc3LQ48R4EPADo4rYzRbT'
            },
            amount: {
              value: '329106',
              currency: {
                symbol: 'ADA',
                decimals: 6
              }
            },
            coin_change: {
              coin_action: 'coin_created',
              coin_identifier: {
                identifier: 'c950e0d7d898a392ccf458a75728aa35afd4bd3776f118cbf0e0abb315205bc4:0'
              }
            }
          },
          {
            operation_identifier: {
              index: 2,
              network_index: 1
            },
            related_operations: [
              {
                index: 0
              }
            ],
            type: OperationType.OUTPUT,
            status: 'success',
            account: {
              address:
                'DdzFFzCqrhszzyrUXDCZJHs9yFCbcnLD4FSGm1S2F6MUUjV8Wvq351eqUdoTqaScmU3jZ19KJmX8H4fn12nwYwQg9HtoBi7cD16qzpdj'
            },
            amount: {
              value: '500000',
              currency: {
                symbol: 'ADA',
                decimals: 6
              }
            },
            coin_change: {
              coin_action: 'coin_created',
              coin_identifier: {
                identifier: 'c950e0d7d898a392ccf458a75728aa35afd4bd3776f118cbf0e0abb315205bc4:1'
              }
            }
          }
        ]
      }
    ]
  }
};

export const blockWith8Txs = {
  block: {
    block_identifier: {
      index: 23712,
      hash: '7a8dbe66c6a1b41bdbf4f3865ea20aebbf93b9697bf39024d5d08ffad10ab1e8'
    },
    parent_block_identifier: {
      index: 23711,
      hash: 'cf3d86d870defa1c90f8aeeb753985e0051fef638184f1c334179950b8cd901e'
    },
    timestamp: 1506677591000,
    transactions: [],
    metadata: {
      transactionsCount: 8,
      createdBy: 'ByronGenesis-888c451ae09a16fe',
      size: 2845,
      epochNo: 1,
      slotNo: 23725
    }
  },
  other_transactions: [
    {
      hash: 'e1c3e53ff15df4b3f477284fcf971618ec30f2a70209ddb0bc2f0c6e0d90665d'
    },
    {
      hash: 'a9c267305af2cabb9c54c929dad82afd8b61d5e49045efc80e2d664c98f3190d'
    },
    {
      hash: 'd2e1019b18f0f5fbb9a6f8868775fe482fe4aff9db818fb517fc673ea185f33c'
    },
    {
      hash: 'b1ae3d1ba40535a87b300a81ba9bac26339ea14bdca2b8b689c3fc2d5f106fe7'
    },
    {
      hash: '88df3562c7d741cec167538c08cb6a5116781e82c93d2efe8c44df087c6bbaf4'
    },
    {
      hash: '83f86f288c4128ad967431b17880098a352056ce3671932e07c87a4c8290ca68'
    },
    {
      hash: 'a52f6e01074711d6eae12a2bb3eeb2d9ccf2cdfcec2aac1ddb28248218be2797'
    },
    {
      hash: '4bbb5c30666c31c700d8dbfdf9811d1b5398a030796c3447e7d56285e9f49282'
    }
  ]
};

export const transactionBlock4597861WithWithdrawals = {
  transaction: {
    operations: [
      {
        account: {
          address:
            'addr1qydzwlumluss5x9fr5ffev495dyezulyue06htq6g7map8qqq465468exxjhrvtnwp3ufyzvkd9kc3xmmjw7vuwtkugs5x824s'
        },
        amount: {
          currency: {
            decimals: 6,
            symbol: 'ADA'
          },
          value: '-5846309394'
        },
        coin_change: {
          coin_action: 'coin_spent',
          coin_identifier: {
            identifier: '0b40752c2fc8a41da8411cee5376ac96fa4351e4c3d72750f9548582273244e7:0'
          }
        },
        operation_identifier: {
          index: 0
        },
        status: 'success',
        type: 'input'
      },
      {
        account: {
          address: 'stake1uyqq2a22arunrft3k9ehqc7yjpxtxjmvgndae80xw89mwyge9skyp'
        },
        metadata: {
          withdrawalAmount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-112588803'
          }
        },
        operation_identifier: {
          index: 1
        },
        status: 'success',
        type: 'withdrawal'
      },
      {
        account: {
          address:
            'addr1qywj6nl4g04yn9a7gdwqgyzcgwmjekkw603t8pcsrlaxg3sqq465468exxjhrvtnwp3ufyzvkd9kc3xmmjw7vuwtkugs05evjg'
        },
        amount: {
          currency: {
            decimals: 6,
            symbol: 'ADA'
          },
          value: '5158722796'
        },
        coin_change: {
          coin_action: 'coin_created',
          coin_identifier: {
            identifier: '2974845ecc7e02e86285d32961c69f3945662a80d5e2caae8a1086e652936f42:0'
          }
        },
        operation_identifier: {
          index: 2,
          network_index: 0
        },
        related_operations: [
          {
            index: 0
          },
          {
            index: 1
          }
        ],
        status: 'success',
        type: 'output'
      },
      {
        account: {
          address:
            'DdzFFzCqrhsm61hrcAFrwush9Amq6PU8UkFjqPefDTKb4u6TkBa5c7MHWbsbmcDCMV2xSc6jGaUWAu9kqaSLS4CX7nkrakUDdCrdkLoe'
        },
        amount: {
          currency: {
            decimals: 6,
            symbol: 'ADA'
          },
          value: '800000000'
        },
        coin_change: {
          coin_action: 'coin_created',
          coin_identifier: {
            identifier: '2974845ecc7e02e86285d32961c69f3945662a80d5e2caae8a1086e652936f42:1'
          }
        },
        operation_identifier: {
          index: 3,
          network_index: 1
        },
        related_operations: [
          {
            index: 0
          },
          {
            index: 1
          }
        ],
        status: 'success',
        type: 'output'
      }
    ],
    transaction_identifier: {
      hash: '2974845ecc7e02e86285d32961c69f3945662a80d5e2caae8a1086e652936f42'
    }
  }
};

export const transactionBlock4490558WithRegistrations = {
  transaction: {
    operations: [
      {
        account: {
          address: 'addr1vy8ejqxs4525x6328d8x5pt627grqsxnj29l05xg35amcpg7elhka'
        },
        amount: {
          currency: {
            decimals: 6,
            symbol: 'ADA'
          },
          value: '-600000000'
        },
        coin_change: {
          coin_action: 'coin_spent',
          coin_identifier: {
            identifier: '9965d997083669a7681259f9a91953200b84ab5f03a4af33ed8a9e2e3cf78300:0'
          }
        },
        operation_identifier: {
          index: 0
        },
        status: 'success',
        type: 'input'
      },
      {
        operation_identifier: { index: 1 },
        type: 'stakeKeyRegistration',
        status: 'success',
        account: { address: 'stake1uyacuruhne34456jh7vzuc9ly0rqmxanu9z4pzyly06z94gmm4a8a' },
        metadata: { depositAmount: { value: '2000000', currency: { symbol: 'ADA', decimals: 6 } } }
      },
      {
        operation_identifier: { index: 2, network_index: 0 },
        related_operations: [{ index: 0 }],
        type: 'output',
        status: 'success',
        account: {
          address:
            'addr1qy8ejqxs4525x6328d8x5pt627grqsxnj29l05xg35amcpfm3c8e08nrttf490uc9est7g7xpkdm8c292zyf7gl5yt2s9q6mtt'
        },
        amount: {
          currency: {
            decimals: 6,
            symbol: 'ADA'
          },
          value: '597821123'
        },
        coin_change: {
          coin_action: 'coin_created',
          coin_identifier: {
            identifier: '91f88c21679fdc95cb0712dc8a755eab20fdf9e919871c3c668515c830572090:0'
          }
        }
      }
    ],
    transaction_identifier: {
      hash: '91f88c21679fdc95cb0712dc8a755eab20fdf9e919871c3c668515c830572090'
    }
  }
};

export const transactionBlock4490559WithDelegation = {
  transaction: {
    operations: [
      {
        operation_identifier: { index: 0 },
        type: 'input',
        status: 'success',
        account: {
          address:
            'addr1qx2yd2fu9l6n8v42m0k803uhecjw5s2eupf6sx2j2mpuvcf8nnccup6myghsjd6x7nuu4kvql5lutlx976w7em60nm5svhu6tv'
        },
        amount: {
          value: '-10026895835',
          currency: {
            decimals: 6,
            symbol: 'ADA'
          }
        },
        coin_change: {
          coin_identifier: {
            identifier: '9a2ee0b62539fb5b89a5b56b285bdd36679511d6947c4065c826e9adcb67e9f3:0'
          },
          coin_action: 'coin_spent'
        }
      },
      {
        operation_identifier: { index: 1 },
        type: 'stakeKeyRegistration',
        status: 'success',
        account: { address: 'stake1uyneeuvwqadjytcfxar0f7w2mxq06079lnzld80vaa8ea6gedt6gz' },
        metadata: { depositAmount: { value: '2000000', currency: { symbol: 'ADA', decimals: 6 } } }
      },
      {
        operation_identifier: { index: 2 },
        type: 'stakeDelegation',
        status: 'success',
        account: { address: 'stake1uyneeuvwqadjytcfxar0f7w2mxq06079lnzld80vaa8ea6gedt6gz' },
        metadata: { pool_key_hash: '153806dbcd134ddee69a8c5204e38ac80448f62342f8c23cfe4b7edf' }
      },
      {
        operation_identifier: { index: 3, network_index: 0 },
        related_operations: [{ index: 0 }],
        type: 'output',
        status: 'success',
        account: {
          address:
            'addr1q9tkm6edgft7lfs8jlrlcudnrprfl2lm2melv63tn7u7m2e8nnccup6myghsjd6x7nuu4kvql5lutlx976w7em60nm5sum6x3r'
        },
        amount: {
          value: '10024721402',
          currency: {
            decimals: 6,
            symbol: 'ADA'
          }
        },
        coin_change: {
          coin_identifier: {
            identifier: 'f0024159d124a128db522031c4a3e7b255ee511600afa92ff52b2504702e4e1d:0'
          },
          coin_action: 'coin_created'
        }
      }
    ],
    transaction_identifier: {
      hash: 'f0024159d124a128db522031c4a3e7b255ee511600afa92ff52b2504702e4e1d'
    }
  }
};

export const transactionBlock4853177WithPoolRetirement = {
  transaction: {
    transaction_identifier: {
      hash: 'dcbff41c50c5b4012d49be5be75b11a0c5289515258ef4cf108eb6ec4ed5f37a'
    },
    operations: [
      {
        operation_identifier: { index: 0 },
        type: 'input',
        status: 'success',
        account: {
          address:
            'addr_test1qzyh0zdfjmk997fkdrgcm4xmuhcqqd4qgphkmgm3shryrjhkjhp4qfyx33xada55u94c300knphrrgr577gdw5jpc39srpfmlp'
        },
        amount: { value: '-269377901300', currency: { symbol: 'ADA', decimals: 6 } },
        coin_change: {
          coin_identifier: {
            identifier: '30ca1269e56ed17c97c202164c14e31a58c104f60927ed5de4252255fc624b6b:0'
          },
          coin_action: 'coin_spent'
        },
        metadata: {
          tokenBundle: [
            {
              policyId: '202e0181ea963e2fcd206b1a794ce160afbe120dad5fd30a181d3a24',
              tokens: [
                {
                  value: '-1000000000000',
                  currency: { symbol: '41434c', decimals: 0 }
                }
              ]
            },
            {
              policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518',
              tokens: [
                {
                  value: '-9952',
                  currency: { symbol: '4154414441636f696e', decimals: 0 }
                },
                {
                  value: '-8000000000',
                  currency: { symbol: '61646f736961', decimals: 0 }
                },
                {
                  value: '-2500',
                  currency: { symbol: '6d616368746c636f696e', decimals: 0 }
                }
              ]
            },
            {
              policyId: 'ecd07b4ef62f37a68d145de8efd60c53d288dd5ffc641215120cc3db',
              tokens: [
                {
                  value: '-500',
                  currency: { symbol: '6d616368746c32636f696e', decimals: 0 }
                }
              ]
            }
          ]
        }
      },
      {
        operation_identifier: { index: 1 },
        type: 'poolRetirement',
        status: 'success',
        account: {
          address: 'd6aafa5358b98373449434542e3da3564bc71635ae3247dc1a2b7b0e'
        },
        metadata: {
          epoch: 676
        }
      },
      {
        operation_identifier: { index: 2, network_index: 0 },
        related_operations: [{ index: 0 }],
        type: 'output',
        status: 'success',
        account: {
          address:
            'addr_test1qzyh0zdfjmk997fkdrgcm4xmuhcqqd4qgphkmgm3shryrjhkjhp4qfyx33xada55u94c300knphrrgr577gdw5jpc39srpfmlp'
        },
        amount: { value: '269377714987', currency: { symbol: 'ADA', decimals: 6 } },
        coin_change: {
          coin_identifier: {
            identifier: 'dcbff41c50c5b4012d49be5be75b11a0c5289515258ef4cf108eb6ec4ed5f37a:0'
          },
          coin_action: 'coin_created'
        },
        metadata: {
          tokenBundle: [
            {
              policyId: '202e0181ea963e2fcd206b1a794ce160afbe120dad5fd30a181d3a24',
              tokens: [
                {
                  value: '1000000000000',
                  currency: { symbol: '41434c', decimals: 0 }
                }
              ]
            },
            {
              policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518',
              tokens: [
                {
                  value: '9952',
                  currency: { symbol: '4154414441636f696e', decimals: 0 }
                },
                {
                  value: '8000000000',
                  currency: { symbol: '61646f736961', decimals: 0 }
                },
                {
                  value: '2500',
                  currency: { symbol: '6d616368746c636f696e', decimals: 0 }
                }
              ]
            },
            {
              policyId: 'ecd07b4ef62f37a68d145de8efd60c53d288dd5ffc641215120cc3db',
              tokens: [
                {
                  value: '500',
                  currency: { symbol: '6d616368746c32636f696e', decimals: 0 }
                }
              ]
            }
          ]
        }
      }
    ]
  }
};

export const transactionBlock4853177WithDeregistration = {
  transaction: {
    operations: [
      {
        operation_identifier: { index: 0 },
        type: 'input',
        status: 'success',
        account: {
          address:
            'addr1qyzstdwf29wpp3fmsmhxe3nks0x2lzs9c6ka553r5lans9wyn8dwr235e08njhkc5pn8unfx68d7pyq0jtq483vt0zls4nn77q'
        },
        amount: { value: '-7126681496', currency: { symbol: 'ADA', decimals: 6 } },
        coin_change: {
          coin_identifier: {
            identifier: '820dd7d6b167458348aa0a58a4af39709e464ec7ef1068dee2261fb7b609b605:0'
          },
          coin_action: 'coin_spent'
        }
      },
      {
        operation_identifier: { index: 1 },
        type: 'stakeKeyDeregistration',
        status: 'success',
        account: { address: 'stake1u8zfnkhp4g6vhneetmv2qen7f5ndrklqjq8e9s2nck9h30cfz6qmp' },
        metadata: { refundAmount: { value: '-2000000', currency: { symbol: 'ADA', decimals: 6 } } }
      },
      {
        operation_identifier: { index: 2, network_index: 0 },
        related_operations: [{ index: 0 }, { index: 1 }],
        type: 'output',
        status: 'success',
        account: {
          address:
            'addr1qy30ge0rzd6x0frea6hfdv7suy40psqr8lprct9x7h9yj87yn8dwr235e08njhkc5pn8unfx68d7pyq0jtq483vt0zls4jy0m3'
        },
        amount: { value: '7128509879', currency: { symbol: 'ADA', decimals: 6 } },
        coin_change: {
          coin_identifier: {
            identifier: '5fe53eece38ff4eb102c33c6cbdf34947c8232eefaae0731fdf8f746b81763fc:0'
          },
          coin_action: 'coin_created'
        }
      }
    ],
    transaction_identifier: {
      hash: '5fe53eece38ff4eb102c33c6cbdf34947c8232eefaae0731fdf8f746b81763fc'
    }
  }
};

export const launchpad235546WithPoolRegistration = {
  transaction: {
    operations: [
      {
        operation_identifier: { index: 0 },
        type: 'input',
        status: 'success',
        account: {
          address:
            'addr_test1qrgej788jgwwqg2dnufrkeeksykjtu86trqlcd82585jgey2zanrjjggmm0t38fdgannesv9z9q2en42qar2t6rsat3q9yh4ug'
        },
        amount: { value: '-799997817691', currency: { symbol: 'ADA', decimals: 6 } },
        coin_change: {
          coin_identifier: {
            identifier: 'd2e592ab44f65f8335dee7640a956d17a21f9020006253c52a939f3ba0fd3398:0'
          },
          coin_action: 'coin_spent'
        }
      },
      {
        operation_identifier: { index: 1 },
        type: 'stakeDelegation',
        status: 'success',
        account: { address: 'stake_test1uz9pwe3efyydah4cn5k5weeucxz3zs9ve64qw349apcw4csdllxv4' },
        metadata: { pool_key_hash: '503c82138b10d84b0ba36ff2e7342ea7fc40c57498dbc6fafe0cd322' }
      },
      {
        operation_identifier: { index: 2 },
        type: 'poolRegistration',
        status: 'success',
        account: { address: '503c82138b10d84b0ba36ff2e7342ea7fc40c57498dbc6fafe0cd322' },
        metadata: {
          depositAmount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '500000000'
          },
          poolRegistrationParams: {
            rewardAddress: 'e08a1766394908dedeb89d2d47673cc1851140acceaa0746a5e870eae2',
            cost: '340000000',
            margin_percentage: '0.08',
            pledge: '799450000000',
            poolOwners: ['8a1766394908dedeb89d2d47673cc1851140acceaa0746a5e870eae2'],
            relays: [
              {
                dnsName: 'relays.cardano-launchpad.chaincrucial.io',
                ipv4: '',
                ipv6: '',
                port: '23001'
              }
            ],
            vrfKeyHash: '74511e297e8d8670729af5a4eb08ff8b49f0247f1100f28ce5599b44f07b57b4'
          }
        }
      },
      {
        operation_identifier: { index: 3, network_index: 0 },
        related_operations: [{ index: 0 }],
        type: 'output',
        status: 'success',
        account: {
          address:
            'addr_test1qrgej788jgwwqg2dnufrkeeksykjtu86trqlcd82585jgey2zanrjjggmm0t38fdgannesv9z9q2en42qar2t6rsat3q9yh4ug'
        },
        amount: { value: '799497619058', currency: { symbol: 'ADA', decimals: 6 } },
        coin_change: {
          coin_identifier: {
            identifier: '2468895f6f8e7b00a298aab49647712ff55b453e35d14e32f737691a014c26eb:0'
          },
          coin_action: 'coin_created'
        }
      }
    ],
    transaction_identifier: {
      hash: '2468895f6f8e7b00a298aab49647712ff55b453e35d14e32f737691a014c26eb'
    }
  }
};

export const launchpad236643PoolRegistrationWithSeveralOwners = {
  transaction: {
    operations: [
      {
        operation_identifier: { index: 0 },
        type: 'input',
        status: 'success',
        account: {
          address:
            'addr_test1qqslw59gg528x70pa3vg0ynsdfx70kr70erug22h5tkkvj3eppr5tp2u2uddxy6lq0pq2yjxttpnja6z84s5pp2xvqtsytzc8e'
        },
        amount: { value: '-2166859938552', currency: { symbol: 'ADA', decimals: 6 } },
        coin_change: {
          coin_identifier: {
            identifier: 'e785c4ddb544decdc304bcd5110c6f92463d35029e0124de3e706399b6537e00:0'
          },
          coin_action: 'coin_spent'
        }
      },
      {
        operation_identifier: { index: 1 },
        type: 'poolRegistration',
        status: 'success',
        account: { address: 'd6aafa5358b98373449434542e3da3564bc71635ae3247dc1a2b7b0e' },
        metadata: {
          depositAmount: { value: '500000000', currency: { symbol: 'ADA', decimals: 6 } },
          poolRegistrationParams: {
            rewardAddress: 'e0f695c35024868c4dd6f694e16b88bdf6986e31a074f790d75241c44b',
            cost: '10000000000',
            margin_percentage: '0.1',
            pledge: '100000000',
            poolOwners: [
              '03d205532089ad2f7816892e2ef42849b7b52788e41b3fd43a6e01cf',
              'c13582aec9a44fcc6d984be003c5058c660e1d2ff1370fd8b49ba73f',
              'f695c35024868c4dd6f694e16b88bdf6986e31a074f790d75241c44b'
            ],
            relays: [
              {
                dnsName: '',
                ipv4: '127.0.0.1',
                ipv6: '',
                port: '3001'
              }
            ],
            vrfKeyHash: 'c78992878b9af2bff8363a3c45b0ead3b9a2ee6eb6e611e731037bb25b4db9ae'
          }
        }
      },
      {
        operation_identifier: { index: 2, network_index: 0 },
        related_operations: [
          {
            index: 0
          }
        ],
        type: 'output',
        status: 'success',
        account: {
          address:
            'addr_test1qqslw59gg528x70pa3vg0ynsdfx70kr70erug22h5tkkvj3eppr5tp2u2uddxy6lq0pq2yjxttpnja6z84s5pp2xvqtsytzc8e'
        },
        amount: { value: '2166859729095', currency: { symbol: 'ADA', decimals: 6 } },
        coin_change: {
          coin_identifier: {
            identifier: 'ea8e02abc93b863c386d25e31132866ddd61703f913b71d22af7d51843dd2bbe:0'
          },
          coin_action: 'coin_created'
        }
      }
    ],
    transaction_identifier: {
      hash: 'ea8e02abc93b863c386d25e31132866ddd61703f913b71d22af7d51843dd2bbe'
    }
  }
};

export const transaction344050WithTokenBundle = {
  operations: [
    {
      account: {
        address: 'addr_test1vplgcajn3d922znzumlqzhwmtz5hkgf3c6a3tlqt3mhl6wse6xkt5'
      },
      amount: {
        currency: {
          decimals: 6,
          symbol: 'ADA'
        },
        value: '-509972531853'
      },
      coin_change: {
        coin_action: 'coin_spent',
        coin_identifier: {
          identifier: '3f56ce637d8482d5d5c67e7c0989f86e0d7e31bb7311e6ca8d46248e53bbcede:1'
        }
      },
      metadata: {
        tokenBundle: [
          {
            policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518',
            tokens: [
              {
                currency: {
                  decimals: 0,
                  symbol: '4154414441636f696e'
                },
                value: '-7'
              },
              {
                currency: {
                  decimals: 0,
                  symbol: '61646f736961'
                },
                value: '-11345'
              }
            ]
          },
          {
            policyId: '438918d2b57ef161987da24bc010b364dc852a70f9d5a3607d4c30cd',
            tokens: [
              {
                currency: {
                  decimals: 0,
                  symbol: '42435348'
                },
                value: '-950000'
              }
            ]
          },
          {
            policyId: 'a52d2133008537f40f755932383466434543e87dbf8b99143fa7b5d9',
            tokens: [
              {
                currency: {
                  decimals: 0,
                  symbol: '676f6c64'
                },
                value: '-950'
              }
            ]
          }
        ]
      },
      operation_identifier: {
        index: 0
      },
      status: 'success',
      type: 'input'
    },
    {
      account: {
        address: 'addr_test1vplgcajn3d922znzumlqzhwmtz5hkgf3c6a3tlqt3mhl6wse6xkt5'
      },
      amount: {
        currency: {
          decimals: 6,
          symbol: 'ADA'
        },
        value: '-4824203'
      },
      coin_change: {
        coin_action: 'coin_spent',
        coin_identifier: {
          identifier: '7bee41a9efc593cc13e178ca1197da1e873a3de1d8d3e9956d6ab72393f79aae:0'
        }
      },
      operation_identifier: {
        index: 1
      },
      status: 'success',
      type: 'input'
    },
    {
      account: {
        address:
          'addr_test1qqmcnxtr97pw4jw2n58cgjf4f3tvqhygcgxxlle85cy6qa7yu7lpuvuxgarfdp4dk5aezrce7q0jryq9khhl5zcqnjesuwkq9g'
      },
      amount: {
        currency: {
          decimals: 6,
          symbol: 'ADA'
        },
        value: '50000000'
      },
      coin_change: {
        coin_action: 'coin_created',
        coin_identifier: {
          identifier: '863783d4460647b8227411eb7b0cf8fac82c29f6f4ac52baf7e4d74fabb7884b:0'
        }
      },
      metadata: {
        tokenBundle: [
          {
            policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518',
            tokens: [
              {
                currency: {
                  decimals: 0,
                  symbol: '4154414441636f696e'
                },
                value: '3'
              }
            ]
          }
        ]
      },
      operation_identifier: {
        index: 2,
        network_index: 0
      },
      related_operations: [
        {
          index: 0
        },
        {
          index: 1
        }
      ],
      status: 'success',
      type: 'output'
    },
    {
      account: {
        address:
          'addr_test1qq94n8h2s2rdtunjgjfrrnp95uzjyz86xl8cgptclspt8pd27sflv5m2ta3hax32dpd6ltqd7m5lm2vgayt3n45mtkgqwx3auy'
      },
      amount: {
        currency: {
          decimals: 6,
          symbol: 'ADA'
        },
        value: '2000000'
      },
      coin_change: {
        coin_action: 'coin_created',
        coin_identifier: {
          identifier: '863783d4460647b8227411eb7b0cf8fac82c29f6f4ac52baf7e4d74fabb7884b:1'
        }
      },
      metadata: {
        tokenBundle: [
          {
            policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518',
            tokens: [
              {
                currency: {
                  decimals: 0,
                  symbol: '4154414441636f696e'
                },
                value: '4'
              }
            ]
          }
        ]
      },
      operation_identifier: {
        index: 3,
        network_index: 1
      },
      related_operations: [
        {
          index: 0
        },
        {
          index: 1
        }
      ],
      status: 'success',
      type: 'output'
    },
    {
      account: {
        address: 'addr_test1vplgcajn3d922znzumlqzhwmtz5hkgf3c6a3tlqt3mhl6wse6xkt5'
      },
      amount: {
        currency: {
          decimals: 6,
          symbol: 'ADA'
        },
        value: '509925156939'
      },
      coin_change: {
        coin_action: 'coin_created',
        coin_identifier: {
          identifier: '863783d4460647b8227411eb7b0cf8fac82c29f6f4ac52baf7e4d74fabb7884b:2'
        }
      },
      metadata: {
        tokenBundle: [
          {
            policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518',
            tokens: [
              {
                currency: {
                  decimals: 0,
                  symbol: '61646f736961'
                },
                value: '11345'
              }
            ]
          },
          {
            policyId: '438918d2b57ef161987da24bc010b364dc852a70f9d5a3607d4c30cd',
            tokens: [
              {
                currency: {
                  decimals: 0,
                  symbol: '42435348'
                },
                value: '950000'
              }
            ]
          },
          {
            policyId: 'a52d2133008537f40f755932383466434543e87dbf8b99143fa7b5d9',
            tokens: [
              {
                currency: {
                  decimals: 0,
                  symbol: '676f6c64'
                },
                value: '950'
              }
            ]
          }
        ]
      },
      operation_identifier: {
        index: 4,
        network_index: 2
      },
      related_operations: [
        {
          index: 0
        },
        {
          index: 1
        }
      ],
      status: 'success',
      type: 'output'
    }
  ],
  transaction_identifier: {
    hash: '863783d4460647b8227411eb7b0cf8fac82c29f6f4ac52baf7e4d74fabb7884b'
  }
};
export const launchpadBlock344050 = {
  block: {
    block_identifier: {
      hash: '50dfb1d3d82d89d392d3c5118e43d60146a37eea0d6fe81bf475133e21b6d82f',
      index: 344050
    },
    metadata: {
      createdBy: 'ShelleyGenesis-3471f5c7d7a5f578',
      epochNo: 973,
      size: 578,
      slotNo: 6994000,
      transactionsCount: 1
    },
    parent_block_identifier: {
      hash: '6adce7e55cf491c735ecef06c81dde23c9dd1a0648603ac05abd33aa0471415f',
      index: 344049
    },
    timestamp: 1610386480000,
    transactions: [transaction344050WithTokenBundle]
  }
};

export const GENESIS_HASH = '5f20df933584822601f9e3f8c024eb5eb252fe8cefb24d1317dc3d432e940ebb';

export const block1 = {
  block: {
    block_identifier: {
      hash: 'f0f7892b5c333cffc4b3c4344de48af4cc63f55e44936196f365a9ef2244134f',
      index: 1
    },
    metadata: {
      createdBy: slotLeader2b1,
      epochNo: 0,
      size: 665,
      slotNo: 0,
      transactionsCount: 0
    },
    parent_block_identifier: {
      hash: GENESIS_HASH,
      index: 0
    },
    timestamp: 1506203091000,
    transactions: []
  }
};

export const transaction987aOnGenesis = {
  transaction: {
    operations: [
      {
        account: {
          address: 'Ae2tdPwUPEZ9vtyppa1FdJzvqJZkEcXgdHxVYAzTWcPaoNycVq5rc36LC1S'
        },
        amount: {
          currency: {
            decimals: 6,
            symbol: 'ADA'
          },
          value: '538861000000'
        },
        operation_identifier: {
          index: 0,
          network_index: 0
        },
        related_operations: [],
        status: 'success',
        type: OperationType.OUTPUT,
        coin_change: {
          coin_action: 'coin_created',
          coin_identifier: {
            identifier: '927edb96f3386ab91b5f5d85d84cb4253c65b1c2f65fa7df25f81fab1d62987a:0'
          }
        }
      }
    ],
    transaction_identifier: {
      hash: '927edb96f3386ab91b5f5d85d84cb4253c65b1c2f65fa7df25f81fab1d62987a'
    }
  }
};

// The following test vectors
// ./cardano-cli shelley transaction build-raw --tx-in 2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f#1 \
//  --tx-out addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx +10000 \
//  --tx-out addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx+40000  --ttl 1000 --fee 40000 --out-file /tmp/tx.txt
//     And the output was hashed using:
// import { createHash } from "blake2";
// const txBuffer = Buffer.from(
//   "a400818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c4002199c40031903e8",
//   "hex"
// );
// var h = createHash("blake2b", { digestLength: 32 });
// h.update(txBuffer);
// console.log(h.digest("hex"))

export const CONSTRUCTION_PAYLOADS_REQUEST: Components.Schemas.ConstructionPayloadsRequest = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  operations: [
    {
      operation_identifier: {
        index: 0,
        network_index: 0
      },
      type: OperationType.INPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '-90000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          identifier: '2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:1'
        },
        coin_action: 'coin_spent'
      }
    },
    {
      operation_identifier: {
        index: 1
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '10000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 2
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '40000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    }
  ],
  metadata: {
    ttl: '1000'
  }
};

export const CONSTRUCTION_PAYLOADS_REQUEST_WITH_BYRON_INPUT: Components.Schemas.ConstructionPayloadsRequest = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  operations: [
    {
      operation_identifier: {
        index: 0,
        network_index: 0
      },
      type: OperationType.INPUT,
      status: 'success',
      account: {
        address: 'Ae2tdPwUPEZFRbyhz3cpfC2CumGzNkFBN2L42rcUc2yjQpEkxDbkPodpMAi'
      },
      amount: {
        value: '-90000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          identifier: '2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:1'
        },
        coin_action: 'coin_spent'
      }
    },
    {
      operation_identifier: {
        index: 1
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'Ae2tdPwUPEZFRbyhz3cpfC2CumGzNkFBN2L42rcUc2yjQpEkxDbkPodpMAi'
      },
      amount: {
        value: '10000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 2
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'Ae2tdPwUPEZFRbyhz3cpfC2CumGzNkFBN2L42rcUc2yjQpEkxDbkPodpMAi'
      },
      amount: {
        value: '40000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    }
  ],
  metadata: {
    ttl: '1000'
  }
};

export const CONSTRUCTION_PAYLOADS_REQUEST_WITH_BYRON_OUTPUT: Components.Schemas.ConstructionPayloadsRequest = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  operations: [
    {
      operation_identifier: {
        index: 0,
        network_index: 0
      },
      type: OperationType.INPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '-90000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          identifier: '2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:1'
        },
        coin_action: 'coin_spent'
      }
    },
    {
      operation_identifier: {
        index: 1
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address:
          'DdzFFzCqrht9fvu17fiXwiuP82kKEhiGsDByRE7PWfMktrd8Jc1jWqKxubpz21mWjUMh8bWsKuP5JUF9CgUefyABDBsq326ybHrEhB7M'
      },
      amount: {
        value: '10000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 2
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '40000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    }
  ],
  metadata: {
    ttl: '1000'
  }
};

export const CONSTRUCTION_PAYLOADS_REQUEST_WITH_SEVERAL_MA: Components.Schemas.ConstructionPayloadsRequest = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  operations: [
    {
      operation_identifier: {
        index: 0,
        network_index: 0
      },
      type: OperationType.INPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '-90000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          identifier: '2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:1'
        },
        coin_action: 'coin_spent'
      },
      metadata: {
        tokenBundle: [
          {
            policyId: 'b0d07d45fe9514f80213f4020e5a61241458be626841cde717cb38a7',
            tokens: [
              {
                value: '2310',
                currency: {
                  symbol: '477569646f436f696e',
                  decimals: 0
                }
              },
              {
                value: '6666',
                currency: {
                  symbol: '4a75616e4372757a546f6b656e617a6f',
                  decimals: 0
                }
              },
              {
                value: '10000',
                currency: {
                  symbol: '6e7574636f696e',
                  decimals: 0
                }
              }
            ]
          }
        ]
      }
    },
    {
      operation_identifier: {
        index: 1
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '10000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      metadata: {
        tokenBundle: [
          {
            policyId: 'b0d07d45fe9514f80213f4020e5a61241458be626841cde717cb38a7',
            tokens: [
              {
                value: '2310',
                currency: {
                  symbol: '477569646f436f696e',
                  decimals: 0
                }
              },
              {
                value: '6666',
                currency: {
                  symbol: '4a75616e4372757a546f6b656e617a6f',
                  decimals: 0
                }
              },
              {
                value: '10000',
                currency: {
                  symbol: '6e7574636f696e',
                  decimals: 0
                }
              }
            ]
          }
        ]
      }
    },
    {
      operation_identifier: {
        index: 2
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '40000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    }
  ],
  metadata: {
    ttl: '1000'
  }
};

export const CONSTRUCTION_PAYLOADS_REQUEST_WITH_MULTIPLE_MA: Components.Schemas.ConstructionPayloadsRequest = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  operations: [
    {
      operation_identifier: {
        index: 0,
        network_index: 0
      },
      type: OperationType.INPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '-90000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          identifier: '2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:1'
        },
        coin_action: 'coin_spent'
      },
      metadata: {
        tokenBundle: [
          {
            policyId: 'b0d07d45fe9514f80213f4020e5a61241458be626841cde717cb38a7',
            tokens: [
              {
                value: '2310',
                currency: {
                  symbol: '477569646f436f696e',
                  decimals: 0
                }
              },
              {
                value: '10000',
                currency: {
                  symbol: '6e7574636f696e',
                  decimals: 0
                }
              }
            ]
          }
        ]
      }
    },
    {
      operation_identifier: {
        index: 1
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '10000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      metadata: {
        tokenBundle: [
          {
            policyId: 'b0d07d45fe9514f80213f4020e5a61241458be626841cde717cb38a7',
            tokens: [
              {
                value: '2310',
                currency: {
                  symbol: '477569646f436f696e',
                  decimals: 0
                }
              },
              {
                value: '10000',
                currency: {
                  symbol: '6e7574636f696e',
                  decimals: 0
                }
              }
            ]
          }
        ]
      }
    },
    {
      operation_identifier: {
        index: 2
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '40000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    }
  ],
  metadata: {
    ttl: '1000'
  }
};

export const CONSTRUCTION_PAYLOADS_REQUEST_WITM_MA_WITHOUT_NAME: Components.Schemas.ConstructionPayloadsRequest = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  operations: [
    {
      operation_identifier: {
        index: 0,
        network_index: 0
      },
      type: OperationType.INPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '-90000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          identifier: '2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:1'
        },
        coin_action: 'coin_spent'
      },
      metadata: {
        tokenBundle: [
          {
            policyId: 'b0d07d45fe9514f80213f4020e5a61241458be626841cde717cb38a7',
            tokens: [
              {
                value: '10000',
                currency: {
                  symbol: '\\x',
                  decimals: 0
                }
              }
            ]
          }
        ]
      }
    },
    {
      operation_identifier: {
        index: 1
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '10000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      metadata: {
        tokenBundle: [
          {
            policyId: 'b0d07d45fe9514f80213f4020e5a61241458be626841cde717cb38a7',
            tokens: [
              {
                value: '10000',
                currency: {
                  symbol: '\\x',
                  decimals: 0
                }
              }
            ]
          }
        ]
      }
    },
    {
      operation_identifier: {
        index: 2
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '40000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    }
  ],
  metadata: {
    ttl: '1000'
  }
};

export const CONSTRUCTION_PAYLOADS_REQUEST_WITH_MA: Components.Schemas.ConstructionPayloadsRequest = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  operations: [
    {
      operation_identifier: {
        index: 0,
        network_index: 0
      },
      type: OperationType.INPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '-90000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          identifier: '2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:1'
        },
        coin_action: 'coin_spent'
      },
      metadata: {
        tokenBundle: [
          {
            policyId: 'b0d07d45fe9514f80213f4020e5a61241458be626841cde717cb38a7',
            tokens: [
              {
                value: '10000',
                currency: {
                  symbol: '6e7574636f696e',
                  decimals: 0
                }
              }
            ]
          }
        ]
      }
    },
    {
      operation_identifier: {
        index: 1
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '10000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      metadata: {
        tokenBundle: [
          {
            policyId: 'b0d07d45fe9514f80213f4020e5a61241458be626841cde717cb38a7',
            tokens: [
              {
                value: '10000',
                currency: {
                  symbol: '6e7574636f696e',
                  decimals: 0
                }
              }
            ]
          }
        ]
      }
    },
    {
      operation_identifier: {
        index: 2
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '40000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    }
  ],
  metadata: {
    ttl: '1000'
  }
};

export const CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_REGISTRATION: Components.Schemas.ConstructionPayloadsRequest = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  operations: [
    {
      operation_identifier: {
        index: 0,
        network_index: 0
      },
      type: OperationType.INPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '-9000000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          identifier: '2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:1'
        },
        coin_action: 'coin_spent'
      }
    },
    {
      operation_identifier: {
        index: 1
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '10000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 2
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '40000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 3
      },
      type: OperationType.STAKE_KEY_REGISTRATION,
      status: 'success',
      account: { address: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5' },
      metadata: {
        staking_credential: {
          hex_bytes: '1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F',
          curve_type: 'edwards25519'
        }
      }
    }
  ],
  metadata: {
    ttl: '1000'
  }
};

export const CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_DEREGISTRATION: Components.Schemas.ConstructionPayloadsRequest = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  operations: [
    {
      operation_identifier: {
        index: 0,
        network_index: 0
      },
      type: OperationType.INPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '-90000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          identifier: '2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:1'
        },
        coin_action: 'coin_spent'
      }
    },
    {
      operation_identifier: {
        index: 1
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '10000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 2
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '40000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 3
      },
      type: OperationType.STAKE_KEY_DEREGISTRATION,
      status: 'success',
      account: { address: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5' },
      metadata: {
        staking_credential: {
          hex_bytes: '1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F',
          curve_type: 'edwards25519'
        }
      }
    }
  ],
  metadata: {
    ttl: '1000'
  }
};

export const CONSTRUCTION_PAYLOADS_WITH_POOL_RETIREMENT: Components.Schemas.ConstructionPayloadsRequest = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  operations: [
    {
      operation_identifier: {
        index: 0,
        network_index: 0
      },
      type: OperationType.INPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '-90000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          identifier: '2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:1'
        },
        coin_action: 'coin_spent'
      }
    },
    {
      operation_identifier: {
        index: 1
      },
      type: OperationType.POOL_RETIREMENT,
      status: 'success',
      account: {
        address: '153806dbcd134ddee69a8c5204e38ac80448f62342f8c23cfe4b7edf'
      },
      metadata: {
        epoch: 200
      }
    }
  ],
  metadata: {
    ttl: '1000'
  }
};

export const CONSTRUCTION_PAYLOADS_WITH_POOL_RETIREMENT_NO_EPOCH: Components.Schemas.ConstructionPayloadsRequest = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  operations: [
    {
      operation_identifier: {
        index: 0,
        network_index: 0
      },
      type: OperationType.INPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '-90000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          identifier: '2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:1'
        },
        coin_action: 'coin_spent'
      }
    },
    {
      operation_identifier: {
        index: 1
      },
      type: OperationType.POOL_RETIREMENT,
      status: 'success',
      account: {
        address: '153806dbcd134ddee69a8c5204e38ac80448f62342f8c23cfe4b7edf'
      },
      amount: {
        value: '-90000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          identifier: '2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:1'
        },
        coin_action: 'coin_spent'
      },
      metadata: {}
    }
  ],
  metadata: {
    ttl: '1000'
  }
};

export const CONSTRUCTION_PAYLOADS_WITH_STAKE_DELEGATION: Components.Schemas.ConstructionPayloadsRequest = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  operations: [
    {
      operation_identifier: {
        index: 0,
        network_index: 0
      },
      type: OperationType.INPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '-90000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          identifier: '2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:1'
        },
        coin_action: 'coin_spent'
      }
    },
    {
      operation_identifier: {
        index: 1
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '10000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 2
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '40000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 3
      },
      type: OperationType.STAKE_DELEGATION,
      status: 'success',
      account: { address: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5' },
      metadata: {
        staking_credential: {
          hex_bytes: '1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F',
          curve_type: 'edwards25519'
        },
        pool_key_hash: '1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5'
      }
    }
  ],
  metadata: {
    ttl: '1000'
  }
};

export const CONSTRUCTION_PAYLOADS_WITH_STAKE_REGISTRATION_AND_DELEGATION: Components.Schemas.ConstructionPayloadsRequest = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  operations: [
    {
      operation_identifier: {
        index: 0,
        network_index: 0
      },
      type: OperationType.INPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '-9000000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          identifier: '2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:1'
        },
        coin_action: 'coin_spent'
      }
    },
    {
      operation_identifier: {
        index: 1
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '10000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 2
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '40000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 3
      },
      type: OperationType.STAKE_KEY_REGISTRATION,
      status: 'success',
      account: { address: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5' },
      metadata: {
        staking_credential: {
          hex_bytes: '1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F',
          curve_type: 'edwards25519'
        }
      }
    },
    {
      operation_identifier: {
        index: 4
      },
      type: OperationType.STAKE_DELEGATION,
      status: 'success',
      account: { address: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5' },
      metadata: {
        staking_credential: {
          hex_bytes: '1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F',
          curve_type: 'edwards25519'
        },
        pool_key_hash: '1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5'
      }
    }
  ],
  metadata: {
    ttl: '1000'
  }
};

export const CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_REGISTRATION_AND_STAKE_DELEGATION: Components.Schemas.ConstructionPayloadsRequest = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  operations: [
    {
      operation_identifier: {
        index: 0,
        network_index: 0
      },
      type: OperationType.INPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '-9000000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          identifier: '2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:1'
        },
        coin_action: 'coin_spent'
      }
    },
    {
      operation_identifier: {
        index: 1
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '10000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 2
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '40000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 3
      },
      type: OperationType.STAKE_KEY_REGISTRATION,
      status: 'success',
      metadata: {
        staking_credential: {
          hex_bytes: '1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F',
          curve_type: 'edwards25519'
        }
      }
    },
    {
      operation_identifier: {
        index: 3
      },
      type: OperationType.STAKE_DELEGATION,
      status: 'success',
      metadata: {
        staking_credential: {
          hex_bytes: '1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F',
          curve_type: 'edwards25519'
        },
        pool_key_hash: '1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5'
      }
    }
  ],
  metadata: {
    ttl: '1000'
  }
};

export const CONSTRUCTION_PAYLOADS_WITH_WITHDRAWAL: Components.Schemas.ConstructionPayloadsRequest = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  operations: [
    {
      operation_identifier: {
        index: 0,
        network_index: 0
      },
      type: OperationType.INPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '-90000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          identifier: '2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:1'
        },
        coin_action: 'coin_spent'
      }
    },
    {
      operation_identifier: {
        index: 1
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '10000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 2
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '40000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 4
      },
      type: OperationType.WITHDRAWAL,
      status: 'success',
      account: { address: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5' },
      amount: {
        value: '10000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      metadata: {
        staking_credential: {
          hex_bytes: '1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F',
          curve_type: 'edwards25519'
        }
      }
    }
  ],
  metadata: {
    ttl: '1000'
  }
};

export const CONSTRUCTION_PAYLOADS_WITH_TWO_WITHDRAWALS: Components.Schemas.ConstructionPayloadsRequest = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  operations: [
    {
      operation_identifier: {
        index: 0,
        network_index: 0
      },
      type: OperationType.INPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '-90000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          identifier: '2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:1'
        },
        coin_action: 'coin_spent'
      }
    },
    {
      operation_identifier: {
        index: 1
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '10000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 2
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '40000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 3
      },
      type: OperationType.WITHDRAWAL,
      status: 'success',
      amount: {
        value: '10000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      metadata: {
        staking_credential: {
          hex_bytes: '1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F',
          curve_type: 'edwards25519'
        }
      }
    },
    {
      operation_identifier: {
        index: 4
      },
      type: OperationType.WITHDRAWAL,
      status: 'success',
      amount: {
        value: '10000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      metadata: {
        staking_credential: {
          hex_bytes: '31fc9813a71d8db12a4f2e3382ab0671005665b70d0cd1a9fb6c4a4e9ceabc90',
          curve_type: 'edwards25519'
        }
      }
    }
  ],
  metadata: {
    ttl: '1000'
  }
};

export const CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_REGISTRATION_AND_WITHDRAWAL: Components.Schemas.ConstructionPayloadsRequest = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  operations: [
    {
      operation_identifier: {
        index: 0,
        network_index: 0
      },
      type: OperationType.INPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '-9000000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          identifier: '2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:1'
        },
        coin_action: 'coin_spent'
      }
    },
    {
      operation_identifier: {
        index: 1
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '10000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 2
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '40000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 3
      },
      type: OperationType.STAKE_KEY_REGISTRATION,
      status: 'success',
      account: { address: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5' },
      metadata: {
        staking_credential: {
          hex_bytes: '1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F',
          curve_type: 'edwards25519'
        }
      }
    },
    {
      operation_identifier: {
        index: 4
      },
      type: OperationType.WITHDRAWAL,
      status: 'success',
      account: { address: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5' },
      amount: {
        value: '10000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      metadata: {
        staking_credential: {
          hex_bytes: '1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F',
          curve_type: 'edwards25519'
        }
      }
    }
  ],
  metadata: {
    ttl: '1000'
  }
};

export const CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_AND_PLEDGE: Components.Schemas.ConstructionPayloadsRequest = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  operations: [
    {
      operation_identifier: {
        index: 0,
        network_index: 0
      },
      type: OperationType.INPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '-90000000000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          identifier: '2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:1'
        },
        coin_action: 'coin_spent'
      }
    },
    {
      operation_identifier: {
        index: 1
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '10000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 2
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '40000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 3
      },
      type: OperationType.POOL_REGISTRATION,
      status: 'success',
      account: { address: '1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5' },
      metadata: {
        poolRegistrationParams: {
          vrfKeyHash: '8dd154228946bd12967c12bedb1cb6038b78f8b84a1760b1a788fa72a4af3db0',
          rewardAddress: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5',
          pledge: '5000000',
          cost: '3000000',
          poolOwners: ['stake1uxly0q2cnpxrjrqm9vpnr9dwkr0j945gulhhgs3dx33l47sweg9er'],
          relays: [
            {
              type: 'single_host_addr',
              ipv4: '127.0.0.1',
              ipv6: '2345:0425:2ca1:0000:0000:0567:5673:23b5',
              port: '32'
            }
          ],
          margin: {
            numerator: '1',
            denominator: '1'
          },
          poolMetadata: {
            url: 'poolMetadataUrl',
            hash: '9ac2217288d1ae0b4e15c41b58d3e05a13206fd9ab81cb15943e4174bf30c90b'
          }
        }
      }
    },
    {
      operation_identifier: {
        index: 3
      },
      type: OperationType.STAKE_DELEGATION,
      status: 'success',
      account: { address: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5' },
      metadata: {
        staking_credential: {
          hex_bytes: '1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F',
          curve_type: 'edwards25519'
        },
        pool_key_hash: '1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5'
      }
    }
  ],
  metadata: {
    ttl: '1000'
  }
};

export const CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_MULTIPLE_RELAY: Components.Schemas.ConstructionPayloadsRequest = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  operations: [
    {
      operation_identifier: {
        index: 0,
        network_index: 0
      },
      type: OperationType.INPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '-90000000000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          identifier: '2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:1'
        },
        coin_action: 'coin_spent'
      }
    },
    {
      operation_identifier: {
        index: 1
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '10000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 2
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '40000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 3
      },
      type: OperationType.POOL_REGISTRATION,
      status: 'success',
      account: { address: '1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5' },
      metadata: {
        poolRegistrationParams: {
          vrfKeyHash: '8dd154228946bd12967c12bedb1cb6038b78f8b84a1760b1a788fa72a4af3db0',
          rewardAddress: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5',
          pledge: '5000000',
          cost: '3000000',
          poolOwners: ['stake1uxly0q2cnpxrjrqm9vpnr9dwkr0j945gulhhgs3dx33l47sweg9er'],
          relays: [
            {
              type: 'single_host_addr',
              ipv4: '127.0.0.1',
              ipv6: '2345:0425:2ca1:0000:0000:0567:5673:23b5',
              port: '32'
            },
            {
              type: 'single_host_name',
              dnsName: 'dnsName',
              port: '32'
            },
            {
              type: 'multi_host_name',
              dnsName: 'dnsName'
            }
          ],
          margin: {
            numerator: '1',
            denominator: '1'
          },
          poolMetadata: {
            url: 'poolMetadataUrl',
            hash: '9ac2217288d1ae0b4e15c41b58d3e05a13206fd9ab81cb15943e4174bf30c90b'
          }
        }
      }
    },
    {
      operation_identifier: {
        index: 3
      },
      type: OperationType.STAKE_DELEGATION,
      status: 'success',
      account: { address: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5' },
      metadata: {
        staking_credential: {
          hex_bytes: '1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F',
          curve_type: 'edwards25519'
        },
        pool_key_hash: '1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5'
      }
    }
  ],
  metadata: {
    ttl: '1000'
  }
};

export const CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_SINGLE_HOST_ADDR: Components.Schemas.ConstructionPayloadsRequest = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  operations: [
    {
      operation_identifier: {
        index: 0,
        network_index: 0
      },
      type: OperationType.INPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '-90000000000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          identifier: '2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:1'
        },
        coin_action: 'coin_spent'
      }
    },
    {
      operation_identifier: {
        index: 1
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '10000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 2
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '40000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 3
      },
      type: OperationType.POOL_REGISTRATION,
      status: 'success',
      account: { address: '1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5' },
      metadata: {
        poolRegistrationParams: {
          vrfKeyHash: '8dd154228946bd12967c12bedb1cb6038b78f8b84a1760b1a788fa72a4af3db0',
          rewardAddress: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5',
          pledge: '0',
          cost: '3000000',
          poolOwners: ['stake1uxly0q2cnpxrjrqm9vpnr9dwkr0j945gulhhgs3dx33l47sweg9er'],
          relays: [
            {
              type: 'single_host_addr',
              ipv4: '127.0.0.1',
              ipv6: '2345:0425:2ca1:0000:0000:0567:5673:23b5',
              dnsName: 'dnsName',
              port: '32'
            }
          ],
          margin: {
            numerator: '1',
            denominator: '1'
          },
          poolMetadata: {
            url: 'poolMetadataUrl',
            hash: '9ac2217288d1ae0b4e15c41b58d3e05a13206fd9ab81cb15943e4174bf30c90b'
          }
        }
      }
    }
  ],
  metadata: {
    ttl: '1000'
  }
};

export const CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_NO_METADATA: Components.Schemas.ConstructionPayloadsRequest = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  operations: [
    {
      operation_identifier: {
        index: 0,
        network_index: 0
      },
      type: OperationType.INPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '-90000000000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          identifier: '2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:1'
        },
        coin_action: 'coin_spent'
      }
    },
    {
      operation_identifier: {
        index: 1
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '10000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 2
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '40000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 3
      },
      type: OperationType.POOL_REGISTRATION,
      status: 'success',
      account: { address: '1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5' },
      metadata: {
        poolRegistrationParams: {
          vrfKeyHash: '8dd154228946bd12967c12bedb1cb6038b78f8b84a1760b1a788fa72a4af3db0',
          rewardAddress: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5',
          pledge: '0',
          cost: '3000000',
          poolOwners: ['stake1uxly0q2cnpxrjrqm9vpnr9dwkr0j945gulhhgs3dx33l47sweg9er'],
          relays: [
            {
              type: 'single_host_addr',
              ipv4: '127.0.0.1',
              ipv6: '2345:0425:2ca1:0000:0000:0567:5673:23b5',
              port: '32'
            }
          ],
          margin: {
            numerator: '1',
            denominator: '1'
          }
        }
      }
    }
  ],
  metadata: {
    ttl: '1000'
  }
};

export const CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_SINGLE_HOST_NAME: Components.Schemas.ConstructionPayloadsRequest = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  operations: [
    {
      operation_identifier: {
        index: 0,
        network_index: 0
      },
      type: OperationType.INPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '-90000000000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          identifier: '2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:1'
        },
        coin_action: 'coin_spent'
      }
    },
    {
      operation_identifier: {
        index: 1
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '10000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 2
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '40000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 3
      },
      type: OperationType.POOL_REGISTRATION,
      status: 'success',
      account: { address: '1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5' },
      metadata: {
        poolRegistrationParams: {
          vrfKeyHash: '8dd154228946bd12967c12bedb1cb6038b78f8b84a1760b1a788fa72a4af3db0',
          rewardAddress: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5',
          pledge: '0',
          cost: '3000000',
          poolOwners: ['stake1uxly0q2cnpxrjrqm9vpnr9dwkr0j945gulhhgs3dx33l47sweg9er'],
          relays: [
            {
              type: 'single_host_addr',
              dnsName: 'dnsName',
              port: '32'
            }
          ],
          margin: {
            numerator: '1',
            denominator: '1'
          },
          poolMetadata: {
            url: 'poolMetadataUrl',
            hash: '9ac2217288d1ae0b4e15c41b58d3e05a13206fd9ab81cb15943e4174bf30c90b'
          }
        }
      }
    }
  ],
  metadata: {
    ttl: '1000'
  }
};

export const CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_MULTI_HOST_NAME: Components.Schemas.ConstructionPayloadsRequest = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  operations: [
    {
      operation_identifier: {
        index: 0,
        network_index: 0
      },
      type: OperationType.INPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '-90000000000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          identifier: '2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:1'
        },
        coin_action: 'coin_spent'
      }
    },
    {
      operation_identifier: {
        index: 1
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '10000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 2
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '40000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 3
      },
      type: OperationType.POOL_REGISTRATION,
      status: 'success',
      account: { address: '1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5' },
      metadata: {
        poolRegistrationParams: {
          vrfKeyHash: '8dd154228946bd12967c12bedb1cb6038b78f8b84a1760b1a788fa72a4af3db0',
          rewardAddress: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5',
          pledge: '0',
          cost: '3000000',
          poolOwners: ['stake1uxly0q2cnpxrjrqm9vpnr9dwkr0j945gulhhgs3dx33l47sweg9er'],
          relays: [
            {
              type: 'multi_host_name',
              dnsName: 'dnsName'
            }
          ],
          margin: {
            numerator: '1',
            denominator: '1'
          },
          poolMetadata: {
            url: 'poolMetadataUrl',
            hash: '9ac2217288d1ae0b4e15c41b58d3e05a13206fd9ab81cb15943e4174bf30c90b'
          }
        }
      }
    }
  ],
  metadata: {
    ttl: '1000'
  }
};

export const CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_NO_COLD_KEY: Components.Schemas.ConstructionPayloadsRequest = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  operations: [
    {
      operation_identifier: {
        index: 0,
        network_index: 0
      },
      type: OperationType.INPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '-90000000000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          identifier: '2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:1'
        },
        coin_action: 'coin_spent'
      }
    },
    {
      operation_identifier: {
        index: 1
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '10000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 2
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '40000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 3
      },
      type: OperationType.POOL_REGISTRATION,
      status: 'success',
      metadata: {
        poolRegistrationParams: {
          vrfKeyHash: '8dd154228946bd12967c12bedb1cb6038b78f8b84a1760b1a788fa72a4af3db0',
          rewardAddress: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5',
          pledge: '0',
          cost: '3000000',
          poolOwners: ['stake1uxly0q2cnpxrjrqm9vpnr9dwkr0j945gulhhgs3dx33l47sweg9er'],
          relays: [
            {
              type: 'single_host_addr',
              ipv4: '127.0.0.1',
              ipv6: '2345:0425:2ca1:0000:0000:0567:5673:23b5',
              port: '32'
            }
          ],
          margin: {
            numerator: '1',
            denominator: '1'
          }
        }
      }
    }
  ],
  metadata: {
    ttl: '1000'
  }
};

export const CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_CERT: Components.Schemas.ConstructionPayloadsRequest = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  operations: [
    {
      operation_identifier: {
        index: 0,
        network_index: 0
      },
      type: OperationType.INPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '-90000000000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          identifier: '2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:1'
        },
        coin_action: 'coin_spent'
      }
    },
    {
      operation_identifier: {
        index: 1
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '10000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 2
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '40000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 3
      },
      type: OperationType.POOL_REGISTRATION_WITH_CERT,
      status: 'success',
      account: { address: '1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5' },
      metadata: {
        poolRegistrationCert:
          '8a03581c1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b558208dd154228946bd12967c12bedb1cb6038b78f8b84a1760b1a788fa72a4af3db01a004c4b401a002dc6c0d81e820101581de1bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb81581c7a9a4d5a6ac7a9d8702818fa3ea533e56c4f1de16da611a730ee3f008184001820445820f5d9505820f5d9ea167fd2e0b19647f18dd1e0826f706f6f6c4d6574616461746155726c58209ac2217288d1ae0b4e15c41b58d3e05a13206fd9ab81cb15943e4174bf30c90b'
      }
    },
    {
      operation_identifier: {
        index: 3
      },
      type: OperationType.STAKE_DELEGATION,
      status: 'success',
      account: { address: 'stake1uxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7caek7a5' },
      metadata: {
        staking_credential: {
          hex_bytes: '1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F',
          curve_type: 'edwards25519'
        },
        pool_key_hash: '1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5'
      }
    }
  ],
  metadata: {
    ttl: '1000'
  }
};

export const CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_INVALID_CERT: Components.Schemas.ConstructionPayloadsRequest = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  operations: [
    {
      operation_identifier: {
        index: 0,
        network_index: 0
      },
      type: OperationType.INPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '-9000000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          identifier: '2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:1'
        },
        coin_action: 'coin_spent'
      }
    },
    {
      operation_identifier: {
        index: 1
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '10000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 2
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '40000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 3
      },
      type: OperationType.POOL_REGISTRATION_WITH_CERT,
      status: 'success',
      account: { address: '1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5' },
      metadata: {
        poolRegistrationCert: 'notAValidHexCert'
      }
    }
  ],
  metadata: {
    ttl: '1000'
  }
};

export const CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_INVALID_CERT_TYPE: Components.Schemas.ConstructionPayloadsRequest = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  operations: [
    {
      operation_identifier: {
        index: 0,
        network_index: 0
      },
      type: OperationType.INPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '-9000000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          identifier: '2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:1'
        },
        coin_action: 'coin_spent'
      }
    },
    {
      operation_identifier: {
        index: 1
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '10000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 2
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '40000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 3
      },
      type: OperationType.POOL_REGISTRATION_WITH_CERT,
      status: 'success',
      account: { address: '1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5' },
      metadata: {
        poolRegistrationCert:
          '83028200581cbb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb581c1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5'
      }
    }
  ],
  metadata: {
    ttl: '1000'
  }
};

export const CONSTRUCTION_PAYLOADS_INVALID_OPERATION_TYPE: Components.Schemas.ConstructionPayloadsRequest = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  operations: [
    {
      operation_identifier: {
        index: 0,
        network_index: 0
      },
      type: 'invalid',
      status: 'success',
      metadata: {
        staking_credential: {
          hex_bytes: '1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F',
          curve_type: 'edwards25519'
        }
      }
    }
  ],
  metadata: {
    ttl: '1000'
  }
};

export const CONSTRUCTION_PAYLOADS_MULTIPLE_INPUTS: Components.Schemas.ConstructionPayloadsRequest = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  operations: [
    {
      operation_identifier: {
        index: 0,
        network_index: 0
      },
      type: OperationType.INPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '-90000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          identifier: '2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:1'
        },
        coin_action: 'coin_spent'
      }
    },
    {
      operation_identifier: {
        index: 1,
        network_index: 0
      },
      type: OperationType.INPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '-10000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          identifier: '2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:1'
        },
        coin_action: 'coin_spent'
      }
    },
    {
      operation_identifier: {
        index: 2
      },
      related_operations: [
        {
          index: 0
        },
        {
          index: 1
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '10000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 3
      },
      related_operations: [
        {
          index: 0
        },
        {
          index: 1
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '40000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    }
  ],
  metadata: {
    ttl: '1000'
  }
};

const constructionExtraData = (constructionPayloadsRequest: Components.Schemas.ConstructionPayloadsRequest) =>
  constructionPayloadsRequest.operations.filter(
    op =>
      op.coin_change?.coin_action === 'coin_spent' ||
      StakingOperations.includes(op.type as OperationType) ||
      PoolOperations.includes(op.type as OperationType)
  );

export const CONSTRUCTION_PAYLOADS_RESPONSE = cbor
  .encode([
    'a400818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c4002199c40031903e8',
    constructionExtraData(CONSTRUCTION_PAYLOADS_REQUEST)
  ])
  .toString('hex');

export const CONSTRUCTION_PAYLOADS_REQUEST_WITH_MA_RESPONSE = cbor
  .encode([
    'a400818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb82192710a1581cb0d07d45fe9514f80213f4020e5a61241458be626841cde717cb38a7a1476e7574636f696e19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c4002199c40031903e8',
    constructionExtraData(CONSTRUCTION_PAYLOADS_REQUEST_WITH_MA)
  ])
  .toString('hex');

export const CONSTRUCTION_PAYLOADS_REQUEST_WITH_BYRON_INPUT_RESPONSE = cbor
  .encode([
    'a400818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282582b82d818582183581cba970ad36654d8dd8f74274b733452ddeab9a62a397746be3c42ccdda0001a9026da5b19271082582b82d818582183581cba970ad36654d8dd8f74274b733452ddeab9a62a397746be3c42ccdda0001a9026da5b199c4002199c40031903e8',
    constructionExtraData(CONSTRUCTION_PAYLOADS_REQUEST_WITH_BYRON_INPUT)
  ])
  .toString('hex');

export const CONSTRUCTION_PAYLOADS_STAKE_REGISTRATION_RESPONSE = cbor
  .encode([
    'a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c40021a006a0c70031903e8048182008200581cbb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb',
    constructionExtraData(CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_REGISTRATION)
  ])
  .toString('hex');

export const CONSTRUCTION_PAYLOADS_STAKE_DEREGISTRATION_RESPONSE = cbor
  .encode([
    'a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c40021a001f20c0031903e8048182018200581cbb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb',
    constructionExtraData(CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_DEREGISTRATION)
  ])
  .toString('hex');

export const CONSTRUCTION_PAYLOADS_WITH_POOL_RETIREMENT_RESPONSE = cbor
  .encode([
    'a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f010180021a00015f90031903e804818304581c153806dbcd134ddee69a8c5204e38ac80448f62342f8c23cfe4b7edf18c8',
    constructionExtraData(CONSTRUCTION_PAYLOADS_WITH_POOL_RETIREMENT)
  ])
  .toString('hex');

export const CONSTRUCTION_PAYLOADS_STAKE_DELEGATION_RESPONSE = cbor
  .encode([
    'a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c4002199c40031903e8048183028200581cbb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb581c1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5',
    constructionExtraData(CONSTRUCTION_PAYLOADS_WITH_STAKE_DELEGATION)
  ])
  .toString('hex');

export const CONSTRUCTION_PAYLOADS_STAKE_REGISTRATION_AND_DELEGATION_RESPONSE = cbor
  .encode([
    'a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c40021a006a0c70031903e8048282008200581cbb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb83028200581cbb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb581c1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5',
    constructionExtraData(CONSTRUCTION_PAYLOADS_WITH_STAKE_REGISTRATION_AND_DELEGATION)
  ])
  .toString('hex');

export const CONSTRUCTION_PAYLOADS_WITHDRAWAL_RESPONSE = cbor
  .encode([
    'a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c400219c350031903e805a1581de1bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb192710',
    constructionExtraData(CONSTRUCTION_PAYLOADS_WITH_WITHDRAWAL)
  ])
  .toString('hex');

export const CONSTRUCTION_PAYLOADS_STAKE_REGISTRATION_AND_WITHDRAWAL_RESPONSE = cbor
  .encode([
    'a600818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c40021a006a3380031903e8048182008200581cbb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb05a1581de1bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb192710',
    constructionExtraData(CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_REGISTRATION_AND_WITHDRAWAL)
  ])
  .toString('hex');

export const CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_AND_PLEDGE_RESPONSE = cbor
  .encode([
    'a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c40021b00000014d69cdbb0031903e804828a03581c1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b558208dd154228946bd12967c12bedb1cb6038b78f8b84a1760b1a788fa72a4af3db01a004c4b401a002dc6c0d81e820101581de1bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb81581cbe478158984c390c1b2b033195aeb0df22d688e7ef74422d3463fafa8184001820447f00000150234504252ca1000000000567567323b5826f706f6f6c4d6574616461746155726c58209ac2217288d1ae0b4e15c41b58d3e05a13206fd9ab81cb15943e4174bf30c90b83028200581cbb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb581c1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5',
    constructionExtraData(CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_AND_PLEDGE)
  ])
  .toString('hex');

export const CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_SINGLE_HOST_ADDR_RESPONSE = cbor
  .encode([
    'a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c40021b00000014d69cdbb0031903e804818a03581c1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b558208dd154228946bd12967c12bedb1cb6038b78f8b84a1760b1a788fa72a4af3db0001a002dc6c0d81e820101581de1bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb81581cbe478158984c390c1b2b033195aeb0df22d688e7ef74422d3463fafa8184001820447f00000150234504252ca1000000000567567323b5826f706f6f6c4d6574616461746155726c58209ac2217288d1ae0b4e15c41b58d3e05a13206fd9ab81cb15943e4174bf30c90b',
    constructionExtraData(CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_SINGLE_HOST_ADDR)
  ])
  .toString('hex');

export const CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_SINGLE_HOST_NAME_RESPONSE = cbor
  .encode([
    'a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c40021b00000014d69cdbb0031903e804818a03581c1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b558208dd154228946bd12967c12bedb1cb6038b78f8b84a1760b1a788fa72a4af3db0001a002dc6c0d81e820101581de1bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb81581cbe478158984c390c1b2b033195aeb0df22d688e7ef74422d3463fafa8184001820f6f6826f706f6f6c4d6574616461746155726c58209ac2217288d1ae0b4e15c41b58d3e05a13206fd9ab81cb15943e4174bf30c90b',
    constructionExtraData(CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_SINGLE_HOST_NAME)
  ])
  .toString('hex');

export const CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_NO_METADATA_RESPONSE = cbor
  .encode([
    'a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c40021b00000014d69cdbb0031903e804818a03581c1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b558208dd154228946bd12967c12bedb1cb6038b78f8b84a1760b1a788fa72a4af3db0001a002dc6c0d81e820101581de1bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb81581cbe478158984c390c1b2b033195aeb0df22d688e7ef74422d3463fafa8184001820447f00000150234504252ca1000000000567567323b5f6',
    constructionExtraData(CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_NO_METADATA)
  ])
  .toString('hex');

export const CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_MULTI_HOST_NAME_RESPONSE = cbor
  .encode([
    'a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c40021b00000014d69cdbb0031903e804818a03581c1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b558208dd154228946bd12967c12bedb1cb6038b78f8b84a1760b1a788fa72a4af3db0001a002dc6c0d81e820101581de1bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb81581cbe478158984c390c1b2b033195aeb0df22d688e7ef74422d3463fafa81820267646e734e616d65826f706f6f6c4d6574616461746155726c58209ac2217288d1ae0b4e15c41b58d3e05a13206fd9ab81cb15943e4174bf30c90b',
    constructionExtraData(CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_MULTI_HOST_NAME)
  ])
  .toString('hex');

export const CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_MULTIPLE_RELAY_RESPONSE = cbor
  .encode([
    'a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c40021b00000014d69cdbb0031903e804828a03581c1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b558208dd154228946bd12967c12bedb1cb6038b78f8b84a1760b1a788fa72a4af3db01a004c4b401a002dc6c0d81e820101581de1bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb81581cbe478158984c390c1b2b033195aeb0df22d688e7ef74422d3463fafa8384001820447f00000150234504252ca1000000000567567323b58301182067646e734e616d65820267646e734e616d65826f706f6f6c4d6574616461746155726c58209ac2217288d1ae0b4e15c41b58d3e05a13206fd9ab81cb15943e4174bf30c90b83028200581cbb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb581c1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5',
    constructionExtraData(CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_MULTIPLE_RELAY)
  ])
  .toString('hex');

export const CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_CERT_RESPONSE = cbor
  .encode([
    'a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c40021b00000014d69cdbb0031903e804828a03581c1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b558208dd154228946bd12967c12bedb1cb6038b78f8b84a1760b1a788fa72a4af3db01a004c4b401a002dc6c0d81e820101581de1bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb81581c7a9a4d5a6ac7a9d8702818fa3ea533e56c4f1de16da611a730ee3f008184001820445820f5d9505820f5d9ea167fd2e0b19647f18dd1e0826f706f6f6c4d6574616461746155726c58209ac2217288d1ae0b4e15c41b58d3e05a13206fd9ab81cb15943e4174bf30c90b83028200581cbb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb581c1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5',
    constructionExtraData(CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_CERT)
  ])
  .toString('hex');

export const CONSTRUCTION_PAYLOADS_REQUEST_INVALID_OUTPUTS: Components.Schemas.ConstructionPayloadsRequest = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  operations: [
    {
      operation_identifier: {
        index: 0,
        network_index: 0
      },
      related_operations: [
        {
          index: 1
        }
      ],
      type: OperationType.INPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '-90000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          identifier: '2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:1'
        },
        coin_action: 'coin_spent'
      }
    },
    {
      operation_identifier: {
        index: 1,
        network_index: 0
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'ThisIsAnInvalidAddressaddr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '10000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          identifier: '2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:2'
        },
        coin_action: 'coin_created'
      }
    },
    {
      operation_identifier: {
        index: 1,
        network_index: 0
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '40000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          identifier: '2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:3'
        },
        coin_action: 'coin_created'
      }
    }
  ],
  metadata: {
    ttl: '1000'
  }
};

export const CONSTRUCTION_PAYLOADS_REQUEST_INVALID_INPUTS: Components.Schemas.ConstructionPayloadsRequest = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  operations: [
    {
      operation_identifier: {
        index: 0,
        network_index: 0
      },
      related_operations: [
        {
          index: 1
        }
      ],
      type: OperationType.INPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '-90000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          identifier: 'ThiIsAnInvalidTxHash2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:1'
        },
        coin_action: 'coin_created'
      }
    },
    {
      operation_identifier: {
        index: 1,
        network_index: 0
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx',
        metadata: {}
      },
      amount: {
        value: '10000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          identifier: '2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:2'
        },
        coin_action: 'coin_created'
      }
    },
    {
      operation_identifier: {
        index: 2,
        network_index: 0
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '40000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          identifier: '2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:3'
        },
        coin_action: 'coin_created'
      }
    }
  ],
  metadata: {
    ttl: '1000'
  }
};

// Parse operations as the same as the ones sent before but status should be empty
export const constructionParseOperations = (
  constructionPayloadRequest: Components.Schemas.ConstructionPayloadsRequest
): Components.Schemas.Operation[] =>
  constructionPayloadRequest.operations.map(operation => ({
    ...operation,
    status: ''
  }));

export const CONSTRUCTION_PAYLOADS_REQUEST_INVALID_TRANSACTION_ID = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  operations: [
    {
      operation_identifier: {
        index: 0,
        network_index: 0
      },
      type: OperationType.INPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx',
        metadata: {}
      },
      amount: {
        value: '-90000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      },
      coin_change: {
        coin_identifier: {
          identifier: '2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f'
        },
        coin_action: 'coin_created'
      }
    },
    {
      operation_identifier: {
        index: 1,
        network_index: 0
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx'
      },
      amount: {
        value: '10000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    },
    {
      operation_identifier: {
        index: 2,
        network_index: 0
      },
      related_operations: [
        {
          index: 0
        }
      ],
      type: OperationType.OUTPUT,
      status: 'success',
      account: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx',
        metadata: {}
      },
      amount: {
        value: '40000',
        currency: {
          symbol: 'ADA',
          decimals: 6
        }
      }
    }
  ],
  metadata: {
    ttl: '1000'
  }
};

export const SIGNED_TRANSACTION =
  '83a400818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c4002199c40031903e8a100818258201b400d60aaf34eaf6dcbab9bba46001a23497886cf11066f7846933d30e5ad3f58406c92508135cb060187a2706ade8154782867b1526e9615d06742be5c56f037ab85894c098c2ab07971133c0477baee92adf3527ad7cc816f13e1e4c361041206f6';

// Preprocess transaction size considers 0 as ttl while the signed transaction is
// using 1000, therefore we need to subtract 2 bytes (that will be added in metadata endpoint)
export const TRANSACTION_SIZE_IN_BYTES = SIGNED_TRANSACTION.length / 2 - 2;

// The following transactions were generated using using the `cardano-serialization-lib` with dummy signatures
// (so no need to subtract 2). The idea of this test vectors is not to test the serialization bit but to check
// the way the operations are parsed corresponds to the calls and the operation parsing

export const SIGNED_TX_WITH_BYRON_OUTPUT =
  '83a400818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282584c82d818584283581ce47a7265697d6cbcc51c88174e61835eb40918293530e14ad13de4c3a101581e581c5460fd958759663bc65a4120f80ab460c6fb6ee2e70d9fef4b3fe63e001a8a02ff8819271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c4002199c400300a100818258200000000000000000000000000000000000000000000000000000000000000000584000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f6';

export const SIGNED_TX_WITH_BYRON_INPUT =
  '83a400818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282582b82d818582183581cba970ad36654d8dd8f74274b733452ddeab9a62a397746be3c42ccdda0001a9026da5b19271082582b82d818582183581cba970ad36654d8dd8f74274b733452ddeab9a62a397746be3c42ccdda0001a9026da5b199c4002199c400300a102818458200000000000000000000000000000000000000000000000000000000000000000584000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000582200000000000000000000000000000000000000000000000000000000000000000000582d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f6';

export const SIGNED_TX_WITH_MA =
  '83a400818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb82192710a1581cb0d07d45fe9514f80213f4020e5a61241458be626841cde717cb38a7a1476e7574636f696e19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c4002199c400300a100818258200000000000000000000000000000000000000000000000000000000000000000584000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f6';

export const SIGNED_TX_WITH_MA_WITHOUT_NAME =
  '83a400818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb82192710a1581cb0d07d45fe9514f80213f4020e5a61241458be626841cde717cb38a7a14019271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c4002199c400300a100818258200000000000000000000000000000000000000000000000000000000000000000584000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f6';

export const SIGNED_TX_WITH_MULTIPLE_MA =
  '83a400818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb82192710a1581cb0d07d45fe9514f80213f4020e5a61241458be626841cde717cb38a7a249477569646f436f696e190906476e7574636f696e19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c4002199c400300a100818258200000000000000000000000000000000000000000000000000000000000000000584000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f6';

export const SIGNED_TEX_WITH_SEVERAL_MA =
  '83a400818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb82192710a1581cb0d07d45fe9514f80213f4020e5a61241458be626841cde717cb38a7a349477569646f436f696e190906504a75616e4372757a546f6b656e617a6f191a0a476e7574636f696e19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c4002199c400300a100818258200000000000000000000000000000000000000000000000000000000000000000584000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f6';
export const SIGNED_TX_WITH_POOL_RETIREMENT =
  '83a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f010180021a00015f90030004818304581c153806dbcd134ddee69a8c5204e38ac80448f62342f8c23cfe4b7edf18c8a1008282582000000000000000000000000000000000000000000000000000000000000000005840000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008258200000000000000000000000000000000000000000000000000000000000000000584000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f6';

export const SIGNED_TX_WITH_STAKE_KEY_REGISTRATION =
  '83a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c40021a006a0c700300048182008200581cbb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fba100818258200000000000000000000000000000000000000000000000000000000000000000584000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f6';

export const SIGNED_TX_WITH_STAKE_KEY_DEREGISTRATION =
  '83a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c40021a001f20c00300048182018200581cbb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fba1008282582000000000000000000000000000000000000000000000000000000000000000005840000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008258200000000000000000000000000000000000000000000000000000000000000000584000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f6';

export const SIGNED_TX_WITH_STAKE_DELEGATION =
  '83a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c4002199c400300048183028200581cbb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb581c1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5a1008282582000000000000000000000000000000000000000000000000000000000000000005840000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008258200000000000000000000000000000000000000000000000000000000000000000584000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f6';

export const SIGNED_TX_WITH_STAKE_KEY_REGISTRATION_AND_STAKE_DELEGATION =
  '83a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c40021a006a0c700300048282008200581cbb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb83028200581cbb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb581c1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5a1008282582000000000000000000000000000000000000000000000000000000000000000005840000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008258200000000000000000000000000000000000000000000000000000000000000000584000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f6';

export const SIGNED_TX_WITH_WITHDRAWAL =
  '83a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c400219c350030005a1581de1bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb192710a1008282582000000000000000000000000000000000000000000000000000000000000000005840000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008258200000000000000000000000000000000000000000000000000000000000000000584000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f6';

export const SIGNED_TX_WITH_TWO_WITHDRAWALS =
  '83a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c400219ea60030005a2581de1bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb192710581de16f2a3f072ef6a8ebbd9ef73dd83057656157cf6effe46be940ffe0f5192710a10083825820000000000000000000000000000000000000000000000000000000000000000058400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000082582000000000000000000000000000000000000000000000000000000000000000005840000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008258200000000000000000000000000000000000000000000000000000000000000000584000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f6';

export const SIGNED_TX_WITH_STAKE_KEY_REGISTRATION_AND_WITHDRWAWAL =
  '83a600818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c40021a006a33800300048182008200581cbb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb05a1581de1bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb192710a1008282582000000000000000000000000000000000000000000000000000000000000000005840000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008258200000000000000000000000000000000000000000000000000000000000000000584000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f6';

export const SIGNED_TX_WITH_POOL_REGISTRATION_AND_PLEDGE =
  '83a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c40021b00000014d69cdbb0030004828a03581c1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b558208dd154228946bd12967c12bedb1cb6038b78f8b84a1760b1a788fa72a4af3db01a004c4b401a002dc6c0d81e820101581de1bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb81581cbe478158984c390c1b2b033195aeb0df22d688e7ef74422d3463fafa8184001820447f00000150234504252ca1000000000567567323b5826f706f6f6c4d6574616461746155726c58209ac2217288d1ae0b4e15c41b58d3e05a13206fd9ab81cb15943e4174bf30c90b83028200581cbb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb581c1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5a100848258200000000000000000000000000000000000000000000000000000000000000000584000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000825820000000000000000000000000000000000000000000000000000000000000000058400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000082582000000000000000000000000000000000000000000000000000000000000000005840000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008258200000000000000000000000000000000000000000000000000000000000000000584000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f6';

export const SIGNED_TX_WITH_POOL_REGISTRATION_WITH_MULTIPLE_RELAYS =
  '83a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c40021b00000014d69cdbb0030004828a03581c1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b558208dd154228946bd12967c12bedb1cb6038b78f8b84a1760b1a788fa72a4af3db01a004c4b401a002dc6c0d81e820101581de1bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb81581cbe478158984c390c1b2b033195aeb0df22d688e7ef74422d3463fafa8384001820447f00000150234504252ca1000000000567567323b58301182067646e734e616d65820267646e734e616d65826f706f6f6c4d6574616461746155726c58209ac2217288d1ae0b4e15c41b58d3e05a13206fd9ab81cb15943e4174bf30c90b83028200581cbb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb581c1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5a100848258200000000000000000000000000000000000000000000000000000000000000000584000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000825820000000000000000000000000000000000000000000000000000000000000000058400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000082582000000000000000000000000000000000000000000000000000000000000000005840000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008258200000000000000000000000000000000000000000000000000000000000000000584000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f6';

export const SIGNED_TX_WITH_POOL_REGISTRATION_WITH_SINGLE_HOST_ADDR =
  '83a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c40021b00000014d69cdbb0030004818a03581c1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b558208dd154228946bd12967c12bedb1cb6038b78f8b84a1760b1a788fa72a4af3db0001a002dc6c0d81e820101581de1bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb81581cbe478158984c390c1b2b033195aeb0df22d688e7ef74422d3463fafa8184001820447f00000150234504252ca1000000000567567323b5826f706f6f6c4d6574616461746155726c58209ac2217288d1ae0b4e15c41b58d3e05a13206fd9ab81cb15943e4174bf30c90ba100848258200000000000000000000000000000000000000000000000000000000000000000584000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000825820000000000000000000000000000000000000000000000000000000000000000058400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000082582000000000000000000000000000000000000000000000000000000000000000005840000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008258200000000000000000000000000000000000000000000000000000000000000000584000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f6';

export const SIGNED_TX_WITH_POOL_REGISTRATION_WITH_SINGLE_HOST_NAME =
  '83a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c40021b00000014d69cdbb0030004818a03581c1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b558208dd154228946bd12967c12bedb1cb6038b78f8b84a1760b1a788fa72a4af3db0001a002dc6c0d81e820101581de1bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb81581cbe478158984c390c1b2b033195aeb0df22d688e7ef74422d3463fafa8184001820f6f6826f706f6f6c4d6574616461746155726c58209ac2217288d1ae0b4e15c41b58d3e05a13206fd9ab81cb15943e4174bf30c90ba100848258200000000000000000000000000000000000000000000000000000000000000000584000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000825820000000000000000000000000000000000000000000000000000000000000000058400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000082582000000000000000000000000000000000000000000000000000000000000000005840000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008258200000000000000000000000000000000000000000000000000000000000000000584000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f6';

export const SIGNED_TX_WITH_POOL_REGISTRATION_WITH_MULTI_HOST_NAME =
  '83a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c40021b00000014d69cdbb0030004818a03581c1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b558208dd154228946bd12967c12bedb1cb6038b78f8b84a1760b1a788fa72a4af3db0001a002dc6c0d81e820101581de1bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb81581cbe478158984c390c1b2b033195aeb0df22d688e7ef74422d3463fafa81820267646e734e616d65826f706f6f6c4d6574616461746155726c58209ac2217288d1ae0b4e15c41b58d3e05a13206fd9ab81cb15943e4174bf30c90ba100848258200000000000000000000000000000000000000000000000000000000000000000584000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000825820000000000000000000000000000000000000000000000000000000000000000058400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000082582000000000000000000000000000000000000000000000000000000000000000005840000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008258200000000000000000000000000000000000000000000000000000000000000000584000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f6';

export const SIGNED_TX_WITH_POOL_REGISTRATION_WITH_NO_METADATA =
  '83a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c40021b00000014d69cdbb0030004818a03581c1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b558208dd154228946bd12967c12bedb1cb6038b78f8b84a1760b1a788fa72a4af3db0001a002dc6c0d81e820101581de1bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb81581cbe478158984c390c1b2b033195aeb0df22d688e7ef74422d3463fafa8184001820447f00000150234504252ca1000000000567567323b5f6a100848258200000000000000000000000000000000000000000000000000000000000000000584000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000825820000000000000000000000000000000000000000000000000000000000000000058400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000082582000000000000000000000000000000000000000000000000000000000000000005840000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008258200000000000000000000000000000000000000000000000000000000000000000584000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f6';

export const SIGNED_TX_WITH_POOL_REGISTRATION_WITH_CERT =
  '83a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c40021b00000014d69cdbb0030004828a03581c1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b558208dd154228946bd12967c12bedb1cb6038b78f8b84a1760b1a788fa72a4af3db01a004c4b401a002dc6c0d81e820101581de1bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb81581c7a9a4d5a6ac7a9d8702818fa3ea533e56c4f1de16da611a730ee3f008184001820445820f5d9505820f5d9ea167fd2e0b19647f18dd1e0826f706f6f6c4d6574616461746155726c58209ac2217288d1ae0b4e15c41b58d3e05a13206fd9ab81cb15943e4174bf30c90b83028200581cbb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb581c1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5a100848258200000000000000000000000000000000000000000000000000000000000000000584000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000825820000000000000000000000000000000000000000000000000000000000000000058400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000082582000000000000000000000000000000000000000000000000000000000000000005840000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008258200000000000000000000000000000000000000000000000000000000000000000584000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f6';

export const CONSTRUCTION_SIGNED_TRANSACTION_WITH_MA = cbor
  .encode([SIGNED_TX_WITH_MA, constructionExtraData(CONSTRUCTION_PAYLOADS_REQUEST_WITH_MA)])
  .toString('hex');

export const CONSTRUCTION_SIGNED_TRANSACTION_WITH_MULTIPLE_MA = cbor
  .encode([SIGNED_TX_WITH_MULTIPLE_MA, constructionExtraData(CONSTRUCTION_PAYLOADS_REQUEST_WITH_MULTIPLE_MA)])
  .toString('hex');

export const CONSTRUCTION_SIGNED_TX_WITH_MA_WITHOUT_NAME = cbor
  .encode([SIGNED_TX_WITH_MA_WITHOUT_NAME, constructionExtraData(CONSTRUCTION_PAYLOADS_REQUEST_WITM_MA_WITHOUT_NAME)])
  .toString('hex');

export const CONSTRUCTION_SIGNED_TRANSACTION_WITH_SEVERAL_MA = cbor
  .encode([SIGNED_TEX_WITH_SEVERAL_MA, constructionExtraData(CONSTRUCTION_PAYLOADS_REQUEST_WITH_SEVERAL_MA)])
  .toString('hex');

export const CONSTRUCTION_SIGNED_TRANSACTION_WITH_EXTRA_DATA = cbor
  .encode([SIGNED_TRANSACTION, constructionExtraData(CONSTRUCTION_PAYLOADS_REQUEST)])
  .toString('hex');

export const CONSTRUCTION_SIGNED_TX_WITH_POOL_REGISTRATION_AND_PLEDGE = cbor
  .encode([
    SIGNED_TX_WITH_POOL_REGISTRATION_AND_PLEDGE,
    constructionExtraData(CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_AND_PLEDGE)
  ])
  .toString('hex');

export const CONSTRUCTION_SIGNED_TX_WITH_POOL_REGISTRATION_WITH_MULTIPLE_RELAYS = cbor
  .encode([
    SIGNED_TX_WITH_POOL_REGISTRATION_WITH_MULTIPLE_RELAYS,
    constructionExtraData(CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_MULTIPLE_RELAY)
  ])
  .toString('hex');

export const CONSTRUCTION_SIGNED_TX_WITH_POOL_REGISTRATION_WITH_NO_METADATA = cbor
  .encode([
    SIGNED_TX_WITH_POOL_REGISTRATION_WITH_NO_METADATA,
    constructionExtraData(CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_NO_METADATA)
  ])
  .toString('hex');

export const CONSTRUCTION_SIGNED_TX_WITH_POOL_REGISTRATION_WITH_CERT = cbor
  .encode([
    SIGNED_TX_WITH_POOL_REGISTRATION_WITH_CERT,
    constructionExtraData(CONSTRUCTION_PAYLOADS_WITH_POOL_REGISTRATION_WITH_CERT)
  ])
  .toString('hex');

export const CONSTRUCTION_SIGNED_TX_INPUT_WITH_BYRON_ADDRESS_AND_EXTRA_DATA = cbor
  .encode([SIGNED_TX_WITH_BYRON_INPUT, constructionExtraData(CONSTRUCTION_PAYLOADS_REQUEST_WITH_BYRON_INPUT)])
  .toString('hex');

export const CONSTRUCTION_SIGNED_TX_WITH_BYRON_ADDRESS_AND_EXTRA_DATA = cbor
  .encode([SIGNED_TX_WITH_BYRON_OUTPUT, constructionExtraData(CONSTRUCTION_PAYLOADS_REQUEST_WITH_BYRON_OUTPUT)])
  .toString('hex');

export const CONSTRUCTION_SIGNED_TX_WITH_REGISTRATION_AND_EXTRA_DATA = cbor
  .encode([
    SIGNED_TX_WITH_STAKE_KEY_REGISTRATION,
    constructionExtraData(CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_REGISTRATION)
  ])
  .toString('hex');

export const CONSTRUCTION_SIGNED_TX_WITH_REGISTRATION_AND_WITHDRWAWAL_AND_EXTRA_DATA = cbor
  .encode([
    SIGNED_TX_WITH_STAKE_KEY_REGISTRATION_AND_WITHDRWAWAL,
    constructionExtraData(CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_REGISTRATION_AND_WITHDRAWAL)
  ])
  .toString('hex');

export const CONSTRUCTION_UNSIGNED_TRANSACTION_WITH_EXTRA_DATA = cbor
  .encode([
    'a400818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c4002199c40031903e8',
    constructionExtraData(CONSTRUCTION_PAYLOADS_REQUEST)
  ])
  .toString('hex');

export const CONSTRUCTION_INVALID_TRANSACTION = cbor
  .encode(['invalid_tx', constructionExtraData(CONSTRUCTION_PAYLOADS_REQUEST)])
  .toString('hex');

export const CONSTRUCTION_COMBINE_PAYLOAD = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  unsigned_transaction: CONSTRUCTION_UNSIGNED_TRANSACTION_WITH_EXTRA_DATA,
  signatures: [
    {
      signing_payload: {
        address: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx',
        hex_bytes: '31fc9813a71d8db12a4f2e3382ab0671005665b70d0cd1a9fb6c4a4e9ceabc90',
        signature_type: SIGNATURE_TYPE
      },
      public_key: {
        hex_bytes: '1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F',
        curve_type: 'edwards25519'
      },
      signature_type: SIGNATURE_TYPE,
      hex_bytes:
        '6C92508135CB060187A2706ADE8154782867B1526E9615D06742BE5C56F037AB85894C098C2AB07971133C0477BAEE92ADF3527AD7CC816F13E1E4C361041206'
    }
  ]
};

export const address1vpfAccountBalances = [
  {
    value: '639308468',
    currency: {
      decimals: 6,
      symbol: 'ADA'
    }
  },
  {
    value: '10',
    currency: {
      decimals: 0,
      symbol: '424e42',
      metadata: {
        policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518'
      }
    }
  },
  {
    value: '2',
    currency: {
      decimals: 0,
      symbol: '425443',
      metadata: {
        policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518'
      }
    }
  },
  {
    value: '321',
    currency: {
      decimals: 0,
      symbol: '444f54',
      metadata: {
        policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518'
      }
    }
  },
  {
    value: '17',
    currency: {
      decimals: 0,
      symbol: '455448',
      metadata: {
        policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518'
      }
    }
  },
  {
    value: '42',
    currency: {
      decimals: 0,
      symbol: '4c494e4b',
      metadata: {
        policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518'
      }
    }
  },
  {
    value: '5',
    currency: {
      decimals: 0,
      symbol: '4c5443',
      metadata: {
        policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518'
      }
    }
  },
  {
    value: '38',
    currency: {
      decimals: 0,
      symbol: '585250',
      metadata: {
        policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518'
      }
    }
  },
  {
    value: '25',
    currency: {
      decimals: 0,
      symbol: '4154414441636f696e',
      metadata: {
        policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518'
      }
    }
  },
  {
    value: '1',
    currency: {
      decimals: 0,
      symbol: '6e7574636f696e',
      metadata: {
        policyId: 'b0d07d45fe9514f80213f4020e5a61241458be626841cde717cb38a7'
      }
    }
  },
  {
    value: '1',
    currency: {
      decimals: 0,
      symbol: '5045414345746f6b656e',
      metadata: {
        policyId: 'dabee8ee0f3f0906ba0542b06924c3e9c477a013cfe7d326a8ea9beb'
      }
    }
  },
  {
    value: '10',
    currency: {
      decimals: 0,
      symbol: '6d616368746c32636f696e',
      metadata: {
        policyId: 'ecd07b4ef62f37a68d145de8efd60c53d288dd5ffc641215120cc3db'
      }
    }
  },
  {
    value: '700',
    currency: {
      decimals: 0,
      symbol: '61646f736961',
      metadata: {
        policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518'
      }
    }
  }
];

const coinId6c18 = { identifier: '6c181e6875eb4e24e9b05b26e2361790a4e5d65cd4d63d68cce40eb9098ce847:0' };
export const address1vpfCoins = [
  {
    coin_identifier: coinId6c18,
    amount: {
      value: '100558468',
      currency: {
        decimals: 6,
        symbol: 'ADA'
      }
    },
    metadata: {
      '6c181e6875eb4e24e9b05b26e2361790a4e5d65cd4d63d68cce40eb9098ce847:0': [
        {
          policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518',
          tokens: [
            {
              value: '10',
              currency: {
                decimals: 0,
                symbol: '424e42',
                metadata: {
                  policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518'
                }
              }
            },
            {
              value: '2',
              currency: {
                decimals: 0,
                symbol: '425443',
                metadata: {
                  policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518'
                }
              }
            },
            {
              value: '321',
              currency: {
                decimals: 0,
                symbol: '444f54',
                metadata: {
                  policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518'
                }
              }
            },
            {
              value: '17',
              currency: {
                decimals: 0,
                symbol: '455448',
                metadata: {
                  policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518'
                }
              }
            },
            {
              value: '42',
              currency: {
                decimals: 0,
                symbol: '4c494e4b',
                metadata: {
                  policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518'
                }
              }
            },
            {
              value: '5',
              currency: {
                decimals: 0,
                symbol: '4c5443',
                metadata: {
                  policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518'
                }
              }
            },
            {
              value: '38',
              currency: {
                decimals: 0,
                symbol: '585250',
                metadata: {
                  policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518'
                }
              }
            }
          ]
        }
      ]
    }
  },
  {
    coin_identifier: { identifier: 'f68b466c8873b756098d94f46da3f2748cdf971bee068e04c253f660625da33b:0' },
    amount: {
      value: '2000000',
      currency: {
        decimals: 6,
        symbol: 'ADA'
      }
    },
    metadata: {
      'f68b466c8873b756098d94f46da3f2748cdf971bee068e04c253f660625da33b:0': [
        {
          policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518',
          tokens: [
            {
              value: '13',
              currency: {
                decimals: 0,
                symbol: '4154414441636f696e',
                metadata: {
                  policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518'
                }
              }
            }
          ]
        }
      ]
    }
  },
  {
    coin_identifier: { identifier: '95758b3c75e46d998c0159f62b92864b94a0e71ff29d958e7a1a41351ad18bc7:0' },
    amount: {
      value: '3500000',
      currency: {
        decimals: 6,
        symbol: 'ADA'
      }
    },
    metadata: {
      '95758b3c75e46d998c0159f62b92864b94a0e71ff29d958e7a1a41351ad18bc7:0': [
        {
          policyId: 'b0d07d45fe9514f80213f4020e5a61241458be626841cde717cb38a7',
          tokens: [
            {
              value: '1',
              currency: {
                decimals: 0,
                symbol: '6e7574636f696e',
                metadata: {
                  policyId: 'b0d07d45fe9514f80213f4020e5a61241458be626841cde717cb38a7'
                }
              }
            }
          ]
        }
      ]
    }
  },
  {
    coin_identifier: { identifier: '2265ee9cccf30aa90df90402da5f18d7da46f7aa3022aea14be1a11cc073424f:0' },
    amount: {
      value: '7250000',
      currency: {
        decimals: 6,
        symbol: 'ADA'
      }
    },
    metadata: {
      '2265ee9cccf30aa90df90402da5f18d7da46f7aa3022aea14be1a11cc073424f:0': [
        {
          policyId: 'dabee8ee0f3f0906ba0542b06924c3e9c477a013cfe7d326a8ea9beb',
          tokens: [
            {
              value: '1',
              currency: {
                decimals: 0,
                symbol: '5045414345746f6b656e',
                metadata: {
                  policyId: 'dabee8ee0f3f0906ba0542b06924c3e9c477a013cfe7d326a8ea9beb'
                }
              }
            }
          ]
        }
      ]
    }
  },
  {
    coin_identifier: { identifier: '751f974a93b68b2a1a8aa7c3614e8147ef013e1bae34a3785c17964f4a020977:0' },
    amount: {
      value: '2000000',
      currency: {
        decimals: 6,
        symbol: 'ADA'
      }
    },
    metadata: {
      '751f974a93b68b2a1a8aa7c3614e8147ef013e1bae34a3785c17964f4a020977:0': [
        {
          policyId: 'ecd07b4ef62f37a68d145de8efd60c53d288dd5ffc641215120cc3db',
          tokens: [
            {
              value: '10',
              currency: {
                decimals: 0,
                symbol: '6d616368746c32636f696e',
                metadata: {
                  policyId: 'ecd07b4ef62f37a68d145de8efd60c53d288dd5ffc641215120cc3db'
                }
              }
            }
          ]
        }
      ]
    }
  },
  {
    coin_identifier: { identifier: 'd0fed5077f62f47b221505ce841b39076629fd605d07473e15103a352bd99c5b:0' },
    amount: {
      value: '2000000',
      currency: {
        decimals: 6,
        symbol: 'ADA'
      }
    },
    metadata: {
      'd0fed5077f62f47b221505ce841b39076629fd605d07473e15103a352bd99c5b:0': [
        {
          policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518',
          tokens: [
            {
              value: '700',
              currency: {
                decimals: 0,
                symbol: '61646f736961',
                metadata: {
                  policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518'
                }
              }
            }
          ]
        }
      ]
    }
  },
  {
    coin_identifier: { identifier: '2fa8260315c4a15a396f96cac777c64b717c36d1da0c15a4a12ed4106ee48760:0' },
    amount: {
      value: '2000000',
      currency: {
        decimals: 6,
        symbol: 'ADA'
      }
    },
    metadata: {
      '2fa8260315c4a15a396f96cac777c64b717c36d1da0c15a4a12ed4106ee48760:0': [
        {
          policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518',
          tokens: [
            {
              value: '12',
              currency: {
                decimals: 0,
                symbol: '4154414441636f696e',
                metadata: {
                  policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518'
                }
              }
            }
          ]
        }
      ]
    }
  },
  {
    coin_identifier: { identifier: '715679011c18981599fba6e11c532072f2910db1e2f190d001ce3cc2804feed7:0' },
    amount: {
      value: '10000000',
      currency: {
        decimals: 6,
        symbol: 'ADA'
      }
    }
  },
  {
    coin_identifier: { identifier: '0f7dbb3d72d0487fd003887c7bc6960164c1b461fcda4c503fab80cc5b1fab0c:1' },
    amount: {
      value: '500000000',
      currency: {
        decimals: 6,
        symbol: 'ADA'
      }
    }
  },
  {
    coin_identifier: { identifier: 'f2fb83c5ad47a80f932c046f8ad624d90a3d83686c36c3cbdb888ea6c38cc9eb:0' },
    amount: {
      value: '10000000',
      currency: {
        decimals: 6,
        symbol: 'ADA'
      }
    }
  }
];

export const balancesAtBlock213891 = [
  {
    value: '299994729944',
    currency: {
      decimals: 6,
      symbol: 'ADA'
    }
  },
  {
    value: '10',
    currency: {
      decimals: 0,
      symbol: '74657374746f6b656e',
      metadata: {
        policyId: '06e5f0ade7121aaefa0e7ec53cac61820d774de0c12c83e8597627ff'
      }
    }
  },
  {
    value: '95',
    currency: {
      decimals: 0,
      symbol: '4154414441636f696e',
      metadata: {
        policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518'
      }
    }
  },
  {
    value: '2500',
    currency: {
      decimals: 0,
      symbol: '6d616368746c636f696e',
      metadata: {
        policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518'
      }
    }
  },
  {
    value: '500',
    currency: {
      decimals: 0,
      symbol: '6d616368746c32636f696e',
      metadata: {
        policyId: 'ecd07b4ef62f37a68d145de8efd60c53d288dd5ffc641215120cc3db'
      }
    }
  }
];

export const balancesAtBlock213892 = [
  {
    value: '299994547239',
    currency: {
      decimals: 6,
      symbol: 'ADA'
    }
  },
  {
    value: '95',
    currency: {
      decimals: 0,
      symbol: '4154414441636f696e',
      metadata: {
        policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518'
      }
    }
  },
  {
    value: '2500',
    currency: {
      decimals: 0,
      symbol: '6d616368746c636f696e',
      metadata: {
        policyId: '34250edd1e9836f5378702fbf9416b709bc140e04f668cc355208518'
      }
    }
  },
  {
    value: '500',
    currency: {
      decimals: 0,
      symbol: '6d616368746c32636f696e',
      metadata: {
        policyId: 'ecd07b4ef62f37a68d145de8efd60c53d288dd5ffc641215120cc3db'
      }
    }
  }
];

export const coinIdentifier95e1 = { identifier: '95e1117558c2d075a4cd110ab0772460340f72a19ac5bc4691c6498e28055339:0' };
