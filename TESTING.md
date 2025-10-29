# Testing Guide

This project uses [Vitest](https://vitest.dev/) for unit testing.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (default for vitest)
npm test

# Run tests once (useful for CI)
npm test -- --run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Mock Configuration

Vitest is configured to automatically reset mocks after each test. The following settings are enabled in `vitest.config.ts`:

- `mockReset: true` - Resets all mocks after each test
- `restoreMocks: true` - Restores original implementations after each test
- `clearMocks: true` - Clears mock call history after each test
- `unstubEnvs: true` - Unstubs environment variables after each test
- `unstubGlobals: true` - Unstubs global variables after each test

This means you don't need to manually reset mocks in your tests - they will be automatically cleaned up after each test case.

## Writing Tests

Test files should be placed next to the files they test with the `.test.ts` or `.test.tsx` extension.

Example:
```
lib/
  utils/
    validation.ts
    validation.test.ts  # Test file
```

### Example Test

```typescript
import { describe, it, expect, vi } from 'vitest';
import { myFunction } from './myModule';

describe('myFunction', () => {
  it('should do something', () => {
    const result = myFunction();
    expect(result).toBe('expected value');
  });
});
```

### Using Mocks

```typescript
import { describe, it, expect, vi } from 'vitest';

describe('mock example', () => {
  const mockFn = vi.fn();

  it('first test', () => {
    mockFn.mockReturnValue('value1');
    expect(mockFn()).toBe('value1');
  });

  it('second test - mock is automatically reset', () => {
    // No need to manually reset mockFn
    expect(mockFn).not.toHaveBeenCalled();
  });
});
```

## Testing React Components

The project is configured with `@testing-library/react` for component testing.

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## Path Aliases

The `@/` path alias is configured to resolve to the project root, matching the Next.js configuration:

```typescript
import { myUtil } from '@/lib/utils/myUtil';
```

## Configuration Files

- `vitest.config.ts` - Main Vitest configuration
- `vitest.setup.ts` - Setup file that runs before tests
- `tsconfig.json` - TypeScript configuration with Vitest types
