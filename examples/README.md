# Description

In this repository some examples can be found.

**IMPORTANT: DO NOT USE THEM IN MAINNET, OR USE AT YOUR OWN RISK.**

## Requirements

1. `yarn` installed on your system.
1. Launch `cardano-rosetta` server at port `8080`.
1. Install the dependencies:

```javascript
yarn install
```

## Transaction sending

It generates an address based on a predefined private key, asks for funds and once found the address is drained and sent to a specific address.

Important notes:

- `PRIVATE_KEY` will be used to derive the address.
- You can request for testnet funds using the following [faucet](https://testnets.cardano.org/en/cardano/tools/faucet/).
- Funds will be sent to `SEND_FUNDS_ADDRESS` by default as it's the address where testnet funds should be returned.

In order to execute the example, run:

```javascript
$ yarn send-transactions-example
```

Output will look like:

```bash
$ ts-node ./send-transaction-example.ts
[doRun] secretKey 41d9523b87b9bd89a4d07c9b957ae68a7472d8145d7956a692df1a8ad91957a2c117d9dd874447f47306f50a650f1e08bf4bec2cfcb2af91660f23f2db912977
[constructionDerive] Fetching an address for pub key c117d9dd874447f47306f50a650f1e08bf4bec2cfcb2af91660f23f2db912977
[constructionDerive] Retrieved address addr_test1vru64wlzn85v7fecg0mz33lh00wlggqtquvzzuhf6vusyes32jz9w
[waitForFunds] Funds found! 81000000 ADA
[doRun] signed transaction is 83a400818258203eb9fd4c7a23b43d3cb93421a12fb52db465a77feb8075131282a49f43bd8142000181825839000743d16cfe3c4fcc0c11c2403bbc10dbc7ecdd4477e053481a368e7a06e2ae44dff6770dc0f4ada3cf4cf2605008e27aecdb332ad349fda71a049629f0021a003dcc50031a0032300ca10081825820c117d9dd874447f47306f50a650f1e08bf4bec2cfcb2af91660f23f2db9129775840d0b3ed478ad0c4c7c0babfc4336ee05e2b0b48d6fa681e75431ec7af362b9513686a3941e398eacc2a71219d0b9e30426e64ee6fdef17f1977a55a2ddb7f9808f6
Send Transaction finished
Done in 6.14s
```

## Staking key registration and delegation

Uses the staking credentials based on a predefined private key and generates an address from a different predefined private key, asks for funds and once found the address is drained and sent to a specific address.

Important notes:
- You can request for testnet funds using the following [faucet](https://testnets.cardano.org/en/cardano/tools/faucet/).
- Funds will be sent to `SEND_FUNDS_ADDRESS` by default as it's the address where testnet funds should be returned.
- `STAKE_POOL_KEY_HASH` will be used to delegate the staking key.

In order to execute the example, run:

```javascript
$ yarn delegate-stake-example
```