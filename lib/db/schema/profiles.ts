import { pgTable, text, timestamp, uuid, date, integer, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "./users";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull().unique(),
  firstName: text("first_name").notNull(),
  birthdate: date("birthdate").notNull(),
  bio: text("bio"),
  gender: text("gender").notNull(), // male, female, other
  interestedIn: text("interested_in").notNull(), // male, female, everyone
  city: text("city"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  maxDistanceKm: integer("max_distance_km").default(50).notNull(),
  minAgePreference: integer("min_age_preference").default(18).notNull(),
  maxAgePreference: integer("max_age_preference").default(99).notNull(),
  isComplete: boolean("is_complete").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProfileSchema = createInsertSchema(profiles);
export const selectProfileSchema = createSelectSchema(profiles);