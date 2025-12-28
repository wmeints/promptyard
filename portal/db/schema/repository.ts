import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core";
import { user } from "./user";

import { prompt } from "./prompt";
import { skill } from "./skill";
import { agent } from "./agent";
import { repositoryMember } from "./repository-member";

export const repository = pgTable(
    "repository",
    {
        id: text("id").primaryKey(),
        name: text("name").notNull(),
        description: text("description"),
        userId: text("user_id")
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
