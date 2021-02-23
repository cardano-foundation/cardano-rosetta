const newman = require('newman');

const env = process.argv[2];
const port = 8081;

newman.run({
    collection: require('./Cardano-Rosetta.postman_collection.json'),
    environment: require(`./environments/${env}`),
    envVar: [ { "key":"", "value":`localhost:${port}` }  ],
    reporters: ['cli', 'json']
}, function (err) {
	if (err) { throw err; }
    console.log('collection run complete!');
});
