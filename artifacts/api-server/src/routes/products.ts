import { Router, type IRouter } from "express";
import { eq, like, and, gte, lte, type SQL } from "drizzle-orm";
import { db, productsTable } from "@workspace/db";
import {
  ListProductsQueryParams,
  ListProductsResponse,
  GetProductParams,
  GetProductResponse,
  GetFeaturedProductsResponse,
  GetCategoriesResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

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

  const normalized = paginated.map(p => ({
    ...p,
    moq: p.moq ?? undefined,
    costPrice: p.costPrice ?? undefined,
    price: p.price ?? undefined,
    createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
  }));

  res.json(ListProductsResponse.parse({ products: normalized, total }));
});

router.get("/products/featured", async (_req, res): Promise<void> => {
  const products = await db.select().from(productsTable).limit(8);
  const normalized = products.map(p => ({
    ...p,
    moq: p.moq ?? undefined,
    costPrice: p.costPrice ?? undefined,
    price: p.price ?? undefined,
    createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
  }));
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

  const normalized = {
    ...product,
    moq: product.moq ?? undefined,
    costPrice: product.costPrice ?? undefined,
    price: product.price ?? undefined,
    createdAt: product.createdAt instanceof Date ? product.createdAt.toISOString() : product.createdAt,
  };
  res.json(GetProductResponse.parse(normalized));
});

export default router;
