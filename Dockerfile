ARG UBUNTU_VERSION=18.04
FROM ubuntu:${UBUNTU_VERSION} as haskell-builder
ARG CABAL_VERSION=3.2.0.0
ARG CARDANO_NODE_VERSION=1.21.1
ARG CARDANO_DB_SYNC_VERSION=5.0.3
ARG GHC_VERSION=8.6.5
ARG IOHK_LIBSODIUM_GIT_REV=66f017f16633f2060db25e17c170c2afa0f2a8a1
ENV DEBIAN_FRONTEND=nonintercative
RUN mkdir -p /app/src
WORKDIR /app
RUN apt-get update -y && apt-get install -y \
  automake=1:1.15.1-3ubuntu2 \
  build-essential \
  g++=4:7.4.0-1ubuntu2.3 \
  git \
  jq \
  libffi-dev=3.2.1-8 \
  libghc-postgresql-libpq-dev=0.9.3.1-1 \
  libgmp-dev=2:6.1.2+dfsg-2 \
  libncursesw5=6.1-1ubuntu1.18.04 \
  libpq-dev=10.14-0ubuntu0.18.04.1 \
  libssl-dev=1.1.1-1ubuntu2.1~18.04.6 \
  libsystemd-dev=237-3ubuntu10.42 \
  libtinfo-dev=6.1-1ubuntu1.18.04 \
  libtool=2.4.6-2 \
  make \
  pkg-config \
  tmux \
  wget \
  zlib1g-dev=1:1.2.11.dfsg-0ubuntu2
RUN wget --secure-protocol=TLSv1_2 \
  https://downloads.haskell.org/~cabal/cabal-install-${CABAL_VERSION}/cabal-install-${CABAL_VERSION}-x86_64-unknown-linux.tar.xz &&\
  tar -xf cabal-install-${CABAL_VERSION}-x86_64-unknown-linux.tar.xz &&\
  rm cabal-install-${CABAL_VERSION}-x86_64-unknown-linux.tar.xz cabal.sig &&\
  mv cabal /usr/local/bin/
RUN cabal update
WORKDIR /app/ghc
RUN wget --secure-protocol=TLSv1_2 \
  https://downloads.haskell.org/~ghc/${GHC_VERSION}/ghc-${GHC_VERSION}-x86_64-deb9-linux.tar.xz &&\
  tar -xf ghc-${GHC_VERSION}-x86_64-deb9-linux.tar.xz &&\
  rm ghc-${GHC_VERSION}-x86_64-deb9-linux.tar.xz
WORKDIR /app/ghc/ghc-${GHC_VERSION}
RUN ./configure
RUN make install
WORKDIR /app/src
RUN git clone https://github.com/input-output-hk/libsodium.git &&\
  cd libsodium &&\
  git fetch --all --tags &&\
  git checkout ${IOHK_LIBSODIUM_GIT_REV}
WORKDIR /app/src/libsodium
RUN ./autogen.sh && ./configure && make && make install
ENV LD_LIBRARY_PATH="/usr/local/lib:$LD_LIBRARY_PATH"
ENV PKG_CONFIG_PATH="/usr/local/lib/pkgconfig:$PKG_CONFIG_PATH"
WORKDIR /app/src
RUN git clone https://github.com/input-output-hk/cardano-node.git &&\
  cd cardano-node &&\
  git fetch --all --tags &&\
  git checkout ${CARDANO_NODE_VERSION}
WORKDIR /app/src/cardano-node
# https://github.com/input-output-hk/cardano-node/issues/1675
#RUN cabal install cardano-node \
#  --install-method=copy \
#  --installdir=/usr/local/bin \
#  -f -systemd
#RUN cabal install cardano-cli \
#  --install-method=copy \
#  --installdir=/usr/local/bin \
#  -f -systemd
RUN cabal build cardano-node cardano-cli &&\
  mv ./dist-newstyle/build/x86_64-linux/ghc-${GHC_VERSION}/cardano-node-${CARDANO_NODE_VERSION}/x/cardano-node/build/cardano-node/cardano-node /usr/local/bin/ &&\
  mv ./dist-newstyle/build/x86_64-linux/ghc-${GHC_VERSION}/cardano-cli-${CARDANO_NODE_VERSION}/x/cardano-cli/build/cardano-cli/cardano-cli /usr/local/bin/
