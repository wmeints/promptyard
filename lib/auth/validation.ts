/**
 * Validation functions for prompt and collection operations
 * These functions enforce authorization rules before operations are performed
 */

import {
  hasPromptPermission,
  hasCollectionPermission,
  canAddPromptToCollection,
} from './entitlements';

/**
 * Validation result interface
 */
export interface ValidationResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Validate that a user can edit a prompt
 * 
 * @param userId - The ID of the user
 * @param promptId - The ID of the prompt
 * @returns Promise<ValidationResult> - Validation result with reason if denied
 */
export async function validateEditPrompt(
  userId: string,
  promptId: number
): Promise<ValidationResult> {
  const allowed = await hasPromptPermission(userId, promptId, 'edit');
  
  if (!allowed) {
    return {
      allowed: false,
      reason: 'User does not have permission to edit this prompt. Must be owner or maintainer.',
    };
  }

  return { allowed: true };
}

/**
 * Validate that a user can delete a prompt
 * 
 * @param userId - The ID of the user
 * @param promptId - The ID of the prompt
 * @returns Promise<ValidationResult> - Validation result with reason if denied
 */
export async function validateDeletePrompt(
  userId: string,
  promptId: number
): Promise<ValidationResult> {
  const allowed = await hasPromptPermission(userId, promptId, 'delete');
  
  if (!allowed) {
    return {
      allowed: false,
      reason: 'User does not have permission to delete this prompt. Must be owner.',
    };
  }

  return { allowed: true };
}

/**
 * Validate that a user can edit a collection
 * 
 * @param userId - The ID of the user
 * @param collectionId - The ID of the collection
 * @returns Promise<ValidationResult> - Validation result with reason if denied
 */
export async function validateEditCollection(
  userId: string,
  collectionId: number
): Promise<ValidationResult> {
  const allowed = await hasCollectionPermission(userId, collectionId, 'edit');
  
  if (!allowed) {
    return {
      allowed: false,
      reason: 'User does not have permission to edit this collection. Must be owner or maintainer.',
    };
  }

  return { allowed: true };
}

/**
 * Validate that a user can delete a collection
 * 
 * @param userId - The ID of the user
 * @param collectionId - The ID of the collection
 * @returns Promise<ValidationResult> - Validation result with reason if denied
 */
export async function validateDeleteCollection(
  userId: string,
  collectionId: number
): Promise<ValidationResult> {
  const allowed = await hasCollectionPermission(userId, collectionId, 'delete');
  
  if (!allowed) {
    return {
      allowed: false,
      reason: 'User does not have permission to delete this collection. Must be owner.',
    };
  }

  return { allowed: true };
}

/**
 * Validate that a user can add a prompt to a collection
 * 
 * @param userId - The ID of the user
 * @param promptId - The ID of the prompt
 * @param collectionId - The ID of the collection
 * @returns Promise<ValidationResult> - Validation result with reason if denied
 */
export async function validateAddPromptToCollection(
  userId: string,
  promptId: number,
  collectionId: number
): Promise<ValidationResult> {
  const allowed = await canAddPromptToCollection(userId, promptId, collectionId);
  
  if (!allowed) {
    return {
      allowed: false,
      reason: 'User must be owner of both the prompt and collection to add prompt to collection.',
    };
  }

  return { allowed: true };
}

/**
 * Throw an error if validation fails
 * Helper function to convert validation result to exception
 * 
 * @param validation - The validation result
 * @throws Error if validation failed
 */
export function assertValidation(validation: ValidationResult): void {
  if (!validation.allowed) {
    throw new Error(validation.reason || 'Operation not allowed');
  }
}
