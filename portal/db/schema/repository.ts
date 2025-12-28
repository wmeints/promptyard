import { relations } from "drizzle-orm";
import {
    pgTable,
    text,
    timestamp,
    boolean,
    index,
    varchar,
} from "drizzle-orm/pg-core";
import { user } from "./user";

import { prompt } from "./prompt";
import { skill } from "./skill";
import { agent } from "./agent";
import { repositoryMember } from "./repository-member";

export const repository = pgTable(
    "repository",
    {
        id: varchar("id", { length: 36 }).primaryKey(),
        name: varchar("name", { length: 255 }).notNull(),
        description: text("description"),
        userId: varchar("user_id", { length: 36 })
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        isPublic: boolean("is_public").default(false).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("repository_userId_idx").on(table.userId)]
);

export const repositoryRelations = relations(repository, ({ one, many }) => ({
    user: one(user, {
        fields: [repository.userId],
        references: [user.id],
    }),
    prompts: many(prompt),
    skills: many(skill),
    agents: many(agent),
    members: many(repositoryMember),
}));
