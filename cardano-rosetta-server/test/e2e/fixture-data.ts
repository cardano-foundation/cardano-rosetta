/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable max-len */
/* eslint-disable no-magic-numbers */
import CardanoWasm from 'cardano-serialization-lib';
import cbor from 'cbor';
import {
  OperationType,
  SIGNATURE_TYPE,
  StakingOperations,
  PoolOperations,
  VoteOperations
} from '../../src/server/utils/constants';
import { TransactionExtraData } from '../../src/server/utils/data-mapper';

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

export const latestBlockHash = '1c42fd317888b2aafe9f84787fdd3b90b95be06687a217cf4e6ca95130157eb5';
export const latestBlockSlot = 26912827;
export const latestBlockIdentifier = {
  hash: latestBlockHash,
  index: 5593749
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
        ],
        metadata: {
          size: 134,
          scriptSize: 0
        }
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
        ],
        metadata: {
          size: 134,
          scriptSize: 0
        }
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
        metadata: {
          size: 212,
          scriptSize: 0
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
        operation_identifier: { index: 2, network_index: 0 },
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
      },
      {
        operation_identifier: { index: 3, network_index: 1 },
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
      }
    ],
    transaction_identifier: {
      hash: '2974845ecc7e02e86285d32961c69f3945662a80d5e2caae8a1086e652936f42'
    },
    metadata: {
      size: 451,
      scriptSize: 0
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
    },
    metadata: {
      scriptSize: 0,
      size: 361
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
    },
    metadata: {
      scriptSize: 0,
      size: 429
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
    ],
    metadata: {
      size: 365,
      scriptSize: 0
    }
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
    },
    metadata: {
      size: 365,
      scriptSize: 0
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
    },
    metadata: {
      size: 723,
      scriptSize: 0
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
    },
    metadata: {
      scriptSize: 0,
      size: 1011
    }
  }
};

export const transactionWithBadFormedVote = {
  transaction: {
    transaction_identifier: { hash: 'cacbc12afa3a1d2ec0186971d5c9035c79bfa1250ca7a6af580d1b8d9e04db8c' },
    operations: [
      {
        operation_identifier: { index: 0 },
        type: 'input',
        status: 'success',
        account: {
          address:
            'addr1qyqecnd542f893rc4kmxpz0xfuutrhvvjj5gsrtlsxhlyfnm3vs0d6wervt6tpl4xyjuncvglx0q6cxrp4wuzcl4t5kq35cypt'
        },
        amount: { value: '-604000000', currency: { symbol: 'ADA', decimals: 6 } },
        coin_change: {
          coin_identifier: { identifier: 'f43f025160af4658cb10cfb9977eaf5ba2031b4ad6775556b443147e6e45bff0:0' },
          coin_action: 'coin_spent'
        }
      },
      {
        operation_identifier: { index: 1, network_index: 0 },
        related_operations: [{ index: 0 }],
        type: 'output',
        status: 'success',
        account: {
          address:
            'addr1q9l77n7323z6jhl96u6j2kqfu0f8x35dfd8u92vrjft9fzmm3vs0d6wervt6tpl4xyjuncvglx0q6cxrp4wuzcl4t5kqwcvgsr'
        },
        amount: { value: '1000000', currency: { symbol: 'ADA', decimals: 6 } },
        coin_change: {
          coin_identifier: { identifier: 'cacbc12afa3a1d2ec0186971d5c9035c79bfa1250ca7a6af580d1b8d9e04db8c:0' },
          coin_action: 'coin_created'
        }
      },
      {
        operation_identifier: { index: 2, network_index: 1 },
        related_operations: [{ index: 0 }],
        type: 'output',
        status: 'success',
        account: {
          address:
            'addr1q9azv5wxc7hl9xsd6wvjkkkjwx6cdpqdqre84588sshk8unm3vs0d6wervt6tpl4xyjuncvglx0q6cxrp4wuzcl4t5kqp9f490'
        },
        amount: { value: '602820639', currency: { symbol: 'ADA', decimals: 6 } },
        coin_change: {
          coin_identifier: { identifier: 'cacbc12afa3a1d2ec0186971d5c9035c79bfa1250ca7a6af580d1b8d9e04db8c:1' },
          coin_action: 'coin_created'
        }
      }
    ],
    metadata: { size: 531, scriptSize: 0 }
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
  metadata: {
    size: 543,
    scriptSize: 0
  },
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
    metadata: {
      size: 0,
      scriptSize: 0
    },
    transaction_identifier: {
      hash: '927edb96f3386ab91b5f5d85d84cb4253c65b1c2f65fa7df25f81fab1d62987a'
    }
  }
};

export const invalidAlonzoTransaction = {
  transaction: {
    operations: [
      {
        operation_identifier: { index: 0 },
        type: 'input',
        status: 'invalid',
        account: { address: 'addr_test1vpdvkurqk92detyluym8s6pg3gkf5nlah834rag4rntylzs9p3d0g' },
        amount: { value: '-10000000', currency: { symbol: 'ADA', decimals: 6 } },
        coin_change: {
          coin_identifier: { identifier: 'b2cf437085d433e75b273adc4efe62fffcdc7fa3d3c821d3994814301df911b0:1' },
          coin_action: 'coin_spent'
        }
      },
      {
        operation_identifier: { index: 1, network_index: 0 },
        related_operations: [{ index: 0 }],
        type: 'output',
        status: 'invalid',
        account: { address: 'addr_test1vpdvkurqk92detyluym8s6pg3gkf5nlah834rag4rntylzs9p3d0g' },
        amount: { value: '1828955', currency: { symbol: 'ADA', decimals: 6 } },
        coin_change: {
          coin_identifier: { identifier: '0c2d516c9eaf0d9f641506f1f64be3f660a49e622f4651ed1b19d6edeaefaf4c:0' },
          coin_action: 'coin_created'
        }
      },
      {
        operation_identifier: { index: 2, network_index: 1 },
        related_operations: [{ index: 0 }],
        type: 'output',
        status: 'invalid',
        account: { address: 'addr_test1vpdvkurqk92detyluym8s6pg3gkf5nlah834rag4rntylzs9p3d0g' },
        amount: { value: '3000000', currency: { symbol: 'ADA', decimals: 6 } },
        coin_change: {
          coin_identifier: { identifier: '0c2d516c9eaf0d9f641506f1f64be3f660a49e622f4651ed1b19d6edeaefaf4c:1' },
          coin_action: 'coin_created'
        }
      }
    ],
    metadata: {
      size: 352,
      scriptSize: 30
    },
    transaction_identifier: {
      hash: '0c2d516c9eaf0d9f641506f1f64be3f660a49e622f4651ed1b19d6edeaefaf4c'
    }
  }
};

export const transactionWithVoteOperation = {
  transaction: {
    transaction_identifier: { hash: 'adeb7b6845f3f4b0e74275588412cf00912b615e4bbf76d111326ce899260c59' },
    operations: [
      {
        operation_identifier: { index: 0 },
        type: 'input',
        status: 'success',
        account: {
          address:
            'addr1q85lqccktlt8j08g58jesjk3gwe9p0eyvxtl77lqaacuf6uvcjwuayent36vkw403c8hat9csyawfgg88qlwweyeshnq4d22p8'
        },
        amount: { value: '-1123600000', currency: { decimals: 6, symbol: 'ADA' } },
        coin_change: {
          coin_identifier: { identifier: '02a1441419ebbe583139c1662351d4f3724e5d9ea3aef4e12c90edb0d5c5f2f5:23' },
          coin_action: 'coin_spent'
        }
      },
      {
        operation_identifier: {
          index: 1
        },
        status: 'success',
        type: 'voteRegistration',
        metadata: {
          voteRegistrationMetadata: {
            rewardAddress:
              'addr1q9nr7yuhzsmmdchsjacuqef5cnlajk2s4j2rjre5uzgmtw5vcjwuayent36vkw403c8hat9csyawfgg88qlwweyeshnqsh9r5q',
            stakeKey: {
              curve_type: 'edwards25519',
              hex_bytes: '56f29f391a3bb5ff90637b2d2d0a32590214871284b0577e4671b0c1a83f79ba'
            },
            votingKey: {
              curve_type: 'edwards25519',
              hex_bytes: '8bcec4282239b2cc1a7d8bb294c154c849fc200c7ebd27ef45e610d849bc302a'
            },
            votingNonce: 26912766,
            votingSignature:
              'f75f7a54a79352f9d0e2c4de4e8ded8ae9304fa0f3b021754f8d149c90c7b01e1c6bbfdd623c294d82f5e5cbbfc0bd6fd1c674780db4025446e2eafc87f61b0a'
          }
        }
      },

      {
        operation_identifier: { index: 2, network_index: 0 },
        related_operations: [{ index: 0 }],
        type: 'output',
        status: 'success',
        account: {
          address:
            'addr1q9nr7yuhzsmmdchsjacuqef5cnlajk2s4j2rjre5uzgmtw5vcjwuayent36vkw403c8hat9csyawfgg88qlwweyeshnqsh9r5q'
        },
        amount: { value: '1123423763', currency: { decimals: 6, symbol: 'ADA' } },
        coin_change: {
          coin_identifier: { identifier: 'adeb7b6845f3f4b0e74275588412cf00912b615e4bbf76d111326ce899260c59:0' },
          coin_action: 'coin_created'
        }
      }
    ],
    metadata: { size: 470, scriptSize: 0 }
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
        address: 'Ae2tdPwUPEZC6WJfVQxTNN2tWw4skGrN6zRVukvxJmTFy1nYkVGQBuURU3L'
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

export const CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION: Components.Schemas.ConstructionPayloadsRequest = {
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
      type: OperationType.VOTE_REGISTRATION,
      status: 'success',
      metadata: {
        voteRegistrationMetadata: {
          rewardAddress: 'stake1uyqq2a22arunrft3k9ehqc7yjpxtxjmvgndae80xw89mwyge9skyp',
          stakeKey: {
            hex_bytes: '86870efc99c453a873a16492ce87738ec79a0ebd064379a62e2c9cf4e119219e',
            curve_type: 'edwards25519'
          },
          votingKey: {
            hex_bytes: '0036ef3e1f0d3f5989e2d155ea54bdb2a72c4c456ccb959af4c94868f473f5a0',
            curve_type: 'edwards25519'
          },
          votingNonce: 1234,
          votingSignature:
            '6c2312cd49067ecf0920df7e067199c55b3faef4ec0bce1bd2cfb99793972478c45876af2bc271ac759c5ce40ace5a398b9fdb0e359f3c333fe856648804780e'
        }
      }
    }
  ],
  metadata: {
    ttl: '1000'
  }
};

export const CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_WITH_NO_VOTING_KEY: Components.Schemas.ConstructionPayloadsRequest = {
  ...CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION,
  operations: [
    ...CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION.operations.slice(0, 3),
    {
      operation_identifier: {
        index: 3
      },
      type: OperationType.VOTE_REGISTRATION,
      status: 'success',
      metadata: {
        voteRegistrationMetadata: {
          rewardAddress: 'stake1uyqq2a22arunrft3k9ehqc7yjpxtxjmvgndae80xw89mwyge9skyp',
          stakeKey: {
            hex_bytes: '86870efc99c453a873a16492ce87738ec79a0ebd064379a62e2c9cf4e119219e',
            curve_type: 'edwards25519'
          },
          votingKey: {
            hex_bytes: '',
            curve_type: 'edwards25519'
          },
          votingNonce: 1234,
          votingSignature:
            '6c2312cd49067ecf0920df7e067199c55b3faef4ec0bce1bd2cfb99793972478c45876af2bc271ac759c5ce40ace5a398b9fdb0e359f3c333fe856648804780e'
        }
      }
    }
  ]
};

export const CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_WITH_INVALID_VOTING_KEY: Components.Schemas.ConstructionPayloadsRequest = {
  ...CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION,
  operations: [
    ...CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION.operations.slice(0, 3),
    {
      operation_identifier: {
        index: 3
      },
      type: OperationType.VOTE_REGISTRATION,
      status: 'success',
      metadata: {
        voteRegistrationMetadata: {
          rewardAddress: 'stake1uyqq2a22arunrft3k9ehqc7yjpxtxjmvgndae80xw89mwyge9skyp',
          stakeKey: {
            hex_bytes: '86870efc99c453a873a16492ce87738ec79a0ebd064379a62e2c9cf4e119219e',
            curve_type: 'edwards25519'
          },
          votingKey: {
            hex_bytes:
              '6c2312cd49067ecf0920df7e067199c55b3faef4ec0bce1bd2cfb99793972478c45876af2bc271ac759c5ce40ace5a398b9fdb0e359f3c333fe856648804780e',
            curve_type: 'edwards25519'
          },
          votingNonce: 1234,
          votingSignature:
            '6c2312cd49067ecf0920df7e067199c55b3faef4ec0bce1bd2cfb99793972478c45876af2bc271ac759c5ce40ace5a398b9fdb0e359f3c333fe856648804780e'
        }
      }
    }
  ]
};

export const CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_WITH_NO_REWARD_ADDRESS: Components.Schemas.ConstructionPayloadsRequest = {
  ...CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION,
  operations: [
    ...CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION.operations.slice(0, 3),
    {
      operation_identifier: {
        index: 3
      },
      type: OperationType.VOTE_REGISTRATION,
      status: 'success',
      metadata: {
        voteRegistrationMetadata: {
          rewardAddress: '',
          stakeKey: {
            hex_bytes: '86870efc99c453a873a16492ce87738ec79a0ebd064379a62e2c9cf4e119219e',
            curve_type: 'edwards25519'
          },
          votingKey: {
            hex_bytes: '0036ef3e1f0d3f5989e2d155ea54bdb2a72c4c456ccb959af4c94868f473f5a0',
            curve_type: 'edwards25519'
          },
          votingNonce: 1234,
          votingSignature:
            '6c2312cd49067ecf0920df7e067199c55b3faef4ec0bce1bd2cfb99793972478c45876af2bc271ac759c5ce40ace5a398b9fdb0e359f3c333fe856648804780e'
        }
      }
    }
  ]
};

export const CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_WITH_INVALID_REWARD_ADDRESS: Components.Schemas.ConstructionPayloadsRequest = {
  ...CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION,
  operations: [
    ...CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION.operations.slice(0, 3),
    {
      operation_identifier: {
        index: 3
      },
      type: OperationType.VOTE_REGISTRATION,
      status: 'success',
      metadata: {
        voteRegistrationMetadata: {
          rewardAddress: 'addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx',
          stakeKey: {
            hex_bytes: '86870efc99c453a873a16492ce87738ec79a0ebd064379a62e2c9cf4e119219e',
            curve_type: 'edwards25519'
          },
          votingKey: {
            hex_bytes: '0036ef3e1f0d3f5989e2d155ea54bdb2a72c4c456ccb959af4c94868f473f5a0',
            curve_type: 'edwards25519'
          },
          votingNonce: 1234,
          votingSignature:
            '6c2312cd49067ecf0920df7e067199c55b3faef4ec0bce1bd2cfb99793972478c45876af2bc271ac759c5ce40ace5a398b9fdb0e359f3c333fe856648804780e'
        }
      }
    }
  ]
};

export const CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_WITH_NO_STAKE_KEY: Components.Schemas.ConstructionPayloadsRequest = {
  ...CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION,
  operations: [
    ...CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION.operations.slice(0, 3),
    {
      operation_identifier: {
        index: 3
      },
      type: OperationType.VOTE_REGISTRATION,
      status: 'success',
      metadata: {
        voteRegistrationMetadata: {
          rewardAddress: 'stake1uyqq2a22arunrft3k9ehqc7yjpxtxjmvgndae80xw89mwyge9skyp',
          stakeKey: {
            hex_bytes: '',
            curve_type: 'edwards25519'
          },
          votingKey: {
            hex_bytes: '0036ef3e1f0d3f5989e2d155ea54bdb2a72c4c456ccb959af4c94868f473f5a0',
            curve_type: 'edwards25519'
          },
          votingNonce: 1234,
          votingSignature:
            '6c2312cd49067ecf0920df7e067199c55b3faef4ec0bce1bd2cfb99793972478c45876af2bc271ac759c5ce40ace5a398b9fdb0e359f3c333fe856648804780e'
        }
      }
    }
  ]
};

export const CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_WITH_INVALID_STAKE_KEY: Components.Schemas.ConstructionPayloadsRequest = {
  ...CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION,
  operations: [
    ...CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION.operations.slice(0, 3),
    {
      operation_identifier: {
        index: 3
      },
      type: OperationType.VOTE_REGISTRATION,
      status: 'success',
      metadata: {
        voteRegistrationMetadata: {
          rewardAddress: 'stake1uyqq2a22arunrft3k9ehqc7yjpxtxjmvgndae80xw89mwyge9skyp',
          stakeKey: {
            hex_bytes:
              '6c2312cd49067ecf0920df7e067199c55b3faef4ec0bce1bd2cfb99793972478c45876af2bc271ac759c5ce40ace5a398b9fdb0e359f3c333fe856648804780e',
            curve_type: 'edwards25519'
          },
          votingKey: {
            hex_bytes: '0036ef3e1f0d3f5989e2d155ea54bdb2a72c4c456ccb959af4c94868f473f5a0',
            curve_type: 'edwards25519'
          },
          votingNonce: 1234,
          votingSignature:
            '6c2312cd49067ecf0920df7e067199c55b3faef4ec0bce1bd2cfb99793972478c45876af2bc271ac759c5ce40ace5a398b9fdb0e359f3c333fe856648804780e'
        }
      }
    }
  ]
};

export const CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_WITH_INVALID_NONCE: Components.Schemas.ConstructionPayloadsRequest = {
  ...CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION,
  operations: [
    ...CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION.operations.slice(0, 3),
    {
      operation_identifier: {
        index: 3
      },
      type: OperationType.VOTE_REGISTRATION,
      status: 'success',
      metadata: {
        voteRegistrationMetadata: {
          rewardAddress: 'stake1uyqq2a22arunrft3k9ehqc7yjpxtxjmvgndae80xw89mwyge9skyp',
          stakeKey: {
            hex_bytes: '86870efc99c453a873a16492ce87738ec79a0ebd064379a62e2c9cf4e119219e',
            curve_type: 'edwards25519'
          },
          votingKey: {
            hex_bytes: '0036ef3e1f0d3f5989e2d155ea54bdb2a72c4c456ccb959af4c94868f473f5a0',
            curve_type: 'edwards25519'
          },
          votingNonce: 0,
          votingSignature:
            '6c2312cd49067ecf0920df7e067199c55b3faef4ec0bce1bd2cfb99793972478c45876af2bc271ac759c5ce40ace5a398b9fdb0e359f3c333fe856648804780e'
        }
      }
    }
  ]
};

export const CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_WITH_NO_SIGNATURE: Components.Schemas.ConstructionPayloadsRequest = {
  ...CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION,
  operations: [
    ...CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION.operations.slice(0, 3),
    {
      operation_identifier: {
        index: 3
      },
      type: OperationType.VOTE_REGISTRATION,
      status: 'success',
      metadata: {
        voteRegistrationMetadata: {
          rewardAddress: 'stake1uyqq2a22arunrft3k9ehqc7yjpxtxjmvgndae80xw89mwyge9skyp',
          stakeKey: {
            hex_bytes: '86870efc99c453a873a16492ce87738ec79a0ebd064379a62e2c9cf4e119219e',
            curve_type: 'edwards25519'
          },
          votingKey: {
            hex_bytes: '0036ef3e1f0d3f5989e2d155ea54bdb2a72c4c456ccb959af4c94868f473f5a0',
            curve_type: 'edwards25519'
          },
          votingNonce: 1234,
          votingSignature: ''
        }
      }
    }
  ]
};

export const CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_WITH_INVALID_SIGNATURE: Components.Schemas.ConstructionPayloadsRequest = {
  ...CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION,
  operations: [
    ...CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION.operations.slice(0, 3),
    {
      operation_identifier: {
        index: 3
      },
      type: OperationType.VOTE_REGISTRATION,
      status: 'success',
      metadata: {
        voteRegistrationMetadata: {
          rewardAddress: 'stake1uyqq2a22arunrft3k9ehqc7yjpxtxjmvgndae80xw89mwyge9skyp',
          stakeKey: {
            hex_bytes: '86870efc99c453a873a16492ce87738ec79a0ebd064379a62e2c9cf4e119219e',
            curve_type: 'edwards25519'
          },
          votingKey: {
            hex_bytes: '0036ef3e1f0d3f5989e2d155ea54bdb2a72c4c456ccb959af4c94868f473f5a0',
            curve_type: 'edwards25519'
          },
          votingNonce: 1234,
          votingSignature: '0036ef3e1f0d3f5989e2d155ea54bdb2a72c4c456ccb959af4c94868f473f5a0'
        }
      }
    }
  ]
};

export const CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_WITH_NO_METADATA: Components.Schemas.ConstructionPayloadsRequest = {
  ...CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION,
  operations: [
    ...CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION.operations.slice(0, 3),
    {
      operation_identifier: {
        index: 3
      },
      type: OperationType.VOTE_REGISTRATION,
      status: 'success'
    }
  ]
};
export const CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_WITH_EMPTY_METADATA: Components.Schemas.ConstructionPayloadsRequest = {
  ...CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION,
  operations: [
    ...CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION.operations.slice(0, 3),
    {
      operation_identifier: {
        index: 3
      },
      type: OperationType.VOTE_REGISTRATION,
      status: 'success',
      metadata: {}
    }
  ]
};

const constructVoteRegistrationMetadata = (requestMetadata: Components.Schemas.VoteRegistrationMetadata): string => {
  const { rewardAddress, votingSignature, votingNonce, votingKey, stakeKey } = requestMetadata;
  const wasmAddress = CardanoWasm.RewardAddress.from_address(CardanoWasm.Address.from_bech32(rewardAddress));
  if (!wasmAddress) throw new Error('Should never happen');
  const rewardAddressHex = Buffer.from(wasmAddress.to_address().to_bytes()).toString('hex');
  const generalMetadata = CardanoWasm.GeneralTransactionMetadata.new();
  generalMetadata.insert(
    CardanoWasm.BigNum.from_str('61284'),
    CardanoWasm.encode_json_str_to_metadatum(
      JSON.stringify({
        1: `0x${votingKey.hex_bytes}`,
        2: `0x${stakeKey.hex_bytes}`,
        3: `0x${rewardAddressHex}`,
        4: votingNonce
      }),
      CardanoWasm.MetadataJsonSchema.BasicConversions
    )
  );
  generalMetadata.insert(
    CardanoWasm.BigNum.from_str('61285'),
    CardanoWasm.encode_json_str_to_metadatum(
      JSON.stringify({
        1: `0x${votingSignature}`
      }),
      CardanoWasm.MetadataJsonSchema.BasicConversions
    )
  );
  const metadataList = CardanoWasm.MetadataList.new();
  metadataList.add(CardanoWasm.TransactionMetadatum.from_bytes(generalMetadata.to_bytes()));
  metadataList.add(CardanoWasm.TransactionMetadatum.new_list(CardanoWasm.MetadataList.new()));
  return Buffer.from(CardanoWasm.AuxiliaryData.from_bytes(metadataList.to_bytes()).to_bytes()).toString('hex');
};

