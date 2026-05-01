import { Link, useLocation } from "react-router-dom";
import {
  Home,
  ShoppingBag,
  Wallet,
  Package,
  Bell,
  Settings,
  LogOut,
  Store,
  Heart,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/features/auth/auth.context";
import { Avatar } from "@/components/common/Avatar";

interface SidebarItem {
  label: string;
  to: string;
  icon: JSX.Element;
  group?: string;
}

const ITEMS: SidebarItem[] = [
  { label: "Feed", to: "/", icon: <Home className="h-5 w-5" />, group: "Main" },
  { label: "Marketplace", to: "/marketplace", icon: <ShoppingBag className="h-5 w-5" />, group: "Main" },
  
  { label: "My Orders", to: "/orders", icon: <Package className="h-5 w-5" />, group: "Account" },
  { label: "Wallet", to: "/wallet", icon: <Wallet className="h-5 w-5" />, group: "Account" },
  { label: "Notifications", to: "/notifications", icon: <Bell className="h-5 w-5" />, group: "Account" },

  { label: "Wishlist", to: "/marketplace", icon: <Heart className="h-5 w-5" />, group: "Shop" },
  { label: "Spotlight", to: "/spotlight", icon: <Sparkles className="h-5 w-5" />, group: "Shop" },

  { label: "Settings", to: "#", icon: <Settings className="h-5 w-5" />, group: "Help" },
];

export default function Sidebar() {
  const { user, signOut } = useAuth();
  const { pathname } = useLocation();

  const groupedItems = ITEMS.reduce((acc, item) => {
    if (!acc[item.group || "Other"]) acc[item.group || "Other"] = [];
    acc[item.group || "Other"].push(item);
    return acc;
  }, {} as Record<string, SidebarItem[]>);

  const isActive = (to: string) => pathname === to || pathname.startsWith(to + "/");

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-70 flex-col bg-[rgb(var(--bg))] border-r border-[rgba(var(--glass-stroke)/0.1)] z-30 pt-20 pb-20">
      {/* User Profile Section */}
      <div className="px-4 pb-6 border-b border-[rgba(var(--glass-stroke)/0.1)]">
        {user ? (
          <div className="flex items-center gap-3">
            <Avatar src="/generated/avatar1.png" fallback={user.name?.[0] || "U"} size="md" />
            <div>
              <p className="font-bold text-sm text-[rgb(var(--text))]">{user.name}</p>
              <p className="text-xs text-[rgb(var(--text-muted))]">{user.handle}</p>
            </div>
          </div>
        ) : (
          <Link to="/login" className="px-4 py-2 rounded-xl bg-[rgb(var(--primary))] text-white text-sm font-semibold block text-center">
            Sign In
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {Object.entries(groupedItems).map(([group, items]) => (
          <div key={group}>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[rgb(var(--text-subtle))] px-3 mb-2">
              {group}
            </h3>
            <div className="flex flex-col gap-1">
              {items.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive(item.to)
                      ? "bg-[rgba(var(--primary)/0.15)] text-[rgb(var(--primary))]"
                      : "text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] hover:bg-[rgba(var(--glass-tint)/0.05)]"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Sign Out */}
      {user && (
        <div className="p-4 border-t border-[rgba(var(--glass-stroke)/0.1)]">
          <button
            onClick={signOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 bg-red-500/10 hover:bg-red-500/15 transition"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      )}
    </aside>
  );
}
