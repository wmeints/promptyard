/**
 * Entitlements and authorization module
 * Implements relationship-based access control for prompts and collections
 */

import { db } from '../db/connection';
import { prompts, collections, userPromptRoles, userCollectionRoles, promptCollections } from '../db/schema/prompts';
import { eq, and } from 'drizzle-orm';

/**
 * Permission types that can be checked
 */
export type Permission = 'edit' | 'delete';

/**
 * Role types
 */
export type Role = 'owner' | 'maintainer';

/**
 * Check if a user has a specific permission on a prompt
 * 
 * Rules:
 * - Owners can edit and delete
 * - Maintainers can edit but not delete
 * - Collection owners/maintainers inherit permissions for prompts in their collections
 * 
 * @param userId - The ID of the user
 * @param promptId - The ID of the prompt
 * @param permission - The permission to check
 * @returns Promise<boolean> - Whether the user has the permission
 */
export async function hasPromptPermission(
  userId: string,
  promptId: number,
  permission: Permission
): Promise<boolean> {
  // Check if user is the creator of the prompt
  const prompt = await db.query.prompts.findFirst({
    where: eq(prompts.id, promptId),
  });

  if (!prompt) {
    return false;
  }

  // Creator always has all permissions
  if (prompt.createdBy === userId) {
    return true;
  }

  // Check direct prompt role
  const directRole = await db.query.userPromptRoles.findFirst({
    where: and(
      eq(userPromptRoles.userId, userId),
      eq(userPromptRoles.promptId, promptId)
    ),
  });

  if (directRole) {
    return checkRolePermission(directRole.role, permission);
  }

  // Check inherited roles from collections
  const promptInCollections = await db.query.promptCollections.findMany({
    where: eq(promptCollections.promptId, promptId),
  });

  for (const pc of promptInCollections) {
    const collectionRole = await db.query.userCollectionRoles.findFirst({
      where: and(
        eq(userCollectionRoles.userId, userId),
        eq(userCollectionRoles.collectionId, pc.collectionId)
      ),
    });

    if (collectionRole && checkRolePermission(collectionRole.role, permission)) {
      return true;
    }
  }

  return false;
}

/**
 * Check if a user has a specific permission on a collection
 * 
 * Rules:
 * - Owners can edit and delete
 * - Maintainers can edit but not delete
 * 
 * @param userId - The ID of the user
 * @param collectionId - The ID of the collection
 * @param permission - The permission to check
 * @returns Promise<boolean> - Whether the user has the permission
 */
export async function hasCollectionPermission(
  userId: string,
  collectionId: number,
  permission: Permission
): Promise<boolean> {
  // Check if user is the creator of the collection
  const collection = await db.query.collections.findFirst({
    where: eq(collections.id, collectionId),
  });

  if (!collection) {
    return false;
  }

  // Creator always has all permissions
  if (collection.createdBy === userId) {
    return true;
  }

  // Check collection role
  const collectionRole = await db.query.userCollectionRoles.findFirst({
    where: and(
      eq(userCollectionRoles.userId, userId),
      eq(userCollectionRoles.collectionId, collectionId)
    ),
  });

  if (collectionRole) {
    return checkRolePermission(collectionRole.role, permission);
  }

  return false;
}

/**
 * Check if a user can add a prompt to a collection
 * 
 * Rules:
 * - User must be an owner of both the prompt AND the collection
 * 
 * @param userId - The ID of the user
 * @param promptId - The ID of the prompt
 * @param collectionId - The ID of the collection
 * @returns Promise<boolean> - Whether the user can add the prompt
 */
export async function canAddPromptToCollection(
  userId: string,
  promptId: number,
  collectionId: number
): Promise<boolean> {
  // Must be owner of the prompt
  const isPromptOwner = await isOwnerOfPrompt(userId, promptId);
  if (!isPromptOwner) {
    return false;
  }

  // Must be owner of the collection
  const isCollectionOwner = await isOwnerOfCollection(userId, collectionId);
  if (!isCollectionOwner) {
    return false;
  }

  return true;
}

/**
 * Check if a user is an owner of a prompt
 * 
 * @param userId - The ID of the user
 * @param promptId - The ID of the prompt
 * @returns Promise<boolean> - Whether the user is an owner
 */
export async function isOwnerOfPrompt(
  userId: string,
  promptId: number
): Promise<boolean> {
  // Check if user is the creator
  const prompt = await db.query.prompts.findFirst({
    where: eq(prompts.id, promptId),
  });

  if (prompt && prompt.createdBy === userId) {
    return true;
  }

  // Check if user has owner role
  const role = await db.query.userPromptRoles.findFirst({
    where: and(
      eq(userPromptRoles.userId, userId),
      eq(userPromptRoles.promptId, promptId),
      eq(userPromptRoles.role, 'owner')
    ),
  });

  return !!role;
}

