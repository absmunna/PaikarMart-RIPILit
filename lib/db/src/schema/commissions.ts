import { pgTable, text, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const commissionsConfigTable = pgTable("commissions_config", {
  id: text("id").primaryKey(),
  sellerType: text("seller_type").notNull().unique(),
  percent: real("percent").notNull().default(10),
  minPercent: real("min_percent"),
  maxPercent: real("max_percent"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertCommissionsConfigSchema = createInsertSchema(commissionsConfigTable).omit({ createdAt: true, updatedAt: true });
export type InsertCommissionsConfig = z.infer<typeof insertCommissionsConfigSchema>;
export type CommissionsConfig = typeof commissionsConfigTable.$inferSelect;
