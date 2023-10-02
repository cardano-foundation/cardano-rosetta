ARG UBUNTU_VERSION=22.04
ARG TARGETARCH=amd64
ARG CARDANO_NODE_VERSION=1.35.7
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
# We don’t officially support AArch64, so we have to go through some hops:
SHELL ["/bin/bash", "-c"]
RUN mkdir -p /app && cat >/app/default.nix <<<$'\n\
  let\n\
    system = "'"$([ "$TARGETPLATFORM" = "linux/arm64" ] && echo "aarch64-linux" || echo "x86_64-linux")"$'";\n\
    _nodeFlake   = __getFlake "github:input-output-hk/cardano-node/'"${CARDANO_NODE_VERSION}"$'";\n\
    _dbSyncFlake = __getFlake "github:input-output-hk/cardano-db-sync/'"${CARDANO_DB_SYNC_VERSION}"$'";\n\
    pkgs = _nodeFlake.inputs.nixpkgs.legacyPackages.${system};\n\
    nix-bundle-exe = import (fetchTarball "https://github.com/3noch/nix-bundle-exe/archive/3522ae68aa4188f4366ed96b41a5881d6a88af97.zip") { inherit pkgs; };\n\
    enableAArch64 = original: supportedSystemsPath:\n\
      if system == "x86_64-linux" then original\n\
      else if system == "aarch64-linux" then let\n\
        patched = pkgs.runCommandNoCC "patched" {} "cp -r ${original} $out && chmod -R +w $out && echo ${with pkgs; with lib; escapeShellArg (__toJSON [system])} >$out/${supportedSystemsPath}";\n\
      in (import _nodeFlake.inputs.flake-compat {\n\
        src = {\n\
          inherit (patched) outPath;\n\
          inherit (original) rev shortRev lastModified lastModifiedDate;\n\
        };\n\
      }).defaultNix else throw "unsupported system: ${system}";\n\
    nodeFlake = enableAArch64 _nodeFlake "nix/supported-systems.nix";\n\
    dbSyncFlake = enableAArch64 _dbSyncFlake "supported-systems.nix";\n\
  in\n\
  # cardano-node doesn’t build for ARM before 1.35.7:\n\
  assert system != "aarch64-linux" || _nodeFlake.sourceInfo.lastModifiedDate >= "20230328184650";\n\
  {\n\
    inherit _nodeFlake;\n\
    cardano-node    = nix-bundle-exe   nodeFlake.packages.${system}.cardano-node;\n\
    cardano-cli     = nix-bundle-exe   nodeFlake.packages.${system}.cardano-cli;\n\
    cardano-db-sync = nix-bundle-exe dbSyncFlake.packages.${system}.cardano-db-sync;\n\
    schema = pkgs.runCommandNoCC "schema" {} "cp -r ${_dbSyncFlake}/schema $out";\n\
  }\n\
  ' && cat /app/default.nix
SHELL ["/bin/sh", "-c"]
# Note: ‘GC_DONT_GC=1’ prevents rare segfaults in Nix’s Boehm GC:
RUN GC_DONT_GC=1 nix-build /app/default.nix -A cardano-node    -o /app/cardano-node
RUN GC_DONT_GC=1 nix-build /app/default.nix -A cardano-cli     -o /app/cardano-cli
RUN GC_DONT_GC=1 nix-build /app/default.nix -A cardano-db-sync -o /app/cardano-db-sync
RUN GC_DONT_GC=1 nix-build /app/default.nix -A schema          -o /app/schema
RUN mkdir -p /opt && cp -rL /app/cardano-node /app/cardano-cli /app/cardano-db-sync /app/schema /opt/

# One more stage to detect Haskell errors early:
FROM ${TARGETARCH}/ubuntu:${UBUNTU_VERSION} as haskell-runtime
COPY --from=haskell-builder /opt/ /opt/
RUN stat /opt/schema &&\
  /opt/cardano-node/bin/cardano-node       --version &&\
  /opt/cardano-cli/bin/cardano-cli         --version &&\
  /opt/cardano-db-sync/bin/cardano-db-sync --version

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
COPY --from=haskell-builder /opt/ /opt/
RUN ln -s /opt/cardano-node/bin/* /opt/cardano-cli/bin/* /opt/cardano-db-sync/bin/* /usr/local/bin/ &&\
  mkdir -p /cardano-db-sync &&\
  ln -s /opt/schema /cardano-db-sync/schema
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
RUN chmod -R g+rX,o+rX /app

FROM rosetta-server-base as rosetta-server-builder
COPY cardano-rosetta-server/tsconfig-dist.json \
  cardano-rosetta-server/tsconfig.json \
  /app/
RUN yarn --offline --frozen-lockfile --non-interactive
COPY cardano-rosetta-server/src /app/src
RUN chmod -R g+rX,o+rX /app
RUN yarn build

FROM rosetta-server-base as rosetta-server-production-deps
RUN yarn --offline --frozen-lockfile --non-interactive --production

FROM ubuntu-nodejs as cardano-rosetta-server
ARG NETWORK=mainnet
COPY --from=haskell-builder /opt/ /opt/
RUN ln -s /opt/cardano-node/bin/* /opt/cardano-cli/bin/* /usr/local/bin/
COPY --from=rosetta-server-builder /app/dist /cardano-rosetta-server/dist
COPY --from=rosetta-server-production-deps /app/node_modules /cardano-rosetta-server/node_modules
COPY config/network/${NETWORK} /config/
RUN chmod -R g+rX,o+rX /config
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
RUN chmod -R g+rX,o+rX /ecosystem.config.js /etc/postgresql/12/main/postgresql.conf /scripts
ENV PGPASSFILE=/config/cardano-db-sync/pgpass
RUN echo "/var/run/postgresql:5432:cexplorer:*:*" > $PGPASSFILE &&\
 chmod 600 $PGPASSFILE && chown postgres:postgres $PGPASSFILE
RUN mkdir /snapshot &&\
  ./scripts/maybe_download_cardano-db-sync_snapshot.sh $SNAPSHOT_URL /snapshot
COPY scripts/entrypoint.sh .
