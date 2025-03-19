# Staking support

## Staking operations

Each of the operations sent in the request of the `/construction/preprocess` and `/construction/payloads` endpoints will have a type which is a string value that could be any of the following:

- 'input'
- 'output'
- 'stakeKeyRegistration'
- 'stakeKeyDeregistration'
- 'stakeDelegation'
- 'withdrawal'

The order of these operations is important since they are going to be processed in the transaction body in the following order:

1. inputs and outputs
2. operations that require a certificate, i.e., stake key registration, stake key deregistration and stake delegation
3. withdrawals

Some of these operations require an amount and a staking credential as metadata as described as follows:

### Input operation

```json
{
  "operation_identifier": {
    "index": 0,
    "network_index": 0
  },
  "type": "input",
  "status": "success",
  "account": {
    "address": "addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx"
  },
  "amount": {
    "value": "-9000000",
    "currency": {
      "symbol": "ADA",
      "decimals": 6
    }
  },
  "coin_change": {
    "coin_identifier": {
      "identifier": "2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:1"
    },
    "coin_action": "coin_spent"
  }
}
```

### Output operation

```json
{
  "operation_identifier": {
    "index": 1
  },
  "related_operations": [
    {
      "index": 0
    }
  ],
  "type": "output",
  "status": "success",
  "account": {
    "address": "addr1vxa5pudxg77g3sdaddecmw8tvc6hmynywn49lltt4fmvn7cpnkcpx"
  },
  "amount": {
    "value": "10000",
    "currency": {
      "symbol": "ADA",
      "decimals": 6
    }
  }
}
```

### Stake key registration

A staking key should be sent as metadata, which should be of the same type of the public key. This is mandatory for this kind of operation.

No amount is needed for this operation since the deposit will be calculated with the fixed min key deposit value times the amount of stake key registrations received.

```json
{
  "operation_identifier": {
    "index": 3
  },
  "type": "stakeKeyRegistration",
  "status": "success",
  "metadata": {
    "staking_credential": {
      "hex_bytes": "1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F",
      "curve_type": "edwards25519"
    }
  }
}
```

### Stake delegation

A staking key should be sent as metadata, which should be of the same type of the public key and also a pool key hash. Both of them are mandatory for this kind of operation.

```json
{
  "operation_identifier": {
    "index": 3
  },
  "type": "stakeDelegation",
  "status": "success",
  "metadata": {
    "staking_credential": {
      "hex_bytes": "1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F",
      "curve_type": "edwards25519"
    },
    "pool_key_hash": "1b268f4cba3faa7e36d8a0cc4adca2096fb856119412ee7330f692b5"
  }
}
```

### Stake key deregistration

A staking key should be sent as metadata, which should be of the same type of the public key. This is mandatory for this kind of operation.

No amount is needed for this operation since the refund will be calculated with the fixed min key deposit value times the amount of stake key deregistrations received.

```json
{
  "operation_identifier": {
    "index": 3
  },
  "type": "stakeKeyDeregistration",
  "status": "success",
  "metadata": {
    "staking_credential": {
      "hex_bytes": "1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F",
      "curve_type": "edwards25519"
    }
  }
}
```

### Vote delegation


A staking key should be sent as metadata, which should be of the same type of the public key and also a drep. Both of them are mandatory for this kind of operation.

The drep must specify its type and some of them requires an id value. Valid types: 'key_hash', 'script_hash', 'abstain', 'no_confidence'.

```json
{
  "operation_identifier": { 
    "index": 3 
  },
  "type": "dRepVoteDelegation",
  "status": "success",
  "metadata": {
    "staking_credential": {
      "hex_bytes": "1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F",
      "curve_type": "edwards25519"
    },
    "drep": {
      "id": "74984fae4ca1715fa1f8759f9d871015ac87f449a85dea6cf9956da1",
      "type": "key_hash"
    }
  }
}
```

### Withdrawal

A staking key should be sent as metadata, which should be of the same type of the public key. This is mandatory for this kind of operation. The amount that is to be withdrawn is also mandatory.

```json
{
  "operation_identifier": {
    "index": 4
  },
  "type": "withdrawal",
  "status": "success",
  "amount": {
    "value": "10000",
    "currency": {
      "symbol": "ADA",
      "decimals": 6
    }
  },
  "metadata": {
    "staking_credential": {
      "hex_bytes": "1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F",
      "curve_type": "edwards25519"
    }
  }
}
```
