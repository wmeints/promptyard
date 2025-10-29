/**
 * TypeScript type definitions for database operations
 */

/**
 * Database configuration interface
 */
export interface DatabaseConfig {
  /** PostgreSQL connection URL */
  url: string;
  /** Maximum number of connections in the pool */
  maxConnections?: number;
  /** Connection timeout in milliseconds */
  connectionTimeoutMs?: number;
  /** Idle timeout in milliseconds */
  idleTimeoutMs?: number;
}

/**
 * Connection options for PostgreSQL client
 */
export interface ConnectionOptions {
  /** Maximum number of connections */
  max?: number;
  /** Idle timeout in seconds */
  idle_timeout?: number;
  /** Connection timeout in seconds */
  connect_timeout?: number;
}

/**
 * Database error types
 */
export class DatabaseConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseConnectionError';
  }
}

export class DatabaseTimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseTimeoutError';
  }
}