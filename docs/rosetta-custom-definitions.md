# Introduction

Although `Cardano Rosetta` is compliant with [Rosetta Spec](https://rosetta-api.org/), some changed were added, mostly as metadata, as they contain Cardano specific information that needs to be either processed or returned.

# Endpoint specific changes

## `/construction/derive`

By default this endpoint creates an Enterprise address but Cardano Rosetta also allows the creation of Reward and Base addresses, which aren't supported in the Rosetta specification. Therefore, following optional parameters are sent as metadata:

- `address_type`: either "Reward", "Base" or "Enterprise". It will default to "Enterprise" and will throw an error if any other value is provided.
- `staking_credential`: the public key that will be used for creating a Base address and the format will be the same as the public key. This field is only mandatory if the provided `address_type` is "Base". It's ignored in other cases since the Reward and the Enterprise addresses are created with the public key already included in the request.

## `/block`

The following metadata is also returned when querying for block information:

```typescript
transactionsCount": { "type": "number" },  // amount of transactions in the block
"createdBy": { "type": "string" },         // block creation time in UTC expressed as linux timestamp
"size": { "type": "number" },              // block size in bytes
"epochNo": { "type": "number" },           // epoch where the block has been included
"slotNo": { "type": "number" }             // block slot number
```

### Request

```json
{
  "network_identifier": { "blockchain": "cardano", "network": "mainnet" },
  "block_identifier": {
    "index": 100
  }
}
```

### Response

```json
{
  "block": {
    "block_identifier": {
      "hash": "a52cca923a67326ea9c409e958a17a77990be72f3607625ec5b3d456202e223e",
      "index": 100
    },
    "metadata": {
      "createdBy": "ByronGenesis-52df0f2c5539b2b1",
      "epochNo": 0,
      "size": 667,
      "slotNo": 99,
      "transactionsCount": 0
    },
    "parent_block_identifier": {
      "hash": "3d081d225a34a7ead8f12f8f7458a4994e40dc56322654abc04f41c8bb26c723",
      "index": 99
    },
    "timestamp": 1506205071000,
    "transactions": []
  }
}
```

## `/construction/preprocess`

Not only input and output operations are allowed but also special staking operations as described in [here](./staking-support.md).

Cardano transactions require a `ttl` to be defined. As it's explained [in the cardano docs](https://docs.cardano.org/projects/cardano-node/en/latest/reference/building-and-signing-tx.html):

> Time-to-live (TTL) - represents a slot, or deadline by which a transaction must be submitted. The TTL is an absolute slot number, rather than a relative one, which means that the –ttl value should be greater than the current slot number. A transaction becomes invalid once its ttl expires.

There are several restrictions that require a more complex workflow when defining `ttl` for a transaction:

- `ttl` depends on the latest block slot number and Rosetta spec only allows online data to be fetched in `/construction/metadata`.
- `/construction/metadata` only accepts parameters produced, without any modifications, by `/construction/preprocess`.

To be able to stay compliant with Rosetta spec but also be able to let consumers to configure `ttl` a new parameter was introduced:

```typescript
metadata?: {
  relative_ttl: number;
};
```

If no `relative_ttl` is sent, a default one, `DEFAULT_RELATIVE_TTL`, will be returned.

### Request

```json
{
  "network_identifier": {
    "blockchain": "cardano",
    "network": "mainnet"
  },
  "operations": [...],
  "metadata": {
    "relative_ttl": 1000
  }
}
```

### Response

```json
{
  "options": {
    "relative_ttl": 1000
  }
}
```

## `/contruction/metadata`

Metadata endpoint needs to receive the `relative_ttl` returned in process so it can calculate the actual `ttl` based on latest block slot number.

### Request

```json
{
  "network_identifier": {
    "blockchain": "cardano",
    "network": "mainnet"
  },
  "options": {
    "relative_ttl": "1000"
  }
}
```

### Response

```json
{
  "metadata": {
    "ttl": "65294"
  }
}
```

## `/construction/payloads`

Not only input and output operations are allowed but also special staking operations as described in [here](./staking-support.md).

Furthermore, transaction `ttl` needs to be sent as string in the metadata.

### Request

```json
{
  "network_identifier": {
    "blockchain": "cardano",
    "network": "mainnet"
  },
  "operations": [...],
  "metadata": {
    "ttl": "65294"
  }
}
```

## `/construction/parse`

The request of this endpoint has no specific change but the response will have the operations parsed in the same way as the ones that are used to send as payload in the `/construction/payloads` and `/construction/preprocess` endpoints. This means that if the order used in those two endpoints needs to be exactly the one specified [here](./staking-support.md). Otherwise the parse endpoint will not be able to reproduce the operations in the same order and the workflow will fail.

# Other changes

## Encoded transactions

Both `signed_unsigned` and `unsigned_transaction` don't correspond to a valid Cardano Transaction that can be forwarded to the network as they contain extra data required in the Rosetta workflow. This means that such transactions cannot be decoded nor sent directly to a `cardano-node`.

The rationale behind that decision can be found [here](https://community.rosetta-api.org/t/implementing-the-construction-api-for-utxo-model-coins/100/3):

> The best way to get around this is for /construction/payloads to return additional metadata about the transaction which you may need later on for combining & parsing and wrapping the raw unsigned/signed transaction with this metadata. For example, in the UnsignedTransaction field of ConstructionPayloadsResponse, you can return a “rich” Sia transaction, which has additional info you need in /construction/combine.


> [..] There is no expectation that the transactions which are constructed in Rosetta can be parsed by network-specific tools or broadcast on a non-Rosetta node. All parsing and broadcast of these transactions will occur exclusively over the Rosetta API.

The same approach has been used to encode the operations that contain a staking key, since they couldn't be decoded otherwise.