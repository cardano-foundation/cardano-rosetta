# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.0-rc.1](https://github.com/input-output-hk/cardano-rosetta/compare/2.0.0-beta.1...2.0.0-rc.1) (2022-12-13)

### Bug Fixes

* nest protocol params inside metadata object of construction endpoint ([176f3e2](https://github.com/input-output-hk/cardano-rosetta/commit/176f3e23f9b9e13191afc59ebf0b00fededd41ce))

## [2.0.0-beta.1](https://github.com/input-output-hk/cardano-rosetta/compare/2.0.0-beta.0...2.0.0-beta.1) (2022-11-29)

* bump to `cardano-serialization-lib@11.1.1`

## [2.0.0-beta.0](https://github.com/input-output-hk/cardano-rosetta/compare/1.8.1...2.0.0-beta.0) (2022-11-11)


### ⚠ BREAKING CHANGES

* get protocol params from request: This is a breaking change in the construction flow to correct an oversight in the original implementation relating to handling current
protocol parameters, and how it relates to running the service in _offline_ mode. In prior versions the protocol parameters were an internal concern, originally it was
statically read from genesis, then later refactored to be queried from the DB. The former version created a valid offline mode, but after refactoring it violates the spec
as the database cannot be running in this mode. Upgrading from v1 to v2: `/construction/metadata` now returns `protocol_parameters`, which must be used to construct a
`deposit_parameters` object in the `/construction/preprocess` request metadata.

### Performance

* improve search transactions by coin query ([a721862](https://github.com/input-output-hk/cardano-rosetta/commit/a721862e9c4ca529100a9d10f3cf281b86b50f81))

### Refactor
* get protocol params from request ([ec56d25](https://github.com/input-output-hk/cardano-rosetta/commit/ec56d250c2a231991dc2ad83221875c2ab47304d))

### Bug Fixes

* handle WASM-bound objects produced when interacting with CSL ([069674e](https://github.com/input-output-hk/cardano-rosetta/commit/069674eb0345e85bb844aeffda91a4b99f40414f))

## [1.8.1](https://github.com/input-output-hk/cardano-rosetta/compare/1.8.0...1.8.1) (2022-08-18)

* introduce support for new test networks ([32200ae](https://github.com/input-output-hk/cardano-rosetta/commit/32200aecc0f7030e0ec42d0e621d8f008060728e))

## [1.8.0](https://github.com/input-output-hk/cardano-rosetta/compare/1.7.1...1.8.0) (2022-08-16)


### Features

* adapt network service to vasil-qa topology file ([7eaede5](https://github.com/input-output-hk/cardano-rosetta/commit/7eaede52152e3c12ebccd2f34d4a07dc56bd925f))
* update pool registrations query ([8c9a478](https://github.com/input-output-hk/cardano-rosetta/commit/8c9a4787f2885c404374288a8209cdae16234084))


### Bug Fixes

* add order by to delegations and pool owners queries ([6f6152d](https://github.com/input-output-hk/cardano-rosetta/commit/6f6152d522c5a36c0d602e4172d690d9bb26d97a))
* fix on search by addresses and coins ([685d900](https://github.com/input-output-hk/cardano-rosetta/commit/685d900e8909fbc64193600fc1a68063fc6a3bd9))
* move submit tx method before the hash of the tx was obtained ([b9b43c6](https://github.com/input-output-hk/cardano-rosetta/commit/b9b43c6650473d34018a3b5d2fc8c13dc978f8c9))
* postman tests ([da7143c](https://github.com/input-output-hk/cardano-rosetta/commit/da7143c84f2c2723d489d5cc3340b70f93656496))
* updated test readme ([9d7c546](https://github.com/input-output-hk/cardano-rosetta/commit/9d7c546c700bed2ec38413e4c46966df36f3860a))
* validate type of  metadata field for vote registrations ([0d862e5](https://github.com/input-output-hk/cardano-rosetta/commit/0d862e55847b8a4faa1ad9ad8389b5a7827a37cf))


### [1.7.1](https://github.com/input-output-hk/cardano-rosetta/compare/1.7.0...1.7.1) (2022-06-16)


### Bug Fixes

* validate type of  metadata field for vote registrations ([b266a4b](https://github.com/input-output-hk/cardano-rosetta/commit/b266a4b2577ed0f92565823b5dc80e402b0198be))

## [1.7.0](https://github.com/input-output-hk/cardano-rosetta/compare/1.4.0...1.8.0) (2022-01-25)


### Features
* bump cardano-node + GHC version ([23db4c3](https://github.com/input-output-hk/cardano-rosetta/commit/23db4c38ed22e1cd7dbeee01420bb5ff84f0c9f3))

## [1.6.1](https://github.com/input-output-hk/cardano-rosetta/compare/1.5.0...1.6.1) (2021-12-17)


### Features

* cardano-db-sync snapshot restoration ([55aa8ec](https://github.com/input-output-hk/cardano-rosetta/commit/55aa8ece86daf63e6c29160f7305d2d3539bac20))


### Bug Fixes

* changed Dockerfile gosu gpg keyserver as it was randomly failing ([8c29315](https://github.com/input-output-hk/cardano-rosetta/commit/8c29315e28e7ab2608bea75b017c3f0127532c0f))
* ensure DB is always created, enhance docs ([1529731](https://github.com/input-output-hk/cardano-rosetta/commit/1529731f131bd222f72c98d5e92e2653f6a2c715))

## [1.5.0](https://github.com/input-output-hk/cardano-rosetta/compare/1.4.0...1.5.0) (2021-10-04)


### Features

* search transactions ([faf3652](https://github.com/input-output-hk/cardano-rosetta/commit/faf36526fcd0630f2c20e27f71f750356dbf6807))

### Bug Fixes

* byron address support ([f9e4fd4](https://github.com/input-output-hk/cardano-rosetta/commit/f9e4fd482dd92739f444cb8c8b162bde0c2d3af4))

## [1.4.0](https://github.com/input-output-hk/cardano-rosetta/compare/1.4.0-beta.1...1.4.0) (2021-08-28)


### Features

* add query to retrieve tx metadata ([cdfebd7](https://github.com/input-output-hk/cardano-rosetta/commit/cdfebd780a2f11acf1d3829972702df9d2d24cb6))
* add vote operations to block endpoint ([a15bae5](https://github.com/input-output-hk/cardano-rosetta/commit/a15bae58d8b73b03bc493b9cfd47636f8702ac5f))
* add vote registration operation ([#398](https://github.com/input-output-hk/cardano-rosetta/issues/398)) ([48d9e1b](https://github.com/input-output-hk/cardano-rosetta/commit/48d9e1b157e9486e83906733a0190876dc25f696))


### Bug Fixes

* add auxiliary data when building tx ([4b94679](https://github.com/input-output-hk/cardano-rosetta/commit/4b94679650d2c38aac508ada17372e7656886d1a))
* construction parse inputs ([e86ccbf](https://github.com/input-output-hk/cardano-rosetta/commit/e86ccbfe96dd7e8ab042dade07685e41a699d03e))
* include tx metadata when calculating tx size ([bf09eb5](https://github.com/input-output-hk/cardano-rosetta/commit/bf09eb55b767a5743fb34eaf6be672fd37513d08))


## [1.4.0-beta.1](https://github.com/input-output-hk/cardano-rosetta/compare/1.4.0-beta.0...1.4.0-beta.1) (2021-08-15)

### Chores
* build and push alonzo-purple images to Docker Hub ([6d3433d](https://github.com/input-output-hk/cardano-rosetta/commit/6d3433d3978626932ccc084522e143bf05b503d2))
* improve docs to cover Docker Hub repository ([98bb9c4](https://github.com/input-output-hk/cardano-rosetta/commit/98bb9c4207f67239249d5a0d6848c7d3db1e6d0b))


## [1.4.0-beta.0](https://github.com/input-output-hk/cardano-rosetta/compare/1.2.1...1.4.0-beta.0) (2021-08-12)


### Features

* add alonzo era when submitting tx ([2d2d831](https://github.com/input-output-hk/cardano-rosetta/commit/2d2d83127f96f3dfc79a90a932989b25e35fe19e))
* filter invalid txs from utxo and balance queries ([#401](https://github.com/input-output-hk/cardano-rosetta/issues/401)) ([2298321](https://github.com/input-output-hk/cardano-rosetta/commit/2298321e51f5244a8c3e38266e1b9ae986fa6f2d)), closes [#108](https://github.com/input-output-hk/cardano-rosetta/issues/108)

### Bug Fixes

* fix ma-transfer example ([b3c2a01](https://github.com/input-output-hk/cardano-rosetta/commit/b3c2a01af1730db431a01b7bb6f96ca1420dc7a3))
* pool registration workflow config fix ([2bf6401](https://github.com/input-output-hk/cardano-rosetta/commit/2bf64015ce87af455c5730b48a4c0949d23c47b7))


## [1.3.0](https://github.com/input-output-hk/cardano-rosetta/compare/1.2.1...1.3.0) (2021-07-21)


### Features

* add pool registration with cert example and doc ([#366](https://github.com/input-output-hk/cardano-rosetta/issues/366)) ([3a5e057](https://github.com/input-output-hk/cardano-rosetta/commit/3a5e057740c6feeb6b9095eecee1c5591bbc9771))
* adding pool retirement operations ([#345](https://github.com/input-output-hk/cardano-rosetta/issues/345)) ([4f8beef](https://github.com/input-output-hk/cardano-rosetta/commit/4f8beef9e3aa17d3297ccbc239a46179d9fb2121))
* changed minFeeA and minFeeB sources. Got them from database ([#341](https://github.com/input-output-hk/cardano-rosetta/issues/341)) ([5956b0c](https://github.com/input-output-hk/cardano-rosetta/commit/5956b0c60b55a51f4742e8b9d699529a94a1d36b))
* changing serialization lib to 6.0.0 ([#338](https://github.com/input-output-hk/cardano-rosetta/issues/338)) ([1bae758](https://github.com/input-output-hk/cardano-rosetta/commit/1bae758e948aec1c5b365cc3f3abcf3bd3d95527))
* increment max body limit by optional env ([cc83cdd](https://github.com/input-output-hk/cardano-rosetta/commit/cc83cddd17f89a638452a62f15b12068329d7741))
* **payloads:** invalid pool key hash error handling ([c602256](https://github.com/input-output-hk/cardano-rosetta/commit/c602256040cb596e0af7206aa566790c6eea1091)), closes [#286](https://github.com/input-output-hk/cardano-rosetta/issues/286)
* pool retirement documentation support ([#353](https://github.com/input-output-hk/cardano-rosetta/issues/353)) ([5c57241](https://github.com/input-output-hk/cardano-rosetta/commit/5c5724103e45b7f03857c0141fdb334913c5778c))
* pool retirement operation in block transaction endpoints ([#352](https://github.com/input-output-hk/cardano-rosetta/issues/352)) ([8d33c69](https://github.com/input-output-hk/cardano-rosetta/commit/8d33c69b039d1440d5d3f2e10b835d90fff97c58))


### Bug Fixes

* add pool owners addresses at payloads ([#354](https://github.com/input-output-hk/cardano-rosetta/issues/354)) ([46188b1](https://github.com/input-output-hk/cardano-rosetta/commit/46188b1c83d2c6b37297947f939ec8385ee92b98))
* add pool owners to signer list of construction parse response ([#363](https://github.com/input-output-hk/cardano-rosetta/issues/363)) ([8314222](https://github.com/input-output-hk/cardano-rosetta/commit/831422271ef99bd977357c65d6db43a7cba98c17))
* body limit fixed from environment variables ([#355](https://github.com/input-output-hk/cardano-rosetta/issues/355)) ([bb45cb1](https://github.com/input-output-hk/cardano-rosetta/commit/bb45cb1b2a348dc120114784b7d77427a316dc7f))
* fix examples tests ([#346](https://github.com/input-output-hk/cardano-rosetta/issues/346)) ([ce6474f](https://github.com/input-output-hk/cardano-rosetta/commit/ce6474f92bf7b186dddebbefa9600a130a296e75))
* remove quotes from yaml string in docker-compose ([2ae54c2](https://github.com/input-output-hk/cardano-rosetta/commit/2ae54c26e25476806bdae66275b1d07df2005204))
* Catch OutsideValidityIntervalUTxO node error in construction ([e095247](https://github.com/input-output-hk/cardano-rosetta/commit/e0952474122814a30174b90f0b0db74567677782))

### [1.2.1](https://github.com/input-output-hk/cardano-rosetta/compare/1.2.0...1.2.1) (2021-03-17)


### Bug Fixes

* fix README instructions to point to proper version (1.2.1) ([959866a](https://github.com/input-output-hk/cardano-rosetta/commit/959866a7468db0d942e6592dbbbc99fb3c728538))

## [1.2.0](https://github.com/input-output-hk/cardano-rosetta/compare/1.1.0...1.2.0) (2021-03-17)


### Features

* byron address outputs support ([#324](https://github.com/input-output-hk/cardano-rosetta/issues/324)) ([f716ca3](https://github.com/input-output-hk/cardano-rosetta/commit/f716ca3c086d3f3f86e4f0d231837e93ac29206d))

## [1.1.0](https://github.com/input-output-hk/cardano-rosetta/compare/1.0.0...1.1.0) (2021-02-01)

### Features

* add delegation and deregistration operations support ([b8acd6b](https://github.com/input-output-hk/cardano-rosetta/commit/b8acd6b466d061507374be6a59187d48d8e5408b))
* add token bundle to transaction operations ([#282](https://github.com/input-output-hk/cardano-rosetta/issues/282)) ([9ca1f65](https://github.com/input-output-hk/cardano-rosetta/commit/9ca1f65cdc62c327ea86c4cc16ff21356a799e05))
* added multiassets representation to the openapi.json definition ([6923a91](https://github.com/input-output-hk/cardano-rosetta/commit/6923a91a9a0d797172d3b3a1c8ad6c15e252d21f))
* added staking delegation workflow to be executed by rosetta-cli ([b0b9dd3](https://github.com/input-output-hk/cardano-rosetta/commit/b0b9dd34ce5b2441e7ae3f19cc369a2ba5a3e8f7))
* calculate fee validation ([585f427](https://github.com/input-output-hk/cardano-rosetta/commit/585f42721400c37e49b8b40b540a5f4d4e01b427)), closes [#211](https://github.com/input-output-hk/cardano-rosetta/issues/211)
* cardano-serialization-lib added to the repo as a tar ([fd208ff](https://github.com/input-output-hk/cardano-rosetta/commit/fd208ffa23bb110321638cf9cb86f97848b45fcc))
* consider deposit, refunds and withdrawals for fee calculation ([c6a7e06](https://github.com/input-output-hk/cardano-rosetta/commit/c6a7e065929288bd8c183baacc8923682c33feef)), closes [#211](https://github.com/input-output-hk/cardano-rosetta/issues/211)
* construction derive staking support ([#207](https://github.com/input-output-hk/cardano-rosetta/issues/207)) ([4cf5ea5](https://github.com/input-output-hk/cardano-rosetta/commit/4cf5ea5f2375549e5d7928deb3d3ca957e56f3a3)), closes [#198](https://github.com/input-output-hk/cardano-rosetta/issues/198)
* including token bundles in input and output operations parsing ([#290](https://github.com/input-output-hk/cardano-rosetta/issues/290)) ([7fb6fc7](https://github.com/input-output-hk/cardano-rosetta/commit/7fb6fc7c4861536792067278c6585218d59d8a3a))
* Initial outputs parsing ([651cf17](https://github.com/input-output-hk/cardano-rosetta/commit/651cf1718c333a1b8b2e534c96cd230ceaeeb10f))
* multiple snapshots and fixtures are now allowed when running tests ([604ea88](https://github.com/input-output-hk/cardano-rosetta/commit/604ea8847b557ad48e37832c3d8e59c7f2cafc1e)), closes [#276](https://github.com/input-output-hk/cardano-rosetta/issues/276)
* rosetta-cli check:construction MA workflow ([#295](https://github.com/input-output-hk/cardano-rosetta/issues/295)) ([9beaf72](https://github.com/input-output-hk/cardano-rosetta/commit/9beaf72ef18922eefd502c7c1353b53fef4e4c4a))
* stake registration and deregistration parsing ([54af672](https://github.com/input-output-hk/cardano-rosetta/commit/54af672577c56eaa019a2362085952d2e9aa20ea)), closes [#205](https://github.com/input-output-hk/cardano-rosetta/issues/205)
* try multiple eras when sending a transaction ([#310](https://github.com/input-output-hk/cardano-rosetta/issues/310)) ([132d7e6](https://github.com/input-output-hk/cardano-rosetta/commit/132d7e65bad086a2bbe2f2df234c18a5638268c3))
* validate token policy and symbol to be a hex string ([#302](https://github.com/input-output-hk/cardano-rosetta/issues/302)) ([08e3917](https://github.com/input-output-hk/cardano-rosetta/commit/08e391792b57929e4b88f7d64942bfb9d44afa9f))
* **construction-parse:** stake operations and withdrawals parsing ([974d5b9](https://github.com/input-output-hk/cardano-rosetta/commit/974d5b98703687b8d587078db7db8f215f9e2987)), closes [#205](https://github.com/input-output-hk/cardano-rosetta/issues/205)


### Bug Fixes

* add missing staking addresses when creating transaction payloads ([25342c6](https://github.com/input-output-hk/cardano-rosetta/commit/25342c60c8205b638ffbcfbf2aa519cbb8c1e7c5))
* add missing testnet network identifier to post-release workflow ([7ac1c72](https://github.com/input-output-hk/cardano-rosetta/commit/7ac1c72f12720766f0fe2a60c014656261b93161))
* cardano-cli tx encoding should be `Tx MaryEra` ([401cd7d](https://github.com/input-output-hk/cardano-rosetta/commit/401cd7d76b31b780b50d080b04f173cbcb37b354))
* delegate stake example ([17f0698](https://github.com/input-output-hk/cardano-rosetta/commit/17f0698f3411d672ae56d4a949ae79d7cfba6a25))
* fix dump_blocks script and db snapshot ([5f22d23](https://github.com/input-output-hk/cardano-rosetta/commit/5f22d238d7f9aa5aa6913d85e9f195a8b46af72f))
* fix lint issues ([e5b2c49](https://github.com/input-output-hk/cardano-rosetta/commit/e5b2c490b386b42aec35345186935e20ff1d5efb))
* fix missing shades dependency ([2193f9a](https://github.com/input-output-hk/cardano-rosetta/commit/2193f9a4fe8090c81410fdf76662c4ffffdff75b))
* fix withdrawal example ([#255](https://github.com/input-output-hk/cardano-rosetta/issues/255)) ([c5a48b8](https://github.com/input-output-hk/cardano-rosetta/commit/c5a48b82efe6f5825c14063bdd4ea6d630303373))
* map empty asset name in order to work with rosetta-cli:check data ([#307](https://github.com/input-output-hk/cardano-rosetta/issues/307)) ([d17c4e1](https://github.com/input-output-hk/cardano-rosetta/commit/d17c4e1f4cf43aa282781d663cc00445fe44074b))
* missing minKeyDeposit parameter in cardano service and linter warning fixes ([8b3b41d](https://github.com/input-output-hk/cardano-rosetta/commit/8b3b41db176dcce957eb3f333459b4888a35ff1f))
* multiassets schema wasn't properly mapped ([#280](https://github.com/input-output-hk/cardano-rosetta/issues/280)) ([eeb5611](https://github.com/input-output-hk/cardano-rosetta/commit/eeb56112574339624b624167870f2d937666b1b2))
* set default test db as mainnet ([61ddbdd](https://github.com/input-output-hk/cardano-rosetta/commit/61ddbddf28ceea138c4928078ddc0fdd324bb390))
* there were some staking network operations missing ([#223](https://github.com/input-output-hk/cardano-rosetta/issues/223)) ([0309ee4](https://github.com/input-output-hk/cardano-rosetta/commit/0309ee4343a833a957a9248f46f395c3efd50108))
* typo fix in isPolictyIdValid ([dc33252](https://github.com/input-output-hk/cardano-rosetta/commit/dc3325251ebbc1a928549692347a14419e5b7f3b))

## [1.0.0](https://github.com/input-output-hk/cardano-rosetta/compare/0.2.2...1.0.0) (2020-12-11)


### Bug Fixes

* added an extra validation on `/account/balance` to fail if invalid addr ([865912f](https://github.com/input-output-hk/cardano-rosetta/commit/865912f0b17e505a1e3c263305dfde3fcb1322bf))
* bump cardano node to 1.20.0 & cardano-db-sync to 5.0.1 ([5fee129](https://github.com/input-output-hk/cardano-rosetta/commit/5fee129b51900a5fdffcc0ff847268b533beb0b4)), closes [#183](https://github.com/input-output-hk/cardano-rosetta/issues/183)
* CARDANO_CLI_PATH var in ecosystem file ([2597ef1](https://github.com/input-output-hk/cardano-rosetta/commit/2597ef12c812c73f6e57df358e3a03779e01218f))
* don't repeat witnesses if multiple inputs from the same address ([b671fef](https://github.com/input-output-hk/cardano-rosetta/commit/b671fef0406c4330e48e0682668f4eb05773252a)), closes [#184](https://github.com/input-output-hk/cardano-rosetta/issues/184)
* example is not working with the latest rosetta api changed ([565cf69](https://github.com/input-output-hk/cardano-rosetta/commit/565cf69f4124098aad8226ff532c1ef65bb4a268))
* fix tests after 6.0.0 upgrade ([5d0602f](https://github.com/input-output-hk/cardano-rosetta/commit/5d0602fcfd75e676eec812a7d268e85f506990fd))
* networkId is now taken from the network magic ([#239](https://github.com/input-output-hk/cardano-rosetta/issues/239)) ([bce74fe](https://github.com/input-output-hk/cardano-rosetta/commit/bce74fe6e83627e6ac162afa3f73bf1145d42f45)), closes [#238](https://github.com/input-output-hk/cardano-rosetta/issues/238)
* networkId wasn't properly checked after [#238](https://github.com/input-output-hk/cardano-rosetta/issues/238) ([#241](https://github.com/input-output-hk/cardano-rosetta/issues/241)) ([b4e1167](https://github.com/input-output-hk/cardano-rosetta/commit/b4e1167a3741e7bf1f4597f69ad743b0414f349c))
* post-integration testnet build ([07dcb21](https://github.com/input-output-hk/cardano-rosetta/commit/07dcb21b2b900ed918644bc66921e8255d1ac073))
* properly return detailed error message when req body has an issue ([6042f57](https://github.com/input-output-hk/cardano-rosetta/commit/6042f57932af0853310ec9910fba14da892a6f73))
* strengthen Docker smoke test ([65f2ac7](https://github.com/input-output-hk/cardano-rosetta/commit/65f2ac7041e3afcb39175ac1ce49eff7f38a7406)), closes [#180](https://github.com/input-output-hk/cardano-rosetta/issues/180)
* update cardano-db-sync to 6.0.1 to fix an issue when importing blocks ([7fb2c03](https://github.com/input-output-hk/cardano-rosetta/commit/7fb2c03e725ac9394ff27bc155f5f7d003dfd89f))
* upgrade node-fetch to 2.6.1 ([#189](https://github.com/input-output-hk/cardano-rosetta/issues/189)) ([0a6028b](https://github.com/input-output-hk/cardano-rosetta/commit/0a6028ba1acefb14728093b6e1f1e92dd1e27444)), closes [#188](https://github.com/input-output-hk/cardano-rosetta/issues/188)

### [0.2.2](https://github.com/input-output-hk/cardano-rosetta/compare/0.2.1...0.2.2) (2020-09-10)


### Features

* configurable default relative TTL at Docker runtime ([6c1dd3c](https://github.com/input-output-hk/cardano-rosetta/commit/6c1dd3c82b0024b85ac64d4d8adbdb263707ab5e))
* configurable page size at Docker runtime ([964a15b](https://github.com/input-output-hk/cardano-rosetta/commit/964a15bea42a35e3231cb44f8067f16a085117b1))
* configurable logging at Docker runtime ([df043d81](https://github.com/input-output-hk/cardano-rosetta/commit/df043d81ed953fbddc70267237155a5877ca5887))
* improve env parser functions and test.  ([b54b3fb](https://github.com/input-output-hk/cardano-rosetta/commit/b54b3fb00cf3d59cb72821176559f6c5744bc27a))


### Bug Fixes

* account total balance was calculated using Number instead of BigInt ([81c45fd](https://github.com/input-output-hk/cardano-rosetta/commit/81c45fd494f494aee3779cf4557ddfab3ccaa039))
* fix: dont ask for socket file to exist when parsing env ([e6226689](https://github.com/input-output-hk/cardano-rosetta/commit/e6226689de3e835e24cc81e49548707fa3a7c338))

### [0.2.1](https://github.com/input-output-hk/cardano-rosetta/compare/v0.0.1...v0.2.1) (2020-09-04)

### Bug Fixes
* adds PORT and BIND_ADDRESS to pm2 ecosystem config ([2961f72](https://github.com/input-output-hk/cardano-rosetta/commit/2961f7248e370cb9b71e981d0b9d6492717e6148))

## [0.2.0](https://github.com/input-output-hk/cardano-rosetta/compare/v0.1.0...0.2.0) (2020-09-01)


### Features

* Add `cardano-node` binary and set ENV to query version ([baf4279](https://github.com/input-output-hk/cardano-rosetta/commit/baf4279c3c51f1da4932a418a64614087bd2626e)), closes [#28](https://github.com/input-output-hk/cardano-rosetta/issues/28)
* added query to `cardano-node` for node version ([#151](https://github.com/input-output-hk/cardano-rosetta/issues/151)) ([88570d0](https://github.com/input-output-hk/cardano-rosetta/commit/88570d06d6d0a65f40b3d4090b5f58e5d97c43bc))
* update cardano node version ([9861bad](https://github.com/input-output-hk/cardano-rosetta/commit/9861bad4991b6060c97cc3c8ef72add5f961a1fe))


### Bug Fixes

* add `CARDANOCLI_PATH` and `CARDANO_NODE_SOCKET_PATH` to missed cardano-rosetta-server implementations ([b67558c](https://github.com/input-output-hk/cardano-rosetta/commit/b67558c64e328bf27a53bad23814be0525035733))
* Add `DEFAULT_RELATIVE_TTL` to missed cardano-rosetta-server implementations ([1705906](https://github.com/input-output-hk/cardano-rosetta/commit/170590638ac972445ff72de1e65fbf64d51bd181))
* generic error handling ([6edf616](https://github.com/input-output-hk/cardano-rosetta/commit/6edf61664af11c74801937412ffdec48f7e948ab))
* remote access issues, including docs ([7191e14](https://github.com/input-output-hk/cardano-rosetta/commit/7191e14a1fddcb52a544cd0395f4f47558397a02))
* remove replace0xOnHash() function calls everywhere since 0x is not a valid prefix hash for this env ([#150](https://github.com/input-output-hk/cardano-rosetta/issues/150)) ([592a81c](https://github.com/input-output-hk/cardano-rosetta/commit/592a81c1a041e8ecd5bb58fd84aac23251812270))


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