const constructionExtraData = (
  constructionPayloadsRequest: Components.Schemas.ConstructionPayloadsRequest,
  voteRegistrationMetadata?: Components.Schemas.VoteRegistrationMetadata
): TransactionExtraData => {
  const extraData: TransactionExtraData = {
    operations: constructionPayloadsRequest.operations.filter(
      op =>
        op.coin_change?.coin_action === 'coin_spent' ||
        StakingOperations.includes(op.type as OperationType) ||
        PoolOperations.includes(op.type as OperationType) ||
        VoteOperations.includes(op.type as OperationType)
    )
  };
  if (voteRegistrationMetadata) {
    extraData.transactionMetadataHex = constructVoteRegistrationMetadata(voteRegistrationMetadata);
  }
  return extraData;
};

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
    'a400818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c4002199c40031903e8',
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

export const CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_RESPONSE = cbor
  .encode([
    'a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c4002199c40031903e807582088ca8654582e83937873230b6646a2210134d3e41e0bc9824ce7be4e0b28a896',
    constructionExtraData(
      CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION,
      CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION.operations[3].metadata?.voteRegistrationMetadata
    )
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

const SIGNED_TX_WITH_BYRON_INPUT =
  '83a400818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c4002199c40031903e8a1028184582073fea80d424276ad0978d4fe5310e8bc2d485f5f6bb3bf87612989f112ad5a7d5840dc2a1948bfa9411b37e8d280b04c48a85af5588bcf509c0fca798f7b462ebca92d6733dacc1f1c6c1463623c085401be07ea422ad4f1c543375e7d3d2393aa0b5820dd75e154da417becec55cdd249327454138f082110297d5e87ab25e15fad150f41a0f6';

export const TRANSACTION_WITH_BYRON_INPUT_SIZE = SIGNED_TX_WITH_BYRON_INPUT.length / 2 - 2;

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

export const SIGNED_TX_WITH_VOTE_REGISTRATION =
  '83a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c4002199c40031903e807582088ca8654582e83937873230b6646a2210134d3e41e0bc9824ce7be4e0b28a896a100818258201b400d60aaf34eaf6dcbab9bba46001a23497886cf11066f7846933d30e5ad3f58406c92508135cb060187a2706ade8154782867b1526e9615d06742be5c56f037ab85894c098c2ab07971133c0477baee92adf3527ad7cc816f13e1e4c361041206f6';

export const SIGNED_TX_WITH_METADATA =
  '83a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c4002199c40031903e807582088ca8654582e83937873230b6646a2210134d3e41e0bc9824ce7be4e0b28a896a100818258201b400d60aaf34eaf6dcbab9bba46001a23497886cf11066f7846933d30e5ad3f58406c92508135cb060187a2706ade8154782867b1526e9615d06742be5c56f037ab85894c098c2ab07971133c0477baee92adf3527ad7cc816f13e1e4c36104120682a219ef64a40158200036ef3e1f0d3f5989e2d155ea54bdb2a72c4c456ccb959af4c94868f473f5a002582086870efc99c453a873a16492ce87738ec79a0ebd064379a62e2c9cf4e119219e03581de10005754ae8f931a571b1737063c4904cb34b6c44dbdc9de671cbb711041904d219ef65a10158406c2312cd49067ecf0920df7e067199c55b3faef4ec0bce1bd2cfb99793972478c45876af2bc271ac759c5ce40ace5a398b9fdb0e359f3c333fe856648804780e80';

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

export const CONSTRUCTION_SIGNED_TX_WITH_VOTE_REGISTRATION = cbor
  .encode([
    SIGNED_TX_WITH_VOTE_REGISTRATION,
    constructionExtraData(
      CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION,
      CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION.operations[3].metadata?.voteRegistrationMetadata
    )
  ])
  .toString('hex');

export const CONSTRUCTION_SIGNED_TX_WITH_TX_METADATA = cbor
  .encode([
    SIGNED_TX_WITH_METADATA,
    constructionExtraData(
      CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION,
      CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION.operations[3].metadata?.voteRegistrationMetadata
    )
  ])
  .toString('hex');

export const CONSTRUCTION_SIGNED_TX_WITH_BYRON_ADDESS = cbor
  .encode([SIGNED_TX_WITH_BYRON_INPUT, constructionExtraData(CONSTRUCTION_PAYLOADS_REQUEST_WITH_BYRON_INPUT)])
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

export const CONSTRUCTION_COMBINE_WITH_METADATA_PAYLOAD = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  unsigned_transaction: CONSTRUCTION_PAYLOADS_WITH_VOTE_REGISTRATION_RESPONSE,
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

export const CONSTRUCTION_COMBINE_WITH_BYRON_ADDRESS_PAYLOAD = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  unsigned_transaction: CONSTRUCTION_PAYLOADS_REQUEST_WITH_BYRON_INPUT_RESPONSE,
  signatures: [
    {
      signing_payload: {
        account_identifier: {
          address: 'Ae2tdPwUPEZC6WJfVQxTNN2tWw4skGrN6zRVukvxJmTFy1nYkVGQBuURU3L',
          metadata: {
            chain_code: 'dd75e154da417becec55cdd249327454138f082110297d5e87ab25e15fad150f'
          }
        },
        hex_bytes: '4691ebf945f37962153f74e198ba2553177e6dc8e464303e37589077f634397c',
        signature_type: SIGNATURE_TYPE
      },
      public_key: {
        hex_bytes: '73fea80d424276ad0978d4fe5310e8bc2d485f5f6bb3bf87612989f112ad5a7d',
        curve_type: 'edwards25519'
      },
      signature_type: SIGNATURE_TYPE,
      hex_bytes:
        'dc2a1948bfa9411b37e8d280b04c48a85af5588bcf509c0fca798f7b462ebca92d6733dacc1f1c6c1463623c085401be07ea422ad4f1c543375e7d3d2393aa0b'
    }
  ]
};

export const CONSTRUCTION_COMBINE_WITH_BYRON_ADDRESS_MISSING_CHAINCODE_PAYLOAD = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  unsigned_transaction: CONSTRUCTION_PAYLOADS_REQUEST_WITH_BYRON_INPUT_RESPONSE,
  signatures: [
    {
      signing_payload: {
        account_identifier: {
          address: 'Ae2tdPwUPEZC6WJfVQxTNN2tWw4skGrN6zRVukvxJmTFy1nYkVGQBuURU3L'
        },
        hex_bytes: '4691ebf945f37962153f74e198ba2553177e6dc8e464303e37589077f634397c',
        signature_type: SIGNATURE_TYPE
      },
      public_key: {
        hex_bytes: '73fea80d424276ad0978d4fe5310e8bc2d485f5f6bb3bf87612989f112ad5a7d',
        curve_type: 'edwards25519'
      },
      signature_type: SIGNATURE_TYPE,
      hex_bytes:
        'dc2a1948bfa9411b37e8d280b04c48a85af5588bcf509c0fca798f7b462ebca92d6733dacc1f1c6c1463623c085401be07ea422ad4f1c543375e7d3d2393aa0b'
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

export const searchTransactionsWithNoFilter = [
  {
    block_identifier: {
      hash: '1c42fd317888b2aafe9f84787fdd3b90b95be06687a217cf4e6ca95130157eb5',
      index: 5593749
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 425
      },
      operations: [
        {
          account: {
            address:
              'addr1qykp6nc2u56hvymfczq48c2y9p0qeuz2gnukpydlc2y256a0l5j4psvauul469hd6x6ee5hfm0k9c5qx9rh8hhewhnhsna6nr4'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-230870712'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: 'db3852a5f62b1fb0c2ebb8a7b242254a65cdb0a4658fc28b8e4d9e8efa1e4475:0'
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
            address: 'stake1uxhl6f2scxw7w06azmkardvu6t5ahmzu2qrz3mnmmuhtemcnj3m5g'
          },
          metadata: {
            depositAmount: {
              currency: {
                decimals: 6,
                symbol: 'ADA'
              },
              value: '2000000'
            }
          },
          operation_identifier: {
            index: 1
          },
          status: 'success',
          type: 'stakeKeyRegistration'
        },
        {
          account: {
            address: 'stake1uxhl6f2scxw7w06azmkardvu6t5ahmzu2qrz3mnmmuhtemcnj3m5g'
          },
          metadata: {
            pool_key_hash: 'e594951faeec31cb8efc70c3e36887f18f8bc62c718f25ec64807dfa'
          },
          operation_identifier: {
            index: 2
          },
          status: 'success',
          type: 'stakeDelegation'
        },
        {
          account: {
            address:
              'addr1q96vp4gryxr5pw8kwvnga06wd0w00ln33knlggxqfln4mnd0l5j4psvauul469hd6x6ee5hfm0k9c5qx9rh8hhewhnhsqnzp99'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '228696455'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '5a834bd657e75babb669d3a1fae8be5034763d0cd84e6f2ec557375472326329:0'
            }
          },
          operation_identifier: {
            index: 3,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '5a834bd657e75babb669d3a1fae8be5034763d0cd84e6f2ec557375472326329'
      }
    }
  },
  {
    block_identifier: {
      hash: '1c42fd317888b2aafe9f84787fdd3b90b95be06687a217cf4e6ca95130157eb5',
      index: 5593749
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 1561
      },
      operations: [
        {
          account: {
            address: 'Ae2tdPwUPEZLu4DhbGMAPiwbfwnC5byUD3uGMDgSHd1FGVUyk33b5s2f8Km'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-17536773201'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '36059916a928966cde732699c7123c3d8e71bd96950fe91629a15e32939ca089:18'
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
            address: 'Ae2tdPwUPEZ9fjjKu2vpsQRYwgLhpRk8eFt5WNcVwKQ8YHBLSdRXeE9T6gp'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-84882690'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: 'ac53733d8f7bae6d7484dbf512430798e7216d8f74bd3f7b80e682b88de81262:14'
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
              'addr1q8su4nh2ud4gjjehkvyna0tr4h8j09p0gq2rl47mmjp9fhl6vn5gteethf632v4w6qv0rsut97gr2l2m6fyy644uh94qm83s3t'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '25000000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:0'
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
              'addr1qy2pnwjca8lge908082c63k8hcah2tl4a57l0wdsyrhkjtffuavhjefynl2pwv0mw460egjgcww83n0azgzcw98uyr8q3vgtez'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '600600000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:1'
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
        },
        {
          account: {
            address:
              'DdzFFzCqrht1ACmenXuwm12x8joxeZzCS5Jo2n8R7GcCUQQ9v34iSrNuMMa56Dadgq3Xwdgp8Bs7xh6bLZSQh7GzwRfaDURwAKJXWhvC'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '109600000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:2'
            }
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
        },
        {
          account: {
            address:
              'addr1q9l40aauqfvt5s5d4smk9zfhjr2e5u2rpdfkysfftsc2gp6u7syd7jh9k084nplwsx4hyy2ehefy8y5cd2ukckv0uazq8dm4ku'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '160000000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:3'
            }
          },
          operation_identifier: {
            index: 5,
            network_index: 3
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
            address: 'addr1vx9g6j8p4r0pcmj24tzyuedpj8fl3nwuc53zzd82n4h33wspl80tu'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '15200000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:4'
            }
          },
          operation_identifier: {
            index: 6,
            network_index: 4
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
              'addr1qyndezdwul5zl8a535l6j7z66grxufnqj8ew3lhdvchdza3xmjy6aelg970mfrfl49u945sxdcnxpy0jarlw6e3w69mqz2hgnm'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '30700000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:5'
            }
          },
          operation_identifier: {
            index: 7,
            network_index: 5
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
              'DdzFFzCqrhstDQD5vuSjRKdekoa3vi4LidUiGficydiwzVnKG45M6VGPJ9gk9cBSks2bW2Z56D8Sjnb4eCPuatv2whfqSccaJXAgq8eZ'
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
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:6'
            }
          },
          operation_identifier: {
            index: 8,
            network_index: 6
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
              'addr1qyak66zrzfpzpyjlgxqvq8px9pq7yv6d5swq2npjklj05p7danyfvwce7vmcs3xwjrasjfwdcwmtffs7umhll4q6a5ks6329ee'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '100000000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:7'
            }
          },
          operation_identifier: {
            index: 9,
            network_index: 7
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
              'DdzFFzCqrht9XgLA9u4mJogj7az9Bifvv2N7Wp55nVNzAbSZ7W3JA26Mi7oN9cp5rb3xRiU9v532gLra62iz6u2AJMWW5aDyCnJPkKmc'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '129100000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:8'
            }
          },
          operation_identifier: {
            index: 10,
            network_index: 8
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
              'addr1q9wgnyk72cs8lucv47pw423x5w9kvsd9kgc4nxeqezm5kcqfxxs94l2atxx8j9qurzlhrqwsuy8lxa54ucl9lvc9uk6s8tzujw'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '249000000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:9'
            }
          },
          operation_identifier: {
            index: 11,
            network_index: 9
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
            address: 'Ae2tdPwUPEZ1q3xbW47eCkF5qfjzZcDXtwgbLzcBTmEHUQhAcKHNny4so8J'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '275676820'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:10'
            }
          },
          operation_identifier: {
            index: 12,
            network_index: 10
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
            address: 'Ae2tdPwUPEZLKaFCXCMsSUcdkLwXrQKcADvZTS6uVyRcEHuAd4zfaheyGiA'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '6599835925'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:11'
            }
          },
          operation_identifier: {
            index: 13,
            network_index: 11
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
            address: 'Ae2tdPwUPEZERHTdLkbAtFZsR9bX6pEZTKTnPXjrhmhP6upKqciidtLwHd5'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '1205183179'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:12'
            }
          },
          operation_identifier: {
            index: 14,
            network_index: 12
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
            address: 'Ae2tdPwUPEZ7N2MaFcACPvEfdEWppQd6Qs54f14yEbYhSe1tyPfWwcM4suT'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '1758931649'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:13'
            }
          },
          operation_identifier: {
            index: 15,
            network_index: 13
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
            address: 'Ae2tdPwUPEZ8k3iQhDUyrRUoe4d9idS5fAqeRq28f7tiLvmy3Udm3h1MjhV'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '168003507'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:14'
            }
          },
          operation_identifier: {
            index: 16,
            network_index: 14
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
            address: 'Ae2tdPwUPEZ5hAoue8YYo7KJ2MaxYAHnXT9eVoPsBK2KT8ase76WdVKRKe1'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '338303135'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:15'
            }
          },
          operation_identifier: {
            index: 17,
            network_index: 15
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
            address: 'Ae2tdPwUPEZLS1NUiCLD4kiLu1dcqfRqrG1rEAgGxKLHXQhby6VpbJVFUDL'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '550353640'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:16'
            }
          },
          operation_identifier: {
            index: 18,
            network_index: 16
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
            address: 'Ae2tdPwUPEZ9rjXUhdxBG5GEpvd6K2PxZ3e5TH7Pwyejy1KEmCcWko8pyWm'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '1099707280'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:17'
            }
          },
          operation_identifier: {
            index: 19,
            network_index: 17
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
            address: 'Ae2tdPwUPEZJUDau2NfX452B38q8UhJjSL4KFx5xovyuaJvzC39PPX4K5xN'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '1419431099'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:18'
            }
          },
          operation_identifier: {
            index: 20,
            network_index: 18
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
            address: 'Ae2tdPwUPEYxJCzdxyVBpRvhBtZcZJtwLPM5b48r9ZEdZzFafycRYew5VFR'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '2736781128'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:19'
            }
          },
          operation_identifier: {
            index: 21,
            network_index: 19
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
        hash: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13'
      }
    }
  }
];

export const searchLastTxWithNoFilters = [
  {
    block_identifier: {
      hash: '5f20df933584822601f9e3f8c024eb5eb252fe8cefb24d1317dc3d432e940ebb',
      index: 0
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 0
      },
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
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '927edb96f3386ab91b5f5d85d84cb4253c65b1c2f65fa7df25f81fab1d62987a:0'
            }
          },
          operation_identifier: {
            index: 0,
            network_index: 0
          },
          related_operations: [],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '927edb96f3386ab91b5f5d85d84cb4253c65b1c2f65fa7df25f81fab1d62987a'
      }
    }
  }
];

export const searchNotSucceededTx = [
  {
    block_identifier: {
      hash: '1f58250b82bc7c7c408028ba01173bdfa37fc82dde34060c5b49a3ea644d9439',
      index: 25050
    },
    transaction: {
      metadata: {
        scriptSize: 30,
        size: 352
      },
      operations: [
        {
          account: {
            address: 'addr_test1vpdvkurqk92detyluym8s6pg3gkf5nlah834rag4rntylzs9p3d0g'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-10000000'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: 'b2cf437085d433e75b273adc4efe62fffcdc7fa3d3c821d3994814301df911b0:1'
            }
          },
          operation_identifier: {
            index: 0
          },
          status: 'invalid',
          type: 'input'
        },
        {
          account: {
            address: 'addr_test1vpdvkurqk92detyluym8s6pg3gkf5nlah834rag4rntylzs9p3d0g'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '1828955'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '0c2d516c9eaf0d9f641506f1f64be3f660a49e622f4651ed1b19d6edeaefaf4c:0'
            }
          },
          operation_identifier: {
            index: 1,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'invalid',
          type: 'output'
        },
        {
          account: {
            address: 'addr_test1vpdvkurqk92detyluym8s6pg3gkf5nlah834rag4rntylzs9p3d0g'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '3000000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '0c2d516c9eaf0d9f641506f1f64be3f660a49e622f4651ed1b19d6edeaefaf4c:1'
            }
          },
          operation_identifier: {
            index: 2,
            network_index: 1
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'invalid',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '0c2d516c9eaf0d9f641506f1f64be3f660a49e622f4651ed1b19d6edeaefaf4c'
      }
    }
  }
];

export const searchTxsWithNoFiltersMaxBlock = [
  {
    block_identifier: {
      hash: '86b54dd69f404bb9656ee766e8c019dae3b5ef4ea00c04ef2e5597c9799214a8',
      index: 3337
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 212
      },
      operations: [
        {
          account: {
            address:
              'DdzFFzCqrhsszHTvbjTmYje5hehGbadkT6WgWbaqCy5XNxNttsPNF13eAjjBHYT7JaLJz2XVxiucam1EvwBRPSTiCrT4TNCBas4hfzic'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-1000000'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '6497b33b10fa2619c6efbd9f874ecd1c91badb10bf70850732aab45b90524d9e:0'
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
            address:
              'DdzFFzCqrhsm6jrC1KFcWNENb2PE171SDpg4rpaLytzVNFSsC8yGQpLggMTTSpedAKHmBUu9LtudohiHZ2zVjRKah38DVJyGVjWZoZPd'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '729106'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: 'dbd87b3876da9847c01b7f229a4126ea113cdd17494ba6b86e714b4ca1864fcd:0'
            }
          },
          operation_identifier: {
            index: 1,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        },
        {
          account: {
            address:
              'DdzFFzCqrhsqz23SkTxevzJ3Dn4ee14BpQVe5T9LX2yWJpcjHToP2qxnzaEiy5qiHwNVtX5ANXtLJyBwKz8PvjJZYq2n8fyy7Dp9RqXa'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '100000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: 'dbd87b3876da9847c01b7f229a4126ea113cdd17494ba6b86e714b4ca1864fcd:1'
            }
          },
          operation_identifier: {
            index: 2,
            network_index: 1
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: 'dbd87b3876da9847c01b7f229a4126ea113cdd17494ba6b86e714b4ca1864fcd'
      }
    }
  },
  {
    block_identifier: {
      hash: 'cf80534e520fa8f4bde1ed2f623553b8a6a9fd616d73bf9d4f7d6d1687685248',
      index: 3314
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 130
      },
      operations: [
        {
          account: {
            address: 'Ae2tdPwUPEZ3DdaWu8jn553npu6jwEPAJiahruj3xQjPXxgoxfYDWusJz7x'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-1000000'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: 'a12a839c25a01fa5d118167db5acdbd9e38172ae8f00e5ac0a4997ef792a2007:0'
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
            address:
              'DdzFFzCqrhsszHTvbjTmYje5hehGbadkT6WgWbaqCy5XNxNttsPNF13eAjjBHYT7JaLJz2XVxiucam1EvwBRPSTiCrT4TNCBas4hfzic'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '1000000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '6497b33b10fa2619c6efbd9f874ecd1c91badb10bf70850732aab45b90524d9e:0'
            }
          },
          operation_identifier: {
            index: 1,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '6497b33b10fa2619c6efbd9f874ecd1c91badb10bf70850732aab45b90524d9e'
      }
    }
  }
];

export const searchFilteredByTxHash = [
  {
    block_identifier: {
      hash: 'a5f1a0e14e1ca218fd07e1601792545945c8cb552d7978967e230d6d3b2710fd',
      index: 4490593
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 1011
      },
      operations: [
        {
          account: {
            address:
              'addr1q9xw8g2sqyam5szh4ju0389htsaaxkqg7cr7rsqzt3s7msy9vfk4g42ahjwqezem9ff97q8kqmxgcc0zc8kkcc3p6uuqu8gsl5'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-597821255'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '3e2de59aa5faa736f815a221221517f367d6aac6871ceae7b95c5208668bbaae:0'
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
            address: 'stake1u8gu2vzsk2nc6hsphudhl3p6aum7nd59ajqjg9zp00uvxcqwsdray'
          },
          metadata: {
            pool_key_hash: '8a1ab06f3a8c823b7111955c287efbe3c96ad9a68aa2359832e0bc30'
          },
          operation_identifier: {
            index: 1
          },
          status: 'success',
          type: 'stakeDelegation'
        },
        {
          account: {
            address: 'stake1uxzkym2524wme8qv3vaj55jlqrmqdnyvv83vrmtvvgsawwq8aw9xu'
          },
          metadata: {
            pool_key_hash: '8a1ab06f3a8c823b7111955c287efbe3c96ad9a68aa2359832e0bc30'
          },
          operation_identifier: {
            index: 2
          },
          status: 'success',
          type: 'stakeDelegation'
        },
        {
          account: {
            address: '8a1ab06f3a8c823b7111955c287efbe3c96ad9a68aa2359832e0bc30'
          },
          metadata: {
            depositAmount: {
              currency: {
                decimals: 6,
                symbol: 'ADA'
              },
              value: '500000000'
            },
            poolRegistrationParams: {
              cost: '340000000',
              margin_percentage: '0.042',
              pledge: '500000000',
              poolOwners: [
                'stake1uxzkym2524wme8qv3vaj55jlqrmqdnyvv83vrmtvvgsawwq8aw9xu',
                'stake1u8gu2vzsk2nc6hsphudhl3p6aum7nd59ajqjg9zp00uvxcqwsdray'
              ],
              relays: [],
              rewardAddress: 'e1d1c53050b2a78d5e01bf1b7fc43aef37e9b685ec812414417bf8c360',
              vrfKeyHash: 'd9f5cf491f19ca61c13f5706ef82c6537d73d372481077c5aa7276b0889bbcb3'
            }
          },
          operation_identifier: {
            index: 3
          },
          status: 'success',
          type: 'poolRegistration'
        },
        {
          account: {
            address:
              'addr1q9xw8g2sqyam5szh4ju0389htsaaxkqg7cr7rsqzt3s7msy9vfk4g42ahjwqezem9ff97q8kqmxgcc0zc8kkcc3p6uuqu8gsl5'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '97610698'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '51d67e194d749df2abf4e2e11cea63ca6e1c630042a366f555939e795a6ddecf:0'
            }
          },
          operation_identifier: {
            index: 4,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '51d67e194d749df2abf4e2e11cea63ca6e1c630042a366f555939e795a6ddecf'
      }
    }
  }
];

