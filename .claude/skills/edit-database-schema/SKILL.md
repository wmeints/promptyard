---
name: manage-database-schema
description: Use this skill to create or modify the database schema in the application.
---

## Manage database schema

Use this skill to manage database schema changes. Use this whenever you need to
create, update, or remove database objects like tables or columns in a table. 
Use this as well when you need to create relationships between objects.

## Working with tables

- Always include createdAt and updatedAt columns in any table. 
- Use the `timestamp` type from the `drizzle-orm/pg-core` typescript package for date/time columns.
- Table names are always singular, for example: we store users in the `user` table.
- Table variables always have the naming convention `<object>Table`.
- Use snake casing when naming columns in a table.

## Special cases

- Tables modeling many-to-many relationships don't need the createdAt and updatedAt columns.
- The tags table doesn't need a createdAt and updatedAt column because it's part of promps, skills, and agents.