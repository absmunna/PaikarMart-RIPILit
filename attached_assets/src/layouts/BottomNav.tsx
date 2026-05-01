import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, PlusCircle, Wallet, User } from "lucide-react";
import { useAuth } from "@/features/auth/auth.context";

export default function BottomNav() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  
  const isSeller = user?.isSeller;

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 mx-auto w-full max-w-[480px] sm:max-w-[640px]">
      {/* Safe area padding block is handled by padding bottom on layout */}
      <div className="glass-strong mx-4 mb-4 flex items-center justify-around rounded-2xl px-2 py-2 shadow-[0_12px_40px_-12px_rgba(15,23,42,0.18),0_2px_6px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center gap-1 w-16 p-2 transition-colors ${
            isActive("/") ? "text-[rgb(var(--primary))]" : "text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))]"
          }`}
        >
          <Home className={`h-5 w-5 ${isActive("/") ? "fill-[rgb(var(--primary))/0.2]" : ""}`} />
          <span className="text-[10px] font-medium">Feed</span>
        </Link>

        <Link
          to="/marketplace"
          className={`flex flex-col items-center justify-center gap-1 w-16 p-2 transition-colors ${
            isActive("/marketplace") ? "text-[rgb(var(--primary))]" : "text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))]"
          }`}
        >
          <ShoppingBag className={`h-5 w-5 ${isActive("/marketplace") ? "fill-[rgb(var(--primary))/0.2]" : ""}`} />
          <span className="text-[10px] font-medium">Shop</span>
        </Link>

        {isSeller ? (
          <div className="relative -mt-6">
            <Link
              to={`/seller/${user?.handle.replace("@", "")}`}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] shadow-glow transition-transform hover:scale-105 active:scale-95"
            >
              <PlusCircle className="h-6 w-6" />
            </Link>
          </div>
        ) : (
          <div className="w-16" /> /* Placeholder to keep spacing even if not seller */
        )}

        <Link
          to="/wallet"
          className={`flex flex-col items-center justify-center gap-1 w-16 p-2 transition-colors ${
            isActive("/wallet") ? "text-[rgb(var(--primary))]" : "text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))]"
          }`}
        >
          <Wallet className={`h-5 w-5 ${isActive("/wallet") ? "fill-[rgb(var(--primary))/0.2]" : ""}`} />
          <span className="text-[10px] font-medium">Wallet</span>
        </Link>

        <Link
          to={user ? `/seller/${user.handle.replace("@", "")}` : "/login"}
          className={`flex flex-col items-center justify-center gap-1 w-16 p-2 transition-colors ${
            isActive("/seller") || isActive("/login") ? "text-[rgb(var(--primary))]" : "text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))]"
          }`}
        >
          <User className={`h-5 w-5 ${isActive("/seller") || isActive("/login") ? "fill-[rgb(var(--primary))/0.2]" : ""}`} />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
