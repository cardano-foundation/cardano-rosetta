export interface BlockService {
  block(request: Components.Schemas.BlockRequest): Promise<Components.Schemas.BlockResponse | Components.Schemas.Error>;
  blockTransaction(
    request: Components.Schemas.BlockTransactionRequest
  ): Promise<Components.Schemas.BlockTransactionResponse | Components.Schemas.Error>;
}

const blockService: BlockService = {
  async block(request) {
    return {
      block: {
        block_identifier: {
          index: 1123941,
          hash: '0x1f2cc6c5027d2f201a5453ad1119574d2aed23a392654742ac3c78783c071f85',
        },
        parent_block_identifier: {
          index: 1123941,
          hash: '0x1f2cc6c5027d2f201a5453ad1119574d2aed23a392654742ac3c78783c071f85',
        },
        timestamp: 1582833600000,
        transactions: [
          {
            transaction_identifier: {
              hash: '0x2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f',
            },
            operations: [
              {
                operation_identifier: {
                  index: 1,
                  network_index: 0,
                },
                related_operations: [
                  {
                    index: 0,
                    operation_identifier: {
                      index: 0,
                    },
                  },
                ],
                type: 'Transfer',
                status: 'Reverted',
                account: {
                  address: '0x3a065000ab4183c6bf581dc1e55a605455fc6d61',
                  sub_account: {
                    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
                    metadata: {},
                  },
                  metadata: {},
                },
                amount: {
                  value: '1238089899992',
                  currency: {
                    symbol: 'BTC',
                    decimals: 8,
                    metadata: {
                      Issuer: 'Satoshi',
                    },
                  },
                  metadata: {},
                },
                metadata: {
                  asm:
                    '304502201fd8abb11443f8b1b9a04e0495e0543d05611473a790c8939f089d073f90509a022100f4677825136605d732e2126d09a2d38c20c75946cd9fc239c0497e84c634e3dd01 03301a8259a12e35694cc22ebc45fee635f4993064190f6ce96e7fb19a03bb6be2',
                  hex:
                    '48304502201fd8abb11443f8b1b9a04e0495e0543d05611473a790c8939f089d073f90509a022100f4677825136605d732e2126d09a2d38c20c75946cd9fc239c0497e84c634e3dd012103301a8259a12e35694cc22ebc45fee635f4993064190f6ce96e7fb19a03bb6be2',
                },
              },
            ],
            metadata: {
              size: 12378,
              lockTime: 1582272577,
            },
          },
        ],
        metadata: {
          transactions_root: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
          difficulty: '123891724987128947',
        },
      },
      other_transactions: [
        {
          hash: '0x2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f',
        },
      ],
    };
  },
  async blockTransaction(request) {
    return {
      transaction: {
        transaction_identifier: {
          hash: '0x2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f',
        },
        operations: [
          {
            operation_identifier: {
              index: 1,
              network_index: 0,
            },
            related_operations: [
              {
                index: 0,
                operation_identifier: {
                  index: 0,
                },
              },
            ],
            type: 'Transfer',
            status: 'Reverted',
            account: {
              address: '0x3a065000ab4183c6bf581dc1e55a605455fc6d61',
              sub_account: {
                address: '0x6b175474e89094c44da98b954eedeac495271d0f',
                metadata: {},
              },
              metadata: {},
            },
            amount: {
              value: '1238089899992',
              currency: {
                symbol: 'BTC',
                decimals: 8,
                metadata: {
                  Issuer: 'Satoshi',
                },
              },
              metadata: {},
            },
            metadata: {
              asm:
                '304502201fd8abb11443f8b1b9a04e0495e0543d05611473a790c8939f089d073f90509a022100f4677825136605d732e2126d09a2d38c20c75946cd9fc239c0497e84c634e3dd01 03301a8259a12e35694cc22ebc45fee635f4993064190f6ce96e7fb19a03bb6be2',
              hex:
                '48304502201fd8abb11443f8b1b9a04e0495e0543d05611473a790c8939f089d073f90509a022100f4677825136605d732e2126d09a2d38c20c75946cd9fc239c0497e84c634e3dd012103301a8259a12e35694cc22ebc45fee635f4993064190f6ce96e7fb19a03bb6be2',
            },
          },
        ],
        metadata: {
          size: 12378,
          lockTime: 1582272577,
        },
      },
    };
  },
};

export default blockService;
