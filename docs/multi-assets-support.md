# Multi Assets support

# Operations with multi assets

Multi Assets are allowed for inputs and outputs operations.

For operations sent in the request of the `/construction/preprocess` and `/construction/payloads` endpoints will have the list of Token Bundles associated to each operation as metadata.

More information about Multi Assets structure can be found [here](https://developers.cardano.org/en/development-environments/native-tokens/multi-asset-tokens-explainer/).

`symbol` is the Asset Name stored in the Ledger. Both `symbol` and `policyId` will be passed as hex string as follows:

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

### Account balance query
The response from `/account/balance` will have the list of Token Bundles along with ADA balance.

```json
"balances": [
    {
      "value": "71103107",
      "currency": {
        "symbol": "ADA",
        "decimals": 6
      }
    },
    {
      "value": "9648589196",
      "currency": {
        "symbol": "4141504c",
        "decimals": 0,
        "metadata": {
          "policyId": "12e65fa3585d80cba39dcf4f59363bb68b77f9d3c0784734427b1517"
        }
      }
    },
    {
      "value": "9648589196",
      "currency": {
        "symbol": "4150504c45",
        "decimals": 0,
        "metadata": {
          "policyId": "12e65fa3585d80cba39dcf4f59363bb68b77f9d3c0784734427b1517"
        }
      }
    }
  ],
"coins": [
  {
    "coin_identifier": {
      "identifier": "414afe46bc6b7e52739dd5dd76eef30812168912a34bb31676b9872881aeacd2:0"
    },
    "amount": {
      "value": "71103107",
      "currency": {
        "symbol": "ADA",
        "decimals": 6
      }
    },
    "metadata": {
      "414afe46bc6b7e52739dd5dd76eef30812168912a34bb31676b9872881aeacd2:0": [
        {
          "policyId": "12e65fa3585d80cba39dcf4f59363bb68b77f9d3c0784734427b1517",
          "tokens": [
            {
              "value": "9648589196",
              "currency": {
                "symbol": "4141504c",
                "decimals": 0,
                "metadata": {
                  "policyId": "12e65fa3585d80cba39dcf4f59363bb68b77f9d3c0784734427b1517"
                }
              }
            },
            {
              "value": "9648589196",
              "currency": {
                "symbol": "4150504c45",
                "decimals": 0,
                "metadata": {
                  "policyId": "12e65fa3585d80cba39dcf4f59363bb68b77f9d3c0784734427b1517"
                }
              }
            }
          ]
       }
     ]
    }
  }
]
```

It's important to mention that Token Name is not required by Cardano protocol rules. As Rosetta [symbol](https://www.rosetta-api.org/docs/1.4.4/models/Currency.html) is a required field, it will be represented as `\\x`.