export const searchTxWithCoinFilter = [
  {
    block_identifier: {
      hash: 'b973c3f5873b89360318f1e913452948601ba526a6c5cf97e8b8929c5c78497a',
      index: 55285
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 220
      },
      operations: [
        {
          account: {
            address:
              'DdzFFzCqrhtCm14T5EnNykq5e8dGDR5vvTGZUgypDfXMS2ti8U6T6t3NfqE2gq87EKN6DMkwsqer6mZVso9LL4TsRcLuX5XNVcxEEpUv'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-40403914787416'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: 'bcc57134d1bd588b00f40142f0fdc17db5f35047e3196cdf26aa7319524c0014:0'
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
            address:
              'DdzFFzCqrht13mPij49uuAJZtfwBfrmFsDW8HdybzZGHNwUipGud9uNLW5U4JjH3C4QswFR9pJraXWAPKq65wjAXE9ndQKMTw7Mo8Du6'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '40393405036456'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '4bcf79c0c2967986749fd0ae03f5b54a712d51b35672a3d974707c060c4d8dac:0'
            }
          },
          operation_identifier: {
            index: 1,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        },
        {
          account: {
            address:
              'DdzFFzCqrhsdufpFxByLTQmktKJnTrudktaHq1nK2MAEDLXjz5kbRcr5prHi9gHb6m8pTvhgK6JbFDZA1LTiTcP6g8KuPSF1TfKP8ewp'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '10509579714'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '4bcf79c0c2967986749fd0ae03f5b54a712d51b35672a3d974707c060c4d8dac:1'
            }
          },
          operation_identifier: {
            index: 2,
            network_index: 1
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '4bcf79c0c2967986749fd0ae03f5b54a712d51b35672a3d974707c060c4d8dac'
      }
    }
  }
];

export const searchTxsWithCoinAndInvalidFilters = [
  {
    block_identifier: {
      hash: '1f58250b82bc7c7c408028ba01173bdfa37fc82dde34060c5b49a3ea644d9439',
      index: 25050
    },
    transaction: {
      metadata: {
        scriptSize: 30,
        size: 352
      },
      operations: [
        {
          account: {
            address: 'addr_test1vpdvkurqk92detyluym8s6pg3gkf5nlah834rag4rntylzs9p3d0g'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-10000000'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: 'b2cf437085d433e75b273adc4efe62fffcdc7fa3d3c821d3994814301df911b0:1'
            }
          },
          operation_identifier: {
            index: 0
          },
          status: 'invalid',
          type: 'input'
        },
        {
          account: {
            address: 'addr_test1vpdvkurqk92detyluym8s6pg3gkf5nlah834rag4rntylzs9p3d0g'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '1828955'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '0c2d516c9eaf0d9f641506f1f64be3f660a49e622f4651ed1b19d6edeaefaf4c:0'
            }
          },
          operation_identifier: {
            index: 1,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'invalid',
          type: 'output'
        },
        {
          account: {
            address: 'addr_test1vpdvkurqk92detyluym8s6pg3gkf5nlah834rag4rntylzs9p3d0g'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '3000000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '0c2d516c9eaf0d9f641506f1f64be3f660a49e622f4651ed1b19d6edeaefaf4c:1'
            }
          },
          operation_identifier: {
            index: 2,
            network_index: 1
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'invalid',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '0c2d516c9eaf0d9f641506f1f64be3f660a49e622f4651ed1b19d6edeaefaf4c'
      }
    }
  }
];

export const searchWithCurrencyFilter = [
  {
    block_identifier: {
      hash: '16d14ca745d5956021e20656175bd8b548798ea04a27d9bf5e9f2090ea200434',
      index: 5455974
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 604
      },
      operations: [
        {
          account: {
            address:
              'addr1qx5d5d8aqn0970nl3km63za5q87fwh2alm79zwuxvh6rh9lg96s8las2lwer5psc7yr59kmafzkz2l5jz4dyxghs7pvqj24sft'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-108426877'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '7e7e27545fcc7abfdcadb398c5c6a1356229698648c4747cd2c774df76e3de43:0'
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
            address:
              'addr1qx5d5d8aqn0970nl3km63za5q87fwh2alm79zwuxvh6rh9lg96s8las2lwer5psc7yr59kmafzkz2l5jz4dyxghs7pvqj24sft'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '106236428'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '909bde6249251257d56008f5a852200b47392676c23724f2fdda932c7bea5599:1'
            }
          },
          metadata: {
            tokenBundle: [
              {
                policyId: '5ee467ea4ef07b6f41d88d26ea4c872db6f47ddf27c0d7d3745462a8',
                tokens: [
                  {
                    currency: {
                      decimals: 0,
                      symbol: '4552474f'
                    },
                    value: '97614924'
                  },
                  {
                    currency: {
                      decimals: 0,
                      symbol: '7370616365636f696e73'
                    },
                    value: '999999999999'
                  }
                ]
              },
              {
                policyId: '7a8414dcb7037abcc155a8edb7d56f7a3d24fa14d57635c5fd5a185f',
                tokens: [
                  {
                    currency: {
                      decimals: 0,
                      symbol: '416461'
                    },
                    value: '44999685001'
                  },
                  {
                    currency: {
                      decimals: 0,
                      symbol: '54686973546f6b656e57696c6c53656c664465737472756374496e53657665'
                    },
                    value: '9223372036854775000'
                  }
                ]
              },
              {
                policyId: '9b9ddbada8dc9cd08509ed660d5b3a65da8f36178def7ced99fa0333',
                tokens: [
                  {
                    currency: {
                      decimals: 0,
                      symbol: '\\x'
                    },
                    value: '9223372036854775807'
                  },
                  {
                    currency: {
                      decimals: 0,
                      symbol: '4469616d6f6e64'
                    },
                    value: '998000000'
                  },
                  {
                    currency: {
                      decimals: 0,
                      symbol: '46726565646f6d546f4e6176616c6e79436f696e'
                    },
                    value: '1000000000000000001'
                  },
                  {
                    currency: {
                      decimals: 0,
                      symbol: '4c6f76656c616365'
                    },
                    value: '45000000000000000'
                  },
                  {
                    currency: {
                      decimals: 0,
                      symbol: 'd091d180d0b8d0bbd0bbd0b8d0b0d0bdd182'
                    },
                    value: '999000000'
                  }
                ]
              }
            ]
          },
          operation_identifier: {
            index: 1,
            network_index: 1
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        },
        {
          account: {
            address:
              'addr1q94qmc0nx6znagmww6yyeuuqhp9kknpj0nrxuxs4gnky02q77tvn7w6et8k6q5f6n5ew60atmstrhsskwsudtm5ef78qcp8ptw'
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
              identifier: '909bde6249251257d56008f5a852200b47392676c23724f2fdda932c7bea5599:0'
            }
          },
          metadata: {
            tokenBundle: [
              {
                policyId: 'dc5f95b6faa4c9fe5b7d064a1c4ab51b26d154b1f9151e0df4c249cf',
                tokens: [
                  {
                    currency: {
                      decimals: 0,
                      symbol: '414141'
                    },
                    value: '1000'
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
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '909bde6249251257d56008f5a852200b47392676c23724f2fdda932c7bea5599'
      }
    }
  }
];

export const searchTxWithAddressFilter = [
  {
    block_identifier: {
      hash: 'c2c6a77e1c1ce1c75043bbf468d3af1e0f6e865e01f4285535be83773ec059f8',
      index: 5406842
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 423
      },
      operations: [
        {
          account: {
            address: 'addr1vy5l62qysq3j6u4jsw0u73e8teus5x36ghd04lv0vsvqvys770xjw'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-110370442'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: 'ebef971b185237d2833e41835f0e6a3b22fcd226a2f7a4d6d924709aba414a45:0'
            }
          },
          metadata: {
            tokenBundle: [
              {
                policyId: '5d9d887de76a2c9d057b3e5d34d5411f7f8dc4d54f0c06e8ed2eb4a9',
                tokens: [
                  {
                    currency: {
                      decimals: 0,
                      symbol: '494e4459'
                    },
                    value: '-35000000000000'
                  }
                ]
              },
              {
                policyId: 'da8c30857834c6ae7203935b89278c532b3995245295456f993e1d24',
                tokens: [
                  {
                    currency: {
                      decimals: 0,
                      symbol: '4c51'
                    },
                    value: '-21000000000000'
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
            address: 'addr1vy5l62qysq3j6u4jsw0u73e8teus5x36ghd04lv0vsvqvys770xjw'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '107181709'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '00704b1801fd5efcc7a96285bf386304c8d9d0ece2a7c1565b411f303771ead8:1'
            }
          },
          metadata: {
            tokenBundle: [
              {
                policyId: '5d9d887de76a2c9d057b3e5d34d5411f7f8dc4d54f0c06e8ed2eb4a9',
                tokens: [
                  {
                    currency: {
                      decimals: 0,
                      symbol: '494e4459'
                    },
                    value: '35000000000000'
                  }
                ]
              }
            ]
          },
          operation_identifier: {
            index: 1,
            network_index: 1
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        },
        {
          account: {
            address:
              'addr1q8duxd474535f73gdthlvsgyuwyl6gjs7j0k0vsddtrtajgm54824h60t4fw0l0v9x3x830gsvta0trpxnlf42yes72q747euj'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '3000000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '00704b1801fd5efcc7a96285bf386304c8d9d0ece2a7c1565b411f303771ead8:0'
            }
          },
          metadata: {
            tokenBundle: [
              {
                policyId: 'da8c30857834c6ae7203935b89278c532b3995245295456f993e1d24',
                tokens: [
                  {
                    currency: {
                      decimals: 0,
                      symbol: '4c51'
                    },
                    value: '21000000000000'
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
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '00704b1801fd5efcc7a96285bf386304c8d9d0ece2a7c1565b411f303771ead8'
      }
    }
  },
  {
    block_identifier: {
      hash: '0cea06f7b3003a5c0efc27fff117fa9e2a08603e1b0049c3b5c719abf6a617f1',
      index: 5406810
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 478
      },
      operations: [
        {
          account: {
            address: 'addr1vy5l62qysq3j6u4jsw0u73e8teus5x36ghd04lv0vsvqvys770xjw'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-110552355'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '344c26673b9256b10e215d86095d9eb3c63def4b5a31cf50f12d4a133024eabc:0'
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
            address: 'addr1vy5l62qysq3j6u4jsw0u73e8teus5x36ghd04lv0vsvqvys770xjw'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '110370442'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: 'ebef971b185237d2833e41835f0e6a3b22fcd226a2f7a4d6d924709aba414a45:0'
            }
          },
          metadata: {
            tokenBundle: [
              {
                policyId: '5d9d887de76a2c9d057b3e5d34d5411f7f8dc4d54f0c06e8ed2eb4a9',
                tokens: [
                  {
                    currency: {
                      decimals: 0,
                      symbol: '494e4459'
                    },
                    value: '35000000000000'
                  }
                ]
              },
              {
                policyId: 'da8c30857834c6ae7203935b89278c532b3995245295456f993e1d24',
                tokens: [
                  {
                    currency: {
                      decimals: 0,
                      symbol: '4c51'
                    },
                    value: '21000000000000'
                  }
                ]
              }
            ]
          },
          operation_identifier: {
            index: 1,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: 'ebef971b185237d2833e41835f0e6a3b22fcd226a2f7a4d6d924709aba414a45'
      }
    }
  }
];

export const searchTxWithStakeAddressFilter = [
  {
    block_identifier: {
      hash: '0cea06f7b3003a5c0efc27fff117fa9e2a08603e1b0049c3b5c719abf6a617f1',
      index: 5406810
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 432
      },
      operations: [
        {
          account: {
            address:
              'addr1q85r8ym6e3x0hnca32j4ayha722ql38e9kc2m7dazph7avxv35yga0exftjepffvxtemx0vzhcpamyjtdt2ytdame62q77nhce'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-50057307872'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: 'd3b3b57a247909a54ebf8ee336a652c32a1cd4460bc49816d0ba8c27bfa5228b:1'
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
            address: 'stake1u8xg6zywhuny4evs55kr9uan8kptuq7ajf9k44z9k7aua9qevs5p3'
          },
          metadata: {
            withdrawalAmount: {
              currency: {
                decimals: 6,
                symbol: 'ADA'
              },
              value: '-185350450'
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
              'addr1qxaya4sshqsx6mhytvlkvg8rr6m3qdhysk9hln8jfa9s40uzz74jpdn3shnwd8m3qwrgr8plzr5rh5jm65526k86cvss8uhj77'
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
              identifier: 'cce9832cc6152ff5d4442263cb004b3eeb3fc39a1f96c853b6bf3be19c7bfaa6:0'
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
              'addr1qxnwun3raf38ufexn0uy0dv769yl2fhwr900gelr227yvy7v35yga0exftjepffvxtemx0vzhcpamyjtdt2ytdame62q27ct2p'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '50192483273'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: 'cce9832cc6152ff5d4442263cb004b3eeb3fc39a1f96c853b6bf3be19c7bfaa6:1'
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
        hash: 'cce9832cc6152ff5d4442263cb004b3eeb3fc39a1f96c853b6bf3be19c7bfaa6'
      }
    }
  }
];

export const searchTxWithInputFilter = [
  {
    block_identifier: {
      hash: '1c42fd317888b2aafe9f84787fdd3b90b95be06687a217cf4e6ca95130157eb5',
      index: 5593749
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 425
      },
      operations: [
        {
          account: {
            address:
              'addr1qykp6nc2u56hvymfczq48c2y9p0qeuz2gnukpydlc2y256a0l5j4psvauul469hd6x6ee5hfm0k9c5qx9rh8hhewhnhsna6nr4'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-230870712'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: 'db3852a5f62b1fb0c2ebb8a7b242254a65cdb0a4658fc28b8e4d9e8efa1e4475:0'
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
            address: 'stake1uxhl6f2scxw7w06azmkardvu6t5ahmzu2qrz3mnmmuhtemcnj3m5g'
          },
          metadata: {
            depositAmount: {
              currency: {
                decimals: 6,
                symbol: 'ADA'
              },
              value: '2000000'
            }
          },
          operation_identifier: {
            index: 1
          },
          status: 'success',
          type: 'stakeKeyRegistration'
        },
        {
          account: {
            address: 'stake1uxhl6f2scxw7w06azmkardvu6t5ahmzu2qrz3mnmmuhtemcnj3m5g'
          },
          metadata: {
            pool_key_hash: 'e594951faeec31cb8efc70c3e36887f18f8bc62c718f25ec64807dfa'
          },
          operation_identifier: {
            index: 2
          },
          status: 'success',
          type: 'stakeDelegation'
        },
        {
          account: {
            address:
              'addr1q96vp4gryxr5pw8kwvnga06wd0w00ln33knlggxqfln4mnd0l5j4psvauul469hd6x6ee5hfm0k9c5qx9rh8hhewhnhsqnzp99'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '228696455'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '5a834bd657e75babb669d3a1fae8be5034763d0cd84e6f2ec557375472326329:0'
            }
          },
          operation_identifier: {
            index: 3,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '5a834bd657e75babb669d3a1fae8be5034763d0cd84e6f2ec557375472326329'
      }
    }
  },
  {
    block_identifier: {
      hash: '1c42fd317888b2aafe9f84787fdd3b90b95be06687a217cf4e6ca95130157eb5',
      index: 5593749
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 1561
      },
      operations: [
        {
          account: {
            address: 'Ae2tdPwUPEZLu4DhbGMAPiwbfwnC5byUD3uGMDgSHd1FGVUyk33b5s2f8Km'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-17536773201'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '36059916a928966cde732699c7123c3d8e71bd96950fe91629a15e32939ca089:18'
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
            address: 'Ae2tdPwUPEZ9fjjKu2vpsQRYwgLhpRk8eFt5WNcVwKQ8YHBLSdRXeE9T6gp'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-84882690'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: 'ac53733d8f7bae6d7484dbf512430798e7216d8f74bd3f7b80e682b88de81262:14'
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
              'addr1q8su4nh2ud4gjjehkvyna0tr4h8j09p0gq2rl47mmjp9fhl6vn5gteethf632v4w6qv0rsut97gr2l2m6fyy644uh94qm83s3t'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '25000000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:0'
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
              'addr1qy2pnwjca8lge908082c63k8hcah2tl4a57l0wdsyrhkjtffuavhjefynl2pwv0mw460egjgcww83n0azgzcw98uyr8q3vgtez'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '600600000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:1'
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
        },
        {
          account: {
            address:
              'DdzFFzCqrht1ACmenXuwm12x8joxeZzCS5Jo2n8R7GcCUQQ9v34iSrNuMMa56Dadgq3Xwdgp8Bs7xh6bLZSQh7GzwRfaDURwAKJXWhvC'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '109600000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:2'
            }
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
        },
        {
          account: {
            address:
              'addr1q9l40aauqfvt5s5d4smk9zfhjr2e5u2rpdfkysfftsc2gp6u7syd7jh9k084nplwsx4hyy2ehefy8y5cd2ukckv0uazq8dm4ku'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '160000000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:3'
            }
          },
          operation_identifier: {
            index: 5,
            network_index: 3
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
            address: 'addr1vx9g6j8p4r0pcmj24tzyuedpj8fl3nwuc53zzd82n4h33wspl80tu'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '15200000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:4'
            }
          },
          operation_identifier: {
            index: 6,
            network_index: 4
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
              'addr1qyndezdwul5zl8a535l6j7z66grxufnqj8ew3lhdvchdza3xmjy6aelg970mfrfl49u945sxdcnxpy0jarlw6e3w69mqz2hgnm'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '30700000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:5'
            }
          },
          operation_identifier: {
            index: 7,
            network_index: 5
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
              'DdzFFzCqrhstDQD5vuSjRKdekoa3vi4LidUiGficydiwzVnKG45M6VGPJ9gk9cBSks2bW2Z56D8Sjnb4eCPuatv2whfqSccaJXAgq8eZ'
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
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:6'
            }
          },
          operation_identifier: {
            index: 8,
            network_index: 6
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
              'addr1qyak66zrzfpzpyjlgxqvq8px9pq7yv6d5swq2npjklj05p7danyfvwce7vmcs3xwjrasjfwdcwmtffs7umhll4q6a5ks6329ee'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '100000000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:7'
            }
          },
          operation_identifier: {
            index: 9,
            network_index: 7
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
              'DdzFFzCqrht9XgLA9u4mJogj7az9Bifvv2N7Wp55nVNzAbSZ7W3JA26Mi7oN9cp5rb3xRiU9v532gLra62iz6u2AJMWW5aDyCnJPkKmc'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '129100000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:8'
            }
          },
          operation_identifier: {
            index: 10,
            network_index: 8
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
              'addr1q9wgnyk72cs8lucv47pw423x5w9kvsd9kgc4nxeqezm5kcqfxxs94l2atxx8j9qurzlhrqwsuy8lxa54ucl9lvc9uk6s8tzujw'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '249000000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:9'
            }
          },
          operation_identifier: {
            index: 11,
            network_index: 9
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
            address: 'Ae2tdPwUPEZ1q3xbW47eCkF5qfjzZcDXtwgbLzcBTmEHUQhAcKHNny4so8J'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '275676820'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:10'
            }
          },
          operation_identifier: {
            index: 12,
            network_index: 10
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
            address: 'Ae2tdPwUPEZLKaFCXCMsSUcdkLwXrQKcADvZTS6uVyRcEHuAd4zfaheyGiA'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '6599835925'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:11'
            }
          },
          operation_identifier: {
            index: 13,
            network_index: 11
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
            address: 'Ae2tdPwUPEZERHTdLkbAtFZsR9bX6pEZTKTnPXjrhmhP6upKqciidtLwHd5'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '1205183179'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:12'
            }
          },
          operation_identifier: {
            index: 14,
            network_index: 12
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
            address: 'Ae2tdPwUPEZ7N2MaFcACPvEfdEWppQd6Qs54f14yEbYhSe1tyPfWwcM4suT'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '1758931649'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:13'
            }
          },
          operation_identifier: {
            index: 15,
            network_index: 13
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
            address: 'Ae2tdPwUPEZ8k3iQhDUyrRUoe4d9idS5fAqeRq28f7tiLvmy3Udm3h1MjhV'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '168003507'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:14'
            }
          },
          operation_identifier: {
            index: 16,
            network_index: 14
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
            address: 'Ae2tdPwUPEZ5hAoue8YYo7KJ2MaxYAHnXT9eVoPsBK2KT8ase76WdVKRKe1'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '338303135'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:15'
            }
          },
          operation_identifier: {
            index: 17,
            network_index: 15
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
            address: 'Ae2tdPwUPEZLS1NUiCLD4kiLu1dcqfRqrG1rEAgGxKLHXQhby6VpbJVFUDL'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '550353640'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:16'
            }
          },
          operation_identifier: {
            index: 18,
            network_index: 16
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
            address: 'Ae2tdPwUPEZ9rjXUhdxBG5GEpvd6K2PxZ3e5TH7Pwyejy1KEmCcWko8pyWm'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '1099707280'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:17'
            }
          },
          operation_identifier: {
            index: 19,
            network_index: 17
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
            address: 'Ae2tdPwUPEZJUDau2NfX452B38q8UhJjSL4KFx5xovyuaJvzC39PPX4K5xN'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '1419431099'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:18'
            }
          },
          operation_identifier: {
            index: 20,
            network_index: 18
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
            address: 'Ae2tdPwUPEYxJCzdxyVBpRvhBtZcZJtwLPM5b48r9ZEdZzFafycRYew5VFR'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '2736781128'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:19'
            }
          },
          operation_identifier: {
            index: 21,
            network_index: 19
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
        hash: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13'
      }
    }
  }
];

