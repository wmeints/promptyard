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

export const skill = pgTable(
    "skill",
    {
        id: varchar("id", { length: 36 }).primaryKey(),
        title: text("title").notNull(),
        description: text("description"),
        path: text("path").notNull(),
        isPublic: boolean("is_public").default(false).notNull(),
        repositoryId: varchar("repository_id", { length: 36 })
            .notNull()
            .references(() => repository.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("skill_repositoryId_idx").on(table.repositoryId)]
);

export const skillRelations = relations(skill, ({ one, many }) => ({
    repository: one(repository, {
        fields: [skill.repositoryId],
        references: [repository.id],
    }),
    skillTags: many(skillTag),
}));

export const skillTag = pgTable(
    "skill_tag",
    {
        skillId: varchar("skill_id", { length: 36 })
            .notNull()
            .references(() => skill.id, { onDelete: "cascade" }),
        tagId: varchar("tag_id", { length: 36 })
            .notNull()
            .references(() => tag.id, { onDelete: "cascade" }),
    },
    (table) => [
        index("skill_tag_skillId_idx").on(table.skillId),
        index("skill_tag_tagId_idx").on(table.tagId),
    ]
);

export const skillTagRelations = relations(skillTag, ({ one }) => ({
    skill: one(skill, {
        fields: [skillTag.skillId],
        references: [skill.id],
    }),
    tag: one(tag, {
        fields: [skillTag.tagId],
        references: [tag.id],
    }),
}));
