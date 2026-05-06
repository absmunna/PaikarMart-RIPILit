import { pgTable, text, timestamp, real, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const transactionTypeEnum = pgEnum("transaction_type", [
  "reward",
  "adjustment",
  "withdrawal",
  "deposit",
  "purchase",
  "refund",
  "commission",
  "bonus",
]);

export const transactionStatusEnum = pgEnum("transaction_status", [
  "pending",
  "completed",
  "failed",
  "reversed",
]);

export const transactionsTable = pgTable("transactions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  type: transactionTypeEnum("type").notNull(),
  status: transactionStatusEnum("status").notNull().default("completed"),
  amount: real("amount").notNull(),
  balanceBefore: real("balance_before"),
  balanceAfter: real("balance_after"),
  description: text("description"),
  referenceId: text("reference_id"),
  referenceType: text("reference_type"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertTransactionSchema = createInsertSchema(transactionsTable).omit({ createdAt: true, updatedAt: true });
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactionsTable.$inferSelect;
