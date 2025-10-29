/**
 * Integration test for prompt API
 * This script tests the prompt submission and retrieval endpoints
 * Run with: DATABASE_URL=postgresql://promptyard:promptyard@localhost:5432/promptyard npx tsx test/integration/prompt-api.test.ts
 */

import { db } from '../../lib/db/connection';
import { prompts, user, account } from '../../lib/db/schema';
import { eq } from 'drizzle-orm';
import { generateSlug, generateUniqueSlug } from '../../lib/utils/slug';

async function cleanupTestData() {
  console.log('Cleaning up test data...');
  await db.delete(prompts);
  await db.delete(account);
  await db.delete(user);
  console.log('✓ Test data cleaned up');
}

async function createTestUser(id = 'test-user-id', email = 'test@example.com', name = 'Test User') {
  console.log('\nCreating test user...');
  const [testUser] = await db
    .insert(user)
    .values({
      id,
      name,
      email,
      emailVerified: true,
    })
    .returning();
  console.log('✓ Test user created:', testUser.email);
  return testUser;
}

async function fetchAllExistingSlugs(): Promise<string[]> {
  const existingPrompts = await db
    .select({ slug: prompts.slug })
    .from(prompts);
  return existingPrompts.map(p => p.slug);
}

async function testSlugUniqueness() {
  console.log('\n=== Testing slug uniqueness ===');
  
  const testUser = await createTestUser();
  
  // Create first prompt with title "Example Prompt"
  const baseSlug = generateSlug('Example Prompt');
  console.log(`Base slug: "${baseSlug}"`);
  
  const [prompt1] = await db
    .insert(prompts)
    .values({
      title: 'Example Prompt',
      content: 'This is an example prompt',
      slug: baseSlug,
      tags: ['test', 'example'],
      userId: testUser.id,
    })
    .returning();
  console.log(`✓ Created first prompt with slug: "${prompt1.slug}"`);
  
  // Create second prompt with same title
  const existingSlugs = await fetchAllExistingSlugs();
  const uniqueSlug = generateUniqueSlug(baseSlug, existingSlugs);
  
  const [prompt2] = await db
    .insert(prompts)
    .values({
      title: 'Example Prompt',
      content: 'This is another example prompt',
      slug: uniqueSlug,
      tags: ['test'],
      userId: testUser.id,
    })
    .returning();
  console.log(`✓ Created second prompt with slug: "${prompt2.slug}"`);
  
  // Create third prompt with same title
  const existingSlugs2 = await fetchAllExistingSlugs();
  const uniqueSlug2 = generateUniqueSlug(baseSlug, existingSlugs2);
  
  const [prompt3] = await db
    .insert(prompts)
    .values({
      title: 'Example Prompt',
      content: 'This is yet another example prompt',
      slug: uniqueSlug2,
      tags: [],
      userId: testUser.id,
    })
    .returning();
  console.log(`✓ Created third prompt with slug: "${prompt3.slug}"`);
  
  // Verify all slugs are unique
  const allPrompts = await db.select().from(prompts);
  const slugs = allPrompts.map(p => p.slug);
  const uniqueSlugs = new Set(slugs);
  
  if (slugs.length === uniqueSlugs.size) {
    console.log('✓ All slugs are unique');
  } else {
    throw new Error('Duplicate slugs found!');
  }
  
  // Verify slugs are numbered correctly
  if (prompt1.slug === 'example-prompt' &&
      prompt2.slug === 'example-prompt-2' &&
      prompt3.slug === 'example-prompt-3') {
    console.log('✓ Slug numbering is correct');
  } else {
    throw new Error('Slug numbering is incorrect');
  }
  
  await cleanupTestData();
}

async function testPromptRetrieval() {
  console.log('\n=== Testing prompt retrieval ===');
  
  const testUser = await createTestUser();
  
  // Create a prompt
  const [prompt] = await db
    .insert(prompts)
    .values({
      title: 'My Awesome Prompt',
      content: 'Write a story about...',
      slug: 'my-awesome-prompt',
      tags: ['creative', 'writing'],
      userId: testUser.id,
    })
    .returning();
  console.log(`✓ Created prompt: "${prompt.title}"`);
  
  // Retrieve by slug
  const [retrieved] = await db
    .select()
    .from(prompts)
    .where(eq(prompts.slug, 'my-awesome-prompt'));
  
  if (retrieved && retrieved.id === prompt.id) {
    console.log('✓ Successfully retrieved prompt by slug');
  } else {
    throw new Error('Failed to retrieve prompt by slug');
  }
  
  // Verify tags
  if (JSON.stringify(retrieved.tags) === JSON.stringify(['creative', 'writing'])) {
    console.log('✓ Tags are stored and retrieved correctly');
  } else {
    throw new Error('Tags are incorrect');
  }
  
  await cleanupTestData();
}

async function testUserPrompts() {
  console.log('\n=== Testing user-specific prompts ===');
  
  const testUser1 = await createTestUser();
  const testUser2 = await createTestUser('test-user-id-2', 'test2@example.com', 'Test User 2');
  
  // Create prompts for user 1
  await db.insert(prompts).values([
    {
      title: 'User 1 Prompt 1',
      content: 'Content 1',
      slug: 'user-1-prompt-1',
      tags: [],
      userId: testUser1.id,
    },
    {
      title: 'User 1 Prompt 2',
      content: 'Content 2',
      slug: 'user-1-prompt-2',
      tags: [],
      userId: testUser1.id,
    },
  ]);
  
  // Create prompts for user 2
  await db.insert(prompts).values([
    {
      title: 'User 2 Prompt 1',
      content: 'Content 1',
      slug: 'user-2-prompt-1',
      tags: [],
      userId: testUser2.id,
    },
  ]);
  
  console.log('✓ Created prompts for multiple users');
  
  // Get prompts for user 1
  const user1Prompts = await db
    .select()
    .from(prompts)
    .where(eq(prompts.userId, testUser1.id));
  
  if (user1Prompts.length === 2) {
    console.log('✓ User 1 has 2 prompts');
  } else {
    throw new Error(`Expected 2 prompts for user 1, got ${user1Prompts.length}`);
  }
  
  // Get prompts for user 2
  const user2Prompts = await db
    .select()
    .from(prompts)
    .where(eq(prompts.userId, testUser2.id));
  
  if (user2Prompts.length === 1) {
    console.log('✓ User 2 has 1 prompt');
  } else {
    throw new Error(`Expected 1 prompt for user 2, got ${user2Prompts.length}`);
  }
  
  await cleanupTestData();
}

async function runIntegrationTests() {
  try {
    console.log('Starting integration tests...\n');
    
    await testSlugUniqueness();
    await testPromptRetrieval();
    await testUserPrompts();
    
    console.log('\n✅ All integration tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    await cleanupTestData();
    process.exit(1);
  }
}

runIntegrationTests();
