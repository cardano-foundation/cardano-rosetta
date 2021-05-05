# `rosetta-cli` checks

Requires [rosetta-cli] `v0.6.6` or later

## `data`
Run a mainnet instance with the server exposed at `http://localhost:8080`
``` console
./bin/rosetta-cli check:data --configuration-file ./configuration/data/byron_sample.json
./bin/rosetta-cli check:data --configuration-file ./configuration/data/shelley_sample.json
./bin/rosetta-cli check:data --configuration-file ./configuration/data/shelley_transition.json
```

## `construction`

Run a testnet instance with the server exposed at `http://localhost:8081`

### Transfer workflow

In order to run a simple transfer workflow please execute:

``` bash
# The RECIPIENT address where all funds will be sent. Ideally you should use your address or the faucet
RECIPIENT="\"addr_test1qqr585tvlc7ylnqvz8pyqwauzrdu0mxag3m7q56grgmgu7sxu2hyfhlkwuxupa9d5085eunq2qywy7hvmvej456flknswgndm3\"" ./bin/rosetta-cli check:construction --configuration-file ./configuration/construction/configuration.json
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
POOL_KEY_HASH="\"6be215192dc01e5ca4cfba0959586f581a865bfccc2984478dad1657\"" RECIPIENT="\"addr_test1qqr585tvlc7ylnqvz8pyqwauzrdu0mxag3m7q56grgmgu7sxu2hyfhlkwuxupa9d5085eunq2qywy7hvmvej456flknswgndm3\"" ./bin/rosetta-cli check:construction --configuration-file ./configuration/construction/delegation-configuration.json
```

### Single Multi Assets transaction

This workflow tests a transaction that spends (and splits) a single MultiAsset token. So:

1. An address is created and a specific token is expected
2. Sends `total token amount - 1` to the first recipient and just one token to the second one
3. All the ADA (if any left) are sent to an address 

_Note: Running this example is complex as it requires a sender that owns tokens (for example by minting) and can send them to the rosetta-cli generated address. It's strongly recommended to use [this helper scripts](https://github.com/james-iohk/scripts) created by James that will make your life way much easier._

``` bash
# TOKENS_TO_RECEIVE_AMOUNT is the amount of tokens (non-ada) that will be received
# MA_RECIPIENT_1 The address that will receive TOKENS_TO_RECEIVE_AMOUNT - 1
# MA_RECIPIENT_2 The address that will receive 1 token
# TOKEN_NAME Hex encoded token name that will be received
# POLICY_ID Hex encoded policy id linked to the token to be received
# RECIPIENT address that will receive the remaining ADA

TOKENS_TO_RECEIVE_AMOUNT="\"5\"" MA_RECIPIENT_1="\"addr_test1qrdn052npj6t8kx8k6c9ftdquwd29ctgfwxw7adt5h57uqr7qdk9h8zwhgg8m30qgzau09j7v2vm0zdflmc6grsjmqtq7q542z\"" MA_RECIPIENT_2="\"addr_test1qz3tw7ws2n0kf79vafjtw0jfjx787kzxmlx02yqq7e50ggsxu2hyfhlkwuxupa9d5085eunq2qywy7hvmvej456flkns79y22u\"" TOKEN_NAME="\"616c616e5465737431\"" POLICY_ID="\"3e6fc736d30770b830db70994f25111c18987f1407585c0f55ca470f\"" RECIPIENT="\"addr_test1qr670l0rlzv67jfd3d5l9t6rzy7lv9jzt7fnqefckfzv7dtrglt8qqfwllj3h6kw6zly45fk305xreswcds6nxuyyc6s55h05v\"" ./bin/rosetta-cli check:construction --configuration-file ./configuration/construction/transfer-ma.json
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

_Note: Running this example is complex as it requires a sender that owns tokens (for example by minting) and can send them to the rosetta-cli generated address. It's strongly recommended to use [this helper scripts](https://github.com/james-iohk/scripts) created by James that will make your life way much easier._

``` bash
# TOKENS_TO_RECEIVE_AMOUNT_1 is the amount of tokens (non-ada) that will be received
# TOKENS_TO_RECEIVE_AMOUNT_2 is the amount of tokens (non-ada) of the second token that will be received
# MA_RECIPIENT_1 The address that will receive TOKENS_TO_RECEIVE_AMOUNT - 1
# MA_RECIPIENT_2 The address that will receive 1 token
# TOKEN_1_NAME Hex encoded token name that will be received
# TOKEN_2_NAME Hex encoded token name that will be received
# POLICY_ID Hex encoded policy id linked to the token to be received
# RECIPIENT address that will receive the remaining ADA

