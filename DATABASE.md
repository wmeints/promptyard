# Database Configuration

This project uses [Drizzle ORM](https://orm.drizzle.team/) with PostgreSQL for database management.

## Prerequisites

- PostgreSQL database (local installation or cloud service)
- Node.js and npm installed

## Setup

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Configure your database URL:**
   Edit `.env` and set your PostgreSQL connection string:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/promptyard
   ```

3. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

## Database Schema

Database schemas are defined in `lib/db/schema/`. Each table is defined in its own file and exported from `lib/db/schema/index.ts`.

### Example Schema Definition

```typescript
import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const prompts = pgTable('prompts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

## Database Commands

The following npm scripts are available for database operations:

- **`npm run db:generate`** - Generate migration files from schema changes
- **`npm run db:migrate`** - Run pending migrations
- **`npm run db:push`** - Push schema changes directly to the database (development)
- **`npm run db:studio`** - Open Drizzle Studio to browse and edit your database

## Development Workflow

### 1. Push Schema Changes (Development)

For rapid development, you can push schema changes directly to your database:

```bash
npm run db:push
```

This is useful during development but not recommended for production.

### 2. Generate and Run Migrations (Production)

For production environments, generate and commit migration files:

```bash
# After modifying schema files
npm run db:generate

# Review the generated migration in ./drizzle directory
# Then run the migration
npm run db:migrate
```

## Using the Database Connection

Import the database instance in your code:

```typescript
import { db } from '@/lib/db/connection';
import { prompts } from '@/lib/db/schema';

// Example: Insert a prompt
await db.insert(prompts).values({
  title: 'My Prompt',
  content: 'This is a sample prompt',
});

// Example: Query prompts
const allPrompts = await db.select().from(prompts);
```

## Configuration

Database configuration is managed through environment variables:

- `DATABASE_URL` (required) - PostgreSQL connection string
- `DB_MAX_CONNECTIONS` (optional) - Maximum pool connections (default: 20)
- `DB_CONNECTION_TIMEOUT` (optional) - Connection timeout in ms (default: 30000)
- `DB_IDLE_TIMEOUT` (optional) - Idle timeout in ms (default: 10000)

## References

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Drizzle ORM PostgreSQL Guide](https://orm.drizzle.team/docs/get-started/postgresql-new)
- [Drizzle Kit Documentation](https://orm.drizzle.team/kit-docs/overview)
