import { createContext, useContext, useMemo, useState } from "react";
import { User, UserRole } from "@/types/user.types";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (u: User) => void;
  signOut: () => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DEMO_USER: User = {
  id: "u-demo",
  name: "Rafiq Hossain",
  handle: "@rafiq",
  avatar: "",
  role: "seller",
  sellerType: "retail",
  shopName: "Rafiq Store",
  shopCover: "/generated/banner1.png",
  shopLogo: "/generated/avatar1.png",
  isVerified: true,
  followers: 1920,
  rating: 4.8,
  about: "Trusted retail seller with quick delivery and friendly customer support.",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(DEMO_USER);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: Boolean(user),
    signIn: setUser,
    signOut: () => setUser(null),
    hasRole: (roles: UserRole | UserRole[]) => {
      if (!user) return false;
      const list = Array.isArray(roles) ? roles : [roles];
      return list.includes(user.role ?? "user");
    },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
