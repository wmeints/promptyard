/**
 * Authorization module exports
 * Central export point for all authorization and entitlement functions
 */

// Export all entitlement functions
export {
  hasPromptPermission,
  hasCollectionPermission,
  canAddPromptToCollection,
  isOwnerOfPrompt,
  isOwnerOfCollection,
  grantPromptRole,
  grantCollectionRole,
  revokePromptRole,
  revokeCollectionRole,
  type Permission,
  type Role,
} from './entitlements';

// Export all validation functions
export {
  validateEditPrompt,
  validateDeletePrompt,
  validateEditCollection,
  validateDeleteCollection,
  validateAddPromptToCollection,
  assertValidation,
  type ValidationResult,
} from './validation';
