import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  DatabaseConfigError,
  validateDatabaseUrl,
  validateDatabaseUrlOrThrow,
  validateNumericEnv,
} from './validation';

describe('validation utilities', () => {
  describe('DatabaseConfigError', () => {
    it('should create error with correct name', () => {
      const error = new DatabaseConfigError('Test error');
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('DatabaseConfigError');
      expect(error.message).toBe('Test error');
    });
  });

  describe('validateDatabaseUrl', () => {
    it('should return true for valid PostgreSQL URLs', () => {
      const validUrls = [
        'postgresql://user:password@localhost:5432/database',
        'postgresql://user@localhost/database',
        'postgresql://localhost:5432/database',
        'postgresql://localhost/database',
        'postgresql://user:password@host.com:5432/db?param=value',
      ];

      validUrls.forEach((url) => {
        expect(validateDatabaseUrl(url)).toBe(true);
      });
    });

    it('should return false for invalid URLs', () => {
      const invalidUrls = [
        '',
        'not-a-url',
        'http://localhost:5432/database',
        'postgres://localhost:5432/database', // Wrong protocol
      ];

      invalidUrls.forEach((url) => {
        expect(validateDatabaseUrl(url)).toBe(false);
      });
    });

    it('should return false for non-string values', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(validateDatabaseUrl(null as any)).toBe(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(validateDatabaseUrl(undefined as any)).toBe(false);
    });
  });

  describe('validateDatabaseUrlOrThrow', () => {
    it('should throw when URL is undefined', () => {
      expect(() => {
        validateDatabaseUrlOrThrow(undefined);
      }).toThrow(DatabaseConfigError);
      expect(() => {
        validateDatabaseUrlOrThrow(undefined);
      }).toThrow(/DATABASE_URL environment variable is required/);
    });

    it('should throw when URL format is invalid', () => {
      expect(() => {
        validateDatabaseUrlOrThrow('invalid-url');
      }).toThrow(DatabaseConfigError);
      expect(() => {
        validateDatabaseUrlOrThrow('invalid-url');
      }).toThrow(/DATABASE_URL format is invalid/);
    });

    it('should not throw for valid URL', () => {
      expect(() => {
        validateDatabaseUrlOrThrow('postgresql://localhost:5432/database');
      }).not.toThrow();
    });
  });

  describe('validateNumericEnv', () => {
    it('should return default value when value is undefined', () => {
      expect(validateNumericEnv(undefined, 10)).toBe(10);
    });

    it('should return default value when value is not a number', () => {
      expect(validateNumericEnv('not-a-number', 10)).toBe(10);
    });

    it('should return default value when value is zero or negative', () => {
      expect(validateNumericEnv('0', 10)).toBe(10);
      expect(validateNumericEnv('-5', 10)).toBe(10);
    });

    it('should return parsed value for valid positive numbers', () => {
      expect(validateNumericEnv('42', 10)).toBe(42);
      expect(validateNumericEnv('100', 10)).toBe(100);
    });
  });
});

describe('mock reset verification', () => {
  // Create a mock function that we'll use across multiple tests
  const mockFunction = vi.fn();

  beforeEach(() => {
    // This shouldn't be necessary if mockReset is working,
    // but we add it for demonstration
    mockFunction.mockReturnValue('default');
  });

  it('first test - mock should be clean', () => {
    expect(mockFunction).not.toHaveBeenCalled();
    mockFunction.mockReturnValue('first');
    mockFunction('test');
    expect(mockFunction).toHaveBeenCalledWith('test');
    expect(mockFunction()).toBe('first');
  });

  it('second test - mock should be reset from previous test', () => {
    // If mockReset is working properly, the mock should be clean here
    expect(mockFunction).not.toHaveBeenCalled();
    mockFunction.mockReturnValue('second');
    mockFunction('another-test');
    expect(mockFunction).toHaveBeenCalledWith('another-test');
    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(mockFunction()).toBe('second');
  });

  it('third test - verify mock reset again', () => {
    // Again, the mock should be clean
    expect(mockFunction).not.toHaveBeenCalled();
    expect(mockFunction()).toBe('default');
  });
});
