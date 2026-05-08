import { Router, type IRouter, type Request, type Response } from "express";
import { eq, like, and, or, gte, lte, type SQL } from "drizzle-orm";
import { z } from "zod/v4";
import { db, productsTable, sellersTable } from "@workspace/db";
import {
  ListProductsQueryParams,
  ListProductsResponse,
  GetProductParams,
  GetProductResponse,
  GetFeaturedProductsResponse,
  GetCategoriesResponse,
} from "@workspace/api-zod";
import { requireSeller } from "../middleware/auth";
import { randomUUID } from "crypto";

const router: IRouter = Router();

function normalizeProduct(p: Record<string, unknown>) {
  return {
    ...p,
    moq: p.moq ?? undefined,
    costPrice: p.costPrice ?? undefined,
    price: p.price ?? undefined,
    createdAt: p.createdAt instanceof Date ? (p.createdAt as Date).toISOString() : p.createdAt,
  };
}

const CreateProductBody = z.object({
  name: z.string().min(2),
  category: z.string(),
  subcategory: z.string().optional(),
  type: z.enum(["physical", "digital", "service"]).default("physical"),
  price: z.number().positive().optional(),
  costPrice: z.number().positive().optional(),
  stock: z.number().int().min(0).default(0),
  moq: z.number().int().min(1).optional(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  location: z.string().optional(),
  priceOnInquiry: z.boolean().optional(),
  deliveryDays: z.string().optional(),
  inStock: z.boolean().optional(),
});

const UpdateProductBody = CreateProductBody.partial();

async function resolveSellerForRequest(req: Request) {
  const user = req.user!;
  const conditions: SQL[] = [eq(sellersTable.id, user.id)];
  if (user.email) conditions.push(eq(sellersTable.email, user.email));
  if (user.phone) conditions.push(eq(sellersTable.phone, user.phone));

  const query = db.select().from(sellersTable);
  const [seller] = conditions.length === 1
    ? await query.where(conditions[0])
    : await query.where(or(...conditions));

  return seller;
}

async function requireRequestSeller(req: Request, res: Response) {
  const seller = await resolveSellerForRequest(req);
  if (!seller) {
    res.status(403).json({ error: "Seller profile not found for authenticated user." });
    return null;
  }
  return seller;
}

router.get("/products", async (req, res): Promise<void> => {
  const params = ListProductsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const conditions: SQL[] = [];
  if (params.data.category) {
    conditions.push(like(productsTable.category, `%${params.data.category}%`));
  }
  if (params.data.vendor_id) {
    conditions.push(eq(productsTable.vendorId, params.data.vendor_id));
  }
  if (params.data.type) {
    conditions.push(eq(productsTable.type, params.data.type as "physical" | "digital" | "service"));
  }
  if (params.data.search) {
    conditions.push(like(productsTable.name, `%${params.data.search}%`));
  }
  if (params.data.location) {
    conditions.push(like(productsTable.location ?? "", `%${params.data.location}%`));
  }
  if (params.data.min_price !== undefined) {
    conditions.push(gte(productsTable.price ?? 0, params.data.min_price));
  }
  if (params.data.max_price !== undefined) {
    conditions.push(lte(productsTable.price ?? 0, params.data.max_price));
  }

  const query = db.select().from(productsTable);
  const products = conditions.length > 0
    ? await query.where(and(...conditions))
    : await query;

  const total = products.length;
  const offset = params.data.offset ?? 0;
  const limit = params.data.limit ?? 20;
  const paginated = products.slice(offset, offset + limit);

  res.json(ListProductsResponse.parse({ products: paginated.map(p => normalizeProduct(p as unknown as Record<string, unknown>)), total }));
});

router.get("/products/featured", async (_req, res): Promise<void> => {
  const products = await db.select().from(productsTable).limit(8);
  const normalized = products.map(p => normalizeProduct(p as unknown as Record<string, unknown>));
  res.json(GetFeaturedProductsResponse.parse({ products: normalized, total: normalized.length }));
});

router.get("/products/categories", async (_req, res): Promise<void> => {
  const products = await db.select({ category: productsTable.category }).from(productsTable);
  const categoryMap = new Map<string, number>();
  for (const p of products) {
    if (p.category) {
      categoryMap.set(p.category, (categoryMap.get(p.category) ?? 0) + 1);
    }
  }
  const categories = Array.from(categoryMap.entries()).map(([name, count], i) => ({
    id: `cat-${i}`,
    name,
    icon: "📦",
    productCount: count,
  }));
  res.json(GetCategoriesResponse.parse({ categories }));
});

router.post("/products", requireSeller, async (req, res): Promise<void> => {
  const body = CreateProductBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.issues });
    return;
  }

  const seller = await requireRequestSeller(req, res);
  if (!seller) return;

  const id = randomUUID();
  const [product] = await db.insert(productsTable).values({
    id,
    name: body.data.name,
    category: body.data.category,
    subcategory: body.data.subcategory,
    type: body.data.type,
    price: body.data.price,
    costPrice: body.data.costPrice,
    stock: body.data.stock,
    moq: body.data.moq,
    description: body.data.description,
    images: body.data.images,
    vendorId: seller.id,
    vendorName: seller.shopName,
    location: body.data.location,
    priceOnInquiry: body.data.priceOnInquiry ?? false,
    deliveryDays: body.data.deliveryDays,
    inStock: body.data.inStock ?? (body.data.stock !== undefined ? body.data.stock > 0 : true),
  }).returning();

  res.status(201).json(GetProductResponse.parse(normalizeProduct(product as unknown as Record<string, unknown>)));
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetProductParams.safeParse({ id: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, params.data.id));
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json(GetProductResponse.parse(normalizeProduct(product as unknown as Record<string, unknown>)));
});

router.put("/products/:id", requireSeller, async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const body = UpdateProductBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.issues });
    return;
  }

  const [existing] = await db.select().from(productsTable).where(eq(productsTable.id, id));
  if (!existing) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  if (req.user!.role !== "admin") {
    const seller = await requireRequestSeller(req, res);
    if (!seller) return;
    if (existing.vendorId !== seller.id) {
      res.status(403).json({ error: "You can only edit your own products" });
      return;
    }
  }

  const updateData: Record<string, unknown> = { ...body.data };
  if (body.data.stock !== undefined) {
    updateData.inStock = body.data.inStock ?? body.data.stock > 0;
  }

  const [product] = await db.update(productsTable)
    .set(updateData)
    .where(eq(productsTable.id, id))
    .returning();

  res.json(GetProductResponse.parse(normalizeProduct(product as unknown as Record<string, unknown>)));
});

router.delete("/products/:id", requireSeller, async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const [existing] = await db.select().from(productsTable).where(eq(productsTable.id, id));
  if (!existing) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  if (req.user!.role !== "admin") {
    const seller = await requireRequestSeller(req, res);
    if (!seller) return;
    if (existing.vendorId !== seller.id) {
      res.status(403).json({ error: "You can only delete your own products" });
      return;
    }
  }

  await db.delete(productsTable).where(eq(productsTable.id, id));
  res.json({ deleted: true, id });
});

export default router;
