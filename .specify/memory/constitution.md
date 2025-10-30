<!--
Sync Impact Report:
- Version change: Initial → 1.0.0
- Added principles: Component-First, TypeScript-First, Test-Driven Quality, Database-First, User-Centered Design
- Added sections: Quality Standards, Development Workflow
- Templates requiring updates:
  ✅ Updated plan-template.md references to constitution
  ✅ Updated spec-template.md alignment with quality standards
  ✅ Updated tasks-template.md for principle-driven task types
- Follow-up TODOs: None
-->

# Promptyard Constitution

## Core Principles

### I. Component-First Architecture

Every UI feature MUST be built as reusable components with clear interfaces and boundaries. Components MUST be self-contained, independently testable, and documented through Storybook stories. No feature implementation without component isolation.

**Rationale**: Ensures maintainability, reusability, and consistent user experience across the application while enabling parallel development and comprehensive testing.

### II. TypeScript-First Development

All code MUST be written in TypeScript with strict type checking enabled. No `any` types except for well-documented legacy integrations. Type definitions MUST be complete and accurate for all APIs, database schemas, and component interfaces.

**Rationale**: Prevents runtime errors, improves developer experience, enables better refactoring, and serves as living documentation for the codebase.

### III. Test-Driven Quality (NON-NEGOTIABLE)

Every component MUST have a Storybook file for isolated testing. Every TypeScript module MUST have unit tests using Vitest. Critical user scenarios MUST have Playwright end-to-end tests. Tests are written BEFORE implementation.

**Rationale**: Ensures code quality, prevents regressions, enables confident refactoring, and serves as executable documentation of expected behavior.

### IV. Database-First Design

All data models MUST be defined through Drizzle ORM schemas with proper types and constraints. Database migrations MUST be versioned and reversible. No direct SQL queries outside of the ORM layer except for complex analytics queries.

**Rationale**: Ensures data integrity, type safety between database and application, enables reliable deployments, and maintains consistency across development environments.

### V. User-Centered Design

Every feature MUST solve a real user problem with measurable value. User stories MUST be prioritized (P1, P2, P3) and independently testable. Features MUST support the core goals: storing prompts, organizing collections, sharing/collaboration, and quick search.

**Rationale**: Maintains focus on user value, prevents feature creep, enables incremental delivery, and ensures every development effort contributes to the project's core mission.

## Quality Standards

All code MUST meet these non-negotiable quality requirements:

- **Unit Test Coverage**: Minimum 80% line coverage for TypeScript modules
- **Component Coverage**: 100% of components MUST have Storybook stories
- **Type Safety**: Zero TypeScript errors in production builds
- **Code Style**: ESLint rules MUST pass without warnings
- **Performance**: Page load times under 2 seconds on 3G networks
- **Accessibility**: WCAG 2.1 AA compliance for all user interfaces

## Development Workflow

All development MUST follow this process:

1. **Planning Phase**: Create feature specification with prioritized user stories
2. **Design Phase**: Define component interfaces and data models
3. **Implementation Phase**: Write tests first, then implement features
4. **Review Phase**: Code review MUST verify constitution compliance
5. **Testing Phase**: All automated tests MUST pass before merge
6. **Documentation Phase**: Update relevant documentation and Storybook stories

## Governance

This constitution supersedes all other development practices and guidelines. Amendments require documentation of impact, approval from project maintainers, and migration plan for existing code. All pull requests MUST verify compliance with these principles. Complexity and technical debt MUST be justified with clear business value and remediation plans.

**Version**: 1.0.0 | **Ratified**: 2025-10-30 | **Last Amended**: 2025-10-30
