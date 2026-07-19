import 'server-only';

import postgres from 'postgres';

type SqlClient = ReturnType<typeof postgres>;

const globalForPostgres = globalThis as typeof globalThis & {
  postgresSql?: SqlClient;
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not configured.');
}

export const sql =
  globalForPostgres.postgresSql ??
  postgres(connectionString, {
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPostgres.postgresSql = sql;
}