export const searchTxWithOutputFilter = [
  {
    block_identifier: {
      hash: '1c42fd317888b2aafe9f84787fdd3b90b95be06687a217cf4e6ca95130157eb5',
      index: 5593749
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 425
      },
      operations: [
        {
          account: {
            address:
              'addr1qykp6nc2u56hvymfczq48c2y9p0qeuz2gnukpydlc2y256a0l5j4psvauul469hd6x6ee5hfm0k9c5qx9rh8hhewhnhsna6nr4'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-230870712'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: 'db3852a5f62b1fb0c2ebb8a7b242254a65cdb0a4658fc28b8e4d9e8efa1e4475:0'
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
            address: 'stake1uxhl6f2scxw7w06azmkardvu6t5ahmzu2qrz3mnmmuhtemcnj3m5g'
          },
          metadata: {
            depositAmount: {
              currency: {
                decimals: 6,
                symbol: 'ADA'
              },
              value: '2000000'
            }
          },
          operation_identifier: {
            index: 1
          },
          status: 'success',
          type: 'stakeKeyRegistration'
        },
        {
          account: {
            address: 'stake1uxhl6f2scxw7w06azmkardvu6t5ahmzu2qrz3mnmmuhtemcnj3m5g'
          },
          metadata: {
            pool_key_hash: 'e594951faeec31cb8efc70c3e36887f18f8bc62c718f25ec64807dfa'
          },
          operation_identifier: {
            index: 2
          },
          status: 'success',
          type: 'stakeDelegation'
        },
        {
          account: {
            address:
              'addr1q96vp4gryxr5pw8kwvnga06wd0w00ln33knlggxqfln4mnd0l5j4psvauul469hd6x6ee5hfm0k9c5qx9rh8hhewhnhsqnzp99'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '228696455'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '5a834bd657e75babb669d3a1fae8be5034763d0cd84e6f2ec557375472326329:0'
            }
          },
          operation_identifier: {
            index: 3,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '5a834bd657e75babb669d3a1fae8be5034763d0cd84e6f2ec557375472326329'
      }
    }
  },
  {
    block_identifier: {
      hash: '1c42fd317888b2aafe9f84787fdd3b90b95be06687a217cf4e6ca95130157eb5',
      index: 5593749
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 1561
      },
      operations: [
        {
          account: {
            address: 'Ae2tdPwUPEZLu4DhbGMAPiwbfwnC5byUD3uGMDgSHd1FGVUyk33b5s2f8Km'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-17536773201'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '36059916a928966cde732699c7123c3d8e71bd96950fe91629a15e32939ca089:18'
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
            address: 'Ae2tdPwUPEZ9fjjKu2vpsQRYwgLhpRk8eFt5WNcVwKQ8YHBLSdRXeE9T6gp'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-84882690'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: 'ac53733d8f7bae6d7484dbf512430798e7216d8f74bd3f7b80e682b88de81262:14'
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
              'addr1q8su4nh2ud4gjjehkvyna0tr4h8j09p0gq2rl47mmjp9fhl6vn5gteethf632v4w6qv0rsut97gr2l2m6fyy644uh94qm83s3t'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '25000000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:0'
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
              'addr1qy2pnwjca8lge908082c63k8hcah2tl4a57l0wdsyrhkjtffuavhjefynl2pwv0mw460egjgcww83n0azgzcw98uyr8q3vgtez'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '600600000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:1'
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
        },
        {
          account: {
            address:
              'DdzFFzCqrht1ACmenXuwm12x8joxeZzCS5Jo2n8R7GcCUQQ9v34iSrNuMMa56Dadgq3Xwdgp8Bs7xh6bLZSQh7GzwRfaDURwAKJXWhvC'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '109600000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:2'
            }
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
        },
        {
          account: {
            address:
              'addr1q9l40aauqfvt5s5d4smk9zfhjr2e5u2rpdfkysfftsc2gp6u7syd7jh9k084nplwsx4hyy2ehefy8y5cd2ukckv0uazq8dm4ku'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '160000000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:3'
            }
          },
          operation_identifier: {
            index: 5,
            network_index: 3
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
            address: 'addr1vx9g6j8p4r0pcmj24tzyuedpj8fl3nwuc53zzd82n4h33wspl80tu'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '15200000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:4'
            }
          },
          operation_identifier: {
            index: 6,
            network_index: 4
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
              'addr1qyndezdwul5zl8a535l6j7z66grxufnqj8ew3lhdvchdza3xmjy6aelg970mfrfl49u945sxdcnxpy0jarlw6e3w69mqz2hgnm'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '30700000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:5'
            }
          },
          operation_identifier: {
            index: 7,
            network_index: 5
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
              'DdzFFzCqrhstDQD5vuSjRKdekoa3vi4LidUiGficydiwzVnKG45M6VGPJ9gk9cBSks2bW2Z56D8Sjnb4eCPuatv2whfqSccaJXAgq8eZ'
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
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:6'
            }
          },
          operation_identifier: {
            index: 8,
            network_index: 6
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
              'addr1qyak66zrzfpzpyjlgxqvq8px9pq7yv6d5swq2npjklj05p7danyfvwce7vmcs3xwjrasjfwdcwmtffs7umhll4q6a5ks6329ee'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '100000000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:7'
            }
          },
          operation_identifier: {
            index: 9,
            network_index: 7
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
              'DdzFFzCqrht9XgLA9u4mJogj7az9Bifvv2N7Wp55nVNzAbSZ7W3JA26Mi7oN9cp5rb3xRiU9v532gLra62iz6u2AJMWW5aDyCnJPkKmc'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '129100000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:8'
            }
          },
          operation_identifier: {
            index: 10,
            network_index: 8
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
              'addr1q9wgnyk72cs8lucv47pw423x5w9kvsd9kgc4nxeqezm5kcqfxxs94l2atxx8j9qurzlhrqwsuy8lxa54ucl9lvc9uk6s8tzujw'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '249000000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:9'
            }
          },
          operation_identifier: {
            index: 11,
            network_index: 9
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
            address: 'Ae2tdPwUPEZ1q3xbW47eCkF5qfjzZcDXtwgbLzcBTmEHUQhAcKHNny4so8J'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '275676820'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:10'
            }
          },
          operation_identifier: {
            index: 12,
            network_index: 10
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
            address: 'Ae2tdPwUPEZLKaFCXCMsSUcdkLwXrQKcADvZTS6uVyRcEHuAd4zfaheyGiA'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '6599835925'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:11'
            }
          },
          operation_identifier: {
            index: 13,
            network_index: 11
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
            address: 'Ae2tdPwUPEZERHTdLkbAtFZsR9bX6pEZTKTnPXjrhmhP6upKqciidtLwHd5'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '1205183179'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:12'
            }
          },
          operation_identifier: {
            index: 14,
            network_index: 12
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
            address: 'Ae2tdPwUPEZ7N2MaFcACPvEfdEWppQd6Qs54f14yEbYhSe1tyPfWwcM4suT'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '1758931649'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:13'
            }
          },
          operation_identifier: {
            index: 15,
            network_index: 13
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
            address: 'Ae2tdPwUPEZ8k3iQhDUyrRUoe4d9idS5fAqeRq28f7tiLvmy3Udm3h1MjhV'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '168003507'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:14'
            }
          },
          operation_identifier: {
            index: 16,
            network_index: 14
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
            address: 'Ae2tdPwUPEZ5hAoue8YYo7KJ2MaxYAHnXT9eVoPsBK2KT8ase76WdVKRKe1'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '338303135'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:15'
            }
          },
          operation_identifier: {
            index: 17,
            network_index: 15
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
            address: 'Ae2tdPwUPEZLS1NUiCLD4kiLu1dcqfRqrG1rEAgGxKLHXQhby6VpbJVFUDL'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '550353640'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:16'
            }
          },
          operation_identifier: {
            index: 18,
            network_index: 16
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
            address: 'Ae2tdPwUPEZ9rjXUhdxBG5GEpvd6K2PxZ3e5TH7Pwyejy1KEmCcWko8pyWm'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '1099707280'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:17'
            }
          },
          operation_identifier: {
            index: 19,
            network_index: 17
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
            address: 'Ae2tdPwUPEZJUDau2NfX452B38q8UhJjSL4KFx5xovyuaJvzC39PPX4K5xN'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '1419431099'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:18'
            }
          },
          operation_identifier: {
            index: 20,
            network_index: 18
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
            address: 'Ae2tdPwUPEYxJCzdxyVBpRvhBtZcZJtwLPM5b48r9ZEdZzFafycRYew5VFR'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '2736781128'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13:19'
            }
          },
          operation_identifier: {
            index: 21,
            network_index: 19
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
        hash: '22bf5dfcb4d867780c0d094ab1a2dce89a9dec17e11b8f4924f2969596295b13'
      }
    }
  }
];

export const searchTxWithPoolRetirementFilter = [
  {
    block_identifier: {
      hash: 'ddb008b4a1cad00db90f524b5ba94da94f84b2aabe7de6ff4a0d27d89ed222dd',
      index: 4491210
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 365
      },
      operations: [
        {
          account: {
            address:
              'addr1q94g4wsgtm6hsxlcafvvt6fyprqtlwnme372sndfphlulyxn8j47n0r6werzg0qr7p3gs8gxw39n65uc8q330ztnhxcq9x6600'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-51047025535'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: 'e1d1d61ecd706790ee31a1c07fc87827f7b9738d374ef705d1c8cff8295c8cf0:0'
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
            address: '469fbad36a8a68c5f62f3505ecbe6a461ea262ae20b4de8d39ff08ab'
          },
          metadata: {
            epoch: 209
          },
          operation_identifier: {
            index: 1
          },
          status: 'success',
          type: 'poolRetirement'
        },
        {
          account: {
            address:
              'addr1q94g4wsgtm6hsxlcafvvt6fyprqtlwnme372sndfphlulyxn8j47n0r6werzg0qr7p3gs8gxw39n65uc8q330ztnhxcq9x6600'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '51046846482'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '896cf8fefad1eaf0fa056ba3adf28bfb26b06d1beed64cf790deb595dcb2687a:0'
            }
          },
          operation_identifier: {
            index: 2,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '896cf8fefad1eaf0fa056ba3adf28bfb26b06d1beed64cf790deb595dcb2687a'
      }
    }
  }
];

export const searchTxWithPoolRegistrationFilter = [
  {
    block_identifier: {
      hash: '95da0614ded8ab3aa8e86b11516573c5c729bd80611994ebc698dd2fcdd03bd1',
      index: 4619221
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 706
      },
      operations: [
        {
          account: {
            address:
              'addr1q982v3wlyagj92q4d7qxjzrlcdkyr3ln2lj8lhhq608vced7x5kmkl8ezct3r72g7hdds37ekzfjrmkfk7prxdnjx6xs2c8ryp'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-150096644813'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '1b3a8d7a386b7752d2e6a48a6538f12a63c37006c3879c00f6cbf7ad48f89f45:0'
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
            address: '86d56db6754947d5c6dfd788568c189cc188d448aa6bc4ee634f655a'
          },
          metadata: {
            depositAmount: {
              currency: {
                decimals: 6,
                symbol: 'ADA'
              },
              value: '500000000'
            },
            poolRegistrationParams: {
              cost: '340000000',
              margin_percentage: '0',
              pledge: '150000000000',
              poolOwners: ['stake1uxlr2tdm0nu3v9c3l9y0tkkcglvmpyepamym0q3nxeerdrgcp9wak'],
              relays: [],
              rewardAddress: 'e1be352dbb7cf9161711f948f5dad847d9b09321eec9b782333672368d',
              vrfKeyHash: '6cde8a370e264ba8ef9a8a25c50cc7d62ae28bcbad46bc3811ba191521599ddc'
            }
          },
          operation_identifier: {
            index: 1
          },
          status: 'success',
          type: 'poolRegistration'
        },
        {
          account: {
            address:
              'addr1q982v3wlyagj92q4d7qxjzrlcdkyr3ln2lj8lhhq608vced7x5kmkl8ezct3r72g7hdds37ekzfjrmkfk7prxdnjx6xs2c8ryp'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '150096449128'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '3d88304fb708852098e46bdcbe9c783aee573e36c7237d8af305334d7ff0bffe:0'
            }
          },
          operation_identifier: {
            index: 2,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '3d88304fb708852098e46bdcbe9c783aee573e36c7237d8af305334d7ff0bffe'
      }
    }
  },
  {
    block_identifier: {
      hash: '8839b697618eb1b3167bcd2658e10008d9c1d11bd32b305abf497371cd79dafa',
      index: 4597779
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 723
      },
      operations: [
        {
          account: {
            address:
              'addr1q9wm6dpp9zgund873xluc5wzz3z8dqf04uxvnnafa9tc834sp4f25adz7r8sgwkq3g473htcsramrcwh25twnew0hf2sfma70k'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-52425749'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: 'cda78e5074d4e7d9de0cfb5c4b503b02426d545d7d639e8b287f5be3a58e15cb:0'
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
            address: 'stake1uxcq6542wk30pncy8tqg52lgm4ugp7a3u8t429hfuh8m54gs72zj8'
          },
          metadata: {
            pool_key_hash: '15a500a4ae7a375347deaf879a65d54a481de9073005734b3c85fdf3'
          },
          operation_identifier: {
            index: 1
          },
          status: 'success',
          type: 'stakeDelegation'
        },
        {
          account: {
            address: '15a500a4ae7a375347deaf879a65d54a481de9073005734b3c85fdf3'
          },
          metadata: {
            depositAmount: {
              currency: {
                decimals: 6,
                symbol: 'ADA'
              },
              value: '500000000'
            },
            poolRegistrationParams: {
              cost: '340000000',
              margin_percentage: '0.005',
              pledge: '50000000',
              poolOwners: ['stake1uxcq6542wk30pncy8tqg52lgm4ugp7a3u8t429hfuh8m54gs72zj8'],
              relays: [],
              rewardAddress: 'e1b00d52aa75a2f0cf043ac08a2be8dd7880fbb1e1d75516e9e5cfba55',
              vrfKeyHash: '38ee540c8ed10762b6a43ed4a3c3094c1ac76b3ad838c341e3cb92174db4b4d6'
            }
          },
          operation_identifier: {
            index: 2
          },
          status: 'success',
          type: 'poolRegistration'
        },
        {
          account: {
            address:
              'addr1q9wm6dpp9zgund873xluc5wzz3z8dqf04uxvnnafa9tc834sp4f25adz7r8sgwkq3g473htcsramrcwh25twnew0hf2sfma70k'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '52229492'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '29a76dd58c6309cd9cde855c0c50d81d63f921959359b1e544401ac1dbc9b472:0'
            }
          },
          operation_identifier: {
            index: 3,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '29a76dd58c6309cd9cde855c0c50d81d63f921959359b1e544401ac1dbc9b472'
      }
    }
  }
];

export const searchTxWithDeregistrationFilter = [
  {
    block_identifier: {
      hash: '185107d5ecd969cb4961949ab279703476dbc668f833f80a2d075a9c2d1e80cc',
      index: 5406841
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 399
      },
      operations: [
        {
          account: {
            address:
              'addr1qxswljx9lr59eentu7s8y5jz27j2vljg4hycct6cetf5al0j9td2t4sk87hkmvgzeccfagup4k449665add5afsp3kxsralm4e'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-173179224'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: 'f60a241698f7cab91c7e41df1190b0fde12c54dd5c627050fd09e79d14c9be69:0'
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
            address: 'stake1u8ez4k496ctrltmdkypvuvy75wq6m26jad2wkk6w5cqcmrgevll3r'
          },
          metadata: {
            withdrawalAmount: {
              currency: {
                decimals: 6,
                symbol: 'ADA'
              },
              value: '-242063'
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
            address: 'stake1u8ez4k496ctrltmdkypvuvy75wq6m26jad2wkk6w5cqcmrgevll3r'
          },
          metadata: {
            refundAmount: {
              currency: {
                decimals: 6,
                symbol: 'ADA'
              },
              value: '-2000000'
            }
          },
          operation_identifier: {
            index: 2
          },
          status: 'success',
          type: 'stakeKeyDeregistration'
        },
        {
          account: {
            address:
              'addr1q87mz3a88qf920qc7cjw0ctstfrrsalswuqcms3h3rvqrs8j9td2t4sk87hkmvgzeccfagup4k449665add5afsp3kxsj80ej8'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '175247998'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '71667f9e0350a1fd9e5420043a41048f2895f2fd1bceeb2ffc3fa14382db50cd:0'
            }
          },
          operation_identifier: {
            index: 3,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            },
            {
              index: 1
            },
            {
              index: 2
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '71667f9e0350a1fd9e5420043a41048f2895f2fd1bceeb2ffc3fa14382db50cd'
      }
    }
  },
  {
    block_identifier: {
      hash: '6713e3dbea2a037f0be9401744a8b2be4c6190294a23c496165c212972a82f61',
      index: 4853177
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 365
      },
      operations: [
        {
          account: {
            address:
              'addr1qyzstdwf29wpp3fmsmhxe3nks0x2lzs9c6ka553r5lans9wyn8dwr235e08njhkc5pn8unfx68d7pyq0jtq483vt0zls4nn77q'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-7126681496'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '820dd7d6b167458348aa0a58a4af39709e464ec7ef1068dee2261fb7b609b605:0'
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
            address: 'stake1u8zfnkhp4g6vhneetmv2qen7f5ndrklqjq8e9s2nck9h30cfz6qmp'
          },
          metadata: {
            refundAmount: {
              currency: {
                decimals: 6,
                symbol: 'ADA'
              },
              value: '-2000000'
            }
          },
          operation_identifier: {
            index: 1
          },
          status: 'success',
          type: 'stakeKeyDeregistration'
        },
        {
          account: {
            address:
              'addr1qy30ge0rzd6x0frea6hfdv7suy40psqr8lprct9x7h9yj87yn8dwr235e08njhkc5pn8unfx68d7pyq0jtq483vt0zls4jy0m3'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '7128509879'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '5fe53eece38ff4eb102c33c6cbdf34947c8232eefaae0731fdf8f746b81763fc:0'
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
        }
      ],
      transaction_identifier: {
        hash: '5fe53eece38ff4eb102c33c6cbdf34947c8232eefaae0731fdf8f746b81763fc'
      }
    }
  }
];

export const searchTxWithDelegationFilter = [
  {
    block_identifier: {
      hash: '1c42fd317888b2aafe9f84787fdd3b90b95be06687a217cf4e6ca95130157eb5',
      index: 5593749
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 425
      },
      operations: [
        {
          account: {
            address:
              'addr1qykp6nc2u56hvymfczq48c2y9p0qeuz2gnukpydlc2y256a0l5j4psvauul469hd6x6ee5hfm0k9c5qx9rh8hhewhnhsna6nr4'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-230870712'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: 'db3852a5f62b1fb0c2ebb8a7b242254a65cdb0a4658fc28b8e4d9e8efa1e4475:0'
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
            address: 'stake1uxhl6f2scxw7w06azmkardvu6t5ahmzu2qrz3mnmmuhtemcnj3m5g'
          },
          metadata: {
            depositAmount: {
              currency: {
                decimals: 6,
                symbol: 'ADA'
              },
              value: '2000000'
            }
          },
          operation_identifier: {
            index: 1
          },
          status: 'success',
          type: 'stakeKeyRegistration'
        },
        {
          account: {
            address: 'stake1uxhl6f2scxw7w06azmkardvu6t5ahmzu2qrz3mnmmuhtemcnj3m5g'
          },
          metadata: {
            pool_key_hash: 'e594951faeec31cb8efc70c3e36887f18f8bc62c718f25ec64807dfa'
          },
          operation_identifier: {
            index: 2
          },
          status: 'success',
          type: 'stakeDelegation'
        },
        {
          account: {
            address:
              'addr1q96vp4gryxr5pw8kwvnga06wd0w00ln33knlggxqfln4mnd0l5j4psvauul469hd6x6ee5hfm0k9c5qx9rh8hhewhnhsqnzp99'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '228696455'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '5a834bd657e75babb669d3a1fae8be5034763d0cd84e6f2ec557375472326329:0'
            }
          },
          operation_identifier: {
            index: 3,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '5a834bd657e75babb669d3a1fae8be5034763d0cd84e6f2ec557375472326329'
      }
    }
  },
  {
    block_identifier: {
      hash: '1c42fd317888b2aafe9f84787fdd3b90b95be06687a217cf4e6ca95130157eb5',
      index: 5593749
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 425
      },
      operations: [
        {
          account: {
            address:
              'addr1q8vumw49ntq6ytgftdgrqvyju4h7d4mnd20mjc7s54cm62tptymqr8crjekwdszl7p3a2pjkj2k6d0g44d73lk45rwxqgrhtfy'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-499400000'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: 'a00ee222edf834e90800373e89131c736b5fbd6d6a1e1171e892a4927a62101f:0'
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
            address: 'stake1u9s4jdspnupevm8xcp0lqc74qetf9tdxh526klglm26phrqm460am'
          },
          metadata: {
            depositAmount: {
              currency: {
                decimals: 6,
                symbol: 'ADA'
              },
              value: '2000000'
            }
          },
          operation_identifier: {
            index: 1
          },
          status: 'success',
          type: 'stakeKeyRegistration'
        },
        {
          account: {
            address: 'stake1u9s4jdspnupevm8xcp0lqc74qetf9tdxh526klglm26phrqm460am'
          },
          metadata: {
            pool_key_hash: 'd7513627b3d50819c1c84687bfd15f02f00cd11c37d7935a67540089'
          },
          operation_identifier: {
            index: 2
          },
          status: 'success',
          type: 'stakeDelegation'
        },
        {
          account: {
            address:
              'addr1qxvtxefplfvkkvt8sdwccljgkp7u7n4r427p5efa4hc8uarptymqr8crjekwdszl7p3a2pjkj2k6d0g44d73lk45rwxq9v62r2'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '497224863'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: 'fe34da4ea3558fb73f8ff8bcfd26b81bb0aa35150797d34cb007a2e0d3776868:0'
            }
          },
          operation_identifier: {
            index: 3,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: 'fe34da4ea3558fb73f8ff8bcfd26b81bb0aa35150797d34cb007a2e0d3776868'
      }
    }
  }
];

export const searchTxWithKeyRegistrationFilter = [
  {
    block_identifier: {
      hash: '1c42fd317888b2aafe9f84787fdd3b90b95be06687a217cf4e6ca95130157eb5',
      index: 5593749
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 425
      },
      operations: [
        {
          account: {
            address:
              'addr1qykp6nc2u56hvymfczq48c2y9p0qeuz2gnukpydlc2y256a0l5j4psvauul469hd6x6ee5hfm0k9c5qx9rh8hhewhnhsna6nr4'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-230870712'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: 'db3852a5f62b1fb0c2ebb8a7b242254a65cdb0a4658fc28b8e4d9e8efa1e4475:0'
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
            address: 'stake1uxhl6f2scxw7w06azmkardvu6t5ahmzu2qrz3mnmmuhtemcnj3m5g'
          },
          metadata: {
            depositAmount: {
              currency: {
                decimals: 6,
                symbol: 'ADA'
              },
              value: '2000000'
            }
          },
          operation_identifier: {
            index: 1
          },
          status: 'success',
          type: 'stakeKeyRegistration'
        },
        {
          account: {
            address: 'stake1uxhl6f2scxw7w06azmkardvu6t5ahmzu2qrz3mnmmuhtemcnj3m5g'
          },
          metadata: {
            pool_key_hash: 'e594951faeec31cb8efc70c3e36887f18f8bc62c718f25ec64807dfa'
          },
          operation_identifier: {
            index: 2
          },
          status: 'success',
          type: 'stakeDelegation'
        },
        {
          account: {
            address:
              'addr1q96vp4gryxr5pw8kwvnga06wd0w00ln33knlggxqfln4mnd0l5j4psvauul469hd6x6ee5hfm0k9c5qx9rh8hhewhnhsqnzp99'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '228696455'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '5a834bd657e75babb669d3a1fae8be5034763d0cd84e6f2ec557375472326329:0'
            }
          },
          operation_identifier: {
            index: 3,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '5a834bd657e75babb669d3a1fae8be5034763d0cd84e6f2ec557375472326329'
      }
    }
  },
  {
    block_identifier: {
      hash: '1c42fd317888b2aafe9f84787fdd3b90b95be06687a217cf4e6ca95130157eb5',
      index: 5593749
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 425
      },
      operations: [
        {
          account: {
            address:
              'addr1q8vumw49ntq6ytgftdgrqvyju4h7d4mnd20mjc7s54cm62tptymqr8crjekwdszl7p3a2pjkj2k6d0g44d73lk45rwxqgrhtfy'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-499400000'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: 'a00ee222edf834e90800373e89131c736b5fbd6d6a1e1171e892a4927a62101f:0'
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
            address: 'stake1u9s4jdspnupevm8xcp0lqc74qetf9tdxh526klglm26phrqm460am'
          },
          metadata: {
            depositAmount: {
              currency: {
                decimals: 6,
                symbol: 'ADA'
              },
              value: '2000000'
            }
          },
          operation_identifier: {
            index: 1
          },
          status: 'success',
          type: 'stakeKeyRegistration'
        },
        {
          account: {
            address: 'stake1u9s4jdspnupevm8xcp0lqc74qetf9tdxh526klglm26phrqm460am'
          },
          metadata: {
            pool_key_hash: 'd7513627b3d50819c1c84687bfd15f02f00cd11c37d7935a67540089'
          },
          operation_identifier: {
            index: 2
          },
          status: 'success',
          type: 'stakeDelegation'
        },
        {
          account: {
            address:
              'addr1qxvtxefplfvkkvt8sdwccljgkp7u7n4r427p5efa4hc8uarptymqr8crjekwdszl7p3a2pjkj2k6d0g44d73lk45rwxq9v62r2'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '497224863'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: 'fe34da4ea3558fb73f8ff8bcfd26b81bb0aa35150797d34cb007a2e0d3776868:0'
            }
          },
          operation_identifier: {
            index: 3,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: 'fe34da4ea3558fb73f8ff8bcfd26b81bb0aa35150797d34cb007a2e0d3776868'
      }
    }
  }
];

export const searchTxWithVoteRegistrationFilter = [
  {
    block_identifier: {
      hash: '1c42fd317888b2aafe9f84787fdd3b90b95be06687a217cf4e6ca95130157eb5',
      index: 5593749
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 470
      },
      operations: [
        {
          account: {
            address:
              'addr1q85lqccktlt8j08g58jesjk3gwe9p0eyvxtl77lqaacuf6uvcjwuayent36vkw403c8hat9csyawfgg88qlwweyeshnq4d22p8'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-1123600000'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '02a1441419ebbe583139c1662351d4f3724e5d9ea3aef4e12c90edb0d5c5f2f5:23'
            }
          },
          operation_identifier: {
            index: 0
          },
          status: 'success',
          type: 'input'
        },
        {
          metadata: {
            voteRegistrationMetadata: {
              rewardAddress:
                'addr1q9nr7yuhzsmmdchsjacuqef5cnlajk2s4j2rjre5uzgmtw5vcjwuayent36vkw403c8hat9csyawfgg88qlwweyeshnqsh9r5q',
              stakeKey: {
                curve_type: 'edwards25519',
                hex_bytes: '56f29f391a3bb5ff90637b2d2d0a32590214871284b0577e4671b0c1a83f79ba'
              },
              votingKey: {
                curve_type: 'edwards25519',
                hex_bytes: '8bcec4282239b2cc1a7d8bb294c154c849fc200c7ebd27ef45e610d849bc302a'
              },
              votingNonce: 26912766,
              votingSignature:
                'f75f7a54a79352f9d0e2c4de4e8ded8ae9304fa0f3b021754f8d149c90c7b01e1c6bbfdd623c294d82f5e5cbbfc0bd6fd1c674780db4025446e2eafc87f61b0a'
            }
          },
          operation_identifier: {
            index: 1
          },
          status: 'success',
          type: 'voteRegistration'
        },
        {
          account: {
            address:
              'addr1q9nr7yuhzsmmdchsjacuqef5cnlajk2s4j2rjre5uzgmtw5vcjwuayent36vkw403c8hat9csyawfgg88qlwweyeshnqsh9r5q'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '1123423763'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: 'adeb7b6845f3f4b0e74275588412cf00912b615e4bbf76d111326ce899260c59:0'
            }
          },
          operation_identifier: {
            index: 2,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: 'adeb7b6845f3f4b0e74275588412cf00912b615e4bbf76d111326ce899260c59'
      }
    }
  },
  {
    block_identifier: {
      hash: '56b40fff73f4a3bc946b516d507b822eb92781f67327bc7bb6f46a08dd5dfdf0',
      index: 5412127
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 535
      },
      operations: [
        {
          account: {
            address:
              'addr1qxqxphm80tt8yyu25cy3w6k45kcmhy0ec8wtds57vy7jnwl3vdnqjcaf0s2xxaupf67k50pgulcujcyh20l8vx2x92ms609ga6'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-22620000000'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '9ded65803caa08ab0805e566f504cb5f2a1e078e6e2d94816cfcf69e77b94d06:0'
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
            address:
              'addr1q9x3j88pwufrnttdcaft9rnsmxnjnvlck064l905ul3hmkh3vdnqjcaf0s2xxaupf67k50pgulcujcyh20l8vx2x92msk33lpr'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '1000000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '06aa4452446ddbd0773694bfe4f5d2ba2faa05bbf96ae318f115ca3633cc30d1:0'
            }
          },
          operation_identifier: {
            index: 1,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        },
        {
          account: {
            address:
              'addr1qyvgatmpv9g2q4wnjkl5eqhcy62vl39lr3vattj3wk5aqvl3vdnqjcaf0s2xxaupf67k50pgulcujcyh20l8vx2x92ms2e8d94'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '22618820639'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '06aa4452446ddbd0773694bfe4f5d2ba2faa05bbf96ae318f115ca3633cc30d1:1'
            }
          },
          operation_identifier: {
            index: 2,
            network_index: 1
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '06aa4452446ddbd0773694bfe4f5d2ba2faa05bbf96ae318f115ca3633cc30d1'
      }
    }
  }
];

