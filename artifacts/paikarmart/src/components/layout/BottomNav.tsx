import React from "react";
import { Link, useLocation } from "wouter";
import { Home, LayoutGrid, ShoppingCart, User, Store } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  activeColor: string;
  glowColor: string;
}

const LEFT_ITEMS: NavItem[] = [
  { href: "/profile", label: "Profile", icon: User, activeColor: "text-purple-400", glowColor: "bg-purple-400" },
  { href: "/products", label: "Market", icon: LayoutGrid, activeColor: "text-emerald-400", glowColor: "bg-emerald-400" },
];

const RIGHT_ITEMS: NavItem[] = [
  { href: "/vendors", label: "Vendors", icon: Store, activeColor: "text-emerald-400", glowColor: "bg-emerald-400" },
  { href: "/cart", label: "Cart", icon: ShoppingCart, activeColor: "text-purple-400", glowColor: "bg-purple-400" },
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
        <button className="relative flex flex-col items-center gap-0.5 px-4 py-1 group">
          <div className={`relative h-6 w-6 flex items-center justify-center transition-all duration-200 ${active ? item.activeColor : "text-white/35 group-hover:text-white/60"}`}>
            <item.icon className="h-5 w-5" />
            {isCart && totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center leading-none">
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

  const homeActive = isActive("/");

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div
        className="flex items-center justify-around px-2 pt-2 pb-[env(safe-area-inset-bottom,8px)]"
        style={{
          background: "rgba(5,16,12,0.96)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderTop: "1px solid rgba(16,185,129,0.12)",
        }}
      >
        {/* Left: Profile + Market */}
        {LEFT_ITEMS.map(renderItem)}

        {/* Center: Home — raised highlighted button */}
        <Link href="/">
          <button className="flex flex-col items-center -mt-5 px-2 group">
            <div
              className="h-13 w-13 h-[52px] w-[52px] rounded-2xl flex items-center justify-center transition-all duration-200 group-active:scale-95"
              style={{
                background: homeActive
                  ? "linear-gradient(135deg, hsl(145 65% 38%), hsl(145 60% 48%))"
                  : "linear-gradient(135deg, hsl(145 65% 26%), hsl(265 55% 36%))",
                border: homeActive
                  ? "1.5px solid hsl(145 65% 55% / 0.6)"
                  : "1.5px solid rgba(16,185,129,0.35)",
                boxShadow: homeActive
                  ? "0 0 20px rgba(16,185,129,0.55), 0 4px 20px rgba(16,185,129,0.3)"
                  : "0 4px 16px rgba(16,185,129,0.2)",
              }}
            >
              <Home className="h-6 w-6 text-white" strokeWidth={homeActive ? 2.5 : 2} />
            </div>
            <span className={`text-[10px] font-semibold mt-1 transition-colors ${homeActive ? "text-emerald-400" : "text-white/45"}`}>
              Home
            </span>
          </button>
        </Link>

        {/* Right: Vendors + Cart */}
        {RIGHT_ITEMS.map(renderItem)}
      </div>
    </div>
  );
}
