/**
 * Database connection module for Drizzle ORM with PostgreSQL
 * Provides a configured database instance using node-postgres driver
 */

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { getDatabaseConfig } from './config';
import * as schema from './schema';

/**
 * PostgreSQL connection pool configured with settings from environment
 */
const config = getDatabaseConfig();
const pool = new Pool({
  connectionString: config.url,
  max: config.maxConnections,
  connectionTimeoutMillis: config.connectionTimeoutMs,
  idleTimeoutMillis: config.idleTimeoutMs,
});

/**
 * Database instance configured with Drizzle ORM
 * Uses node-postgres (pg) as the underlying driver with connection pooling
 */
export const db = drizzle(pool, { schema });
