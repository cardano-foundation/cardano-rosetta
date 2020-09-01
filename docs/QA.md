# QA
### [CI]
![CI](https://github.com/input-output-hk/cardano-rosetta/workflows/CI/badge.svg)

Integration of new code to the master is permitted if the `cardano-rosetta-server` test suite 
passes, and the Dockerfile builds and passes a simple smoke test.

### [Nightly tests]
![Nightly](https://github.com/input-output-hk/cardano-rosetta/workflows/Nightly/badge.svg)

The [rosetta-cli](https://github.com/coinbase/rosetta-cli) validates the correctness of 
a fully synced Cardano Rosetta mainnet instance, using configuration maintained in source control. 
A snapshot of the state is stored in an S3 bucket, and is maintained by this workflow. 

## Pre-release
Currently, a manual process of more comprehensive [check] routines are performed, including the 
`check:construction` due to limitations with the tooling. The intention is to automate [when 
possible].

[CI]: ../.github/workflows/ci.yml
[Nightly tests]: ../.github/workflows/nightly.yml
[check]: ../test/check/README.md
[when possible]: https://github.com/coinbase/rosetta-cli/issues/112