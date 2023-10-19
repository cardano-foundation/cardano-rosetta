module.exports = {
  apps : [
    {
      name: 'postgres',
      script: `/usr/lib/postgresql/12/bin/postgres`,
      args: [
        '-D',
        '/data/postgresql',
        '-c',
        `config_file=/etc/postgresql/12/main/postgresql.conf`
      ],
      autorestart: true,
      exec_mode: 'fork_mode',
      kill_timeout : 15000,
      error_file: 'NULL',
      out_file: 'NULL'
    },
    {
      name: 'cardano-node',
      script: '/bin/sh',
      args: [
        '/usr/local/bin/cardano-node',
        'run',
        '--config', '/config/cardano-node/config.json',
        '--database-path', '/data/node-db',
        '--socket-path', '/ipc/node.socket',
        '--topology', '/config/cardano-node/topology.json'
      ],
      autorestart: true,
      exec_mode: 'fork_mode',
      kill_timeout : 30000,
      error_file: 'NULL',
      out_file: 'NULL'
    },
    {
      name: 'cardano-db-sync',
      script: '/scripts/start_cardano-db-sync.sh',
      args: [
        '/usr/local/bin/cardano-db-sync'
      ],
      autorestart: true,
      env: {
        PGPASSFILE: '/config/cardano-db-sync/pgpass'
      },
      exec_mode: 'fork_mode',
      kill_timeout : 15000,
      error_file: 'NULL',
      out_file: 'NULL'
    },
    {
      name: 'cardano-rosetta-server',
      script: '/cardano-rosetta-server/dist/src/server/index.js',
      autorestart: true,
      env: {
        BIND_ADDRESS: '0.0.0.0',
        CARDANO_CLI_PATH: '/usr/local/bin/cardano-cli',
        CARDANO_NODE_PATH: '/usr/local/bin/cardano-node',
        CARDANO_NODE_SOCKET_PATH: '/ipc/node.socket',
        DB_CONNECTION_STRING: 'socket://postgres:*@/var/run/postgresql?db=cexplorer',
        DEFAULT_RELATIVE_TTL: process.env.DEFAULT_RELATIVE_TTL,
        GENESIS_SHELLEY_PATH: '/config/genesis/shelley.json',
        LOGGER_LEVEL: process.env.LOGGER_MIN_SEVERITY,
        NODE_ENV: 'development',
        PAGE_SIZE: process.env.PAGE_SIZE,
        PORT: 8080,
        TOPOLOGY_FILE_PATH: '/config/cardano-node/topology.json'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      error_file: 'NULL',
      out_file: 'NULL'
    }
  ]
}
