import { relations } from "drizzle-orm";
import {
    pgTable,
    text,
    timestamp,
    index,
    uniqueIndex,
    boolean,
    varchar,
    primaryKey,
} from "drizzle-orm/pg-core";
import { repository } from "./repository";
import { tag } from "./tag";
import { user } from "./user";

export const prompt = pgTable(
    "prompt",
    {
        id: varchar("id", { length: 36 }).primaryKey(),
        title: varchar("title", { length: 500 }).notNull(),
        slug: varchar("slug", { length: 255 }).notNull(),
        description: text("description"),
        content: text("content").notNull(),
        repositoryId: varchar("repository_id", { length: 36 })
            .notNull()
            .references(() => repository.id, { onDelete: "cascade" }),
        isPublic: boolean("is_public").default(false).notNull(),
        createdBy: varchar("created_by", { length: 36 })
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        updatedBy: varchar("updated_by", { length: 36 }).references(
            () => user.id,
            { onDelete: "cascade" }
        ),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [
        index("prompt_repositoryId_idx").on(table.repositoryId),
        uniqueIndex("prompt_repositoryId_slug_idx").on(
            table.repositoryId,
            table.slug
        ),
    ]
);

export const promptRelations = relations(prompt, ({ one, many }) => ({
    repository: one(repository, {
        fields: [prompt.repositoryId],
        references: [repository.id],
    }),
    creator: one(user, {
        fields: [prompt.createdBy],
        references: [user.id],
        relationName: "promptCreator",
    }),
    updater: one(user, {
        fields: [prompt.updatedBy],
        references: [user.id],
        relationName: "promptUpdater",
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
        primaryKey({ columns: [table.promptId, table.tagId] }),
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
