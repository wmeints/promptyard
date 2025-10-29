/**
 * Collections schema
 * Defines the collections table for grouping related prompts
 */

import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * Collections table
 * Stores collections that can contain multiple related prompts
 */
export const collections = pgTable('collections', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
