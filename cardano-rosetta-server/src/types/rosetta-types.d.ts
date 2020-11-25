declare namespace Components {
  namespace Schemas {
    /**
     * An AccountBalanceRequest is utilized to make a balance request on the /account/balance endpoint. If the block_identifier is populated, a historical balance query should be performed.
     */
    export interface AccountBalanceRequest {
      network_identifier: /* The network_identifier specifies which network a particular object is associated with. */ NetworkIdentifier;
      account_identifier: /* The account_identifier uniquely identifies an account within a network. All fields in the account_identifier are utilized to determine this uniqueness (including the metadata field, if populated). */ AccountIdentifier;
      block_identifier?: /* When fetching data by BlockIdentifier, it may be possible to only specify the index or hash. If neither property is specified, it is assumed that the client is making a request at the current block. */ PartialBlockIdentifier;
    }
    /**
     * An AccountBalanceResponse is returned on the /account/balance endpoint. If an account has a balance for each AccountIdentifier describing it (ex: an ERC-20 token balance on a few smart contracts), an account balance request must be made with each AccountIdentifier.
     */
    export interface AccountBalanceResponse {
      block_identifier: /* The block_identifier uniquely identifies a block in a particular network. */ BlockIdentifier;
      /**
       * A single account may have a balance in multiple currencies.
       */
      balances: /* Amount is some Value of a Currency. It is considered invalid to specify a Value without a Currency. */ Amount[];
      /**
       * If a blockchain is UTXO-based, all unspent Coins owned by an account_identifier should be returned alongside the balance. It is highly recommended to populate this field so that users of the Rosetta API implementation don't need to maintain their own indexer to track their UTXOs.
       */
      coins?: /* Coin contains its unique identifier and the amount it represents. */ Coin[];
      /**
       * Account-based blockchains that utilize a nonce or sequence number should include that number in the metadata. This number could be unique to the identifier or global across the account address.
       * example:
       * {
       *   "sequence_number": 23
       * }
       */
      metadata?: {};
    }
    /**
     * The account_identifier uniquely identifies an account within a network. All fields in the account_identifier are utilized to determine this uniqueness (including the metadata field, if populated).
     */
    export interface AccountIdentifier {
      /**
       * The address may be a cryptographic public key (or some encoding of it) or a provided username.
       * example:
       * 0x3a065000ab4183c6bf581dc1e55a605455fc6d61
       */
      address: string;
      sub_account?: /* An account may have state specific to a contract address (ERC-20 token) and/or a stake (delegated balance). The sub_account_identifier should specify which state (if applicable) an account instantiation refers to. */ SubAccountIdentifier;
      /**
       * Blockchains that utilize a username model (where the address is not a derivative of a cryptographic public key) should specify the public key(s) owned by the address in metadata.
       */
      metadata?: {};
    }
    /**
     * * Base address - associated to a payment and a staking credential, * Reward address - associated to a staking credential * Enterprise address - holds no delegation rights and will be created when no stake key is sent to the API
     */
    export type AddressType = string;
    /**
     * Allow specifies supported Operation status, Operation types, and all possible error statuses. This Allow object is used by clients to validate the correctness of a Rosetta Server implementation. It is expected that these clients will error if they receive some response that contains any of the above information that is not specified here.
     */
    export interface Allow {
      /**
       * All Operation.Status this implementation supports. Any status that is returned during parsing that is not listed here will cause client validation to error.
       */
      operation_statuses: /**
       * OperationStatus is utilized to indicate which Operation status are considered successful.
       * example:
       * {
       *   "status": "SUCCESS",
       *   "successful": true
       * }
       */
      OperationStatus[];
      /**
       * All Operation.Type this implementation supports. Any type that is returned during parsing that is not listed here will cause client validation to error.
       */
      operation_types: string[];
      /**
       * All Errors that this implementation could return. Any error that is returned during parsing that is not listed here will cause client validation to error.
       */
      errors: /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Error[];
      /**
       * Any Rosetta implementation that supports querying the balance of an account at any height in the past should set this to true.
       */
      historical_balance_lookup: boolean;
    }
    /**
     * Amount is some Value of a Currency. It is considered invalid to specify a Value without a Currency.
     */
    export interface Amount {
      /**
       * Value of the transaction in atomic units represented as an arbitrary-sized signed integer. For example, 1 BTC would be represented by a value of 100000000.
       * example:
       * 1238089899992
       */
      value: string;
      currency: /* Currency is composed of a canonical Symbol and Decimals. This Decimals value is used to convert an Amount.Value from atomic units (Satoshis) to standard units (Bitcoins). */ Currency;
      metadata?: {};
    }
    /**
     * Blocks contain an array of Transactions that occurred at a particular BlockIdentifier. A hard requirement for blocks returned by Rosetta implementations is that they MUST be _inalterable_: once a client has requested and received a block identified by a specific BlockIndentifier, all future calls for that same BlockIdentifier must return the same block contents.
     */
    export interface Block {
      block_identifier: /* The block_identifier uniquely identifies a block in a particular network. */ BlockIdentifier;
      parent_block_identifier: /* The block_identifier uniquely identifies a block in a particular network. */ BlockIdentifier;
      timestamp: /**
       * The timestamp of the block in milliseconds since the Unix Epoch. The timestamp is stored in milliseconds because some blockchains produce blocks more often than once a second.
       * example:
       * 1582833600000
       */
      Timestamp /* int64 */;
      transactions: /* Transactions contain an array of Operations that are attributable to the same TransactionIdentifier. */ Transaction[];
      /**
       * example:
       * {
       *   "transactions_root": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
       *   "difficulty": "123891724987128947"
       * }
       */
      metadata?: {
        transactionsCount?: number;
        createdBy?: string;
        size?: number;
        epochNo?: number;
        slotNo?: number;
      };
    }
    /**
     * The block_identifier uniquely identifies a block in a particular network.
     */
    export interface BlockIdentifier {
      /**
       * This is also known as the block height.
       * example:
       * 1123941
       */
      index: number; // int64
      /**
       * example:
       * 0x1f2cc6c5027d2f201a5453ad1119574d2aed23a392654742ac3c78783c071f85
       */
      hash: string;
    }
    /**
     * A BlockRequest is utilized to make a block request on the /block endpoint.
     */
    export interface BlockRequest {
      network_identifier: /* The network_identifier specifies which network a particular object is associated with. */ NetworkIdentifier;
      block_identifier: /* When fetching data by BlockIdentifier, it may be possible to only specify the index or hash. If neither property is specified, it is assumed that the client is making a request at the current block. */ PartialBlockIdentifier;
    }
    /**
     * A BlockResponse includes a fully-populated block or a partially-populated block with a list of other transactions to fetch (other_transactions). As a result of the consensus algorithm of some blockchains, blocks can be omitted (i.e. certain block indexes can be skipped). If a query for one of these omitted indexes is made, the response should not include a `Block` object. It is VERY important to note that blocks MUST still form a canonical, connected chain of blocks where each block has a unique index. In other words, the `PartialBlockIdentifier` of a block after an omitted block should reference the last non-omitted block.
     */
    export interface BlockResponse {
      block: /* Blocks contain an array of Transactions that occurred at a particular BlockIdentifier. A hard requirement for blocks returned by Rosetta implementations is that they MUST be _inalterable_: once a client has requested and received a block identified by a specific BlockIndentifier, all future calls for that same BlockIdentifier must return the same block contents. */ Block;
      /**
       * Some blockchains may require additional transactions to be fetched that weren't returned in the block response (ex: block only returns transaction hashes). For blockchains with a lot of transactions in each block, this can be very useful as consumers can concurrently fetch all transactions returned.
       */
      other_transactions?: /* The transaction_identifier uniquely identifies a transaction in a particular network and block or in the mempool. */ TransactionIdentifier[];
    }
    /**
     * A BlockTransactionRequest is used to fetch a Transaction included in a block that is not returned in a BlockResponse.
     */
    export interface BlockTransactionRequest {
      network_identifier: /* The network_identifier specifies which network a particular object is associated with. */ NetworkIdentifier;
      block_identifier: /* The block_identifier uniquely identifies a block in a particular network. */ BlockIdentifier;
      transaction_identifier: /* The transaction_identifier uniquely identifies a transaction in a particular network and block or in the mempool. */ TransactionIdentifier;
    }
    /**
     * A BlockTransactionResponse contains information about a block transaction.
     */
    export interface BlockTransactionResponse {
      transaction: /* Transactions contain an array of Operations that are attributable to the same TransactionIdentifier. */ Transaction;
    }
    /**
     * Coin contains its unique identifier and the amount it represents.
     */
    export interface Coin {
      coin_identifier: /* CoinIdentifier uniquely identifies a Coin. */ CoinIdentifier;
      amount: /* Amount is some Value of a Currency. It is considered invalid to specify a Value without a Currency. */ Amount;
    }
    /**
     * CoinActions are different state changes that a Coin can undergo. When a Coin is created, it is coin_created. When a Coin is spent, it is coin_spent. It is assumed that a single Coin cannot be created or spent more than once.
     */
    export type CoinAction = 'coin_created' | 'coin_spent';
    /**
     * CoinChange is used to represent a change in state of a some coin identified by a coin_identifier. This object is part of the Operation model and must be populated for UTXO-based blockchains. Coincidentally, this abstraction of UTXOs allows for supporting both account-based transfers and UTXO-based transfers on the same blockchain (when a transfer is account-based, don't populate this model).
     */
    export interface CoinChange {
      coin_identifier: /* CoinIdentifier uniquely identifies a Coin. */ CoinIdentifier;
      coin_action: /* CoinActions are different state changes that a Coin can undergo. When a Coin is created, it is coin_created. When a Coin is spent, it is coin_spent. It is assumed that a single Coin cannot be created or spent more than once. */ CoinAction;
    }
    /**
     * CoinIdentifier uniquely identifies a Coin.
     */
    export interface CoinIdentifier {
      /**
       * Identifier should be populated with a globally unique identifier of a Coin. In Bitcoin, this identifier would be transaction_hash:index.
       * example:
       * 0x2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:1
       */
      identifier: string;
    }
    /**
     * ConstructionCombineRequest is the input to the `/construction/combine` endpoint. It contains the unsigned transaction blob returned by `/construction/payloads` and all required signatures to create a network transaction.
     */
    export interface ConstructionCombineRequest {
      network_identifier: /* The network_identifier specifies which network a particular object is associated with. */ NetworkIdentifier;
      unsigned_transaction: string;
      signatures: /* Signature contains the payload that was signed, the public keys of the keypairs used to produce the signature, the signature (encoded in hex), and the SignatureType. PublicKey is often times not known during construction of the signing payloads but may be needed to combine signatures properly. */ Signature[];
    }
    /**
     * ConstructionCombineResponse is returned by `/construction/combine`. The network payload will be sent directly to the `construction/submit` endpoint.
     */
    export interface ConstructionCombineResponse {
      signed_transaction: string;
    }
    /**
     * ConstructionDeriveRequest is passed to the `/construction/derive` endpoint. Network is provided in the request because some blockchains have different address formats for different networks. Metadata is provided in the request because some blockchains allow for multiple address types (i.e. different address for validators vs normal accounts).
     */
    export interface ConstructionDeriveRequest {
      network_identifier: /* The network_identifier specifies which network a particular object is associated with. */ NetworkIdentifier;
      public_key: /* PublicKey contains a public key byte array for a particular CurveType encoded in hex. Note that there is no PrivateKey struct as this is NEVER the concern of an implementation. */ PublicKey;
      metadata?: {
        staking_credential?: /* PublicKey contains a public key byte array for a particular CurveType encoded in hex. Note that there is no PrivateKey struct as this is NEVER the concern of an implementation. */ PublicKey;
        address_type?: /* * Base address - associated to a payment and a staking credential, * Reward address - associated to a staking credential * Enterprise address - holds no delegation rights and will be created when no stake key is sent to the API */ AddressType;
      };
    }
    /**
     * ConstructionDeriveResponse is returned by the `/construction/derive` endpoint.
     */
    export interface ConstructionDeriveResponse {
      /**
       * [DEPRECATED by `account_identifier` in `v1.4.4`] Address in network-specific format.
       */
      address: string;
      account_identifier?: /* The account_identifier uniquely identifies an account within a network. All fields in the account_identifier are utilized to determine this uniqueness (including the metadata field, if populated). */ AccountIdentifier;
      metadata?: {};
    }
    /**
     * ConstructionHashRequest is the input to the `/construction/hash` endpoint.
     */
    export interface ConstructionHashRequest {
      network_identifier: /* The network_identifier specifies which network a particular object is associated with. */ NetworkIdentifier;
      signed_transaction: string;
    }
    /**
     * A ConstructionMetadataRequest is utilized to get information required to construct a transaction. The Options object used to specify which metadata to return is left purposely unstructured to allow flexibility for implementers. Optionally, the request can also include an array of PublicKeys associated with the AccountIdentifiers returned in ConstructionPreprocessResponse.
     */
    export interface ConstructionMetadataRequest {
      network_identifier: /* The network_identifier specifies which network a particular object is associated with. */ NetworkIdentifier;
      /**
       * Some blockchains require different metadata for different types of transaction construction (ex: delegation versus a transfer). Instead of requiring a blockchain node to return all possible types of metadata for construction (which may require multiple node fetches), the client can populate an options object to limit the metadata returned to only the subset required.
       */
      options: {
        relative_ttl: number;
        transaction_size: number;
      };
      public_keys?: /* PublicKey contains a public key byte array for a particular CurveType encoded in hex. Note that there is no PrivateKey struct as this is NEVER the concern of an implementation. */ PublicKey[];
    }
    /**
     * The ConstructionMetadataResponse returns network-specific metadata used for transaction construction. Optionally, the implementer can return the suggested fee associated with the transaction being constructed. The caller may use this info to adjust the intent of the transaction or to create a transaction with a different account that can pay the suggested fee. Suggested fee is an array in case fee payment must occur in multiple currencies.
     */
    export interface ConstructionMetadataResponse {
      /**
       * example:
       * {
       *   "account_sequence": 23,
       *   "recent_block_hash": "0x52bc44d5378309ee2abf1539bf71de1b7d7be3b5"
       * }
       */
      metadata: {
        ttl?: string;
      };
      suggested_fee?: /* Amount is some Value of a Currency. It is considered invalid to specify a Value without a Currency. */ Amount[];
    }
    /**
     * ConstructionParseRequest is the input to the `/construction/parse` endpoint. It allows the caller to parse either an unsigned or signed transaction.
     */
    export interface ConstructionParseRequest {
      network_identifier: /* The network_identifier specifies which network a particular object is associated with. */ NetworkIdentifier;
      /**
       * Signed is a boolean indicating whether the transaction is signed.
       */
      signed: boolean;
      /**
       * This must be either the unsigned transaction blob returned by `/construction/payloads` or the signed transaction blob returned by `/construction/combine`.
       */
      transaction: string;
    }
    /**
     * ConstructionParseResponse contains an array of operations that occur in a transaction blob. This should match the array of operations provided to `/construction/preprocess` and `/construction/payloads`.
     */
    export interface ConstructionParseResponse {
      operations: /* Operations contain all balance-changing information within a transaction. They are always one-sided (only affect 1 AccountIdentifier) and can succeed or fail independently from a Transaction. */ Operation[];
      /**
       * [DEPRECATED by `account_identifier_signers` in `v1.4.4`] All signers (addresses) of a particular transaction. If the transaction is unsigned, it should be empty.
       */
      signers: string[];
      account_identifier_signers?: /* The account_identifier uniquely identifies an account within a network. All fields in the account_identifier are utilized to determine this uniqueness (including the metadata field, if populated). */ AccountIdentifier[];
      metadata?: {};
    }
    /**
     * ConstructionPayloadsRequest is the request to `/construction/payloads`. It contains the network, a slice of operations, and arbitrary metadata that was returned by the call to `/construction/metadata`. Optionally, the request can also include an array of PublicKeys associated with the AccountIdentifiers returned in ConstructionPreprocessResponse.
     */
    export interface ConstructionPayloadsRequest {
      network_identifier: /* The network_identifier specifies which network a particular object is associated with. */ NetworkIdentifier;
      operations: /* Operations contain all balance-changing information within a transaction. They are always one-sided (only affect 1 AccountIdentifier) and can succeed or fail independently from a Transaction. */ Operation[];
      metadata: {
        ttl: string;
      };
      public_keys?: /* PublicKey contains a public key byte array for a particular CurveType encoded in hex. Note that there is no PrivateKey struct as this is NEVER the concern of an implementation. */ PublicKey[];
    }
    /**
     * ConstructionTransactionResponse is returned by `/construction/payloads`. It contains an unsigned transaction blob (that is usually needed to construct the a network transaction from a collection of signatures) and an array of payloads that must be signed by the caller.
     */
    export interface ConstructionPayloadsResponse {
      unsigned_transaction: string;
      payloads: /* SigningPayload is signed by the client with the keypair associated with an AccountIdentifier using the specified SignatureType. SignatureType can be optionally populated if there is a restriction on the signature scheme that can be used to sign the payload. */ SigningPayload[];
    }
    /**
     * ConstructionPreprocessRequest is passed to the `/construction/preprocess` endpoint so that a Rosetta implementation can determine which metadata it needs to request for construction. Metadata provided in this object should NEVER be a product of live data (i.e. the caller must follow some network-specific data fetching strategy outside of the Construction API to populate required Metadata). If live data is required for construction, it MUST be fetched in the call to `/construction/metadata`. The caller can provide a max fee they are willing to pay for a transaction. This is an array in the case fees must be paid in multiple currencies. The caller can also provide a suggested fee multiplier to indicate that the suggested fee should be scaled. This may be used to set higher fees for urgent transactions or to pay lower fees when there is less urgency. It is assumed that providing a very low multiplier (like 0.0001) will never lead to a transaction being created with a fee less than the minimum network fee (if applicable). In the case that the caller provides both a max fee and a suggested fee multiplier, the max fee will set an upper bound on the suggested fee (regardless of the multiplier provided).
     */
    export interface ConstructionPreprocessRequest {
      network_identifier: /* The network_identifier specifies which network a particular object is associated with. */ NetworkIdentifier;
      operations: /* Operations contain all balance-changing information within a transaction. They are always one-sided (only affect 1 AccountIdentifier) and can succeed or fail independently from a Transaction. */ Operation[];
      metadata?: {
        relative_ttl: number;
      };
      max_fee?: /* Amount is some Value of a Currency. It is considered invalid to specify a Value without a Currency. */ Amount[];
      suggested_fee_multiplier?: number; // double
    }
    /**
     * ConstructionPreprocessResponse contains `options` that will be sent unmodified to `/construction/metadata`. If it is not necessary to make a request to `/construction/metadata`, `options` should be omitted.  Some blockchains require the PublicKey of particular AccountIdentifiers to construct a valid transaction. To fetch these PublicKeys, populate `required_public_keys` with the AccountIdentifiers associated with the desired PublicKeys. If it is not necessary to retrieve any PublicKeys for construction, `required_public_keys` should be omitted.
     */
    export interface ConstructionPreprocessResponse {
      /**
       * The options that will be sent directly to `/construction/metadata` by the caller.
       */
      options?: {
        relative_ttl: number;
        transaction_size: number;
      };
      required_public_keys?: /* The account_identifier uniquely identifies an account within a network. All fields in the account_identifier are utilized to determine this uniqueness (including the metadata field, if populated). */ AccountIdentifier[];
    }
    /**
     * The transaction submission request includes a signed transaction.
     */
    export interface ConstructionSubmitRequest {
      network_identifier: /* The network_identifier specifies which network a particular object is associated with. */ NetworkIdentifier;
      signed_transaction: string;
    }
    /**
     * Currency is composed of a canonical Symbol and Decimals. This Decimals value is used to convert an Amount.Value from atomic units (Satoshis) to standard units (Bitcoins).
     */
    export interface Currency {
      /**
       * Canonical symbol associated with a currency.
       * example:
       * BTC
       */
      symbol: string;
      /**
       * Number of decimal places in the standard unit representation of the amount. For example, BTC has 8 decimals. Note that it is not possible to represent the value of some currency in atomic units that is not base 10.
       * example:
       * 8
       */
      decimals: number; // int32
      /**
       * Any additional information related to the currency itself. For example, it would be useful to populate this object with the contract address of an ERC-20 token.
       * example:
       * {
       *   "Issuer": "Satoshi"
       * }
       */
      metadata?: {};
    }
    /**
     * CurveType is the type of cryptographic curve associated with a PublicKey. * secp256k1: SEC compressed - `33 bytes` (https://secg.org/sec1-v2.pdf#subsubsection.2.3.3) * secp256r1: SEC compressed - `33 bytes` (https://secg.org/sec1-v2.pdf#subsubsection.2.3.3) * edwards25519: `y (255-bits) || x-sign-bit (1-bit)` - `32 bytes` (https://ed25519.cr.yp.to/ed25519-20110926.pdf) * tweedle: 1st pk : Fq.t (32 bytes) || 2nd pk : Fq.t (32 bytes) (https://github.com/CodaProtocol/coda/blob/develop/rfcs/0038-rosetta-construction-api.md#marshal-keys)
     */
    export type CurveType = 'secp256k1' | 'secp256r1' | 'edwards25519' | 'tweedle';
    /**
     * Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields.
     */
    export interface Error {
      /**
       * Code is a network-specific error code. If desired, this code can be equivalent to an HTTP status code.
       * example:
       * 12
       */
      code: number; // int32
      /**
       * Message is a network-specific error message. The message MUST NOT change for a given code. In particular, this means that any contextual information should be included in the details field.
       * example:
       * Invalid account format
       */
      message: string;
      /**
       * An error is retriable if the same request may succeed if submitted again.
       */
      retriable: boolean;
      /**
       * Often times it is useful to return context specific to the request that caused the error (i.e. a sample of the stack trace or impacted account) in addition to the standard error message.
       * example:
       * {
       *   "address": "0x1dcc4de8dec75d7aab85b567b6",
       *   "error": "not base64"
       * }
       */
      details?: {
        message: string;
      };
    }
    /**
     * A MempoolResponse contains all transaction identifiers in the mempool for a particular network_identifier.
     */
    export interface MempoolResponse {
      transaction_identifiers: /* The transaction_identifier uniquely identifies a transaction in a particular network and block or in the mempool. */ TransactionIdentifier[];
    }
    /**
     * A MempoolTransactionRequest is utilized to retrieve a transaction from the mempool.
     */
    export interface MempoolTransactionRequest {
      network_identifier: /* The network_identifier specifies which network a particular object is associated with. */ NetworkIdentifier;
      transaction_identifier: /* The transaction_identifier uniquely identifies a transaction in a particular network and block or in the mempool. */ TransactionIdentifier;
    }
    /**
     * A MempoolTransactionResponse contains an estimate of a mempool transaction. It may not be possible to know the full impact of a transaction in the mempool (ex: fee paid).
     */
    export interface MempoolTransactionResponse {
      transaction: /* Transactions contain an array of Operations that are attributable to the same TransactionIdentifier. */ Transaction;
      /**
       * example:
       * {
       *   "descendant_fees": 123923,
       *   "ancestor_count": 2
       * }
       */
      metadata?: {};
    }
    /**
     * A MetadataRequest is utilized in any request where the only argument is optional metadata.
     */
    export interface MetadataRequest {
      metadata?: {};
    }
    /**
     * The network_identifier specifies which network a particular object is associated with.
     */
    export interface NetworkIdentifier {
      /**
       * example:
       * bitcoin
       */
      blockchain: string;
      /**
       * If a blockchain has a specific chain-id or network identifier, it should go in this field. It is up to the client to determine which network-specific identifier is mainnet or testnet.
       * example:
       * mainnet
       */
      network: string;
      sub_network_identifier?: /* In blockchains with sharded state, the SubNetworkIdentifier is required to query some object on a specific shard. This identifier is optional for all non-sharded blockchains. */ SubNetworkIdentifier;
    }
    /**
     * A NetworkListResponse contains all NetworkIdentifiers that the node can serve information for.
     */
    export interface NetworkListResponse {
      network_identifiers: /* The network_identifier specifies which network a particular object is associated with. */ NetworkIdentifier[];
    }
    /**
     * NetworkOptionsResponse contains information about the versioning of the node and the allowed operation statuses, operation types, and errors.
     */
    export interface NetworkOptionsResponse {
      version: /* The Version object is utilized to inform the client of the versions of different components of the Rosetta implementation. */ Version;
      allow: /* Allow specifies supported Operation status, Operation types, and all possible error statuses. This Allow object is used by clients to validate the correctness of a Rosetta Server implementation. It is expected that these clients will error if they receive some response that contains any of the above information that is not specified here. */ Allow;
    }
    /**
     * A NetworkRequest is utilized to retrieve some data specific exclusively to a NetworkIdentifier.
     */
    export interface NetworkRequest {
      network_identifier: /* The network_identifier specifies which network a particular object is associated with. */ NetworkIdentifier;
      metadata?: {};
    }
    /**
     * NetworkStatusResponse contains basic information about the node's view of a blockchain network. It is assumed that any BlockIdentifier.Index less than or equal to CurrentBlockIdentifier.Index can be queried. If a Rosetta implementation prunes historical state, it should populate the optional `oldest_block_identifier` field with the oldest block available to query. If this is not populated, it is assumed that the `genesis_block_identifier` is the oldest queryable block. If a Rosetta implementation performs some pre-sync before it is possible to query blocks, sync_status should be populated so that clients can still monitor healthiness. Without this field, it may appear that the implementation is stuck syncing and needs to be terminated.
     */
    export interface NetworkStatusResponse {
      current_block_identifier: /* The block_identifier uniquely identifies a block in a particular network. */ BlockIdentifier;
      current_block_timestamp: /**
       * The timestamp of the block in milliseconds since the Unix Epoch. The timestamp is stored in milliseconds because some blockchains produce blocks more often than once a second.
       * example:
       * 1582833600000
       */
      Timestamp /* int64 */;
      genesis_block_identifier: /* The block_identifier uniquely identifies a block in a particular network. */ BlockIdentifier;
      oldest_block_identifier?: /* The block_identifier uniquely identifies a block in a particular network. */ BlockIdentifier;
      sync_status?: /* SyncStatus is used to provide additional context about an implementation's sync status. It is often used to indicate that an implementation is healthy when it cannot be queried  until some sync phase occurs. If an implementation is immediately queryable, this model is often not populated. */ SyncStatus;
      peers: /* A Peer is a representation of a node's peer. */ Peer[];
    }
    /**
     * Operations contain all balance-changing information within a transaction. They are always one-sided (only affect 1 AccountIdentifier) and can succeed or fail independently from a Transaction.
     */
    export interface Operation {
      operation_identifier: /* The operation_identifier uniquely identifies an operation within a transaction. */ OperationIdentifier;
      /**
       * Restrict referenced related_operations to identifier indexes < the current operation_identifier.index. This ensures there exists a clear DAG-structure of relations. Since operations are one-sided, one could imagine relating operations in a single transfer or linking operations in a call tree.
       * example:
       * [
       *   {
       *     "index": 1
       *   },
       *   {
       *     "index": 2
       *   }
       * ]
       */
      related_operations?: /* The operation_identifier uniquely identifies an operation within a transaction. */ OperationIdentifier[];
      /**
       * The network-specific type of the operation. Ensure that any type that can be returned here is also specified in the NetworkOptionsResponse. This can be very useful to downstream consumers that parse all block data.
       * example:
       * Transfer
       */
      type: string;
      /**
       * The network-specific status of the operation. Status is not defined on the transaction object because blockchains with smart contracts may have transactions that partially apply. Blockchains with atomic transactions (all operations succeed or all operations fail) will have the same status for each operation.
       * example:
       * Reverted
       */
      status: string;
      account?: /* The account_identifier uniquely identifies an account within a network. All fields in the account_identifier are utilized to determine this uniqueness (including the metadata field, if populated). */ AccountIdentifier;
      amount?: /* Amount is some Value of a Currency. It is considered invalid to specify a Value without a Currency. */ Amount;
      coin_change?: /* CoinChange is used to represent a change in state of a some coin identified by a coin_identifier. This object is part of the Operation model and must be populated for UTXO-based blockchains. Coincidentally, this abstraction of UTXOs allows for supporting both account-based transfers and UTXO-based transfers on the same blockchain (when a transfer is account-based, don't populate this model). */ CoinChange;
      metadata?: /* Metadata related to Cardano operations */ OperationMetadata;
    }
    /**
     * The operation_identifier uniquely identifies an operation within a transaction.
     */
    export interface OperationIdentifier {
      /**
       * The operation index is used to ensure each operation has a unique identifier within a transaction. This index is only relative to the transaction and NOT GLOBAL. The operations in each transaction should start from index 0. To clarify, there may not be any notion of an operation index in the blockchain being described.
       * example:
       * 5
       */
      index: number; // int64
      /**
       * Some blockchains specify an operation index that is essential for client use. For example, Bitcoin uses a network_index to identify which UTXO was used in a transaction. network_index should not be populated if there is no notion of an operation index in a blockchain (typically most account-based blockchains).
       * example:
       * 0
       */
      network_index?: number; // int64
    }
    /**
     * Metadata related to Cardano operations
     */
    export interface OperationMetadata {
      /**
       * If it's a withdrawal operation, the amount will re returned here.
       */
      withdrawalAmount?: /* Amount is some Value of a Currency. It is considered invalid to specify a Value without a Currency. */ Amount;
      staking_credential?: /* PublicKey contains a public key byte array for a particular CurveType encoded in hex. Note that there is no PrivateKey struct as this is NEVER the concern of an implementation. */ PublicKey;
      pool_key_hash?: string;
      /**
       * If it's a registration operation, the amount will re returned here.
       */
      depositAmount?: /* Amount is some Value of a Currency. It is considered invalid to specify a Value without a Currency. */ Amount;
    }
    /**
     * OperationStatus is utilized to indicate which Operation status are considered successful.
     * example:
     * {
     *   "status": "SUCCESS",
     *   "successful": true
     * }
     */
    export interface OperationStatus {
      /**
       * The status is the network-specific status of the operation.
       */
      status: string;
      /**
       * An Operation is considered successful if the Operation.Amount should affect the Operation.Account. Some blockchains (like Bitcoin) only include successful operations in blocks but other blockchains (like Ethereum) include unsuccessful operations that incur a fee. To reconcile the computed balance from the stream of Operations, it is critical to understand which Operation.Status indicate an Operation is successful and should affect an Account.
       */
      successful: boolean;
    }
    /**
     * When fetching data by BlockIdentifier, it may be possible to only specify the index or hash. If neither property is specified, it is assumed that the client is making a request at the current block.
     */
    export interface PartialBlockIdentifier {
      /**
       * example:
       * 1123941
       */
      index?: number; // int64
      /**
       * example:
       * 0x1f2cc6c5027d2f201a5453ad1119574d2aed23a392654742ac3c78783c071f85
       */
      hash?: string;
    }
    /**
     * A Peer is a representation of a node's peer.
     */
    export interface Peer {
      /**
       * example:
       * 0x52bc44d5378309ee2abf1539bf71de1b7d7be3b5
       */
      peer_id: string;
      metadata?: {};
    }
    /**
     * PublicKey contains a public key byte array for a particular CurveType encoded in hex. Note that there is no PrivateKey struct as this is NEVER the concern of an implementation.
     */
    export interface PublicKey {
      /**
       * Hex-encoded public key bytes in the format specified by the CurveType.
       */
      hex_bytes: string;
      curve_type: /* CurveType is the type of cryptographic curve associated with a PublicKey. * secp256k1: SEC compressed - `33 bytes` (https://secg.org/sec1-v2.pdf#subsubsection.2.3.3) * secp256r1: SEC compressed - `33 bytes` (https://secg.org/sec1-v2.pdf#subsubsection.2.3.3) * edwards25519: `y (255-bits) || x-sign-bit (1-bit)` - `32 bytes` (https://ed25519.cr.yp.to/ed25519-20110926.pdf) * tweedle: 1st pk : Fq.t (32 bytes) || 2nd pk : Fq.t (32 bytes) (https://github.com/CodaProtocol/coda/blob/develop/rfcs/0038-rosetta-construction-api.md#marshal-keys) */ CurveType;
    }
    /**
     * Signature contains the payload that was signed, the public keys of the keypairs used to produce the signature, the signature (encoded in hex), and the SignatureType. PublicKey is often times not known during construction of the signing payloads but may be needed to combine signatures properly.
     */
    export interface Signature {
      signing_payload: /* SigningPayload is signed by the client with the keypair associated with an AccountIdentifier using the specified SignatureType. SignatureType can be optionally populated if there is a restriction on the signature scheme that can be used to sign the payload. */ SigningPayload;
      public_key: /* PublicKey contains a public key byte array for a particular CurveType encoded in hex. Note that there is no PrivateKey struct as this is NEVER the concern of an implementation. */ PublicKey;
      signature_type: /* SignatureType is the type of a cryptographic signature. * ecdsa: `r (32-bytes) || s (32-bytes)` - `64 bytes` * ecdsa_recovery: `r (32-bytes) || s (32-bytes) || v (1-byte)` - `65 bytes` * ed25519: `R (32-byte) || s (32-bytes)` - `64 bytes` * schnorr_1: `r (32-bytes) || s (32-bytes)` - `64 bytes`  (schnorr signature implemented by Zilliqa where both `r` and `s` are scalars encoded as `32-bytes` values, most significant byte first.) * schnorr_poseidon: `r (32-bytes) || s (32-bytes)` where s = Hash(1st pk || 2nd pk || r) - `64 bytes`  (schnorr signature w/ Poseidon hash function implemented by O(1) Labs where both `r` and `s` are scalars encoded as `32-bytes` values, least significant byte first. https://github.com/CodaProtocol/signer-reference/blob/master/schnorr.ml ) */ SignatureType;
      hex_bytes: string;
    }
    /**
     * SignatureType is the type of a cryptographic signature. * ecdsa: `r (32-bytes) || s (32-bytes)` - `64 bytes` * ecdsa_recovery: `r (32-bytes) || s (32-bytes) || v (1-byte)` - `65 bytes` * ed25519: `R (32-byte) || s (32-bytes)` - `64 bytes` * schnorr_1: `r (32-bytes) || s (32-bytes)` - `64 bytes`  (schnorr signature implemented by Zilliqa where both `r` and `s` are scalars encoded as `32-bytes` values, most significant byte first.) * schnorr_poseidon: `r (32-bytes) || s (32-bytes)` where s = Hash(1st pk || 2nd pk || r) - `64 bytes`  (schnorr signature w/ Poseidon hash function implemented by O(1) Labs where both `r` and `s` are scalars encoded as `32-bytes` values, least significant byte first. https://github.com/CodaProtocol/signer-reference/blob/master/schnorr.ml )
     */
    export type SignatureType = 'ecdsa' | 'ecdsa_recovery' | 'ed25519' | 'schnorr_1' | 'schnorr_poseidon';
    /**
     * SigningPayload is signed by the client with the keypair associated with an AccountIdentifier using the specified SignatureType. SignatureType can be optionally populated if there is a restriction on the signature scheme that can be used to sign the payload.
     */
    export interface SigningPayload {
      /**
       * [DEPRECATED by `account_identifier` in `v1.4.4`] The network-specific address of the account that should sign the payload.
       */
      address?: string;
      account_identifier?: /* The account_identifier uniquely identifies an account within a network. All fields in the account_identifier are utilized to determine this uniqueness (including the metadata field, if populated). */ AccountIdentifier;
      hex_bytes: string;
      signature_type?: /* SignatureType is the type of a cryptographic signature. * ecdsa: `r (32-bytes) || s (32-bytes)` - `64 bytes` * ecdsa_recovery: `r (32-bytes) || s (32-bytes) || v (1-byte)` - `65 bytes` * ed25519: `R (32-byte) || s (32-bytes)` - `64 bytes` * schnorr_1: `r (32-bytes) || s (32-bytes)` - `64 bytes`  (schnorr signature implemented by Zilliqa where both `r` and `s` are scalars encoded as `32-bytes` values, most significant byte first.) * schnorr_poseidon: `r (32-bytes) || s (32-bytes)` where s = Hash(1st pk || 2nd pk || r) - `64 bytes`  (schnorr signature w/ Poseidon hash function implemented by O(1) Labs where both `r` and `s` are scalars encoded as `32-bytes` values, least significant byte first. https://github.com/CodaProtocol/signer-reference/blob/master/schnorr.ml ) */ SignatureType;
    }
    /**
     * An account may have state specific to a contract address (ERC-20 token) and/or a stake (delegated balance). The sub_account_identifier should specify which state (if applicable) an account instantiation refers to.
     */
    export interface SubAccountIdentifier {
      /**
       * The SubAccount address may be a cryptographic value or some other identifier (ex: bonded) that uniquely specifies a SubAccount.
       * example:
       * 0x6b175474e89094c44da98b954eedeac495271d0f
       */
      address: string;
      /**
       * If the SubAccount address is not sufficient to uniquely specify a SubAccount, any other identifying information can be stored here. It is important to note that two SubAccounts with identical addresses but differing metadata will not be considered equal by clients.
       */
      metadata?: {};
    }
    /**
     * In blockchains with sharded state, the SubNetworkIdentifier is required to query some object on a specific shard. This identifier is optional for all non-sharded blockchains.
     */
    export interface SubNetworkIdentifier {
      /**
       * example:
       * shard 1
       */
      network: string;
      /**
       * example:
       * {
       *   "producer": "0x52bc44d5378309ee2abf1539bf71de1b7d7be3b5"
       * }
       */
      metadata?: {};
    }
    /**
     * SyncStatus is used to provide additional context about an implementation's sync status. It is often used to indicate that an implementation is healthy when it cannot be queried  until some sync phase occurs. If an implementation is immediately queryable, this model is often not populated.
     */
    export interface SyncStatus {
      /**
       * CurrentIndex is the index of the last synced block in the current stage.
       * example:
       * 100
       */
      current_index: number; // int64
      /**
       * TargetIndex is the index of the block that the implementation is attempting to sync to in the current stage.
       * example:
       * 150
       */
      target_index?: number; // int64
      /**
       * Stage is the phase of the sync process.
       * example:
       * header sync
       */
      stage?: string;
    }
    /**
     * The timestamp of the block in milliseconds since the Unix Epoch. The timestamp is stored in milliseconds because some blockchains produce blocks more often than once a second.
     * example:
     * 1582833600000
     */
    export type Timestamp = number; // int64
    /**
     * Transactions contain an array of Operations that are attributable to the same TransactionIdentifier.
     */
    export interface Transaction {
      transaction_identifier: /* The transaction_identifier uniquely identifies a transaction in a particular network and block or in the mempool. */ TransactionIdentifier;
      operations: /* Operations contain all balance-changing information within a transaction. They are always one-sided (only affect 1 AccountIdentifier) and can succeed or fail independently from a Transaction. */ Operation[];
      /**
       * Transactions that are related to other transactions (like a cross-shard transaction) should include the tranaction_identifier of these transactions in the metadata.
       * example:
       * {
       *   "size": 12378,
       *   "lockTime": 1582272577
       * }
       */
      metadata?: {};
    }
    /**
     * The transaction_identifier uniquely identifies a transaction in a particular network and block or in the mempool.
     */
    export interface TransactionIdentifier {
      /**
       * Any transactions that are attributable only to a block (ex: a block event) should use the hash of the block as the identifier.
       * example:
       * 0x2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f
       */
      hash: string;
    }
    /**
     * TransactionIdentifierResponse contains the transaction_identifier of a transaction that was submitted to either `/construction/hash` or `/construction/submit`.
     */
    export interface TransactionIdentifierResponse {
      transaction_identifier: /* The transaction_identifier uniquely identifies a transaction in a particular network and block or in the mempool. */ TransactionIdentifier;
      metadata?: {};
    }
    /**
     * Unspent set for a given Account
     */
    export interface Utxo {
      value: string;
      index: number;
      transactionHash: string;
    }
    /**
     * The Version object is utilized to inform the client of the versions of different components of the Rosetta implementation.
     */
    export interface Version {
      /**
       * The rosetta_version is the version of the Rosetta interface the implementation adheres to. This can be useful for clients looking to reliably parse responses.
       * example:
       * 1.2.5
       */
      rosetta_version: string;
      /**
       * The node_version is the canonical version of the node runtime. This can help clients manage deployments.
       * example:
       * 1.0.2
       */
      node_version: string;
      /**
       * When a middleware server is used to adhere to the Rosetta interface, it should return its version here. This can help clients manage deployments.
       * example:
       * 0.2.7
       */
      middleware_version?: string;
      /**
       * Any other information that may be useful about versioning of dependent services should be returned here.
       */
      metadata?: {};
    }
  }
}
declare namespace Paths {
  namespace AccountBalance {
    export type RequestBody = /* An AccountBalanceRequest is utilized to make a balance request on the /account/balance endpoint. If the block_identifier is populated, a historical balance query should be performed. */ Components.Schemas.AccountBalanceRequest;
    namespace Responses {
      export type $200 = /* An AccountBalanceResponse is returned on the /account/balance endpoint. If an account has a balance for each AccountIdentifier describing it (ex: an ERC-20 token balance on a few smart contracts), an account balance request must be made with each AccountIdentifier. */ Components.Schemas.AccountBalanceResponse;
      export type $500 = /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
  }
  namespace Block {
    export type RequestBody = /* A BlockRequest is utilized to make a block request on the /block endpoint. */ Components.Schemas.BlockRequest;
    namespace Responses {
      export type $200 = /* A BlockResponse includes a fully-populated block or a partially-populated block with a list of other transactions to fetch (other_transactions). As a result of the consensus algorithm of some blockchains, blocks can be omitted (i.e. certain block indexes can be skipped). If a query for one of these omitted indexes is made, the response should not include a `Block` object. It is VERY important to note that blocks MUST still form a canonical, connected chain of blocks where each block has a unique index. In other words, the `PartialBlockIdentifier` of a block after an omitted block should reference the last non-omitted block. */ Components.Schemas.BlockResponse;
      export type $500 = /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
  }
  namespace BlockTransaction {
    export type RequestBody = /* A BlockTransactionRequest is used to fetch a Transaction included in a block that is not returned in a BlockResponse. */ Components.Schemas.BlockTransactionRequest;
    namespace Responses {
      export type $200 = /* A BlockTransactionResponse contains information about a block transaction. */ Components.Schemas.BlockTransactionResponse;
      export type $500 = /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
  }
  namespace ConstructionCombine {
    export type RequestBody = /* ConstructionCombineRequest is the input to the `/construction/combine` endpoint. It contains the unsigned transaction blob returned by `/construction/payloads` and all required signatures to create a network transaction. */ Components.Schemas.ConstructionCombineRequest;
    namespace Responses {
      export type $200 = /* ConstructionCombineResponse is returned by `/construction/combine`. The network payload will be sent directly to the `construction/submit` endpoint. */ Components.Schemas.ConstructionCombineResponse;
      export type $500 = /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
  }
  namespace ConstructionDerive {
    export type RequestBody = /* ConstructionDeriveRequest is passed to the `/construction/derive` endpoint. Network is provided in the request because some blockchains have different address formats for different networks. Metadata is provided in the request because some blockchains allow for multiple address types (i.e. different address for validators vs normal accounts). */ Components.Schemas.ConstructionDeriveRequest;
    namespace Responses {
      export type $200 = /* ConstructionDeriveResponse is returned by the `/construction/derive` endpoint. */ Components.Schemas.ConstructionDeriveResponse;
      export type $500 = /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
  }
  namespace ConstructionHash {
    export type RequestBody = /* ConstructionHashRequest is the input to the `/construction/hash` endpoint. */ Components.Schemas.ConstructionHashRequest;
    namespace Responses {
      export type $200 = /* TransactionIdentifierResponse contains the transaction_identifier of a transaction that was submitted to either `/construction/hash` or `/construction/submit`. */ Components.Schemas.TransactionIdentifierResponse;
      export type $500 = /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
  }
  namespace ConstructionMetadata {
    export type RequestBody = /* A ConstructionMetadataRequest is utilized to get information required to construct a transaction. The Options object used to specify which metadata to return is left purposely unstructured to allow flexibility for implementers. Optionally, the request can also include an array of PublicKeys associated with the AccountIdentifiers returned in ConstructionPreprocessResponse. */ Components.Schemas.ConstructionMetadataRequest;
    namespace Responses {
      export type $200 = /* The ConstructionMetadataResponse returns network-specific metadata used for transaction construction. Optionally, the implementer can return the suggested fee associated with the transaction being constructed. The caller may use this info to adjust the intent of the transaction or to create a transaction with a different account that can pay the suggested fee. Suggested fee is an array in case fee payment must occur in multiple currencies. */ Components.Schemas.ConstructionMetadataResponse;
      export type $500 = /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
  }
  namespace ConstructionParse {
    export type RequestBody = /* ConstructionParseRequest is the input to the `/construction/parse` endpoint. It allows the caller to parse either an unsigned or signed transaction. */ Components.Schemas.ConstructionParseRequest;
    namespace Responses {
      export type $200 = /* ConstructionParseResponse contains an array of operations that occur in a transaction blob. This should match the array of operations provided to `/construction/preprocess` and `/construction/payloads`. */ Components.Schemas.ConstructionParseResponse;
      export type $500 = /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
  }
  namespace ConstructionPayloads {
    export type RequestBody = /* ConstructionPayloadsRequest is the request to `/construction/payloads`. It contains the network, a slice of operations, and arbitrary metadata that was returned by the call to `/construction/metadata`. Optionally, the request can also include an array of PublicKeys associated with the AccountIdentifiers returned in ConstructionPreprocessResponse. */ Components.Schemas.ConstructionPayloadsRequest;
    namespace Responses {
      export type $200 = /* ConstructionTransactionResponse is returned by `/construction/payloads`. It contains an unsigned transaction blob (that is usually needed to construct the a network transaction from a collection of signatures) and an array of payloads that must be signed by the caller. */ Components.Schemas.ConstructionPayloadsResponse;
      export type $500 = /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
  }
  namespace ConstructionPreprocess {
    export type RequestBody = /* ConstructionPreprocessRequest is passed to the `/construction/preprocess` endpoint so that a Rosetta implementation can determine which metadata it needs to request for construction. Metadata provided in this object should NEVER be a product of live data (i.e. the caller must follow some network-specific data fetching strategy outside of the Construction API to populate required Metadata). If live data is required for construction, it MUST be fetched in the call to `/construction/metadata`. The caller can provide a max fee they are willing to pay for a transaction. This is an array in the case fees must be paid in multiple currencies. The caller can also provide a suggested fee multiplier to indicate that the suggested fee should be scaled. This may be used to set higher fees for urgent transactions or to pay lower fees when there is less urgency. It is assumed that providing a very low multiplier (like 0.0001) will never lead to a transaction being created with a fee less than the minimum network fee (if applicable). In the case that the caller provides both a max fee and a suggested fee multiplier, the max fee will set an upper bound on the suggested fee (regardless of the multiplier provided). */ Components.Schemas.ConstructionPreprocessRequest;
    namespace Responses {
      export type $200 = /* ConstructionPreprocessResponse contains `options` that will be sent unmodified to `/construction/metadata`. If it is not necessary to make a request to `/construction/metadata`, `options` should be omitted.  Some blockchains require the PublicKey of particular AccountIdentifiers to construct a valid transaction. To fetch these PublicKeys, populate `required_public_keys` with the AccountIdentifiers associated with the desired PublicKeys. If it is not necessary to retrieve any PublicKeys for construction, `required_public_keys` should be omitted. */ Components.Schemas.ConstructionPreprocessResponse;
      export type $500 = /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
  }
  namespace ConstructionSubmit {
    export type RequestBody = /* The transaction submission request includes a signed transaction. */ Components.Schemas.ConstructionSubmitRequest;
    namespace Responses {
      export type $200 = /* TransactionIdentifierResponse contains the transaction_identifier of a transaction that was submitted to either `/construction/hash` or `/construction/submit`. */ Components.Schemas.TransactionIdentifierResponse;
      export type $500 = /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
  }
  namespace Mempool {
    export type RequestBody = /* A NetworkRequest is utilized to retrieve some data specific exclusively to a NetworkIdentifier. */ Components.Schemas.NetworkRequest;
    namespace Responses {
      export type $200 = /* A MempoolResponse contains all transaction identifiers in the mempool for a particular network_identifier. */ Components.Schemas.MempoolResponse;
      export type $500 = /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
  }
  namespace MempoolTransaction {
    export type RequestBody = /* A MempoolTransactionRequest is utilized to retrieve a transaction from the mempool. */ Components.Schemas.MempoolTransactionRequest;
    namespace Responses {
      export type $200 = /* A MempoolTransactionResponse contains an estimate of a mempool transaction. It may not be possible to know the full impact of a transaction in the mempool (ex: fee paid). */ Components.Schemas.MempoolTransactionResponse;
      export type $500 = /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
  }
  namespace NetworkList {
    export type RequestBody = /* A MetadataRequest is utilized in any request where the only argument is optional metadata. */ Components.Schemas.MetadataRequest;
    namespace Responses {
      export type $200 = /* A NetworkListResponse contains all NetworkIdentifiers that the node can serve information for. */ Components.Schemas.NetworkListResponse;
      export type $500 = /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
  }
  namespace NetworkOptions {
    export type RequestBody = /* A NetworkRequest is utilized to retrieve some data specific exclusively to a NetworkIdentifier. */ Components.Schemas.NetworkRequest;
    namespace Responses {
      export type $200 = /* NetworkOptionsResponse contains information about the versioning of the node and the allowed operation statuses, operation types, and errors. */ Components.Schemas.NetworkOptionsResponse;
      export type $500 = /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
  }
  namespace NetworkStatus {
    export type RequestBody = /* A NetworkRequest is utilized to retrieve some data specific exclusively to a NetworkIdentifier. */ Components.Schemas.NetworkRequest;
    namespace Responses {
      export type $200 = /* NetworkStatusResponse contains basic information about the node's view of a blockchain network. It is assumed that any BlockIdentifier.Index less than or equal to CurrentBlockIdentifier.Index can be queried. If a Rosetta implementation prunes historical state, it should populate the optional `oldest_block_identifier` field with the oldest block available to query. If this is not populated, it is assumed that the `genesis_block_identifier` is the oldest queryable block. If a Rosetta implementation performs some pre-sync before it is possible to query blocks, sync_status should be populated so that clients can still monitor healthiness. Without this field, it may appear that the implementation is stuck syncing and needs to be terminated. */ Components.Schemas.NetworkStatusResponse;
      export type $500 = /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
  }
}
