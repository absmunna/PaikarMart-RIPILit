import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getProfitShare } from "@/config/profitShare.config";

export interface PKCoinTx {
  id: string;
  kind: "earn" | "spend" | "refund" | "bonus";
  amount: number;
  note?: string;
  at: string;
}

interface WalletState {
  balance: number;
  lifetimeEarned: number;
  lifetimeSpent: number;
  history: PKCoinTx[];
}

interface PKCoinCtx extends WalletState {
  earnFromOrder: (orderTotal: number, isPlatformOwned: boolean) => number;
  spend: (amount: number, note?: string) => boolean;
  bonus: (amount: number, note: string) => void;
  reset: () => void;
}

const STORAGE_KEY = "pm.pkcoin.v1";
const PKCoinContext = createContext<PKCoinCtx | null>(null);

const EMPTY: WalletState = { balance: 0, lifetimeEarned: 0, lifetimeSpent: 0, history: [] };

function readStored(): WalletState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WalletState) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function nextTx(kind: PKCoinTx["kind"], amount: number, note?: string): PKCoinTx {
  return {
    id: `tx_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    kind, amount, note, at: new Date().toISOString(),
  };
}

export function PKCoinProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>(() => readStored());

  useEffect(() => {
    if (typeof window === "undefined") return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  const earnFromOrder = useCallback((orderTotal: number, isPlatformOwned: boolean) => {
    const cfg = getProfitShare();
    if (!cfg.enabled) return 0;
    if (cfg.pkCoinOnlyOnOwnProducts && !isPlatformOwned) return 0;
    const reward = Math.round((orderTotal * cfg.pkCoinRewardPercent) / 100);
    if (reward <= 0) return 0;
    setState((s) => ({
      ...s,
      balance: s.balance + reward,
      lifetimeEarned: s.lifetimeEarned + reward,
      history: [nextTx("earn", reward, `Order reward (${cfg.pkCoinRewardPercent}%)`), ...s.history].slice(0, 200),
    }));
    return reward;
  }, []);

  const spend = useCallback((amount: number, note?: string) => {
    let ok = false;
    setState((s) => {
      if (s.balance < amount) return s;
      ok = true;
      return {
        ...s,
        balance: s.balance - amount,
        lifetimeSpent: s.lifetimeSpent + amount,
        history: [nextTx("spend", amount, note), ...s.history].slice(0, 200),
      };
    });
    return ok;
  }, []);

  const bonus = useCallback((amount: number, note: string) => {
    setState((s) => ({
      ...s,
      balance: s.balance + amount,
      lifetimeEarned: s.lifetimeEarned + amount,
      history: [nextTx("bonus", amount, note), ...s.history].slice(0, 200),
    }));
  }, []);

  const reset = useCallback(() => setState(EMPTY), []);

  const value = useMemo<PKCoinCtx>(() => ({
    ...state, earnFromOrder, spend, bonus, reset,
  }), [state, earnFromOrder, spend, bonus, reset]);

  return <PKCoinContext.Provider value={value}>{children}</PKCoinContext.Provider>;
}

export function usePKCoin() {
  const ctx = useContext(PKCoinContext);
  if (!ctx) throw new Error("usePKCoin must be used inside <PKCoinProvider>");
  return ctx;
}
