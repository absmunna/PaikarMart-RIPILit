import { pgTable, text, timestamp, real, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "completed",
  "incomplete",
]);

export const deliveryTypeEnum = pgEnum("delivery_type", [
  "seller_delivery",
  "platform_delivery",
  "local_delivery",
  "pickup",
]);

export const ordersTable = pgTable("orders", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  items: jsonb("items").notNull(),
  status: orderStatusEnum("status").notNull().default("pending"),
  deliveryType: deliveryTypeEnum("delivery_type").default("seller_delivery"),
  paymentMethod: text("payment_method").notNull().default("cash_on_delivery"),
  totalAmount: real("total_amount").notNull(),
  deliveryCharge: real("delivery_charge").default(0),
  trackingCode: text("tracking_code"),
  customerName: text("customer_name"),
  customerPhone: text("customer_phone"),
  customerAddress: text("customer_address"),
  district: text("district"),
  area: text("area"),
  estimatedDelivery: text("estimated_delivery"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ createdAt: true, updatedAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
