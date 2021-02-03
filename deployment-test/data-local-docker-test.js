const newman = require('newman');

const envFile = require('some_arg');
const port = 8081;

newman.run({
    collection: require('./Cardano-Rosetta.postman_collection.json'),
    environment: require(endFile),
    envVar: [ { "key":"", "value":`localhost:${port}` }  ]
    reporters: ['cli', 'json']
}, function (err) {
	if (err) { throw err; }
    console.log('collection run complete!');
});
