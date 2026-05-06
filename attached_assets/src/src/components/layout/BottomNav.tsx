import { Link, useLocation } from "wouter";
import { Home, PlaySquare, Store, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/reels", label: "Reels", icon: PlaySquare },
    { href: "/vendors", label: "Vendors", icon: Store },
    { href: "/marketplace", label: "Market", icon: ShoppingBag },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-panel border-t md:hidden pb-safe">
      <div className="flex items-center justify-around h-16 max-w-7xl mx-auto">
        {(Array.isArray(navItems) ? navItems : []).map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center w-full h-full text-xs gap-1">
              <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-white/50")} />
              <span className={cn(isActive ? "text-primary font-medium" : "text-white/50")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
