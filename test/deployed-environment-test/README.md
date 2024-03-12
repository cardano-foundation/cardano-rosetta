## Deployment Test

### Description
Automated API checks for Rosetta deployments on testnet, staging, shelley-qa and mainnet. Can also be used for local instance.

### Steps:
- `npm i newman`
- `newman run rosetta-java.postman_collection.json -e rosetta-TS-Preprod.postman_environment -r cli`

