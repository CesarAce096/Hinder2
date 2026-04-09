import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const interests = pgTable("interests", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: text("label").notNull().unique(),
});

export const insertInterestSchema = createInsertSchema(interests);
export const selectInterestSchema = createSelectSchema(interests);