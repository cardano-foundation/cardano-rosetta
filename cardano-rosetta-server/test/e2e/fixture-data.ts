/* eslint-disable max-len */
import cbor from 'cbor';
import { operationType, SIGNATURE_TYPE } from '../../src/server/utils/constants';

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

export const latestBlock = {
  block: {
    block_identifier: {
      index: 67984,
      hash: 'a2ee76dfea1dae6eda713246df08e96dabc33fc15ac25e3108bb230765c9559c'
    },
    parent_block_identifier: {
      index: 67983,
      hash: 'c4bc9aebc008d270cdd6ee0a0746ee9113ace144e8eba4e7bae7f5d0b03e20d5'
    },
    timestamp: 1507563311000,
    transactions: [],
    metadata: {
      transactionsCount: 0,
      createdBy: 'ByronGenesis-64c61078e9577d3b',
      size: 671,
      epochNo: 3,
      slotNo: 68011
    }
  }
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
            type: operationType.INPUT,
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
            type: operationType.OUTPUT,
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
            type: operationType.INPUT,
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
            type: operationType.OUTPUT,
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
            type: operationType.INPUT,
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
            type: operationType.OUTPUT,
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
            type: operationType.OUTPUT,
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
        type: operationType.OUTPUT,
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

export const CONSTRUCTION_PAYLOADS_REQUEST = {
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
      type: operationType.INPUT,
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
      type: operationType.OUTPUT,
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
      type: operationType.OUTPUT,
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
    ttl: 1000
  }
};

export const CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_REGISTRATION = {
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
      type: operationType.INPUT,
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
      type: operationType.OUTPUT,
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
      type: operationType.OUTPUT,
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
      type: operationType.STAKE_KEY_REGISTRATION,
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
    ttl: 1000
  }
};

export const CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_DEREGISTRATION = {
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
      type: operationType.INPUT,
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
      type: operationType.OUTPUT,
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
      type: operationType.OUTPUT,
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
      type: operationType.STAKE_KEY_DEREGISTRATION,
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
    ttl: 1000
  }
};

export const CONSTRUCTION_PAYLOADS_WITH_STAKE_DELEGATION = {
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
      type: operationType.INPUT,
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
      type: operationType.OUTPUT,
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
      type: operationType.OUTPUT,
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
      type: operationType.STAKE_DELEGATION,
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
    ttl: 1000
  }
};

export const CONSTRUCTION_PAYLOADS_WITH_WITHDRAWAL = {
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
      type: operationType.INPUT,
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
      type: operationType.OUTPUT,
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
      type: operationType.OUTPUT,
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
      type: operationType.WITHDRAWAL,
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
    }
  ],
  metadata: {
    ttl: 1000
  }
};

export const CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_REGISTRATION_AND_WITHDRAWAL = {
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
      type: operationType.INPUT,
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
      type: operationType.OUTPUT,
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
      type: operationType.OUTPUT,
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
      type: operationType.STAKE_KEY_REGISTRATION,
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
      type: operationType.WITHDRAWAL,
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
    }
  ],
  metadata: {
    ttl: 1000
  }
};

export const CONSTRUCTION_PAYLOADS_INVALID_OPERATION_TYPE = {
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
    ttl: 1000
  }
};

export const CONSTRUCTION_PAYLOADS_MULTIPLE_INPUTS = {
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
      type: operationType.INPUT,
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
      type: operationType.INPUT,
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
      type: operationType.OUTPUT,
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
      type: operationType.OUTPUT,
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
    ttl: 1000
  }
};

const CONSTRUCTION_EXTRA_DATA = CONSTRUCTION_PAYLOADS_REQUEST.operations.filter(
  op => op.coin_change?.coin_action === 'coin_spent'
);

export const CONSTRUCTION_PAYLOADS_RESPONSE = cbor
  .encode([
    'a400818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c4002199c40031903e8',
    CONSTRUCTION_EXTRA_DATA
  ])
  .toString('hex');

export const CONSTRUCTION_PAYLOADS_STAKE_REGISTRATION_RESPONSE = cbor
  .encode([
    'a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c4002199c40031903e8048182008200581cbb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb',
    CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_REGISTRATION.operations.filter(
      op => op.coin_change?.coin_action === 'coin_spent'
    )
  ])
  .toString('hex');

export const CONSTRUCTION_PAYLOADS_STAKE_DEREGISTRATION_RESPONSE = cbor
  .encode([
    'a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c4002199c40031903e8048182018200581cbb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb',
    CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_DEREGISTRATION.operations.filter(
      op => op.coin_change?.coin_action === 'coin_spent'
    )
  ])
  .toString('hex');

export const CONSTRUCTION_PAYLOADS_STAKE_DELEGATION_RESPONSE = cbor
  .encode([
    'a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c4002199c40031903e8048183028200581cbb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb581c1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5',
    CONSTRUCTION_PAYLOADS_WITH_STAKE_DELEGATION.operations.filter(op => op.coin_change?.coin_action === 'coin_spent')
  ])
  .toString('hex');

export const CONSTRUCTION_PAYLOADS_WITHDRAWAL_RESPONSE = cbor
  .encode([
    'a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c4002199c40031903e805a1581de1bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb192710',
    CONSTRUCTION_PAYLOADS_WITH_WITHDRAWAL.operations.filter(op => op.coin_change?.coin_action === 'coin_spent')
  ])
  .toString('hex');

