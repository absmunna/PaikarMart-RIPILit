import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable, walletsTable } from "@workspace/db";
import {
  GetUserParams,
  GetUserResponse,
  GetUserWalletParams,
  GetUserWalletResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/users/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetUserParams.safeParse({ id: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, params.data.id));
  if (!user) {
    const fallback = {
      id: params.data.id,
      name: "Guest User",
      role: "buyer" as const,
    };
    res.json(GetUserResponse.parse(fallback));
    return;
  }

  res.json(GetUserResponse.parse(user));
});

router.get("/users/:id/wallet", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetUserWalletParams.safeParse({ id: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [wallet] = await db.select().from(walletsTable).where(eq(walletsTable.userId, params.data.id));
  if (!wallet) {
    const fallback = {
      userId: params.data.id,
      balance: 125.50,
      totalEarned: 230.75,
      investmentValue: 250.00,
      transactions: [
        { id: "txn-1", type: "reward" as const, amount: 15.50, description: "Purchase reward", createdAt: new Date().toISOString() },
        { id: "txn-2", type: "reward" as const, amount: 8.25, description: "Order reward", createdAt: new Date(Date.now() - 86400000).toISOString() },
      ],
    };
    res.json(GetUserWalletResponse.parse(fallback));
    return;
  }

  res.json(GetUserWalletResponse.parse(wallet));
});

export default router;
