import { Router, type IRouter } from "express";
import { eq, and, type SQL } from "drizzle-orm";
import { z } from "@workspace/api-zod";
import { db, disputesTable } from "@workspace/db";
import { requireAuth, requireAdmin } from "../middleware/auth";
import { randomUUID } from "crypto";

const router: IRouter = Router();

const ListDisputesQuery = z.object({
  user_id: z.string().optional(),
  seller_id: z.string().optional(),
  order_id: z.string().optional(),
  status: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  offset: z.coerce.number().int().min(0).optional().default(0),
});

const CreateDisputeBody = z.object({
  orderId: z.string(),
  sellerId: z.string().optional(),
  type: z.enum(["not_received", "wrong_item", "damaged", "refund_request", "seller_fraud", "other"]),
  subject: z.string().min(5),
  description: z.string().optional(),
  evidence: z.array(z.string()).optional(),
});

const UpdateDisputeStatusBody = z.object({
  status: z.enum(["open", "in_review", "resolved", "closed", "escalated"]),
  resolution: z.string().optional(),
});

function normalizeDispute(d: Record<string, unknown>) {
  return {
    ...d,
    createdAt: d.createdAt instanceof Date ? (d.createdAt as Date).toISOString() : d.createdAt,
    updatedAt: d.updatedAt instanceof Date ? (d.updatedAt as Date).toISOString() : d.updatedAt,
    resolvedAt: d.resolvedAt instanceof Date ? (d.resolvedAt as Date).toISOString() : (d.resolvedAt ?? undefined),
    sellerId: (d.sellerId as string | null) ?? undefined,
    description: (d.description as string | null) ?? undefined,
    evidence: (d.evidence as string[] | null) ?? undefined,
    resolution: (d.resolution as string | null) ?? undefined,
    resolvedBy: (d.resolvedBy as string | null) ?? undefined,
  };
}

router.get("/disputes", requireAuth, async (req, res): Promise<void> => {
  const params = ListDisputesQuery.safeParse(req.query);
  if (!params.success) { res.status(400).json({ error: params.error.issues }); return; }

  const conditions: SQL[] = [];
  if (params.data.user_id) conditions.push(eq(disputesTable.userId, params.data.user_id));
  if (params.data.seller_id) conditions.push(eq(disputesTable.sellerId, params.data.seller_id));
  if (params.data.order_id) conditions.push(eq(disputesTable.orderId, params.data.order_id));
  if (params.data.status) conditions.push(eq(disputesTable.status, params.data.status as "open"));

  const query = db.select().from(disputesTable);
  const all = conditions.length > 0 ? await query.where(and(...conditions)) : await query;
  const total = all.length;
  const paginated = all.slice(params.data.offset, params.data.offset + params.data.limit);

  res.json({ disputes: paginated.map(d => normalizeDispute(d as unknown as Record<string, unknown>)), total });
});

router.post("/disputes", requireAuth, async (req, res): Promise<void> => {
  const body = CreateDisputeBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: body.error.issues }); return; }

  const [dispute] = await db.insert(disputesTable).values({
    id: randomUUID(),
    orderId: body.data.orderId,
    userId: req.user!.id,
    sellerId: body.data.sellerId,
    type: body.data.type,
    status: "open",
    subject: body.data.subject,
    description: body.data.description,
    evidence: body.data.evidence,
  }).returning();

  res.status(201).json(normalizeDispute(dispute as unknown as Record<string, unknown>));
});

router.get("/disputes/:id", requireAuth, async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const [dispute] = await db.select().from(disputesTable).where(eq(disputesTable.id, id));
  if (!dispute) { res.status(404).json({ error: "Dispute not found" }); return; }
  if (dispute.userId !== req.user!.id && req.user!.role !== "admin" && req.user!.role !== "moderator") {
    res.status(403).json({ error: "Access denied" }); return;
  }
  res.json(normalizeDispute(dispute as unknown as Record<string, unknown>));
});

router.put("/disputes/:id/status", requireAdmin, async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const body = UpdateDisputeStatusBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: body.error.issues }); return; }

  const updateData: Record<string, unknown> = { status: body.data.status };
  if (body.data.resolution) {
    updateData.resolution = body.data.resolution;
    updateData.resolvedBy = req.user!.id;
    updateData.resolvedAt = new Date();
  }

  const [dispute] = await db.update(disputesTable)
    .set(updateData)
    .where(eq(disputesTable.id, id))
    .returning();

  if (!dispute) { res.status(404).json({ error: "Dispute not found" }); return; }
  res.json(normalizeDispute(dispute as unknown as Record<string, unknown>));
});

export default router;
