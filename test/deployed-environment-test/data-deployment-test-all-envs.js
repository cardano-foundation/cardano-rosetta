const newman = require('newman');

const environments = [ 'mainnet.postman_environment.json'
                       'testnet.postman_environment.json',
                       'shelley-qa.postman_environment.json',
                       'mary-qa.postman_environment.json',
                       'staging.postman_environment.json' ]

for (env of environments) {
    newman.run({
        collection: require('./collection.json'),
        bail: true, // exit on failure
        environment: require(`./environments/${env}`),
        globals: require('./globals.json'),
        reporters: ['cli', 'json']
    }, function (err, summary) {
    	if (err) { 
            console.error('collection run encountered an error.');
        }
        console.log('collection run complete!');
    });
}
