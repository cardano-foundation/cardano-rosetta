# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.1.0](https://github.com/input-output-hk/cardano-rosetta/compare/v0.0.1...v0.1.0) (2020-08-25)

- [`cardano-rosetta-server` Changelog](./cardano-rosetta-server/CHANGELOG.md)
- [`cardano-node@1.19.0`](https://github.com/input-output-hk/cardano-node/releases/tag/1.19.0)
- [`cardano-db-sync@3.1.0`](https://github.com/input-output-hk/cardano-db-sync/releases/tag/3.1.0)

### Features
* Spec-compliant docker build process ([920488f](https://github.com/input-output-hk/cardano-rosetta/commit/920488fa9f9f22b6bfc40e15a26a43ace47abb04))
* Dev/testing docker build process, using local source code
* Build-time network selection eg `--build-arg=NETWORK=testnet`
* `MODE` ENV to limit services running in offline operation ([013024a](https://github.com/input-output-hk/cardano-rosetta/commit/013024ad37fe897d0c7878d1131c2a4b31fd1f37))
