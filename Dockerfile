ARG UBUNTU_VERSION=22.04
ARG TARGETARCH=amd64
ARG CARDANO_NODE_VERSION=1.35.5
ARG CARDANO_DB_SYNC_VERSION=13.1.0.0
ARG NODEJS_MAJOR_VERSION=14

FROM ${TARGETARCH}/ubuntu:${UBUNTU_VERSION} as haskell-builder
ARG TARGETARCH
ARG CARDANO_NODE_VERSION
ARG CARDANO_DB_SYNC_VERSION
ENV DEBIAN_FRONTEND=noninteractive
RUN apt update -y
RUN apt install curl git -y
# Note: `sandbox = false` is for compatibility with Podman, Docker doesn’t require it.
# Note: you can comment out `substituters` to build the world from source (including multiple GHC stages).
RUN curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix/tag/v0.11.0 | sh -s -- install linux \
  --extra-conf "sandbox = false" \
  --extra-conf "substituters = https://cache.nixos.org https://cache.iog.io" \
  --extra-conf "trusted-public-keys = cache.nixos.org-1:6NCHdD59X431o0gWypbMrAURkbJ16ZPMQFGspcDShjY= hydra.iohk.io:f/Ea+s+dFdN+3Y/G+FDgSq+a5NEWhJGzdjvKNGv0/EQ=" \
  --init none --no-confirm
ENV PATH="${PATH}:/nix/var/nix/profiles/default/bin"
RUN mkdir -p /app
WORKDIR /app
# Note: since we don’t officially support `aarch64-linux`, we have to tweak the source a bit
#       in this case; but otherwise, build straight from GitHub:
RUN \
  if [ "$TARGETARCH" = "arm64" ]; then \
    mkdir -p src && cd src &&\
    git clone https://github.com/input-output-hk/cardano-node.git &&\
    cd cardano-node &&\
    git fetch --all --tags &&\
    git checkout ${CARDANO_NODE_VERSION} &&\
    echo '["aarch64-linux"]' >nix/supported-systems.nix &&\
    cd ../.. &&\
    nix build -L -o cardano-node ./src/cardano-node#legacyPackages.aarch64-linux.hydraJobs.musl.cardano-node ;\
  else \
    nix build -L -o cardano-node github:input-output-hk/cardano-node/${CARDANO_NODE_VERSION}#legacyPackages.x86_64-linux.hydraJobs.musl.cardano-node ;\
  fi
RUN \
  if [ "$TARGETARCH" = "arm64" ]; then \
    nix build -L -o cardano-cli ./src/cardano-node#legacyPackages.aarch64-linux.hydraJobs.musl.cardano-cli ;\
  else \
    nix build -L -o cardano-cli github:input-output-hk/cardano-node/${CARDANO_NODE_VERSION}#legacyPackages.x86_64-linux.hydraJobs.musl.cardano-cli ;\
  fi
RUN \
  mkdir -p src && cd src &&\
  git clone https://github.com/input-output-hk/cardano-db-sync.git &&\
  cd cardano-db-sync &&\
  git fetch --all --tags &&\
  git checkout ${CARDANO_DB_SYNC_VERSION} &&\
  cd ../.. &&\
  if [ "$TARGETARCH" = "arm64" ]; then \
    echo '["aarch64-linux"]' >src/cardano-db-sync/supported-systems.nix &&\
    nix build -L -o cardano-db-sync--tar ./src/cardano-db-sync#hydraJobs.cardano-db-sync-linux.aarch64-linux ;\
  else \
    nix build -L -o cardano-db-sync--tar ./src/cardano-db-sync#hydraJobs.cardano-db-sync-linux.x86_64-linux ;\
  fi &&\
  mkdir cardano-db-sync && cd cardano-db-sync &&\
  tar -xf ../cardano-db-sync--tar/cardano-db-sync*.tar.gz && chown -R 0:0 . && chmod -R -w . && cd ..

# Note: one more stage to detect Haskell errors earlier:
FROM ${TARGETARCH}/ubuntu:${UBUNTU_VERSION} as haskell-runtime
COPY --from=haskell-builder /app/cardano-node/bin/cardano-node    /usr/local/bin/
COPY --from=haskell-builder /app/cardano-cli/bin/cardano-cli      /usr/local/bin/
COPY --from=haskell-builder /app/cardano-db-sync/cardano-db-sync  /usr/local/bin/
COPY --from=haskell-builder /app/src/cardano-db-sync/schema       /cardano-db-sync/schema
RUN cardano-node --version && cardano-cli --version && cardano-db-sync --version
RUN ls -alh /cardano-db-sync/schema

FROM ${TARGETARCH}/ubuntu:${UBUNTU_VERSION} as ubuntu-nodejs
ARG NODEJS_MAJOR_VERSION
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install curl gnupg2 lsb-core -y &&\
  curl --proto '=https' --tlsv1.2 -sSf -L https://deb.nodesource.com/setup_${NODEJS_MAJOR_VERSION}.x | bash - &&\
  apt-get install nodejs -y

FROM ubuntu-nodejs as nodejs-builder
RUN curl --proto '=https' --tlsv1.2 -sSf -L https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - &&\
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list &&\
  apt-get update && apt-get install gcc g++ make gnupg2 yarn -y

