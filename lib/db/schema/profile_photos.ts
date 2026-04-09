import { pgTable, text, timestamp, uuid, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "./users";

export const profilePhotos = pgTable("profile_photos", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  storagePath: text("storage_path").notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
  isPrimary: boolean("is_primary").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProfilePhotoSchema = createInsertSchema(profilePhotos);
export const selectProfilePhotoSchema = createSelectSchema(profilePhotos);