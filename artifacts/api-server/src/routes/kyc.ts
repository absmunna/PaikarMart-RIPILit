import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, kycDocumentsTable } from "@workspace/db";
import { requireSeller, requireAdmin } from "../middleware/auth";
import { randomUUID } from "crypto";

const router: IRouter = Router();

const ListKycQuery = z.object({
  seller_id: z.string().optional(),
});

const SubmitKycBody = z.object({
  sellerId: z.string(),
  docType: z.enum(["nid_front", "nid_back", "trade_license", "tin_certificate", "bank_statement", "selfie"]),
  fileUrl: z.string().url(),
});

const ReviewKycBody = z.object({
  status: z.enum(["approved", "rejected"]),
  reviewNote: z.string().optional(),
});

function normalizeDoc(d: Record<string, unknown>) {
  return {
    ...d,
    createdAt: d.createdAt instanceof Date ? (d.createdAt as Date).toISOString() : d.createdAt,
    updatedAt: d.updatedAt instanceof Date ? (d.updatedAt as Date).toISOString() : d.updatedAt,
    reviewedAt: d.reviewedAt instanceof Date ? (d.reviewedAt as Date).toISOString() : (d.reviewedAt ?? undefined),
    reviewNote: (d.reviewNote as string | null) ?? undefined,
    reviewedBy: (d.reviewedBy as string | null) ?? undefined,
  };
}

router.get("/kyc", requireSeller, async (req, res): Promise<void> => {
  const params = ListKycQuery.safeParse(req.query);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }

  const sellerId = params.data.seller_id ?? req.user!.id;
  if (req.user!.role === "seller" && sellerId !== req.user!.id) {
    res.status(403).json({ error: "Sellers can only view their own KYC documents" }); return;
  }

  const docs = await db.select().from(kycDocumentsTable).where(eq(kycDocumentsTable.sellerId, sellerId));
  res.json({ documents: docs.map(d => normalizeDoc(d as unknown as Record<string, unknown>)), total: docs.length });
});

router.post("/kyc", requireSeller, async (req, res): Promise<void> => {
  const body = SubmitKycBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: body.error.message }); return; }

  if (req.user!.role === "seller" && body.data.sellerId !== req.user!.id) {
    res.status(403).json({ error: "Sellers can only submit their own KYC documents" }); return;
  }

  const [doc] = await db.insert(kycDocumentsTable).values({
    id: randomUUID(),
    sellerId: body.data.sellerId,
    docType: body.data.docType,
    fileUrl: body.data.fileUrl,
    status: "pending",
  }).returning();

  res.status(201).json(normalizeDoc(doc as unknown as Record<string, unknown>));
});

router.put("/kyc/:id/review", requireAdmin, async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const body = ReviewKycBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: body.error.message }); return; }

  const [doc] = await db.update(kycDocumentsTable)
    .set({
      status: body.data.status,
      reviewNote: body.data.reviewNote,
      reviewedBy: req.user!.id,
      reviewedAt: new Date(),
    })
    .where(eq(kycDocumentsTable.id, id))
    .returning();

  if (!doc) { res.status(404).json({ error: "KYC document not found" }); return; }
  res.json(normalizeDoc(doc as unknown as Record<string, unknown>));
});

export default router;
