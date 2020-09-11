#!/usr/bin/env bash
NETWORK_IDENTIFIER=$1

function queryNetworkStatus () {
  curl \
    --retry-connrefused \
    --retry 10 \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"network_identifier":{"blockchain": "cardano", "network":"'${NETWORK_IDENTIFIER}'"}}' http://localhost:8080/network/status
}

if ! type "jq" > /dev/null
 then
  echo "jq is a system requirement, but is not found on PATH. https://stedolan.github.io/jq/download/"
else
  i="0"
  while [ $i -lt 19 ]
  do
    result=$(queryNetworkStatus)
    echo $result | jq .
    if [[ $(echo $result | jq '.code == 5000') == true ]]
    then
      echo 'Will retry in 3 seconds'
      i=$[$i+1]
      sleep 3
    else
      echo $result | jq -e '.current_block_identifier.index != null' > /dev/null
      exit
    fi
  done
fi
