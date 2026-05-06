import { pgTable, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const disputeTypeEnum = pgEnum("dispute_type", [
  "not_received",
  "wrong_item",
  "damaged",
  "refund_request",
  "seller_fraud",
  "other",
]);

export const disputeStatusEnum = pgEnum("dispute_status", [
  "open",
  "in_review",
  "resolved",
  "closed",
  "escalated",
]);

export const disputesTable = pgTable("disputes", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull(),
  userId: text("user_id").notNull(),
  sellerId: text("seller_id"),
  type: disputeTypeEnum("type").notNull(),
  status: disputeStatusEnum("status").notNull().default("open"),
  subject: text("subject").notNull(),
  description: text("description"),
  evidence: text("evidence").array(),
  resolution: text("resolution"),
  resolvedBy: text("resolved_by"),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertDisputeSchema = createInsertSchema(disputesTable).omit({ createdAt: true, updatedAt: true, resolvedAt: true });
export type InsertDispute = z.infer<typeof insertDisputeSchema>;
export type Dispute = typeof disputesTable.$inferSelect;
