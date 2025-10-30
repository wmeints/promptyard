# Data Model: Create Prompt Page

**Generated**: 2025-10-30  
**For Feature**: 001-create-prompt-page

## Entities

### Prompt
Represents a user-created prompt with title, content, slug, and associated tags.

**Fields**:
- `id`: serial, primary key
- `title`: text, required, max 200 characters
- `slug`: text, required, unique, URL-friendly
- `content`: text, required, unlimited length
- `userId`: foreign key to users table (from auth schema)
- `createdAt`: timestamp, default now
- `updatedAt`: timestamp, default now

**Validation Rules**:
- Title must be non-empty and ≤200 characters
- Content must be non-empty
- Slug must be unique across all prompts
- Slug generated from title using slugify algorithm

**Relationships**:
- Belongs to User (via userId)
- Has many Tags through PromptTags (many-to-many)

### Tag
Represents a categorical label that can be associated with prompts.

**Fields**:
- `id`: serial, primary key
- `name`: text, required, unique, lowercase normalized
- `createdAt`: timestamp, default now

**Validation Rules**:
- Name must be non-empty
- Name automatically converted to lowercase
- Name must be unique (case-insensitive)

**Relationships**:
- Has many Prompts through PromptTags (many-to-many)

### PromptTag (Junction Table)
Links prompts to their associated tags.

**Fields**:
- `promptId`: foreign key to prompts table
- `tagId`: foreign key to tags table
- `createdAt`: timestamp, default now

**Constraints**:
- Composite primary key (promptId, tagId)
- Foreign key constraints on both fields

## State Transitions

### Prompt Creation Flow
1. **Draft**: User fills form (client-side only)
2. **Validating**: Form validation occurs (client-side)
3. **Submitting**: Form submitted to server
4. **Processing**: Server validates, generates slug, saves to database
5. **Created**: Prompt successfully saved, user redirected

### Tag Management Flow
1. **Input**: User types tag name
2. **Normalize**: Convert to lowercase
3. **Check Existing**: Query database for existing tag
4. **Create/Reuse**: Create new tag or reuse existing
5. **Associate**: Link tag to prompt via PromptTag

## Database Schema Updates

### New Tables (Drizzle ORM)

```typescript
// Update to lib/db/schema/prompts.ts
export const prompts = pgTable('prompts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(),
  userId: text('user_id').notNull(), // Better Auth user ID
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// New file: lib/db/schema/tags.ts
export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const promptTags = pgTable('prompt_tags', {
  promptId: integer('prompt_id').notNull().references(() => prompts.id, { onDelete: 'cascade' }),
  tagId: integer('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.promptId, table.tagId] }),
}));
```

### Migration Requirements
1. Add new tables: tags, prompt_tags
2. Update prompts table: add slug column, add userId column
3. Add unique constraint on slug
4. Add foreign key constraints for prompt_tags
5. Create indexes on frequently queried columns (slug, userId, tag names)