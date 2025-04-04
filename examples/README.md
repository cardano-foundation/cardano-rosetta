# Description

In this repository some examples can be found.

**IMPORTANT: DO NOT USE THEM IN MAINNET, OR USE AT YOUR OWN RISK.**

## Requirements

1. `yarn` installed on your system.
1. Launch `cardano-rosetta` server and define path in `variables.ts`
1. Install the dependencies:

```javascript
yarn install
```

## Transaction sending

It generates an address based on a predefined private key, asks for funds and once found the address is drained and sent to a specific address. This example resembles how a Cardano based payment processing system could be implemented:

- An address is generated for each user willing to pay for something. Each public key to be used could be derived using any BIP32 compliant wallet.
- The script constantly monitors the blockchain for transactions.
- Once funds are received they can be moved somewhere else.

Important notes:
- All variables are defined in `variables.ts`
- **This example doesn't follow `rosetta-cli` workflow.**
- `MNEMONIC` will be used to derive the address.
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

## Sending transactions with cardano-address example
This example uses extended keys that have been created using [`cardano-address`](https://github.com/input-output-hk/cardano-addresses) with the following commands:
```bash
echo "gasp below arrange frown canvas heart pet hole lunar card matter mom very bounce rug tobacco debris raw margin assist source also tuition cluster" > seed.txt
cardano-address key from-recovery-phrase Shelley < seed.txt > root.xsk
cardano-address key child 1852H/1815H/0H/0/0 < root.xsk | cardano-address key public --with-chain-code > addr.xvk
cardano-address address payment --network-tag testnet < addr.xvk > payment.addr
```
In order to execute the example, run:
```javascript
$ yarn send-transaction-using-cardano-address-example
```

## Sending transactions from Byron address

Uses a predefined Byron address to send ADA to `SEND_FUNDS_ADDRESS` address. Because of that the serialization lib is used to sign the transaction.

Important notes:
  - Byron address and the corresponding keys are generated outside Rosetta and this examples.
  - A predefined `CHAIN_CODE` passed as hex string is used to sign the payloads.. 

In order to execute the example, run:

```javascript
$ yarn send-transaction-with-byron-example
```

## Staking key registration, delegation and vote delegation

Uses the staking credentials based on a predefined private key and generates an address from a different predefined private key, asks for funds and once found the address is drained and sent to a specific address.

Important notes:
- You can request for testnet funds using the following [faucet](https://testnets.cardano.org/en/cardano/tools/faucet/).
- Funds will be sent to `SEND_FUNDS_ADDRESS` by default as it's the address where testnet funds should be returned.
- `STAKE_POOL_KEY_HASH` will be used to delegate the staking key.

In order to execute the example, run:

```javascript
$ yarn delegate-stake-example
```

## Withdrawals

Uses predefined payment and staking keys to send a transaction with inputs, outputs, and withdrawal operations. To make withdrawals work previously has to be delegated and earned rewards with the specified staking account.

Important notes:
- `PAYMENT_ADDRESS` is the Base address based on payment keys and `STAKE_ADDRESS` is the Reward address based on stake keys and they are both used to sign the transaction. 
- Funds will be sent to `SEND_FUNDS_ADDRESS` by default as it's the address where testnet funds should be returned.
- `WITHDRAWAL_AMOUNT` will be used to define withdrawal operation's amount. It has to be the total balance at the staking account. 

In order to execute the example, run:

```javascript
$ yarn withdrawal-example
```

## Sending transactions with single multi assets

Sends a transaction that spends a single MultiAsset token. So:

1. A predefined address `PAYMENT_ADDRESS` expects a specific token
2. Sends `total token amount` to another predefined address `SEND_FUNDS_ADDRESS`
3. All the ADA is also sent to that address 

Important notes:
- `EXPECTED_TOKEN` will be used to define the token expected. It requires policy and symbol both defined as hex string.
- Running this example requieres a sender that owns tokens (for example by minting) and can send them to the rosetta-cli generated address. It's strongly recommended to use [this helper scripts](https://github.com/james-iohk/scripts)
- Funds will be sent to `SEND_FUNDS_ADDRESS` by default as it's the address where testnet funds should be returned.

In order to execute the example, run:

```javascript
$ yarn ma-transfer-example
```

## Sending transactions with pool registration and pledge

Sends a transaction that registers a pool and delegates a staking key in order to honor the pledge. So:

1. All the ADA is sent to a predefined address `SEND_FUNDS_ADDRESS`
2. A predefined `POOL_KEY_HASH` is the Ed25519KeyHash as hex string corresponding to `coldKeys`.
3. A predefined `stakingAddress` is the reward address of pool creator corresponding to `stakingKeys`.
4. A predefined `ownerAddress` is the reward address of a pool owner corresponding to `ownerKeys`.
5. A predefined `VRF key hash` is provided to create the pool certificate.

Important notes:
- Staking keys of the creator are used to register a stakey key and delegate that to the pool in order to honor the pledge.
- A minimum of 502 ADA + fees balance is needed in order to pay for pool registration deposit and stake key registration deposit.
- Funds will be sent to `SEND_FUNDS_ADDRESS` by default as it's the address where testnet funds should be returned.

In order to execute the example, run:

```javascript
$ yarn pool-registration-example
```

## Sending transactions with pool registration with cert and pledge

This example does the same as the above one except that the pool registration operation is built through the pool cert. So, a predefined pool cert has been created with the following data:

1. Has as owners the two predefined `ownerAddress`and `ownerTwoAddress`.
2. Pool hash the predefined `POOL_KEY_HASH`.
3. A reward address predfined as `stakingAddress`.

Important notes:
- The hash `POOL_KEY_HASH` corresponds to the pool creator keys `coldKeys`.
- Both owners keys are provided, otherwise it won't be possible to sign payloads.
- A minimum of 502 ADA + fees balance is needed in order to pay for pool registration deposit and stake key registration deposit.

In order to execute the example, run:

```javascript
$ yarn pool-registration-with-cert-example
```

## Sending transactions with pool retirement

Sends a transaction that retires a pool. So:

1. All the ADA is sent to a predefined address `SEND_FUNDS_ADDRESS`.
2. Uses predefined cold keys of pool owner to make the retirement.
3. Uses a predefined `POOL_KEY_HASH` corresponding to those cold keys.
4. Creates payment keys from a predefined `PRIVATE_KEY`.
5. `EPOCH_TO_RETIRE` is the epoch where the pool will be retired.

In order to execute the example, run:

```javascript
$ yarn pool-retirement-example
```

## Sending transactions with Catalyst vote registration

This example uses a predefined `PRIVATE_KEY` to generate a key pair for the address that will send the transaction and where the vote registration takes place.
In order to send a vote, the following data is required:

1. `REWARD_ADDRESS` Staking address which will receive voting rewards.
2. `STAKING_PUBLIC_KEY` Public key of the corresponding staking account passed as hex string.
3. `VOTING_PUBLIC_KEY` Catalyst voting public key.
4. `VOTING_NONCE` Current slot number.
5. `VOTING_SIGNATURE` Previously vote data signed with the staking private key passed as hex string

In order to execute the example, run:

```javascript
$ yarn vote-registration-example
```