export const searchTxWithWithdrawalFilter = [
  {
    block_identifier: {
      hash: '1c42fd317888b2aafe9f84787fdd3b90b95be06687a217cf4e6ca95130157eb5',
      index: 5593749
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 1052
      },
      operations: [
        {
          account: {
            address:
              'addr1qx7txedkynq05a05njrjd8zt338hnszlwtq97ryj0qrqkqwev9w5eyympgrz8z4crswkp6p996z0xg2ke3e5aayrfgzsdfk3md'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-1452600000'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '2738cadcc287ffac43c9c9cd9582dba9c925045f0524d1e501f8571f28d1c1f5:6'
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
            address:
              'addr1q8xytv7wctdhgyh5x59jm3mz7k902zvj66t7mgtxatr5jf7ev9w5eyympgrz8z4crswkp6p996z0xg2ke3e5aayrfgzss96gxv'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-5443165300'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '4605a60e310cdd9e342803ad2cd9bc02cfd7c8d685dae26b4aac80564ab92b4a:1'
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
              'addr1q9qkqd2306jex3unghnym9r6q942e9uz86ykcplxx4dqj97ev9w5eyympgrz8z4crswkp6p996z0xg2ke3e5aayrfgzsqjruem'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-1000000'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '4e92f35f503000b0c590082e14854f5de3c5fa7b42c324c5fa49b92469a1de2f:0'
            }
          },
          operation_identifier: {
            index: 2
          },
          status: 'success',
          type: 'input'
        },
        {
          account: {
            address:
              'addr1q882qg9u95l7583nl776ct9zpzky4ed2es3c93xf9880sgxev9w5eyympgrz8z4crswkp6p996z0xg2ke3e5aayrfgzscf2w96'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-920442797'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: 'c269d569ae6f49eaec29409b21c08d5c11a0863d2369feaffca2bac1ebace034:0'
            }
          },
          operation_identifier: {
            index: 3
          },
          status: 'success',
          type: 'input'
        },
        {
          account: {
            address:
              'addr1qy9lg39lq2vlqsqnmuccka8pemu4gpvp5v87f89z534rqjwev9w5eyympgrz8z4crswkp6p996z0xg2ke3e5aayrfgzsn6xrew'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-7340346878'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: 'c9e2346bca8f1ccceab7b5e72e128387f4ce734cd203da032d547a6c09dbdb49:0'
            }
          },
          operation_identifier: {
            index: 4
          },
          status: 'success',
          type: 'input'
        },
        {
          account: {
            address:
              'addr1qysa928dr3xynv93ttflqyzsdwttzuz38hvngruaed59rn7ev9w5eyympgrz8z4crswkp6p996z0xg2ke3e5aayrfgzsgycpjf'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-1620800000'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: 'd5777b6cceda80120f4ad56d59f4ca17d2c41b6ed16aea406bbed02fe133c16e:3'
            }
          },
          operation_identifier: {
            index: 5
          },
          status: 'success',
          type: 'input'
        },
        {
          account: {
            address: 'stake1u8vkzh2vjzds5p3r32upc8tqaqjjap8ny9tvcu6w7jp55pgytnwrm'
          },
          metadata: {
            withdrawalAmount: {
              currency: {
                decimals: 6,
                symbol: 'ADA'
              },
              value: '-160072205'
            }
          },
          operation_identifier: {
            index: 6
          },
          status: 'success',
          type: 'withdrawal'
        },
        {
          account: {
            address:
              'addr1qxsx8txkdkun44ehv4jgr56mj086wk3yzx5xnnujjmwnydepmfr4zdytlw5t386tgf4ncszvvw0yv76fma882r9uqjjsrx00ke'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '16938000000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '20169bd247c2f6f46a0fe278d76a54132a03915a3f6bd8b7b5fad526a7020f28:0'
            }
          },
          operation_identifier: {
            index: 7,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            },
            {
              index: 1
            },
            {
              index: 2
            },
            {
              index: 3
            },
            {
              index: 4
            },
            {
              index: 5
            },
            {
              index: 6
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '20169bd247c2f6f46a0fe278d76a54132a03915a3f6bd8b7b5fad526a7020f28'
      }
    }
  },
  {
    block_identifier: {
      hash: '1c42fd317888b2aafe9f84787fdd3b90b95be06687a217cf4e6ca95130157eb5',
      index: 5593749
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 569
      },
      operations: [
        {
          account: {
            address:
              'addr1q84z64dvkyeu8hz4dq8l2gpd4zjnt50zxqq9yz3krn27pw029426evfnc0w926q075szm299xhg7yvqq2g9rv8x4uzuskt47hv'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-1000000'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '67726be7d603e0b4a528a0d519572eec3458fc7f0472f204bfa0baf5f2fec4e2:0'
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
            address:
              'addr1q84z64dvkyeu8hz4dq8l2gpd4zjnt50zxqq9yz3krn27pw029426evfnc0w926q075szm299xhg7yvqq2g9rv8x4uzuskt47hv'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-13854321488'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '67726be7d603e0b4a528a0d519572eec3458fc7f0472f204bfa0baf5f2fec4e2:1'
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
            address: 'stake1u84z64dvkyeu8hz4dq8l2gpd4zjnt50zxqq9yz3krn27pwg5gqa35'
          },
          metadata: {
            withdrawalAmount: {
              currency: {
                decimals: 6,
                symbol: 'ADA'
              },
              value: '-44204464'
            }
          },
          operation_identifier: {
            index: 2
          },
          status: 'success',
          type: 'withdrawal'
        },
        {
          account: {
            address:
              'addr1q84z64dvkyeu8hz4dq8l2gpd4zjnt50zxqq9yz3krn27pw029426evfnc0w926q075szm299xhg7yvqq2g9rv8x4uzuskt47hv'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '1000000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '8da175d25643e4fd444a7b606cd2949e3e9d2ba8f02e8828eaf16b179eb5dafe:0'
            }
          },
          operation_identifier: {
            index: 3,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            },
            {
              index: 1
            },
            {
              index: 2
            }
          ],
          status: 'success',
          type: 'output'
        },
        {
          account: {
            address:
              'addr1q84z64dvkyeu8hz4dq8l2gpd4zjnt50zxqq9yz3krn27pw029426evfnc0w926q075szm299xhg7yvqq2g9rv8x4uzuskt47hv'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '13898333348'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '8da175d25643e4fd444a7b606cd2949e3e9d2ba8f02e8828eaf16b179eb5dafe:1'
            }
          },
          operation_identifier: {
            index: 4,
            network_index: 1
          },
          related_operations: [
            {
              index: 0
            },
            {
              index: 1
            },
            {
              index: 2
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '8da175d25643e4fd444a7b606cd2949e3e9d2ba8f02e8828eaf16b179eb5dafe'
      }
    }
  }
];

export const searchTxWithInputBlockFilter = [
  {
    block_identifier: {
      hash: '16d14ca745d5956021e20656175bd8b548798ea04a27d9bf5e9f2090ea200434',
      index: 5455974
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 344
      },
      operations: [
        {
          account: {
            address:
              'addr1qyjremem252naeh63269z7uwpmhdg4vn3lsvacq36gv3zs5ljlt0lr2hguzn0u4s898vk82tet25c52rj44ursutvu9qm43ejp'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-31516699'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: 'eae640a040ceec6cdb552af6eae8eaaa850bfc2180313036e95dae84ede5ae04:1'
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
            address:
              'DdzFFzCqrhtCHcauyVkWgEcSQEbDs1GnmB6VbBnNj7umoyXuSjT3rYdc9GVwYbjzpdotyD2AUub3TFtQP5GdGJiWNxwXurX9Z1rGGG5h'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '31131999'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '25854e907e052b00bc46346eb02cba49e7bb7dbea7cfc8c05e24b7cae09e95e4:0'
            }
          },
          operation_identifier: {
            index: 1,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '25854e907e052b00bc46346eb02cba49e7bb7dbea7cfc8c05e24b7cae09e95e4'
      }
    }
  },
  {
    block_identifier: {
      hash: '16d14ca745d5956021e20656175bd8b548798ea04a27d9bf5e9f2090ea200434',
      index: 5455974
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 243
      },
      operations: [
        {
          account: {
            address:
              'addr1qxvx9p0n5fmeh3ezpe5rmkww8hwgsn3csvgt0fkweh997g7d50f3vqtfg7r8snkwd7lll3p0jxw3zha0x03wgc2r6lkqm7epvw'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-998057369'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '25c6dbb910b7d997cc7a5b251265b8c557b69d4e125fa890c04ee352f10770ec:0'
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
            address:
              'DdzFFzCqrhsjeukMwfSbL6aHgD5TWENNigWHdbjDu2BvBx1FR4PCeihZiJaGvcxrnm6wS5oBqRo3DZPFhoGsVgpqxpXLeXL6CUAFJs1a'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '997891120'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: 'fa3e15e6b20f43a8f62d806d906c90ff07083d649fbc4ac2544f98a355cdb030:0'
            }
          },
          operation_identifier: {
            index: 1,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: 'fa3e15e6b20f43a8f62d806d906c90ff07083d649fbc4ac2544f98a355cdb030'
      }
    }
  }
];

export const searchTxWithOutputBlockFilter = [
  {
    block_identifier: {
      hash: '16d14ca745d5956021e20656175bd8b548798ea04a27d9bf5e9f2090ea200434',
      index: 5455974
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 344
      },
      operations: [
        {
          account: {
            address:
              'addr1qyjremem252naeh63269z7uwpmhdg4vn3lsvacq36gv3zs5ljlt0lr2hguzn0u4s898vk82tet25c52rj44ursutvu9qm43ejp'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-31516699'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: 'eae640a040ceec6cdb552af6eae8eaaa850bfc2180313036e95dae84ede5ae04:1'
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
            address:
              'DdzFFzCqrhtCHcauyVkWgEcSQEbDs1GnmB6VbBnNj7umoyXuSjT3rYdc9GVwYbjzpdotyD2AUub3TFtQP5GdGJiWNxwXurX9Z1rGGG5h'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '31131999'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '25854e907e052b00bc46346eb02cba49e7bb7dbea7cfc8c05e24b7cae09e95e4:0'
            }
          },
          operation_identifier: {
            index: 1,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '25854e907e052b00bc46346eb02cba49e7bb7dbea7cfc8c05e24b7cae09e95e4'
      }
    }
  },
  {
    block_identifier: {
      hash: '16d14ca745d5956021e20656175bd8b548798ea04a27d9bf5e9f2090ea200434',
      index: 5455974
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 243
      },
      operations: [
        {
          account: {
            address:
              'addr1qxvx9p0n5fmeh3ezpe5rmkww8hwgsn3csvgt0fkweh997g7d50f3vqtfg7r8snkwd7lll3p0jxw3zha0x03wgc2r6lkqm7epvw'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-998057369'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '25c6dbb910b7d997cc7a5b251265b8c557b69d4e125fa890c04ee352f10770ec:0'
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
            address:
              'DdzFFzCqrhsjeukMwfSbL6aHgD5TWENNigWHdbjDu2BvBx1FR4PCeihZiJaGvcxrnm6wS5oBqRo3DZPFhoGsVgpqxpXLeXL6CUAFJs1a'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '997891120'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: 'fa3e15e6b20f43a8f62d806d906c90ff07083d649fbc4ac2544f98a355cdb030:0'
            }
          },
          operation_identifier: {
            index: 1,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: 'fa3e15e6b20f43a8f62d806d906c90ff07083d649fbc4ac2544f98a355cdb030'
      }
    }
  }
];

export const searchTxWithPoolRegistrationBlockFilters = [
  {
    block_identifier: {
      hash: '8839b697618eb1b3167bcd2658e10008d9c1d11bd32b305abf497371cd79dafa',
      index: 4597779
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 723
      },
      operations: [
        {
          account: {
            address:
              'addr1q9wm6dpp9zgund873xluc5wzz3z8dqf04uxvnnafa9tc834sp4f25adz7r8sgwkq3g473htcsramrcwh25twnew0hf2sfma70k'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-52425749'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: 'cda78e5074d4e7d9de0cfb5c4b503b02426d545d7d639e8b287f5be3a58e15cb:0'
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
            address: 'stake1uxcq6542wk30pncy8tqg52lgm4ugp7a3u8t429hfuh8m54gs72zj8'
          },
          metadata: {
            pool_key_hash: '15a500a4ae7a375347deaf879a65d54a481de9073005734b3c85fdf3'
          },
          operation_identifier: {
            index: 1
          },
          status: 'success',
          type: 'stakeDelegation'
        },
        {
          account: {
            address: '15a500a4ae7a375347deaf879a65d54a481de9073005734b3c85fdf3'
          },
          metadata: {
            depositAmount: {
              currency: {
                decimals: 6,
                symbol: 'ADA'
              },
              value: '500000000'
            },
            poolRegistrationParams: {
              cost: '340000000',
              margin_percentage: '0.005',
              pledge: '50000000',
              poolOwners: ['stake1uxcq6542wk30pncy8tqg52lgm4ugp7a3u8t429hfuh8m54gs72zj8'],
              relays: [],
              rewardAddress: 'e1b00d52aa75a2f0cf043ac08a2be8dd7880fbb1e1d75516e9e5cfba55',
              vrfKeyHash: '38ee540c8ed10762b6a43ed4a3c3094c1ac76b3ad838c341e3cb92174db4b4d6'
            }
          },
          operation_identifier: {
            index: 2
          },
          status: 'success',
          type: 'poolRegistration'
        },
        {
          account: {
            address:
              'addr1q9wm6dpp9zgund873xluc5wzz3z8dqf04uxvnnafa9tc834sp4f25adz7r8sgwkq3g473htcsramrcwh25twnew0hf2sfma70k'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '52229492'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '29a76dd58c6309cd9cde855c0c50d81d63f921959359b1e544401ac1dbc9b472:0'
            }
          },
          operation_identifier: {
            index: 3,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '29a76dd58c6309cd9cde855c0c50d81d63f921959359b1e544401ac1dbc9b472'
      }
    }
  },
  {
    block_identifier: {
      hash: 'a5f1a0e14e1ca218fd07e1601792545945c8cb552d7978967e230d6d3b2710fd',
      index: 4490593
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 1011
      },
      operations: [
        {
          account: {
            address:
              'addr1q9xw8g2sqyam5szh4ju0389htsaaxkqg7cr7rsqzt3s7msy9vfk4g42ahjwqezem9ff97q8kqmxgcc0zc8kkcc3p6uuqu8gsl5'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-597821255'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '3e2de59aa5faa736f815a221221517f367d6aac6871ceae7b95c5208668bbaae:0'
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
            address: 'stake1u8gu2vzsk2nc6hsphudhl3p6aum7nd59ajqjg9zp00uvxcqwsdray'
          },
          metadata: {
            pool_key_hash: '8a1ab06f3a8c823b7111955c287efbe3c96ad9a68aa2359832e0bc30'
          },
          operation_identifier: {
            index: 1
          },
          status: 'success',
          type: 'stakeDelegation'
        },
        {
          account: {
            address: 'stake1uxzkym2524wme8qv3vaj55jlqrmqdnyvv83vrmtvvgsawwq8aw9xu'
          },
          metadata: {
            pool_key_hash: '8a1ab06f3a8c823b7111955c287efbe3c96ad9a68aa2359832e0bc30'
          },
          operation_identifier: {
            index: 2
          },
          status: 'success',
          type: 'stakeDelegation'
        },
        {
          account: {
            address: '8a1ab06f3a8c823b7111955c287efbe3c96ad9a68aa2359832e0bc30'
          },
          metadata: {
            depositAmount: {
              currency: {
                decimals: 6,
                symbol: 'ADA'
              },
              value: '500000000'
            },
            poolRegistrationParams: {
              cost: '340000000',
              margin_percentage: '0.042',
              pledge: '500000000',
              poolOwners: [
                'stake1uxzkym2524wme8qv3vaj55jlqrmqdnyvv83vrmtvvgsawwq8aw9xu',
                'stake1u8gu2vzsk2nc6hsphudhl3p6aum7nd59ajqjg9zp00uvxcqwsdray'
              ],
              relays: [],
              rewardAddress: 'e1d1c53050b2a78d5e01bf1b7fc43aef37e9b685ec812414417bf8c360',
              vrfKeyHash: 'd9f5cf491f19ca61c13f5706ef82c6537d73d372481077c5aa7276b0889bbcb3'
            }
          },
          operation_identifier: {
            index: 3
          },
          status: 'success',
          type: 'poolRegistration'
        },
        {
          account: {
            address:
              'addr1q9xw8g2sqyam5szh4ju0389htsaaxkqg7cr7rsqzt3s7msy9vfk4g42ahjwqezem9ff97q8kqmxgcc0zc8kkcc3p6uuqu8gsl5'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '97610698'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '51d67e194d749df2abf4e2e11cea63ca6e1c630042a366f555939e795a6ddecf:0'
            }
          },
          operation_identifier: {
            index: 4,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '51d67e194d749df2abf4e2e11cea63ca6e1c630042a366f555939e795a6ddecf'
      }
    }
  }
];

export const searchTxWithDelegationBlockFilter = [
  {
    block_identifier: {
      hash: '16d14ca745d5956021e20656175bd8b548798ea04a27d9bf5e9f2090ea200434',
      index: 5455974
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 391
      },
      operations: [
        {
          account: {
            address:
              'addr1q8n875ml49x2hvxpz74wh3qx6lzk0fqkknzm78yx5tfr29fjh2sle52jmuny9zkyz3pt0lurp772t5hcwc5k6f7xmk4qwjghw7'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-323913197'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '3bc575ec23b31903cb7cb7c5397785ce258cfd729722238c17bf70d5e767719f:2'
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
            address: 'stake1uyet4g0u69fd7fjz3tzpgs4hl7psl0996tu8v2tdylrdm2s65cz5k'
          },
          metadata: {
            pool_key_hash: 'fd832d27b5fbe0489409613f50e2139b54a21e613c8a7609dcff556e'
          },
          operation_identifier: {
            index: 1
          },
          status: 'success',
          type: 'stakeDelegation'
        },
        {
          account: {
            address:
              'addr1qx38a2xmqs6gkfree3p4md9a9d27r4hmcx3l0x3kjtjrkx3jh2sle52jmuny9zkyz3pt0lurp772t5hcwc5k6f7xmk4q2g2nme'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '323739556'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: 'a53d5dfcad1de616f62dacb49855ea9270b310063740aa750b66830daba18535:0'
            }
          },
          operation_identifier: {
            index: 2,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: 'a53d5dfcad1de616f62dacb49855ea9270b310063740aa750b66830daba18535'
      }
    }
  },
  {
    block_identifier: {
      hash: '16d14ca745d5956021e20656175bd8b548798ea04a27d9bf5e9f2090ea200434',
      index: 5455974
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 395
      },
      operations: [
        {
          account: {
            address:
              'addr1qy35ngs6gyw4ht6ghzwy6hkc3dnkhdy840qm9lem5dwmspxd4lehms3zp4f7u9z92ltqceuuunyjw9w7pm40peqkzcsswvt0tc'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-99998818659'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '9646c1301c4b90170e225477117a44f9a2b58bd1e3dbe03abfb7ed7aaa8298ae:0'
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
            address: 'stake1u8x6lumacg3q65lwz3z404svv7wwfjf8zh0qa6hsustpvgg5u4tzx'
          },
          metadata: {
            pool_key_hash: 'ff069b3ecf738d4adfe83f7c20c64b82f94f7285ee41eedb2bfd297b'
          },
          operation_identifier: {
            index: 1
          },
          status: 'success',
          type: 'stakeDelegation'
        },
        {
          account: {
            address:
              'addr1qyhzarc3cpgf0r5zcm5gdglc2acjfud2wws0dskrsp9ty4kd4lehms3zp4f7u9z92ltqceuuunyjw9w7pm40peqkzcssw0a38d'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '99998645018'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '29f1fe0f08ce0be90d6b55ac817869470f5faa4c8236064c929b21e0b4d60793:0'
            }
          },
          operation_identifier: {
            index: 2,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '29f1fe0f08ce0be90d6b55ac817869470f5faa4c8236064c929b21e0b4d60793'
      }
    }
  }
];

