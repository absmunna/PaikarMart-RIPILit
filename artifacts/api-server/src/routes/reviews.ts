import { Router, type IRouter } from "express";
import { eq, and, type SQL } from "drizzle-orm";
import { z } from "zod";
import { db, reviewsTable, productsTable } from "@workspace/db";
import { requireAuth } from "../middleware/auth";
import { randomUUID } from "crypto";

const router: IRouter = Router();

const ListReviewsQuery = z.object({
  product_id: z.string().optional(),
  vendor_id: z.string().optional(),
  user_id: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  offset: z.coerce.number().int().min(0).optional().default(0),
});

const CreateReviewBody = z.object({
  productId: z.string(),
  vendorId: z.string().optional(),
  orderId: z.string().optional(),
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().optional(),
  images: z.array(z.string()).optional(),
});

function normalizeReview(r: Record<string, unknown>) {
  return {
    ...r,
    createdAt: r.createdAt instanceof Date ? (r.createdAt as Date).toISOString() : r.createdAt,
    updatedAt: r.updatedAt instanceof Date ? (r.updatedAt as Date).toISOString() : r.updatedAt,
    moderatedAt: r.moderatedAt instanceof Date ? (r.moderatedAt as Date).toISOString() : (r.moderatedAt ?? undefined),
    title: (r.title as string | null) ?? undefined,
    comment: (r.comment as string | null) ?? undefined,
    vendorId: (r.vendorId as string | null) ?? undefined,
    orderId: (r.orderId as string | null) ?? undefined,
    images: (r.images as string[] | null) ?? undefined,
  };
}

router.get("/reviews", async (req, res): Promise<void> => {
  const params = ListReviewsQuery.safeParse(req.query);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }

  const conditions: SQL[] = [];
  if (params.data.product_id) conditions.push(eq(reviewsTable.productId, params.data.product_id));
  if (params.data.vendor_id) conditions.push(eq(reviewsTable.vendorId, params.data.vendor_id));
  if (params.data.user_id) conditions.push(eq(reviewsTable.userId, params.data.user_id));

  const query = db.select().from(reviewsTable);
  const all = conditions.length > 0 ? await query.where(and(...conditions)) : await query;
  const total = all.length;
  const paginated = all.slice(params.data.offset, params.data.offset + params.data.limit);

  res.json({ reviews: paginated.map(r => normalizeReview(r as unknown as Record<string, unknown>)), total });
});

router.get("/reviews/:id", async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const [review] = await db.select().from(reviewsTable).where(eq(reviewsTable.id, id));
  if (!review) { res.status(404).json({ error: "Review not found" }); return; }
  res.json(normalizeReview(review as unknown as Record<string, unknown>));
});

router.post("/reviews", requireAuth, async (req, res): Promise<void> => {
  const body = CreateReviewBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: body.error.message }); return; }

  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, body.data.productId));
  if (!product) { res.status(404).json({ error: "Product not found" }); return; }

  const [review] = await db.insert(reviewsTable).values({
    id: randomUUID(),
    productId: body.data.productId,
    vendorId: body.data.vendorId ?? product.vendorId,
    userId: req.user!.id,
    orderId: body.data.orderId,
    rating: body.data.rating,
    title: body.data.title,
    comment: body.data.comment,
    images: body.data.images,
    isVerifiedPurchase: false,
  }).returning();

  const allReviews = await db.select().from(reviewsTable).where(eq(reviewsTable.productId, body.data.productId));
  const avgRating = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
  await db.update(productsTable)
    .set({ rating: Math.round(avgRating * 10) / 10, reviewCount: allReviews.length })
    .where(eq(productsTable.id, body.data.productId));

  res.status(201).json(normalizeReview(review as unknown as Record<string, unknown>));
});

router.delete("/reviews/:id", requireAuth, async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const [review] = await db.select().from(reviewsTable).where(eq(reviewsTable.id, id));
  if (!review) { res.status(404).json({ error: "Review not found" }); return; }
  if (review.userId !== req.user!.id && req.user!.role !== "admin") {
    res.status(403).json({ error: "Cannot delete another user's review" });
    return;
  }
  await db.delete(reviewsTable).where(eq(reviewsTable.id, id));
  res.json({ deleted: true });
});

export default router;
