const loadtest = require('loadtest');

function statusCallback(error, result, latency) {
    //console.log('Current latency %j, result %j, error %j', latency, result, error);
    console.log('----');
    console.log('Current result %j', result);
    console.log('----');
    //console.log('Request elapsed milliseconds: ', result.requestElapsed);
    //console.log('Request index: ', result.requestIndex);
    //console.log('Request loadtest() instance index: ', result.instanceIndex);
}

// Testnet
const url = 'https://explorer.cardano-testnet.iohkdev.io/rosetta'
const networkId = 'testnet'
const blockIndex = 2126713
const blockHash = 'cc747306d0420500b0e3b2a30c5b799f810f57473ae0c3e365aaf36d2e49cd2a'

// /block

const block_payload = 
{
    "network_identifier": {
        "blockchain": "cardano",
        "network": networkId
    },
    "block_identifier": {
        "index": blockIndex,
        "hash": blockHash
    }
}

const options = {
    url: url + '/block',
    concurrency: 30,
    method: 'POST',
    contentType: 'application/json',
    body: block_payload,
    maxRequests: 100,
    maxSeconds: 10,
    statusCallback: statusCallback
};

loadtest.loadTest(options, function(error, result)
{
    if (error)
    {
        return console.error('Got an error: %s', error);
    }
    console.log(result);
    if (result.totalErrors > 1)
    {
      console.log('FAIL');
    } else
    {
      console.log('PASS');
    }
});