FROM ubuntu-nodejs as runtime-base
ARG TARGETARCH
RUN \
  if [ "$TARGETARCH" = "arm64" ]; then \
    apt-get update -y && apt-get install -y libnuma-dev=2.0.*; \
  fi
RUN curl --proto '=https' --tlsv1.2 -sSf -L https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - &&\
  echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" | tee  /etc/apt/sources.list.d/pgdg.list &&\
  apt-get update && apt-get install -y --no-install-recommends \
  ca-certificates \
  jq \
  postgresql-12 \
  postgresql-client-12 &&\
  npm install pm2 -g
COPY --from=haskell-runtime /usr/local/bin/*        /usr/local/bin/
COPY --from=haskell-runtime /cardano-db-sync/schema /cardano-db-sync/schema
# Configure dynamic linker
RUN ldconfig
# easy step-down from root
# https://github.com/tianon/gosu/releases
ENV GOSU_VERSION 1.12
RUN set -eux; \
	savedAptMark="$(apt-mark showmanual)"; \
	rm -rf /var/lib/apt/lists/*; \
	dpkgArch="$(dpkg --print-architecture | awk -F- '{ print $NF }')"; \
	curl --proto '=https' --tlsv1.2 -sSf -L -o /usr/local/bin/gosu "https://github.com/tianon/gosu/releases/download/${GOSU_VERSION}/gosu-${dpkgArch}"; \
	curl --proto '=https' --tlsv1.2 -sSf -L -o /usr/local/bin/gosu.asc "https://github.com/tianon/gosu/releases/download/${GOSU_VERSION}/gosu-${dpkgArch}.asc"; \
	export GNUPGHOME="$(mktemp -d)"; \
 gpg --batch --keyserver keyserver.ubuntu.com --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4; \
	gpg --batch --verify /usr/local/bin/gosu.asc /usr/local/bin/gosu; \
	gpgconf --kill all; \
	rm -rf "${GNUPGHOME}" /usr/local/bin/gosu.asc; \
	apt-mark auto '.*' > /dev/null; \
	[ -z "${savedAptMark}" ] || apt-mark manual ${savedAptMark} > /dev/null; \
	apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false; \
	chmod +x /usr/local/bin/gosu; \
	gosu --version; \
	gosu nobody true
RUN mkdir /ipc
VOLUME /data
EXPOSE 8080
ENTRYPOINT ["./entrypoint.sh"]

FROM nodejs-builder as rosetta-server-base
RUN mkdir -p /app/src
WORKDIR /app
COPY cardano-rosetta-server/packages-cache /app/packages-cache
COPY cardano-rosetta-server/package.json \
  cardano-rosetta-server/yarn.lock \
  cardano-rosetta-server/.yarnrc \
  /app/

FROM rosetta-server-base as rosetta-server-builder
COPY cardano-rosetta-server/tsconfig-dist.json \
  cardano-rosetta-server/tsconfig.json \
  /app/
RUN yarn --offline --frozen-lockfile --non-interactive
COPY cardano-rosetta-server/src /app/src
RUN yarn build

FROM rosetta-server-base as rosetta-server-production-deps
RUN yarn --offline --frozen-lockfile --non-interactive --production

FROM ubuntu-nodejs as cardano-rosetta-server
ARG NETWORK=mainnet
COPY --from=haskell-runtime /usr/local/bin/cardano-cli \
  /usr/local/bin/cardano-node \
  /usr/local/bin/
COPY --from=rosetta-server-builder /app/dist /cardano-rosetta-server/dist
COPY --from=rosetta-server-production-deps /app/node_modules /cardano-rosetta-server/node_modules
COPY config/network/${NETWORK} /config/
EXPOSE 8080
CMD ["node", "/cardano-rosetta-server/dist/src/server/index.js"]

FROM runtime-base
ARG NETWORK=mainnet
ARG SNAPSHOT_URL
ENV DEFAULT_RELATIVE_TTL=1000 LOGGER_MIN_SEVERITY=info PAGE_SIZE=25 DEFAULT_POOL_DEPOSIT=500000000 DEFAULT_KEY_DEPOSIT=2000000
COPY --from=rosetta-server-builder /app/dist /cardano-rosetta-server/dist
COPY --from=rosetta-server-production-deps /app/node_modules /cardano-rosetta-server/node_modules
COPY ecosystem.config.js .
COPY postgresql.conf /etc/postgresql/12/main/postgresql.conf
COPY scripts/start_cardano-db-sync.sh scripts/maybe_download_cardano-db-sync_snapshot.sh /scripts/
COPY config/network/${NETWORK} /config/
ENV PGPASSFILE=/config/cardano-db-sync/pgpass
RUN echo "/var/run/postgresql:5432:cexplorer:*:*" > $PGPASSFILE &&\
 chmod 600 $PGPASSFILE && chown postgres:postgres $PGPASSFILE
RUN mkdir /snapshot &&\
  ./scripts/maybe_download_cardano-db-sync_snapshot.sh $SNAPSHOT_URL /snapshot
COPY scripts/entrypoint.sh .
