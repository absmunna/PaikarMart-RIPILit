import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, Link } from "wouter";
import { useGetAdminDashboard, useApproveSeller, customFetch } from "@workspace/api-client-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import {
  Users, Store, ShoppingBag, DollarSign, CheckCircle,
  XCircle, TrendingUp, ArrowUpRight, LayoutDashboard,
  Settings, FileText, Activity, ChevronRight, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, string> = {
  pending:   "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
  confirmed: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/25",
};

const ADMIN_LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users",     label: "Users",     icon: Users },
  { href: "/admin/registry",  label: "Registry",  icon: FileText },
  { href: "/admin/settings",  label: "Settings",  icon: Settings },
  { href: "/admin/changes",   label: "Change Log", icon: Activity },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const qc = useQueryClient();
  const [actionPending, setActionPending] = useState<string | null>(null);

  const { data: dashboard, isLoading } = useGetAdminDashboard({ query: { enabled: isAdmin } });

  const approveSeller = useApproveSeller({
    mutation: {
      onSuccess: (_, vars) => {
        toast.success("Seller approved");
        setActionPending(null);
        qc.invalidateQueries({ queryKey: ["/api/admin/dashboard"] });
        qc.invalidateQueries({ queryKey: ["/api/sellers"] });
      },
      onError: () => {
        toast.error("Failed to approve seller");
        setActionPending(null);
      },
    },
  });

  const handleApprove = (sellerId: string) => {
    setActionPending(`approve-${sellerId}`);
    approveSeller.mutate({ id: sellerId });
  };

  const handleReject = async (sellerId: string) => {
    setActionPending(`reject-${sellerId}`);
    try {
      await customFetch(`/api/sellers/${sellerId}/suspend`, { method: "PUT" });
      toast.success("Seller rejected/suspended");
      qc.invalidateQueries({ queryKey: ["/api/admin/dashboard"] });
      qc.invalidateQueries({ queryKey: ["/api/sellers"] });
    } catch {
      toast.error("Failed to reject seller");
    } finally {
      setActionPending(null);
    }
  };

  if (!isAdmin) return <Redirect to="/login" />;

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Skeleton className="h-7 w-48 mb-6 bg-white/5" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 w-full rounded-2xl bg-white/5" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Skeleton className="h-72 w-full rounded-2xl bg-white/5" />
            <Skeleton className="h-72 w-full rounded-2xl bg-white/5" />
          </div>
        </div>
      </Layout>
    );
  }

  const stats = [
    { title: "Total Users",    value: dashboard?.totalUsers    || 0,   icon: Users,       color: "text-blue-400",    bg: "bg-blue-500/15",    trend: "+12%" },
    { title: "Total Sellers",  value: dashboard?.totalSellers  || 0,   icon: Store,       color: "text-purple-400",  bg: "bg-purple-500/15",  trend: "+8%" },
    { title: "Total Orders",   value: dashboard?.totalOrders   || 0,   icon: ShoppingBag, color: "text-orange-400",  bg: "bg-orange-500/15",  trend: "+5%" },
    { title: "Platform Profit",value: `৳${(dashboard?.platformProfit ?? 0).toLocaleString()}`, icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/15", trend: "+18%" },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-6xl">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-sm text-white/40 mt-0.5">Platform overview & management</p>
          </div>
          <div className="flex gap-2">
            {ADMIN_LINKS.slice(1).map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <button className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white/50 hover:text-white hover:bg-white/8 transition-all border border-white/8">
                  <Icon className="h-3.5 w-3.5" /> {label}
                </button>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <GlassCard key={i} className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center", s.bg)}>
                    <Icon className={cn("h-4.5 w-4.5", s.color)} />
                  </div>
                  <span className="flex items-center text-[11px] text-emerald-400 font-semibold">
                    <ArrowUpRight className="h-3 w-3" />{s.trend}
                  </span>
                </div>
                <p className="text-2xl font-bold text-white mb-0.5">{s.value}</p>
                <p className="text-xs text-white/40">{s.title}</p>
              </GlassCard>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Seller Applications */}
          <GlassCard className="overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Store className="h-4 w-4 text-purple-400" /> Seller Applications
              </h2>
              <TrendingUp className="h-4 w-4 text-white/25" />
            </div>
            {dashboard?.recentSellers?.length ? (
              <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                {dashboard.recentSellers.map((seller: Record<string, unknown>) => {
                  const isApprovePending = actionPending === `approve-${seller.id}`;
                  const isRejectPending  = actionPending === `reject-${seller.id}`;
                  return (
                    <div key={seller.id as string} className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-white/3 transition-colors">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white/85 truncate">{seller.shopName as string}</p>
                        <p className="text-xs text-white/35 capitalize">
                          {(seller.businessType as string)?.replace(/_/g, " ")}
                          {" · "}
                          <span className={cn("font-semibold",
                            seller.status === "approved"  ? "text-emerald-400" :
                            seller.status === "suspended" ? "text-red-400" : "text-yellow-400"
                          )}>{seller.status as string}</span>
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleApprove(seller.id as string)}
                          disabled={!!actionPending || seller.status === "approved"}
                          className="h-7 px-2.5 rounded-lg flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/25 hover:bg-emerald-500/25 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {isApprovePending ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(seller.id as string)}
                          disabled={!!actionPending || seller.status === "suspended"}
                          className="h-7 px-2.5 rounded-lg flex items-center gap-1 text-[11px] font-bold text-red-400 bg-red-500/15 border border-red-500/25 hover:bg-red-500/25 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {isRejectPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />}
                          Reject
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-10 text-center text-sm text-white/30">No pending applications.</div>
            )}
          </GlassCard>

          {/* Recent Orders */}
          <GlassCard className="overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-orange-400" /> Recent Orders
              </h2>
              <Link href="/admin/users">
                <span className="text-xs text-emerald-400 hover:text-emerald-300 cursor-pointer flex items-center gap-1">
                  View All <ChevronRight className="h-3 w-3" />
                </span>
              </Link>
            </div>
            {dashboard?.recentOrders?.length ? (
              <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                {dashboard.recentOrders.map((order: Record<string, unknown>) => {
                  const sc = STATUS_COLORS[order.status as string] ?? STATUS_COLORS.pending;
                  return (
                    <div key={order.id as string} className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-white/3 transition-colors">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white/85">Order #{order.id as string}</p>
                        <p className="text-xs text-white/35">
                          {new Date(order.createdAt as string).toLocaleDateString("en-BD", { day: "numeric", month: "short" })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-sm font-bold text-white">৳{(order.totalAmount as number)?.toLocaleString()}</span>
                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize", sc)}>
                          {order.status as string}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-10 text-center text-sm text-white/30">No recent orders.</div>
            )}
          </GlassCard>
        </div>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 lg:hidden">
          {ADMIN_LINKS.slice(1).map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <GlassCard className="p-3 flex items-center gap-2 hover:border-white/20 transition-all cursor-pointer">
                <Icon className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-medium text-white/70">{label}</span>
              </GlassCard>
            </Link>
          ))}
        </div>

      </div>
    </Layout>
  );
}
