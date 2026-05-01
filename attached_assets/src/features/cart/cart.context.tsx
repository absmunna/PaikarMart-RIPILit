import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

export interface CartItem {
  id: string;
  rowId?: number;
  title: string;
  price: number;
  image: string;
  qty: number;
  sellerId?: string;
  sellerName: string;
}

interface ApiCartItem {
  id: number;
  userId: string;
  productId: string;
  title: string;
  image: string | null;
  price: number;
  qty: number;
  sellerId: string | null;
  sellerName: string | null;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (item: Omit<CartItem, "qty" | "rowId">, qty?: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  setQty: (id: string, qty: number) => Promise<void>;
  clear: () => Promise<void>;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

function adapt(i: ApiCartItem): CartItem {
  return {
    id: i.productId,
    rowId: i.id,
    title: i.title,
    price: i.price,
    image: i.image ?? "",
    qty: i.qty,
    sellerId: i.sellerId ?? undefined,
    sellerName: i.sellerName ?? "",
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const refresh = useCallback(async () => {
    try {
      const list = await api.get<ApiCartItem[]>("/api/cart");
      setItems(list.map(adapt));
    } catch (e) {
      console.error("[cart] refresh failed", e);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem: CartContextValue["addItem"] = useCallback(
    async (item, qty = 1) => {
      try {
        await api.post("/api/cart", {
          productId: item.id,
          title: item.title,
          image: item.image,
          price: item.price,
          qty,
          sellerId: item.sellerId,
          sellerName: item.sellerName,
        });
        await refresh();
      } catch (e) {
        console.error("[cart] add failed", e);
      }
    },
    [refresh]
  );

  const removeItem = useCallback(
    async (id: string) => {
      const target = items.find((i) => i.id === id);
      if (!target?.rowId) return;
      try {
        await api.del(`/api/cart/${target.rowId}`);
        await refresh();
      } catch (e) {
        console.error("[cart] remove failed", e);
      }
    },
    [items, refresh]
  );

  const setQty = useCallback(
    async (id: string, qty: number) => {
      const target = items.find((i) => i.id === id);
      if (!target?.rowId) return;
      try {
        await api.patch(`/api/cart/${target.rowId}`, { qty });
        await refresh();
      } catch (e) {
        console.error("[cart] qty failed", e);
      }
    },
    [items, refresh]
  );

  const clear = useCallback(async () => {
    try {
      await api.del("/api/cart");
      setItems([]);
    } catch (e) {
      console.error("[cart] clear failed", e);
    }
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((s, i) => s + i.qty, 0),
      total: items.reduce((s, i) => s + i.qty * i.price, 0),
      addItem,
      removeItem,
      setQty,
      clear,
      refresh,
    }),
    [items, addItem, removeItem, setQty, clear, refresh]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