export const CONSTRUCTION_PAYLOADS_STAKE_REGISTRATION_AND_WITHDRAWAL_RESPONSE = cbor
  .encode([
    'a600818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c4002199c40031903e8048182008200581cbb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb05a1581de1bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb192710',
    CONSTRUCTION_PAYLOADS_WITH_STAKE_KEY_REGISTRATION_AND_WITHDRAWAL.operations.filter(
      op => op.coin_change?.coin_action === 'coin_spent'
    )
  ])
  .toString('hex');

export const CONSTRUCTION_PAYLOADS_REQUEST_INVALID_OUTPUTS = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  operations: [
    {
      operation_identifier: {
        index: 1,
        network_index: 0
      },
      related_operations: [
        {
          index: 0,
          operation_identifier: {
            index: 0
          }
        }
      ],
      type: operationType.INPUT,
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
          index: 1,
          operation_identifier: {
            index: 0
          }
        }
      ],
      type: operationType.OUTPUT,
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
          index: 2,
          operation_identifier: {
            index: 0
          }
        }
      ],
      type: operationType.OUTPUT,
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
    ttl: 1000
  }
};

export const CONSTRUCTION_PAYLOADS_REQUEST_INVALID_INPUTS = {
  network_identifier: {
    blockchain: 'cardano',
    network: 'mainnet'
  },
  operations: [
    {
      operation_identifier: {
        index: 1,
        network_index: 0
      },
      related_operations: [
        {
          index: 0,
          operation_identifier: {
            index: 0
          }
        }
      ],
      type: operationType.INPUT,
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
          index: 1,
          operation_identifier: {
            index: 0
          }
        }
      ],
      type: operationType.OUTPUT,
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
        index: 1,
        network_index: 0
      },
      related_operations: [
        {
          index: 2,
          operation_identifier: {
            index: 0
          }
        }
      ],
      type: operationType.OUTPUT,
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
    ttl: 1000
  }
};

// Parse operations as the same as the ones sent before but status should be empty
export const CONSTRUCTION_PARSE_OPERATIONS = CONSTRUCTION_PAYLOADS_REQUEST.operations.map(operation => ({
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
      type: operationType.INPUT,
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
      type: operationType.OUTPUT,
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
      type: operationType.OUTPUT,
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
    ttl: 1000
  }
};

export const SIGNED_TRANSACTION =
  '83a400818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c4002199c40031903e8a100818258201b400d60aaf34eaf6dcbab9bba46001a23497886cf11066f7846933d30e5ad3f58406c92508135cb060187a2706ade8154782867b1526e9615d06742be5c56f037ab85894c098c2ab07971133c0477baee92adf3527ad7cc816f13e1e4c361041206f6';

// Preprocess transaction size considers 0 as ttl while the signed transaction is
// using 1000, therefore we need to subtract 2 bytes (that will be added in metadata endpoint)
// eslint-disable-next-line no-magic-numbers
export const TRANSACTION_SIZE_IN_BYTES = SIGNED_TRANSACTION.length / 2 - 2;

// These transactions were signed using a dummy signature, so there's no need to substract 2 bytes
export const SIGNED_TX_WITH_STAKE_KEY_REGISTRATION =
  '83a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c4002199c400300048182008200581cbb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fba100818258200000000000000000000000000000000000000000000000000000000000000000584000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f6';

export const SIGNED_TX_WITH_STAKE_DELEGATION =
  '83a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c4002199c400300048183028200581cbb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb581c1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5a100818258200000000000000000000000000000000000000000000000000000000000000000584000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f6';

export const SIGNED_TX_WITH_WITHDRAWAL =
  '83a500818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c4002199c40030005a1581de1bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb192710a100818258200000000000000000000000000000000000000000000000000000000000000000584000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f6';

export const SIGNED_TX_WITH_STAKE_KEY_REGISTRATION_AND_WITHDRWAWAL =
  '83a600818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c4002199c400300048182008200581cbb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb05a1581de1bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb192710a100818258200000000000000000000000000000000000000000000000000000000000000000584000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f6';

export const TX_WITH_STAKE_KEY_REGISTRATION_SIZE_IN_BYTES = SIGNED_TX_WITH_STAKE_KEY_REGISTRATION.length / 2;

export const TX_WITH_STAKE_DELEGATION_SIZE_IN_BYTES = SIGNED_TX_WITH_STAKE_DELEGATION.length / 2;

export const TX_WITH_WITHDRAWAL_SIZE_IN_BYTES = SIGNED_TX_WITH_WITHDRAWAL.length / 2;

export const TX_WITH_STAKE_KEY_REGISTRATION_AND_WITHDRAWAL_SIZE_IN_BYTES =
  SIGNED_TX_WITH_STAKE_KEY_REGISTRATION_AND_WITHDRWAWAL.length / 2;

export const CONSTRUCTION_SIGNED_TRANSACTION_WITH_EXTRA_DATA = cbor
  .encode([SIGNED_TRANSACTION, CONSTRUCTION_EXTRA_DATA])
  .toString('hex');

export const CONSTRUCTION_UNSIGNED_TRANSACTION_WITH_EXTRA_DATA = cbor
  .encode([
    'a400818258202f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f01018282581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb19271082581d61bb40f1a647bc88c1bd6b738db8eb66357d926474ea5ffd6baa76c9fb199c4002199c40031903e8',
    CONSTRUCTION_EXTRA_DATA
  ])
  .toString('hex');

export const CONSTRUCTION_INVALID_TRANSACTION = cbor.encode(['invalid_tx', CONSTRUCTION_EXTRA_DATA]).toString('hex');

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
