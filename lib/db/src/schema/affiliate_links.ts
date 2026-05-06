import { pgTable, text, timestamp, integer, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const affiliateTargetTypeEnum = pgEnum("affiliate_target_type", [
  "product",
  "seller",
  "category",
  "page",
]);

export const affiliateLinksTable = pgTable("affiliate_links", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  code: text("code").notNull().unique(),
  targetId: text("target_id"),
  targetType: affiliateTargetTypeEnum("target_type"),
  isActive: boolean("is_active").default(true),
  clicks: integer("clicks").default(0),
  conversions: integer("conversions").default(0),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertAffiliateLinkSchema = createInsertSchema(affiliateLinksTable).omit({ createdAt: true, updatedAt: true, expiresAt: true });
export type InsertAffiliateLink = z.infer<typeof insertAffiliateLinkSchema>;
export type AffiliateLink = typeof affiliateLinksTable.$inferSelect;
