import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, milestonesTable } from "@workspace/db";
import { requireAuth, requireAdmin } from "../middleware/auth";
import { randomUUID } from "crypto";

const router: IRouter = Router();

const MILESTONE_TARGETS: Record<string, number> = {
  first_sale: 1,
  sales_100k: 100000,
  sales_500k: 500000,
  sales_1m: 1000000,
  products_10: 10,
  products_50: 50,
  rating_4_5: 4.5,
  orders_100: 100,
  orders_500: 500,
};

const CreateMilestoneBody = z.object({
  sellerId: z.string(),
  type: z.enum(["first_sale", "sales_100k", "sales_500k", "sales_1m", "products_10", "products_50", "rating_4_5", "orders_100", "orders_500"]),
  rewardAmount: z.number().optional(),
});

const UpdateProgressBody = z.object({
  currentValue: z.number(),
});

function normalizeMilestone(m: Record<string, unknown>) {
  return {
    ...m,
    createdAt: m.createdAt instanceof Date ? (m.createdAt as Date).toISOString() : m.createdAt,
    updatedAt: m.updatedAt instanceof Date ? (m.updatedAt as Date).toISOString() : m.updatedAt,
    achievedAt: m.achievedAt instanceof Date ? (m.achievedAt as Date).toISOString() : (m.achievedAt ?? undefined),
    targetValue: (m.targetValue as number | null) ?? undefined,
    rewardAmount: (m.rewardAmount as number | null) ?? undefined,
  };
}

router.get("/milestones/:seller_id", requireAuth, async (req, res): Promise<void> => {
  const sellerId = Array.isArray(req.params.seller_id) ? req.params.seller_id[0] : req.params.seller_id;
  const milestones = await db.select().from(milestonesTable).where(eq(milestonesTable.sellerId, sellerId));
  res.json({ milestones: milestones.map(m => normalizeMilestone(m as unknown as Record<string, unknown>)), total: milestones.length });
});

router.post("/milestones", requireAdmin, async (req, res): Promise<void> => {
  const body = CreateMilestoneBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: body.error.issues }); return; }

  const targetValue = MILESTONE_TARGETS[body.data.type] ?? 1;

  const [milestone] = await db.insert(milestonesTable).values({
    id: randomUUID(),
    sellerId: body.data.sellerId,
    type: body.data.type,
    targetValue,
    currentValue: 0,
    achieved: false,
    rewardAmount: body.data.rewardAmount,
  }).returning();

  res.status(201).json(normalizeMilestone(milestone as unknown as Record<string, unknown>));
});

router.put("/milestones/:seller_id/progress", requireAdmin, async (req, res): Promise<void> => {
  const sellerId = Array.isArray(req.params.seller_id) ? req.params.seller_id[0] : req.params.seller_id;
  const body = UpdateProgressBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: body.error.issues }); return; }

  const milestones = await db.select().from(milestonesTable)
    .where(eq(milestonesTable.sellerId, sellerId));

  const updated = [];
  for (const m of milestones) {
    if (m.achieved) continue;
    const newValue = body.data.currentValue;
    const achieved = m.targetValue !== null && newValue >= m.targetValue;
    const updatePayload: Record<string, unknown> = { currentValue: newValue, achieved };
    if (achieved) updatePayload.achievedAt = new Date();
    const [updatedM] = await db.update(milestonesTable)
      .set(updatePayload)
      .where(eq(milestonesTable.id, m.id))
      .returning();
    if (updatedM) updated.push(normalizeMilestone(updatedM as unknown as Record<string, unknown>));
  }

  res.json({ updated, count: updated.length });
});

export default router;
