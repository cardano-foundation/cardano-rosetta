## Postman Examples

### What it does
Using Postman Collections we can define high level scenarios that serve as tested documentation. You can import a Collection into the [Postman](https://www.postman.com/downloads) application to visualise the expected requests for each endpoint. In this context, we show you how Rosetta can be used to construct and submit a transaction. Provided the [nightly test](https://github.com/input-output-hk/cardano-rosetta/actions/workflows/postman_send_transaction_example.yml) is passing, you can be assured that this documentation is correct and up-to-date.

### Get set up
- Install [Postman](https://www.postman.com/downloads)
- Run `$ npm i` to install node modules
- Run `$ node sign-transaction-server` to start local server for handling transaction signing. This is required because there are limitations in Postman's sandbox environment.

### Running the send transaction example
The `send_transaction.postman_collection.json` defines the scenario and `send_transaction_postman_environment.json` defines the environment variables. This example is designed to be run as a nightly test. As a result, the sender and receiver addresses are the same to allow funds to be "sent" to the same address. The scenario performs the following:
- Queries sender address for ada and native asset balance.
- Constructs a transaction to send some ada and 2 Testcoin to the sender address.
- Signs the transaction
- Submits the transaction to the Rosetta instance

#### It is possible for you to run this scenario yourself locally by following these steps:
- Firstly, you must have a Testnet account with some ada in it. You'll need the account's keys in order to sign a transaction.
- Edit `send_transaction_postman_environment.json` to use your private key, public key, sender address and recipient address.
- Import `send-transaction-postman_collection.json` and `send_transaction_postman_environment.json` into Postman.
- Unless your Testnet account also has a single UTxO with native assets, like the account used for nightly runs does, you'll need to modify the `operations` array used in the `/construction/preprocess` and `/construction/payloads` requests. The `operations` array defines the input and output for the transaction. You can remove the `metadata` object from each operation is there are no native assets involved.
- Create a new Runner using the imported collection and environment.
- Start Run using all requests.
- If there is a 200 response for the `/construction/submit` response then the transaction was submitted successfully. Please note, some of the tests in the Collection are specific to the nightly run and may fail, feel free to remove these if they do not assist you.
