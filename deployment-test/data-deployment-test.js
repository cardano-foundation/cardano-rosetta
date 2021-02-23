const newman = require('newman');

const env = process.argv[2]

newman.run({
    collection: 'https://www.getpostman.com/collections/681bc379b01e1bf278a6',
    environment: require(`./environments/${env}`),
    globals: require('./globals.json'),
    reporters: ['cli', 'json']
}, function (err, summary) {
	if (err) { 
        console.error('collection run encountered an error.');
    } else if (summary.run.failures.length) {
        console.error('assertion failure occured.');
        process.exit(1);
    }
    console.log('collection run complete!');
});
