ARG UBUNTU_VERSION=22.04
FROM ubuntu:${UBUNTU_VERSION} AS cardano-builder
# Following: https://github.com/input-output-hk/cardano-node-wiki/blob/main/docs/getting-started/install.md
ENV DEBIAN_FRONTEND=nonintercative
ARG CABAL_VERSION=3.10.1.0
ARG GHC_VERSION=8.10.7
ARG IOHK_LIBSODIUM_GIT_REV=dbb48cce
ARG SECP256K1_VERSION=v0.3.2
ARG BLST_VERSION=v0.3.11

ARG NODE_VERSION=9.1.0
ARG CARDANO_DB_SYNC_VERSION=13.3.0.0

RUN mkdir -p /app/src
WORKDIR /app
RUN apt-get update -y && apt-get install -y \
  automake \
  autoconf \
  build-essential \
  g++ \
  git \
  jq \
  libffi-dev \
  libghc-postgresql-libpq-dev \
  libgmp-dev \
  liblmdb-dev \
  libnuma-dev \
  libncursesw5 \
  libpq-dev \
  libssl-dev \
  libsystemd-dev \
  libtinfo-dev \
  llvm-dev \
  libtool \
  make \
  pkg-config \
  tmux \
  wget \
  zlib1g-dev

WORKDIR /app/src
# Cabal
ENV CABAL_VERSION=${CABAL_VERSION}
ENV PATH="/root/.cabal/bin:/root/.ghcup/bin:/root/.local/bin:$PATH"
RUN wget https://downloads.haskell.org/~cabal/cabal-install-${CABAL_VERSION}/cabal-install-${CABAL_VERSION}-$(uname -m)-linux-ubuntu20_04.tar.xz \
    && tar -xf cabal-install-${CABAL_VERSION}-$(uname -m)-linux-ubuntu20_04.tar.xz \
    && rm cabal-install-${CABAL_VERSION}-$(uname -m)-linux-ubuntu20_04.tar.xz \
    && mkdir -p ~/.local/bin \
    && mv cabal ~/.local/bin/ \
    && cabal update && cabal --version

# GHC
ENV GHC_VERSION=${GHC_VERSION}
RUN wget https://downloads.haskell.org/~ghc/${GHC_VERSION}/ghc-${GHC_VERSION}-$(uname -m)-deb10-linux.tar.xz \
    && tar -xf ghc-${GHC_VERSION}-$(uname -m)-deb10-linux.tar.xz \
    && rm ghc-${GHC_VERSION}-$(uname -m)-deb10-linux.tar.xz \
    && cd ghc-${GHC_VERSION} \
    && ./configure \
    && make install


# Libsodium
RUN git clone https://github.com/intersectmbo/libsodium && \
    cd libsodium && \
    git checkout ${LIBSODIUM_REF} && \
    ./autogen.sh && \
    ./configure && \
    make && \
    make install
ENV LD_LIBRARY_PATH="/usr/local/lib:$LD_LIBRARY_PATH"
ENV PKG_CONFIG_PATH="/usr/local/lib/pkgconfig:$PKG_CONFIG_PATH"

# secp256k1
RUN git clone https://github.com/bitcoin-core/secp256k1 && \
    cd secp256k1 && \
    git checkout ${SECP256K1_REF} && \
    ./autogen.sh && \
    ./configure --enable-module-schnorrsig --enable-experimental && \
    make && \
    make install

# BLST
COPY ./scripts/libblst.pc /usr/local/lib/pkgconfig/
RUN git clone https://github.com/supranational/blst && \
    cd blst && \
    git checkout ${BLST_REF} && \
    ./build.sh && \
    cp bindings/blst_aux.h bindings/blst.h bindings/blst.hpp  /usr/local/include/ && \
    cp libblst.a /usr/local/lib/ && \
    chmod u=rw,go=r /usr/local/lib/pkgconfig/libblst.pc \
      /usr/local/include/blst_aux.h /usr/local/include/blst.h /usr/local/include/blst.hpp \
      /usr/local/lib/libblst.a

# Install cardano-node
ENV NODE_VERSION=${NODE_VERSION}
RUN echo "Building tags/${NODE_VERSION}..." \
    && echo tags/${NODE_VERSION} > /CARDANO_BRANCH \
    && git clone https://github.com/intersectmbo/cardano-node.git \
    && cd cardano-node \
    && git fetch --all --recurse-submodules --tags \
    && git tag \
    && git checkout tags/${NODE_VERSION} \
    && echo "with-compiler: ghc-${GHC_VERSION}" >> cabal.project.local \
    && echo "tests: False" >> cabal.project.local \
    && cabal update \
    && cabal build all \
    && cabal build cardano-cli
RUN cd cardano-node \
    && mkdir -p /root/.local/bin/ \
    && cp -p "$(./scripts/bin-path.sh cardano-node)" /root/.local/bin/ \
    && cp -p "$(./scripts/bin-path.sh cardano-cli)" /root/.local/bin/

RUN export PATH="/root/.local/bin:$PATH"

ARG DB_SYNC_TAG=${CARDANO_DB_SYNC_VERSION}
WORKDIR /app/src
RUN git clone https://github.com/intersectmbo/cardano-db-sync.git &&\
  cd cardano-db-sync &&\
  git fetch --all --tags &&\
  git checkout tags/${DB_SYNC_TAG}
RUN apt-get update -y && apt-get install -y libpq-dev
RUN cd cardano-db-sync &&\
  echo "with-compiler: ghc-8.10.7" >> cabal.project.local &&\
  cabal update && \
  cabal configure --with-compiler=ghc-${GHC_VERSION} &&\
  cabal build cardano-db-sync
RUN cp -p "$(find . -name cardano-db-sync -executable -type f)" /root/.local/bin/

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
COPY --from=cardano-builder /usr/local/lib /usr/local/lib
COPY --from=cardano-builder /usr/local/include/ /usr/local/include/
COPY --from=cardano-builder /root/.local/bin/cardano-* /usr/local/bin/
COPY --from=cardano-builder /app/src/cardano-db-sync/schema /cardano-db-sync/schema
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
RUN yarn --frozen-lockfile --non-interactive
COPY cardano-rosetta-server/src /app/src
RUN yarn build

FROM rosetta-server-base as rosetta-server-production-deps
RUN yarn --frozen-lockfile --non-interactive --production

FROM ubuntu-nodejs as cardano-rosetta-server
ARG NETWORK=mainnet
COPY --from=cardano-builder /root/.local/bin/cardano-cli \
  /root/.local/bin/cardano-node \
  /usr/local/bin/
COPY --from=rosetta-server-builder /app/dist /cardano-rosetta-server/dist
COPY --from=rosetta-server-production-deps /app/node_modules /cardano-rosetta-server/node_modules
COPY config/network/${NETWORK} /config/
EXPOSE 8080
CMD ["node", "/cardano-rosetta-server/dist/src/server/index.js"]

FROM runtime-base
COPY --from=cardano-builder /root/.local/bin/cardano-cli /usr/local/bin/
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
