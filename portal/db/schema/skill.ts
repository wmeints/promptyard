import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";
import { repository } from "./repository";
import { tag } from "./tag";

export const skill = pgTable(
    "skill",
    {
        id: text("id").primaryKey(),
        title: text("title").notNull(),
        description: text("description"),
        path: text("path").notNull(),
        repositoryId: text("repository_id")
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
        skillId: text("skill_id")
            .notNull()
            .references(() => skill.id, { onDelete: "cascade" }),
        tagId: text("tag_id")
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
