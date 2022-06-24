# `rosetta-cli` checks

Requires [rosetta-cli] `v0.6.6` or later and a testnet instance with the server exposed at
`http://localhost:8081`


## `data`
``` console
./bin/rosetta-cli check:data --configuration-file ./configuration/data/byron_sample.json
./bin/rosetta-cli check:data --configuration-file ./configuration/data/shelley_sample.json
./bin/rosetta-cli check:data --configuration-file ./configuration/data/shelley_transition.json
```

## `construction`

Following additional tools are required for generating data for the examples below:
-   `cardano-cli` executable from the [cardano-node](https://github.com/input-output-hk/cardano-node) project
- `bech32` from [bech32](https://github.com/input-output-hk/bech32)
-   `jcli` executable from the [jormungandr](https://github.com/input-output-hk/jormungandr) project (for Voting registration example)
-   `voter-registration` the [voting-tools](https://github.com/input-output-hk/voting-tools) project (for Voting registration example)

For ease of transfering funds and minting tokens also [cardano-wallet](https://github.com/input-output-hk/cardano-wallet) with [ikar] working on top might be handy.
> :information_source: Note that cardano-wallet package from [release](https://github.com/input-output-hk/cardano-wallet/releases) will already contain `cardano-cli`, `cardano-node` and `bech32.`

We will run examples on `testnet` so let us set relevant network id to be reused with `cardano-cli`:
```bash
export NETWORK_ID="--testnet-magic 1097911063"
```

### Transfer workflow

In order to run a simple transfer workflow please execute:

``` bash
# The RECIPIENT address where all funds will be sent. Ideally you should use your address or the faucet
RECIPIENT="\"addr_test1qqr585tvlc7ylnqvz8pyqwauzrdu0mxag3m7q56grgmgu7sxu2hyfhlkwuxupa9d5085eunq2qywy7hvmvej456flknswgndm3\"" \
./bin/rosetta-cli check:construction --configuration-file ./configuration/construction/configuration.json
```

### Delegation workflow

This workflow generates a transaction that:

1. Create two keys, one for staking and one for payments
2. Generates a staking and base address
3. Waits for funds in the base address
4. Creates a transaction that registers the stake certificate and delegates to a pool provided as environment variable
5. Broadcasts the transaction and receives the change in the specified address

``` bash
# You need to define which pool are you going to delegate to. Use the POOL_KEY_HASH to do so
# The RECIPIENT address where all funds will be sent. Ideally you should use your address or the faucet
POOL_KEY_HASH="\"6be215192dc01e5ca4cfba0959586f581a865bfccc2984478dad1657\"" \
RECIPIENT="\"addr_test1qqr585tvlc7ylnqvz8pyqwauzrdu0mxag3m7q56grgmgu7sxu2hyfhlkwuxupa9d5085eunq2qywy7hvmvej456flknswgndm3\"" \
rosetta-cli check:construction --configuration-file ./check/configuration/construction/delegation-configuration.json
```

### Single Multi Assets transaction

This workflow tests a transaction that spends (and splits) a single MultiAsset token. So:

1. An address is created and a specific token is expected
2. Sends `total token amount - 1` to the first recipient and just one token to the second one
3. All the ADA (if any left) are sent to an address

> :information_source: **Note:** Running this example is complex as it requires a sender that owns tokens (for example by minting) and can send them to the rosetta-cli generated address. It's strongly recommended to use [this helper scripts](https://github.com/james-iohk/scripts) created by James that will make your life way much easier.
>
> :information_source: **Note 2:** cardano-wallet now also supports minting of tokens. An option might be also to use it together with [ikar].

``` bash
# TOKENS_TO_RECEIVE_AMOUNT is the amount of tokens (non-ada) that will be received
# MA_RECIPIENT_1 The address that will receive TOKENS_TO_RECEIVE_AMOUNT - 1
# MA_RECIPIENT_2 The address that will receive 1 token
# TOKEN_NAME Hex encoded token name that will be received
# POLICY_ID Hex encoded policy id linked to the token to be received
# RECIPIENT address that will receive the remaining ADA

TOKENS_TO_RECEIVE_AMOUNT="\"5\"" \
MA_RECIPIENT_1="\"addr_test1qrdn052npj6t8kx8k6c9ftdquwd29ctgfwxw7adt5h57uqr7qdk9h8zwhgg8m30qgzau09j7v2vm0zdflmc6grsjmqtq7q542z\"" \
MA_RECIPIENT_2="\"addr_test1qz3tw7ws2n0kf79vafjtw0jfjx787kzxmlx02yqq7e50ggsxu2hyfhlkwuxupa9d5085eunq2qywy7hvmvej456flkns79y22u\"" \
TOKEN_NAME="\"616c616e5465737431\"" \
POLICY_ID="\"3e6fc736d30770b830db70994f25111c18987f1407585c0f55ca470f\"" \
RECIPIENT="\"addr_test1qr670l0rlzv67jfd3d5l9t6rzy7lv9jzt7fnqefckfzv7dtrglt8qqfwllj3h6kw6zly45fk305xreswcds6nxuyyc6s55h05v\"" \
rosetta-cli check:construction --configuration-file ./check/configuration/construction/transfer-ma.json
```

### Multiple MA linked to the same policy

This workflow tests a transaction that spends (and splits) two tokens contained in the same unspent. For example:

```
# Unspent
FAKERushConcertPolicyID {  (Tickets, 500),
                           (VIPTickets, 50)}

# Recipient 1
FAKERushConcertPolicyID {  (Tickets, 499),
                           (VIPTickets, 49)}

# Recipient 2
FAKERushConcertPolicyID {  (Tickets, 1),
                           (VIPTickets, 1)}
```

1. An address is created and a specific token is expected
2. Sends `total token 1 amount - 1 and total token 2 amount` to the first recipient and just one token of each type to the second recipient
3. All the ADA (if any left) are sent to an address

> :information_source: **Note:** Running this example is complex as it requires a sender that owns tokens (for example by minting) and can send them to the rosetta-cli generated address. It's strongly recommended to use [this helper scripts](https://github.com/james-iohk/scripts) created by James that will make your life way much easier.
>
> :information_source: **Note 2:** cardano-wallet now also supports minting of tokens. An option might be also to use it together with [ikar].

``` bash
# TOKENS_TO_RECEIVE_AMOUNT_1 is the amount of tokens (non-ada) that will be received
# TOKENS_TO_RECEIVE_AMOUNT_2 is the amount of tokens (non-ada) of the second token that will be received
# MA_RECIPIENT_1 The address that will receive TOKENS_TO_RECEIVE_AMOUNT - 1
# MA_RECIPIENT_2 The address that will receive 1 token
# TOKEN_1_NAME Hex encoded token name that will be received
# TOKEN_2_NAME Hex encoded token name that will be received
# POLICY_ID Hex encoded policy id linked to the token to be received
# RECIPIENT address that will receive the remaining ADA

TOKENS_TO_RECEIVE_AMOUNT_1="\"5\"" \
TOKENS_TO_RECEIVE_AMOUNT_2="\"8\"" \
MA_RECIPIENT_1="\"addr_test1qrdn052npj6t8kx8k6c9ftdquwd29ctgfwxw7adt5h57uqr7qdk9h8zwhgg8m30qgzau09j7v2vm0zdflmc6grsjmqtq7q542z\"" \
MA_RECIPIENT_2="\"addr_test1qz3tw7ws2n0kf79vafjtw0jfjx787kzxmlx02yqq7e50ggsxu2hyfhlkwuxupa9d5085eunq2qywy7hvmvej456flkns79y22u\"" \
TOKEN_1_NAME="\"616c616e5465737431\"" \
TOKEN_2_NAME="\"616c616e5465737432\"" \
POLICY_ID="\"3e6fc736d30770b830db70994f25111c18987f1407585c0f55ca470f\"" \
RECIPIENT="\"addr_test1qr670l0rlzv67jfd3d5l9t6rzy7lv9jzt7fnqefckfzv7dtrglt8qqfwllj3h6kw6zly45fk305xreswcds6nxuyyc6s55h05v\"" \
rosetta-cli check:construction --configuration-file ./check/configuration/construction/transfer-multiple-ma.json
```
### Pool registration and pledge

This workflow generates a transaction that:

1. Create two keys, one for staking and one for payments
2. Generates a staking and base address
3. Waits for funds in the base address
4. Creates a transaction that registers the stake certificate and the pool certificate
5. In order to honor the pledge the stake key is delegated to the registered pool that is provided as environment variable
6. Broadcasts the transaction and receives the change in the specified address

> :information_source: **Note:** Since this example can get quite complex in terms of variable amounts, the minimum of variables was used to create a pool registration certificate. That's the reason why this certificate only has one relay of type "multi host name" since it is the most simple.

``` bash
# PUBLIC_COLD_KEY Hex encoded public pool creator key
# PRIVATE_COLD_KEY Hex encoded private pool creator key
# POOL_KEY_HASH hash of the pool that will be registered and delegated to
# VRF_KEY_HASH Hex encoded VRF key
# DNS_NAME Hex encoded token name that will be received
# COST String that represents pool cost per epoch in lovelace
# PLEDGE String that represents amount to pledge in lovelace
# NUMERATOR numerator as string passed to specify pool margin
# DENOMINATOR denominator as string passed to specify pool margin
# RECIPIENT address that will receive the remaining ADA
# OWNER_PRIVATE_KEY Hex encoded public owner key
# OWNER_PUBLIC_KEY Hex encoded private owner key
# OWNER_ADDRESS Reward address of pool owner
```
1. Create relevant keys.
```bash
cardano-cli  address key-gen \
 --verification-key-file payment.vkey \
 --signing-key-file payment.skey

cardano-cli  stake-address key-gen \
 --verification-key-file stake.vkey \
 --signing-key-file stake.skey

cardano-cli address build \
 --payment-verification-key-file payment.vkey \
 --stake-verification-key-file stake.vkey \
 --out-file payment.addr \
 $NETWORK_ID

cardano-cli stake-address build \
 --stake-verification-key-file stake.vkey \
 --out-file stake.addr \
 $NETWORK_ID

cardano-cli node key-gen \
--cold-verification-key-file cold.vkey \
--cold-signing-key-file cold.skey \
--operational-certificate-issue-counter-file cold.counter

cardano-cli node key-gen-VRF \
--verification-key-file vrf.vkey \
--signing-key-file vrf.skey
```
2. Run rosetta-cli.
```bash
PUBLIC_COLD_KEY="$(cat cold.vkey | jq .cborHex | cut --complement -c2-5)"  \
PRIVATE_COLD_KEY="$(cat cold.skey | jq .cborHex | cut --complement -c2-5)" \
POOL_KEY_HASH="\"$(cardano-cli stake-pool id --cold-verification-key-file cold.vkey | bech32)\"" \
VRF_KEY_HASH="\"$(cardano-cli node key-hash-VRF --verification-key-file vrf.vkey)\"" \
DNS_NAME="\"relays-new.cardano-testnet.iohkdev.io\"" \
COST="\"340000000\"" \
PLEDGE="\"1000000000\"" \
NUMERATOR="1" \
DENOMINATOR="1" \
RECIPIENT="\"$(cat payment.addr)\"" \
OWNER_PRIVATE_KEY="$(cat stake.skey | jq .cborHex | cut --complement -c2-5)" \
OWNER_PUBLIC_KEY="$(cat stake.vkey | jq .cborHex | cut --complement -c2-5)" \
OWNER_ADDRESS="\"$(cat stake.addr)\"" \
rosetta-cli check:construction --configuration-file ./check/configuration/construction/pool-registration-configuration.json
```

### Pool retirement

This workflow generates a transaction that:

1. Create payment keys
2. Generates an address
3. Waits for funds in the created address
4. Creates a transaction that retires  a pool provided as environment variable
5. Broadcasts the transaction and receives the change in the specified address

_In order to run this example is necessary to pass a previous registered pool and the creator's keys._

``` bash
# COLD_KEY_PUBLIC Hex encoded cold public key of pool creator
# COLD_KEY_PRIVATE Hex encoded cold private key of pool creator
# POOL_KEY_HASH Hex encoded pool key hash
# RECIPIENT address that will receive the remaining ADA
```
1. Generate all relevant keys.
Keys from previous test should be fine.

2. Run rosetta-cli.
```bash
RECIPIENT="\"$(cat payment.addr)\"" \
COLD_KEY_PUBLIC="$(cat cold.vkey | jq .cborHex | cut --complement -c2-5)" \
COLD_KEY_PRIVATE="$(cat cold.skey | jq .cborHex | cut --complement -c2-5)" \
POOL_KEY_HASH="\"$(cardano-cli stake-pool id --cold-verification-key-file cold.vkey | bech32)\"" \
EPOCH=$(expr $(cardano-cli query tip $NETWORK_ID | jq .epoch) + 4) \
rosetta-cli check:construction --configuration-file ./check/configuration/construction/pool-retirement-configuration.json
```
### Pool registration with cert and pledge

This workflow generates a transaction that:

1. Creates payment keys
2. Generates a base address
3. Waits for funds in the base address
4. Creates a transaction that registers the stake certificate and the pool certificate received as environment variable
5. In order to honor the pledge, the stake key is delegated to the registered pool that is provided as environment variable
6. Broadcasts the transaction and receives the change in the specified address

> :warning: **Important Note:** Using this example with Rosetta cli will submit the transaction to the blockchain but will throw the following error "confirmed transaction did not match intent". This happens because this type of operations are returned as "poolRegistration" at /block endpoint while they are created as "poolRegistrationWithCert". Since db-sync doesn't have support for pool registration certs there is no workaround.

``` bash
# POOL_REGISTRATION_CERT Hex encoded Pool Registration Cert
# PUBLIC_COLD_KEY Hex encoded public pool creator key
# PRIVATE_COLD_KEY Hex encoded private pool creator key
# POOL_KEY_HASH hash of the pool that will be registered and delegated to
# STAKE_PRIVATE_KEY Hex encoded public stake key builded in pool cert
# STAKE_PUBLIC_KEY Hex encoded private stake key builded in pool cert
# STAKE_ADDRESS Reward address of pool owner
# OWNER_PRIVATE_KEY Hex encoded public owner key
# OWNER_PUBLIC_KEY Hex encoded private owner key
# OWNER_ADDRESS Reward address of pool owner
# RECIPIENT address that will receive the remaining ADA
```
1. Generate all relevant keys.
Keys from previous test and:

```bash
cardano-cli  stake-address key-gen \
 --verification-key-file stake2.vkey \
 --signing-key-file stake2.skey

cardano-cli stake-address build \
 --stake-verification-key-file stake2.vkey \
 --out-file stake2.addr \
 $NETWORK_ID

cardano-cli stake-pool registration-certificate \
--cold-verification-key-file cold.vkey \
--vrf-verification-key-file vrf.vkey \
--pool-pledge 1000000000 \
--pool-cost 340000000 \
--pool-margin 0.0 \
--pool-reward-account-verification-key-file stake.vkey \
--pool-owner-stake-verification-key-file stake.vkey \
$NETWORK_ID \
--multi-host-pool-relay relays-new.cardano-testnet.iohkdev.io \
--out-file pool.cert
```

2. Run rosetta-cli.

```bash
POOL_REGISTRATION_CERT="$(cat pool.cert | jq .cborHex)" \
PUBLIC_COLD_KEY="$(cat cold.vkey | jq .cborHex | cut --complement -c2-5)" \
PRIVATE_COLD_KEY="$(cat cold.skey | jq .cborHex | cut --complement -c2-5)" \
POOL_KEY_HASH="\"$(cardano-cli stake-pool id --cold-verification-key-file cold.vkey | bech32)\"" \
OWNER_PRIVATE_KEY="$(cat stake2.skey | jq .cborHex | cut --complement -c2-5)" \
OWNER_PUBLIC_KEY="$(cat stake2.vkey | jq .cborHex | cut --complement -c2-5)" \
OWNER_ADDRESS="\"$(cat stake2.addr)\"" \
STAKE_PRIVATE_KEY="$(cat stake.skey | jq .cborHex | cut --complement -c2-5)" \
STAKE_PUBLIC_KEY="$(cat stake.vkey | jq .cborHex | cut --complement -c2-5)" \
RECIPIENT="\"$(cat payment.addr)\"" \
STAKE_ADDRESS="\"$(cat stake.addr)\"" \
rosetta-cli check:construction --configuration-file ./check/configuration/construction/pool-registration-cert-configuration.json
```

### Vote registration

This workflow generates a transaction that:

1. Create payment keys
2. Generates an address
3. Waits for funds in the created address
4. Creates a transaction with the metadata corresponding to a Catalyst vote
5. Broadcasts the transaction and receives the change in the specified address

_In order to run this test, voting data must be generated outside Rosetta and provided as environment variables. In order to understand where those values come from this [link](https://cips.cardano.org/cips/cip15/)  with the metadata format of a Catalyst vote can be useful_

``` bash
# REWARD_ADDRESS Staking address which will receive voting rewards.
# STAKING_PUBLIC_KEY Public key of the corresponding staking account passed as hex string.
# VOTING_PUBLIC_KEY Catalyst voting public key.
# VOTING_NONCE current slot number
# VOTING_SIGNATURE Previously vote data signed with the staking private key passed as hex string
# RECIPIENT address that will receive the remaining ADA
```
1. Generate all relevant keys.

```bash
cardano-cli address key-gen \
    --verification-key-file payment.vkey \
    --signing-key-file payment.skey
cardano-cli address build \
    $NETWORK_ID \
    --payment-verification-key-file payment.vkey \
    --stake-verification-key-file stake.vkey \
    --out-file payment.addr
export PAYMENT_ADDR=$(cat payment.addr)

cardano-cli stake-address key-gen \
    --verification-key-file stake.vkey \
    --signing-key-file stake.skey
cardano-cli stake-address build \
    --stake-verification-key-file stake.vkey \
    $NETWORK_ID \
    --out-file stake.addr
export STAKE_ADDR=$(cat stake.addr)    
export SLOT_TIP=$(cardano-cli query tip $NETWORK_ID | jq '.slot')

jcli key generate \
    --type ed25519extended \
    > vote.skey
jcli key to-public \
    < vote.skey \
    > vote.pub

voter-registration \
    --rewards-address $(cat stake.addr) \
    --vote-public-key-file vote.pub \
    --stake-signing-key-file stake.skey \
    --slot-no $SLOT_TIP \
    --json > metadata.json

export VOTING_PUBLIC_KEY=$(cat metadata.json | jq '.["61284"]["1"][0][0]' | cut --complement -c2-3)
export VOTING_SIGNATURE=$(cat metadata.json | jq '.["61285"]["1"]' | cut --complement -c2-3)
```
2. Run rosetta-cli.
```bash
STAKING_PUBLIC_KEY="$(cat stake.vkey | jq .cborHex | cut --complement -c2-5)" \
REWARD_ADDRESS="\"$STAKE_ADDR\"" \
VOTING_NONCE="\"$SLOT_TIP\"" \
VOTING_PUBLIC_KEY="$VOTING_PUBLIC_KEY" \
VOTING_SIGNATURE="$VOTING_SIGNATURE" \
RECIPIENT="\"$PAYMENT_ADDR\"" \
rosetta-cli check:construction --configuration-file ./check/configuration/construction/vote-registration-configuration.json
```

See the [QA doc] for implementation detail.

[rosetta-cli]: https://github.com/coinbase/rosetta-cli#install
[QA doc]: ../../docs/QA.md
[ikar]: https://github.com/piotr-iohk/ikar