TOKENS_TO_RECEIVE_AMOUNT_1="\"5\"" TOKENS_TO_RECEIVE_AMOUNT_2="\"8\"" MA_RECIPIENT_1="\"addr_test1qrdn052npj6t8kx8k6c9ftdquwd29ctgfwxw7adt5h57uqr7qdk9h8zwhgg8m30qgzau09j7v2vm0zdflmc6grsjmqtq7q542z\"" MA_RECIPIENT_2="\"addr_test1qz3tw7ws2n0kf79vafjtw0jfjx787kzxmlx02yqq7e50ggsxu2hyfhlkwuxupa9d5085eunq2qywy7hvmvej456flkns79y22u\"" TOKEN_1_NAME="\"616c616e5465737431\"" TOKEN_2_NAME="\"616c616e5465737432\""  POLICY_ID="\"3e6fc736d30770b830db70994f25111c18987f1407585c0f55ca470f\"" RECIPIENT="\"addr_test1qr670l0rlzv67jfd3d5l9t6rzy7lv9jzt7fnqefckfzv7dtrglt8qqfwllj3h6kw6zly45fk305xreswcds6nxuyyc6s55h05v\"" ./bin/rosetta-cli check:construction --configuration-file ./configuration/construction/transfer-multiple-ma.json
```
### Pool registration and pledge

This workflow generates a transaction that:

1. Create two keys, one for staking and one for payments
2. Generates a staking and base address
3. Waits for funds in the base address
4. Creates a transaction that registers the stake certificate and the pool certificate
5. In order to honor the pledge the stake key is registered to the registered pool that is provided as environment variable
6. Broadcasts the transaction and receives the change in the specified address

_Note: Since this example can get quite complex in terms of variable amounts, the minimum of variables was used to create a pool registration certificate. That's the reason why this certificate only has one relay of type "multi host name" since it is the most simple._

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

PUBLIC_COLD_KEY="\"ae0ac567f567602ba6019260dbbeda5300d809088f866e24bf7843d7cd74820c\""  PRIVATE_COLD_KEY="\"afddec3b78b309eb20c8f0c71bfbf001d7009a156432a243a7dff0564c87bc38\"" POOL_KEY_HASH="\"1b075975ced93f4f4d3fee2a7057b17b9774523d00ddd6ef2258f7b1\""
VRF_KEY_HASH="\"9586F48442694EF028BCF67605B4EF650AB9F0F1CD81E181D2DB8D9D5A387E84\""
DNS_NAME="\"relays-new.cardano-testnet.iohkdev.io\""
COST="\"340000000\""
PLEDGE="\"799450000000\""
NUMERATOR="1"
DENOMINATOR="1"
RECIPIENT="\"addr_test1qqr585tvlc7ylnqvz8pyqwauzrdu0mxag3m7q56grgmgu7sxu2hyfhlkwuxupa9d5085eunq2qywy7hvmvej456flknswgndm3\"" 
OWNER_PRIVATE_KEY="\"86387448c67abb1dbab25639ab19e1b18d50d433af3996c88c0bd7a24a9453f7\"" OWNER_PUBLIC_KEY="\"cf0659968dee763ae0cbd4d65468346c48b6b8fdc51d5fcef960632fb37d70ca\"" OWNER_ADDRESS="\"stake_test1updrc9hjghc6s8ewckxyqxqxedmqtddz3vdq7k6xmafeefg4fcmey\"" ./bin/rosetta-cli check:construction --configuration-file ./configuration/construction/transfer-multiple-ma.json
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

RECIPIENT="\"addr_test1qqr585tvlc7ylnqvz8pyqwauzrdu0mxag3m7q56grgmgu7sxu2hyfhlkwuxupa9d5085eunq2qywy7hvmvej456flknswgndm3\"" COLD_KEY_PUBLIC="\"2e2a68224bbbc35031fee909852f87723d2806323bf179c0df99fdd513eecee2\"" COLD_KEY_PRIVATE="\"6c3eab942c6be633bbd2759b131f528c96c664d02241270069a8e96429b0853d\"" POOL_KEY_HASH="\"5778942c610c2f1acf5cdac5c32c10ba5870879674781351e0226326\"" EPOCH=135 ./bin/rosetta-cli check:construction --configuration-file ./pool-retirement-configuration.json
```

See the [QA doc] for implementation detail.

[rosetta-cli]: https://github.com/coinbase/rosetta-cli#install
[QA doc]: ../../docs/QA.md
