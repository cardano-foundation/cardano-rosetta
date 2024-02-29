ARG UBUNTU_VERSION=22.04
FROM ghcr.io/blinklabs-io/haskell:9.6.3-3.10.2.0-1 AS cardano-node-build
# Install cardano-node
ARG NODE_VERSION=8.7.3
ENV NODE_VERSION=${NODE_VERSION}
RUN echo "Building tags/${NODE_VERSION}..." \
    && echo tags/${NODE_VERSION} > /CARDANO_BRANCH \
    && git clone https://github.com/input-output-hk/cardano-node.git \
    && cd cardano-node \
    && git fetch --all --recurse-submodules --tags \
    && git tag \
    && git checkout tags/${NODE_VERSION} \
    && echo "with-compiler: ghc-${GHC_VERSION}" >> cabal.project.local \
    && echo "tests: False" >> cabal.project.local \
    && cabal update \
    && cabal build all \
    && mkdir -p /root/.local/bin/ \
    && cp -p "$(./scripts/bin-path.sh cardano-node)" /root/.local/bin/


ARG CARDANO_DB_SYNC_VERSION=13.2.0.1
WORKDIR /app/src
RUN git clone https://github.com/input-output-hk/cardano-db-sync.git &&\
  cd cardano-db-sync &&\
  git fetch --all --tags &&\
  git checkout ${CARDANO_DB_SYNC_VERSION}
RUN mkdir binaries && cd binaries && wget https://github.com/IntersectMBO/cardano-db-sync/releases/download/${CARDANO_DB_SYNC_VERSION}/cardano-db-sync-${CARDANO_DB_SYNC_VERSION}-linux.tar.gz && \
    tar -xvf cardano-db-sync-${CARDANO_DB_SYNC_VERSION}-linux.tar.gz && \
    cp -r * /usr/local/bin/

FROM ubuntu:${UBUNTU_VERSION} as ubuntu-nodejs
ARG NODEJS_MAJOR_VERSION=18
ENV DEBIAN_FRONTEND=nonintercative
RUN apt-get update && apt-get install curl -y &&\
  curl --proto '=https' --tlsv1.2 -sSf -L https://deb.nodesource.com/setup_${NODEJS_MAJOR_VERSION}.x | bash - &&\
  apt-get install nodejs -y

FROM ubuntu-nodejs as nodejs-builder
RUN curl --proto '=https' --tlsv1.2 -sSf -L https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - &&\
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list &&\
  apt-get update && apt-get install gcc g++ make gnupg2 yarn -y

FROM ubuntu-nodejs as runtime-base
ARG TARGETARCH
RUN \
  apt-get update -y && apt-get install lsb-release -y; \
  if [ "$TARGETARCH" = "arm64" ]; then \
    apt-get install -y libnuma-dev=2.0.*; \
  fi
RUN curl --proto '=https' --tlsv1.2 -sSf -L https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - &&\
  echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" | tee  /etc/apt/sources.list.d/pgdg.list &&\
  apt-get update && apt-get install -y --no-install-recommends \
  ca-certificates \
  jq \
  postgresql-12 \
  postgresql-client-12 &&\
  npm install pm2 -g
COPY --from=cardano-node-build /usr/local/lib /usr/local/lib
COPY --from=cardano-node-build /usr/local/include/ /usr/local/include/
COPY --from=cardano-node-build /root/.local/bin/cardano-* /usr/local/bin/
COPY --from=cardano-node-build /usr/local/bin/cardano-db-sync /usr/local/bin/
COPY --from=cardano-node-build /app/src/cardano-db-sync/schema /cardano-db-sync/schema
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
COPY --from=haskell-builder /usr/local/bin/cardano-cli \
  /usr/local/bin/cardano-node \
  /usr/local/bin/
COPY --from=rosetta-server-builder /app/dist /cardano-rosetta-server/dist
COPY --from=rosetta-server-production-deps /app/node_modules /cardano-rosetta-server/node_modules
COPY config/network/${NETWORK} /config/
EXPOSE 8080
CMD ["node", "/cardano-rosetta-server/dist/src/server/index.js"]

FROM ghcr.io/blinklabs-io/cardano-cli:8.17.0.0 AS cardano-cli
FROM runtime-base
COPY --from=cardano-cli /usr/local/bin/cardano-cli /usr/local/bin/
ARG NETWORK=mainnet
ARG SNAPSHOT_URL
ENV DEFAULT_RELATIVE_TTL=1000 LOGGER_MIN_SEVERITY=info PAGE_SIZE=25 DEFAULT_POOL_DEPOSIT=500000000 DEFAULT_KEY_DEPOSIT=2000000
ENV CARDANO_CLI_PATH=/usr/local/bin/cardano-cli
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
