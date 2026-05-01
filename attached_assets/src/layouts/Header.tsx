import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, Menu, Search, ShoppingCart, Store } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { useCart } from "@/features/cart/cart.context";

interface HeaderProps {
  onOpenMenu?: () => void;
  unreadNotifications?: number;
}

export default function Header({ onOpenMenu, unreadNotifications = 0 }: HeaderProps) {
  const { count } = useCart();
  const location = useLocation();
  const isMarketplace = location.pathname.startsWith("/marketplace");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const iconBtn =
    "flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(var(--glass-tint)/0.1)] border border-[rgba(var(--glass-stroke)/0.2)] text-[rgb(var(--text))] transition-all hover:bg-[rgba(var(--glass-tint)/0.2)] active:scale-95";

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${scrolled ? "glass-strong shadow-md" : "glass"}`}>
      <div className="flex h-16 items-center justify-between px-3 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={onOpenMenu}
            className={iconBtn}
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] shadow-[0_0_15px_rgba(16,185,129,0.3)] shrink-0">
              <span className="font-bold text-lg leading-none">P</span>
            </div>
            <span className="text-lg font-bold tracking-tight neon-text truncate">PaikarMart</span>
          </Link>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {!isMarketplace && (
            <Link
              to="/marketplace"
              className="hidden xs:flex items-center gap-1.5 px-3 h-9 rounded-full bg-[rgba(var(--glass-tint)/0.1)] border border-[rgba(var(--glass-stroke)/0.2)] text-[rgb(var(--text))] text-xs font-semibold transition-all hover:bg-[rgba(var(--glass-tint)/0.2)] active:scale-95"
            >
              <Store className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Shop</span>
            </Link>
          )}

          <Link to="/marketplace/search" className={iconBtn} aria-label="Search">
            <Search className="h-4 w-4" />
          </Link>

          <Link
            to="/notifications"
            className={`relative ${iconBtn}`}
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadNotifications > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[rgb(var(--primary))] text-[10px] font-bold text-white shadow-[0_0_8px_rgba(16,185,129,0.6)]">
                {unreadNotifications > 9 ? "9+" : unreadNotifications}
              </span>
            )}
          </Link>

          <ThemeSwitcher />

          <Link
            to="/cart"
            className={`relative ${iconBtn}`}
            aria-label="Cart"
          >
            <ShoppingCart className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-md">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
