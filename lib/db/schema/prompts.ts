/**
 * Prompts schema
 * Defines the prompts table for storing user-submitted prompts
 */

import { pgTable, serial, text, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { user } from './auth';

/**
 * Prompts table
 * Stores user-submitted prompts with title, content, tags, and unique slug
 */
export const prompts = pgTable('prompts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  slug: text('slug').notNull().unique(),
  tags: jsonb('tags').$type<string[]>().notNull().default([]),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  slugIdx: index('prompts_slug_idx').on(table.slug),
  userIdIdx: index('prompts_user_id_idx').on(table.userId),
}));
