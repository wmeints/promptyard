# Feature Specification: Create Prompt Page

**Feature Branch**: `001-create-prompt-page`  
**Created**: October 30, 2025  
**Status**: Draft  
**Input**: User description: "Add a new page /prompts/new that allows me to create a new prompt in the application. A prompt should have a title, content and a set of tags. The application should use-react-hook-form for the form implementation and use shadcn components for the GUI."

## Clarifications

### Session 2025-10-30

- Q: URL slug generation for prompt accessibility → A: Generate unique slug from title, append incrementing number if duplicate exists (e.g., test-slug-2)
- Q: Content field constraints → A: No length limits (unlimited content size)
- Q: Tag management behavior → A: Case-insensitive normalization (convert all to lowercase)
- Q: Form submission loading state → A: Loading spinner with disabled form during submission
- Q: Title field constraints → A: Reasonable limit (e.g., 200 characters maximum)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create Basic Prompt (Priority: P1)

A user wants to create a new prompt with essential information to save and reuse later.

**Why this priority**: This is the core functionality that delivers immediate value - enabling users to store their prompts for reuse, which is the primary purpose of the application.

**Independent Test**: Can be fully tested by navigating to `/prompts/new`, filling in title and content fields, and successfully creating a prompt that persists in the system.

**Acceptance Scenarios**:

1. **Given** a logged-in user is on the homepage, **When** they navigate to `/prompts/new`, **Then** they see a form with title and content fields
2. **Given** a user is on the create prompt page, **When** they enter a valid title and content and submit the form, **Then** the prompt is created and they receive confirmation
3. **Given** a user is on the create prompt page, **When** they try to submit without required fields, **Then** they see clear validation messages

---

### User Story 2 - Add Tags to Prompt (Priority: P2)

A user wants to categorize their prompt with tags to make it easier to find and organize later.

**Why this priority**: Tags enable organization and discovery, significantly improving the user experience for managing multiple prompts, but the core value exists without tags.

**Independent Test**: Can be tested by creating a prompt with multiple tags, verifying tags are saved, and confirming they display correctly when viewing the prompt.

**Acceptance Scenarios**:

1. **Given** a user is creating a prompt, **When** they add tags using the tag input field, **Then** tags appear as visual chips/badges
2. **Given** a user has entered tags, **When** they submit the form, **Then** all tags are saved with the prompt
3. **Given** a user is entering tags, **When** they press Enter or comma after typing a tag, **Then** the tag is added to the list

---

### User Story 3 - Form Validation and Error Handling (Priority: P3)

A user receives clear feedback when form inputs are invalid or when submission fails.

**Why this priority**: Enhanced user experience through better error handling, but basic validation in P1 covers essential functionality.

**Independent Test**: Can be tested by submitting invalid data, causing network errors, and verifying appropriate error messages appear.

**Acceptance Scenarios**:

1. **Given** a user submits a form with title exceeding character limits, **When** they submit, **Then** they see a specific validation error
2. **Given** a network error occurs during submission, **When** the error happens, **Then** the user sees a retry option with clear error message
3. **Given** a user has validation errors, **When** they correct the errors, **Then** error messages disappear in real-time

---

### Edge Cases

- What happens when a user tries to create a prompt with extremely long content?
- How does the system handle duplicate tag entries?
- What occurs if a user navigates away from the form with unsaved changes?
- How does the form behave when the user's session expires during creation?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a form at `/prompts/new` with fields for title, content, and tags
- **FR-002**: System MUST validate that title is required and not empty
- **FR-003**: System MUST validate that title does not exceed 200 characters
- **FR-004**: System MUST validate that content is required and not empty
- **FR-005**: System MUST support unlimited content length without arbitrary restrictions
- **FR-006**: System MUST allow users to add multiple tags to a prompt
- **FR-007**: System MUST save the prompt with title, content, tags, and auto-generated unique slug to the database
- **FR-008**: System MUST generate a URL-friendly slug from the prompt title automatically
- **FR-009**: System MUST ensure slug uniqueness by appending incrementing numbers when duplicates exist (e.g., test-slug-2)
- **FR-010**: System MUST redirect users to the newly created prompt's detail page after successful creation
- **FR-011**: System MUST display validation errors for required fields in real-time
- **FR-012**: System MUST show loading spinner and disable form during submission to prevent double submissions
- **FR-013**: System MUST prevent duplicate tags on the same prompt
- **FR-014**: System MUST normalize all tags to lowercase to prevent case-sensitive duplicates
- **FR-015**: System MUST handle tag input through inline tag chips with autocomplete functionality showing existing tags as users type
- **FR-016**: System MUST restrict access to authenticated users only

### Key Entities *(include if feature involves data)*

- **Prompt**: Represents a user-created prompt with title (required text), content (required text), auto-generated unique slug for URL access, creation timestamp, and associated tags
- **Tag**: Represents a categorical label that can be associated with prompts, with tag name and optional metadata
- **User**: The authenticated user creating the prompt, linking prompts to their account

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete prompt creation in under 90 seconds for basic prompts (title + content only)
- **SC-002**: 95% of form submissions with valid data succeed on first attempt
- **SC-003**: Users can add up to 10 tags per prompt without performance degradation
- **SC-004**: Form validation feedback appears within 500ms of user input
- **SC-005**: 90% of users successfully create their first prompt without assistance or errors

## Assumptions

- Authentication system is already implemented and functional
- Database schema for prompts exists and supports the required fields
- Users are familiar with standard web form interactions
- Tags will be stored as simple text labels without hierarchical structure
- Form will use standard web accessibility practices
- No advanced features like prompt templates or rich text editing are required initially
