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

export const latestBlockHash = '16d14ca745d5956021e20656175bd8b548798ea04a27d9bf5e9f2090ea200434';
export const latestBlockSlot = 24073498;
export const latestBlockIdentifier = {
  hash: latestBlockHash,
  index: 5455974
};
// TODO: delete this
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
        operation_identifier: { index: 0 },
        type: 'input',
        status: 'success',
        account: {
          address:
            'addr1qydzwlumluss5x9fr5ffev495dyezulyue06htq6g7map8qqq465468exxjhrvtnwp3ufyzvkd9kc3xmmjw7vuwtkugs5x824s'
        },
        amount: { value: '-5846309394', currency: { symbol: 'ADA', decimals: 6 } },
        coin_change: {
          coin_identifier: { identifier: '0b40752c2fc8a41da8411cee5376ac96fa4351e4c3d72750f9548582273244e7:0' },
          coin_action: 'coin_spent'
        }
      },
      {
        operation_identifier: { index: 1 },
        type: 'withdrawal',
        status: 'success',
        account: { address: 'stake1uyqq2a22arunrft3k9ehqc7yjpxtxjmvgndae80xw89mwyge9skyp' },
        metadata: { withdrawalAmount: { value: '-112588803', currency: { symbol: 'ADA', decimals: 6 } } }
      },
      {
        operation_identifier: { index: 2, network_index: 1 },
        related_operations: [{ index: 0 }, { index: 1 }],
        type: 'output',
        status: 'success',
        account: {
          address:
            'DdzFFzCqrhsm61hrcAFrwush9Amq6PU8UkFjqPefDTKb4u6TkBa5c7MHWbsbmcDCMV2xSc6jGaUWAu9kqaSLS4CX7nkrakUDdCrdkLoe'
        },
        amount: { value: '800000000', currency: { symbol: 'ADA', decimals: 6 } },
        coin_change: {
          coin_identifier: { identifier: '2974845ecc7e02e86285d32961c69f3945662a80d5e2caae8a1086e652936f42:1' },
          coin_action: 'coin_created'
        }
      },
      {
        operation_identifier: { index: 3, network_index: 0 },
        related_operations: [{ index: 0 }, { index: 1 }],
        type: 'output',
        status: 'success',
        account: {
          address:
            'addr1qywj6nl4g04yn9a7gdwqgyzcgwmjekkw603t8pcsrlaxg3sqq465468exxjhrvtnwp3ufyzvkd9kc3xmmjw7vuwtkugs05evjg'
        },
        amount: { value: '5158722796', currency: { symbol: 'ADA', decimals: 6 } },
        coin_change: {
          coin_identifier: { identifier: '2974845ecc7e02e86285d32961c69f3945662a80d5e2caae8a1086e652936f42:0' },
          coin_action: 'coin_created'
        }
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
      hash: '896cf8fefad1eaf0fa056ba3adf28bfb26b06d1beed64cf790deb595dcb2687a'
    },
    operations: [
      {
        operation_identifier: { index: 0 },
        type: 'input',
        status: 'success',
        account: {
          address:
            'addr1q94g4wsgtm6hsxlcafvvt6fyprqtlwnme372sndfphlulyxn8j47n0r6werzg0qr7p3gs8gxw39n65uc8q330ztnhxcq9x6600'
        },
        amount: { value: '-51047025535', currency: { symbol: 'ADA', decimals: 6 } },
        coin_change: {
          coin_identifier: { identifier: 'e1d1d61ecd706790ee31a1c07fc87827f7b9738d374ef705d1c8cff8295c8cf0:0' },
          coin_action: 'coin_spent'
        }
      },
      {
        operation_identifier: { index: 1 },
        type: 'poolRetirement',
        status: 'success',
        account: { address: '469fbad36a8a68c5f62f3505ecbe6a461ea262ae20b4de8d39ff08ab' },
        metadata: { epoch: 209 }
      },
      {
        operation_identifier: { index: 2, network_index: 0 },
        related_operations: [{ index: 0 }],
        type: 'output',
        status: 'success',
        account: {
          address:
            'addr1q94g4wsgtm6hsxlcafvvt6fyprqtlwnme372sndfphlulyxn8j47n0r6werzg0qr7p3gs8gxw39n65uc8q330ztnhxcq9x6600'
        },
        amount: { value: '51046846482', currency: { symbol: 'ADA', decimals: 6 } },
        coin_change: {
          coin_identifier: { identifier: '896cf8fefad1eaf0fa056ba3adf28bfb26b06d1beed64cf790deb595dcb2687a:0' },
          coin_action: 'coin_created'
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

export const transactionWithPoolRegistration = {
  transaction: {
    operations: [
      {
        operation_identifier: { index: 0 },
        type: 'input',
        status: 'success',
        account: {
          address:
            'addr1q9wm6dpp9zgund873xluc5wzz3z8dqf04uxvnnafa9tc834sp4f25adz7r8sgwkq3g473htcsramrcwh25twnew0hf2sfma70k'
        },
        amount: { value: '-52425749', currency: { symbol: 'ADA', decimals: 6 } },
        coin_change: {
          coin_identifier: { identifier: 'cda78e5074d4e7d9de0cfb5c4b503b02426d545d7d639e8b287f5be3a58e15cb:0' },
          coin_action: 'coin_spent'
        }
      },
      {
        operation_identifier: { index: 1 },
        type: 'stakeDelegation',
        status: 'success',
        account: { address: 'stake1uxcq6542wk30pncy8tqg52lgm4ugp7a3u8t429hfuh8m54gs72zj8' },
        metadata: { pool_key_hash: '15a500a4ae7a375347deaf879a65d54a481de9073005734b3c85fdf3' }
      },
      {
        operation_identifier: { index: 2 },
        type: 'poolRegistration',
        status: 'success',
        account: { address: '15a500a4ae7a375347deaf879a65d54a481de9073005734b3c85fdf3' },
        metadata: {
          depositAmount: { value: '500000000', currency: { symbol: 'ADA', decimals: 6 } },
          poolRegistrationParams: {
            vrfKeyHash: '38ee540c8ed10762b6a43ed4a3c3094c1ac76b3ad838c341e3cb92174db4b4d6',
            rewardAddress: 'e1b00d52aa75a2f0cf043ac08a2be8dd7880fbb1e1d75516e9e5cfba55',
            pledge: '50000000',
            cost: '340000000',
            poolOwners: ['stake1uxcq6542wk30pncy8tqg52lgm4ugp7a3u8t429hfuh8m54gs72zj8'],
            relays: [],
            margin_percentage: '0.005'
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
            'addr1q9wm6dpp9zgund873xluc5wzz3z8dqf04uxvnnafa9tc834sp4f25adz7r8sgwkq3g473htcsramrcwh25twnew0hf2sfma70k'
        },
        amount: { value: '52229492', currency: { symbol: 'ADA', decimals: 6 } },
        coin_change: {
          coin_identifier: { identifier: '29a76dd58c6309cd9cde855c0c50d81d63f921959359b1e544401ac1dbc9b472:0' },
          coin_action: 'coin_created'
        }
      }
    ],
    transaction_identifier: {
      hash: '29a76dd58c6309cd9cde855c0c50d81d63f921959359b1e544401ac1dbc9b472'
    }
  }
};

export const transactionWithPoolRegistrationWithMultipleOwners = {
  transaction: {
    operations: [
      {
        operation_identifier: { index: 0 },
        type: 'input',
        status: 'success',
        account: {
          address:
            'addr1q9xw8g2sqyam5szh4ju0389htsaaxkqg7cr7rsqzt3s7msy9vfk4g42ahjwqezem9ff97q8kqmxgcc0zc8kkcc3p6uuqu8gsl5'
        },
        amount: { value: '-597821255', currency: { symbol: 'ADA', decimals: 6 } },
        coin_change: {
          coin_identifier: { identifier: '3e2de59aa5faa736f815a221221517f367d6aac6871ceae7b95c5208668bbaae:0' },
          coin_action: 'coin_spent'
        }
      },
      {
        operation_identifier: { index: 1 },
        type: 'stakeDelegation',
        status: 'success',
        account: { address: 'stake1u8gu2vzsk2nc6hsphudhl3p6aum7nd59ajqjg9zp00uvxcqwsdray' },
        metadata: { pool_key_hash: '8a1ab06f3a8c823b7111955c287efbe3c96ad9a68aa2359832e0bc30' }
      },
      {
        operation_identifier: { index: 2 },
        type: 'stakeDelegation',
        status: 'success',
        account: { address: 'stake1uxzkym2524wme8qv3vaj55jlqrmqdnyvv83vrmtvvgsawwq8aw9xu' },
        metadata: { pool_key_hash: '8a1ab06f3a8c823b7111955c287efbe3c96ad9a68aa2359832e0bc30' }
      },
      {
        operation_identifier: { index: 3 },
        type: 'poolRegistration',
        status: 'success',
        account: { address: '8a1ab06f3a8c823b7111955c287efbe3c96ad9a68aa2359832e0bc30' },
        metadata: {
          depositAmount: { value: '500000000', currency: { decimals: 6, symbol: 'ADA' } },
          poolRegistrationParams: {
            vrfKeyHash: 'd9f5cf491f19ca61c13f5706ef82c6537d73d372481077c5aa7276b0889bbcb3',
            rewardAddress: 'e1d1c53050b2a78d5e01bf1b7fc43aef37e9b685ec812414417bf8c360',
            pledge: '500000000',
            cost: '340000000',
            poolOwners: [
              'stake1uxzkym2524wme8qv3vaj55jlqrmqdnyvv83vrmtvvgsawwq8aw9xu',
              'stake1u8gu2vzsk2nc6hsphudhl3p6aum7nd59ajqjg9zp00uvxcqwsdray'
            ],
            relays: [],
            margin_percentage: '0.042'
          }
        }
      },
      {
        operation_identifier: { index: 4, network_index: 0 },
        related_operations: [{ index: 0 }],
        type: 'output',
        status: 'success',
        account: {
          address:
            'addr1q9xw8g2sqyam5szh4ju0389htsaaxkqg7cr7rsqzt3s7msy9vfk4g42ahjwqezem9ff97q8kqmxgcc0zc8kkcc3p6uuqu8gsl5'
        },
        amount: { value: '97610698', currency: { symbol: 'ADA', decimals: 6 } },
        coin_change: {
          coin_identifier: { identifier: '51d67e194d749df2abf4e2e11cea63ca6e1c630042a366f555939e795a6ddecf:0' },
          coin_action: 'coin_created'
        }
      }
    ],
    transaction_identifier: {
      hash: '51d67e194d749df2abf4e2e11cea63ca6e1c630042a366f555939e795a6ddecf'
    }
  }
};

export const transaction5407534WithTokenBundle = {
  operations: [
    {
      operation_identifier: { index: 0 },
      type: 'input',
      status: 'success',
      account: {
        address:
          'addr1qxgrfy08dr5qshqgzsdt96gyw5j8gsjuydpvyw8s7g0u5g755nhcwdyze6drflgx4kwpuk5xh62w4d009tdnvp0mjx2slsz4d2'
      },
      amount: { value: '-12906630', currency: { decimals: 6, symbol: 'ADA' } },
      coin_change: {
        coin_identifier: { identifier: 'b0004fd9231923d645357516f3e7c3709d1bdf0f6a8cf4fbdc85798cef3e7235:1' },
        coin_action: 'coin_spent'
      },
      metadata: {
        tokenBundle: [
          {
            policyId: '93ba69a0c19c3364156279f9e0bde261eec7d0184a2bbd0cc669e695',
            tokens: [
              {
                value: '-999000',
                currency: {
                  symbol: '686f736b696e736f6e',
                  decimals: 0
                }
              }
            ]
          },
          {
            policyId: 'ba53bc5049cc226f7c8582faec8047bb70982d30539d11697957fb91',
            tokens: [
              {
                value: '-999000000',
                currency: {
                  symbol: '636861726c6573',
                  decimals: 0
                }
              }
            ]
          }
        ]
      }
    },
    {
      operation_identifier: { index: 1, network_index: 0 },
      related_operations: [{ index: 0 }],
      type: 'output',
      status: 'success',
      account: {
        address:
          'addr1qxgrfy08dr5qshqgzsdt96gyw5j8gsjuydpvyw8s7g0u5g755nhcwdyze6drflgx4kwpuk5xh62w4d009tdnvp0mjx2slsz4d2'
      },
      amount: { value: '12722649', currency: { symbol: 'ADA', decimals: 6 } },
      coin_change: {
        coin_identifier: { identifier: '8d67291066037f46f092bfc098241cc7143fa1ec2b14b6c23b945878ccf9fe0f:0' },
        coin_action: 'coin_created'
      },
      metadata: {
        tokenBundle: [
          {
            policyId: '93ba69a0c19c3364156279f9e0bde261eec7d0184a2bbd0cc669e695',
            tokens: [
              {
                value: '999000',
                currency: {
                  symbol: '686f736b696e736f6e',
                  decimals: 0
                }
              }
            ]
          },
          {
            policyId: 'ba53bc5049cc226f7c8582faec8047bb70982d30539d11697957fb91',
            tokens: [
              {
                value: '999000000',
                currency: {
                  symbol: '636861726c6573',
                  decimals: 0
                }
              }
            ]
          },
          {
            policyId: 'e67dd675e3eb7378a855b3d98bd49854cd2731902fd6e4e139974c74',
            tokens: [
              {
                value: '10000000000',
                currency: {
                  symbol: '4a415a5a',
                  decimals: 0
                }
              }
            ]
          }
        ]
      }
    }
  ],
  transaction_identifier: {
    hash: '8d67291066037f46f092bfc098241cc7143fa1ec2b14b6c23b945878ccf9fe0f'
  }
};
export const block5407534 = {
  block: {
    block_identifier: {
      hash: '6d48a3e7af71698268ea3efaf67a2f012e237b19e10131eb77cd22448fd4183c',
      index: 5407534
    },
    metadata: {
      createdBy: '',
      epochNo: 251,
      size: 544,
      slotNo: 23084569,
      transactionsCount: 1
    },
    parent_block_identifier: {
      hash: '2e0ae8f7c037d6870004e1666c796608203feb9bbaa498bd2012cf216be72370',
      index: 5407533
    },
    timestamp: 1614650860000,
    transactions: [transaction5407534WithTokenBundle]
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

export const CONSTRUCTION_PAYLOADS_REQUEST_INVALID_TTL: Components.Schemas.ConstructionPayloadsRequest = {
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
    ttl: '1'
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

export const CONSTRUCTION_SIGNED_TRANSACTION_WITH_EXTRA_DATA_INVALID_TTL = cbor
  .encode([SIGNED_TRANSACTION, constructionExtraData(CONSTRUCTION_PAYLOADS_REQUEST_INVALID_TTL)])
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

export const CONSTRUCTION_SIGNED_TX_WITH_POOL_RETIREMENT = cbor
  .encode([SIGNED_TX_WITH_POOL_RETIREMENT, constructionExtraData(CONSTRUCTION_PAYLOADS_WITH_POOL_RETIREMENT)])
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

export const coinId909 = { identifier: '909bde6249251257d56008f5a852200b47392676c23724f2fdda932c7bea5599:1' };

export const coinsWithEmptyMa = [
  {
    coin_identifier: coinId909,
    amount: {
      currency: { decimals: 6, symbol: 'ADA' },
      value: '106236428'
    },
    metadata: {
      '909bde6249251257d56008f5a852200b47392676c23724f2fdda932c7bea5599:1': [
        {
          policyId: '5ee467ea4ef07b6f41d88d26ea4c872db6f47ddf27c0d7d3745462a8',
          tokens: [
            {
              value: '97614924',
              currency: {
                symbol: '4552474f',
                decimals: 0,
                metadata: { policyId: '5ee467ea4ef07b6f41d88d26ea4c872db6f47ddf27c0d7d3745462a8' }
              }
            },
            {
              value: '999999999999',
              currency: {
                symbol: '7370616365636f696e73',
                decimals: 0,
                metadata: { policyId: '5ee467ea4ef07b6f41d88d26ea4c872db6f47ddf27c0d7d3745462a8' }
              }
            }
          ]
        },
        {
          policyId: '7a8414dcb7037abcc155a8edb7d56f7a3d24fa14d57635c5fd5a185f',
          tokens: [
            {
              value: '44999685001',
              currency: {
                symbol: '416461',
                decimals: 0,
                metadata: { policyId: '7a8414dcb7037abcc155a8edb7d56f7a3d24fa14d57635c5fd5a185f' }
              }
            },
            {
              value: '9223372036854775000',
              currency: {
                symbol: '54686973546f6b656e57696c6c53656c664465737472756374496e53657665',
                decimals: 0,
                metadata: { policyId: '7a8414dcb7037abcc155a8edb7d56f7a3d24fa14d57635c5fd5a185f' }
              }
            }
          ]
        },
        {
          policyId: '9b9ddbada8dc9cd08509ed660d5b3a65da8f36178def7ced99fa0333',
          tokens: [
            {
              value: '9223372036854775807',
              currency: {
                symbol: '\\x',
                decimals: 0,
                metadata: { policyId: '9b9ddbada8dc9cd08509ed660d5b3a65da8f36178def7ced99fa0333' }
              }
            },
            {
              value: '998000000',
              currency: {
                symbol: '4469616d6f6e64',
                decimals: 0,
                metadata: { policyId: '9b9ddbada8dc9cd08509ed660d5b3a65da8f36178def7ced99fa0333' }
              }
            },
            {
              value: '1000000000000000001',
              currency: {
                symbol: '46726565646f6d546f4e6176616c6e79436f696e',
                decimals: 0,
                metadata: { policyId: '9b9ddbada8dc9cd08509ed660d5b3a65da8f36178def7ced99fa0333' }
              }
            },
            {
              value: '45000000000000000',
              currency: {
                symbol: '4c6f76656c616365',
                decimals: 0,
                metadata: { policyId: '9b9ddbada8dc9cd08509ed660d5b3a65da8f36178def7ced99fa0333' }
              }
            },
            {
              value: '999000000',
              currency: {
                symbol: 'd091d180d0b8d0bbd0bbd0b8d0b0d0bdd182',
                decimals: 0,
                metadata: { policyId: '9b9ddbada8dc9cd08509ed660d5b3a65da8f36178def7ced99fa0333' }
              }
            }
          ]
        }
      ]
    }
  }
];

export const coinsWithSpecifiedTokens = [
  {
    coin_identifier: { identifier: '038e318f0deef63f44be78a8224c06d3faae683f48eb0215a448ab13fd1eb540:0' },
    amount: {
      value: '2000000',
      currency: {
        decimals: 6,
        symbol: 'ADA'
      }
    },
    metadata: {
      '038e318f0deef63f44be78a8224c06d3faae683f48eb0215a448ab13fd1eb540:0': [
        {
          policyId: 'cebbcd14c5b11ca83d7ef93b02acfc0bcb372066bdee259f6cd9ae6c',
          tokens: [
            {
              value: '1000000',
              currency: {
                symbol: '46555a5a',
                decimals: 0,
                metadata: { policyId: 'cebbcd14c5b11ca83d7ef93b02acfc0bcb372066bdee259f6cd9ae6c' }
              }
            }
          ]
        }
      ]
    }
  },
  {
    coin_identifier: { identifier: 'bedcfc581f78fef99268eccaef57bf0d3d4518884164e3e02d4ec33a392d3975:0' },
    amount: {
      value: '1444443',
      currency: {
        decimals: 6,
        symbol: 'ADA'
      }
    },
    metadata: {
      'bedcfc581f78fef99268eccaef57bf0d3d4518884164e3e02d4ec33a392d3975:0': [
        {
          policyId: '818c4c891e543a4d9487b6c18e8b7ed7f0f0870158c45f94e547e7b1',
          tokens: [
            {
              value: '5000',
              currency: {
                symbol: '4f47',
                decimals: 0,
                metadata: { policyId: '818c4c891e543a4d9487b6c18e8b7ed7f0f0870158c45f94e547e7b1' }
              }
            }
          ]
        }
      ]
    }
  }
];

export const allCoinsOfAddr1q8 = [
  {
    coin_identifier: { identifier: '038e318f0deef63f44be78a8224c06d3faae683f48eb0215a448ab13fd1eb540:0' },
    amount: {
      currency: { decimals: 6, symbol: 'ADA' },
      value: '2000000'
    },
    metadata: {
      '038e318f0deef63f44be78a8224c06d3faae683f48eb0215a448ab13fd1eb540:0': [
        {
          policyId: 'cebbcd14c5b11ca83d7ef93b02acfc0bcb372066bdee259f6cd9ae6c',
          tokens: [
            {
              value: '1000000',
              currency: {
                symbol: '46555a5a',
                decimals: 0,
                metadata: { policyId: 'cebbcd14c5b11ca83d7ef93b02acfc0bcb372066bdee259f6cd9ae6c' }
              }
            }
          ]
        }
      ]
    }
  },
  {
    coin_identifier: { identifier: '097291d887af4e150c9821e8ab715fbe707771cbe8185664675aa817fda6e8d5:0' },
    amount: {
      currency: { decimals: 6, symbol: 'ADA' },
      value: '1444443'
    },
    metadata: {
      '097291d887af4e150c9821e8ab715fbe707771cbe8185664675aa817fda6e8d5:0': [
        {
          policyId: '15f86c4f16d51f1890b2416e329c281befd2e42f919839152e73f0b9',
          tokens: [
            {
              value: '50000000',
              currency: {
                symbol: '53544152',
                decimals: 0,
                metadata: { policyId: '15f86c4f16d51f1890b2416e329c281befd2e42f919839152e73f0b9' }
              }
            }
          ]
        }
      ]
    }
  },
  {
    coin_identifier: { identifier: '1e57ecd61f9103f9b3c4eb7d702bdf3cccb25dd569ac49b1e6506b08921092fe:0' },
    amount: {
      currency: { decimals: 6, symbol: 'ADA' },
      value: '25000000'
    }
  },
  {
    coin_identifier: { identifier: '8e8780a9c255252d99ae111c0a3bd6372746ae5f5077e6221d54ed9d3a7c377c:0' },
    amount: {
      currency: { decimals: 6, symbol: 'ADA' },
      value: '89000000'
    }
  },
  {
    coin_identifier: { identifier: 'bedcfc581f78fef99268eccaef57bf0d3d4518884164e3e02d4ec33a392d3975:0' },
    amount: {
      currency: { decimals: 6, symbol: 'ADA' },
      value: '1444443'
    },
    metadata: {
      'bedcfc581f78fef99268eccaef57bf0d3d4518884164e3e02d4ec33a392d3975:0': [
        {
          policyId: '818c4c891e543a4d9487b6c18e8b7ed7f0f0870158c45f94e547e7b1',
          tokens: [
            {
              value: '5000',
              currency: {
                symbol: '4f47',
                decimals: 0,
                metadata: { policyId: '818c4c891e543a4d9487b6c18e8b7ed7f0f0870158c45f94e547e7b1' }
              }
            }
          ]
        }
      ]
    }
  },
  {
    coin_identifier: { identifier: 'c19431c0b525dcbf5db0fd8257e36c4432d67f06c6a7bd1703dbfc9059b554e9:0' },
    amount: {
      currency: { decimals: 6, symbol: 'ADA' },
      value: '1567568'
    },
    metadata: {
      'c19431c0b525dcbf5db0fd8257e36c4432d67f06c6a7bd1703dbfc9059b554e9:0': [
        {
          policyId: 'd894897411707efa755a76deb66d26dfd50593f2e70863e1661e98a0',
          tokens: [
            {
              value: '20000',
              currency: {
                symbol: '7370616365636f696e73',
                decimals: 0,
                metadata: { policyId: 'd894897411707efa755a76deb66d26dfd50593f2e70863e1661e98a0' }
              }
            }
          ]
        }
      ]
    }
  },
  {
    coin_identifier: { identifier: 'e160ac4ae046c62486d317668bf44fdbfd27eebfbc968b4574e558510ae6639d:0' },
    amount: {
      currency: { decimals: 6, symbol: 'ADA' },
      value: '80000000'
    }
  }
];

export const coinsWithEmptyNameToken = [
  {
    coin_identifier: { identifier: '909bde6249251257d56008f5a852200b47392676c23724f2fdda932c7bea5599:1' },
    amount: { value: '106236428', currency: { symbol: 'ADA', decimals: 6 } },
    metadata: {
      '909bde6249251257d56008f5a852200b47392676c23724f2fdda932c7bea5599:1': [
        {
          policyId: '5ee467ea4ef07b6f41d88d26ea4c872db6f47ddf27c0d7d3745462a8',
          tokens: [
            {
              value: '97614924',
              currency: {
                symbol: '4552474f',
                decimals: 0,
                metadata: { policyId: '5ee467ea4ef07b6f41d88d26ea4c872db6f47ddf27c0d7d3745462a8' }
              }
            },
            {
              value: '999999999999',
              currency: {
                symbol: '7370616365636f696e73',
                decimals: 0,
                metadata: { policyId: '5ee467ea4ef07b6f41d88d26ea4c872db6f47ddf27c0d7d3745462a8' }
              }
            }
          ]
        },
        {
          policyId: '7a8414dcb7037abcc155a8edb7d56f7a3d24fa14d57635c5fd5a185f',
          tokens: [
            {
              value: '44999685001',
              currency: {
                symbol: '416461',
                decimals: 0,
                metadata: { policyId: '7a8414dcb7037abcc155a8edb7d56f7a3d24fa14d57635c5fd5a185f' }
              }
            },
            {
              value: '9223372036854775000',
              currency: {
                symbol: '54686973546f6b656e57696c6c53656c664465737472756374496e53657665',
                decimals: 0,
                metadata: { policyId: '7a8414dcb7037abcc155a8edb7d56f7a3d24fa14d57635c5fd5a185f' }
              }
            }
          ]
        },
        {
          policyId: '9b9ddbada8dc9cd08509ed660d5b3a65da8f36178def7ced99fa0333',
          tokens: [
            {
              value: '9223372036854775807',
              currency: {
                symbol: '\\x',
                decimals: 0,
                metadata: { policyId: '9b9ddbada8dc9cd08509ed660d5b3a65da8f36178def7ced99fa0333' }
              }
            },
            {
              value: '998000000',
              currency: {
                symbol: '4469616d6f6e64',
                decimals: 0,
                metadata: { policyId: '9b9ddbada8dc9cd08509ed660d5b3a65da8f36178def7ced99fa0333' }
              }
            },
            {
              value: '1000000000000000001',
              currency: {
                symbol: '46726565646f6d546f4e6176616c6e79436f696e',
                decimals: 0,
                metadata: { policyId: '9b9ddbada8dc9cd08509ed660d5b3a65da8f36178def7ced99fa0333' }
              }
            },
            {
              value: '45000000000000000',
              currency: {
                symbol: '4c6f76656c616365',
                decimals: 0,
                metadata: { policyId: '9b9ddbada8dc9cd08509ed660d5b3a65da8f36178def7ced99fa0333' }
              }
            },
            {
              value: '999000000',
              currency: {
                symbol: 'd091d180d0b8d0bbd0bbd0b8d0b0d0bdd182',
                decimals: 0,
                metadata: { policyId: '9b9ddbada8dc9cd08509ed660d5b3a65da8f36178def7ced99fa0333' }
              }
            }
          ]
        }
      ]
    }
  }
];
