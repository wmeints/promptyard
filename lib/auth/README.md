# Authorization Module

This module implements relationship-based access control for Promptyard's prompts and collections using an entitlements pattern.

## Overview

The authorization system provides:
- **Role-based access control** for prompts and collections
- **Two role types**: `owner` and `maintainer`
- **Permission inheritance** from collections to prompts
- **Flexible permission checking** for edit and delete operations

## Roles

### Owner
- Can **edit** and **delete** prompts/collections
- Can **grant and revoke** roles to other users
- Automatically assigned to the creator of prompts/collections

### Maintainer
- Can **edit** prompts/collections
- **Cannot delete** prompts/collections
- **Cannot** grant or revoke roles

## Permission Inheritance

When a user has a role on a collection:
- The role **cascades** to all prompts within that collection
- An owner of a collection is effectively an owner of all its prompts
- A maintainer of a collection is effectively a maintainer of all its prompts

## Key Functions

### Permission Checking

```typescript
import { hasPromptPermission, hasCollectionPermission } from '@/lib/auth';

// Check if user can edit a prompt
const canEdit = await hasPromptPermission(userId, promptId, 'edit');

// Check if user can delete a collection
const canDelete = await hasCollectionPermission(userId, collectionId, 'delete');
```

### Validation Functions

```typescript
import { validateEditPrompt, validateDeleteCollection, assertValidation } from '@/lib/auth';

// Validate and get detailed result
const result = await validateEditPrompt(userId, promptId);
if (!result.allowed) {
  console.error(result.reason);
}

// Or throw an error if validation fails
const validation = await validateDeleteCollection(userId, collectionId);
assertValidation(validation); // Throws if not allowed
```

### Adding Prompts to Collections

Only owners of both the prompt AND the collection can add prompts to collections:

```typescript
import { canAddPromptToCollection } from '@/lib/auth';

const canAdd = await canAddPromptToCollection(userId, promptId, collectionId);
if (canAdd) {
  // Add the prompt to the collection
}
```

### Role Management

```typescript
import { grantPromptRole, revokeCollectionRole } from '@/lib/auth';

// Grant maintainer role (must be called by an owner)
const granted = await grantPromptRole(
  targetUserId,
  promptId,
  'maintainer',
  currentUserId
);

// Revoke a collection role (must be called by an owner)
const revoked = await revokeCollectionRole(
  targetUserId,
  collectionId,
  currentUserId
);
```

### Checking Ownership

```typescript
import { isOwnerOfPrompt, isOwnerOfCollection } from '@/lib/auth';

const isPromptOwner = await isOwnerOfPrompt(userId, promptId);
const isCollectionOwner = await isOwnerOfCollection(userId, collectionId);
```

## Database Schema

The authorization system uses these tables:

### `user_prompt_roles`
Links users to prompts with a specific role (owner/maintainer).

### `user_collection_roles`
Links users to collections with a specific role (owner/maintainer).

### `prompt_collections`
Junction table for the many-to-many relationship between prompts and collections.

## Permission Rules Summary

| Role | Edit Prompt | Delete Prompt | Edit Collection | Delete Collection | Add to Collection |
|------|-------------|---------------|-----------------|-------------------|-------------------|
| Owner (Direct) | ✅ | ✅ | ✅ | ✅ | ✅ (if owner of both) |
| Owner (Inherited from Collection) | ✅ | ✅ | N/A | N/A | N/A |
| Maintainer (Direct) | ✅ | ❌ | ✅ | ❌ | ❌ |
| Maintainer (Inherited from Collection) | ✅ | ❌ | N/A | N/A | N/A |
| Creator | ✅ | ✅ | ✅ | ✅ | ✅ (if owner of both) |

## Example Usage Scenarios

### Scenario 1: Editing a Prompt
```typescript
import { validateEditPrompt, assertValidation } from '@/lib/auth';

async function updatePrompt(userId: string, promptId: number, newContent: string) {
  // Validate permission
  const validation = await validateEditPrompt(userId, promptId);
  assertValidation(validation);
  
  // Proceed with update
  // ... database update logic
}
```

### Scenario 2: Deleting a Collection
```typescript
import { validateDeleteCollection } from '@/lib/auth';

async function deleteCollection(userId: string, collectionId: number) {
  const validation = await validateDeleteCollection(userId, collectionId);
  
  if (!validation.allowed) {
    return { error: validation.reason };
  }
  
  // Proceed with deletion
  // ... database deletion logic
  return { success: true };
}
```

### Scenario 3: Adding a Prompt to a Collection
```typescript
import { validateAddPromptToCollection } from '@/lib/auth';
import { db } from '@/lib/db/connection';
import { promptCollections } from '@/lib/db/schema';

async function addPromptToCollection(
  userId: string,
  promptId: number,
  collectionId: number
) {
  const validation = await validateAddPromptToCollection(
    userId,
    promptId,
    collectionId
  );
  
  if (!validation.allowed) {
    throw new Error(validation.reason);
  }
  
  // Add to collection
  await db.insert(promptCollections).values({
    promptId,
    collectionId,
  });
}
```

### Scenario 4: Sharing a Prompt with Team Members
```typescript
import { grantPromptRole } from '@/lib/auth';

async function sharePromptWithTeam(
  ownerId: string,
  promptId: number,
  teamMemberIds: string[]
) {
  // Grant maintainer access to team members
  for (const memberId of teamMemberIds) {
    await grantPromptRole(memberId, promptId, 'maintainer', ownerId);
  }
}
```
