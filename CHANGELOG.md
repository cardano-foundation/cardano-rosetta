# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
