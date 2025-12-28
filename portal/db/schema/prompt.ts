import { relations } from "drizzle-orm";
import {
    pgTable,
    text,
    timestamp,
    index,
    boolean,
    varchar,
} from "drizzle-orm/pg-core";
import { repository } from "./repository";
import { tag } from "./tag";

export const prompt = pgTable(
    "prompt",
    {
        id: varchar("id", { length: 36 }).primaryKey(),
        title: text("title").notNull(),
        description: text("description"),
        content: text("content").notNull(),
        repositoryId: varchar("repository_id", { length: 36 })
            .notNull()
            .references(() => repository.id, { onDelete: "cascade" }),
        isPublic: boolean("is_public").default(false).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("prompt_repositoryId_idx").on(table.repositoryId)]
);

export const promptRelations = relations(prompt, ({ one, many }) => ({
    repository: one(repository, {
        fields: [prompt.repositoryId],
        references: [repository.id],
    }),
    promptTags: many(promptTag),
}));

export const promptTag = pgTable(
    "prompt_tag",
    {
        promptId: varchar("prompt_id", { length: 36 })
            .notNull()
            .references(() => prompt.id, { onDelete: "cascade" }),
        tagId: varchar("tag_id", { length: 36 })
            .notNull()
            .references(() => tag.id, { onDelete: "cascade" }),
    },
    (table) => [
        index("prompt_tag_promptId_idx").on(table.promptId),
        index("prompt_tag_tagId_idx").on(table.tagId),
    ]
);

export const promptTagRelations = relations(promptTag, ({ one }) => ({
    prompt: one(prompt, {
        fields: [promptTag.promptId],
        references: [prompt.id],
    }),
    tag: one(tag, {
        fields: [promptTag.tagId],
        references: [tag.id],
    }),
}));
