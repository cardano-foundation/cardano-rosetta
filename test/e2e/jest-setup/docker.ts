import Docker from 'dockerode';
import { containerExec, pullImageAsync, imageExists } from 'dockerode-utils';
import path from 'path';

const CONTAINER_IMAGE = 'postgres:11.5-alpine';
const CONTAINER_TEMP_DIR = '/tmp';
const CONTAINER_NAME = 'cardano-test';

export const removePostgresContainer = async (): Promise<void> => {
  const docker = new Docker();
  const container = await docker.getContainer(CONTAINER_NAME);
  await container.stop();
  await container.remove();
};

export const setupPostgresContainer = async (
  database: string,
  user: string,
  password: string,
  port: string
): Promise<void> => {
  const docker = new Docker();

  const needsToPull = !(await imageExists(docker, CONTAINER_IMAGE));
  if (needsToPull) await pullImageAsync(docker, CONTAINER_IMAGE);

  const container = await docker.createContainer({
    Image: CONTAINER_IMAGE,
    Env: [`POSTGRES_DB=${database}`, `POSTGRES_PASSWORD=${password}`, `POSTGRES_USER=${user}`],
    HostConfig: {
      PortBindings: {
        '5432/tcp': [
          {
            HostPort: port
          }
        ]
      }
    },
    name: CONTAINER_NAME
  });
  await container.start();

  await container.putArchive(path.join(__dirname, 'db-snapshot.tar'), {
    path: CONTAINER_TEMP_DIR,
    User: 'root'
  });

  // Wait for the db service to be running (container started event is not enough)
  await containerExec(container, [
    'bash',
    '-c',
    `until psql -U ${user} -d ${database} -c "select 1" > /dev/null 2>&1 ; do sleep 1; done`
  ]);

  // Execute backup restore
  await containerExec(container, ['bash', '-c', `cat ${CONTAINER_TEMP_DIR}/db.bak | psql -U ${user} ${database}`]);
};
