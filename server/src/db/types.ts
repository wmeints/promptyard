import { promptTemplateVersionsTable, promptTemplatesTable, repositoriesTable } from "./schema";

export type PromptTemplate = typeof promptTemplatesTable.$inferSelect;
export type InsertPromptTemplate = typeof promptTemplatesTable.$inferInsert;
export type PromptTemplateVersion = typeof promptTemplateVersionsTable.$inferSelect;
export type InsertPromptTemplateVersion = typeof promptTemplateVersionsTable.$inferInsert;
export type Repository = typeof repositoriesTable.$inferSelect;
export type InsertRepository = typeof repositoriesTable.$inferInsert;

