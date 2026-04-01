import { pgTable, text, timestamp, real, integer, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productTypeEnum = pgEnum("product_type", ["physical", "digital", "service"]);

export const productsTable = pgTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  type: productTypeEnum("type").notNull().default("physical"),
  price: real("price"),
  costPrice: real("cost_price"),
  stock: integer("stock").default(0),
  moq: integer("moq"),
  description: text("description"),
  images: text("images").array(),
  vendorId: text("vendor_id").notNull(),
  vendorName: text("vendor_name").notNull(),
  location: text("location"),
  rating: real("rating").default(4.0),
  reviewCount: integer("review_count").default(0),
  priceOnInquiry: boolean("price_on_inquiry").default(false),
  inStock: boolean("in_stock").default(true),
  deliveryDays: text("delivery_days"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ createdAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
