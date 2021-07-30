#!/bin/bash

# Download configuration files from Hydra, for a given network.

CARDANO_CONFIG_URL=$1
CARDANO_NETWORK=$2

mkdir -p \
  network/$CARDANO_NETWORK/cardano-node \
  network/$CARDANO_NETWORK/genesis \
  network/$CARDANO_NETWORK/cardano-db-sync
  
wget -q $CARDANO_CONFIG_URL/$CARDANO_NETWORK-topology.json -O network/$CARDANO_NETWORK/cardano-node/topology.json
wget -q $CARDANO_CONFIG_URL/$CARDANO_NETWORK-config.json -O network/$CARDANO_NETWORK/cardano-node/config.json
sed -i 's@\("ByronGenesisFile"\):.*$@\1: "../genesis/byron.json",@' network/$CARDANO_NETWORK/cardano-node/config.json
sed -i 's@\("ShelleyGenesisFile"\):.*$@\1: "../genesis/shelley.json",@' network/$CARDANO_NETWORK/cardano-node/config.json
sed -i 's@\("AlonzoGenesisFile"\):.*$@\1: "../genesis/alonzo.json",@' network/$CARDANO_NETWORK/cardano-node/config.json

wget -q $CARDANO_CONFIG_URL/$CARDANO_NETWORK-byron-genesis.json -O network/$CARDANO_NETWORK/genesis/byron.json
wget -q $CARDANO_CONFIG_URL/$CARDANO_NETWORK-shelley-genesis.json -O network/$CARDANO_NETWORK/genesis/shelley.json
wget -q $CARDANO_CONFIG_URL/$CARDANO_NETWORK-alonzo-genesis.json -O network/$CARDANO_NETWORK/genesis/alonzo.json

wget -q $CARDANO_CONFIG_URL/$CARDANO_NETWORK-db-sync-config.json -O network/$CARDANO_NETWORK/cardano-db-sync/config.json
sed -i 's@\("NodeConfigFile"\):.*$@\1: "../cardano-node/config.json",@' network/$CARDANO_NETWORK/cardano-db-sync/config.json
