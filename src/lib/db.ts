// src/lib/db.ts
import mysql from 'mysql2/promise';

declare global {
  // Pour éviter de créer plusieurs pools en dev (HMR)
  // eslint-disable-next-line no-var
  var __pool: mysql.Pool | undefined;
}

export const pool =
  global.__pool ||
  mysql.createPool({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DB || 'gestifin',
    waitForConnections: true,
    connectionLimit: 10,
    timezone: 'Z',        // dates au format UTC côté Node
    decimalNumbers: true, // renvoie DECIMAL en number
  });

if (process.env.NODE_ENV !== 'production') global.__pool = pool;

/** Exécuter une transaction facilement */
export async function tx<T>(fn: (conn: mysql.PoolConnection) => Promise<T>): Promise<T> {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const res = await fn(conn);
    await conn.commit();
    return res;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}
