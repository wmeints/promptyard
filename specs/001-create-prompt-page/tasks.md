# Tasks: Create Prompt Page

**Input**: Design documents from `/specs/001-create-prompt-page/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are included based on the constitutional requirement for Test-Driven Quality (Storybook, Vitest, Playwright).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Install React Hook Form dependency: `npm install react-hook-form @hookform/resolvers`
- [ ] T002 Install required shadcn UI components: `npx shadcn-ui@latest add form input textarea button badge`
- [ ] T003 [P] Install slug generation utility: `npm install slugify`
- [ ] T004 [P] Install Playwright for E2E testing: `npm install --save-dev @playwright/test`
- [ ] T005 [P] Configure Playwright in `playwright.config.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Update prompts schema in `lib/db/schema/prompts.ts` to add slug and userId fields
- [ ] T007 [P] Create tags schema in `lib/db/schema/tags.ts` with tags and prompt_tags tables
- [ ] T008 [P] Export new schemas in `lib/db/schema/index.ts`
- [ ] T009 Generate and run database migration: `npm run db:generate && npm run db:migrate`
- [ ] T010 [P] Create TypeScript types in `lib/types/prompt.ts` for Prompt, Tag, and form interfaces
- [ ] T011 [P] Create slug utility functions in `lib/utils/slug.ts`
- [ ] T012 [P] Create form validation schemas in `lib/utils/validation.ts` using Zod

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create Basic Prompt (Priority: P1) 🎯 MVP

**Goal**: Users can create prompts with title and content, get auto-generated slug, and save to database

**Independent Test**: Navigate to `/prompts/new`, fill title and content, submit form, verify prompt is created and user is redirected

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T013 [P] [US1] Create Storybook story for PromptForm in `components/prompts/PromptForm.stories.tsx`
- [ ] T014 [P] [US1] Unit tests for slug utilities in `lib/utils/slug.test.ts`
- [ ] T015 [P] [US1] Unit tests for validation schemas in `lib/utils/validation.test.ts`
- [ ] T016 [P] [US1] Playwright E2E test for basic prompt creation in `tests/e2e/create-prompt.spec.ts`

### Implementation for User Story 1

- [ ] T017 [P] [US1] Create PromptForm component in `components/prompts/PromptForm.tsx` with title and content fields
- [ ] T018 [US1] Create POST /api/prompts endpoint in `app/api/prompts/route.ts` with basic validation
- [ ] T019 [US1] Create `/prompts/new` page in `app/prompts/new/page.tsx` integrating PromptForm
- [ ] T020 [US1] Implement authentication check and redirect logic in the page component
- [ ] T021 [US1] Add error handling and loading states to form submission
- [ ] T022 [US1] Update Storybook story with real implementation and interaction testing

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Add Tags to Prompt (Priority: P2)

**Goal**: Users can add multiple tags to prompts using autocomplete, tags are normalized and saved

**Independent Test**: Create prompt with tags, verify tags appear as chips, submit form, verify tags are saved and searchable

### Tests for User Story 2

- [ ] T023 [P] [US2] Create Storybook story for TagInput in `components/prompts/TagInput.stories.tsx`
- [ ] T024 [P] [US2] Unit tests for tag normalization in existing validation test file
- [ ] T025 [P] [US2] Playwright E2E test for tag functionality in `tests/e2e/create-prompt-with-tags.spec.ts`

### Implementation for User Story 2

- [ ] T026 [P] [US2] Create TagInput component in `components/prompts/TagInput.tsx` with autocomplete
- [ ] T027 [P] [US2] Create GET /api/tags/search endpoint in `app/api/tags/search/route.ts`
- [ ] T028 [US2] Update PromptForm component to include TagInput with proper react-hook-form integration
- [ ] T029 [US2] Update POST /api/prompts endpoint to handle tag creation and association
- [ ] T030 [US2] Add tag management logic (normalization, deduplication) to the API endpoint
- [ ] T031 [US2] Update Storybook stories with tag interaction examples

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Form Validation and Error Handling (Priority: P3)

**Goal**: Users receive comprehensive validation feedback and error handling throughout the form experience

**Independent Test**: Submit invalid data, trigger network errors, verify proper error messages and recovery options

### Tests for User Story 3

- [ ] T032 [P] [US3] Playwright E2E test for validation scenarios in `tests/e2e/form-validation.spec.ts`
- [ ] T033 [P] [US3] Unit tests for error handling in `components/prompts/PromptForm.test.tsx`

### Implementation for User Story 3

- [ ] T034 [P] [US3] Enhance form validation with character limits and real-time feedback in PromptForm
- [ ] T035 [P] [US3] Add comprehensive error handling to API endpoints with proper HTTP status codes
- [ ] T036 [US3] Implement retry logic and error recovery in form submission
- [ ] T037 [US3] Add loading spinner and form disable during submission
- [ ] T038 [US3] Enhance error display with user-friendly messages and field-specific errors
- [ ] T039 [US3] Update Storybook stories to demonstrate error states and validation

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T040 [P] Add accessibility testing and WCAG 2.1 AA compliance verification
- [ ] T041 [P] Performance optimization: lazy loading and bundle size optimization
- [ ] T042 [P] Add comprehensive TypeScript strict mode compliance check
- [ ] T043 [P] Code cleanup and consistent error handling across all components
- [ ] T044 [P] Update documentation and quickstart validation
- [ ] T045 [P] Add monitoring and logging for production readiness

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on US1 PromptForm but maintains independent testing
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Enhances US1 and US2 but maintains independent validation testing

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Storybook stories before components
- API utilities before endpoints
- Components before page integration
- Core implementation before enhancement features

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, multiple user stories can be developed in parallel
- All tests for a user story marked [P] can run in parallel
- Different components within a story marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Create Storybook story for PromptForm in components/prompts/PromptForm.stories.tsx"
Task: "Unit tests for slug utilities in lib/utils/slug.test.ts"
Task: "Unit tests for validation schemas in lib/utils/validation.test.ts"

# Launch all components for User Story 1 together:
Task: "Create PromptForm component in components/prompts/PromptForm.tsx"
Task: "Create POST /api/prompts endpoint in app/api/prompts/route.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (install dependencies)
2. Complete Phase 2: Foundational (database schema, types, utilities) - CRITICAL
3. Complete Phase 3: User Story 1 (basic prompt creation)
4. **STOP and VALIDATE**: Test User Story 1 independently via E2E test
5. Deploy/demo if ready - users can create and save prompts

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP: basic prompt creation!)
3. Add User Story 2 → Test independently → Deploy/Demo (enhanced: with tags and organization)
4. Add User Story 3 → Test independently → Deploy/Demo (polished: comprehensive validation)
5. Each story adds value without breaking previous functionality

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (core functionality)
   - Developer B: User Story 2 (tag system)
   - Developer C: User Story 3 (validation enhancement)
3. Stories integrate smoothly as they build on the shared foundation

---

## Success Criteria Verification

After each user story completion, verify:

- **US1**: Users can complete basic prompt creation in under 90 seconds
- **US2**: Users can add up to 10 tags without performance issues
- **US3**: Form validation feedback appears within 500ms
- **Overall**: 95% of form submissions with valid data succeed, 90% of users create first prompt successfully

## Notes

- [P] tasks target different files with no dependencies
- [Story] label maps each task to specific user story for traceability
- Each user story should be independently completable and testable
- Write and verify tests fail before implementing features
- Commit after each task or logical group for clear progress tracking
- Stop at any checkpoint to validate story works independently
- Constitution compliance: Component-first architecture, TypeScript-first, Test-driven quality enforced throughout