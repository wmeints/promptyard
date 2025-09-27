import "dotenv/config";
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  console.warn(
    "Detected no DATABASE_URL environment variable. Please make sure to configure the database!",
  );
}

const databaseUrl =
  process.env.DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432/promptyard";

export default defineConfig({
  dialect: "postgresql",
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url: databaseUrl,
  },
});
