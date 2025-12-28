import { relations } from "drizzle-orm";
import {
    pgTable,
    text,
    timestamp,
    index,
    boolean,
    varchar,
    primaryKey,
} from "drizzle-orm/pg-core";
import { repository } from "./repository";
import { tag } from "./tag";
import { user } from "./user";

export const agent = pgTable(
    "agent",
    {
        id: varchar("id", { length: 36 }).primaryKey(),
        name: varchar("name", { length: 255 }).notNull(),
        description: text("description"),
        path: text("path").notNull(),
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
    (table) => [index("agent_repositoryId_idx").on(table.repositoryId)]
);

export const agentRelations = relations(agent, ({ one, many }) => ({
    repository: one(repository, {
        fields: [agent.repositoryId],
        references: [repository.id],
    }),
    creator: one(user, {
        fields: [agent.createdBy],
        references: [user.id],
        relationName: "agentCreator",
    }),
    updater: one(user, {
        fields: [agent.updatedBy],
        references: [user.id],
        relationName: "agentUpdater",
    }),
    agentTags: many(agentTag),
}));

// Import types for relations
export const agentTag = pgTable(
    "agent_tag",
    {
        agentId: varchar("agent_id", { length: 36 })
            .notNull()
            .references(() => agent.id, { onDelete: "cascade" }),
        tagId: varchar("tag_id", { length: 36 })
            .notNull()
            .references(() => tag.id, { onDelete: "cascade" }),
    },
    (table) => [
        primaryKey({ columns: [table.agentId, table.tagId] }),
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
