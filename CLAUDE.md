# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Promptyard is a platform for managing and versioning prompt templates, consisting of:
- **Server** (`server/`): NextJS-based web application with PostgreSQL backend
- **Client** (`client/`): Command-line tool for deploying prompt templates (early stage)

## Common Commands

### Server Development

All server commands run from the `server/` directory:

```bash
cd server
npm run dev          # Start development server with Turbopack
npm run build        # Build for production with Turbopack
npm run start        # Start production server
npm run lint         # Lint code with Biome
npm run format       # Format code with Biome
```

### Database Management

```bash
cd server
npm run db:generate  # Generate migration files from schema changes
npm run db:push      # Push schema changes directly to database
npm run db:migrate   # Run migrations
```

### Environment Setup

1. Start PostgreSQL: `docker compose up -d`
2. Create `.env` file with: `DB_USER`, `DB_PASSWORD`, `DATABASE_URL`
3. Default database URL: `postgres://postgres:postgres@localhost:5432/promptyard`

## Architecture

### Technology Stack

- **Framework**: NextJS 15 with App Router and Turbopack
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Clerk.com via @clerk/nextjs
- **UI**: Shadcn + TailwindCSS
- **Linting**: Biome (replaces ESLint + Prettier)

### Server Structure

```
server/
├── src/
│   ├── app/              # NextJS App Router (pages and API routes)
│   ├── components/       # UI components following atomic design
│   │   ├── atoms/        # Basic building blocks
│   │   ├── molecules/    # Component groups (e.g., input + label)
│   │   ├── organisms/    # Page sections
│   │   ├── templates/    # Full page layouts
│   │   └── ui/           # Shadcn components
│   ├── db/
│   │   ├── schema.ts     # Drizzle database schema
│   │   ├── types.ts      # TypeScript types for tables
│   │   ├── queries.ts    # Complex database operations
│   │   └── index.ts      # Database connection
│   └── lib/              # Shared application logic
├── features/             # Cucumber feature files for acceptance testing
└── public/               # Static assets
```

### Database Schema

Core tables:
- `users` - User accounts (linked via Clerk externalId)
- `repositories` - Collections of prompt templates
- `prompt_templates` - Template metadata
- `prompt_template_versions` - Versioned template content

### Database Patterns

For each table, types are generated in `src/db/types.ts`:
- `Insert{TableName}` - For inserting new records
- `{TableName}` - For selecting existing records

Complex queries go in `src/db/queries.ts` as individual functions (e.g., `insertPromptTemplate`, `updatePromptTemplate`).

## Testing Strategy

- **Component tests**: Storybook + Vitest for unit tests
- **Acceptance tests**: Playwright + Cucumber (feature files in `server/features/`)
- **Philosophy**: Feature files serve as executable specifications

## Documentation

Architecture follows the arc42 template in `docs/architecture/`. When changing code:

1. Update `05-building-block-view.md` for structural changes
2. Update runtime view for new flows
3. Add new terms to the glossary

Key architecture docs:
- `04-solution-strategy.md` - Technology decisions
- `05-building-block-view.md` - Component structure
- `10-quality.md` - Testing and quality measures

## Component Design

Pages follow this hierarchy:
1. **Pages**: Defined in `src/app/` (App Router)
2. **Templates**: Full page layouts in `src/components/templates/`
3. **Organisms**: Page sections (top to bottom)
4. **Molecules**: Component groups (e.g., labeled input)
5. **Atoms**: Individual components (mostly from Shadcn)

Use Shadcn CLI to add new UI components to `src/components/ui/`.
