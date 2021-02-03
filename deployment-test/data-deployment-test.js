const newman = require('newman');

const environments = [ 'testnet.postman_environment.json',
                       'shelley-qa.postman_environment.json',
                       'mary-qa.postman_environment.json',
                       'staging.postman_environment.json' ]

for (env of environments) {
    newman.run({
        collection: 'https://www.getpostman.com/collections/681bc379b01e1bf278a6',
        environment: require(`./environments/${env}`),
        globals: require('./globals.json'),
        reporters: ['cli', 'json']
    }, function (err) {
    	if (err) { throw err; }
        console.log('collection run complete!');
    });
}
