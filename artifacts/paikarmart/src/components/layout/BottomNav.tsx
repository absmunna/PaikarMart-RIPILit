import React from "react";
import { Link, useLocation } from "wouter";
import { Home, LayoutGrid, Plus, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  activeColor?: string;
  glowColor?: string;
}

const LEFT_ITEMS: NavItem[] = [
  { href: "/products", label: "Market", icon: LayoutGrid, activeColor: "text-emerald-400", glowColor: "bg-emerald-400" },
  { href: "/cart", label: "Cart", icon: ShoppingCart, activeColor: "text-purple-400", glowColor: "bg-purple-400" },
];

const RIGHT_ITEMS: NavItem[] = [
  { href: "/seller/register", label: "Sell", icon: Plus, activeColor: "text-emerald-400", glowColor: "bg-emerald-400" },
  { href: "/profile", label: "Profile", icon: User, activeColor: "text-purple-400", glowColor: "bg-purple-400" },
];

export function BottomNav() {
  const [location] = useLocation();
  const { totalItems } = useCart();

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

  const renderItem = (item: NavItem) => {
    const active = isActive(item.href);
    const isCart = item.href === "/cart";
    return (
      <Link key={item.href} href={item.href}>
        <button className="relative flex flex-col items-center gap-0.5 px-5 py-1 group">
          <div className={`relative h-6 w-6 flex items-center justify-center transition-all duration-200 ${active ? item.activeColor : "text-white/35 group-hover:text-white/60"}`}>
            <item.icon className="h-5 w-5" />
            {isCart && totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </div>
          <span className={`text-[10px] font-medium transition-colors ${active ? item.activeColor : "text-white/35"}`}>
            {item.label}
          </span>
          {active && (
            <span className={`absolute -bottom-[1px] h-[2px] w-5 rounded-full ${item.glowColor} blur-[1px]`} />
          )}
        </button>
      </Link>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div
        className="flex items-center justify-around px-1 pt-2 pb-[env(safe-area-inset-bottom,8px)]"
        style={{
          background: "rgba(6,18,14,0.95)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(16,185,129,0.12)",
        }}
      >
        {/* Left: Market + Cart */}
        {LEFT_ITEMS.map(renderItem)}

        {/* Center: Home — raised glowing button */}
        <Link href="/">
          <button className="flex flex-col items-center -mt-5 px-2 group">
            <div
              className="h-12 w-12 rounded-2xl flex items-center justify-center shadow-xl transition-transform duration-200 group-active:scale-95"
              style={{
                background: isActive("/")
                  ? "linear-gradient(135deg, hsl(145 65% 35%), hsl(145 60% 45%))"
                  : "linear-gradient(135deg, hsl(145 65% 28%), hsl(145 60% 36%))",
                border: "1.5px solid hsl(145 65% 45% / 0.5)",
                boxShadow: isActive("/")
                  ? "0 4px 24px rgba(16,185,129,0.5)"
                  : "0 4px 20px rgba(16,185,129,0.25)",
              }}
            >
              <Home className="h-6 w-6 text-white" strokeWidth={2} />
            </div>
            <span className={`text-[10px] font-semibold mt-1 ${isActive("/") ? "text-emerald-400" : "text-white/50"}`}>
              Home
            </span>
          </button>
        </Link>

        {/* Right: Sell + Profile */}
        {RIGHT_ITEMS.map(renderItem)}
      </div>
    </div>
  );
}
