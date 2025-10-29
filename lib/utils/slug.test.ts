/**
 * Simple test for slug generation utilities
 * Run with: npx tsx lib/utils/slug.test.ts
 */

import { generateSlug, generateUniqueSlug } from './slug';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function testGenerateSlug() {
  console.log('Testing generateSlug...');

  // Test basic slug generation
  assert(
    generateSlug('Hello World') === 'hello-world',
    'Should convert spaces to dashes and lowercase'
  );

  // Test special characters removal
  assert(
    generateSlug('Hello, World!') === 'hello-world',
    'Should remove special characters'
  );

  // Test multiple spaces
  assert(
    generateSlug('Hello    World') === 'hello-world',
    'Should handle multiple spaces'
  );

  // Test leading/trailing spaces and dashes
  assert(
    generateSlug('  Hello World  ') === 'hello-world',
    'Should trim leading/trailing spaces'
  );

  // Test complex title
  assert(
    generateSlug('The Best AI Prompts: 2024 Edition!') === 'the-best-ai-prompts-2024-edition',
    'Should handle complex titles'
  );

  console.log('✓ All generateSlug tests passed');
}

function testGenerateUniqueSlug() {
  console.log('Testing generateUniqueSlug...');

  // Test with no conflicts
  assert(
    generateUniqueSlug('test-slug', []) === 'test-slug',
    'Should return base slug when no conflicts'
  );

  assert(
    generateUniqueSlug('test-slug', ['other-slug']) === 'test-slug',
    'Should return base slug when no matching conflicts'
  );

  // Test with one conflict
  assert(
    generateUniqueSlug('test-slug', ['test-slug']) === 'test-slug-2',
    'Should append -2 when base slug exists'
  );

  // Test with multiple conflicts
  assert(
    generateUniqueSlug('test-slug', ['test-slug', 'test-slug-2']) === 'test-slug-3',
    'Should append -3 when -2 also exists'
  );

  // Test with non-sequential conflicts
  assert(
    generateUniqueSlug('test-slug', ['test-slug', 'test-slug-2', 'test-slug-5']) === 'test-slug-3',
    'Should find first available number'
  );

  // Test with many conflicts
  const manyConflicts = Array.from({ length: 10 }, (_, i) => 
    i === 0 ? 'example-slug' : `example-slug-${i + 1}`
  );
  assert(
    generateUniqueSlug('example-slug', manyConflicts) === 'example-slug-11',
    'Should handle many conflicts'
  );

  console.log('✓ All generateUniqueSlug tests passed');
}

function runTests() {
  try {
    testGenerateSlug();
    testGenerateUniqueSlug();
    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

runTests();
