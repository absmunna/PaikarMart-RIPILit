import { Router, type IRouter } from "express";
import { eq, or } from "drizzle-orm";
import { db, usersTable, walletsTable } from "@workspace/db";
import { randomUUID } from "crypto";

const router: IRouter = Router();

router.post("/auth/login", async (req, res): Promise<void> => {
  const { phone, email, role } = req.body as { phone?: string; email?: string; role?: string };

  if (!phone && !email) {
    res.status(400).json({ error: "phone or email required" });
    return;
  }

  const conditions = [];
  if (phone) conditions.push(eq(usersTable.phone, phone));
  if (email) conditions.push(eq(usersTable.email, email));

  const [existing] = await db.select().from(usersTable).where(or(...conditions));

  if (existing) {
    res.json({ user: existing });
    return;
  }

  // Auto-register new user
  const id = randomUUID();
  const name = phone ? `User ${phone.slice(-4)}` : (email?.split("@")[0] ?? "User");
  const userRole = (role === "seller" || role === "admin") ? role : "buyer";

  const [newUser] = await db
    .insert(usersTable)
    .values({ id, name, phone, email, role: userRole as "buyer" | "seller" | "admin" })
    .returning();

  await db.insert(walletsTable).values({
    userId: id,
    balance: 0,
    totalEarned: 0,
    investmentValue: 0,
    transactions: [],
  }).onConflictDoNothing();

  res.status(201).json({ user: newUser });
});

router.post("/auth/register", async (req, res): Promise<void> => {
  const { name, phone, email, role, district, area } = req.body as {
    name?: string; phone?: string; email?: string;
    role?: string; district?: string; area?: string;
  };

  if (!name) { res.status(400).json({ error: "name required" }); return; }
  if (!phone && !email) { res.status(400).json({ error: "phone or email required" }); return; }

  const conditions = [];
  if (phone) conditions.push(eq(usersTable.phone, phone));
  if (email) conditions.push(eq(usersTable.email, email));

  const [existing] = await db.select().from(usersTable).where(or(...conditions));
  if (existing) {
    res.status(409).json({ error: "User already exists with this phone/email" });
    return;
  }

  const id = randomUUID();
  const userRole = (role === "seller" || role === "admin") ? role : "buyer";

  const [user] = await db
    .insert(usersTable)
    .values({ id, name, phone, email, role: userRole as "buyer" | "seller" | "admin", district, area })
    .returning();

  await db.insert(walletsTable).values({
    userId: id,
    balance: 0,
    totalEarned: 0,
    investmentValue: 0,
    transactions: [],
  }).onConflictDoNothing();

  res.status(201).json({ user });
});

export default router;
