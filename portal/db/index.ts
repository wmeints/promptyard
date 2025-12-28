import { drizzle } from "drizzle-orm/node-postgres";

// Note: The DATABASE_URI is automatically configured by Aspire.
// If you're not using Aspire, make sure you set the DATABASE_URI environment
// variable or store it in a .env file in this directory.
export const db = drizzle(process.env.DATABASE_URI!);