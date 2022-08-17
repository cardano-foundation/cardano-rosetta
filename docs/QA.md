# QA
[![CI][img_src_CI]][workflow_CI] 

Integration of new code to the master is permitted if the `cardano-rosetta-server` test suite 
passes, and the Dockerfile builds and passes a simple smoke test.

[![Nightly][img_src_Nightly]][workflow_Nightly]

The [rosetta-cli] validates the correctness of 
a fully synced Cardano Rosetta mainnet instance, using configuration maintained in source control. 
A snapshot of the state is stored in an S3 bucket, and is maintained by this workflow. 

[![Pre-release][img_src_Pre-release]][workflow_Pre-release]

The defined workflow perform a Docker build without using the available cache, and then follows 
up with test network builds. This is supplemented with other manual more comprehensive [check]s, 
including the `check:construction` due to limitations with the tooling. The intention is to 
automate [when possible].

[img_src_CI]: https://github.com/input-output-hk/cardano-rosetta/workflows/CI/badge.svg
[workflow_CI]: https://github.com/input-output-hk/cardano-rosetta/actions?query=workflow%3ACI
[img_src_Nightly]: https://github.com/input-output-hk/cardano-rosetta/workflows/Nightly/badge.svg
[workflow_Nightly]: https://github.com/input-output-hk/cardano-rosetta/actions?query=workflow%3ANightly
[rosetta-cli]: https://github.com/coinbase/rosetta-cli
[img_src_Pre-release]: https://github.com/input-output-hk/cardano-rosetta/workflows/Pre-release/badge.svg
[workflow_Pre-release]: https://github.com/input-output-hk/cardano-rosetta/actions?query=workflow%3APre-release
[check]: ../test/check/README.md
[when possible]: https://github.com/coinbase/rosetta-cli/issues/112