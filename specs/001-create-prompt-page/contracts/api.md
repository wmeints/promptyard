# API Contracts: Create Prompt Page

**Generated**: 2025-10-30  
**For Feature**: 001-create-prompt-page

## REST API Endpoints

### POST /api/prompts
Create a new prompt with title, content, and tags.

**Request Body**:
```typescript
interface CreatePromptRequest {
  title: string;        // Required, max 200 chars
  content: string;      // Required, unlimited length
  tags: string[];       // Optional array of tag names
}
```

**Response** (201 Created):
```typescript
interface CreatePromptResponse {
  id: number;
  title: string;
  slug: string;         // Auto-generated unique slug
  content: string;
  tags: Tag[];
  userId: string;
  createdAt: string;    // ISO date string
  updatedAt: string;    // ISO date string
}
```

**Error Responses**:
- 400 Bad Request: Validation errors
- 401 Unauthorized: User not authenticated
- 500 Internal Server Error: Server error

### GET /api/tags/search
Search existing tags for autocomplete functionality.

**Query Parameters**:
- `q`: string (search query, min 1 character)
- `limit`: number (optional, default 10, max 50)

**Response** (200 OK):
```typescript
interface TagSearchResponse {
  tags: Tag[];
}
```

## Type Definitions

### Core Types
```typescript
interface Tag {
  id: number;
  name: string;         // Lowercase normalized
  createdAt: string;    // ISO date string
}

interface Prompt {
  id: number;
  title: string;
  slug: string;
  content: string;
  userId: string;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}
```

### Form Types
```typescript
interface CreatePromptFormData {
  title: string;
  content: string;
  tags: string[];       // Array of tag names as strings
}

interface FormErrors {
  title?: string;
  content?: string;
  tags?: string;
  general?: string;     // For server errors
}
```

### API Error Types
```typescript
interface APIError {
  message: string;
  field?: string;       // Which field caused the error (for validation)
  code?: string;        // Error code for programmatic handling
}

interface APIErrorResponse {
  error: APIError;
  errors?: APIError[];  // Multiple validation errors
}
```

## Validation Rules

### Client-Side Validation
- Title: Required, max 200 characters
- Content: Required, min 1 character
- Tags: Optional, each tag max 50 characters, max 10 tags per prompt

### Server-Side Validation
- All client-side validations
- Slug uniqueness enforcement
- Tag name normalization (lowercase)
- User authentication verification
- Rate limiting protection