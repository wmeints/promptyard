/**
 * Database URL validation utilities
 * Provides validation functions for PostgreSQL connection strings
 */

/**
 * Custom error class for database configuration errors
 */
export class DatabaseConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseConfigError';
  }
}

/**
 * Validates PostgreSQL connection URL format
 * @param url - The database URL to validate
 * @returns true if valid, false otherwise
 */
export function validateDatabaseUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  // PostgreSQL URL format: postgresql://[user[:password]@][host][:port][/dbname][?param1=value1&...]
  const postgresUrlRegex = /^postgresql:\/\/(?:([^:@]+)(?::([^@]*))?@)?([^:\/]+)(?::(\d+))?(?:\/([^?]+))?(?:\?(.*))?$/;
  
  return postgresUrlRegex.test(url);
}

/**
 * Validates and throws descriptive error for invalid DATABASE_URL
 * @param url - The database URL to validate
 * @throws DatabaseConfigError if URL is invalid or missing
 */
export function validateDatabaseUrlOrThrow(url: string | undefined): asserts url is string {
  if (!url) {
    throw new DatabaseConfigError(
      'DATABASE_URL environment variable is required. ' +
      'Please set it to a valid PostgreSQL connection string. ' +
      'Example: postgresql://username:password@localhost:5432/database_name'
    );
  }

  if (!validateDatabaseUrl(url)) {
    throw new DatabaseConfigError(
      'DATABASE_URL format is invalid. ' +
      'Expected format: postgresql://username:password@host:port/database_name ' +
      `Received: ${url}`
    );
  }
}

/**
 * Validates numeric environment variable
 * @param value - The value to validate
 * @param defaultValue - Default value if validation fails
 * @returns Parsed number or default value
 */
export function validateNumericEnv(value: string | undefined, defaultValue: number): number {
  if (!value) return defaultValue;
  
  const parsed = parseInt(value, 10);
  return isNaN(parsed) || parsed <= 0 ? defaultValue : parsed;
}