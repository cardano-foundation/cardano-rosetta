import { cleanEnv, host, makeValidator, num, str, bool } from 'envalid';
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
  LOGGER_LEVEL: string;
  TOPOLOGY_FILE_PATH: string;
  DEFAULT_RELATIVE_TTL: number;
  CARDANO_CLI_PATH: string;
  PAGE_SIZE: number;
  CARDANO_NODE_PATH: string;
  DISABLE_SEARCH_API: boolean;
  DEFAULT_KEY_DEPOSIT: string;
  DEFAULT_POOL_DEPOSIT: string;
}

const existingFileValidator = makeValidator((filePath: string) => {
  if (fs.existsSync(filePath)) {
    return filePath;
  }
  throw configNotFoundError();
});

export const parseEnvironment = (): Environment => {
  const environment = cleanEnv(process.env, {
    PORT: num(),
    BIND_ADDRESS: host(),
    DB_CONNECTION_STRING: str(),
    LOGGER_LEVEL: str(),
    TOPOLOGY_FILE_PATH: existingFileValidator(),
    DEFAULT_RELATIVE_TTL: num(),
    CARDANO_CLI_PATH: existingFileValidator(),
    PAGE_SIZE: num(),
    CARDANO_NODE_PATH: existingFileValidator(),
    GENESIS_SHELLEY_PATH: existingFileValidator(),
    CARDANO_NODE_SOCKET_PATH: str(),
    DISABLE_SEARCH_API: bool({ default: false }),
    DEFAULT_KEY_DEPOSIT: str(),
    DEFAULT_POOL_DEPOSIT: str()
  });
  let topologyFile: TopologyConfig;
  try {
    topologyFile = JSON.parse(fs.readFileSync(path.resolve(environment.TOPOLOGY_FILE_PATH)).toString());
  } catch {
    throw configNotFoundError();
  }
  return { ...environment, TOPOLOGY_FILE: topologyFile };
};
