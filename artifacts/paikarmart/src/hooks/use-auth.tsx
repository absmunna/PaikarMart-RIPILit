import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { UserRole } from "@workspace/api-zod";

interface User {
  id: string;
  name: string;
  role: UserRole;
  phone?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isLoggedIn: boolean;
  role: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("paikarmart_user");
    if (!savedUser) return null;
    const parsed = JSON.parse(savedUser);
    if (parsed?.id === "user-1" || parsed?.id === "guest") return null;
    return parsed;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("paikarmart_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("paikarmart_user");
    }
  }, [user]);

  const login = (newUser: User) => setUser(newUser);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user, role: user?.role || "buyer" }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
