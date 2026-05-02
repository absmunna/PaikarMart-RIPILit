import React, { useState } from "react";
import { SellerLayout } from "@/components/layout/SellerLayout";
import { useListOrders } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { ShoppingBag, Clock, CheckCircle, XCircle, AlertCircle, Search } from "lucide-react";

const GLOW = "#00FF9C"; const RED = "#FF3B3B"; const TEXT = "#E8F5EE"; const MUTED = "#A3C9B8"; const GOLD = "#f59e0b";

function GCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className} style={{ background: "linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>{children}</div>;
}

const STATUS_CFG: Record<string, { color: string; bg: string; icon: React.ElementType; label: string }> = {
  pending:    { color: GOLD,      bg: "rgba(245,158,11,0.12)", icon: Clock,        label: "Pending"    },
  processing: { color: "#60a5fa", bg: "rgba(96,165,250,0.12)", icon: AlertCircle,  label: "Processing" },
  delivered:  { color: GLOW,      bg: "rgba(0,255,156,0.12)",  icon: CheckCircle,  label: "Delivered"  },
  cancelled:  { color: RED,       bg: "rgba(255,59,59,0.12)",  icon: XCircle,      label: "Cancelled"  },
};

const TABS = ["all", "pending", "processing", "delivered", "cancelled"];

export default function SellerOrdersPage() {
  const { user } = useAuth();
  const { data, isLoading } = useListOrders({ vendor_id: user?.id, limit: 50 });
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const orders = (data?.orders ?? []).filter(o => {
    const matchTab = activeTab === "all" || String(o.status ?? "").toLowerCase() === activeTab;
    const matchSearch = !search || String(o.customerName ?? "").toLowerCase().includes(search.toLowerCase()) || String(o.id ?? "").includes(search);
    return matchTab && matchSearch;
  });

  return (
    <SellerLayout title="Orders">
      <div className="max-w-4xl mx-auto space-y-4">

        {/* Search */}
        <div className="flex items-center gap-2 h-10 px-4 rounded-xl" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
          <Search className="h-4 w-4 shrink-0" style={{ color: MUTED }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order ID or customer..." className="flex-1 bg-transparent border-none outline-none text-sm" style={{ color: TEXT }} />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {TABS.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className="h-8 px-4 rounded-full text-xs font-semibold shrink-0 capitalize transition-all"
              style={{ background: activeTab === t ? GLOW : "rgba(255,255,255,0.06)", color: activeTab === t ? "#061A12" : MUTED, border: activeTab === t ? `1px solid ${GLOW}` : "1px solid rgba(255,255,255,0.10)" }}>
              {t}
            </button>
          ))}
        </div>

        {/* Orders list */}
        <GCard>
          <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <h2 className="font-semibold text-sm" style={{ color: TEXT }}>Orders <span className="text-xs font-normal ml-2" style={{ color: MUTED }}>({orders.length})</span></h2>
          </div>
          {isLoading ? (
            <div className="p-4 space-y-3 animate-pulse">{[1,2,3].map(i => <div key={i} className="h-20 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }} />)}</div>
          ) : orders.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-2">
              <ShoppingBag className="h-12 w-12 opacity-20" style={{ color: MUTED }} />
              <p className="text-sm font-medium" style={{ color: TEXT }}>No orders found</p>
            </div>
          ) : (
            <div>
              {orders.map((o, i) => {
                const status = String(o.status ?? "pending").toLowerCase();
                const cfg = STATUS_CFG[status] ?? STATUS_CFG.pending;
                const Ic = cfg.icon;
                const date = o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-BD", { day: "numeric", month: "short", year: "numeric" }) : "—";
                return (
                  <div key={o.id} className="px-4 py-3.5" style={{ borderBottom: i < orders.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold" style={{ color: GLOW }}>#{o.id.slice(-8).toUpperCase()}</span>
                          <span className="text-xs" style={{ color: MUTED }}>{date}</span>
                        </div>
                        <p className="text-sm font-semibold" style={{ color: TEXT }}>{o.customerName}</p>
                        <p className="text-xs mt-0.5" style={{ color: MUTED }}>{o.customerPhone} · {o.deliveryType ?? "Standard"}</p>
                        <p className="text-xs mt-0.5" style={{ color: MUTED }}>{o.items?.length ?? 0} item(s) · {o.paymentMethod}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-sm mb-1.5" style={{ color: RED }}>৳ {(o.totalAmount ?? 0).toLocaleString()}</p>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold" style={{ background: cfg.bg, color: cfg.color }}>
                          <Ic className="h-2.5 w-2.5" /> {cfg.label}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </GCard>

      </div>
    </SellerLayout>
  );
}
