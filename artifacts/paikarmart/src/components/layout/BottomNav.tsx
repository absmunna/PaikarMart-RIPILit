import React from "react";
import { Link, useLocation } from "wouter";
import { ShoppingBag, Home, User } from "lucide-react";

const GLOW = "#00FF9C";
const RED  = "#FF3B3B";
const MUTED = "rgba(163,201,184,0.6)";

const TABS = [
  { href: "/products", label: "Marketplace", icon: ShoppingBag },
  { href: "/",         label: "Home",        icon: Home        },
  { href: "/profile",  label: "Account",     icon: User        },
];

export function BottomNav() {
  const [location] = useLocation();

  const isActive = (href: string) => {
    if (href === "/") return location === "/" || location === "/feed";
    if (href === "/products") return location.startsWith("/products") || location.startsWith("/vendors");
    return location.startsWith(href);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        background: "rgba(6,22,14,0.96)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderTop: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.5)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="flex items-center justify-around h-[56px]">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link key={href} href={href}>
              <button className="flex flex-col items-center justify-center gap-0.5 w-24 h-full relative">
                {/* Active top bar */}
                {active && (
                  <span
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full"
                    style={{ background: GLOW, boxShadow: "0 0 8px rgba(0,255,156,0.6)" }}
                  />
                )}
                <Icon
                  style={{
                    width: 22, height: 22,
                    color: active ? GLOW : MUTED,
                    strokeWidth: active ? 2.5 : 1.8,
                    filter: active ? "drop-shadow(0 0 6px rgba(0,255,156,0.5))" : "none",
                  }}
                />
                <span
                  className="text-[10px] font-semibold"
                  style={{ color: active ? GLOW : MUTED }}
                >
                  {label}
                </span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
