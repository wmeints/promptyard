/**
 * Example schema file for prompts
 * Demonstrates how to define tables with Drizzle ORM
 */

import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * Example prompts table
 * This is a sample table to demonstrate Drizzle ORM schema definition
 */
export const prompts = pgTable('prompts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
