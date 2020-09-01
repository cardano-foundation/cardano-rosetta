# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.2.0](https://github.com/input-output-hk/cardano-rosetta/compare/v0.1.0...v0.2.0) (2020-09-01)


### Features

* Add cardano-node binary and set ENV to query version ([baf4279](https://github.com/input-output-hk/cardano-rosetta/commit/baf4279c3c51f1da4932a418a64614087bd2626e)), closes [#28](https://github.com/input-output-hk/cardano-rosetta/issues/28)
* added query to cardano-node for node version ([#151](https://github.com/input-output-hk/cardano-rosetta/issues/151)) ([88570d0](https://github.com/input-output-hk/cardano-rosetta/commit/88570d06d6d0a65f40b3d4090b5f58e5d97c43bc))
* update cardano node version ([9861bad](https://github.com/input-output-hk/cardano-rosetta/commit/9861bad4991b6060c97cc3c8ef72add5f961a1fe))


### Bug Fixes

* add CARDANOCLI_PATH and CARDANO_NODE_SOCKET_PATH to missed cardano-rosetta-server implementations ([b67558c](https://github.com/input-output-hk/cardano-rosetta/commit/b67558c64e328bf27a53bad23814be0525035733))
* Add DEFAULT_RELATIVE_TTL to missed cardano-rosetta-server implementations ([1705906](https://github.com/input-output-hk/cardano-rosetta/commit/170590638ac972445ff72de1e65fbf64d51bd181))
* generic error handling ([6edf616](https://github.com/input-output-hk/cardano-rosetta/commit/6edf61664af11c74801937412ffdec48f7e948ab))
* remote access issues, including docs ([7191e14](https://github.com/input-output-hk/cardano-rosetta/commit/7191e14a1fddcb52a544cd0395f4f47558397a02))
* remove replace0xOnHash() function calls everywhere since 0x is not a valid prefix hash for this env ([#150](https://github.com/input-output-hk/cardano-rosetta/issues/150)) ([592a81c](https://github.com/input-output-hk/cardano-rosetta/commit/592a81c1a041e8ecd5bb58fd84aac23251812270))

## [0.1.0](https://github.com/input-output-hk/cardano-rosetta/compare/v0.0.1...v0.1.0) (2020-08-25)

- [`cardano-rosetta-server` Changelog](./cardano-rosetta-server/CHANGELOG.md)
- [`cardano-node@1.19.0`](https://github.com/input-output-hk/cardano-node/releases/tag/1.19.0)
- [`cardano-db-sync@3.1.0`](https://github.com/input-output-hk/cardano-db-sync/releases/tag/3.1.0)

### Features
* Spec-compliant docker build process ([920488f](https://github.com/input-output-hk/cardano-rosetta/commit/920488fa9f9f22b6bfc40e15a26a43ace47abb04))
* Dev/testing docker build process, using local source code
* Build-time network selection eg `--build-arg=NETWORK=testnet`
* `MODE` ENV to limit services running in offline operation ([013024a](https://github.com/input-output-hk/cardano-rosetta/commit/013024ad37fe897d0c7878d1131c2a4b31fd1f37))
