import { relations } from "drizzle-orm";
import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

import { promptTag } from "./prompt";
import { skillTag } from "./skill";
import { agentTag } from "./agent";

export const tag = pgTable("tag", {
    id: varchar("id", { length: 36 }).primaryKey(),
    name: varchar("name", { length: 100 }).notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const tagRelations = relations(tag, ({ many }) => ({
    promptTags: many(promptTag),
    skillTags: many(skillTag),
    agentTags: many(agentTag),
}));

// Import types for relations
