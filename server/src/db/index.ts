import { drizzle } from "drizzle-orm/node-postgres";
import "dotenv/config";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  console.warn(
    "Detected no DATABASE_URL environment variable. Please make sure to configure the database!",
  );
}

const databaseUrl =
  process.env.DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432/promptyard";

export const db = drizzle(databaseUrl, {
  schema,
  casing: "snake_case",
});
