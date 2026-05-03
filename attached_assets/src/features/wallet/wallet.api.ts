import { Wallet } from "./wallet.context";
import { api } from "@/lib/api";

interface ApiTransaction {
  id: string;
  userId: string;
  type: "reward" | "deposit" | "withdraw" | "withdrawal" | "payment" | "escrow";
  amount: number;
  description: string | null;
  createdAt: string;
}

interface ApiWallet {
  userId: string;
  balance: number;
  totalEarned: number;
  investmentValue: number;
  updatedAt: string;
  transactions: ApiTransaction[];
}

function normalizeType(t: ApiTransaction["type"]): "reward" | "deposit" | "withdrawal" | "payment" {
  if (t === "withdraw") return "withdrawal";
  if (t === "escrow") return "payment";
  return t as "reward" | "deposit" | "withdrawal" | "payment";
}

export async function getWallet(_userId: string): Promise<Wallet> {
  const w = await api.get<ApiWallet>("/api/wallet");
  return {
    balance: w.balance,
    totalEarned: w.totalEarned,
    investmentValue: w.investmentValue,
    transactions: (w.transactions ?? []).map((t) => ({
      id: t.id,
      type: normalizeType(t.type),
      amount: t.type === "withdraw" || t.type === "withdrawal" ? -Math.abs(t.amount) : t.amount,
      createdAt: t.createdAt,
      description: t.description ?? undefined,
    })),
  };
}

export async function depositToWallet(amount: number): Promise<{ ok: boolean; balance: number }> {
  return api.post("/api/wallet/deposit", { amount });
}

export async function withdrawFromWallet(amount: number): Promise<{ ok: boolean; balance: number }> {
  return api.post("/api/wallet/withdraw", { amount });
}