export const searchTxWithDeregistrationBlock = [
  {
    block_identifier: {
      hash: '6713e3dbea2a037f0be9401744a8b2be4c6190294a23c496165c212972a82f61',
      index: 4853177
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 365
      },
      operations: [
        {
          account: {
            address:
              'addr1qyzstdwf29wpp3fmsmhxe3nks0x2lzs9c6ka553r5lans9wyn8dwr235e08njhkc5pn8unfx68d7pyq0jtq483vt0zls4nn77q'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-7126681496'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '820dd7d6b167458348aa0a58a4af39709e464ec7ef1068dee2261fb7b609b605:0'
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
            address: 'stake1u8zfnkhp4g6vhneetmv2qen7f5ndrklqjq8e9s2nck9h30cfz6qmp'
          },
          metadata: {
            refundAmount: {
              currency: {
                decimals: 6,
                symbol: 'ADA'
              },
              value: '-2000000'
            }
          },
          operation_identifier: {
            index: 1
          },
          status: 'success',
          type: 'stakeKeyDeregistration'
        },
        {
          account: {
            address:
              'addr1qy30ge0rzd6x0frea6hfdv7suy40psqr8lprct9x7h9yj87yn8dwr235e08njhkc5pn8unfx68d7pyq0jtq483vt0zls4jy0m3'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '7128509879'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '5fe53eece38ff4eb102c33c6cbdf34947c8232eefaae0731fdf8f746b81763fc:0'
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
        }
      ],
      transaction_identifier: {
        hash: '5fe53eece38ff4eb102c33c6cbdf34947c8232eefaae0731fdf8f746b81763fc'
      }
    }
  }
];

export const searchTxWithKeyRegistrationBlockFilters = [
  {
    block_identifier: {
      hash: '16d14ca745d5956021e20656175bd8b548798ea04a27d9bf5e9f2090ea200434',
      index: 5455974
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 425
      },
      operations: [
        {
          account: {
            address:
              'addr1qysdyxq562kj6wjpu5hjp8n6q9x78s9p0gpgepqzy227ae3dtwse2yrwxn2lp8awmlqkmfxyjqksvq3vqdr3adjl9rgsgdgjv7'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-2926554400'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '6abf8398da2e00196d6575454d95da3c336860a08d53f457c518b720cecc03a0:3'
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
            address: 'stake1uyk4hgv4zphrf40sn7hdlstd5nzfqtgxqgkqx3c7ke0j35gvaacgq'
          },
          metadata: {
            depositAmount: {
              currency: {
                decimals: 6,
                symbol: 'ADA'
              },
              value: '2000000'
            }
          },
          operation_identifier: {
            index: 1
          },
          status: 'success',
          type: 'stakeKeyRegistration'
        },
        {
          account: {
            address: 'stake1uyk4hgv4zphrf40sn7hdlstd5nzfqtgxqgkqx3c7ke0j35gvaacgq'
          },
          metadata: {
            pool_key_hash: '77b0a93c26ac65be36e9a9f220f9a43cbc57d705fc5d8f1de5fdeea1'
          },
          operation_identifier: {
            index: 2
          },
          status: 'success',
          type: 'stakeDelegation'
        },
        {
          account: {
            address:
              'addr1qxwfgte7aqdzmj02ytgp0s54nk0xkujypclzqyrnnpdf2fedtwse2yrwxn2lp8awmlqkmfxyjqksvq3vqdr3adjl9rgsl7rrnz'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '2924380143'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '84b6dfe68e5bc9026d5b53394b41767e8c033cbf39bf054b8aa617e3bc545cb0:0'
            }
          },
          operation_identifier: {
            index: 3,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '84b6dfe68e5bc9026d5b53394b41767e8c033cbf39bf054b8aa617e3bc545cb0'
      }
    }
  },
  {
    block_identifier: {
      hash: '51717e46773716c3f9058d55f118d0bcb01716ccfd69f215f5a69d1e5414305a',
      index: 5412141
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 425
      },
      operations: [
        {
          account: {
            address:
              'addr1qyf060qntger7pazgzw3zlyhwsgy27lyd05cflz0jcva6lmmtel6za70968h4xngsy0f8m92hvqv5xryp4jxr53m5uls8460aa'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-56169781'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '5f1f1be0225c08b57d6c0f8eac6952d9d95f78227ef87363d7d750d2c6343278:7'
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
            address: 'stake1u9a4ulapwl8jarm6nf5gz85naj4tkqx2rpjq6erp6ga6w0c9amzzr'
          },
          metadata: {
            depositAmount: {
              currency: {
                decimals: 6,
                symbol: 'ADA'
              },
              value: '2000000'
            }
          },
          operation_identifier: {
            index: 1
          },
          status: 'success',
          type: 'stakeKeyRegistration'
        },
        {
          account: {
            address: 'stake1u9a4ulapwl8jarm6nf5gz85naj4tkqx2rpjq6erp6ga6w0c9amzzr'
          },
          metadata: {
            pool_key_hash: '53215c471b7ac752e3ddf8f2c4c1e6ed111857bfaa675d5e31ce8bce'
          },
          operation_identifier: {
            index: 2
          },
          status: 'success',
          type: 'stakeDelegation'
        },
        {
          account: {
            address:
              'addr1q8m5h70wcgmev200wweumqfryz53kdxdyej8599m0c6gckrmtel6za70968h4xngsy0f8m92hvqv5xryp4jxr53m5ulsx54qrp'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '53994644'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '7521ecf48d3819b7d026fe98e4fc4352d91fa8a43732db603b3bcec94b4bf75a:0'
            }
          },
          operation_identifier: {
            index: 3,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '7521ecf48d3819b7d026fe98e4fc4352d91fa8a43732db603b3bcec94b4bf75a'
      }
    }
  }
];

export const searchTxsWithVoteRegistrationBlockFilters = [
  {
    block_identifier: {
      hash: '56b40fff73f4a3bc946b516d507b822eb92781f67327bc7bb6f46a08dd5dfdf0',
      index: 5412127
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 535
      },
      operations: [
        {
          account: {
            address:
              'addr1qxqxphm80tt8yyu25cy3w6k45kcmhy0ec8wtds57vy7jnwl3vdnqjcaf0s2xxaupf67k50pgulcujcyh20l8vx2x92ms609ga6'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-22620000000'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '9ded65803caa08ab0805e566f504cb5f2a1e078e6e2d94816cfcf69e77b94d06:0'
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
            address:
              'addr1q9x3j88pwufrnttdcaft9rnsmxnjnvlck064l905ul3hmkh3vdnqjcaf0s2xxaupf67k50pgulcujcyh20l8vx2x92msk33lpr'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '1000000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '06aa4452446ddbd0773694bfe4f5d2ba2faa05bbf96ae318f115ca3633cc30d1:0'
            }
          },
          operation_identifier: {
            index: 1,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        },
        {
          account: {
            address:
              'addr1qyvgatmpv9g2q4wnjkl5eqhcy62vl39lr3vattj3wk5aqvl3vdnqjcaf0s2xxaupf67k50pgulcujcyh20l8vx2x92ms2e8d94'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '22618820639'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '06aa4452446ddbd0773694bfe4f5d2ba2faa05bbf96ae318f115ca3633cc30d1:1'
            }
          },
          operation_identifier: {
            index: 2,
            network_index: 1
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '06aa4452446ddbd0773694bfe4f5d2ba2faa05bbf96ae318f115ca3633cc30d1'
      }
    }
  },
  {
    block_identifier: {
      hash: 'c2c6a77e1c1ce1c75043bbf468d3af1e0f6e865e01f4285535be83773ec059f8',
      index: 5406842
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 464
      },
      operations: [
        {
          account: {
            address:
              'addr1qxg7kzufcsas3g4altjmy9scgthehgh3tr9xyck8kdgwtxn7ye4d6rrqg8wcwfd5h3h0c0753cu24hrw6upc3pfamj7qjzv2v4'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-27825567'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '2512d3089fdedd35a1c46da30bc14a6aadff6ce6acf87b37946ec0e0953f9555:0'
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
            address:
              'addr1q9d9ghq38p08fa6a7km40sppj0nlrtg5a4xjxa4hhmcrcnt7ye4d6rrqg8wcwfd5h3h0c0753cu24hrw6upc3pfamj7qe9emmm'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '27649594'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: 'af1b861f3c2e8c4a3266fabe0929d72d997ac21b382f2b9f8b84656c1ff0c2f1:0'
            }
          },
          operation_identifier: {
            index: 1,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: 'af1b861f3c2e8c4a3266fabe0929d72d997ac21b382f2b9f8b84656c1ff0c2f1'
      }
    }
  }
];

export const searchTxsWithWithdrawalBlockFilters = [
  {
    block_identifier: {
      hash: '16d14ca745d5956021e20656175bd8b548798ea04a27d9bf5e9f2090ea200434',
      index: 5455974
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 565
      },
      operations: [
        {
          account: {
            address:
              'addr1qyqrgnkcs78uyyhhtg2stdlzckusgc7pnwvdqhvvcaxurvqqx38d3pu0cgf0wks4qkm793deq33urxuc6pwce36dcxcq88zzkw'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-1000000'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '6b83b19cd3a142f55c63835e77556676f22f018f4e49849d8585433c407efb11:0'
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
            address:
              'addr1qyqrgnkcs78uyyhhtg2stdlzckusgc7pnwvdqhvvcaxurvqqx38d3pu0cgf0wks4qkm793deq33urxuc6pwce36dcxcq88zzkw'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-3104943587'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '6b83b19cd3a142f55c63835e77556676f22f018f4e49849d8585433c407efb11:1'
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
            address: 'stake1uyqrgnkcs78uyyhhtg2stdlzckusgc7pnwvdqhvvcaxurvqnwzthe'
          },
          metadata: {
            withdrawalAmount: {
              currency: {
                decimals: 6,
                symbol: 'ADA'
              },
              value: '-4208351'
            }
          },
          operation_identifier: {
            index: 2
          },
          status: 'success',
          type: 'withdrawal'
        },
        {
          account: {
            address:
              'addr1qyqrgnkcs78uyyhhtg2stdlzckusgc7pnwvdqhvvcaxurvqqx38d3pu0cgf0wks4qkm793deq33urxuc6pwce36dcxcq88zzkw'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '1000000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '9f20ca2e8f50f4dcdc45946aaf83b43a8dc39e200bdad7b6dfd75de355c43843:0'
            }
          },
          operation_identifier: {
            index: 3,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            },
            {
              index: 1
            },
            {
              index: 2
            }
          ],
          status: 'success',
          type: 'output'
        },
        {
          account: {
            address:
              'addr1qyqrgnkcs78uyyhhtg2stdlzckusgc7pnwvdqhvvcaxurvqqx38d3pu0cgf0wks4qkm793deq33urxuc6pwce36dcxcq88zzkw'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '3108959334'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '9f20ca2e8f50f4dcdc45946aaf83b43a8dc39e200bdad7b6dfd75de355c43843:1'
            }
          },
          operation_identifier: {
            index: 4,
            network_index: 1
          },
          related_operations: [
            {
              index: 0
            },
            {
              index: 1
            },
            {
              index: 2
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '9f20ca2e8f50f4dcdc45946aaf83b43a8dc39e200bdad7b6dfd75de355c43843'
      }
    }
  },
  {
    block_identifier: {
      hash: '16d14ca745d5956021e20656175bd8b548798ea04a27d9bf5e9f2090ea200434',
      index: 5455974
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 359
      },
      operations: [
        {
          account: {
            address:
              'addr1qxdytq29w3kkef84gjvtt5d5jdwe0sszhezlpu7vh4vf4y2tnclpp4k3t0krxj0nycaqx7gtqxqzxaz7jr42ajaaqv0q39nwdy'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-43944854'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: 'ef54a4470eae29057a19a8e9d0fe6cc5adccd5e32e042d3ed9aa9592664edc97:0'
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
            address: 'stake1u99eu0ss6mg4hmpnf8ejvwsr0y9srqprw30fp64wew7sx8shn9xhl'
          },
          metadata: {
            withdrawalAmount: {
              currency: {
                decimals: 6,
                symbol: 'ADA'
              },
              value: '-0'
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
              'addr1qxdytq29w3kkef84gjvtt5d5jdwe0sszhezlpu7vh4vf4y2tnclpp4k3t0krxj0nycaqx7gtqxqzxaz7jr42ajaaqv0q39nwdy'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '43548154'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '1188d89984523183baf8f8e80c63c1cf2e4beb07e89c4288b393795f348c4184:0'
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
        }
      ],
      transaction_identifier: {
        hash: '1188d89984523183baf8f8e80c63c1cf2e4beb07e89c4288b393795f348c4184'
      }
    }
  }
];

export const searchTxsWithComposedFilters = [
  {
    block_identifier: {
      hash: 'b973c3f5873b89360318f1e913452948601ba526a6c5cf97e8b8929c5c78497a',
      index: 55285
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 220
      },
      operations: [
        {
          account: {
            address:
              'DdzFFzCqrhtCm14T5EnNykq5e8dGDR5vvTGZUgypDfXMS2ti8U6T6t3NfqE2gq87EKN6DMkwsqer6mZVso9LL4TsRcLuX5XNVcxEEpUv'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-40403914787416'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: 'bcc57134d1bd588b00f40142f0fdc17db5f35047e3196cdf26aa7319524c0014:0'
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
            address:
              'DdzFFzCqrht13mPij49uuAJZtfwBfrmFsDW8HdybzZGHNwUipGud9uNLW5U4JjH3C4QswFR9pJraXWAPKq65wjAXE9ndQKMTw7Mo8Du6'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '40393405036456'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '4bcf79c0c2967986749fd0ae03f5b54a712d51b35672a3d974707c060c4d8dac:0'
            }
          },
          operation_identifier: {
            index: 1,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        },
        {
          account: {
            address:
              'DdzFFzCqrhsdufpFxByLTQmktKJnTrudktaHq1nK2MAEDLXjz5kbRcr5prHi9gHb6m8pTvhgK6JbFDZA1LTiTcP6g8KuPSF1TfKP8ewp'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '10509579714'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '4bcf79c0c2967986749fd0ae03f5b54a712d51b35672a3d974707c060c4d8dac:1'
            }
          },
          operation_identifier: {
            index: 2,
            network_index: 1
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '4bcf79c0c2967986749fd0ae03f5b54a712d51b35672a3d974707c060c4d8dac'
      }
    }
  }
];

export const searchTxsWithOrComposedFilters = [
  {
    block_identifier: {
      hash: 'ed290c23ea47a6cc1d93d4a9a31581056aa07c362f8a0581c46ef6c2317dda0f',
      index: 56720
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 220
      },
      operations: [
        {
          account: {
            address:
              'DdzFFzCqrhskuju8FFC45HJeAywmpnAQMyiHVEFwRMeGYisAZcimoUDXGuJEv1HHfjgw7bnhkgtwvwMCoDC56BzBUTwA7DQwcBYFz84u'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-39788401224065'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '051aa802018d6280f113b04ed33db861e71ebcfe680045cce7827f0094f78dff:0'
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
            address:
              'DdzFFzCqrht9txZLEQrH4rYkZPafAz6dE3dY1MJoLcFA86J9V7U8wjuYdqZxr4FzV8RSXDGuMUPGe9n2quNDSPFUrggRvnXDKZdxuqzn'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '39741749287458'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: 'b59070acf8b96a50482b4dbbd96318988b8ec6e1b76b27e9fdd23646b5e3978d:0'
            }
          },
          operation_identifier: {
            index: 1,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        },
        {
          account: {
            address:
              'DdzFFzCqrhskdBJ2uat4AKea2L4Dr3xDrHBf667xLagt7fbroaic7vkPmMWVPEwejhE8FakpgYzj3TvZ2S6QKDizZsKzQGywPNhPeXeC'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '46651765361'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: 'b59070acf8b96a50482b4dbbd96318988b8ec6e1b76b27e9fdd23646b5e3978d:1'
            }
          },
          operation_identifier: {
            index: 2,
            network_index: 1
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: 'b59070acf8b96a50482b4dbbd96318988b8ec6e1b76b27e9fdd23646b5e3978d'
      }
    }
  },
  {
    block_identifier: {
      hash: '501895912a02ca394e1a50736cd8f9bac8a7566400b8437ef457a9f8c4a41f1f',
      index: 56704
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 216
      },
      operations: [
        {
          account: {
            address:
              'DdzFFzCqrhseF2i2J1xPsgsMygEJ2YS27Vu43369za61VhAkm8Xcta5ss42WVW5nYcqTfJXjMFFND858jFRowwVFfevBKEm7JvRjqahR'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-39788403195135'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '309c5a5bee8affb3d3e58d4dc824bb013f91fef121ec2f31b3c3a8766dcceacc:0'
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
            address:
              'DdzFFzCqrhskuju8FFC45HJeAywmpnAQMyiHVEFwRMeGYisAZcimoUDXGuJEv1HHfjgw7bnhkgtwvwMCoDC56BzBUTwA7DQwcBYFz84u'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '39788401224065'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '051aa802018d6280f113b04ed33db861e71ebcfe680045cce7827f0094f78dff:0'
            }
          },
          operation_identifier: {
            index: 1,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        },
        {
          account: {
            address:
              'DdzFFzCqrhskdBJ2uat4AKea2L4Dr3xDrHBf667xLagt7fbroaic7vkPmMWVPEwejhE8FakpgYzj3TvZ2S6QKDizZsKzQGywPNhPeXeC'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '1800000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '051aa802018d6280f113b04ed33db861e71ebcfe680045cce7827f0094f78dff:1'
            }
          },
          operation_identifier: {
            index: 2,
            network_index: 1
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '051aa802018d6280f113b04ed33db861e71ebcfe680045cce7827f0094f78dff'
      }
    }
  }
];

export const searchTxsAllFiltersWithInput = [
  {
    block_identifier: {
      hash: '56b40fff73f4a3bc946b516d507b822eb92781f67327bc7bb6f46a08dd5dfdf0',
      index: 5412127
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 332
      },
      operations: [
        {
          account: {
            address:
              'addr1q9ux256a00fp5893hxus848x3et4e2r0r68fghgq7hy9lhh4whm9xf2k2arpgzkdpkj4kc4n99lwx4t2c0rh94csnafqpnkh98'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-10333720'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '2f82cbfbbced8b4f2a3f3a79819c0db1bb802110333ef8cf343b560fc0a9ba4e:0'
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
            address:
              'addr1q8a3rmnxnp986vy3tzz3vd3mdk9lmjnnw6w68uaaa8g4t4u5lddnau28pea3mdy84uls504lsc7uk9zyzmqtcxyy7jyqqjm7sg'
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
              identifier: '038e318f0deef63f44be78a8224c06d3faae683f48eb0215a448ab13fd1eb540:0'
            }
          },
          metadata: {
            tokenBundle: [
              {
                policyId: 'cebbcd14c5b11ca83d7ef93b02acfc0bcb372066bdee259f6cd9ae6c',
                tokens: [
                  {
                    currency: {
                      decimals: 0,
                      symbol: '46555a5a'
                    },
                    value: '1000000'
                  }
                ]
              }
            ]
          },
          operation_identifier: {
            index: 1,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        },
        {
          account: {
            address:
              'addr1q9ux256a00fp5893hxus848x3et4e2r0r68fghgq7hy9lhh4whm9xf2k2arpgzkdpkj4kc4n99lwx4t2c0rh94csnafqpnkh98'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '8155239'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '038e318f0deef63f44be78a8224c06d3faae683f48eb0215a448ab13fd1eb540:1'
            }
          },
          operation_identifier: {
            index: 2,
            network_index: 1
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '038e318f0deef63f44be78a8224c06d3faae683f48eb0215a448ab13fd1eb540'
      }
    }
  }
];

export const searchTxsWithAllFiltersAndInputsOrOperator = [
  {
    block_identifier: {
      hash: '56b40fff73f4a3bc946b516d507b822eb92781f67327bc7bb6f46a08dd5dfdf0',
      index: 5412127
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 382
      },
      operations: [
        {
          account: {
            address:
              'DdzFFzCqrhsyGqiu2RuKpgc5ASHKaPfpmCjDUeZEKKq9izME8X6wTzFMxyDis7nkpF75oASrFvTbNW1diFFakxvKcQrhTsWjBpbFbMqW'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-19248500000'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '1c1074dbdb7daa568b7154e0931ff62de0a15dd23d769bbc95d9b8da036d07d8:0'
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
            address:
              'addr1qyrhyyal857lddgngmtdkd6f7z4vra0v7vdva5xzc69lhcllgaz906v97qkfeuh4un438s57vrg8neaaqsldy5hynhlshn2zc7'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '1400000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '49913ab2ad895ff7bf4f42e8baf66ec358691f5e0dee9cde4128496a4c88bbfb:0'
            }
          },
          operation_identifier: {
            index: 1,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        },
        {
          account: {
            address:
              'DdzFFzCqrht8CWd1LXT5b2BPVURvxsLYuV3n14nAu7G1t8fB4auaeNDoojnbRD3weH9Xr9NuNwh75eydk6ar9wXiJQw73Vi5f74gzHG5'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '19246926579'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '49913ab2ad895ff7bf4f42e8baf66ec358691f5e0dee9cde4128496a4c88bbfb:1'
            }
          },
          operation_identifier: {
            index: 2,
            network_index: 1
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '49913ab2ad895ff7bf4f42e8baf66ec358691f5e0dee9cde4128496a4c88bbfb'
      }
    }
  },
  {
    block_identifier: {
      hash: '56b40fff73f4a3bc946b516d507b822eb92781f67327bc7bb6f46a08dd5dfdf0',
      index: 5412127
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 293
      },
      operations: [
        {
          account: {
            address:
              'addr1q8wg62pkvvh74tz9ers8xm9rkewd7zrtyk9lm2d83myk4c2uvu2ffa2ctx3pdl4rjjja5p7al2k356x5yx8cn03am88szpcuv3'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-206251518041'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '043945bb84ec97b2f967f451aaf3c1e535984c1a09fad1284ccdb9d18cb131b2:1'
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
            address:
              'addr1q85m2j9zs7kktrl04kxu6mee0w5r2rcy3eh786l5x8tzlqk3msj677vch75vp8esajss5v7g2d38g0kpqmacv3hc3qdqyk6tx6'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '84783800'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '121bd7172ca3bcf6b51044cd9c3bf19729a3c51512c75d6baae26114e2a5e905:0'
            }
          },
          operation_identifier: {
            index: 1,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        },
        {
          account: {
            address:
              'addr1qx4e9dr2n4jquq6t32t3qe3h5tmgl80szl9gldg3c9z7772uvu2ffa2ctx3pdl4rjjja5p7al2k356x5yx8cn03am88s698sf2'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '206166565440'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '121bd7172ca3bcf6b51044cd9c3bf19729a3c51512c75d6baae26114e2a5e905:1'
            }
          },
          operation_identifier: {
            index: 2,
            network_index: 1
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '121bd7172ca3bcf6b51044cd9c3bf19729a3c51512c75d6baae26114e2a5e905'
      }
    }
  }
];

