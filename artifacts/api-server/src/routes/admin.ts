import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable, sellersTable, ordersTable } from "@workspace/db";
import {
  GetAdminDashboardResponse,
  GetMarketStatsResponse,
} from "@workspace/api-zod";

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

router.get("/admin/dashboard", async (_req, res): Promise<void> => {
  const users = await db.select().from(usersTable);
  const sellers = await db.select().from(sellersTable);
  const orders = await db.select().from(ordersTable);

  const activeSellers = sellers.filter(s => s.status === "active" || s.status === "approved").length;
  const pendingSellers = sellers.filter(s => s.status === "pending").length;
  const completedOrders = orders.filter(o => o.status === "completed");
  const totalSales = completedOrders.reduce((sum, o) => sum + (o.totalAmount ?? 0), 0);
  const platformProfit = totalSales * 0.1;
  const totalCost = totalSales * 0.7;

  const recentOrders = orders.slice(-5).reverse().map(o => normalizeOrder(o as unknown as Record<string, unknown>));
  const recentSellers = sellers.slice(-5).reverse().map(s => normalizeSeller(s as unknown as Record<string, unknown>));

  res.json(GetAdminDashboardResponse.parse({
    totalUsers: users.length,
    totalSellers: sellers.length,
    activeSellers,
    pendingSellers,
    totalOrders: orders.length,
    totalSales,
    platformProfit,
    totalCost,
    recentOrders,
    recentSellers,
  }));
});

router.get("/admin/market-stats", async (_req, res): Promise<void> => {
  const orders = await db.select().from(ordersTable);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  const monthly = months.slice(0, now.getMonth() + 1).map((month, i) => {
    const monthOrders = orders.filter(o => {
      const d = new Date(o.createdAt);
      return d.getMonth() === i && d.getFullYear() === now.getFullYear();
    });
    const sales = monthOrders.reduce((sum, o) => sum + (o.totalAmount ?? 0), 0);
    const cost = sales * 0.7;
    const profit = sales * 0.3;
    return { month, sales, cost, profit };
  });

  const lastTwo = monthly.slice(-2);
  let changePercent = 0;
  let trend: "up" | "down" | "stable" = "stable";
  if (lastTwo.length === 2 && lastTwo[0].profit > 0) {
    changePercent = ((lastTwo[1].profit - lastTwo[0].profit) / lastTwo[0].profit) * 100;
    trend = changePercent > 0 ? "up" : changePercent < 0 ? "down" : "stable";
  }

  res.json(GetMarketStatsResponse.parse({
    monthly,
    changePercent: Math.round(changePercent * 10) / 10,
    trend,
  }));
});

export default router;
