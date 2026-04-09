import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "./users";

export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  reporterUserId: uuid("reporter_user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  reportedUserId: uuid("reported_user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  reason: text("reason").notNull(),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReportSchema = createInsertSchema(reports);
export const selectReportSchema = createSelectSchema(reports);