import { Link, useLocation } from "wouter";
import { Menu, Search, Bell, Plus, ShoppingCart, ArrowLeft, ShieldCheck, Store, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetMe, useGetCart } from "@workspace/api-client-react";
import { Sidebar } from "./Sidebar";
import * as React from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/AuthContext";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";

export function Header() {
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { data: user } = useGetMe();
  const { data: cart } = useGetCart();
  const { role } = useAuth();

  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/marketplace?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const isInner = location !== "/" && !location.startsWith("/marketplace");
  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      setLocation("/");
    }
  };

  const tabs = [
    { href: "/", label: "Explore", match: (l: string) => l === "/" },
    { href: "/marketplace", label: "Market", match: (l: string) => l.startsWith("/marketplace") },
    { href: "/local", label: "Local", match: (l: string) => l === "/local" },
    { href: "/categories", label: "Categories", match: (l: string) => l === "/categories" },
    { href: "/vendors", label: "Vendors", match: (l: string) => l === "/vendors" },
    { href: "/demand", label: "Demands", match: (l: string) => l.startsWith("/demand") },
    { href: "/video", label: "Videos", match: (l: string) => l.startsWith("/video") },
  ];

  const RoleBadge =
    role === "admin" ? (
      <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
        <ShieldCheck className="h-3 w-3" /> Admin
      </span>
    ) : role === "seller" ? (
      <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
        <Store className="h-3 w-3" /> Seller
      </span>
    ) : role === "user" ? (
      <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
        <UserIcon className="h-3 w-3" /> User
      </span>
    ) : (
      <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-white/70">
        Guest
      </span>
    );

  return (
    <>
      <header className="sticky top-0 z-50 w-full glass-panel border-b">
        <div className="flex h-14 md:h-16 items-center px-3 md:px-6 gap-2 md:gap-3 max-w-[1400px] mx-auto">
          {isInner ? (
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 shrink-0"
              onClick={goBack}
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 lg:hidden shrink-0"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          )}

          <Link
            href="/"
            className="font-bold text-base md:text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-primary shrink-0"
          >
            PaikarMart
          </Link>

          {RoleBadge}

          <form
            onSubmit={handleSearch}
            className="flex-1 min-w-0 max-w-md relative ml-1"
          >
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
            <input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/10 rounded-full h-9 md:h-10 pl-8 pr-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </form>

          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 relative h-9 w-9 md:h-10 md:w-10"
                aria-label="Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cart && cart.itemCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {cart.itemCount}
                  </span>
                )}
              </Button>
            </Link>

            <Link href="/notifications" className="hidden xs:block sm:block">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 relative h-9 w-9 md:h-10 md:w-10"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-red-500" />
              </Button>
            </Link>

            <div>
              <ThemeSwitcher compact />
            </div>

            <Link
              href={role === "seller" || role === "admin" ? "/seller/products/new" : "/auth/seller-register"}
              className="hidden sm:block"
            >
              <Button size="icon" className="rounded-full shrink-0 h-9 w-9 md:h-10 md:w-10" aria-label="Create">
                <Plus className="h-5 w-5" />
              </Button>
            </Link>

            <Link href="/profile" className="ml-1">
              <Avatar className="h-8 w-8 cursor-pointer border border-white/20">
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback className="bg-primary/20 text-primary text-xs">
                  {user?.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="border-t border-white/5">
          <div className="flex items-center overflow-x-auto no-scrollbar px-3 md:px-6 h-11 md:h-12 gap-5 md:gap-6 text-sm font-medium max-w-[1400px] mx-auto">
            {(Array.isArray(tabs) ? tabs : []).map((t) => {
              const active = t.match(location);
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className={cn(
                    "shrink-0 pb-2.5 border-b-2 transition-colors",
                    active
                      ? "border-primary text-primary"
                      : "border-transparent text-white/70 hover:text-white",
                  )}
                >
                  {t.label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
    </>
  );
}

