import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { repository } from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (ctx) => {
          // Automatically create a user repository for the user.
          await db.insert(repository).values({
            id: crypto.randomUUID(),
            name: ctx.name,
            userId: ctx.id,
            isPublic: false,
          });
        },
      },
    },
  },
});
