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

  const normalized = {
    ...user,
    createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
    email: user.email ?? undefined,
    phone: user.phone ?? undefined,
    district: user.district ?? undefined,
    area: user.area ?? undefined,
    profileImage: (user as Record<string, unknown>).profileImage ?? undefined,
  };
  res.json(GetUserResponse.parse(normalized));
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
      balance: 0,
      totalEarned: 0,
      investmentValue: 0,
      transactions: [],
    };
    res.json(GetUserWalletResponse.parse(fallback));
    return;
  }

  const validTypes = new Set(["reward", "adjustment"]);
  const normalizedWallet = {
    ...wallet,
    transactions: Array.isArray(wallet.transactions)
      ? (wallet.transactions as Record<string, unknown>[]).map(tx => ({
          ...tx,
          type: validTypes.has(tx.type as string) ? tx.type : "adjustment",
          createdAt: tx.createdAt instanceof Date ? (tx.createdAt as Date).toISOString() : tx.createdAt,
          description: tx.description ?? undefined,
        }))
      : [],
  };

  res.json(GetUserWalletResponse.parse(normalizedWallet));
});

export default router;
