import React from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { useGetUserWallet } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Wallet as WalletIcon, ArrowUpRight,
  Clock, TrendingUp, Lock, Gift, BarChart3, Coins,
} from "lucide-react";

const MOCK_GRAPH = [30, 55, 40, 70, 60, 85, 75, 90, 80, 95, 88, 100];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function BarGraph({ data, labels }: { data: number[]; labels: string[] }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1.5 h-32">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-md transition-all duration-500 hover:opacity-80 cursor-pointer"
            style={{
              height: `${(v / max) * 100}%`,
              minHeight: 4,
              background: "linear-gradient(to top, hsl(145 65% 28%), hsl(145 60% 42%))",
            }}
            title={`${labels[i]}: ৳${v * 1000}`}
          />
          <span className="text-[9px] text-white/30">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

function StatCard({ icon, label, value, sub, accent, badge }: {
  icon: React.ReactNode; label: string; value: string;
  sub?: string; accent: string; badge?: React.ReactNode;
}) {
  return (
    <GlassCard className="p-5">
      <div className="flex items-start justify-between mb-3">
        <p className={`text-xs font-medium flex items-center gap-1.5 ${accent}`}>
          {icon} {label}
        </p>
        <ArrowUpRight className={`h-4 w-4 ${accent}`} />
      </div>
      <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
      {sub && <p className="text-xs text-white/35 mt-1">{sub}</p>}
      {badge}
    </GlassCard>
  );
}

export default function WalletPage() {
  const { user } = useAuth();
  const { data: wallet, isLoading } = useGetUserWallet(user?.id || "user-1");

  if (!user || user.id === "guest") {
    return <Redirect to="/login" />;
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <Skeleton className="h-8 w-48 mb-8 bg-white/5" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-36 w-full rounded-xl bg-white/5" />)}
          </div>
          <Skeleton className="h-64 w-full rounded-xl bg-white/5" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">My Wallet</h1>
          <p className="text-sm text-white/40 mt-1">Track your balance, rewards, and investment value</p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

          {/* Main Balance */}
          <div className="rounded-2xl p-6 md:col-span-1"
            style={{ background: "linear-gradient(135deg, hsl(145 65% 22%), hsl(145 60% 32%))", border: "1px solid rgba(16,185,129,0.3)" }}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-white/60 text-xs mb-1">Available Balance</p>
                <h2 className="text-4xl font-extrabold text-white">৳{wallet?.balance?.toLocaleString() || "0"}</h2>
              </div>
              <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center">
                <WalletIcon className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              {["Withdraw", "Deposit"].map(label => (
                <div key={label} className="flex-1 bg-white/10 rounded-lg py-2 text-center text-xs text-white/60 cursor-not-allowed opacity-60">
                  <Lock className="h-3 w-3 inline mr-1" />{label}
                  <div className="text-[9px] mt-0.5 text-white/40">Coming Soon</div>
                </div>
              ))}
            </div>
          </div>

          <StatCard
            icon={<Gift className="h-4 w-4" />}
            label="Total Earned"
            value={`৳${wallet?.totalEarned?.toLocaleString() || "0"}`}
            sub="From rewards, cashbacks & referrals"
            accent="text-emerald-400"
            badge={
              <span className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400">
                2–3% reward per order
              </span>
            }
          />

          <StatCard
            icon={<TrendingUp className="h-4 w-4" />}
            label="Investment Value"
            value={`৳${wallet?.investmentValue?.toLocaleString() || "0"}`}
            sub="Estimated account value"
            accent="text-purple-400"
            badge={
              <span className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/20 text-purple-400">
                <Lock className="h-2.5 w-2.5 inline mr-1" />Coming Soon
              </span>
            }
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-emerald-400" /> Monthly Activity
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-yellow-500/15 border border-yellow-500/20 text-yellow-400">
                Preview Data
              </span>
            </div>
            <BarGraph data={MOCK_GRAPH} labels={MONTHS} />
            <p className="text-xs text-white/25 mt-3 text-center">Real-time analytics · Coming Soon</p>
          </GlassCard>

          <GlassCard className="p-5">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2 mb-4">
              <Coins className="h-4 w-4 text-orange-400" /> Reward Breakdown
            </h3>
            <div className="space-y-3">
              {[
                { label: "Order Rewards (2–3%)", value: 65, color: "bg-emerald-500" },
                { label: "Referral Bonus",        value: 20, color: "bg-purple-500" },
                { label: "Platform Cashback",     value: 15, color: "bg-blue-500" },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs text-white/50 mb-1">
                    <span>{item.label}</span>
                    <span className="font-semibold text-white/70">{item.value}%</span>
                  </div>
                  <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-white/25 mt-4 text-center">Analytics feature · Coming Soon</p>
          </GlassCard>
        </div>

        {/* Transactions */}
        <div className="mb-2">
          <h2 className="text-base font-bold text-white mb-4">Transaction History</h2>
          <GlassCard className="overflow-hidden">
            {wallet?.transactions?.length ? (
              <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                {wallet.transactions.map((tx: any) => (
                  <div key={tx.id} className="px-4 py-3.5 flex items-center justify-between hover:bg-white/3 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                        tx.type === "reward"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-purple-500/15 text-purple-400"
                      }`}>
                        {tx.type === "reward" ? <Gift className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-white/85 capitalize">
                          {tx.type}{tx.description ? ` — ${tx.description}` : ""}
                        </p>
                        <p className="text-xs text-white/35">
                          {new Date(tx.createdAt).toLocaleDateString("en-BD", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <div className={`font-bold text-sm ${tx.type === "reward" ? "text-emerald-400" : "text-white/70"}`}>
                      {tx.type === "reward" ? "+" : ""}৳{tx.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <WalletIcon className="h-10 w-10 text-white/10 mx-auto mb-3" />
                <p className="text-white/40 font-medium text-sm">No transactions yet</p>
                <p className="text-xs text-white/25 mt-1">Start shopping to earn rewards!</p>
              </div>
            )}
          </GlassCard>
        </div>

      </div>
    </Layout>
  );
}
