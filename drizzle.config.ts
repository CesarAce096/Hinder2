import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  // @ts-ignore
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
});