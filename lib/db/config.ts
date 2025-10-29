/**
 * Database configuration module
 * Handles environment variable parsing and validation for database setup
 */

import { validateDatabaseUrlOrThrow, validateNumericEnv } from '../utils/validation';
import type { DatabaseConfig } from './types';

/**
 * Default configuration values
 */
const DEFAULT_CONFIG = {
  maxConnections: 20,
  connectionTimeoutMs: 30000,
  idleTimeoutMs: 10000,
} as const;

/**
 * Retrieves and validates database configuration from environment variables
 * @returns DatabaseConfig object with validated configuration
 * @throws DatabaseConfigError if required environment variables are missing or invalid
 */
export function getDatabaseConfig(): DatabaseConfig {
  // Validate required DATABASE_URL
  const databaseUrl = process.env.DATABASE_URL;
  validateDatabaseUrlOrThrow(databaseUrl);

  // Parse optional configuration with defaults
  const maxConnections = validateNumericEnv(
    process.env.DB_MAX_CONNECTIONS,
    DEFAULT_CONFIG.maxConnections
  );

  const connectionTimeoutMs = validateNumericEnv(
    process.env.DB_CONNECTION_TIMEOUT,
    DEFAULT_CONFIG.connectionTimeoutMs
  );

  const idleTimeoutMs = validateNumericEnv(
    process.env.DB_IDLE_TIMEOUT,
    DEFAULT_CONFIG.idleTimeoutMs
  );

  return {
    url: databaseUrl,
    maxConnections,
    connectionTimeoutMs,
    idleTimeoutMs,
  };
}

/**
 * Gets database configuration with error handling
 * @returns DatabaseConfig or null if configuration is invalid
 */
export function getDatabaseConfigSafe(): DatabaseConfig | null {
  try {
    return getDatabaseConfig();
  } catch (error) {
    console.error('Database configuration error:', error);
    return null;
  }
}