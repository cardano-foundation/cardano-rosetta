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
# The recipient address where all funds will be sent. Ideally you should use your address or the faucet
export RECIPIENT="\"addr_test1qqr585tvlc7ylnqvz8pyqwauzrdu0mxag3m7q56grgmgu7sxu2hyfhlkwuxupa9d5085eunq2qywy7hvmvej456flknswgndm3\""
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
# You need to define which pool are you going to delegate to. Export the pool key hash to do so
export POOL_KEY_HASH="\"6be215192dc01e5ca4cfba0959586f581a865bfccc2984478dad1657\""
# The recipient address where all funds will be sent. Ideally you should use your address or the faucet
export RECIPIENT="\"addr_test1qqr585tvlc7ylnqvz8pyqwauzrdu0mxag3m7q56grgmgu7sxu2hyfhlkwuxupa9d5085eunq2qywy7hvmvej456flknswgndm3\""
./bin/rosetta-cli check:construction --configuration-file ./configuration/construction/delegation-configuration.json
```

See the [QA doc] for implementation detail.

[rosetta-cli]: https://github.com/coinbase/rosetta-cli#install
[QA doc]: ../../docs/QA.md
