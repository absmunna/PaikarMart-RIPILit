import React, { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Users, Search, ShieldCheck, ShieldX, Mail } from "lucide-react";

const GLOW = "#00FF9C"; const RED = "#FF3B3B"; const TEXT = "#E8F5EE"; const MUTED = "#A3C9B8"; const GOLD = "#f59e0b";

function GCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className} style={{ background: "linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>{children}</div>;
}

const ROLE_CFG: Record<string, { color: string; bg: string }> = {
  admin:  { color: RED,  bg: "rgba(255,59,59,0.12)"  },
  seller: { color: GOLD, bg: "rgba(245,158,11,0.12)" },
  buyer:  { color: GLOW, bg: "rgba(0,255,156,0.12)"  },
};

const SAMPLE_USERS = [
  { id: "1", name: "Karim Ahmed",    email: "karim@example.com",  role: "buyer",  createdAt: "2025-03-12" },
  { id: "2", name: "Rina Begum",     email: "rina@example.com",   role: "seller", createdAt: "2025-02-20" },
  { id: "3", name: "Hasan Ali",      email: "hasan@example.com",  role: "buyer",  createdAt: "2025-04-01" },
  { id: "4", name: "Nadia Islam",    email: "nadia@example.com",  role: "seller", createdAt: "2025-01-15" },
  { id: "5", name: "PaikarMart Admin",email:"admin@example.com",  role: "admin",  createdAt: "2024-12-01" },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const users = SAMPLE_USERS.filter(u => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const counts = { buyer: SAMPLE_USERS.filter(u => u.role === "buyer").length, seller: SAMPLE_USERS.filter(u => u.role === "seller").length };

  return (
    <AdminLayout title="User Management">
      <div className="max-w-5xl mx-auto space-y-4">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <GCard className="p-4 text-center"><p className="font-bold text-xl" style={{ color: GLOW }}>{SAMPLE_USERS.length}</p><p className="text-xs" style={{ color: MUTED }}>Total Users</p></GCard>
          <GCard className="p-4 text-center"><p className="font-bold text-xl" style={{ color: GOLD }}>{counts.seller}</p><p className="text-xs" style={{ color: MUTED }}>Sellers</p></GCard>
          <GCard className="p-4 text-center"><p className="font-bold text-xl" style={{ color: "#8b5cf6" }}>{counts.buyer}</p><p className="text-xs" style={{ color: MUTED }}>Buyers</p></GCard>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-48 flex items-center gap-2 h-10 px-4 rounded-xl" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
            <Search className="h-4 w-4 shrink-0" style={{ color: MUTED }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="flex-1 bg-transparent border-none outline-none text-sm" style={{ color: TEXT }} />
          </div>
          <div className="flex gap-2">
            {["all","buyer","seller","admin"].map(r => (
              <button key={r} onClick={() => setRoleFilter(r)} className="h-9 px-3 rounded-xl text-xs font-semibold capitalize transition-all" style={{ background: roleFilter === r ? GLOW : "rgba(255,255,255,0.06)", color: roleFilter === r ? "#061A12" : MUTED, border: "1px solid rgba(255,255,255,0.10)" }}>
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Users list */}
        <GCard>
          <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <h2 className="font-semibold text-sm" style={{ color: TEXT }}>Users <span className="text-xs font-normal ml-2" style={{ color: MUTED }}>({users.length})</span></h2>
          </div>
          {users.length === 0 ? (
            <div className="py-14 flex flex-col items-center gap-2">
              <Users className="h-12 w-12 opacity-20" style={{ color: MUTED }} />
              <p className="text-sm" style={{ color: MUTED }}>No users found</p>
            </div>
          ) : (
            <div>
              {users.map((u, i) => {
                const roleCfg = ROLE_CFG[u.role] ?? ROLE_CFG.buyer;
                const initials = u.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
                return (
                  <div key={u.id} className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: i < users.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                    <div className="h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0" style={{ background: `${roleCfg.color}20`, color: roleCfg.color }}>{initials}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: TEXT }}>{u.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Mail className="h-3 w-3" style={{ color: MUTED }} />
                        <span className="text-xs" style={{ color: MUTED }}>{u.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs" style={{ color: MUTED }}>{new Date(u.createdAt).toLocaleDateString("en-BD",{ day:"numeric", month:"short" })}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold capitalize" style={{ background: roleCfg.bg, color: roleCfg.color }}>{u.role}</span>
                      <button className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-white/6 transition-all" style={{ color: GLOW }} title="Verify"><ShieldCheck className="h-3.5 w-3.5" /></button>
                      <button className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-red-900/20 transition-all" style={{ color: RED }} title="Suspend"><ShieldX className="h-3.5 w-3.5" /></button>
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
