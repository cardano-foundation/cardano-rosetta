import envalid, { host, makeValidator, num, str, bool } from 'envalid';
/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import { TopologyConfig } from '../services/network-service';
import { configNotFoundError } from './errors';

export interface Environment {
  TOPOLOGY_FILE: TopologyConfig;
  PORT: number;
  BIND_ADDRESS: string;
  DB_CONNECTION_STRING: string;
  CARDANO_NODE_PATH: string;
  LOGGER_LEVEL: string;
  TOPOLOGY_FILE_PATH: string;
  DEFAULT_RELATIVE_TTL: number;
  PAGE_SIZE: number;
  DISABLE_SEARCH_API: boolean;
  OGMIOS_HOST: string;
  OGMIOS_PORT: number;
}

const existingFileValidator = makeValidator((filePath: string) => {
  if (fs.existsSync(filePath)) {
    return filePath;
  }
  throw configNotFoundError();
});

export const parseEnvironment = (): Environment => {
  const environment = envalid.cleanEnv(process.env, {
    PORT: num(),
    BIND_ADDRESS: host(),
    DB_CONNECTION_STRING: str(),
    CARDANO_NODE_PATH: existingFileValidator(),
    LOGGER_LEVEL: str(),
    TOPOLOGY_FILE_PATH: existingFileValidator(),
    DEFAULT_RELATIVE_TTL: num(),
    PAGE_SIZE: num(),
    GENESIS_SHELLEY_PATH: existingFileValidator(),
    CARDANO_NODE_SOCKET_PATH: str(),
    DISABLE_SEARCH_API: bool({ default: false }),
    OGMIOS_HOST: host(),
    OGMIOS_PORT: num()
  });
  let topologyFile: TopologyConfig;
  try {
    topologyFile = JSON.parse(fs.readFileSync(path.resolve(environment.TOPOLOGY_FILE_PATH)).toString());
  } catch (error) {
    throw configNotFoundError();
  }
  return { ...environment, TOPOLOGY_FILE: topologyFile };
};
