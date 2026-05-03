import { pgTable, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const kycDocTypeEnum = pgEnum("kyc_doc_type", [
  "nid_front",
  "nid_back",
  "trade_license",
  "tin_certificate",
  "bank_statement",
  "selfie",
]);

export const kycDocStatusEnum = pgEnum("kyc_doc_status", [
  "not_submitted",
  "pending",
  "approved",
  "rejected",
]);

export const kycDocumentsTable = pgTable("kyc_documents", {
  id: text("id").primaryKey(),
  sellerId: text("seller_id").notNull(),
  docType: kycDocTypeEnum("doc_type").notNull(),
  fileUrl: text("file_url").notNull(),
  status: kycDocStatusEnum("status").notNull().default("pending"),
  reviewNote: text("review_note"),
  reviewedBy: text("reviewed_by"),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertKycDocumentSchema = createInsertSchema(kycDocumentsTable).omit({ createdAt: true, updatedAt: true, reviewedAt: true });
export type InsertKycDocument = z.infer<typeof insertKycDocumentSchema>;
export type KycDocument = typeof kycDocumentsTable.$inferSelect;
