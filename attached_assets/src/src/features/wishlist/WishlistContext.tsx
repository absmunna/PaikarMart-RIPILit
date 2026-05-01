import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface WishlistEntry {
  productId: string;
  title?: string;
  price?: number;
  imageUrl?: string;
  addedAt: string;
}

interface WishlistCtx {
  items: WishlistEntry[];
  count: number;
  has: (productId: string) => boolean;
  toggle: (entry: Omit<WishlistEntry, "addedAt">) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

const STORAGE_KEY = "pm.wishlist.v1";
const WishlistContext = createContext<WishlistCtx | null>(null);

function readStored(): WishlistEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WishlistEntry[]) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistEntry[]>(() => readStored());

  useEffect(() => {
    if (typeof window === "undefined") return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  const has = useCallback((id: string) => items.some((i) => i.productId === id), [items]);

  const toggle = useCallback<WishlistCtx["toggle"]>((entry) => {
    setItems((prev) => {
      if (prev.some((p) => p.productId === entry.productId)) {
        return prev.filter((p) => p.productId !== entry.productId);
      }
      return [{ ...entry, addedAt: new Date().toISOString() }, ...prev];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.productId !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<WishlistCtx>(() => ({
    items, count: items.length, has, toggle, remove, clear,
  }), [items, has, toggle, remove, clear]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return ctx;
}
