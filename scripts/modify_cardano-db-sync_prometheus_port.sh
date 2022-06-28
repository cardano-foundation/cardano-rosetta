#!/usr/bin/env bash

PROMETHEUS_PORT=8081
CONFIG_PATH=/config/cardano-db-sync/config.json

# Workaround to avoid port conflict between PrometheusPort and server's one
echo ${PROMETHEUS_PORT}
jq --arg PROMETHEUS_PORT ${PROMETHEUS_PORT} '.PrometheusPort |= ($PROMETHEUS_PORT | tonumber)' ${CONFIG_PATH} > config.tmp && mv config.tmp ${CONFIG_PATH}
