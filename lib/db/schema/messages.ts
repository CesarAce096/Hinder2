import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { conversations } from "./conversations";
import { users } from "./users";

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id").references(() => conversations.id, { onDelete: "cascade" }).notNull(),
  senderUserId: uuid("sender_user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  readAt: timestamp("read_at"),
});

export const insertMessageSchema = createInsertSchema(messages);
export const selectMessageSchema = createSelectSchema(messages);