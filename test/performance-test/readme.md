### Rosetta Load Testing with Artillery

#### Install
- `npm i artillery`

#### Configure
- Edit config.yaml and refer to https://artillery.io/docs/guides/guides/test-script-reference.html
- If targetting localhost environment then must have Testnet Rosetta instance running locally on port 8081

#### Run test
- `$(npm bin)/artillery run tests/data-block-tests.yaml --environment localhost --config config.yaml --output report`
- `$(npm bin)/artillery run tests/construction-simple-transaction.yaml --environment localhost --config config.yaml --output report`

#### Produce html report
- `$(npm bin)/artillery report report`


