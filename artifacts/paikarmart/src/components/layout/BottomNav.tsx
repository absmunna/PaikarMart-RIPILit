import React from "react";
import { Link, useLocation } from "wouter";
import { Home, LayoutGrid, Plus, User } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

export function BottomNav() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div
        className="glass-dark border-t px-1 pt-2 pb-[env(safe-area-inset-bottom,8px)] flex items-center justify-around"
        style={{ borderColor: "rgba(16,185,129,0.15)" }}
      >
        {/* Marketplace */}
        <Link href="/vendors">
          <button className="flex flex-col items-center gap-0.5 px-4 py-1 group">
            <div
              className={`h-6 w-6 flex items-center justify-center transition-all duration-200 ${
                isActive("/vendors")
                  ? "text-emerald-400"
                  : "text-white/40 group-hover:text-white/70"
              }`}
            >
              <LayoutGrid className="h-5 w-5" />
            </div>
            <span
              className={`text-[10px] font-medium transition-colors ${
                isActive("/vendors") ? "text-emerald-400" : "text-white/40"
              }`}
            >
              Market
            </span>
            {isActive("/vendors") && (
              <span className="absolute bottom-[3px] h-0.5 w-5 rounded-full bg-emerald-400 blur-[1px]" />
            )}
          </button>
        </Link>

        {/* Home */}
        <Link href="/">
          <button className="flex flex-col items-center gap-0.5 px-4 py-1 group relative">
            <div
              className={`h-6 w-6 flex items-center justify-center transition-all duration-200 ${
                isActive("/")
                  ? "text-emerald-400"
                  : "text-white/40 group-hover:text-white/70"
              }`}
            >
              <Home className="h-5 w-5" />
            </div>
            <span
              className={`text-[10px] font-medium transition-colors ${
                isActive("/") ? "text-emerald-400" : "text-white/40"
              }`}
            >
              Home
            </span>
            {isActive("/") && (
              <span className="absolute bottom-[3px] h-0.5 w-5 rounded-full bg-emerald-400 blur-[1px]" />
            )}
          </button>
        </Link>

        {/* Sell — big center button */}
        <Link href="/seller/register">
          <button className="flex flex-col items-center -mt-5 px-2 group">
            <div
              className="h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg glow-green transition-transform duration-200 group-active:scale-95"
              style={{
                background: "linear-gradient(135deg, hsl(145 65% 35%), hsl(145 60% 28%))",
                border: "1.5px solid hsl(145 65% 45% / 0.5)",
              }}
            >
              <Plus className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-medium text-emerald-400 mt-1">Sell</span>
          </button>
        </Link>

        {/* Account */}
        <Link href="/profile">
          <button className="flex flex-col items-center gap-0.5 px-4 py-1 group relative">
            <div
              className={`h-6 w-6 flex items-center justify-center transition-all duration-200 ${
                isActive("/profile")
                  ? "text-purple-400"
                  : "text-white/40 group-hover:text-white/70"
              }`}
            >
              <User className="h-5 w-5" />
            </div>
            <span
              className={`text-[10px] font-medium transition-colors ${
                isActive("/profile") ? "text-purple-400" : "text-white/40"
              }`}
            >
              Account
            </span>
            {isActive("/profile") && (
              <span className="absolute bottom-[3px] h-0.5 w-5 rounded-full bg-purple-400 blur-[1px]" />
            )}
          </button>
        </Link>
      </div>
    </div>
  );
}
