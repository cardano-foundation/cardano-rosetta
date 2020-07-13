declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: number;
    BIND_ADDRESS?: string;
    DB_CONNECTION_STRING: string;
    LOGGER_ENABLED?: string;
  }
}
