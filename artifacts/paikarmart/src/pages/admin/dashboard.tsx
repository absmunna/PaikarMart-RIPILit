import React from "react";
import { Link } from "wouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetAdminDashboard } from "@workspace/api-client-react";
import { Users, Store, ShoppingBag, TrendingUp, CheckCircle, Clock, XCircle, ArrowUpRight, AlertCircle } from "lucide-react";

const GLOW = "#00FF9C"; const RED = "#FF3B3B"; const TEXT = "#E8F5EE"; const MUTED = "#A3C9B8"; const GOLD = "#f59e0b";

function GCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className} style={{ background: "linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>{children}</div>;
}

const STATUS_CFG: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  pending:    { color: GOLD,      bg: "rgba(245,158,11,0.12)", icon: Clock       },
  processing: { color: "#60a5fa", bg: "rgba(96,165,250,0.12)", icon: AlertCircle },
  delivered:  { color: GLOW,      bg: "rgba(0,255,156,0.12)",  icon: CheckCircle },
  cancelled:  { color: RED,       bg: "rgba(255,59,59,0.12)",  icon: XCircle     },
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function AdminDashboardPage() {
  const { data, isLoading } = useGetAdminDashboard();
  const d = data;

  const stats = [
    { label: "Total Revenue",   value: d ? `৳ ${(d.totalRevenue ?? 0).toLocaleString()}` : "—",  icon: TrendingUp, color: GLOW       },
    { label: "Total Users",     value: d ? String(d.totalUsers ?? 0)                       : "—",  icon: Users,      color: "#60a5fa"  },
    { label: "Active Sellers",  value: d ? String(d.activeSellers ?? 0)                    : "—",  icon: Store,      color: GOLD       },
    { label: "Total Orders",    value: d ? String(d.totalOrders ?? 0)                      : "—",  icon: ShoppingBag,color: "#8b5cf6"  },
  ];

  const orders = d?.recentOrders ?? [];
  const monthly = d?.monthlyRevenue ?? [];
  const maxRev = Math.max(...monthly.map((m: Record<string,unknown>) => m.revenue as number ?? 0), 1);

  return (
    <AdminLayout title="Admin Dashboard">
      <div className="max-w-5xl mx-auto space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map(s => (
            <GCard key={s.label} className="p-4">
              {isLoading ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-9 w-9 rounded-xl" style={{ background: "rgba(255,255,255,0.07)" }} />
                  <div className="h-3 rounded w-20" style={{ background: "rgba(255,255,255,0.07)" }} />
                  <div className="h-5 rounded w-16" style={{ background: "rgba(255,255,255,0.10)" }} />
                </div>
              ) : (
                <>
                  <div className="h-9 w-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${s.color}18` }}>
                    <s.icon className="h-[18px] w-[18px]" style={{ color: s.color }} />
                  </div>
                  <p className="text-[11px] font-medium mb-0.5" style={{ color: MUTED }}>{s.label}</p>
                  <p className="font-bold text-lg" style={{ color: TEXT }}>{s.value}</p>
                </>
              )}
            </GCard>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Recent Orders */}
          <GCard className="lg:col-span-2">
            <div className="flex items-center justify-between px-4 pt-4 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <h2 className="font-semibold text-sm" style={{ color: TEXT }}>Recent Orders</h2>
              <Link href="/admin/orders"><span className="text-xs font-medium flex items-center gap-1 cursor-pointer" style={{ color: RED }}>View All <ArrowUpRight className="h-3 w-3" /></span></Link>
            </div>
            {isLoading ? (
              <div className="p-4 space-y-3 animate-pulse">{[1,2,3].map(i => <div key={i} className="h-14 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }} />)}</div>
            ) : orders.length === 0 ? (
              <div className="py-12 flex flex-col items-center gap-2"><ShoppingBag className="h-10 w-10 opacity-20" style={{ color: MUTED }} /><p className="text-sm" style={{ color: MUTED }}>No orders yet</p></div>
            ) : (
              <div>
                {orders.slice(0, 6).map((o: Record<string, unknown>) => {
                  const status = String(o.status ?? "pending").toLowerCase();
                  const cfg = STATUS_CFG[status] ?? STATUS_CFG.pending;
                  const Ic = cfg.icon;
                  return (
                    <div key={String(o.id)} className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold" style={{ color: RED }}>#{String(o.id).slice(-6).toUpperCase()}</span>
                        <p className="text-xs" style={{ color: MUTED }}>{String(o.customerName ?? "")}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-bold mb-1" style={{ color: TEXT }}>৳ {Number(o.totalAmount ?? 0).toLocaleString()}</p>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: cfg.bg, color: cfg.color }}>
                          <Ic className="h-2.5 w-2.5" /> {status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </GCard>

          {/* Quick actions */}
          <GCard>
            <div className="px-4 pt-4 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <h2 className="font-semibold text-sm" style={{ color: TEXT }}>Admin Controls</h2>
            </div>
            <div className="p-3 space-y-2">
              {[
                { href: "/admin/sellers",  label: "Seller Approvals", color: GOLD },
                { href: "/admin/users",    label: "Manage Users",     color: GLOW },
                { href: "/admin/products", label: "Moderate Products",color: "#8b5cf6" },
                { href: "/admin/orders",   label: "All Orders",       color: "#60a5fa" },
                { href: "/admin/commission",label:"Commission Setup",  color: RED  },
              ].map(link => (
                <Link key={link.href} href={link.href}>
                  <button className="w-full h-9 rounded-xl text-xs font-semibold text-left px-3 flex items-center gap-2 transition-all hover:bg-white/5" style={{ color: link.color, border: `1px solid ${link.color}30`, background: `${link.color}08` }}>
                    <ArrowUpRight className="h-3 w-3" /> {link.label}
                  </button>
                </Link>
              ))}
            </div>
          </GCard>
        </div>

        {/* Monthly Chart */}
        {monthly.length > 0 && (
          <GCard className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm" style={{ color: TEXT }}>Platform Revenue</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(255,59,59,0.10)", color: RED }}>Last {monthly.length} months</span>
            </div>
            <div className="flex items-end gap-2 h-28">
              {monthly.map((m: Record<string, unknown>, i: number) => {
                const h = Math.round(((m.revenue as number ?? 0) / maxRev) * 100);
                const isLast = i === monthly.length - 1;
                const month = MONTHS[(m.month as number ?? 1) - 1] ?? String(m.month);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t-lg" style={{ height: `${Math.max(h, 4)}%`, background: isLast ? `linear-gradient(180deg,${RED},rgba(255,59,59,0.4))` : "rgba(255,255,255,0.07)", boxShadow: isLast ? `0 0 12px rgba(255,59,59,0.3)` : "none" }} />
                    <span className="text-[9px]" style={{ color: MUTED }}>{month}</span>
                  </div>
                );
              })}
            </div>
          </GCard>
        )}

      </div>
    </AdminLayout>
  );
}
