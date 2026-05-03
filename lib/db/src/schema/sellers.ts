import { pgTable, text, timestamp, real, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const sellerTypeEnum = pgEnum("seller_type", [
  "wholesaler",
  "retailer",
  "brand_seller",
  "local_shop",
  "dropship",
  "service",
  "b2b_seller",
  "content_creator",
  "logistic_courier",
  "booking_agent",
]);

export const sellerStatusEnum = pgEnum("seller_status", [
  "pending",
  "approved",
  "active",
  "suspended",
]);

export const sellersTable = pgTable("sellers", {
  id: text("id").primaryKey(),
  shopName: text("shop_name").notNull(),
  businessType: sellerTypeEnum("business_type").notNull(),
  status: sellerStatusEnum("status").notNull().default("pending"),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  location: text("location"),
  district: text("district"),
  rating: real("rating").default(4.0),
  totalProducts: integer("total_products").default(0),
  totalSales: real("total_sales").default(0),
  image: text("image"),
  description: text("description"),
  deliveryTypes: text("delivery_types").array(),
  coverageAreas: text("coverage_areas").array(),
  kycStatus: text("kyc_status"),
  commissionRate: real("commission_rate"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSellerSchema = createInsertSchema(sellersTable).omit({ createdAt: true });
export type InsertSeller = z.infer<typeof insertSellerSchema>;
export type Seller = typeof sellersTable.$inferSelect;
