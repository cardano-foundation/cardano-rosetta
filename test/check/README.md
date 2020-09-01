# [rosetta-cli] check

## `configuration`
The `/src` directory contains modular components, intended to be composed to run a particular 
scenario. For example using [jq]
```console
jq -s '.[0] * .[1] * .[2]' one.json two.json three.json > config.json
```

### `:validate`
``` console
rosetta-cli configuration:validate config.json
```

## `check`

### `:data`
``` console
jq -s '.[0] * .[1] * .[2] * .[3]' base.json network/mainnet.json host/localhost.json data/byron_sample.json > data_config.json
rosetta-cli check:data --configuration-file=data_config.json
```

### `:construction`
``` console
jq -s '.[0] * .[1] * .[2] * .[3]' base.json network/testnet.json host/localhost.json construction/1.json > construction_config.json
rosetta-cli check:construction --configuration-file=construction_config.json
```

See the [QA doc] for implementation detail.

[rosetta-cli]: https://github.com/coinbase/rosetta-cli
[jq]: https://stedolan.github.io/jq/
[QA doc]: ../../docs/QA.md
