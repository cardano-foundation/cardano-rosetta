FROM nodejs-builder as rosetta-server-builder-dev
RUN mkdir cardano-rosetta
COPY package.json yarn.lock .yarnrc tsconfig-dist.json tsconfig.json /cardano-rosetta/
COPY packages-cache /cardano-rosetta/packages-cache
COPY src /cardano-rosetta/src
WORKDIR /cardano-rosetta
RUN yarn --offline --frozen-lockfile --non-interactive
RUN yarn build

FROM nodejs-builder as rosetta-server-production-deps-dev
RUN mkdir cardano-rosetta
COPY --from=rosetta-server-builder-dev cardano-rosetta/packages-cache cardano-rosetta/packages-cache
COPY --from=rosetta-server-builder-dev cardano-rosetta/.yarnrc cardano-rosetta/yarn.lock cardano-rosetta/package.json cardano-rosetta/
WORKDIR /cardano-rosetta
RUN yarn --offline --frozen-lockfile --non-interactive --production

FROM ubuntu-nodejs
RUN mkdir cardano-rosetta
COPY --from=rosetta-server-builder-dev cardano-rosetta/dist cardano-rosetta/dist
COPY --from=rosetta-server-builder-dev cardano-rosetta/package.json cardano-rosetta/
COPY --from=rosetta-server-production-deps-dev cardano-rosetta/node_modules cardano-rosetta/node_modules
WORKDIR /cardano-rosetta/dist
EXPOSE 8080
CMD ["node", "src/server/index.js"]
