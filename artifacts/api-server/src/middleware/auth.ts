import type { Request, Response, NextFunction } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; name: string | null; role: string };
    }
  }
}

async function resolveUser(req: Request): Promise<{ id: string; name: string | null; role: string } | null> {
  const userId = req.headers["x-user-id"] as string | undefined;
  if (!userId) return null;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user) return null;
  return { id: user.id, name: user.name, role: user.role };
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const user = await resolveUser(req);
  if (!user) {
    res.status(401).json({ error: "Authentication required. Send x-user-id header." });
    return;
  }
  req.user = user;
  next();
}

export async function requireSeller(req: Request, res: Response, next: NextFunction): Promise<void> {
  const user = await resolveUser(req);
  if (!user) { res.status(401).json({ error: "Authentication required." }); return; }
  if (user.role !== "seller" && user.role !== "admin") {
    res.status(403).json({ error: "Seller access required." });
    return;
  }
  req.user = user;
  next();
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  const user = await resolveUser(req);
  if (!user) { res.status(401).json({ error: "Authentication required." }); return; }
  if (user.role !== "admin" && user.role !== "moderator") {
    res.status(403).json({ error: "Admin or moderator access required." });
    return;
  }
  req.user = user;
  next();
}
