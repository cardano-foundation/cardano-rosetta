# `rosetta-cli` checks

Requires [rosetta-cli] `v0.5.8` or later 

## `data`
Run a mainnet or testnet instance with the server exposed at `http://localhost:8080`
``` console
rosetta-cli check:data --configuration-file ./data/byron_sample.json
rosetta-cli check:data --configuration-file ./data/shelley_sample.json
rosetta-cli check:data --configuration-file ./data/shelley_transition.json
```

## `construction`
Run a testnet instance with the server exposed at `http://localhost:8081`
``` console
rosetta-cli check:construction --configuration-file ./construction/configuration.json
```

See the [QA doc] for implementation detail.

[rosetta-cli]: https://github.com/coinbase/rosetta-cli#install
[QA doc]: ../../docs/QA.md
