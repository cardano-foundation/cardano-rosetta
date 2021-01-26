# Introduction

Although `Cardano Rosetta` is compliant with [Rosetta Spec](https://rosetta-api.org/), some changed were added, mostly as metadata, as they contain Cardano specific information that needs to be either processed or returned.

# Endpoint specific changes

## `/construction/derive`

By default this endpoint creates an Enterprise address but Cardano Rosetta also allows the creation of Reward and Base addresses, which aren't supported in the Rosetta specification. Therefore, following optional parameters are sent as metadata:

- `address_type`: either "Reward", "Base" or "Enterprise". It will default to "Enterprise" and will throw an error if any other value is provided. These types are explained in the section 4 of the [ledger specification](https://hydra.iohk.io/build/3671214/download/1/ledger-spec.pdf).
- `staking_credential`: the public key that will be used for creating a Base address and the format will be the same as the public key. This field is only mandatory if the provided `address_type` is "Base". It's ignored in other cases since the Reward and the Enterprise addresses are created with the public key already included in the request.

### Examples

#### Base address

```json
{
  "network_identifier": { "blockchain": "cardano", "network": "mainnet" },
  "public_key": {
    "hex_bytes": "159abeeecdf167ccc0ea60b30f9522154a0d74161aeb159fb43b6b0695f057b3",
    "curve_type": "edwards25519"
  },
  "metadata": {
    "address_type": "Base",
    "staking_credential": {
      "hex_bytes": "964774728c8306a42252adbfb07ccd6ef42399f427ade25a5933ce190c5a8760",
      "curve_type": "edwards25519"
    }
  }
}
```

#### Reward address

```json
{
  "network_identifier": { "blockchain": "cardano", "network": "mainnet" },
  "public_key": {
    "hex_bytes": "964774728c8306a42252adbfb07ccd6ef42399f427ade25a5933ce190c5a8760",
    "curve_type": "edwards25519"
  },
  "metadata": { "address_type": "Reward" }
}
```

### Enterprise address

In this case the metadata is optional. If it's provided, then the `address_type` should be "Enterprise" and the `staking_credential` could be anything since it will be ignored.

```json
{
  "network_identifier": { "blockchain": "cardano", "network": "mainnet" },
  "public_key": {
    "hex_bytes": "1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F",
    "curve_type": "edwards25519"
  },
  "metadata": {
    "address_type": "Enterprise",
    "staking_credential": {
      "hex_bytes": "1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F__",
      "curve_type": "edwards25519"
    }
  }
}
```

## `/account/balance`

For accounts that have a multi asset balance there will be returned with the corresponding policy passed as metadata at `currency` as follows:

### Response

```typescript
{
  "block_identifier": {
    "index": 382733,
    "hash": "50bb3491000528b19a074291bd958b77dd0b8b1cf3003bf14d1ac24a62073f1e"
  },
  "balances": [
    { "value": "4800000", "currency": { "symbol": "ADA", "decimals": 6 } },
   {
      "value": "20",
      "currency": {
        "symbol": "",                                                               // token symbol as hex string
        "decimals": 0,
        "metadata": {
          "policyId": "181aace621eea2b6cb367adb5000d516fa785087bad20308c072517e"    // token policy as hex string
        }
      }
    },
    {
      "value": "10",
      "currency": {
        "symbol": "7376c3a57274",
        "decimals": 0,
        "metadata": {
          "policyId": "fc5a8a0aac159f035a147e5e2e3eb04fa3b5e67257c1b971647a717d"
        }
      }
    }
  ],
  "coins": [...]
}
```

Also, `coins` will be returned with the token bundle list corresponding to each coin as metadata as follows:

```typescript
{
  "block_identifier": {
    "index": 382733,
    "hash": "50bb3491000528b19a074291bd958b77dd0b8b1cf3003bf14d1ac24a62073f1e"
  },
  "balances": [...],
  "coins": [
    {
      "coin_identifier": {
        "identifier": "02562c123f6d560e1250f5a46f7e95911b21fd8a9fa70157335c3a3d1d16bdda:0"
      },
      "amount": {
        "currency": { "decimals": 6, "symbol": "ADA" },
        "value": "4800000"
      },
      "metadata": {
        "02562c123f6d560e1250f5a46f7e95911b21fd8a9fa70157335c3a3d1d16bdda:0": [       // coin identifier
          {
            "policyId": "181aace621eea2b6cb367adb5000d516fa785087bad20308c072517e",   
            "tokens": [
              {
                "value": "20",
                "currency": {
                  "decimals": 0,
                  "symbol": "",                                                       
                  "metadata": {
                    "policyId": "181aace621eea2b6cb367adb5000d516fa785087bad20308c072517e"
                  }
                }
              }
            ]
          },
          {
            "policyId": "fc5a8a0aac159f035a147e5e2e3eb04fa3b5e67257c1b971647a717d",
            "tokens": [
              {
                "value": "10",
                "currency": {
                  "decimals": 0,
                  "symbol": "7376c3a57274",
                  "metadata": {
                    "policyId": "fc5a8a0aac159f035a147e5e2e3eb04fa3b5e67257c1b971647a717d"
                  }
                }
              }
            ]
          }
        ]
      }
    }
  ]
}
```

## `/block`

The following metadata is also returned when querying for block information:

```typescript
"transactionsCount": { "type": "number" }, // amount of transactions in the block
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

## `/block/transactions`

If the block requested contains transactions with multi assets operations the token bundles associated to each operation will be returned as metadata as follows: 

### Response

```typescript
{
  "transaction_identifier": {
    "hash": "2356072a5379064aa62f83bf61d7d4467dbc47ec281461b558aa51b08c38c884"
  },
  "operations": [
    {
      "operation_identifier": {
        "index": 0
      },
      "type": "input",
      "status": "success",
      "account": {
        "address": "addr_test1vpcv26kdu8hr9x939zktp275xhwz4478c8hcdt7l8wrl0ecjftnfa"
      },
      "amount": {
        "value": "-999999000000",
        "currency": {
          "symbol": "ADA",
          "decimals": 6
        }
      },
      "coin_change": {
        "coin_identifier": {
          "identifier": "127cf01f95448cdcde439b8ace9b8a8ec100e690abe2b52069b3dbd924e032b3:0"
        },
        "coin_action": "coin_spent"
      },
      "metadata": {
        "tokenBundle": [
          {
            "policyId": "3e6fc736d30770b830db70994f25111c18987f1407585c0f55ca470f",
            "tokens": [
              {
                "value": "-5",
                "currency": {
                  "symbol": "6a78546f6b656e31",
                  "decimals": 0
                }
              }
            ]
          }
        ]
      }
    },
    ...
  ]
}
```

## `/construction/preprocess`

Not only input and output operations are allowed but also special staking operations as described in [here](./staking-support.md).

It is possible to operate with multi assets tokens too, as explained [here](./multi-assets-support.md).

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
    "relative_ttl": 1000,
    "transaction_size": 298
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
    "relative_ttl": 1000,
    "transaction_size": 298
  }
}
```

### Response

```json
{
  "metadata": {
    "ttl": "65294",
    "suggested_fee": [
      {
        "currency": {
          "decimals": 6,
          "symbol": "ADA"
        },
        "value": "900000"
      }
    ]
  }
}
```

## `/construction/payloads`

Not only input and output operations are allowed but also special staking operations as described in [here](./staking-support.md).

It is possible to operate with multi assets tokens too, as explained [here](./multi-assets-support.md).

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
