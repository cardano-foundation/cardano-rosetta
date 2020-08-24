/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import createPool from './db/connection';
import * as Repostories from './db/repositories';
import buildServer from './server';
import * as Services from './services/services';
import * as CardanoCli from './utils/cardanonode-cli';
const { PORT, BIND_ADDRESS, DB_CONNECTION_STRING, LOGGER_LEVEL }: NodeJS.ProcessEnv = process.env;

// FIXME: validate the following paraemeters when implementing (2)
// https://github.com/input-output-hk/cardano-rosetta/issues/101
const genesis = JSON.parse(fs.readFileSync(path.resolve(process.env.GENESIS_PATH)).toString());
const networkMagic = genesis.networkMagic;
const networkId = genesis.networkId.toLowerCase();

const start = async (databaseInstance: Pool) => {
  let server;
  try {
    const repository = Repostories.configure(databaseInstance);
    // FIXME: validate the following paraemeters when implementing (2)
    // https://github.com/input-output-hk/cardano-rosetta/issues/101
    const cardanoCli = CardanoCli.configure(process.env.CARDANOCLI_PATH, networkMagic);
    const services = Services.configure(repository);
    server = buildServer(services, cardanoCli, networkId, LOGGER_LEVEL);
    server.addHook('onClose', (_, done) => databaseInstance.end(done));
    // eslint-disable-next-line no-magic-numbers
    await server.listen(PORT || 8080, BIND_ADDRESS || '0.0.0.0');
    server.blipp();
  } catch (error) {
    server?.log.error(error);
    await databaseInstance?.end();
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  }
};

process.on('uncaughtException', error => {
  console.error(error);
});
process.on('unhandledRejection', error => {
  console.error(error);
});

const connectDB = async () => await createPool(DB_CONNECTION_STRING);

connectDB()
  .then(databaseInstance => start(databaseInstance))
  .catch(console.error);
