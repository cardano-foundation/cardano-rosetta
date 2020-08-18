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
      kill_timeout : 15000
    },
    {
      name: 'cardano-node',
      script: '/usr/local/bin/cardano-node',
      args: [
        'run',
        '--config', '/config/cardano-node/config.json',
        '--database-path', '/data/node-db',
        '--socket-path', '/ipc/node.socket',
        '--topology', '/config/cardano-node/topology.json'
      ],
      autorestart: true,
      exec_mode: 'fork_mode',
      kill_timeout : 30000
    },
    {
      name: 'cardano-db-sync',
      script: '/usr/local/bin/cardano-db-sync',
      args: [
        '--config', '/config/cardano-db-sync/config.json',
        '--schema-dir', '/cardano-db-sync/schema/',
        '--socket-path', '/ipc/node.socket'
      ],
      autorestart: true,
      env: {
        PGPASSFILE: '/config/cardano-db-sync/pgpass'
      },
      exec_mode: 'fork_mode',
      kill_timeout : 15000

    },
    {
      name: 'cardano-rosetta-server',
      script: '/cardano-rosetta-server/dist/src/server/index.js',
      autorestart: true,
      env: {
        DB_CONNECTION_STRING: 'socket://postgres:*@/var/run/postgresql?db=cexplorer',
        LOGGER_LEVEL: 'debug',
        NODE_ENV: 'development',
        PAGE_SIZE: 30,
        TOPOLOGY_FILE_PATH: '/config/cardano-node/topology.json'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
}