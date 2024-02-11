declare namespace NodeJS {
  // eslint-disable-next-line unicorn/prevent-abbreviations
  interface ProcessEnv {
    PORT?: number;
    BIND_ADDRESS?: string;
    DB_CONNECTION_STRING: string;
    LOGGER_LEVEL: string;
    LOGGER_ENABLED?: string;
    CARDANO_CLI_PATH: string;
    GENESIS_SHELLEY_PATH: string;
    DEFAULT_RELATIVE_TTL: number;
    CARDANO_NODE_PATH: string;
    TOPOLOGY_FILE_PATH: string;
    EXEMPTION_TYPES_PATH: string;
    BODY_LIMIT: string;
  }
}
