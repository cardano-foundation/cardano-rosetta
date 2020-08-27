FROM nodejs-builder as rosetta-server-builder-dev
RUN mkdir /app
COPY cardano-rosetta-server/package.json \
  cardano-rosetta-server/yarn.lock \
  cardano-rosetta-server/.yarnrc \
  cardano-rosetta-server/tsconfig-dist.json \
  cardano-rosetta-server/tsconfig.json \
  /app/
COPY cardano-rosetta-server/packages-cache /app/packages-cache
WORKDIR /app
RUN yarn --offline --frozen-lockfile --non-interactive
COPY cardano-rosetta-server/src /app/src
RUN yarn build

FROM nodejs-builder as rosetta-server-production-deps-dev
RUN mkdir -p /app/src
COPY --from=rosetta-server-builder-dev /app/packages-cache /app/packages-cache
COPY --from=rosetta-server-builder-dev /app/.yarnrc \
  /app/yarn.lock \
  /app/package.json \
  /app/
WORKDIR /app
RUN yarn --offline --frozen-lockfile --non-interactive --production

FROM ubuntu-nodejs as cardano-rosetta-server-dev
ARG NETWORK=mainnet
COPY --from=haskell-builder /usr/local/bin/cardano-cli \
  /usr/local/bin/cardano-node \
  /usr/local/bin/
COPY --from=rosetta-server-builder-dev /app/dist /cardano-rosetta-server/dist
COPY --from=rosetta-server-production-deps-dev /app/node_modules /cardano-rosetta-server/node_modules
COPY config/network/${NETWORK} /config/
EXPOSE 8080
CMD ["node", "/cardano-rosetta-server/dist/src/server/index.js"]

FROM runtime-base
ARG NETWORK=mainnet
COPY --from=rosetta-server-builder-dev /app/dist /cardano-rosetta-server/dist
COPY --from=rosetta-server-production-deps-dev /app/node_modules /cardano-rosetta-server/node_modules
COPY config/ecosystem.config.js .
COPY config/postgres/postgresql.conf /etc/postgresql/12/main/postgresql.conf
COPY config/network/${NETWORK} /config/
COPY scripts/entrypoint.sh .
