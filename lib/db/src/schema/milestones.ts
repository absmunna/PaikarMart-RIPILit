import { pgTable, text, timestamp, real, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const milestoneTypeEnum = pgEnum("milestone_type", [
  "first_sale",
  "sales_100k",
  "sales_500k",
  "sales_1m",
  "products_10",
  "products_50",
  "rating_4_5",
  "orders_100",
  "orders_500",
]);

export const milestonesTable = pgTable("milestones", {
  id: text("id").primaryKey(),
  sellerId: text("seller_id").notNull(),
  type: milestoneTypeEnum("type").notNull(),
  targetValue: real("target_value"),
  currentValue: real("current_value").default(0),
  achieved: boolean("achieved").default(false),
  achievedAt: timestamp("achieved_at", { withTimezone: true }),
  rewardAmount: real("reward_amount"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertMilestoneSchema = createInsertSchema(milestonesTable).omit({ createdAt: true, updatedAt: true, achievedAt: true });
export type InsertMilestone = z.infer<typeof insertMilestoneSchema>;
export type Milestone = typeof milestonesTable.$inferSelect;
