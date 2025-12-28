import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const session = pgTable(
    "session",
    {
        id: text("id").primaryKey(),
        expiresAt: timestamp("expires_at").notNull(),
        token: text("token").notNull().unique(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
        ipAddress: text("ip_address"),
        userAgent: text("user_agent"),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
    },
    (table) => [index("session_userId_idx").on(table.userId)]
);

export const account = pgTable(
    "account",
    {
        id: text("id").primaryKey(),
        accountId: text("account_id").notNull(),
        providerId: text("provider_id").notNull(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        accessToken: text("access_token"),
        refreshToken: text("refresh_token"),
        idToken: text("id_token"),
        accessTokenExpiresAt: timestamp("access_token_expires_at"),
        refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
        scope: text("scope"),
        password: text("password"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("account_userId_idx").on(table.userId)]
);

export const verification = pgTable(
    "verification",
    {
        id: text("id").primaryKey(),
        identifier: text("identifier").notNull(),
        value: text("value").notNull(),
        expiresAt: timestamp("expires_at").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("verification_identifier_idx").on(table.identifier)]
);

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

export const prompt = pgTable(
    "prompt",
    {
        id: text("id").primaryKey(),
        title: text("title").notNull(),
        description: text("description"),
        content: text("content").notNull(),
        repositoryId: text("repository_id")
            .notNull()
            .references(() => repository.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("prompt_repositoryId_idx").on(table.repositoryId)]
);

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
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("agent_repositoryId_idx").on(table.repositoryId)]
);

export const tag = pgTable("tag", {
    id: text("id").primaryKey(),
    name: text("name").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const promptTag = pgTable(
    "prompt_tag",
    {
        promptId: text("prompt_id")
            .notNull()
            .references(() => prompt.id, { onDelete: "cascade" }),
        tagId: text("tag_id")
            .notNull()
            .references(() => tag.id, { onDelete: "cascade" }),
    },
    (table) => [
        index("prompt_tag_promptId_idx").on(table.promptId),
        index("prompt_tag_tagId_idx").on(table.tagId),
    ]
);

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

export const userRelations = relations(user, ({ many }) => ({
    sessions: many(session),
    accounts: many(account),
    repositories: many(repository),
}));

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
}));

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}));

export const repositoryRelations = relations(repository, ({ one, many }) => ({
    user: one(user, {
        fields: [repository.userId],
        references: [user.id],
    }),
    prompts: many(prompt),
    skills: many(skill),
    agents: many(agent),
}));

export const promptRelations = relations(prompt, ({ one, many }) => ({
    repository: one(repository, {
        fields: [prompt.repositoryId],
        references: [repository.id],
    }),
    promptTags: many(promptTag),
}));

export const skillRelations = relations(skill, ({ one, many }) => ({
    repository: one(repository, {
        fields: [skill.repositoryId],
        references: [repository.id],
    }),
    skillTags: many(skillTag),
}));

export const agentRelations = relations(agent, ({ one, many }) => ({
    repository: one(repository, {
        fields: [agent.repositoryId],
        references: [repository.id],
    }),
    agentTags: many(agentTag),
}));

export const tagRelations = relations(tag, ({ many }) => ({
    promptTags: many(promptTag),
    skillTags: many(skillTag),
    agentTags: many(agentTag),
}));

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
