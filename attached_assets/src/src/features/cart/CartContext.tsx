import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface CartLine {
  id: string;
  productId: string;
  title: string;
  price: number;
  currency: string;
  imageUrl?: string;
  vendorId?: string;
  vendorName?: string;
  quantity: number;
}

interface CartCtx {
  items: CartLine[];
  itemCount: number;
  subtotal: number;
  add: (line: Omit<CartLine, "id" | "quantity"> & { quantity?: number }) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, qty: number) => void;
  clear: () => void;
  has: (productId: string) => boolean;
}

const STORAGE_KEY = "pm.cart.v1";
const CartContext = createContext<CartCtx | null>(null);

function readStored(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>(() => readStored());

  useEffect(() => {
    if (typeof window === "undefined") return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  const add = useCallback<CartCtx["add"]>((line) => {
    setItems((prev) => {
      const found = prev.find((p) => p.productId === line.productId);
      if (found) {
        return prev.map((p) =>
          p.productId === line.productId
            ? { ...p, quantity: p.quantity + (line.quantity ?? 1) }
            : p,
        );
      }
      return [
        ...prev,
        {
          id: `cl_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
          quantity: line.quantity ?? 1,
          ...line,
        },
      ];
    });
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((p) => p.productId !== productId));
  }, []);

  const setQuantity = useCallback((productId: string, qty: number) => {
    setItems((prev) =>
      prev
        .map((p) => (p.productId === productId ? { ...p, quantity: Math.max(0, qty) } : p))
        .filter((p) => p.quantity > 0),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const has = useCallback((productId: string) => items.some((i) => i.productId === productId), [items]);

  const itemCount = useMemo(() => items.reduce((n, i) => n + i.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items]);

  const value = useMemo<CartCtx>(() => ({
    items, itemCount, subtotal, add, remove, setQuantity, clear, has,
  }), [items, itemCount, subtotal, add, remove, setQuantity, clear, has]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
