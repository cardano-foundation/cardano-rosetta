# Multi Assets support

# Operations with multi assets

Multi Assets are allowed for inputs and outputs operations.

For operations sent in the request of the `/construction/preprocess` and `/construction/payloads` endpoints will have the list of Token Bundles associated to each operation as metadata.

More information about Multi Assets structure can be found [here](https://developers.cardano.org/en/development-environments/native-tokens/multi-asset-tokens-explainer/).

Both token symbol and policy will be passed as hex string as follows:

### Input operation

```json
{
  "operation_identifier": { "index": 0, "network_index": 0 },
  "type": "input",
  "status": "success",
  "account": {
    "address": "addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx"
  },
  "amount": {
    "value": "-90000",
    "currency": { "symbol": "ADA", "decimals": 6 }
  },
  "coin_change": {
    "coin_identifier": {
      "identifier": "2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:1"
    },
    "coin_action": "coin_spent"
  },
  "metadata": {
    "tokenBundle": [
      {
        "policyId": "b0d07d45fe9514f80213f4020e5a61241458be626841cde717cb38a7",
        "tokens": [
          {
            "value": "10000",
            "currency": { "symbol": "6e7574636f696e", "decimals": 0 }
          }
        ]
      }
    ]
  }
}
```

### Output operation

```json
{
  "operation_identifier": { "index": 1 },
  "related_operations": [{ "index": 0 }],
  "type": "output",
  "status": "success",
  "account": {
    "address": "addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx"
  },
  "amount": {
    "value": "10000",
    "currency": { "symbol": "ADA", "decimals": 6 }
  },
  "metadata": {
    "tokenBundle": [
      {
        "policyId": "b0d07d45fe9514f80213f4020e5a61241458be626841cde717cb38a7",
        "tokens": [
          {
            "value": "10000",
            "currency": { "symbol": "6e7574636f696e", "decimals": 0 }
          }
        ]
      }
    ]
  }
}
```
