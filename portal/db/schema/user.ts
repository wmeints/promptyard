import { relations } from "drizzle-orm";
import {
    pgTable,
    text,
    timestamp,
    boolean,
    varchar,
} from "drizzle-orm/pg-core";
import { session } from "./session";
import { account } from "./account";
import { repository } from "./repository";
import { repositoryMember } from "./repository-member";

export const user = pgTable("user", {
    id: varchar("id", { length: 36 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
    sessions: many(session),
    accounts: many(account),
    repositories: many(repository),
    repositoryMemberships: many(repositoryMember),
}));
