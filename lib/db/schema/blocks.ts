import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "./users";

export const blocks = pgTable("blocks", {
  id: uuid("id").primaryKey().defaultRandom(),
  blockerUserId: uuid("blocker_user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  blockedUserId: uuid("blocked_user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBlockSchema = createInsertSchema(blocks);
export const selectBlockSchema = createSelectSchema(blocks);