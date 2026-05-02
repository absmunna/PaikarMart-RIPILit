import React, { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useListOrders } from "@workspace/api-client-react";
import { ShoppingBag, Search, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

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

const TABS = ["all","pending","processing","delivered","cancelled"];

export default function AdminOrdersPage() {
  const { data, isLoading } = useListOrders({ limit: 100 });
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");

  const orders = (data?.orders ?? []).filter(o => {
    const matchTab = tab === "all" || String(o.status ?? "").toLowerCase() === tab;
    const matchSearch = !search || String(o.customerName ?? "").toLowerCase().includes(search.toLowerCase()) || String(o.id ?? "").includes(search);
    return matchTab && matchSearch;
  });

  const totals = {
    revenue: orders.reduce((s, o) => s + (o.totalAmount ?? 0), 0),
    pending: (data?.orders ?? []).filter(o => o.status === "pending").length,
    delivered: (data?.orders ?? []).filter(o => o.status === "delivered").length,
  };

  return (
    <AdminLayout title="All Orders">
      <div className="max-w-5xl mx-auto space-y-4">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <GCard className="p-4 text-center"><p className="font-bold text-lg" style={{ color: GLOW }}>{isLoading ? "—" : `৳ ${totals.revenue.toLocaleString()}`}</p><p className="text-xs" style={{ color: MUTED }}>Total Revenue</p></GCard>
          <GCard className="p-4 text-center"><p className="font-bold text-lg" style={{ color: GOLD }}>{isLoading ? "—" : totals.pending}</p><p className="text-xs" style={{ color: MUTED }}>Pending</p></GCard>
          <GCard className="p-4 text-center"><p className="font-bold text-lg" style={{ color: GLOW }}>{isLoading ? "—" : totals.delivered}</p><p className="text-xs" style={{ color: MUTED }}>Delivered</p></GCard>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-48 flex items-center gap-2 h-10 px-4 rounded-xl" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
            <Search className="h-4 w-4 shrink-0" style={{ color: MUTED }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." className="flex-1 bg-transparent border-none outline-none text-sm" style={{ color: TEXT }} />
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)} className="h-9 px-3 rounded-xl text-xs font-semibold capitalize shrink-0 transition-all" style={{ background: tab === t ? GLOW : "rgba(255,255,255,0.06)", color: tab === t ? "#061A12" : MUTED, border: "1px solid rgba(255,255,255,0.10)" }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <GCard>
          <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <h2 className="font-semibold text-sm" style={{ color: TEXT }}>Orders <span className="text-xs font-normal ml-2" style={{ color: MUTED }}>({orders.length})</span></h2>
          </div>
          {isLoading ? (
            <div className="p-4 space-y-3 animate-pulse">{[1,2,3,4].map(i => <div key={i} className="h-16 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }} />)}</div>
          ) : orders.length === 0 ? (
            <div className="py-14 flex flex-col items-center gap-2">
              <ShoppingBag className="h-12 w-12 opacity-20" style={{ color: MUTED }} />
              <p className="text-sm" style={{ color: MUTED }}>No orders found</p>
            </div>
          ) : (
            <div>
              {orders.map((o, i) => {
                const status = String(o.status ?? "pending").toLowerCase();
                const cfg = STATUS_CFG[status] ?? STATUS_CFG.pending;
                const Ic = cfg.icon;
                const date = o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-BD", { day: "numeric", month: "short" }) : "—";
                return (
                  <div key={o.id} className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: i < orders.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-bold" style={{ color: RED }}>#{o.id.slice(-8).toUpperCase()}</span>
                        <span className="text-xs" style={{ color: MUTED }}>{date}</span>
                      </div>
                      <p className="text-sm font-medium" style={{ color: TEXT }}>{o.customerName}</p>
                      <p className="text-xs" style={{ color: MUTED }}>{o.customerPhone} · {o.paymentMethod}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold mb-1" style={{ color: TEXT }}>৳ {(o.totalAmount ?? 0).toLocaleString()}</p>
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

      </div>
    </AdminLayout>
  );
}
