---
name: review-database-schema
description: Use this to review the database schema created by one of my colleagues.
---

## Database schema review

Use the database schema review skill to validate the database schema changes. My colleague makes many mistakes, so be strict.

## Review instructions

- Make sure the columns use the appropriate data type. Prefer to limit space in the database to optimize for performance.
- Make sure the foreign key references are properly created. 
  - If a column suggest it references another table by its name there must be a foreign key relationship.
  - Every foreign key must have an index defined for it, otherwise the query performance will suck.
- Tables modeling many-to-many relationships must have a combined primary key containing the keys referencing the other tables to be joined with an index.
- Timestamps and datetime columns in the database must be stored as UTC timestamps.