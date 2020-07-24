/* eslint-disable camelcase */
export const block1000WithoutTxs = {
  block: {
    block_identifier: {
      index: 1000,
      hash: '0xf84748ae7f413a7f73ddb599fd77e4ed488484c1353c6075a05f30e9c78c9de9'
    },
    parent_block_identifier: {
      index: 999,
      hash: '0x18c7525617b8747a721c3fb003776826fe60a55e64f6b4f5396d06b1ff88ce02'
    },
    timestamp: 1506233871000,
    metadata: {
      transactionsCount: 0,
      createdBy: 'SlotLeader-8e8a7b0f4a23f07a',
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
      index: 65168,
      hash: '0x94049f0e34aee1c5b0b492a57acd054885251e802401f72687a1e79fa1a6e252'
    },
    parent_block_identifier: {
      index: 65167,
      hash: '0x1e783f0c84e0aa06e5b8dbc7965674e8856aebd87838f9466952b5b738381adf'
    },
    timestamp: 1507517771000,
    transactions: [],
    metadata: {
      transactionsCount: 0,
      createdBy: 'SlotLeader-52df0f2c5539b2b1',
      size: 669,
      epochNo: 3,
      slotNo: 65194
    }
  }
};

export const block23236WithTransactions = {
  block: {
    block_identifier: {
      index: 23236,
      hash: '0xac04e4fcaa3057a044ea5be02cae03443fe52bb090f21a1ece81bc83c716b428'
    },
    parent_block_identifier: {
      index: 23235,
      hash: '0x4e1817789d9c78f6a28f98af73673a391794e53da5e9c1f113d446e0e9b574fd'
    },
    timestamp: 1506678871000,
    metadata: {
      transactionsCount: 2,
      createdBy: 'SlotLeader-64c61078e9577d3b',
      size: 1155,
      epochNo: 1,
      slotNo: 23249
    },
    transactions: [
      {
        transaction_identifier: {
          hash: '0xabbeb108ebc3990c7f031113bcb8ce8f306a1eec8f313acffcdcd256379208f4'
        },
        operations: [
          {
            operation_identifier: {
              index: 0,
              network_index: 0
            },
            type: 'transfer',
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
            type: 'transfer',
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
            }
          }
        ]
      },
      {
        transaction_identifier: {
          hash: '0xd864f781436f0122a21335b672fe7943ab1d123f6c2ed770541669d70a870d75'
        },
        operations: [
          {
            operation_identifier: {
              index: 0,
              network_index: 0
            },
            type: 'transfer',
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
            type: 'transfer',
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
            }
          }
        ]
      }
    ]
  }
};
