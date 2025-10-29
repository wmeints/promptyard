/**
 * Prompts and Collections schema
 * Defines tables for prompts, collections, and their relationships
 */

import { pgTable, serial, text, timestamp, pgEnum, primaryKey } from 'drizzle-orm/pg-core';
import { user } from './auth';

/**
 * Role types for authorization
 */
export const roleEnum = pgEnum('role', ['owner', 'maintainer']);

/**
 * Prompts table
 * Stores individual prompt content created by users
 */
export const prompts = pgTable('prompts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdBy: text('created_by').notNull().references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Collections table
 * Stores collections that group related prompts
 */
export const collections = pgTable('collections', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  createdBy: text('created_by').notNull().references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Prompts-Collections junction table
 * Many-to-many relationship between prompts and collections
 */
export const promptCollections = pgTable('prompt_collections', {
  promptId: serial('prompt_id').notNull().references(() => prompts.id, { onDelete: 'cascade' }),
  collectionId: serial('collection_id').notNull().references(() => collections.id, { onDelete: 'cascade' }),
  addedAt: timestamp('added_at').defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.promptId, table.collectionId] }),
}));

/**
 * User-Prompt roles table
 * Defines user permissions for individual prompts
 */
export const userPromptRoles = pgTable('user_prompt_roles', {
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  promptId: serial('prompt_id').notNull().references(() => prompts.id, { onDelete: 'cascade' }),
  role: roleEnum('role').notNull(),
  grantedAt: timestamp('granted_at').defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.promptId] }),
}));

/**
 * User-Collection roles table
 * Defines user permissions for collections
 * Permissions cascade to all prompts within the collection
 */
export const userCollectionRoles = pgTable('user_collection_roles', {
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  collectionId: serial('collection_id').notNull().references(() => collections.id, { onDelete: 'cascade' }),
  role: roleEnum('role').notNull(),
  grantedAt: timestamp('granted_at').defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.collectionId] }),
}));
