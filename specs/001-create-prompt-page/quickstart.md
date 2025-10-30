# Quickstart: Create Prompt Page Implementation

**Generated**: 2025-10-30  
**For Feature**: 001-create-prompt-page

## Implementation Checklist

### Phase 1: Database Setup
- [ ] Update Drizzle schema files for prompts, tags, and junction table
- [ ] Generate and run database migrations
- [ ] Add indexes for performance optimization
- [ ] Test schema with sample data

### Phase 2: API Development
- [ ] Create POST /api/prompts endpoint
- [ ] Create GET /api/tags/search endpoint
- [ ] Implement slug generation utility
- [ ] Add input validation and error handling
- [ ] Write API unit tests

### Phase 3: Component Development
- [ ] Create TagInput component with autocomplete
- [ ] Create PromptForm component with react-hook-form
- [ ] Add form validation and error display
- [ ] Implement loading states and submit handling
- [ ] Write Storybook stories for all components

### Phase 4: Page Implementation
- [ ] Create /prompts/new page component
- [ ] Integrate authentication check
- [ ] Add form submission and redirect logic
- [ ] Implement proper error boundaries
- [ ] Add page-level loading states

### Phase 5: Testing & Polish
- [ ] Write unit tests for all components
- [ ] Add Playwright E2E tests for critical flows
- [ ] Test accessibility compliance
- [ ] Optimize performance and bundle size
- [ ] Add proper TypeScript types throughout

## Quick Commands

### Database
```bash
# Generate migration
npm run db:generate

# Apply migration
npm run db:migrate

# Open database studio
npm run db:studio
```

### Development
```bash
# Start development server
npm run dev

# Run tests
npm test

# Run Storybook
npm run storybook

# Type checking
npx tsc --noEmit
```

### Testing
```bash
# Unit tests
npm test

# E2E tests (after implementing)
npx playwright test

# Test coverage
npm run test:coverage
```

## Key Files to Create/Modify

### Database Schema
- `lib/db/schema/prompts.ts` - Update existing prompts table
- `lib/db/schema/tags.ts` - New tags and junction tables
- `lib/db/schema/index.ts` - Export new schemas

### API Routes
- `app/api/prompts/route.ts` - Create prompt endpoint
- `app/api/tags/search/route.ts` - Tag search endpoint

### Components
- `components/prompts/PromptForm.tsx` - Main form component
- `components/prompts/TagInput.tsx` - Tag input with autocomplete
- `components/prompts/PromptForm.stories.tsx` - Storybook stories

### Pages
- `app/prompts/new/page.tsx` - Create prompt page

### Utilities
- `lib/utils/slug.ts` - Slug generation utilities
- `lib/utils/validation.ts` - Form validation schemas

### Types
- `lib/types/prompt.ts` - TypeScript type definitions

## Success Criteria Verification

After implementation, verify these requirements:
- [ ] Users can complete prompt creation in under 90 seconds
- [ ] 95% of form submissions with valid data succeed on first attempt
- [ ] Users can add up to 10 tags per prompt without performance issues
- [ ] Form validation feedback appears within 500ms
- [ ] 90% of users successfully create their first prompt without errors
- [ ] All components have Storybook stories
- [ ] Unit test coverage is above 80%
- [ ] E2E tests cover critical user flows