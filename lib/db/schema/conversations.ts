import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { matches } from "./matches";

export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  matchId: uuid("match_id").references(() => matches.id, { onDelete: "cascade" }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertConversationSchema = createInsertSchema(conversations);
export const selectConversationSchema = createSelectSchema(conversations);