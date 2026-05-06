import { Link, useNavigate } from "react-router-dom";
import {
  X,
  User,
  Store,
  Wallet,
  Package,
  Heart,
  Bell,
  Settings,
  LogOut,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "@/features/auth/auth.context";
import { Avatar } from "@/components/common/Avatar";

interface HamburgerDrawerProps {
  open: boolean;
  onClose: () => void;
}

interface HamburgerSection {
  title: string;
  items: Array<{ label: string; to: string; icon: JSX.Element }>;
}

export default function HamburgerDrawer({ open, onClose }: HamburgerDrawerProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleRoute = user ? `/seller/${user.handle.replace("@", "")}` : "/login";
  const sections: HamburgerSection[] = [
    {
      title: "Account",
      items: [
        { label: "My Profile", to: handleRoute, icon: <User className="h-4 w-4" /> },
        { label: "Orders", to: "/orders", icon: <Package className="h-4 w-4" /> },
        { label: "Wallet", to: "/wallet", icon: <Wallet className="h-4 w-4" /> },
        { label: "Notifications", to: "/notifications", icon: <Bell className="h-4 w-4" /> },
      ],
    },
    {
      title: "Shop",
      items: [
        { label: "Marketplace", to: "/marketplace", icon: <Store className="h-4 w-4" /> },
        { label: "Wishlist", to: "/marketplace", icon: <Heart className="h-4 w-4" /> },
        { label: "Spotlight", to: "/spotlight", icon: <Sparkles className="h-4 w-4" /> },
      ],
    },
    {
      title: "Help & Settings",
      items: [
        { label: "Settings", to: "/login", icon: <Settings className="h-4 w-4" /> },
        { label: "Help Center", to: "/login", icon: <HelpCircle className="h-4 w-4" /> },
      ],
    },
  ];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const go = (to: string) => {
    onClose();
    navigate(to);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 left-0 z-[70] h-full w-[82%] max-w-[340px] glass-strong border-r border-[rgba(var(--glass-stroke)/0.3)] shadow-2xl transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-[rgba(var(--glass-stroke)/0.15)]">
          <div className="flex items-center gap-3">
            <Avatar
              src={user ? "/generated/avatar1.png" : undefined}
              fallback={user?.name?.[0] ?? "G"}
              size="md"
            />
            <div>
              <p className="font-bold text-sm text-[rgb(var(--text))]">
                {user?.name ?? "Guest"}
              </p>
              <p className="text-xs text-[rgb(var(--text-muted))]">
                {user ? "@" + (user.name?.toLowerCase().replace(/\s+/g, "") ?? "you") : "Sign in"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full glass flex items-center justify-center"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-5">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[rgb(var(--text-subtle))] px-3 mb-2">
                {section.title}
              </p>
              <div className="flex flex-col">
                {section.items.map((it) => (
                  <button
                    key={it.label}
                    onClick={() => go(it.to)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[rgb(var(--text))] hover:bg-[rgba(var(--glass-tint)/0.15)] transition press"
                  >
                    <span className="h-8 w-8 rounded-full bg-[rgba(var(--glass-tint)/0.1)] flex items-center justify-center text-[rgb(var(--text-muted))]">
                      {it.icon}
                    </span>
                    {it.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-[rgba(var(--glass-stroke)/0.15)]">
          {user ? (
            <button
              onClick={() => {
                signOut();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 bg-red-500/10 hover:bg-red-500/15 transition press"
            >
              <LogOut className="h-4 w-4" /> Log out
            </button>
          ) : (
            <Link
              to="/login"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-[rgb(var(--primary))] press"
            >
              Sign in
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
