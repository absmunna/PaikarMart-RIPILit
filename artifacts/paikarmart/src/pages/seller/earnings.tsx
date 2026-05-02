import React from "react";
import { SellerLayout } from "@/components/layout/SellerLayout";
import { useGetSellerDashboard } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { Wallet, TrendingUp, ShoppingBag, ArrowUpRight, ArrowDownRight } from "lucide-react";

const GLOW = "#00FF9C"; const RED = "#FF3B3B"; const TEXT = "#E8F5EE"; const MUTED = "#A3C9B8"; const GOLD = "#f59e0b";

function GCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className} style={{ background: "linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>{children}</div>;
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function SellerEarningsPage() {
  const { user } = useAuth();
  const { data, isLoading } = useGetSellerDashboard(user?.id ?? "");
  const d = data;
  const monthly = d?.monthlyRevenue ?? [];
  const totalRevenue = d?.totalRevenue ?? 0;
  const commission = totalRevenue * 0.05;
  const netEarnings = totalRevenue - commission;
  const maxRev = Math.max(...monthly.map((m: Record<string,unknown>) => m.revenue as number ?? 0), 1);

  const STATS = [
    { label: "Gross Revenue",  value: `৳ ${totalRevenue.toLocaleString()}`,  icon: TrendingUp,  color: GLOW,       trend: "+12.4%" },
    { label: "Platform Fee",   value: `৳ ${commission.toLocaleString()}`,     icon: ArrowDownRight, color: RED,     trend: "5%"     },
    { label: "Net Earnings",   value: `৳ ${netEarnings.toLocaleString()}`,    icon: Wallet,      color: GOLD,       trend: "+11.8%" },
    { label: "Total Orders",   value: String(d?.totalOrders ?? 0),            icon: ShoppingBag, color: "#8b5cf6",  trend: ""       },
  ];

  return (
    <SellerLayout title="Earnings">
      <div className="max-w-4xl mx-auto space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {STATS.map(s => (
            <GCard key={s.label} className="p-4">
              {isLoading ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-9 w-9 rounded-xl" style={{ background: "rgba(255,255,255,0.07)" }} />
                  <div className="h-3 rounded w-20" style={{ background: "rgba(255,255,255,0.07)" }} />
                  <div className="h-5 rounded w-full" style={{ background: "rgba(255,255,255,0.10)" }} />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: `${s.color}18` }}>
                      <s.icon className="h-[18px] w-[18px]" style={{ color: s.color }} />
                    </div>
                    {s.trend && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: s.color === RED ? "rgba(255,59,59,0.12)" : "rgba(0,255,156,0.10)", color: s.color === RED ? RED : GLOW }}>{s.trend}</span>}
                  </div>
                  <p className="text-[11px] font-medium mb-0.5" style={{ color: MUTED }}>{s.label}</p>
                  <p className="font-bold text-lg leading-tight" style={{ color: TEXT }}>{s.value}</p>
                </>
              )}
            </GCard>
          ))}
        </div>

        {/* Chart */}
        <GCard className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm" style={{ color: TEXT }}>Monthly Earnings</h2>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(0,255,156,0.10)", color: GLOW }}>Last {monthly.length || 6} months</span>
          </div>
          {monthly.length === 0 && !isLoading ? (
            <div className="h-28 flex items-center justify-center">
              <p className="text-sm" style={{ color: MUTED }}>No earnings data yet</p>
            </div>
          ) : (
            <div className="flex items-end gap-2 h-36">
              {(monthly.length > 0 ? monthly : Array.from({ length: 6 }, (_, i) => ({ month: i + 7, revenue: 0 }))).map((m: Record<string, unknown>, i: number) => {
                const rev = m.revenue as number ?? 0;
                const h = isLoading ? 40 : Math.round((rev / maxRev) * 100);
                const isLast = i === monthly.length - 1;
                const month = MONTHS[(m.month as number ?? 1) - 1] ?? `M${i + 1}`;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    {!isLoading && <span className="text-[9px] font-semibold" style={{ color: isLast ? GLOW : MUTED }}>৳{rev >= 1000 ? (rev / 1000).toFixed(0) + "k" : rev}</span>}
                    <div className="w-full rounded-t-lg transition-all duration-500" style={{ height: `${Math.max(h, 4)}%`, background: isLoading ? "rgba(255,255,255,0.06)" : isLast ? `linear-gradient(180deg,${GLOW},rgba(0,255,156,0.35))` : "rgba(255,255,255,0.08)", boxShadow: isLast ? `0 0 14px rgba(0,255,156,0.3)` : "none" }} />
                    <span className="text-[9px]" style={{ color: MUTED }}>{month}</span>
                  </div>
                );
              })}
            </div>
          )}
        </GCard>

        {/* Commission breakdown */}
        <GCard className="p-4">
          <h2 className="font-semibold text-sm mb-4" style={{ color: TEXT }}>Fee Breakdown</h2>
          <div className="space-y-3">
            {[
              { label: "Gross Revenue",     value: `৳ ${totalRevenue.toLocaleString()}`,  color: TEXT },
              { label: "Platform Fee (5%)", value: `- ৳ ${commission.toLocaleString()}`,   color: RED  },
              { label: "Net Earnings",      value: `৳ ${netEarnings.toLocaleString()}`,    color: GLOW },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="text-sm" style={{ color: MUTED }}>{row.label}</span>
                <span className="text-sm font-bold" style={{ color: row.color }}>{isLoading ? "—" : row.value}</span>
              </div>
            ))}
          </div>
        </GCard>

      </div>
    </SellerLayout>
  );
}
