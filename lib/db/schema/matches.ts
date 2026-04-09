import { pgTable, timestamp, uuid, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "./users";

export const matches = pgTable("matches", {
  id: uuid("id").primaryKey().defaultRandom(),
  userAId: uuid("user_a_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  userBId: uuid("user_b_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const insertMatchSchema = createInsertSchema(matches);
export const selectMatchSchema = createSelectSchema(matches);