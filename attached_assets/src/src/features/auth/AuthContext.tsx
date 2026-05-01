import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type AppRole = "guest" | "user" | "seller" | "admin" | "moderator";

export interface AppUser {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  role: AppRole;
  /** Only present when role === "seller" */
  seller?: {
    shopName: string;
    type: "retail" | "wholesale" | "service";
    subType?: string;
    category?: string;
    location?: string;
    payoutMethod?: { kind: "bank" | "mobile"; details?: Record<string, string> };
  };
  createdAt: string;
}

interface AuthCtx {
  user: AppUser | null;
  isAuthenticated: boolean;
  role: AppRole;
  loginWithPhone: (phone: string, password: string) => Promise<AppUser>;
  registerUser: (input: Omit<AppUser, "id" | "role" | "createdAt"> & { password: string }) => Promise<AppUser>;
  registerSeller: (input: Omit<AppUser, "id" | "role" | "createdAt"> & { password: string; seller: NonNullable<AppUser["seller"]> }) => Promise<AppUser>;
  logout: () => void;
  /** Demo-only — promote any logged-in user to admin (UI gating). Calls API. */
  promoteToAdmin: () => Promise<void>;
  /** Demo-only — set moderator role for content review. */
  promoteToModerator: () => void;
}

const STORAGE_KEY = "pm.auth.v1";
const TOKEN_KEY = "pm.auth.token.v1";
const AuthContext = createContext<AuthCtx | null>(null);

function readStored(): AppUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AppUser) : null;
  } catch {
    return null;
  }
}

function persist(u: AppUser | null) {
  if (typeof window === "undefined") return;
  if (u) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  else window.localStorage.removeItem(STORAGE_KEY);
}

function persistToken(t: string | null) {
  if (typeof window === "undefined") return;
  if (t) window.localStorage.setItem(TOKEN_KEY, t);
  else window.localStorage.removeItem(TOKEN_KEY);
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

function getApiOrigin(): string {
  const raw = import.meta.env.VITE_API_BASE_URL as string | undefined;
  return raw ? raw.replace(/\/+$/, "") : "";
}

async function callApi<T = any>(path: string, body: any): Promise<T> {
  const origin = getApiOrigin();
  const url =
    origin && typeof path === "string" && path.startsWith("/")
      ? `${origin}${path}`
      : path;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body ?? {}),
    credentials: "include",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(() => readStored());

  useEffect(() => persist(user), [user]);

  const loginWithPhone = useCallback(async (phone: string, password: string) => {
    const serverData: any = await callApi("/api/auth/login", { phone, password });
    if (serverData?.token) persistToken(serverData.token);
    const existing = readStored();
    const next: AppUser = {
      id: serverData?.user?.id ?? existing?.id ?? uid("u"),
      fullName: serverData?.user?.name ?? existing?.fullName ?? phone,
      phone,
      email: existing?.email,
      avatarUrl: serverData?.user?.avatarUrl ?? existing?.avatarUrl,
      role: (serverData?.user?.role as AppRole) ?? existing?.role ?? "user",
      seller: existing?.seller,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    };
    setUser(next);
    return next;
  }, []);

  const registerUser = useCallback(async (input: Omit<AppUser, "id" | "role" | "createdAt"> & { password: string }) => {
    const serverData: any = await callApi("/api/auth/register", {
      name: input.fullName,
      email: input.email,
      phone: input.phone,
      password: input.password,
    });
    if (serverData?.token) persistToken(serverData.token);
    const next: AppUser = {
      ...input,
      id: serverData?.user?.id ?? uid("u"),
      role: "user",
      createdAt: new Date().toISOString(),
    };
    delete (next as any).password;
    setUser(next);
    return next;
  }, []);

  const registerSeller = useCallback(async (input: Omit<AppUser, "id" | "role" | "createdAt"> & { password: string; seller: NonNullable<AppUser["seller"]> }) => {
    const serverData: any = await callApi("/api/auth/seller-register", {
      name: input.fullName,
      email: input.email,
      phone: input.phone,
      password: input.password,
      shopName: input.seller.shopName,
      type: input.seller.type,
      subType: input.seller.subType,
      category: input.seller.category,
      location: input.seller.location,
      payoutMethod: input.seller.payoutMethod,
    });
    if (serverData?.token) persistToken(serverData.token);
    const next: AppUser = {
      ...input,
      id: serverData?.user?.id ?? uid("s"),
      role: "seller",
      createdAt: new Date().toISOString(),
    };
    delete (next as any).password;
    setUser(next);
    return next;
  }, []);

  const logout = useCallback(() => {
    callApi("/api/auth/logout", {}).catch(() => {});
    persistToken(null);
    setUser(null);
  }, []);

  const promoteToAdmin = useCallback(async () => {
    try {
      await callApi("/api/auth/promote-admin", {});
    } catch {}
    setUser((prev) => (prev ? { ...prev, role: "admin" } : prev));
  }, []);

  const promoteToModerator = useCallback(() => {
    setUser((prev) => (prev ? { ...prev, role: "moderator" } : prev));
  }, []);

  const value = useMemo<AuthCtx>(() => ({
    user,
    isAuthenticated: !!user,
    role: user?.role ?? "guest",
    loginWithPhone,
    registerUser,
    registerSeller,
    logout,
    promoteToAdmin,
    promoteToModerator,
  }), [user, loginWithPhone, registerUser, registerSeller, logout, promoteToAdmin, promoteToModerator]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
