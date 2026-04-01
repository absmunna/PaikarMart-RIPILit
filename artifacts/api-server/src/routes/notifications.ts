import { Router, type IRouter } from "express";
import { eq, and, type SQL } from "drizzle-orm";
import { db, notificationsTable } from "@workspace/db";
import {
  ListNotificationsQueryParams,
  ListNotificationsResponse,
  MarkNotificationReadParams,
  MarkNotificationReadResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function normalizeNotif(n: Record<string, unknown>) {
  return {
    ...n,
    createdAt: n.createdAt instanceof Date ? (n.createdAt as Date).toISOString() : n.createdAt,
  };
}

router.get("/notifications", async (req, res): Promise<void> => {
  const params = ListNotificationsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const conditions: SQL[] = [];
  if (params.data.user_id) {
    conditions.push(eq(notificationsTable.userId, params.data.user_id));
  }
  if (params.data.unread_only) {
    conditions.push(eq(notificationsTable.read, false));
  }

  const query = db.select().from(notificationsTable);
  const notifications = conditions.length > 0
    ? await query.where(and(...conditions))
    : await query;

  const unreadCount = notifications.filter(n => !n.read).length;
  res.json(ListNotificationsResponse.parse({ notifications: notifications.map(n => normalizeNotif(n as unknown as Record<string, unknown>)), unreadCount }));
});

router.put("/notifications/:id/read", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = MarkNotificationReadParams.safeParse({ id: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [notification] = await db.update(notificationsTable)
    .set({ read: true })
    .where(eq(notificationsTable.id, params.data.id))
    .returning();

  if (!notification) {
    res.status(404).json({ error: "Notification not found" });
    return;
  }

  res.json(MarkNotificationReadResponse.parse(normalizeNotif(notification as unknown as Record<string, unknown>)));
});

export default router;
