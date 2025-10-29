/**
 * Database connection module for Drizzle ORM with PostgreSQL
 * Provides a configured database instance using node-postgres driver
 */

import { drizzle } from 'drizzle-orm/node-postgres';
import { getDatabaseConfig } from './config';

/**
 * Database instance configured with Drizzle ORM
 * Uses node-postgres (pg) as the underlying driver
 */
export const db = drizzle(getDatabaseConfig().url);
