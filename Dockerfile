ARG UBUNTU_VERSION=20.04

FROM ubuntu:${UBUNTU_VERSION} as ubuntu-nodejs
ARG NODEJS_MAJOR_VERSION=14
RUN apt-get update && apt-get install curl -y
RUN curl --proto '=https' --tlsv1.2 -sSf -L https://deb.nodesource.com/setup_${NODEJS_MAJOR_VERSION}.x | bash -
RUN apt-get install nodejs -y

FROM ubuntu-nodejs as nodejs-builder
RUN apt-get update && apt-get install gcc g++ make gnupg2 -y
RUN curl --proto '=https' --tlsv1.2 -sSf -L https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install yarn -y

FROM nodejs-builder as rosetta-server-builder
ARG CARDANO_ROSETTA_SERVER_TAG=1.0.0
RUN apt-get update && apt-get install git -y
RUN git clone -b ${CARDANO_ROSETTA_SERVER_TAG} https://github.com/input-output-hk/cardano-rosetta
WORKDIR /cardano-rosetta
RUN yarn --offline --frozen-lockfile --non-interactive
RUN yarn build

FROM nodejs-builder as rosetta-server-production-deps
RUN mkdir cardano-rosetta
COPY --from=rosetta-server-builder cardano-rosetta/packages-cache cardano-rosetta/packages-cache
COPY --from=rosetta-server-builder cardano-rosetta/.yarnrc cardano-rosetta/yarn.lock cardano-rosetta/package.json cardano-rosetta/
WORKDIR /cardano-rosetta
RUN yarn --offline --frozen-lockfile --non-interactive --production

FROM ubuntu-nodejs
RUN mkdir cardano-rosetta
COPY --from=rosetta-server-builder cardano-rosetta/dist cardano-rosetta/dist
COPY --from=rosetta-server-builder cardano-rosetta/package.json cardano-rosetta/
COPY --from=rosetta-server-production-deps cardano-rosetta/node_modules cardano-rosetta/node_modules
WORKDIR /cardano-rosetta/dist
EXPOSE 8080
CMD ["node", "src/server/index.js"]

