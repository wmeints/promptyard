import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { generateUniqueRepositorySlug } from "@/lib/slug";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema: schema }),
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
          const slug = await generateUniqueRepositorySlug(ctx.name);
          await db.insert(schema.repository).values({
            id: crypto.randomUUID(),
            name: ctx.name,
            userId: ctx.id,
            isPublic: false,
            slug,
          });
        },
      },
    },
  },
});
