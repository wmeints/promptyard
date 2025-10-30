# Implementation Plan: Create Prompt Page

**Branch**: `001-create-prompt-page` | **Date**: 2025-10-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-create-prompt-page/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Primary requirement: Add a new page `/prompts/new` allowing users to create prompts with title, content, and tags. Technical approach: NextJS page with React Hook Form validation, shadcn UI components, Drizzle ORM for database persistence, and auto-generated unique slug for URL accessibility at `/prompts/{slug}`.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 16.0.1 and React 19.2.0  
**Primary Dependencies**: Next.js, React Hook Form, shadcn UI components, Drizzle ORM, Better Auth  
**Storage**: PostgreSQL with Drizzle ORM  
**Testing**: Vitest for unit tests, Storybook for component testing, Playwright for E2E testing  
**Target Platform**: Web application (responsive design)
**Project Type**: Web application with server-side rendering  
**Performance Goals**: <2s page load on 3G, <500ms form validation feedback  
**Constraints**: WCAG 2.1 AA compliance, TypeScript strict mode, 80% test coverage  
**Scale/Scope**: Single-page feature with form validation and database integration

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Component-First Architecture**: ✅ PromptForm and TagInput components designed with clear interfaces  
**TypeScript-First Development**: ✅ All types defined in contracts/api.md with strict typing  
**Test-Driven Quality**: ✅ Storybook stories, Vitest unit tests, and Playwright E2E tests planned  
**Database-First Design**: ✅ Drizzle ORM schemas defined in data-model.md with proper constraints  
**User-Centered Design**: ✅ Prioritized user stories with measurable success criteria defined

*All constitutional requirements satisfied. Ready for implementation.*

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── prompts/
│   └── new/
│       └── page.tsx          # Create prompt page
├── api/
│   ├── prompts/
│   │   └── route.ts          # POST /api/prompts
│   └── tags/
│       └── search/
│           └── route.ts      # GET /api/tags/search
└── globals.css

components/
├── prompts/
│   ├── PromptForm.tsx        # Main form component
│   ├── PromptForm.stories.tsx # Storybook stories
│   ├── TagInput.tsx          # Tag input with autocomplete
│   └── TagInput.stories.tsx  # Storybook stories
└── ui/                       # shadcn components

lib/
├── db/
│   └── schema/
│       ├── prompts.ts        # Updated prompts table
│       ├── tags.ts          # New tags & junction tables
│       └── index.ts         # Schema exports
├── utils/
│   ├── slug.ts              # Slug generation utilities
│   └── validation.ts        # Form validation schemas
└── types/
    └── prompt.ts            # TypeScript definitions

tests/
├── components/              # Vitest component tests
├── utils/                   # Utility function tests
└── e2e/                     # Playwright E2E tests
```

**Structure Decision**: Web application using Next.js App Router. Components and pages organized under existing structure with new prompt creation components and API routes.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
