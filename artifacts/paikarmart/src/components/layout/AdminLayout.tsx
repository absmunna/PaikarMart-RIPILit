import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard, Users, Store, Package, ShoppingBag,
  Settings, ChevronRight, Menu, X, LogOut, Bell, Shield, Percent
} from "lucide-react";

const GLOW  = "#00FF9C";
const RED   = "#FF3B3B";
const TEXT  = "#E8F5EE";
const MUTED = "#A3C9B8";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard",   icon: LayoutDashboard },
  { href: "/admin/users",     label: "Users",        icon: Users           },
  { href: "/admin/sellers",   label: "Sellers",      icon: Store           },
  { href: "/admin/products",  label: "Products",     icon: Package         },
  { href: "/admin/orders",    label: "Orders",       icon: ShoppingBag     },
  { href: "/admin/commission",label: "Commission",   icon: Percent         },
  { href: "/admin/settings",  label: "Settings",     icon: Settings        },
];

export function AdminLayout({ children, title }: { children: React.ReactNode; title?: string }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const Sidebar = ({ mobile = false }) => (
    <div className="flex flex-col h-full" style={{ background: "rgba(6,22,14,0.99)", borderRight: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="px-5 py-4 flex items-center justify-between shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4" style={{ color: RED }} />
          <span className="font-extrabold text-base font-['Outfit']">
            <span style={{ color: TEXT }}>Admin</span>
            <span style={{ color: GLOW }}>Panel</span>
          </span>
        </div>
        {mobile && (
          <button onClick={() => setSidebarOpen(false)} className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-white/8" style={{ color: MUTED }}>
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="px-4 py-3 mx-3 mt-3 rounded-xl flex items-center gap-2.5" style={{ background: "rgba(255,59,59,0.07)", border: "1px solid rgba(255,59,59,0.20)" }}>
        <div className="h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: "rgba(255,59,59,0.18)", color: RED }}>
          {user?.name?.charAt(0) ?? "A"}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold truncate" style={{ color: TEXT }}>{user?.name ?? "Admin"}</p>
          <span className="text-[10px] font-bold" style={{ color: RED }}>Super Admin</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = location === href || location.startsWith(href + "/");
          return (
            <Link key={href} href={href} onClick={() => setSidebarOpen(false)}>
              <div
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 cursor-pointer text-sm font-medium transition-all duration-150"
                style={{
                  background: active ? "rgba(255,59,59,0.10)" : "transparent",
                  color: active ? RED : MUTED,
                  border: active ? "1px solid rgba(255,59,59,0.25)" : "1px solid transparent",
                }}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 space-y-1" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <Link href="/"><div className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer text-sm hover:bg-white/5 transition-all" style={{ color: MUTED }}>← Back to Site</div></Link>
        <div onClick={logout} className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer text-sm hover:bg-red-900/20 transition-all" style={{ color: RED }}>
          <LogOut className="h-4 w-4" /> Logout
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-[100dvh] flex" style={{ background: "#061A12", backgroundImage: "linear-gradient(160deg,#0B2B1F 0%,#061A12 100%)" }}>
      <aside className="hidden md:flex flex-col w-56 shrink-0 sticky top-0 h-screen"><Sidebar /></aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 flex flex-col"><Sidebar mobile /></div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-3 px-4 h-14 shrink-0" style={{ background: "rgba(6,26,18,0.90)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <button onClick={() => setSidebarOpen(true)} className="md:hidden h-9 w-9 flex items-center justify-center rounded-xl hover:bg-white/8" style={{ color: MUTED }}>
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="font-bold text-sm flex-1" style={{ color: TEXT }}>{title ?? "Admin Dashboard"}</h1>
          <button className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-white/8" style={{ color: MUTED }}>
            <Bell style={{ width: 18, height: 18 }} />
          </button>
          <div className="h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs" style={{ background: "rgba(255,59,59,0.18)", color: RED }}>
            {user?.name?.charAt(0) ?? "A"}
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
}
