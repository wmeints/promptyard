import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, index, boolean } from "drizzle-orm/pg-core";
import { repository } from "./repository";
import { tag } from "./tag";

export const agent = pgTable(
    "agent",
    {
        id: text("id").primaryKey(),
        name: text("name").notNull(),
        description: text("description"),
        path: text("path").notNull(),
        repositoryId: text("repository_id")
            .notNull()
            .references(() => repository.id, { onDelete: "cascade" }),
        isPublic: boolean("is_public").default(false).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("agent_repositoryId_idx").on(table.repositoryId)]
);

export const agentRelations = relations(agent, ({ one, many }) => ({
    repository: one(repository, {
        fields: [agent.repositoryId],
        references: [repository.id],
    }),
    agentTags: many(agentTag),
}));

// Import types for relations
export const agentTag = pgTable(
    "agent_tag",
    {
        agentId: text("agent_id")
            .notNull()
            .references(() => agent.id, { onDelete: "cascade" }),
        tagId: text("tag_id")
            .notNull()
            .references(() => tag.id, { onDelete: "cascade" }),
    },
    (table) => [
        index("agent_tag_agentId_idx").on(table.agentId),
        index("agent_tag_tagId_idx").on(table.tagId),
    ]
);

export const agentTagRelations = relations(agentTag, ({ one }) => ({
    agent: one(agent, {
        fields: [agentTag.agentId],
        references: [agent.id],
    }),
    tag: one(tag, {
        fields: [agentTag.tagId],
        references: [tag.id],
    }),
}));
