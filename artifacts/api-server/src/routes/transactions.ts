import { Router, type IRouter } from "express";
import { eq, and, type SQL } from "drizzle-orm";
import { z } from "zod";
import { db, transactionsTable, walletsTable } from "@workspace/db";
import { requireAuth } from "../middleware/auth";
import { randomUUID } from "crypto";

const router: IRouter = Router();

const ListTxQuery = z.object({
  user_id: z.string().optional(),
  type: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  offset: z.coerce.number().int().min(0).optional().default(0),
});

const CreateTxBody = z.object({
  userId: z.string(),
  type: z.enum(["reward", "adjustment", "withdrawal", "deposit", "purchase", "refund", "commission", "bonus"]),
  amount: z.number(),
  description: z.string().optional(),
  referenceId: z.string().optional(),
  referenceType: z.string().optional(),
});

function normalizeTx(t: Record<string, unknown>) {
  return {
    ...t,
    createdAt: t.createdAt instanceof Date ? (t.createdAt as Date).toISOString() : t.createdAt,
    updatedAt: t.updatedAt instanceof Date ? (t.updatedAt as Date).toISOString() : t.updatedAt,
    description: (t.description as string | null) ?? undefined,
    referenceId: (t.referenceId as string | null) ?? undefined,
    referenceType: (t.referenceType as string | null) ?? undefined,
    balanceBefore: (t.balanceBefore as number | null) ?? undefined,
    balanceAfter: (t.balanceAfter as number | null) ?? undefined,
  };
}

router.get("/transactions", async (req, res): Promise<void> => {
  const params = ListTxQuery.safeParse(req.query);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }

  const conditions: SQL[] = [];
  if (params.data.user_id) conditions.push(eq(transactionsTable.userId, params.data.user_id));
  if (params.data.type) conditions.push(eq(transactionsTable.type, params.data.type as "reward"));

  const query = db.select().from(transactionsTable);
  const all = conditions.length > 0 ? await query.where(and(...conditions)) : await query;
  const total = all.length;
  const paginated = all.slice(params.data.offset, params.data.offset + params.data.limit);

  res.json({ transactions: paginated.map(t => normalizeTx(t as unknown as Record<string, unknown>)), total });
});

router.post("/transactions", requireAuth, async (req, res): Promise<void> => {
  const body = CreateTxBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: body.error.message }); return; }

  const [wallet] = await db.select().from(walletsTable).where(eq(walletsTable.userId, body.data.userId));
  const balanceBefore = wallet?.balance ?? 0;
  const balanceAfter = balanceBefore + body.data.amount;

  const [tx] = await db.insert(transactionsTable).values({
    id: randomUUID(),
    userId: body.data.userId,
    type: body.data.type,
    status: "completed",
    amount: body.data.amount,
    balanceBefore,
    balanceAfter,
    description: body.data.description,
    referenceId: body.data.referenceId,
    referenceType: body.data.referenceType,
  }).returning();

  if (wallet) {
    await db.update(walletsTable)
      .set({ balance: balanceAfter })
      .where(eq(walletsTable.userId, body.data.userId));
  }

  res.status(201).json(normalizeTx(tx as unknown as Record<string, unknown>));
});

export default router;
