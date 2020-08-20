## Internal Software
- [cardano-node](https://github.com/input-output-hk/cardano-node/releases)
- [cardano-db-sync](https://github.com/input-output-hk/cardano-db-sync/releases)
- [PostgreSQL](https://www.postgresql.org/)

## Process Management
[PM2](https://pm2.keymetrics.io/docs/usage/docker-pm2-nodejs/) is used to manage Cardano Rosetta 
processes within the container.

## Libsodium fork
IOHK maintains a [fork of libsodium](https://github.com/input-output-hk/libsodium), which is built
 from source in the Dockerfile. To determine `IOHK_LIBSODIUM_GIT_REV`: 
1. Locate the git rev of `iohk-nix` in the `cardano-node` repo for the targeted version.
2. Go to that rev and review /overlays/crypto/libsodium.nix

For example, `cardano-node@1.18.0` has [`iohk-nix@91b67f54420dabb229c58d16fb1d18e74f9e3c9e`](https://github.com/input-output-hk/cardano-node/blob/1.18.0/nix/sources.json#L44) pinned, 
so the version of libsodium is [known to be 66f017f16633f2060db25e17c170c2afa0f2a8a1](https://github.com/input-output-hk/iohk-nix/blob/91b67f54420dabb229c58d16fb1d18e74f9e3c9e/overlays/crypto/libsodium.nix#L9)
