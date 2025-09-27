import {
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp().notNull(),
  modifiedAt: timestamp(),
};

export const usersTable = pgTable(
  "users",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    externalId: varchar({ length: 500 }).notNull(),
    version: integer().notNull().default(1),
    ...timestamps,
  },
  (table) => [unique().on(table.externalId)],
);

export const repositoriesTable = pgTable("repositories", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 500 }).notNull(),
  slug: varchar({ length: 500 }).notNull(),
  description: text(),
  ownerId: integer().references(() => usersTable.id),
  version: integer().notNull().default(1),
  ...timestamps,
});

export const promptTemplatesTable = pgTable("prompt_templates", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  slug: varchar({ length: 500 }).notNull(),
  repositoryId: integer().references(() => repositoriesTable.id),
  version: integer().notNull().default(1),
  ...timestamps,
});

export const promptTemplateVersionsTable = pgTable("prompt_template_versions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  promptTemplateId: integer().references(() => promptTemplatesTable.id),
  version: integer(),
  description: text(),
  content: text(),
  title: varchar({ length: 500 }).notNull(),
  ...timestamps,
});
