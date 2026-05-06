import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, commissionsConfigTable } from "@workspace/db";
import { requireAdmin } from "../middleware/auth";

const router: IRouter = Router();

const UpdateCommissionBody = z.object({
  percent: z.number().min(0).max(100),
  minPercent: z.number().min(0).max(100).optional(),
  maxPercent: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
});

function normalizeComm(c: Record<string, unknown>) {
  return {
    ...c,
    createdAt: c.createdAt instanceof Date ? (c.createdAt as Date).toISOString() : c.createdAt,
    updatedAt: c.updatedAt instanceof Date ? (c.updatedAt as Date).toISOString() : c.updatedAt,
    minPercent: (c.minPercent as number | null) ?? undefined,
    maxPercent: (c.maxPercent as number | null) ?? undefined,
    notes: (c.notes as string | null) ?? undefined,
  };
}

router.get("/commissions", async (_req, res): Promise<void> => {
  const all = await db.select().from(commissionsConfigTable);
  res.json({ commissions: all.map(c => normalizeComm(c as unknown as Record<string, unknown>)), total: all.length });
});

router.get("/commissions/:seller_type", async (req, res): Promise<void> => {
  const sellerType = Array.isArray(req.params.seller_type) ? req.params.seller_type[0] : req.params.seller_type;
  const [comm] = await db.select().from(commissionsConfigTable).where(eq(commissionsConfigTable.sellerType, sellerType));
  if (!comm) { res.status(404).json({ error: "Commission config not found for this seller type" }); return; }
  res.json(normalizeComm(comm as unknown as Record<string, unknown>));
});

router.put("/commissions/:seller_type", requireAdmin, async (req, res): Promise<void> => {
  const sellerType = Array.isArray(req.params.seller_type) ? req.params.seller_type[0] : req.params.seller_type;
  const body = UpdateCommissionBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: body.error.message }); return; }

  const [comm] = await db.update(commissionsConfigTable)
    .set({
      percent: body.data.percent,
      minPercent: body.data.minPercent,
      maxPercent: body.data.maxPercent,
      notes: body.data.notes,
    })
    .where(eq(commissionsConfigTable.sellerType, sellerType))
    .returning();

  if (!comm) { res.status(404).json({ error: "Commission config not found for this seller type" }); return; }
  res.json(normalizeComm(comm as unknown as Record<string, unknown>));
});

export default router;
