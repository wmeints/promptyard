# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application using the App Router, with authentication via Better Auth, database management via
Drizzle ORM (PostgreSQL), and UI components from shadcn/ui. The runtime is Bun.

## Commands

### Development
```bash
bun dev                 # Start development server at localhost:3000
bun build              # Build for production
bun start              # Start production server
bun lint               # Run ESLint
```

### Database
```bash
bun push-db            # Push database schema changes to PostgreSQL
```

The database connection is configured via the `DATABASE_URI` environment variable. Note: The codebase is designed to
work with Aspire, which automatically configures DATABASE_URI.

## Architecture

### Authentication System

- **Better Auth** is used for authentication (`auth.ts`)
  - Database adapter configured with Drizzle ORM using PostgreSQL
  - Auth schema includes: `user`, `session`, `account`, and `verification` tables
  - All tables include proper relations and indexes
  - Session tokens and user management are handled through Better Auth's built-in flows
- **Social Providers**:
  - GitHub OAuth configured via environment variables
  - Required env vars: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
  - Configured in Aspire via user-secrets for local development

### Database Layer

- **ORM**: Drizzle ORM (`db/index.ts`, `db/schema.ts`)
- **Dialect**: PostgreSQL
- **Schema location**: `db/schema.ts`
- **Migrations output**: `drizzle/` directory
- **Schema includes**:
  - `user` - Primary user table with email verification
  - `session` - User sessions with IP tracking
  - `account` - OAuth and credential accounts
  - `verification` - Email verification tokens
- All tables use cascade deletion for foreign keys
- Timestamps auto-update via `$onUpdate` hooks

### Frontend Architecture

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (New York style)
  - Configured with CSS variables
  - Uses Lucide icons
  - Components stored in `@/components/ui` (aliased path)
- **Forms**: React Hook Form with Zod validation
  - Use Zod schemas for form validation
  - Integrate with React Hook Form for form state management
  - Validation schemas should be defined alongside server actions
- **Fonts**: Geist Sans and Geist Mono (optimized via `next/font`)
- **TypeScript**: Strict mode enabled
- **Path Aliases**: `@/*` maps to root directory

### Server Actions

- **API Pattern**: Server Actions are used instead of REST API endpoints
- Server actions handle all data mutations and queries
- Actions should include proper validation and error handling
- Use `"use server"` directive at the top of action files
- Server actions are the preferred way to interact with the database

### File Structure

```
app/                    # Next.js App Router pages and layouts
  layout.tsx           # Root layout with fonts and metadata
  page.tsx             # Home page
  globals.css          # Global styles and Tailwind directives
db/                     # Database configuration
  schema.ts            # Drizzle schema definitions
  index.ts             # Database instance
lib/                    # Shared utilities
  utils.ts             # cn() utility for class merging
auth.ts                # Better Auth configuration
drizzle.config.ts      # Drizzle Kit configuration
```

### Component Development

- shadcn/ui components should be added via the CLI (configuration in `components.json`)
- Use the `cn()` utility from `@/lib/utils` for conditional class merging
- Follow the "new-york" style variant for shadcn components

### TypeScript Configuration

- Target: ES2017
- Module resolution: bundler
- Strict mode enabled
- Path alias `@/*` configured for imports from root
- JSX runtime: react-jsx (automatic)

## Testing

- Only write unit-tests for non-component files recognizable by the `.ts` file extension. You can use the `unit-testing` skill for testing logic.
- Only write component tests for component files recognizable by the `.tsx` file extension. You can use the `component-testing` skill for testing components.