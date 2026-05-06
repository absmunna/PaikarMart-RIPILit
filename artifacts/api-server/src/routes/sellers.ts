import { Router, type IRouter } from "express";
import { eq, and, type SQL } from "drizzle-orm";
import { db, sellersTable, productsTable, ordersTable } from "@workspace/db";
import {
  ListSellersQueryParams,
  ListSellersResponse,
  GetSellerParams,
  GetSellerResponse,
  GetSellerProductsParams,
  GetSellerProductsResponse,
  RegisterSellerBody,
  ApproveSellerParams,
  ApproveSellerResponse,
  GetSellerDashboardParams,
  GetSellerDashboardResponse,
} from "@workspace/api-zod";
import { randomUUID } from "crypto";

const router: IRouter = Router();

function normalizeSeller(s: Record<string, unknown>) {
  return {
    ...s,
    createdAt: s.createdAt instanceof Date ? (s.createdAt as Date).toISOString() : s.createdAt,
    phone: s.phone ?? undefined,
    email: s.email ?? undefined,
    address: s.address ?? undefined,
    location: s.location ?? undefined,
    district: s.district ?? undefined,
    rating: s.rating ?? undefined,
    totalProducts: s.totalProducts ?? undefined,
    totalSales: s.totalSales ?? undefined,
    image: s.image ?? undefined,
    description: s.description ?? undefined,
    deliveryTypes: s.deliveryTypes ?? undefined,
    coverageAreas: s.coverageAreas ?? undefined,
  };
}

function normalizeProduct(p: Record<string, unknown>) {
  return {
    ...p,
    moq: p.moq ?? undefined,
    costPrice: p.costPrice ?? undefined,
    price: p.price ?? undefined,
    createdAt: p.createdAt instanceof Date ? (p.createdAt as Date).toISOString() : p.createdAt,
  };
}

function normalizeOrder(o: Record<string, unknown>) {
  return {
    ...o,
    createdAt: o.createdAt instanceof Date ? (o.createdAt as Date).toISOString() : o.createdAt,
    updatedAt: o.updatedAt instanceof Date ? (o.updatedAt as Date).toISOString() : o.updatedAt,
  };
}

router.get("/sellers", async (req, res): Promise<void> => {
  const params = ListSellersQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const conditions: SQL[] = [];
  if (params.data.type) {
    conditions.push(eq(sellersTable.businessType, params.data.type as "wholesaler" | "retailer" | "brand_seller" | "local_shop" | "dropship" | "service"));
  }
  if (params.data.status) {
    conditions.push(eq(sellersTable.status, params.data.status as "pending" | "approved" | "active" | "suspended"));
  }

  const query = db.select().from(sellersTable);
  const sellers = conditions.length > 0
    ? await query.where(and(...conditions))
    : await query;

  res.json(ListSellersResponse.parse({ sellers: sellers.map(normalizeSeller), total: sellers.length }));
});

router.get("/sellers/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetSellerParams.safeParse({ id: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [seller] = await db.select().from(sellersTable).where(eq(sellersTable.id, params.data.id));
  if (!seller) {
    res.status(404).json({ error: "Seller not found" });
    return;
  }

  res.json(GetSellerResponse.parse(normalizeSeller(seller as unknown as Record<string, unknown>)));
});

router.get("/sellers/:id/products", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetSellerProductsParams.safeParse({ id: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const products = await db.select().from(productsTable).where(eq(productsTable.vendorId, params.data.id));
  res.json(GetSellerProductsResponse.parse({ products: products.map(p => normalizeProduct(p as unknown as Record<string, unknown>)), total: products.length }));
});

router.post("/sellers/:id/register", async (req, res): Promise<void> => {
  const body = RegisterSellerBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const id = randomUUID();
  const [seller] = await db.insert(sellersTable).values({
    id,
    shopName: body.data.shopName,
    businessType: body.data.businessType as "wholesaler" | "retailer" | "brand_seller" | "local_shop" | "dropship" | "service",
    phone: body.data.phone,
    email: body.data.email,
    address: body.data.address,
    district: body.data.district,
    status: "pending",
  }).returning();

  res.status(201).json(GetSellerResponse.parse(normalizeSeller(seller as unknown as Record<string, unknown>)));
});

router.put("/sellers/:id/approve", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = ApproveSellerParams.safeParse({ id: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [seller] = await db.update(sellersTable)
    .set({ status: "approved" })
    .where(eq(sellersTable.id, params.data.id))
    .returning();

  if (!seller) {
    res.status(404).json({ error: "Seller not found" });
    return;
  }

  res.json(ApproveSellerResponse.parse(normalizeSeller(seller as unknown as Record<string, unknown>)));
});

router.get("/sellers/:id/dashboard", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetSellerDashboardParams.safeParse({ id: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const products = await db.select().from(productsTable).where(eq(productsTable.vendorId, params.data.id));
  const inStock = products.filter(p => p.inStock).length;
  const outOfStock = products.filter(p => !p.inStock).length;

  const allOrders = await db.select().from(ordersTable);
  const sellerOrders = allOrders.filter(o => {
    const items = o.items as Array<{ vendorId: string }>;
    return items.some(i => i.vendorId === params.data.id);
  });

  const pendingOrders = sellerOrders.filter(o => o.status === "pending").length;
  const completedOrders = sellerOrders.filter(o => o.status === "completed").length;
  const totalSales = sellerOrders.filter(o => o.status === "completed").reduce((sum, o) => sum + (o.totalAmount ?? 0), 0);
  const estimatedProfit = totalSales * 0.25;

  const recentOrders = sellerOrders.slice(0, 5).map(o => normalizeOrder(o as unknown as Record<string, unknown>));

  res.json(GetSellerDashboardResponse.parse({
    totalProducts: products.length,
    inStock,
    outOfStock,
    totalOrders: sellerOrders.length,
    pendingOrders,
    completedOrders,
    totalSales,
    estimatedProfit,
    recentOrders,
  }));
});

export default router;
