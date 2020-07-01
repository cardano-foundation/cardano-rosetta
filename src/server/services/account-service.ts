export interface AccountService {
  accountBalance(
    request: Components.Schemas.AccountBalanceRequest
  ): Promise<Components.Schemas.AccountBalanceResponse | Components.Schemas.Error>;
}

const accountService: AccountService = {
  async accountBalance(req) {
    return {
      block_identifier: {
        index: 1123941,
        hash: '0x1f2cc6c5027d2f201a5453ad1119574d2aed23a392654742ac3c78783c071f85',
      },
      balances: [
        {
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
      ],
      metadata: {
        sequence_number: 23,
      },
    };
  },
};

export default accountService;
