## Postman Examples

### Get set up
- Install node modules `npm i`
- Start local server to handle transaction signing, this is due to a limitation in Postman's sandbox environment. `node sign-transaction-server`

### Run Send Transaction example
The `send_transaction_ci.postman_collection.json` sends some ADA and 2 Testcoin to itself. It uses a secret private key so that only Github can run this scenario as a nightly Action.
However, you can still use your own keys and addresses to send a transaction using `send_transaction_postman_collection.json` by following these steps:
- First, have a Testnet address with some ADA in it.
- Modify `testnet-environment.json` to use your private key, public key, sender address and recipient address (these addresses can be the same).
- Import `send-transaction-postman_collection.json` and `testnet.postman_environment.json` into Postman.
- Create a new Runner using the imported collection and environment.
- Start Run with all requests ticked.
- If all tests pass it means the transaction was successfully constructed and submitted.
