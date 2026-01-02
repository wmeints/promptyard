# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application using the App Router, with authentication via Better Auth and UI components from shadcn/ui.

## Commands

### Development
```bash
npm run dev             # Start development server at localhost:3000
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
```

## Architecture

### Authentication System

- **Better Auth** is used for authentication (`auth.ts`)
  - Session tokens and user management are handled through Better Auth's built-in flows

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
- **Fonts**: Geist Sans and Geist Mono (optimized via `next/font`)
- **TypeScript**: Strict mode enabled
- **Path Aliases**: `@/*` maps to root directory

### File Structure

```
app/                    # Next.js App Router pages and layouts
  layout.tsx           # Root layout with fonts and metadata
  page.tsx             # Home page
  globals.css          # Global styles and Tailwind directives
lib/                    # Shared utilities
  utils.ts             # cn() utility for class merging
auth.ts                # Better Auth configuration
```

### Component Development

- shadcn/ui components should be added via the CLI `npx shadcn add <component-name>`. You can find the configuration in`components.json`
- Use the `cn()` utility from `@/lib/utils` for conditional class merging
- Follow the "new-york" style variant for shadcn components

## Testing

- Only write unit-tests for non-component files recognizable by the `.ts` file extension. You can use the `unit-testing` skill for testing logic.
- Only write component tests for component files recognizable by the `.tsx` file extension. You can use the `component-testing` skill for testing components.