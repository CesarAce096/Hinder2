import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/db/schema/index.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
});