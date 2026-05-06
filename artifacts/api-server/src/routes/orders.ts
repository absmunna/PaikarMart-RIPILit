import { Router, type IRouter } from "express";
import { eq, and, type SQL } from "drizzle-orm";
import { db, ordersTable, productsTable } from "@workspace/db";
import {
  ListOrdersQueryParams,
  ListOrdersResponse,
  CreateOrderBody,
  GetOrderParams,
  GetOrderResponse,
  UpdateOrderStatusParams,
  UpdateOrderStatusBody,
  UpdateOrderStatusResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function normalizeOrder(o: Record<string, unknown>) {
  return {
    ...o,
    createdAt: o.createdAt instanceof Date ? (o.createdAt as Date).toISOString() : o.createdAt,
    updatedAt: o.updatedAt instanceof Date ? (o.updatedAt as Date).toISOString() : o.updatedAt,
    trackingCode: o.trackingCode ?? undefined,
    estimatedDelivery: o.estimatedDelivery ?? undefined,
    cancelReason: o.cancelReason ?? undefined,
    area: o.area ?? undefined,
  };
}

router.get("/orders", async (req, res): Promise<void> => {
  const params = ListOrdersQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const conditions: SQL[] = [];
  if (params.data.user_id) {
    conditions.push(eq(ordersTable.userId, params.data.user_id));
  }
  if (params.data.status) {
    conditions.push(eq(ordersTable.status, params.data.status as "pending" | "confirmed" | "processing" | "shipped" | "completed" | "incomplete"));
  }

  const query = db.select().from(ordersTable);
  const orders = conditions.length > 0
    ? await query.where(and(...conditions))
    : await query;

  res.json(ListOrdersResponse.parse({ orders: orders.map(o => normalizeOrder(o as unknown as Record<string, unknown>)), total: orders.length }));
});

router.post("/orders", async (req, res): Promise<void> => {
  const body = CreateOrderBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const orderItems = [];
  let totalAmount = 0;

  for (const item of body.data.items) {
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, item.productId));
    if (!product) {
      res.status(400).json({ error: `Product ${item.productId} not found` });
      return;
    }
    const price = product.price ?? 0;
    const subtotal = price * item.quantity;
    totalAmount += subtotal;
    orderItems.push({
      productId: product.id,
      productName: product.name,
      vendorId: product.vendorId,
      vendorName: product.vendorName,
      quantity: item.quantity,
      price,
      subtotal,
    });
  }

  const deliveryCharge = 60;
  totalAmount += deliveryCharge;

  const id = `ORD-${Date.now()}`;
  const [order] = await db.insert(ordersTable).values({
    id,
    userId: "user-1",
    items: orderItems,
    status: "pending",
    deliveryType: (body.data.deliveryType as "seller_delivery" | "platform_delivery" | "local_delivery" | "pickup") ?? "seller_delivery",
    paymentMethod: body.data.paymentMethod,
    totalAmount,
    deliveryCharge,
    customerName: body.data.customerName,
    customerPhone: body.data.customerPhone,
    customerAddress: body.data.customerAddress,
    district: body.data.district,
    area: body.data.area,
    estimatedDelivery: "3-7 business days",
  }).returning();

  res.status(201).json(GetOrderResponse.parse(normalizeOrder(order as unknown as Record<string, unknown>)));
});

router.get("/orders/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetOrderParams.safeParse({ id: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, params.data.id));
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json(GetOrderResponse.parse(normalizeOrder(order as unknown as Record<string, unknown>)));
});

router.put("/orders/:id/status", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateOrderStatusParams.safeParse({ id: rawId });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = UpdateOrderStatusBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const updateData: Record<string, unknown> = {
    status: body.data.status,
  };
  if (body.data.trackingCode) updateData.trackingCode = body.data.trackingCode;
  if (body.data.estimatedDelivery) updateData.estimatedDelivery = body.data.estimatedDelivery;

  const [order] = await db.update(ordersTable)
    .set(updateData)
    .where(eq(ordersTable.id, params.data.id))
    .returning();

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json(UpdateOrderStatusResponse.parse(normalizeOrder(order as unknown as Record<string, unknown>)));
});

export default router;
