import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  unique,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  // Immutable, unique per-user handle that powers permanent `/<handle>/...`
  // URLs. Derived from the email local-part on first login and never recomputed,
  // so it stays stable even when the Keycloak name/email changes.
  handle: text("handle").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const contentType = pgEnum("content_type", ["skill", "agent"]);

/** One file inside a skill's version snapshot, as stored in Azure Blob. */
export type ManifestEntry = { path: string; blobKey: string; size: number };

/**
 * Per-item outcome recorded against an upload request. `ignored` entries (junk
 * or out-of-scope files) carry just the path in `name` and no `type`.
 */
export type UploadResult = {
  type?: "skill" | "agent";
  name: string;
  status: "created" | "updated" | "failed" | "ignored";
  message?: string;
  contentId?: string;
};

// Logical identity of a skill or agent. `(ownerId, type, name)` is the stable
// identity that survives across versions, while `latestVersionId`/`description`
// mirror the newest snapshot for cheap listing.
export const content = pgTable(
  "content",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    ownerId: text("owner_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: contentType("type").notNull(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    latestVersionId: text("latest_version_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    unique("content_owner_type_name_unique").on(table.ownerId, table.type, table.name),
    index("content_ownerId_idx").on(table.ownerId),
  ],
);

// One immutable, full snapshot per upload (no dedup). Skills reference their
// files via `manifest` (stored in blob storage); agents inline their single
// markdown `body`. `(contentId, version)` is monotonic per content.
export const contentVersion = pgTable(
  "content_version",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    contentId: text("content_id")
      .notNull()
      .references(() => content.id, { onDelete: "cascade" }),
    version: integer("version").notNull(),
    description: text("description").notNull(),
    body: text("body"),
    manifest: jsonb("manifest").$type<ManifestEntry[]>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    unique("content_version_content_version_unique").on(table.contentId, table.version),
    index("content_version_contentId_idx").on(table.contentId),
  ],
);

// Audit record for a single upload (which may carry many skills/agents), with
// per-item outcomes captured in `results`.
export const uploadRequest = pgTable(
  "upload_request",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    ownerId: text("owner_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    totalCount: integer("total_count").default(0).notNull(),
    successCount: integer("success_count").default(0).notNull(),
    failureCount: integer("failure_count").default(0).notNull(),
    results: jsonb("results").$type<UploadResult[]>().default([]).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("upload_request_ownerId_idx").on(table.ownerId)],
);

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
  (table) => [index("session_userId_idx").on(table.userId)],
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
  (table) => [index("account_userId_idx").on(table.userId)],
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
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  content: many(content),
  uploadRequests: many(uploadRequest),
}));

export const contentRelations = relations(content, ({ one, many }) => ({
  owner: one(user, {
    fields: [content.ownerId],
    references: [user.id],
  }),
  versions: many(contentVersion),
}));

export const contentVersionRelations = relations(contentVersion, ({ one }) => ({
  content: one(content, {
    fields: [contentVersion.contentId],
    references: [content.id],
  }),
}));

export const uploadRequestRelations = relations(uploadRequest, ({ one }) => ({
  owner: one(user, {
    fields: [uploadRequest.ownerId],
    references: [user.id],
  }),
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
