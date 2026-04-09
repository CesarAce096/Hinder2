import { pgTable, text, timestamp, uuid, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "./users";

export const swipes = pgTable("swipes", {
  id: uuid("id").primaryKey().defaultRandom(),
  swiperUserId: uuid("swiper_user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  targetUserId: uuid("target_user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  direction: text("direction").notNull(), // like, pass
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  uniqueSwipe: uniqueIndex("unique_swipe").on(table.swiperUserId, table.targetUserId),
}));

export const insertSwipeSchema = createInsertSchema(swipes);
export const selectSwipeSchema = createSelectSchema(swipes);