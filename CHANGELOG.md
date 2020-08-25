# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.1.0](https://github.com/input-output-hk/cardano-rosetta/compare/v0.0.1...v0.1.0) (2020-08-25)


### Features

* `/construction/preprocess` ([#110](https://github.com/input-output-hk/cardano-rosetta/issues/110)) ([8989aa8](https://github.com/input-output-hk/cardano-rosetta/commit/8989aa89f717e5a6b2ea3e4a7a6072dea11b78cd))
* `/construction/submit` endpoint implementation ([#106](https://github.com/input-output-hk/cardano-rosetta/issues/106)) ([2585e57](https://github.com/input-output-hk/cardano-rosetta/commit/2585e57963dfe7aa22893517eaf72a607aea0aca)), closes [#114](https://github.com/input-output-hk/cardano-rosetta/issues/114)
* `/construction/submit` implementation ([64d467a](https://github.com/input-output-hk/cardano-rosetta/commit/64d467af148f9289ca24ea0e1b9e1f6005ca9075))
* Add MODE ENV to limit services running in offline operation ([013024a](https://github.com/input-output-hk/cardano-rosetta/commit/013024ad37fe897d0c7878d1131c2a4b31fd1f37))
* added bech32 tesnet prefix support ([#93](https://github.com/input-output-hk/cardano-rosetta/issues/93)) ([01698ee](https://github.com/input-output-hk/cardano-rosetta/commit/01698ee71f8d15464517b3a1b128961ca293379c))
* added cardano service implementation to generate address.  ([72c62c2](https://github.com/input-output-hk/cardano-rosetta/commit/72c62c2241f0a90565972b9ca9d0f612d0749541))
* added coin change to blockService response objects ([#79](https://github.com/input-output-hk/cardano-rosetta/issues/79)) ([5a3ba1a](https://github.com/input-output-hk/cardano-rosetta/commit/5a3ba1a8e38cdc5335233b5d6749dd26e8aac97b))
* added construction combine ([7e8bcda](https://github.com/input-output-hk/cardano-rosetta/commit/7e8bcda06a33c25572c565a5d2633dd7c52e28ae)), closes [#90](https://github.com/input-output-hk/cardano-rosetta/issues/90)
* added details when some parsing errors are thrown. Also change some logic on error handling ([#116](https://github.com/input-output-hk/cardano-rosetta/issues/116)) ([a8fcdaf](https://github.com/input-output-hk/cardano-rosetta/commit/a8fcdafcc4f5a233e317f5dce876b24217f923c5))
* adds service dependencies and process management to Dockerfile ([920488f](https://github.com/input-output-hk/cardano-rosetta/commit/920488fa9f9f22b6bfc40e15a26a43ace47abb04))


### Bug Fixes

* add offline check for networkWalidation in all enpdoints. Refactor to tests so if any endpoint could work offline, a mock db is used ([#118](https://github.com/input-output-hk/cardano-rosetta/issues/118)) ([9c091a4](https://github.com/input-output-hk/cardano-rosetta/commit/9c091a46226aeb3fde14cf1b9a0b75d1ae714970))
* added query fix to query a single transaction by genesis block ([75f66d8](https://github.com/input-output-hk/cardano-rosetta/commit/75f66d831ae0d13d36576f5f19d4204bc63c3537))
* build iohk libsodium fork ([f77bd0b](https://github.com/input-output-hk/cardano-rosetta/commit/f77bd0bde9bca01e5901b7725725f5d6d40dc79e))
* convert block time (timestamp) to milliseconds. Tests were also fixed ([#133](https://github.com/input-output-hk/cardano-rosetta/issues/133)) ([60333ef](https://github.com/input-output-hk/cardano-rosetta/commit/60333ef3f532849167350153cfd5a3f2b503a719))
* error when parsing transaction errors: coin_action and address prefix ([5ba3dab](https://github.com/input-output-hk/cardano-rosetta/commit/5ba3dab853d01c891185ec74f8616016e2ab8eb0))
* fill parse with missing information so it can be processed by check tool ([dd3dbb0](https://github.com/input-output-hk/cardano-rosetta/commit/dd3dbb0490fb77aa1e68c79d3b644616317c7d27))
* fix signature type. ECDSA must be used ([#99](https://github.com/input-output-hk/cardano-rosetta/issues/99)) ([ff6f89f](https://github.com/input-output-hk/cardano-rosetta/commit/ff6f89f900cbbe1f0f53ac832d96d026834c622e))
* fixed signature processing (it's not expected as CBOR anymore) ([#102](https://github.com/input-output-hk/cardano-rosetta/issues/102)) ([3da8103](https://github.com/input-output-hk/cardano-rosetta/commit/3da81035c49377f6836798276643615f10534d7f))
* inpust must have coin_identifier field, not outputs. ([7cd84cd](https://github.com/input-output-hk/cardano-rosetta/commit/7cd84cd533291a3f7b638be77fd8e7a0c039a23e))
* metadata should be optional on preprocess so default will be defined ([cb44c31](https://github.com/input-output-hk/cardano-rosetta/commit/cb44c317a8745528c2c47f14ad92e66e600ea96f))
* parse operation status should be empty ([a15efd0](https://github.com/input-output-hk/cardano-rosetta/commit/a15efd0f6c65c8d83b500b71f43435146e25f61e)), closes [/github.com/coinbase/rosetta-sdk-go/blob/823626058e01ab96e4bd6f6a27648b096f02d9b1/asserter/block.go#L189](https://github.com/input-output-hk//github.com/coinbase/rosetta-sdk-go/blob/823626058e01ab96e4bd6f6a27648b096f02d9b1/asserter/block.go/issues/L189)
* remove timestamp with timezone in /block and findBlock query. Fix tests. Added momentjs to ensure UTC time conversion ([#125](https://github.com/input-output-hk/cardano-rosetta/issues/125)) ([444ea58](https://github.com/input-output-hk/cardano-rosetta/commit/444ea58567d2fd757fef996ebe3de9dcb57c9cff))
* remove use of 0x as prefix from whole project ([711cb99](https://github.com/input-output-hk/cardano-rosetta/commit/711cb99891f353a89f6f92d44ea1d116049e7f25))
* removed some unused code and fixed linter errors in tests ([eb3941e](https://github.com/input-output-hk/cardano-rosetta/commit/eb3941e0a17dc7f9ee1cf3d388c3e0244c60eb3d))
* transaction operatios were not properly built. wrong coin_change ([65b8e67](https://github.com/input-output-hk/cardano-rosetta/commit/65b8e67fc989ed951219ac09db6237f6df1d89a9))
* Use standard default port ([d50096d](https://github.com/input-output-hk/cardano-rosetta/commit/d50096de02038e3af8aba8e829624e8c6378bb18)), closes [#113](https://github.com/input-output-hk/cardano-rosetta/issues/113)

### 0.0.1 (2020-07-31)


### Features

* `/block/transaction` endpoint finished ([fcbed6b](https://github.com/input-output-hk/cardano-rosetta/commit/fcbed6b3f60c805a328aa7b1627e631f89e357b5)), closes [#12](https://github.com/input-output-hk/cardano-rosetta/issues/12)
* `/block` endpoint ([e1de850](https://github.com/input-output-hk/cardano-rosetta/commit/e1de8502084a40ea36006ffd576f6cef6e7ff47f)), closes [#13](https://github.com/input-output-hk/cardano-rosetta/issues/13)
* `/block` genesis test mockup ([4c5be44](https://github.com/input-output-hk/cardano-rosetta/commit/4c5be446406f2d0756ba3222689626924198befb))
* `/block` returns information about latest block when no block_identifie ([2b743f7](https://github.com/input-output-hk/cardano-rosetta/commit/2b743f7a7f1c51f0974f9a3bdceb913d32726e66))
* added balance and utxo query and full accountBalance impl.  ([8e0bae7](https://github.com/input-output-hk/cardano-rosetta/commit/8e0bae77490a16f5f2180b578eeaccf825b5d2fd))
* added block validation when requesting blockTransaction endpoint ([a6cc667](https://github.com/input-output-hk/cardano-rosetta/commit/a6cc667ddeebf90e530fc2fda55eee62d44c9250))
* added metadata to `/block` api ([73ff25c](https://github.com/input-output-hk/cardano-rosetta/commit/73ff25c19d405dcb521213f769054c92e50e96b4)), closes [#21](https://github.com/input-output-hk/cardano-rosetta/issues/21)
* added networkList implementation for both service and repository ([#26](https://github.com/input-output-hk/cardano-rosetta/issues/26)) ([f212b39](https://github.com/input-output-hk/cardano-rosetta/commit/f212b39122bfc2706191be16424f1085ad9d365a))
* added tx_out index to txResponse on /block ([3735b1d](https://github.com/input-output-hk/cardano-rosetta/commit/3735b1dbbf023a3ab1634f20e83f1a30d7de9e18))
* added tx_out index to txResponse on /block ([c4ec9c3](https://github.com/input-output-hk/cardano-rosetta/commit/c4ec9c3ec920d562f6cb3929f0592a4a6e313eb7))
* fastify server with typescript endpoints created using openapi ([f31beb2](https://github.com/input-output-hk/cardano-rosetta/commit/f31beb24400d9505227738403957ee38ffb02f9c))
* initial commit. Added first prototype to find a tx by hash. Networks is already validated ([bd8bfe7](https://github.com/input-output-hk/cardano-rosetta/commit/bd8bfe779e78070d626740b010604eac5650a6e5))
* network options endpoint  ([#30](https://github.com/input-output-hk/cardano-rosetta/issues/30)) ([c1aa3e7](https://github.com/input-output-hk/cardano-rosetta/commit/c1aa3e74a25458a0c606ab882fa939fd59d17b11))
* network status endpoint ([#31](https://github.com/input-output-hk/cardano-rosetta/issues/31)) ([7be024f](https://github.com/input-output-hk/cardano-rosetta/commit/7be024f2d405742d6897758e66ad0a9641b71659))
* now we read the file in an absolute path way. path.resolve() was used to accomplish it ([83694f7](https://github.com/input-output-hk/cardano-rosetta/commit/83694f7fccb52b1fa451273d45cf90ca27f9d13a))
* only return hashes when there are a lot of transactions per block (WIP) ([e6a7d60](https://github.com/input-output-hk/cardano-rosetta/commit/e6a7d608238fd4897419c1bf3ffb8db052635b5a))
* remove findBalance query since findUtxoDetailsForAddress was the same query ([28ecd6d](https://github.com/input-output-hk/cardano-rosetta/commit/28ecd6d9b7ec5a69b4817e5b3cd649ef746fbd41)), closes [#71](https://github.com/input-output-hk/cardano-rosetta/issues/71)
* return utxos as metadata when querying for account balance ([791068c](https://github.com/input-output-hk/cardano-rosetta/commit/791068c49033994bd1bacc6b243f150999e86701))
* transactions are returned for `/blocks` API ([09ecfd8](https://github.com/input-output-hk/cardano-rosetta/commit/09ecfd82fad4b2449740556fa0764c6172505dd5)), closes [#22](https://github.com/input-output-hk/cardano-rosetta/issues/22)
* typescript types generation based on openapi specs from rosetta ([1b48eae](https://github.com/input-output-hk/cardano-rosetta/commit/1b48eaee9899c419fb58fb6b8e78bea4db6c8c58))


### Bug Fixes

* added tests for /block for a block with more than 8 txs. Extract PAGE_SIZE to .env ([38be744](https://github.com/input-output-hk/cardano-rosetta/commit/38be7444ee442b2400eabef290b5282af083168c))
* allow `/block` to be able to be queried by block === 0 ([#59](https://github.com/input-output-hk/cardano-rosetta/issues/59)) ([ef79708](https://github.com/input-output-hk/cardano-rosetta/commit/ef797082f69d7fc437d316f129197fd5202cf231)), closes [#51](https://github.com/input-output-hk/cardano-rosetta/issues/51)
* errors weren't being logged when caught by the server ([21291ba](https://github.com/input-output-hk/cardano-rosetta/commit/21291ba9839ef1873b45e3cbf3cddb1116b97db7))
* findBlock query was refactored to support new db schema ([#34](https://github.com/input-output-hk/cardano-rosetta/issues/34)) ([347dd1c](https://github.com/input-output-hk/cardano-rosetta/commit/347dd1c3e5357b3e1bf1742dbcc2dff000026383))
* fix query indentation, remove some joins cause they werent necesary. Fix a test bug. Return balance as string from db to avoid posible overflow. ([4e953ad](https://github.com/input-output-hk/cardano-rosetta/commit/4e953ad77e4430c80b4b80de020bc85396cdeaee))
* JOIN on findBlock must be a LEFT JOIN since previous field could be null on genesisBlock. Also fix a null.toString() ([8dd1eb7](https://github.com/input-output-hk/cardano-rosetta/commit/8dd1eb769a500b83c834a6c9077a003a838e641b))
* latestBlockQuery was fixed since db schema update.  ([fc52f6b](https://github.com/input-output-hk/cardano-rosetta/commit/fc52f6b0b57ea485b672f6a91d61e65a940741f2)), closes [#41](https://github.com/input-output-hk/cardano-rosetta/issues/41)
* point package.json links to new repo ([efaf39b](https://github.com/input-output-hk/cardano-rosetta/commit/efaf39b207786a8ead66ba0c7f88091204aaf84d))
* return different error codes to comply with rosetta spec ([#52](https://github.com/input-output-hk/cardano-rosetta/issues/52)) ([8535b6c](https://github.com/input-output-hk/cardano-rosetta/commit/8535b6ce307b381c2ac91253645c5999eae4479a)), closes [#49](https://github.com/input-output-hk/cardano-rosetta/issues/49)
* return different error codes to comply with rosetta spec ([#52](https://github.com/input-output-hk/cardano-rosetta/issues/52)) ([a86d8c3](https://github.com/input-output-hk/cardano-rosetta/commit/a86d8c36fa871bd5ce32ae0c6eea174092858c2b)), closes [#49](https://github.com/input-output-hk/cardano-rosetta/issues/49)
* transactionInput and transactionOutput query fix. Also fix tests because of some corrupted data with previous queries ([#39](https://github.com/input-output-hk/cardano-rosetta/issues/39)) ([7fb27f1](https://github.com/input-output-hk/cardano-rosetta/commit/7fb27f1a6c95831e92b8ee5cc2fb86c5945a2e68))
* utxo details and balance query was fixed. Also tests were fixed. ([b542997](https://github.com/input-output-hk/cardano-rosetta/commit/b5429971705ea31299d3c28b0a4be960a53b160f))
