import { Router, type IRouter } from "express";
import { eq, and, type SQL } from "drizzle-orm";
import { z } from "zod";
import { db, affiliateLinksTable } from "@workspace/db";
import { requireAuth } from "../middleware/auth";
import { randomUUID } from "crypto";

const router: IRouter = Router();

const ListAffiliateQuery = z.object({
  user_id: z.string().optional(),
  is_active: z.enum(["true", "false"]).optional(),
});

const CreateAffiliateBody = z.object({
  targetId: z.string().optional(),
  targetType: z.enum(["product", "seller", "category", "page"]).optional(),
  expiresAt: z.string().optional(),
});

function generateCode(): string {
  return `PM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function normalizeLink(l: Record<string, unknown>) {
  return {
    ...l,
    createdAt: l.createdAt instanceof Date ? (l.createdAt as Date).toISOString() : l.createdAt,
    updatedAt: l.updatedAt instanceof Date ? (l.updatedAt as Date).toISOString() : l.updatedAt,
    expiresAt: l.expiresAt instanceof Date ? (l.expiresAt as Date).toISOString() : (l.expiresAt ?? undefined),
    targetId: (l.targetId as string | null) ?? undefined,
    targetType: (l.targetType as string | null) ?? undefined,
  };
}

router.get("/affiliate", requireAuth, async (req, res): Promise<void> => {
  const params = ListAffiliateQuery.safeParse(req.query);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }

  const conditions: SQL[] = [];
  const userId = params.data.user_id ?? req.user!.id;
  conditions.push(eq(affiliateLinksTable.userId, userId));
  if (params.data.is_active !== undefined) {
    conditions.push(eq(affiliateLinksTable.isActive, params.data.is_active === "true"));
  }

  const links = await db.select().from(affiliateLinksTable).where(and(...conditions));
  res.json({ links: links.map(l => normalizeLink(l as unknown as Record<string, unknown>)), total: links.length });
});

router.post("/affiliate", requireAuth, async (req, res): Promise<void> => {
  const body = CreateAffiliateBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: body.error.message }); return; }

  const [link] = await db.insert(affiliateLinksTable).values({
    id: randomUUID(),
    userId: req.user!.id,
    code: generateCode(),
    targetId: body.data.targetId,
    targetType: body.data.targetType as "product" | "seller" | "category" | "page" | undefined,
    isActive: true,
    clicks: 0,
    conversions: 0,
    expiresAt: body.data.expiresAt ? new Date(body.data.expiresAt) : undefined,
  }).returning();

  res.status(201).json(normalizeLink(link as unknown as Record<string, unknown>));
});

router.get("/affiliate/track/:code", async (req, res): Promise<void> => {
  const code = Array.isArray(req.params.code) ? req.params.code[0] : req.params.code;
  const [link] = await db.select().from(affiliateLinksTable).where(eq(affiliateLinksTable.code, code));
  if (!link) { res.status(404).json({ error: "Affiliate link not found" }); return; }
  if (!link.isActive) { res.status(410).json({ error: "Affiliate link is inactive" }); return; }

  await db.update(affiliateLinksTable)
    .set({ clicks: (link.clicks ?? 0) + 1 })
    .where(eq(affiliateLinksTable.code, code));

  res.json({
    code: link.code,
    targetId: link.targetId ?? undefined,
    targetType: link.targetType ?? undefined,
    clicks: (link.clicks ?? 0) + 1,
  });
});

export default router;
