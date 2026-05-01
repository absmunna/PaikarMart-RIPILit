import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { getWallet } from "./wallet.api";
import { useAuth } from "../auth/auth.context";

export interface Transaction {
  id: string;
  type: "reward" | "deposit" | "withdrawal" | "payment";
  amount: number;
  createdAt: string;
  description?: string;
}

export interface Wallet {
  balance: number;
  totalEarned: number;
  investmentValue: number;
  transactions: Transaction[];
}

interface WalletContextValue {
  wallet: Wallet | null;
  isLoading: boolean;
  refresh: () => void;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWallet = async () => {
    if (!user) {
      setWallet(null);
      return;
    }
    setIsLoading(true);
    try {
      const data = await getWallet(user.id);
      setWallet(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, [user]);

  const value = useMemo<WalletContextValue>(() => ({
    wallet,
    isLoading,
    refresh: fetchWallet,
  }), [wallet, isLoading, user]);

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
