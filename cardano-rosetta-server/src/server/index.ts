/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import createPool from './db/connection';
import * as Repostories from './db/repositories';
import buildServer from './server';
import * as Services from './services/services';
import * as CardanoNode from './utils/cardano/node/cardano-node';
import { Environment, parseEnvironment } from './utils/environment-parser';
import { DepositParameters } from './services/cardano-services';
import * as OgmiosClient from './utils/cardano/node/ogmios-client';

// FIXME: validate the following paraemeters when implementing (2)
// https://github.com/input-output-hk/cardano-rosetta/issues/101
const genesis = JSON.parse(fs.readFileSync(path.resolve(process.env.GENESIS_SHELLEY_PATH)).toString());
const networkMagic = genesis.networkMagic;
const networkId = genesis.networkId.toLowerCase();

const start = async (databaseInstance: Pool) => {
  let server;
  let ogmiosClient: OgmiosClient.OgmiosClient | undefined;
  try {
    const environment: Environment = parseEnvironment();
    const repository = Repostories.configure(databaseInstance);
    // FIXME: validate the following paraemeters when implementing (2)
    // https://github.com/input-output-hk/cardano-rosetta/issues/101
    ogmiosClient = await OgmiosClient.configure({ host: environment.OGMIOS_HOST, port: environment.OGMIOS_PORT });
    const cardanoNode = CardanoNode.configure(environment.CARDANO_NODE_PATH);
    const services = Services.configure(
      repository,
      networkId,
      networkMagic,
      environment.TOPOLOGY_FILE,
      environment.DEFAULT_RELATIVE_TTL
    );
    server = buildServer(services, ogmiosClient, cardanoNode, environment.LOGGER_LEVEL, {
      networkId,
      pageSize: environment.PAGE_SIZE,
      disableSearchApi: environment.DISABLE_SEARCH_API
    });

    server.addHook('onClose', async (_, done) => {
      await databaseInstance.end(done);
      await ogmiosClient?.shutdown();
    });
    // eslint-disable-next-line no-magic-numbers
    await server.listen(environment.PORT, environment.BIND_ADDRESS);
    server.blipp();
  } catch (error) {
    server?.log.error(error);
    await ogmiosClient?.shutdown();
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

// FIXME this function call should be inside start() function, so process.env.DB_CONNECTION_STRING
// is validated through environment-parser, and for a better error handling too.
const connectDB = async () => await createPool(process.env.DB_CONNECTION_STRING);

connectDB()
  .then(databaseInstance => start(databaseInstance))
  .catch(console.error);
