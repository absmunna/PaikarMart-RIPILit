import { Link, useLocation } from "wouter";
import {
  User,
  LayoutDashboard,
  ShoppingBag,
  Heart,
  Package,
  FileText,
  Store,
  ShieldCheck,
  Wallet,
  PlaySquare,
  Settings as SettingsIcon,
  LogOut,
  Home,
  Tag,
  Users as UsersIcon,
  Plus,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/features/auth/AuthContext";
import { cn } from "@/lib/utils";
import * as React from "react";

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Item {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  show?: boolean;
  variant?: "default" | "primary" | "danger";
  external?: boolean;
}

function useMenuItems() {
  const { role, isAuthenticated, logout } = useAuth();
  const isSeller = role === "seller" || role === "admin";
  const isAdmin = role === "admin";

  const sections: { title: string; items: Item[] }[] = [
    {
      title: "Discover",
      items: [
        { href: "/", label: "Home Feed", Icon: Home },
        { href: "/marketplace", label: "Marketplace", Icon: ShoppingBag },
        { href: "/categories", label: "Categories", Icon: Tag },
        { href: "/vendors", label: "Vendors", Icon: UsersIcon },
        { href: "/reels", label: "Reels", Icon: PlaySquare },
        { href: "/video", label: "Video Content", Icon: PlaySquare },
      ],
    },
    {
      title: "My Activity",
      items: [
        { href: "/profile", label: "Profile", Icon: User },
        { href: "/orders", label: "My Purchase Orders", Icon: Package },
        { href: "/cart", label: "Cart", Icon: ShoppingBag },
        { href: "/profile?tab=wishlist", label: "Wishlist", Icon: Heart },
        { href: "/profile?tab=demands", label: "My Demand Posts", Icon: FileText },
        { href: "/wallet", label: "PK Coin Wallet", Icon: Wallet },
      ],
    },
    {
      title: "Selling",
      items: isSeller
        ? [
            { href: "/seller", label: "Seller Dashboard", Icon: LayoutDashboard, variant: "primary" as const },
            { href: "/seller/products/new", label: "Create Product", Icon: Plus },
            { href: "/profile?tab=products", label: "My Products", Icon: Store },
          ]
        : [
            { href: "/auth/seller-register", label: "Become a Seller", Icon: Store, variant: "primary" as const },
          ],
    },
  ];

  if (isAdmin) {
    sections.push({
      title: "Admin",
      items: [
        { href: "/admin", label: "Admin Dashboard", Icon: ShieldCheck, variant: "primary" as const },
        { href: "/admin/users", label: "Users", Icon: UsersIcon },
        { href: "/admin/settings", label: "Settings", Icon: SettingsIcon },
      ],
    });
  }

  return { sections, isAuthenticated, logout };
}

function MenuLinks({ onNavigate }: { onNavigate?: () => void }) {
  const [location] = useLocation();
  const { sections, isAuthenticated, logout } = useMenuItems();

  return (
    <div className="flex flex-col gap-5 pb-6">
      {(Array.isArray(sections) ? sections : []).map((section) => (
        <div key={section.title}>
          <div className="text-xs uppercase tracking-wider text-white/40 mb-2 px-2">
            {section.title}
          </div>
          <div className="flex flex-col gap-1">
            {(Array.isArray(section.items) ? section.items : []).map((item) => {
              const Icon = item.Icon;
              const active =
                location === item.href ||
                (item.href !== "/" && location.startsWith(item.href.split("?")[0] ?? item.href));
              return (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  onClick={() => onNavigate?.()}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                    item.variant === "primary"
                      ? "bg-primary/15 hover:bg-primary/25 text-primary"
                      : active
                        ? "bg-white/10 text-white"
                        : "text-white/75 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}

      <div className="h-px bg-white/10 my-1" />

      {isAuthenticated ? (
        <button
          onClick={() => {
            logout?.();
            onNavigate?.();
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors w-full text-left"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      ) : (
        <Link
          href="/auth/login"
          onClick={() => onNavigate?.()}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-primary bg-primary/15 hover:bg-primary/25"
        >
          <User className="h-4 w-4" />
          <span>Login / Register</span>
        </Link>
      )}
    </div>
  );
}

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="bg-[#0f172a] border-white/10 text-white w-[300px] max-w-[85vw] p-5 overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="text-left text-white">Menu</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <MenuLinks onNavigate={() => onOpenChange(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

/** Persistent left rail shown on lg+ screens. */
export function DesktopSidebar() {
  return (
    <aside className="hidden lg:block w-64 shrink-0 sticky top-28 self-start max-h-[calc(100dvh-7rem)] overflow-y-auto pr-2">
      <div className="rounded-xl glass-panel p-3 border border-white/5">
        <MenuLinks />
      </div>
    </aside>
  );
}
