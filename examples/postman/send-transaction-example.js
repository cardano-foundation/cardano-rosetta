const newman = require('newman');

const env = process.argv[2]
if (env === undefined) {
  throw new Error('Environment file must be provided as argument to this script')
}
newman.run({
    collection: require('./send_transaction.postman_collection.json'),
    environment: require(`./${env}`),
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