WORKDIR /app/src
RUN git clone https://github.com/input-output-hk/cardano-db-sync.git &&\
  cd cardano-db-sync &&\
  git fetch --all --tags &&\
  git checkout ${CARDANO_DB_SYNC_VERSION}
WORKDIR /app/src/cardano-db-sync
# https://github.com/input-output-hk/iohk-monitoring-framework/issues/579
#RUN cabal install cardano-db-sync \
#  --install-method=copy \
#  --installdir=/usr/local/bin
RUN cabal build cardano-db-sync && \
  mv ./dist-newstyle/build/x86_64-linux/ghc-${GHC_VERSION}/cardano-db-sync-${CARDANO_DB_SYNC_VERSION}/x/cardano-db-sync/build/cardano-db-sync/cardano-db-sync /usr/local/bin/
# Cleanup for runtiume-base copy of /usr/local/lib
RUN rm -rf /usr/local/lib/ghc-${GHC_VERSION} /usr/local/lib/pkgconfig

FROM ubuntu:${UBUNTU_VERSION} as ubuntu-nodejs
ARG NODEJS_MAJOR_VERSION=14
ENV DEBIAN_FRONTEND=nonintercative
RUN apt-get update && apt-get install curl -y
RUN curl --proto '=https' --tlsv1.2 -sSf -L https://deb.nodesource.com/setup_${NODEJS_MAJOR_VERSION}.x | bash -
RUN apt-get install nodejs -y

FROM ubuntu-nodejs as nodejs-builder
RUN curl --proto '=https' --tlsv1.2 -sSf -L https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install gcc g++ make gnupg2 yarn -y

FROM ubuntu-nodejs as runtime-base
RUN curl --proto '=https' --tlsv1.2 -sSf -L https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" | tee  /etc/apt/sources.list.d/pgdg.list
RUN apt-get update && apt-get install -y --no-install-recommends \
  ca-certificates \
  jq \
  postgresql-12 \
  postgresql-client-12
RUN npm install pm2 -g
COPY --from=haskell-builder /usr/local/lib /usr/local/lib
COPY --from=haskell-builder /usr/local/bin/cardano-node /usr/local/bin/
COPY --from=haskell-builder /usr/local/bin/cardano-cli /usr/local/bin/
COPY --from=haskell-builder /usr/local/bin/cardano-db-sync /usr/local/bin/
COPY --from=haskell-builder /app/src/cardano-db-sync/schema /cardano-db-sync/schema
COPY --from=haskell-builder /app/src/cardano-db-sync/config /cardano-db-sync/config
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
	gpg --batch --keyserver hkps://keys.openpgp.org --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4; \
	gpg --batch --verify /usr/local/bin/gosu.asc /usr/local/bin/gosu; \
	gpgconf --kill all; \
	rm -rf "${GNUPGHOME}" /usr/local/bin/gosu.asc; \
	apt-mark auto '.*' > /dev/null; \
	[ -z "${savedAptMark}" ] || apt-mark manual ${savedAptMark} > /dev/null; \
	apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false; \
	chmod +x /usr/local/bin/gosu; \
	gosu --version; \
	gosu nobody true
ENV PGPASSFILE=/cardano-db-sync/config/pgpass
RUN chmod 600 $PGPASSFILE && chown postgres:postgres $PGPASSFILE
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

FROM runtime-base
ARG NETWORK=mainnet
ENV DEFAULT_RELATIVE_TTL=1000 LOGGER_MIN_SEVERITY=info PAGE_SIZE=25
COPY --from=rosetta-server-builder /app/dist /cardano-rosetta-server/dist
COPY --from=rosetta-server-production-deps /app/node_modules /cardano-rosetta-server/node_modules
COPY config/ecosystem.config.js .
COPY config/postgres/postgresql.conf /etc/postgresql/12/main/postgresql.conf
COPY config/network/${NETWORK} /config/
COPY scripts/entrypoint.sh .
