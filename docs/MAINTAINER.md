## Internal Software
- [cardano-node]
- [cardano-db-sync]
- [PostgreSQL]

## Pinning Ubuntu Dev Dependencies
Run an auto-removing container of the base image:
``` console
docker run --rm -t -i ubuntu:20.04 /bin/bash
```
Lookup available versions in the container:
``` console
$ apt-get update
$ apt list -a automake
Listing... Done
automake/focal 1:1.16.1-4ubuntu6 all
```
## Process Management
[PM2] is used to manage Cardano Rosetta 
processes within the container.

## Libsodium fork
IOHK maintains a [fork of libsodium], which is built from source in the Dockerfile. To determine 
`IOHK_LIBSODIUM_GIT_REV`: 
1. Locate the git rev of `iohk-nix` in the `cardano-node` repo for the targeted version.
2. Go to that rev and review /overlays/crypto/libsodium.nix

For example, `cardano-node@1.19.0` has [`iohk-nix@b22d8da9dd38c971ad40d9ad2d1a60cce53995fb`][1] pinned, 
so the version of libsodium is [known to be 66f017f16633f2060db25e17c170c2afa0f2a8a1][2]

## Continuous deployment to Docker Hub 
Docker builds are pushed to Docker Hub in both the [post-integration workflow], and 
[post-release workflow]. The former maintains the build cache source and can be useful during 
testing, and the latter delivers versioned builds that also takes the `latest` tag.

[cardano-node]: https://github.com/input-output-hk/cardano-node/releases
[cardano-db-sync]: https://github.com/input-output-hk/cardano-db-sync/releases
[PostgreSQL]: https://www.postgresql.org/
[PM2]: https://pm2.keymetrics.io/docs/usage/docker-pm2-nodejs/
[fork of libsodium]: https://github.com/input-output-hk/libsodium
[1]: https://github.com/input-output-hk/cardano-node/blob/1.19.0/nix/sources.json#L44
[2]: https://github.com/input-output-hk/iohk-nix/blob/91b67f54420dabb229c58d16fb1d18e74f9e3c9e/overlays/crypto/libsodium.nix#L9
[post-integration workflow]: ../.github/workflows/post_integration.yml
[post-release workflow]: ../.github/workflows/post_release.yml