export const searchTxsAllFiltersWithOutput = [
  {
    block_identifier: {
      hash: '56b40fff73f4a3bc946b516d507b822eb92781f67327bc7bb6f46a08dd5dfdf0',
      index: 5412127
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 332
      },
      operations: [
        {
          account: {
            address:
              'addr1q9ux256a00fp5893hxus848x3et4e2r0r68fghgq7hy9lhh4whm9xf2k2arpgzkdpkj4kc4n99lwx4t2c0rh94csnafqpnkh98'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-10333720'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '2f82cbfbbced8b4f2a3f3a79819c0db1bb802110333ef8cf343b560fc0a9ba4e:0'
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
            address:
              'addr1q8a3rmnxnp986vy3tzz3vd3mdk9lmjnnw6w68uaaa8g4t4u5lddnau28pea3mdy84uls504lsc7uk9zyzmqtcxyy7jyqqjm7sg'
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
              identifier: '038e318f0deef63f44be78a8224c06d3faae683f48eb0215a448ab13fd1eb540:0'
            }
          },
          metadata: {
            tokenBundle: [
              {
                policyId: 'cebbcd14c5b11ca83d7ef93b02acfc0bcb372066bdee259f6cd9ae6c',
                tokens: [
                  {
                    currency: {
                      decimals: 0,
                      symbol: '46555a5a'
                    },
                    value: '1000000'
                  }
                ]
              }
            ]
          },
          operation_identifier: {
            index: 1,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        },
        {
          account: {
            address:
              'addr1q9ux256a00fp5893hxus848x3et4e2r0r68fghgq7hy9lhh4whm9xf2k2arpgzkdpkj4kc4n99lwx4t2c0rh94csnafqpnkh98'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '8155239'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '038e318f0deef63f44be78a8224c06d3faae683f48eb0215a448ab13fd1eb540:1'
            }
          },
          operation_identifier: {
            index: 2,
            network_index: 1
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '038e318f0deef63f44be78a8224c06d3faae683f48eb0215a448ab13fd1eb540'
      }
    }
  }
];

export const searchTxsWithAllFiltersPoolRegistrationOrOperator = [
  {
    block_identifier: {
      hash: '56b40fff73f4a3bc946b516d507b822eb92781f67327bc7bb6f46a08dd5dfdf0',
      index: 5412127
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 332
      },
      operations: [
        {
          account: {
            address:
              'addr1q9ux256a00fp5893hxus848x3et4e2r0r68fghgq7hy9lhh4whm9xf2k2arpgzkdpkj4kc4n99lwx4t2c0rh94csnafqpnkh98'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-10333720'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '2f82cbfbbced8b4f2a3f3a79819c0db1bb802110333ef8cf343b560fc0a9ba4e:0'
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
            address:
              'addr1q8a3rmnxnp986vy3tzz3vd3mdk9lmjnnw6w68uaaa8g4t4u5lddnau28pea3mdy84uls504lsc7uk9zyzmqtcxyy7jyqqjm7sg'
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
              identifier: '038e318f0deef63f44be78a8224c06d3faae683f48eb0215a448ab13fd1eb540:0'
            }
          },
          metadata: {
            tokenBundle: [
              {
                policyId: 'cebbcd14c5b11ca83d7ef93b02acfc0bcb372066bdee259f6cd9ae6c',
                tokens: [
                  {
                    currency: {
                      decimals: 0,
                      symbol: '46555a5a'
                    },
                    value: '1000000'
                  }
                ]
              }
            ]
          },
          operation_identifier: {
            index: 1,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        },
        {
          account: {
            address:
              'addr1q9ux256a00fp5893hxus848x3et4e2r0r68fghgq7hy9lhh4whm9xf2k2arpgzkdpkj4kc4n99lwx4t2c0rh94csnafqpnkh98'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '8155239'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '038e318f0deef63f44be78a8224c06d3faae683f48eb0215a448ab13fd1eb540:1'
            }
          },
          operation_identifier: {
            index: 2,
            network_index: 1
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '038e318f0deef63f44be78a8224c06d3faae683f48eb0215a448ab13fd1eb540'
      }
    }
  },
  {
    block_identifier: {
      hash: '4d9eaeffa13b9039af5b5609800976b0e8f63244bda5672cad8109dd96c2a586',
      index: 5412108
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 626
      },
      operations: [
        {
          account: {
            address:
              'addr1q9nhflklv4jhy7v80zjykek979vm9k46wme0qw9aq6y72f783p76htnxdk6gyavxzaw02pp6f9sc7vnqkmrfsj86qwyqu0el3w'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-1084217373'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '6e855e0651c4dc9edc3931d564eb89352f216ef9d7ed676016d4a8ee67432001:1'
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
            address:
              'addr1qyfkcp605xkss5hhjqsy0km65kzj5qw6ua2lteh7828zgww83p76htnxdk6gyavxzaw02pp6f9sc7vnqkmrfsj86qwyqaz2zkm'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-4000000'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '809071a963b789091ebca23c201a1a88a25278763d65b08272ff1e106acc0389:0'
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
              'addr1qx50dymmdzuz5x3ng3de0kq2ufc9v3vt6xf4yjv5z8uttq783p76htnxdk6gyavxzaw02pp6f9sc7vnqkmrfsj86qwyqywrrmu'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '1086589829'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: 'bedcfc581f78fef99268eccaef57bf0d3d4518884164e3e02d4ec33a392d3975:1'
            }
          },
          metadata: {
            tokenBundle: [
              {
                policyId: '15f86c4f16d51f1890b2416e329c281befd2e42f919839152e73f0b9',
                tokens: [
                  {
                    currency: {
                      decimals: 0,
                      symbol: '53544152'
                    },
                    value: '1000000000000'
                  }
                ]
              },
              {
                policyId: '818c4c891e543a4d9487b6c18e8b7ed7f0f0870158c45f94e547e7b1',
                tokens: [
                  {
                    currency: {
                      decimals: 0,
                      symbol: '4f47'
                    },
                    value: '5000'
                  }
                ]
              },
              {
                policyId: 'dfbe6e3399373ff93183e27a0a22ec5d735fbb1668a334ce8714776b',
                tokens: [
                  {
                    currency: {
                      decimals: 0,
                      symbol: '4d55474759'
                    },
                    value: '445'
                  }
                ]
              },
              {
                policyId: 'eb970e28464be9486a779759828d79fb7a7154782b93e3f5e26875a9',
                tokens: [
                  {
                    currency: {
                      decimals: 0,
                      symbol: '4d454d45'
                    },
                    value: '2'
                  }
                ]
              }
            ]
          },
          operation_identifier: {
            index: 2,
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
            address:
              'addr1q8a3rmnxnp986vy3tzz3vd3mdk9lmjnnw6w68uaaa8g4t4u5lddnau28pea3mdy84uls504lsc7uk9zyzmqtcxyy7jyqqjm7sg'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '1444443'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: 'bedcfc581f78fef99268eccaef57bf0d3d4518884164e3e02d4ec33a392d3975:0'
            }
          },
          metadata: {
            tokenBundle: [
              {
                policyId: '818c4c891e543a4d9487b6c18e8b7ed7f0f0870158c45f94e547e7b1',
                tokens: [
                  {
                    currency: {
                      decimals: 0,
                      symbol: '4f47'
                    },
                    value: '5000'
                  }
                ]
              }
            ]
          },
          operation_identifier: {
            index: 3,
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
        }
      ],
      transaction_identifier: {
        hash: 'bedcfc581f78fef99268eccaef57bf0d3d4518884164e3e02d4ec33a392d3975'
      }
    }
  }
];

export const searchTxWithAllFiltersPoolRetirementOrOperator = [
  {
    block_identifier: {
      hash: '56b40fff73f4a3bc946b516d507b822eb92781f67327bc7bb6f46a08dd5dfdf0',
      index: 5412127
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 332
      },
      operations: [
        {
          account: {
            address:
              'addr1q9ux256a00fp5893hxus848x3et4e2r0r68fghgq7hy9lhh4whm9xf2k2arpgzkdpkj4kc4n99lwx4t2c0rh94csnafqpnkh98'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-10333720'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '2f82cbfbbced8b4f2a3f3a79819c0db1bb802110333ef8cf343b560fc0a9ba4e:0'
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
            address:
              'addr1q8a3rmnxnp986vy3tzz3vd3mdk9lmjnnw6w68uaaa8g4t4u5lddnau28pea3mdy84uls504lsc7uk9zyzmqtcxyy7jyqqjm7sg'
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
              identifier: '038e318f0deef63f44be78a8224c06d3faae683f48eb0215a448ab13fd1eb540:0'
            }
          },
          metadata: {
            tokenBundle: [
              {
                policyId: 'cebbcd14c5b11ca83d7ef93b02acfc0bcb372066bdee259f6cd9ae6c',
                tokens: [
                  {
                    currency: {
                      decimals: 0,
                      symbol: '46555a5a'
                    },
                    value: '1000000'
                  }
                ]
              }
            ]
          },
          operation_identifier: {
            index: 1,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        },
        {
          account: {
            address:
              'addr1q9ux256a00fp5893hxus848x3et4e2r0r68fghgq7hy9lhh4whm9xf2k2arpgzkdpkj4kc4n99lwx4t2c0rh94csnafqpnkh98'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '8155239'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '038e318f0deef63f44be78a8224c06d3faae683f48eb0215a448ab13fd1eb540:1'
            }
          },
          operation_identifier: {
            index: 2,
            network_index: 1
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '038e318f0deef63f44be78a8224c06d3faae683f48eb0215a448ab13fd1eb540'
      }
    }
  },
  {
    block_identifier: {
      hash: '4d9eaeffa13b9039af5b5609800976b0e8f63244bda5672cad8109dd96c2a586',
      index: 5412108
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 626
      },
      operations: [
        {
          account: {
            address:
              'addr1q9nhflklv4jhy7v80zjykek979vm9k46wme0qw9aq6y72f783p76htnxdk6gyavxzaw02pp6f9sc7vnqkmrfsj86qwyqu0el3w'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-1084217373'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '6e855e0651c4dc9edc3931d564eb89352f216ef9d7ed676016d4a8ee67432001:1'
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
            address:
              'addr1qyfkcp605xkss5hhjqsy0km65kzj5qw6ua2lteh7828zgww83p76htnxdk6gyavxzaw02pp6f9sc7vnqkmrfsj86qwyqaz2zkm'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-4000000'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '809071a963b789091ebca23c201a1a88a25278763d65b08272ff1e106acc0389:0'
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
              'addr1qx50dymmdzuz5x3ng3de0kq2ufc9v3vt6xf4yjv5z8uttq783p76htnxdk6gyavxzaw02pp6f9sc7vnqkmrfsj86qwyqywrrmu'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '1086589829'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: 'bedcfc581f78fef99268eccaef57bf0d3d4518884164e3e02d4ec33a392d3975:1'
            }
          },
          metadata: {
            tokenBundle: [
              {
                policyId: '15f86c4f16d51f1890b2416e329c281befd2e42f919839152e73f0b9',
                tokens: [
                  {
                    currency: {
                      decimals: 0,
                      symbol: '53544152'
                    },
                    value: '1000000000000'
                  }
                ]
              },
              {
                policyId: '818c4c891e543a4d9487b6c18e8b7ed7f0f0870158c45f94e547e7b1',
                tokens: [
                  {
                    currency: {
                      decimals: 0,
                      symbol: '4f47'
                    },
                    value: '5000'
                  }
                ]
              },
              {
                policyId: 'dfbe6e3399373ff93183e27a0a22ec5d735fbb1668a334ce8714776b',
                tokens: [
                  {
                    currency: {
                      decimals: 0,
                      symbol: '4d55474759'
                    },
                    value: '445'
                  }
                ]
              },
              {
                policyId: 'eb970e28464be9486a779759828d79fb7a7154782b93e3f5e26875a9',
                tokens: [
                  {
                    currency: {
                      decimals: 0,
                      symbol: '4d454d45'
                    },
                    value: '2'
                  }
                ]
              }
            ]
          },
          operation_identifier: {
            index: 2,
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
            address:
              'addr1q8a3rmnxnp986vy3tzz3vd3mdk9lmjnnw6w68uaaa8g4t4u5lddnau28pea3mdy84uls504lsc7uk9zyzmqtcxyy7jyqqjm7sg'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '1444443'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: 'bedcfc581f78fef99268eccaef57bf0d3d4518884164e3e02d4ec33a392d3975:0'
            }
          },
          metadata: {
            tokenBundle: [
              {
                policyId: '818c4c891e543a4d9487b6c18e8b7ed7f0f0870158c45f94e547e7b1',
                tokens: [
                  {
                    currency: {
                      decimals: 0,
                      symbol: '4f47'
                    },
                    value: '5000'
                  }
                ]
              }
            ]
          },
          operation_identifier: {
            index: 3,
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
        }
      ],
      transaction_identifier: {
        hash: 'bedcfc581f78fef99268eccaef57bf0d3d4518884164e3e02d4ec33a392d3975'
      }
    }
  }
];

export const searchTxWithAllFiltersDelegationsOrOperator = [
  {
    block_identifier: {
      hash: '56b40fff73f4a3bc946b516d507b822eb92781f67327bc7bb6f46a08dd5dfdf0',
      index: 5412127
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 332
      },
      operations: [
        {
          account: {
            address:
              'addr1q9ux256a00fp5893hxus848x3et4e2r0r68fghgq7hy9lhh4whm9xf2k2arpgzkdpkj4kc4n99lwx4t2c0rh94csnafqpnkh98'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-10333720'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '2f82cbfbbced8b4f2a3f3a79819c0db1bb802110333ef8cf343b560fc0a9ba4e:0'
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
            address:
              'addr1q8a3rmnxnp986vy3tzz3vd3mdk9lmjnnw6w68uaaa8g4t4u5lddnau28pea3mdy84uls504lsc7uk9zyzmqtcxyy7jyqqjm7sg'
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
              identifier: '038e318f0deef63f44be78a8224c06d3faae683f48eb0215a448ab13fd1eb540:0'
            }
          },
          metadata: {
            tokenBundle: [
              {
                policyId: 'cebbcd14c5b11ca83d7ef93b02acfc0bcb372066bdee259f6cd9ae6c',
                tokens: [
                  {
                    currency: {
                      decimals: 0,
                      symbol: '46555a5a'
                    },
                    value: '1000000'
                  }
                ]
              }
            ]
          },
          operation_identifier: {
            index: 1,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        },
        {
          account: {
            address:
              'addr1q9ux256a00fp5893hxus848x3et4e2r0r68fghgq7hy9lhh4whm9xf2k2arpgzkdpkj4kc4n99lwx4t2c0rh94csnafqpnkh98'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '8155239'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '038e318f0deef63f44be78a8224c06d3faae683f48eb0215a448ab13fd1eb540:1'
            }
          },
          operation_identifier: {
            index: 2,
            network_index: 1
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '038e318f0deef63f44be78a8224c06d3faae683f48eb0215a448ab13fd1eb540'
      }
    }
  },
  {
    block_identifier: {
      hash: '56b40fff73f4a3bc946b516d507b822eb92781f67327bc7bb6f46a08dd5dfdf0',
      index: 5412127
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 425
      },
      operations: [
        {
          account: {
            address:
              'addr1qyvlxycd7s9xyr3su4tvj3avqpdgh3e932qndtvfqjqqdnhhtxlxdtdt23jm63frlupmra6xhljuz9qpw9u33pg5c72s6wk2qn'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-9000000'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: 'b77c14177c4a73171b45b0ded011aad11c5ce36f418248ff022a237d8774a583:9'
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
            address: 'stake1u8m4n0nx4k44gedag53l7qa37artlewpzsqhz7gcs52v09g7yzw83'
          },
          metadata: {
            depositAmount: {
              currency: {
                decimals: 6,
                symbol: 'ADA'
              },
              value: '2000000'
            }
          },
          operation_identifier: {
            index: 1
          },
          status: 'success',
          type: 'stakeKeyRegistration'
        },
        {
          account: {
            address: 'stake1u8m4n0nx4k44gedag53l7qa37artlewpzsqhz7gcs52v09g7yzw83'
          },
          metadata: {
            pool_key_hash: '68f866aa0448d8066426be9e913c171f7f8cc07c0def4eaf92e5df2b'
          },
          operation_identifier: {
            index: 2
          },
          status: 'success',
          type: 'stakeDelegation'
        },
        {
          account: {
            address:
              'addr1qxcm07tsmsa2zyn0npeqqywgjj2uvgxqae2tveuv3u2xq28htxlxdtdt23jm63frlupmra6xhljuz9qpw9u33pg5c72sudjjgu'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '6825743'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '19e6ff88afe560c4bc0b5f88a96fcb32649b2c70c981d444737003e7f21bb222:0'
            }
          },
          operation_identifier: {
            index: 3,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '19e6ff88afe560c4bc0b5f88a96fcb32649b2c70c981d444737003e7f21bb222'
      }
    }
  }
];

export const searchTxWithAllFiltersDeregistrationsOrOperator = [
  {
    block_identifier: {
      hash: '56b40fff73f4a3bc946b516d507b822eb92781f67327bc7bb6f46a08dd5dfdf0',
      index: 5412127
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 332
      },
      operations: [
        {
          account: {
            address:
              'addr1q9ux256a00fp5893hxus848x3et4e2r0r68fghgq7hy9lhh4whm9xf2k2arpgzkdpkj4kc4n99lwx4t2c0rh94csnafqpnkh98'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-10333720'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '2f82cbfbbced8b4f2a3f3a79819c0db1bb802110333ef8cf343b560fc0a9ba4e:0'
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
            address:
              'addr1q8a3rmnxnp986vy3tzz3vd3mdk9lmjnnw6w68uaaa8g4t4u5lddnau28pea3mdy84uls504lsc7uk9zyzmqtcxyy7jyqqjm7sg'
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
              identifier: '038e318f0deef63f44be78a8224c06d3faae683f48eb0215a448ab13fd1eb540:0'
            }
          },
          metadata: {
            tokenBundle: [
              {
                policyId: 'cebbcd14c5b11ca83d7ef93b02acfc0bcb372066bdee259f6cd9ae6c',
                tokens: [
                  {
                    currency: {
                      decimals: 0,
                      symbol: '46555a5a'
                    },
                    value: '1000000'
                  }
                ]
              }
            ]
          },
          operation_identifier: {
            index: 1,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        },
        {
          account: {
            address:
              'addr1q9ux256a00fp5893hxus848x3et4e2r0r68fghgq7hy9lhh4whm9xf2k2arpgzkdpkj4kc4n99lwx4t2c0rh94csnafqpnkh98'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '8155239'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '038e318f0deef63f44be78a8224c06d3faae683f48eb0215a448ab13fd1eb540:1'
            }
          },
          operation_identifier: {
            index: 2,
            network_index: 1
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '038e318f0deef63f44be78a8224c06d3faae683f48eb0215a448ab13fd1eb540'
      }
    }
  },
  {
    block_identifier: {
      hash: '4d9eaeffa13b9039af5b5609800976b0e8f63244bda5672cad8109dd96c2a586',
      index: 5412108
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 626
      },
      operations: [
        {
          account: {
            address:
              'addr1q9nhflklv4jhy7v80zjykek979vm9k46wme0qw9aq6y72f783p76htnxdk6gyavxzaw02pp6f9sc7vnqkmrfsj86qwyqu0el3w'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-1084217373'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '6e855e0651c4dc9edc3931d564eb89352f216ef9d7ed676016d4a8ee67432001:1'
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
            address:
              'addr1qyfkcp605xkss5hhjqsy0km65kzj5qw6ua2lteh7828zgww83p76htnxdk6gyavxzaw02pp6f9sc7vnqkmrfsj86qwyqaz2zkm'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-4000000'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '809071a963b789091ebca23c201a1a88a25278763d65b08272ff1e106acc0389:0'
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
              'addr1qx50dymmdzuz5x3ng3de0kq2ufc9v3vt6xf4yjv5z8uttq783p76htnxdk6gyavxzaw02pp6f9sc7vnqkmrfsj86qwyqywrrmu'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '1086589829'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: 'bedcfc581f78fef99268eccaef57bf0d3d4518884164e3e02d4ec33a392d3975:1'
            }
          },
          metadata: {
            tokenBundle: [
              {
                policyId: '15f86c4f16d51f1890b2416e329c281befd2e42f919839152e73f0b9',
                tokens: [
                  {
                    currency: {
                      decimals: 0,
                      symbol: '53544152'
                    },
                    value: '1000000000000'
                  }
                ]
              },
              {
                policyId: '818c4c891e543a4d9487b6c18e8b7ed7f0f0870158c45f94e547e7b1',
                tokens: [
                  {
                    currency: {
                      decimals: 0,
                      symbol: '4f47'
                    },
                    value: '5000'
                  }
                ]
              },
              {
                policyId: 'dfbe6e3399373ff93183e27a0a22ec5d735fbb1668a334ce8714776b',
                tokens: [
                  {
                    currency: {
                      decimals: 0,
                      symbol: '4d55474759'
                    },
                    value: '445'
                  }
                ]
              },
              {
                policyId: 'eb970e28464be9486a779759828d79fb7a7154782b93e3f5e26875a9',
                tokens: [
                  {
                    currency: {
                      decimals: 0,
                      symbol: '4d454d45'
                    },
                    value: '2'
                  }
                ]
              }
            ]
          },
          operation_identifier: {
            index: 2,
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
            address:
              'addr1q8a3rmnxnp986vy3tzz3vd3mdk9lmjnnw6w68uaaa8g4t4u5lddnau28pea3mdy84uls504lsc7uk9zyzmqtcxyy7jyqqjm7sg'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '1444443'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: 'bedcfc581f78fef99268eccaef57bf0d3d4518884164e3e02d4ec33a392d3975:0'
            }
          },
          metadata: {
            tokenBundle: [
              {
                policyId: '818c4c891e543a4d9487b6c18e8b7ed7f0f0870158c45f94e547e7b1',
                tokens: [
                  {
                    currency: {
                      decimals: 0,
                      symbol: '4f47'
                    },
                    value: '5000'
                  }
                ]
              }
            ]
          },
          operation_identifier: {
            index: 3,
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
        }
      ],
      transaction_identifier: {
        hash: 'bedcfc581f78fef99268eccaef57bf0d3d4518884164e3e02d4ec33a392d3975'
      }
    }
  }
];

