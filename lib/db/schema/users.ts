import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  status: text("status").default("active").notNull(), // active, inactive, banned
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);