import { pgTable, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { profiles } from "./profiles";
import { interests } from "./interests";

export const profileInterests = pgTable("profile_interests", {
  profileId: uuid("profile_id").references(() => profiles.id, { onDelete: "cascade" }).notNull(),
  interestId: uuid("interest_id").references(() => interests.id, { onDelete: "cascade" }).notNull(),
});

export const insertProfileInterestSchema = createInsertSchema(profileInterests);
export const selectProfileInterestSchema = createSelectSchema(profileInterests);