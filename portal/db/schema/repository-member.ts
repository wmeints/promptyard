import { relations } from "drizzle-orm";
import {
    pgTable,
    timestamp,
    index,
    primaryKey,
    varchar,
} from "drizzle-orm/pg-core";
import { user } from "./user";
import { repository } from "./repository";

export const repositoryMemberRole = ["owner", "manager", "reader"] as const;
export type RepositoryMemberRole = (typeof repositoryMemberRole)[number];

export const repositoryMember = pgTable(
    "repository_member",
    {
        repositoryId: varchar("repository_id", { length: 36 })
            .notNull()
            .references(() => repository.id, { onDelete: "cascade" }),
        userId: varchar("user_id", { length: 36 })
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        role: varchar("role", {
            length: 10,
            enum: repositoryMemberRole,
        }).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [
        primaryKey({ columns: [table.repositoryId, table.userId] }),
        index("repository_member_repositoryId_idx").on(table.repositoryId),
        index("repository_member_userId_idx").on(table.userId),
    ]
);

export const repositoryMemberRelations = relations(
    repositoryMember,
    ({ one }) => ({
        repository: one(repository, {
            fields: [repositoryMember.repositoryId],
            references: [repository.id],
        }),
        user: one(user, {
            fields: [repositoryMember.userId],
            references: [user.id],
        }),
    })
);
