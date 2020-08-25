import { Pool } from 'pg';

/**
 * Creates a database pool to be used to run queries. No connection will be established.
 *
 * @param connectionString `postgresql://dbuser:secretpassword@database.server.com:3211/mydb`
 */
const createPool = (connectionString: string): Pool => new Pool({ connectionString });

export default createPool;
