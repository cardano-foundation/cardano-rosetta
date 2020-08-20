ARG UBUNTU_VERSION=20.04
FROM ubuntu:${UBUNTU_VERSION} as haskell-builder
ARG CARDANO_NODE_VERSION=1.18.0
ARG CARDANO_DB_SYNC_VERSION=3.1.0
ENV DEBIAN_FRONTEND=nonintercative
RUN mkdir -p /app/src
WORKDIR /app
RUN apt-get update -y && apt-get install -y \
  build-essential \
  g++ \
  git \
  jq \
  libffi-dev \
  libghc-postgresql-libpq-dev \
  libgmp-dev \
  libncursesw5 \
  libpq-dev \
  libsodium-dev \
  libssl-dev \
  libsystemd-dev \
  libtinfo-dev \
  libz-dev \
  make \
  pkg-config \
  tmux \
  wget \
  zlib1g-dev
RUN wget --secure-protocol=TLSv1_2 \
  https://downloads.haskell.org/~cabal/cabal-install-3.2.0.0/cabal-install-3.2.0.0-x86_64-unknown-linux.tar.xz &&\
  tar -xf cabal-install-3.2.0.0-x86_64-unknown-linux.tar.xz &&\
  rm cabal-install-3.2.0.0-x86_64-unknown-linux.tar.xz cabal.sig &&\
  mv cabal /usr/local/bin/
RUN cabal update
WORKDIR /app/ghc
RUN wget --secure-protocol=TLSv1_2 \
  https://downloads.haskell.org/~ghc/8.6.5/ghc-8.6.5-x86_64-deb9-linux.tar.xz &&\
  tar -xf ghc-8.6.5-x86_64-deb9-linux.tar.xz &&\
  rm ghc-8.6.5-x86_64-deb9-linux.tar.xz
WORKDIR /app/ghc/ghc-8.6.5
RUN ./configure
RUN make install
WORKDIR /app/src
RUN git clone https://github.com/input-output-hk/cardano-node.git &&\
  cd cardano-node &&\
  git fetch --all --tags &&\
  git checkout ${CARDANO_NODE_VERSION}
WORKDIR /app/src/cardano-node
RUN echo 'package cardano-crypto-praos\n   flags: -external-libsodium-vrf' > cabal.project.local
RUN cabal update
RUN cabal install cardano-node \
  --install-method=copy \
  --installdir=/usr/local/bin \
  -f -systemd  \
  -f -external-libsodium-vrf &&\
cabal install cardano-cli \
  -f -external-libsodium-vrf \
  -f -systemd \
  --install-method=copy \
  --installdir=/usr/local/bin
WORKDIR /app/src
RUN git clone https://github.com/input-output-hk/cardano-db-sync.git &&\
  cd cardano-db-sync &&\
  git fetch --all --tags &&\
  git checkout ${CARDANO_DB_SYNC_VERSION}
WORKDIR /app/src/cardano-db-sync
RUN echo 'package cardano-crypto-praos\n   flags: -external-libsodium-vrf' > cabal.project.local
# https://github.com/input-output-hk/iohk-monitoring-framework/issues/579
#RUN cabal install cardano-db-sync \
#  --install-method=copy \
#  --installdir=/usr/local/bin
RUN cabal build cardano-db-sync && \
  mv ./dist-newstyle/build/x86_64-linux/ghc-8.6.5/cardano-db-sync-${CARDANO_DB_SYNC_VERSION}/x/cardano-db-sync/build/cardano-db-sync/cardano-db-sync /usr/local/bin/

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
  libsodium-dev \
  postgresql-12 \
  postgresql-client-12
RUN npm install pm2 -g
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

FROM nodejs-builder as rosetta-server-builder
ARG CARDANO_ROSETTA_SERVER_TAG=1.0.0
RUN apt-get update && apt-get install git -y
RUN git clone -b ${CARDANO_ROSETTA_SERVER_TAG} https://github.com/input-output-hk/cardano-rosetta
WORKDIR /cardano-rosetta
RUN yarn --offline --frozen-lockfile --non-interactive
RUN yarn build

FROM nodejs-builder as rosetta-server-production-deps
RUN mkdir -p /app/src
COPY --from=rosetta-server-builder /app/src/packages-cache /app/src/
COPY --from=rosetta-server-builder /app/src/cardano-rosetta/.yarnrc /app/src/yarn.lock cardano-rosetta/package.json /app/src/
WORKDIR /app/src
RUN yarn --offline --frozen-lockfile --non-interactive --production

FROM runtime-base
ARG NETWORK=mainnet
COPY --from=rosetta-server-builder /cardano-rosetta/dist /cardano-rosetta-server/dist
COPY --from=rosetta-server-production-deps /cardano-rosetta/node_modules /cardano-rosetta-server/node_modules
COPY --from=rosetta-server-builder /cardano-rosetta/config/ecosystem.config.js .
COPY --from=rosetta-server-builder /cardano-rosetta/config/postgres/postgresql.conf /etc/postgresql/12/main/postgresql.conf
COPY --from=rosetta-server-builder /cardano-rosetta/config/network/${NETWORK} /config/
COPY --from=rosetta-server-builder /cardano-rosetta/scripts/entrypoint.sh .
