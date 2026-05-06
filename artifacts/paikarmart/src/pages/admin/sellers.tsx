import React, { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useListSellers, useApproveSeller } from "@workspace/api-client-react";
import { Store, Search, CheckCircle, XCircle, Clock, Star, MapPin } from "lucide-react";
import { toast } from "sonner";

const GLOW = "#00FF9C"; const RED = "#FF3B3B"; const TEXT = "#E8F5EE"; const MUTED = "#A3C9B8"; const GOLD = "#f59e0b";

function GCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className} style={{ background: "linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>{children}</div>;
}

const STATUS_CFG: Record<string, { color: string; bg: string; icon: React.ElementType; label: string }> = {
  pending:  { color: GOLD, bg: "rgba(245,158,11,0.12)", icon: Clock,        label: "Pending"  },
  approved: { color: GLOW, bg: "rgba(0,255,156,0.12)",  icon: CheckCircle,  label: "Approved" },
  rejected: { color: RED,  bg: "rgba(255,59,59,0.12)",  icon: XCircle,      label: "Rejected" },
};

export default function AdminSellersPage() {
  const { data, isLoading, refetch } = useListSellers({ limit: 50 });
  const { mutate: approveSeller } = useApproveSeller();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const sellers = (data?.sellers ?? []).filter(s => {
    const matchSearch = !search || s.businessName.toLowerCase().includes(search.toLowerCase()) || (s.district ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || (s.status ?? "pending") === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleApprove = (id: string, approve: boolean) => {
    approveSeller(
      { id, approved: approve },
      {
        onSuccess: () => { toast.success(approve ? "Seller approved!" : "Seller rejected"); refetch(); },
        onError: () => toast.error("Action failed"),
      }
    );
  };

  const pending  = data?.sellers?.filter(s => (s.status ?? "pending") === "pending").length ?? 0;
  const approved = data?.sellers?.filter(s => s.status === "approved").length ?? 0;

  return (
    <AdminLayout title="Seller Management">
      <div className="max-w-5xl mx-auto space-y-4">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Sellers",    value: data?.sellers?.length ?? 0, color: GLOW   },
            { label: "Pending Approval", value: pending,                     color: GOLD   },
            { label: "Approved",         value: approved,                    color: "#8b5cf6" },
          ].map(s => (
            <GCard key={s.label} className="p-4 text-center">
              <p className="font-bold text-xl" style={{ color: s.color }}>{isLoading ? "—" : s.value}</p>
              <p className="text-xs mt-0.5" style={{ color: MUTED }}>{s.label}</p>
            </GCard>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-48 flex items-center gap-2 h-10 px-4 rounded-xl" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
            <Search className="h-4 w-4 shrink-0" style={{ color: MUTED }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sellers..." className="flex-1 bg-transparent border-none outline-none text-sm" style={{ color: TEXT }} />
          </div>
          <div className="flex gap-2">
            {["all","pending","approved","rejected"].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} className="h-9 px-3 rounded-xl text-xs font-semibold capitalize transition-all" style={{ background: statusFilter === s ? GLOW : "rgba(255,255,255,0.06)", color: statusFilter === s ? "#061A12" : MUTED, border: "1px solid rgba(255,255,255,0.10)" }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Sellers list */}
        <GCard>
          <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <h2 className="font-semibold text-sm" style={{ color: TEXT }}>Sellers <span className="text-xs font-normal ml-2" style={{ color: MUTED }}>({sellers.length})</span></h2>
          </div>

          {isLoading ? (
            <div className="p-4 space-y-3 animate-pulse">{[1,2,3].map(i => <div key={i} className="h-20 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }} />)}</div>
          ) : sellers.length === 0 ? (
            <div className="py-14 flex flex-col items-center gap-2">
              <Store className="h-12 w-12 opacity-20" style={{ color: MUTED }} />
              <p className="text-sm" style={{ color: MUTED }}>No sellers found</p>
            </div>
          ) : (
            <div>
              {sellers.map((s, i) => {
                const status = s.status ?? "pending";
                const cfg = STATUS_CFG[status] ?? STATUS_CFG.pending;
                const Ic = cfg.icon;
                const initials = s.businessName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
                return (
                  <div key={s.id} className="px-4 py-4 flex items-center gap-3" style={{ borderBottom: i < sellers.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                    <div className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0" style={{ background: "rgba(0,255,156,0.15)", color: GLOW }}>{initials}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: TEXT }}>{s.businessName}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        {s.district && <span className="flex items-center gap-1 text-xs" style={{ color: MUTED }}><MapPin className="h-3 w-3" /> {s.district}</span>}
                        {s.rating && <span className="flex items-center gap-1 text-xs" style={{ color: GOLD }}><Star className="h-3 w-3 fill-yellow-400" /> {s.rating}</span>}
                        <span className="text-xs" style={{ color: MUTED }}>{s.businessType ?? "General"}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: cfg.bg, color: cfg.color }}>
                        <Ic className="h-2.5 w-2.5" /> {cfg.label}
                      </span>
                      {status === "pending" && (
                        <>
                          <button onClick={() => handleApprove(s.id, true)} className="h-7 px-2.5 rounded-lg text-[10px] font-bold transition-all hover:bg-green-900/30" style={{ border: `1px solid ${GLOW}40`, color: GLOW }}>
                            Approve
                          </button>
                          <button onClick={() => handleApprove(s.id, false)} className="h-7 px-2.5 rounded-lg text-[10px] font-bold transition-all hover:bg-red-900/20" style={{ border: `1px solid ${RED}40`, color: RED }}>
                            Reject
                          </button>
                        </>
                      )}
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