export const searchTxWithAllFiltersStakeRegistrationOrOperator = [
  {
    block_identifier: {
      hash: '56b40fff73f4a3bc946b516d507b822eb92781f67327bc7bb6f46a08dd5dfdf0',
      index: 5412127
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 332
      },
      operations: [
        {
          account: {
            address:
              'addr1q9ux256a00fp5893hxus848x3et4e2r0r68fghgq7hy9lhh4whm9xf2k2arpgzkdpkj4kc4n99lwx4t2c0rh94csnafqpnkh98'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-10333720'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '2f82cbfbbced8b4f2a3f3a79819c0db1bb802110333ef8cf343b560fc0a9ba4e:0'
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
            address:
              'addr1q8a3rmnxnp986vy3tzz3vd3mdk9lmjnnw6w68uaaa8g4t4u5lddnau28pea3mdy84uls504lsc7uk9zyzmqtcxyy7jyqqjm7sg'
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
              identifier: '038e318f0deef63f44be78a8224c06d3faae683f48eb0215a448ab13fd1eb540:0'
            }
          },
          metadata: {
            tokenBundle: [
              {
                policyId: 'cebbcd14c5b11ca83d7ef93b02acfc0bcb372066bdee259f6cd9ae6c',
                tokens: [
                  {
                    currency: {
                      decimals: 0,
                      symbol: '46555a5a'
                    },
                    value: '1000000'
                  }
                ]
              }
            ]
          },
          operation_identifier: {
            index: 1,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        },
        {
          account: {
            address:
              'addr1q9ux256a00fp5893hxus848x3et4e2r0r68fghgq7hy9lhh4whm9xf2k2arpgzkdpkj4kc4n99lwx4t2c0rh94csnafqpnkh98'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '8155239'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '038e318f0deef63f44be78a8224c06d3faae683f48eb0215a448ab13fd1eb540:1'
            }
          },
          operation_identifier: {
            index: 2,
            network_index: 1
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '038e318f0deef63f44be78a8224c06d3faae683f48eb0215a448ab13fd1eb540'
      }
    }
  },
  {
    block_identifier: {
      hash: '56b40fff73f4a3bc946b516d507b822eb92781f67327bc7bb6f46a08dd5dfdf0',
      index: 5412127
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 425
      },
      operations: [
        {
          account: {
            address:
              'addr1qyvlxycd7s9xyr3su4tvj3avqpdgh3e932qndtvfqjqqdnhhtxlxdtdt23jm63frlupmra6xhljuz9qpw9u33pg5c72s6wk2qn'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-9000000'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: 'b77c14177c4a73171b45b0ded011aad11c5ce36f418248ff022a237d8774a583:9'
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
            address: 'stake1u8m4n0nx4k44gedag53l7qa37artlewpzsqhz7gcs52v09g7yzw83'
          },
          metadata: {
            depositAmount: {
              currency: {
                decimals: 6,
                symbol: 'ADA'
              },
              value: '2000000'
            }
          },
          operation_identifier: {
            index: 1
          },
          status: 'success',
          type: 'stakeKeyRegistration'
        },
        {
          account: {
            address: 'stake1u8m4n0nx4k44gedag53l7qa37artlewpzsqhz7gcs52v09g7yzw83'
          },
          metadata: {
            pool_key_hash: '68f866aa0448d8066426be9e913c171f7f8cc07c0def4eaf92e5df2b'
          },
          operation_identifier: {
            index: 2
          },
          status: 'success',
          type: 'stakeDelegation'
        },
        {
          account: {
            address:
              'addr1qxcm07tsmsa2zyn0npeqqywgjj2uvgxqae2tveuv3u2xq28htxlxdtdt23jm63frlupmra6xhljuz9qpw9u33pg5c72sudjjgu'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '6825743'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '19e6ff88afe560c4bc0b5f88a96fcb32649b2c70c981d444737003e7f21bb222:0'
            }
          },
          operation_identifier: {
            index: 3,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '19e6ff88afe560c4bc0b5f88a96fcb32649b2c70c981d444737003e7f21bb222'
      }
    }
  }
];

export const searchTxWithAllFiltersVoteRegistrationOrOperator = [
  {
    block_identifier: {
      hash: '56b40fff73f4a3bc946b516d507b822eb92781f67327bc7bb6f46a08dd5dfdf0',
      index: 5412127
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 332
      },
      operations: [
        {
          account: {
            address:
              'addr1q9ux256a00fp5893hxus848x3et4e2r0r68fghgq7hy9lhh4whm9xf2k2arpgzkdpkj4kc4n99lwx4t2c0rh94csnafqpnkh98'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-10333720'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '2f82cbfbbced8b4f2a3f3a79819c0db1bb802110333ef8cf343b560fc0a9ba4e:0'
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
            address:
              'addr1q8a3rmnxnp986vy3tzz3vd3mdk9lmjnnw6w68uaaa8g4t4u5lddnau28pea3mdy84uls504lsc7uk9zyzmqtcxyy7jyqqjm7sg'
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
              identifier: '038e318f0deef63f44be78a8224c06d3faae683f48eb0215a448ab13fd1eb540:0'
            }
          },
          metadata: {
            tokenBundle: [
              {
                policyId: 'cebbcd14c5b11ca83d7ef93b02acfc0bcb372066bdee259f6cd9ae6c',
                tokens: [
                  {
                    currency: {
                      decimals: 0,
                      symbol: '46555a5a'
                    },
                    value: '1000000'
                  }
                ]
              }
            ]
          },
          operation_identifier: {
            index: 1,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        },
        {
          account: {
            address:
              'addr1q9ux256a00fp5893hxus848x3et4e2r0r68fghgq7hy9lhh4whm9xf2k2arpgzkdpkj4kc4n99lwx4t2c0rh94csnafqpnkh98'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '8155239'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '038e318f0deef63f44be78a8224c06d3faae683f48eb0215a448ab13fd1eb540:1'
            }
          },
          operation_identifier: {
            index: 2,
            network_index: 1
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '038e318f0deef63f44be78a8224c06d3faae683f48eb0215a448ab13fd1eb540'
      }
    }
  },
  {
    block_identifier: {
      hash: '56b40fff73f4a3bc946b516d507b822eb92781f67327bc7bb6f46a08dd5dfdf0',
      index: 5412127
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 535
      },
      operations: [
        {
          account: {
            address:
              'addr1qxqxphm80tt8yyu25cy3w6k45kcmhy0ec8wtds57vy7jnwl3vdnqjcaf0s2xxaupf67k50pgulcujcyh20l8vx2x92ms609ga6'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-22620000000'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '9ded65803caa08ab0805e566f504cb5f2a1e078e6e2d94816cfcf69e77b94d06:0'
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
            address:
              'addr1q9x3j88pwufrnttdcaft9rnsmxnjnvlck064l905ul3hmkh3vdnqjcaf0s2xxaupf67k50pgulcujcyh20l8vx2x92msk33lpr'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '1000000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '06aa4452446ddbd0773694bfe4f5d2ba2faa05bbf96ae318f115ca3633cc30d1:0'
            }
          },
          operation_identifier: {
            index: 1,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        },
        {
          account: {
            address:
              'addr1qyvgatmpv9g2q4wnjkl5eqhcy62vl39lr3vattj3wk5aqvl3vdnqjcaf0s2xxaupf67k50pgulcujcyh20l8vx2x92ms2e8d94'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '22618820639'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '06aa4452446ddbd0773694bfe4f5d2ba2faa05bbf96ae318f115ca3633cc30d1:1'
            }
          },
          operation_identifier: {
            index: 2,
            network_index: 1
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '06aa4452446ddbd0773694bfe4f5d2ba2faa05bbf96ae318f115ca3633cc30d1'
      }
    }
  }
];

export const searchTxWithAllFiltersWithdrawalOrOperator = [
  {
    block_identifier: {
      hash: '56b40fff73f4a3bc946b516d507b822eb92781f67327bc7bb6f46a08dd5dfdf0',
      index: 5412127
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 332
      },
      operations: [
        {
          account: {
            address:
              'addr1q9ux256a00fp5893hxus848x3et4e2r0r68fghgq7hy9lhh4whm9xf2k2arpgzkdpkj4kc4n99lwx4t2c0rh94csnafqpnkh98'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-10333720'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '2f82cbfbbced8b4f2a3f3a79819c0db1bb802110333ef8cf343b560fc0a9ba4e:0'
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
            address:
              'addr1q8a3rmnxnp986vy3tzz3vd3mdk9lmjnnw6w68uaaa8g4t4u5lddnau28pea3mdy84uls504lsc7uk9zyzmqtcxyy7jyqqjm7sg'
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
              identifier: '038e318f0deef63f44be78a8224c06d3faae683f48eb0215a448ab13fd1eb540:0'
            }
          },
          metadata: {
            tokenBundle: [
              {
                policyId: 'cebbcd14c5b11ca83d7ef93b02acfc0bcb372066bdee259f6cd9ae6c',
                tokens: [
                  {
                    currency: {
                      decimals: 0,
                      symbol: '46555a5a'
                    },
                    value: '1000000'
                  }
                ]
              }
            ]
          },
          operation_identifier: {
            index: 1,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        },
        {
          account: {
            address:
              'addr1q9ux256a00fp5893hxus848x3et4e2r0r68fghgq7hy9lhh4whm9xf2k2arpgzkdpkj4kc4n99lwx4t2c0rh94csnafqpnkh98'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '8155239'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '038e318f0deef63f44be78a8224c06d3faae683f48eb0215a448ab13fd1eb540:1'
            }
          },
          operation_identifier: {
            index: 2,
            network_index: 1
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '038e318f0deef63f44be78a8224c06d3faae683f48eb0215a448ab13fd1eb540'
      }
    }
  },
  {
    block_identifier: {
      hash: '56b40fff73f4a3bc946b516d507b822eb92781f67327bc7bb6f46a08dd5dfdf0',
      index: 5412127
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 569
      },
      operations: [
        {
          account: {
            address:
              'addr1qyv37shdezla9nmt9qxdkkmp0ztlf4fzxuw6hulnly6s83serapwmj9l6t8kk2qvmddkz7yh7n2jydca40el87f4q0rquz4m0n'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-1000000'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '98ac204f9d4468fb49990fd6649a23212aabcd718a723b76df4d4141a4d0ec31:0'
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
            address:
              'addr1qyv37shdezla9nmt9qxdkkmp0ztlf4fzxuw6hulnly6s83serapwmj9l6t8kk2qvmddkz7yh7n2jydca40el87f4q0rquz4m0n'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-20803984003'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '98ac204f9d4468fb49990fd6649a23212aabcd718a723b76df4d4141a4d0ec31:1'
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
            address: 'stake1uyv37shdezla9nmt9qxdkkmp0ztlf4fzxuw6hulnly6s83ssj83qz'
          },
          metadata: {
            withdrawalAmount: {
              currency: {
                decimals: 6,
                symbol: 'ADA'
              },
              value: '-12883328'
            }
          },
          operation_identifier: {
            index: 2
          },
          status: 'success',
          type: 'withdrawal'
        },
        {
          account: {
            address:
              'addr1qyv37shdezla9nmt9qxdkkmp0ztlf4fzxuw6hulnly6s83serapwmj9l6t8kk2qvmddkz7yh7n2jydca40el87f4q0rquz4m0n'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '1000000'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: 'cfc6c40faa732f3921935bf0241631b6a2568691315d2120f13c81282b9b874f:0'
            }
          },
          operation_identifier: {
            index: 3,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            },
            {
              index: 1
            },
            {
              index: 2
            }
          ],
          status: 'success',
          type: 'output'
        },
        {
          account: {
            address:
              'addr1qyv37shdezla9nmt9qxdkkmp0ztlf4fzxuw6hulnly6s83serapwmj9l6t8kk2qvmddkz7yh7n2jydca40el87f4q0rquz4m0n'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '20816674727'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: 'cfc6c40faa732f3921935bf0241631b6a2568691315d2120f13c81282b9b874f:1'
            }
          },
          operation_identifier: {
            index: 4,
            network_index: 1
          },
          related_operations: [
            {
              index: 0
            },
            {
              index: 1
            },
            {
              index: 2
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: 'cfc6c40faa732f3921935bf0241631b6a2568691315d2120f13c81282b9b874f'
      }
    }
  }
];

export const searchTxsWithPoolRegistrationCoinFilters = [
  {
    block_identifier: {
      hash: '8839b697618eb1b3167bcd2658e10008d9c1d11bd32b305abf497371cd79dafa',
      index: 4597779
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 723
      },
      operations: [
        {
          account: {
            address:
              'addr1q9wm6dpp9zgund873xluc5wzz3z8dqf04uxvnnafa9tc834sp4f25adz7r8sgwkq3g473htcsramrcwh25twnew0hf2sfma70k'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-52425749'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: 'cda78e5074d4e7d9de0cfb5c4b503b02426d545d7d639e8b287f5be3a58e15cb:0'
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
            address: 'stake1uxcq6542wk30pncy8tqg52lgm4ugp7a3u8t429hfuh8m54gs72zj8'
          },
          metadata: {
            pool_key_hash: '15a500a4ae7a375347deaf879a65d54a481de9073005734b3c85fdf3'
          },
          operation_identifier: {
            index: 1
          },
          status: 'success',
          type: 'stakeDelegation'
        },
        {
          account: {
            address: '15a500a4ae7a375347deaf879a65d54a481de9073005734b3c85fdf3'
          },
          metadata: {
            depositAmount: {
              currency: {
                decimals: 6,
                symbol: 'ADA'
              },
              value: '500000000'
            },
            poolRegistrationParams: {
              cost: '340000000',
              margin_percentage: '0.005',
              pledge: '50000000',
              poolOwners: ['stake1uxcq6542wk30pncy8tqg52lgm4ugp7a3u8t429hfuh8m54gs72zj8'],
              relays: [],
              rewardAddress: 'e1b00d52aa75a2f0cf043ac08a2be8dd7880fbb1e1d75516e9e5cfba55',
              vrfKeyHash: '38ee540c8ed10762b6a43ed4a3c3094c1ac76b3ad838c341e3cb92174db4b4d6'
            }
          },
          operation_identifier: {
            index: 2
          },
          status: 'success',
          type: 'poolRegistration'
        },
        {
          account: {
            address:
              'addr1q9wm6dpp9zgund873xluc5wzz3z8dqf04uxvnnafa9tc834sp4f25adz7r8sgwkq3g473htcsramrcwh25twnew0hf2sfma70k'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '52229492'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '29a76dd58c6309cd9cde855c0c50d81d63f921959359b1e544401ac1dbc9b472:0'
            }
          },
          operation_identifier: {
            index: 3,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '29a76dd58c6309cd9cde855c0c50d81d63f921959359b1e544401ac1dbc9b472'
      }
    }
  }
];

export const searchTxWithCoinPoolRetirementFilters = [
  {
    block_identifier: {
      hash: 'ddb008b4a1cad00db90f524b5ba94da94f84b2aabe7de6ff4a0d27d89ed222dd',
      index: 4491210
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 365
      },
      operations: [
        {
          account: {
            address:
              'addr1q94g4wsgtm6hsxlcafvvt6fyprqtlwnme372sndfphlulyxn8j47n0r6werzg0qr7p3gs8gxw39n65uc8q330ztnhxcq9x6600'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-51047025535'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: 'e1d1d61ecd706790ee31a1c07fc87827f7b9738d374ef705d1c8cff8295c8cf0:0'
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
            address: '469fbad36a8a68c5f62f3505ecbe6a461ea262ae20b4de8d39ff08ab'
          },
          metadata: {
            epoch: 209
          },
          operation_identifier: {
            index: 1
          },
          status: 'success',
          type: 'poolRetirement'
        },
        {
          account: {
            address:
              'addr1q94g4wsgtm6hsxlcafvvt6fyprqtlwnme372sndfphlulyxn8j47n0r6werzg0qr7p3gs8gxw39n65uc8q330ztnhxcq9x6600'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '51046846482'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '896cf8fefad1eaf0fa056ba3adf28bfb26b06d1beed64cf790deb595dcb2687a:0'
            }
          },
          operation_identifier: {
            index: 2,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '896cf8fefad1eaf0fa056ba3adf28bfb26b06d1beed64cf790deb595dcb2687a'
      }
    }
  }
];

export const searchTxWithCoinDelegationFilters = [
  {
    block_identifier: {
      hash: 'ddb008b4a1cad00db90f524b5ba94da94f84b2aabe7de6ff4a0d27d89ed222dd',
      index: 4491210
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 429
      },
      operations: [
        {
          account: {
            address:
              'addr1qysz93vdwk04ky3l2mdmet4crt4uh7pw9tafu7994z8wc2tdy6wmax33kvvhuvh9pq67a5rvp8zdsetzptdv989slfvqlqxe9t'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-250000000000'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '4c4c8d536f43c8f123dab5e33bb412713b1d962f795b0851a996f64f37099ea1:0'
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
            address: 'stake1u9kjd8d7ngcmxxt7xtjssd0w6pkqn3xcv43q4kkznjc05kqmv29ge'
          },
          metadata: {
            depositAmount: {
              currency: {
                decimals: 6,
                symbol: 'ADA'
              },
              value: '2000000'
            }
          },
          operation_identifier: {
            index: 1
          },
          status: 'success',
          type: 'stakeKeyRegistration'
        },
        {
          account: {
            address: 'stake1u9kjd8d7ngcmxxt7xtjssd0w6pkqn3xcv43q4kkznjc05kqmv29ge'
          },
          metadata: {
            pool_key_hash: 'a631b46315b1567ef0ce2b2ad4cb63faac09f32ceba6716a7e331e5e'
          },
          operation_identifier: {
            index: 2
          },
          status: 'success',
          type: 'stakeDelegation'
        },
        {
          account: {
            address:
              'addr1qxw6e3qvjnh7zpxd0xrcxpq7n5zl0kemkp5l4z0euedfwdrdy6wmax33kvvhuvh9pq67a5rvp8zdsetzptdv989slfvq7k3uas'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '249997825567'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: 'a24795549658d1b7d37a9bb3d4bbff4f29b8a107d7926f9c0be3d47e1cef13eb:0'
            }
          },
          operation_identifier: {
            index: 3,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: 'a24795549658d1b7d37a9bb3d4bbff4f29b8a107d7926f9c0be3d47e1cef13eb'
      }
    }
  }
];

export const searchTxWithCoinDeregistrationFilters = [
  {
    block_identifier: {
      hash: '185107d5ecd969cb4961949ab279703476dbc668f833f80a2d075a9c2d1e80cc',
      index: 5406841
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 399
      },
      operations: [
        {
          account: {
            address:
              'addr1qxswljx9lr59eentu7s8y5jz27j2vljg4hycct6cetf5al0j9td2t4sk87hkmvgzeccfagup4k449665add5afsp3kxsralm4e'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-173179224'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: 'f60a241698f7cab91c7e41df1190b0fde12c54dd5c627050fd09e79d14c9be69:0'
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
            address: 'stake1u8ez4k496ctrltmdkypvuvy75wq6m26jad2wkk6w5cqcmrgevll3r'
          },
          metadata: {
            withdrawalAmount: {
              currency: {
                decimals: 6,
                symbol: 'ADA'
              },
              value: '-242063'
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
            address: 'stake1u8ez4k496ctrltmdkypvuvy75wq6m26jad2wkk6w5cqcmrgevll3r'
          },
          metadata: {
            refundAmount: {
              currency: {
                decimals: 6,
                symbol: 'ADA'
              },
              value: '-2000000'
            }
          },
          operation_identifier: {
            index: 2
          },
          status: 'success',
          type: 'stakeKeyDeregistration'
        },
        {
          account: {
            address:
              'addr1q87mz3a88qf920qc7cjw0ctstfrrsalswuqcms3h3rvqrs8j9td2t4sk87hkmvgzeccfagup4k449665add5afsp3kxsj80ej8'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '175247998'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '71667f9e0350a1fd9e5420043a41048f2895f2fd1bceeb2ffc3fa14382db50cd:0'
            }
          },
          operation_identifier: {
            index: 3,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            },
            {
              index: 1
            },
            {
              index: 2
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: '71667f9e0350a1fd9e5420043a41048f2895f2fd1bceeb2ffc3fa14382db50cd'
      }
    }
  }
];

export const searchTxsWithCoinStakeRegistrationFilters = [
  {
    block_identifier: {
      hash: 'ddb008b4a1cad00db90f524b5ba94da94f84b2aabe7de6ff4a0d27d89ed222dd',
      index: 4491210
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 429
      },
      operations: [
        {
          account: {
            address:
              'addr1qysz93vdwk04ky3l2mdmet4crt4uh7pw9tafu7994z8wc2tdy6wmax33kvvhuvh9pq67a5rvp8zdsetzptdv989slfvqlqxe9t'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-250000000000'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '4c4c8d536f43c8f123dab5e33bb412713b1d962f795b0851a996f64f37099ea1:0'
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
            address: 'stake1u9kjd8d7ngcmxxt7xtjssd0w6pkqn3xcv43q4kkznjc05kqmv29ge'
          },
          metadata: {
            depositAmount: {
              currency: {
                decimals: 6,
                symbol: 'ADA'
              },
              value: '2000000'
            }
          },
          operation_identifier: {
            index: 1
          },
          status: 'success',
          type: 'stakeKeyRegistration'
        },
        {
          account: {
            address: 'stake1u9kjd8d7ngcmxxt7xtjssd0w6pkqn3xcv43q4kkznjc05kqmv29ge'
          },
          metadata: {
            pool_key_hash: 'a631b46315b1567ef0ce2b2ad4cb63faac09f32ceba6716a7e331e5e'
          },
          operation_identifier: {
            index: 2
          },
          status: 'success',
          type: 'stakeDelegation'
        },
        {
          account: {
            address:
              'addr1qxw6e3qvjnh7zpxd0xrcxpq7n5zl0kemkp5l4z0euedfwdrdy6wmax33kvvhuvh9pq67a5rvp8zdsetzptdv989slfvq7k3uas'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '249997825567'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: 'a24795549658d1b7d37a9bb3d4bbff4f29b8a107d7926f9c0be3d47e1cef13eb:0'
            }
          },
          operation_identifier: {
            index: 3,
            network_index: 0
          },
          related_operations: [
            {
              index: 0
            }
          ],
          status: 'success',
          type: 'output'
        }
      ],
      transaction_identifier: {
        hash: 'a24795549658d1b7d37a9bb3d4bbff4f29b8a107d7926f9c0be3d47e1cef13eb'
      }
    }
  }
];

export const searchTxComposedWithdrawal = [
  {
    block_identifier: {
      hash: '185107d5ecd969cb4961949ab279703476dbc668f833f80a2d075a9c2d1e80cc',
      index: 5406841
    },
    transaction: {
      metadata: {
        scriptSize: 0,
        size: 363
      },
      operations: [
        {
          account: {
            address:
              'addr1qyu8kg358hurhr5s0fdndy9hjn9h66qpqu0clv4schpst5gzghmnrkk5qtuaah9mfpkrt3jfa4qf86tc7hj9fmxve0lqesf3q2'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '-1528168456'
          },
          coin_change: {
            coin_action: 'coin_spent',
            coin_identifier: {
              identifier: '83307e326b26566002378f2736f8ebcfed5d4d465b6b3a773fc5b8198a39acdb:1'
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
            address: 'stake1uypytae3mt2q97w7mja5smp4cey76syna9u0tez5anxvhlstgneam'
          },
          metadata: {
            withdrawalAmount: {
              currency: {
                decimals: 6,
                symbol: 'ADA'
              },
              value: '-1100650660'
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
              'addr1q9smf87z0akymg929wf5fz33vcsuf8m0uj4cdt0y3rnrs8czghmnrkk5qtuaah9mfpkrt3jfa4qf86tc7hj9fmxve0lqezsgut'
          },
          amount: {
            currency: {
              decimals: 6,
              symbol: 'ADA'
            },
            value: '2628647587'
          },
          coin_change: {
            coin_action: 'coin_created',
            coin_identifier: {
              identifier: '89cc7f4e39708e93c4087c5ab556420c0e78c3f97cb941d3a75d5f5bdb7554d2:0'
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
        }
      ],
      transaction_identifier: {
        hash: '89cc7f4e39708e93c4087c5ab556420c0e78c3f97cb941d3a75d5f5bdb7554d2'
      }
    }
  }
];
