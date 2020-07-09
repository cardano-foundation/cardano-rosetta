ARG NODEJS_VERSION=14.5.0
ARG ALPINE_VERSION=3.11
ARG CARDANO_ROSETTA_SERVER_TAG=0.1.0

#############################################################
#####################  Offline ##############################
#############################################################

FROM node:${NODEJS_VERSION}-alpine${ALPINE_VERSION} as rosetta_server_offline_builder
RUN apk add --update python make g++ yarn
RUN mkdir cardano-rosetta
COPY package.json yarn.lock .yarnrc tsconfig.json /cardano-rosetta/
COPY packages-cache /cardano-rosetta/packages-cache
COPY src /cardano-rosetta/src
WORKDIR /cardano-rosetta
RUN yarn --offline --frozen-lockfile --non-interactive
RUN yarn build

FROM node:${NODEJS_VERSION}-alpine${ALPINE_VERSION} as rosetta_server_offline_production_deps
RUN apk add --update python make g++ yarn
RUN mkdir cardano-rosetta
COPY --from=rosetta_server_offline_builder cardano-rosetta/packages-cache cardano-rosetta/packages-cache
COPY --from=rosetta_server_offline_builder cardano-rosetta/.yarnrc cardano-rosetta/yarn.lock cardano-rosetta/package.json cardano-rosetta/
WORKDIR /cardano-rosetta
RUN yarn --offline --frozen-lockfile --non-interactive --production

FROM node:${NODEJS_VERSION}-alpine${ALPINE_VERSION} as rosetta_offline_server
RUN apk add --update python make g++ yarn
RUN mkdir cardano-rosetta
COPY --from=rosetta_server_offline_production_deps cardano-rosetta/dist cardano-rosetta/dist
COPY --from=rosetta_server_offline_builder cardano-rosetta/node_modules cardano-rosetta/node_modules
COPY --from=rosetta_server_offline_builder cardano-rosetta/package.json cardano-rosetta/
WORKDIR /cardano-rosetta/dist
EXPOSE 8080
CMD ["node", "index.js"]

#############################################################
######  Spec-compliant, build from anywhere (default) #######
#############################################################

FROM node:${NODEJS_VERSION}-alpine${ALPINE_VERSION} as rosetta_server_builder
RUN apk add --update python make g++ yarn
RUN git clone -b ${CARDANO_ROSETTA_SERVER_TAG} https://github.com/input-output-hk/cardano-rosetta
WORKDIR /cardano-rosetta
RUN yarn --offline --frozen-lockfile --non-interactive
RUN yarn build

FROM node:${NODEJS_VERSION}-alpine${ALPINE_VERSION} as rosetta_server_production_deps
RUN apk add --update python make g++ yarn
RUN mkdir cardano-rosetta
COPY --from=rosetta_server_builder cardano-rosetta/packages-cache cardano-rosetta/packages-cache
COPY --from=rosetta_server_builder cardano-rosetta/.yarnrc cardano-rosetta/yarn.lock cardano-rosetta/package.json cardano-rosetta/
WORKDIR /cardano-rosetta
RUN yarn --offline --frozen-lockfile --non-interactive --production

FROM node:${NODEJS_VERSION}-alpine${ALPINE_VERSION}
RUN apk add --update yarn
RUN mkdir cardano-rosetta
COPY --from=rosetta_server_production_deps cardano-rosetta/dist cardano-rosetta/dist
COPY --from=rosetta_server_builder cardano-rosetta/node_modules cardano-rosetta/node_modules
COPY --from=rosetta_server_builder cardano-rosetta/package.json cardano-rosetta/
WORKDIR /cardano-rosetta/dist
EXPOSE 8080
CMD ["node", "index.js"]