/**
 * Check if a user is an owner of a collection
 * 
 * @param userId - The ID of the user
 * @param collectionId - The ID of the collection
 * @returns Promise<boolean> - Whether the user is an owner
 */
export async function isOwnerOfCollection(
  userId: string,
  collectionId: number
): Promise<boolean> {
  // Check if user is the creator
  const collection = await db.query.collections.findFirst({
    where: eq(collections.id, collectionId),
  });

  if (collection && collection.createdBy === userId) {
    return true;
  }

  // Check if user has owner role
  const role = await db.query.userCollectionRoles.findFirst({
    where: and(
      eq(userCollectionRoles.userId, userId),
      eq(userCollectionRoles.collectionId, collectionId),
      eq(userCollectionRoles.role, 'owner')
    ),
  });

  return !!role;
}

/**
 * Helper function to check if a role has a specific permission
 * 
 * @param role - The role to check
 * @param permission - The permission to check
 * @returns boolean - Whether the role has the permission
 */
function checkRolePermission(role: Role, permission: Permission): boolean {
  if (role === 'owner') {
    // Owners have all permissions
    return true;
  }

  if (role === 'maintainer') {
    // Maintainers can edit but not delete
    return permission === 'edit';
  }

  return false;
}

/**
 * Grant a role to a user for a prompt
 * 
 * @param userId - The ID of the user to grant the role to
 * @param promptId - The ID of the prompt
 * @param role - The role to grant
 * @param grantedBy - The ID of the user granting the role (must be an owner)
 * @returns Promise<boolean> - Whether the role was granted successfully
 */
export async function grantPromptRole(
  userId: string,
  promptId: number,
  role: Role,
  grantedBy: string
): Promise<boolean> {
  // Check if the granter is an owner
  const isOwner = await isOwnerOfPrompt(grantedBy, promptId);
  if (!isOwner) {
    return false;
  }

  // Grant the role (insert or update)
  await db.insert(userPromptRoles)
    .values({
      userId,
      promptId,
      role,
    })
    .onConflictDoUpdate({
      target: [userPromptRoles.userId, userPromptRoles.promptId],
      set: { role, grantedAt: new Date() },
    });

  return true;
}

/**
 * Grant a role to a user for a collection
 * 
 * @param userId - The ID of the user to grant the role to
 * @param collectionId - The ID of the collection
 * @param role - The role to grant
 * @param grantedBy - The ID of the user granting the role (must be an owner)
 * @returns Promise<boolean> - Whether the role was granted successfully
 */
export async function grantCollectionRole(
  userId: string,
  collectionId: number,
  role: Role,
  grantedBy: string
): Promise<boolean> {
  // Check if the granter is an owner
  const isOwner = await isOwnerOfCollection(grantedBy, collectionId);
  if (!isOwner) {
    return false;
  }

  // Grant the role (insert or update)
  await db.insert(userCollectionRoles)
    .values({
      userId,
      collectionId,
      role,
    })
    .onConflictDoUpdate({
      target: [userCollectionRoles.userId, userCollectionRoles.collectionId],
      set: { role, grantedAt: new Date() },
    });

  return true;
}

/**
 * Revoke a user's role for a prompt
 * 
 * @param userId - The ID of the user to revoke the role from
 * @param promptId - The ID of the prompt
 * @param revokedBy - The ID of the user revoking the role (must be an owner)
 * @returns Promise<boolean> - Whether the role was revoked successfully
 */
export async function revokePromptRole(
  userId: string,
  promptId: number,
  revokedBy: string
): Promise<boolean> {
  // Check if the revoker is an owner
  const isOwner = await isOwnerOfPrompt(revokedBy, promptId);
  if (!isOwner) {
    return false;
  }

  // Revoke the role
  await db.delete(userPromptRoles)
    .where(and(
      eq(userPromptRoles.userId, userId),
      eq(userPromptRoles.promptId, promptId)
    ));

  return true;
}

/**
 * Revoke a user's role for a collection
 * 
 * @param userId - The ID of the user to revoke the role from
 * @param collectionId - The ID of the collection
 * @param revokedBy - The ID of the user revoking the role (must be an owner)
 * @returns Promise<boolean> - Whether the role was revoked successfully
 */
export async function revokeCollectionRole(
  userId: string,
  collectionId: number,
  revokedBy: string
): Promise<boolean> {
  // Check if the revoker is an owner
  const isOwner = await isOwnerOfCollection(revokedBy, collectionId);
  if (!isOwner) {
    return false;
  }

  // Revoke the role
  await db.delete(userCollectionRoles)
    .where(and(
      eq(userCollectionRoles.userId, userId),
      eq(userCollectionRoles.collectionId, collectionId)
    ));

  return true;
}
