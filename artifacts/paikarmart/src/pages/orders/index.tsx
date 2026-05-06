import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useListOrders } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Package, ChevronRight, Clock, CheckCircle, Truck,
  XCircle, ShoppingBag, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending:    { label: "Pending",    color: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/25",   icon: Clock },
  confirmed:  { label: "Confirmed",  color: "bg-blue-500/15 text-blue-400 border border-blue-500/25",         icon: CheckCircle },
  processing: { label: "Processing", color: "bg-purple-500/15 text-purple-400 border border-purple-500/25",   icon: Clock },
  shipped:    { label: "Shipped",    color: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/25",          icon: Truck },
  completed:  { label: "Delivered",  color: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25", icon: CheckCircle },
  cancelled:  { label: "Cancelled",  color: "bg-red-500/15 text-red-400 border border-red-500/25",             icon: XCircle },
};

const FILTERS = ["All", "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

export default function OrdersPage() {
  const { user } = useAuth();
  const { data: ordersData, isLoading } = useListOrders({ user_id: user?.id });
  const orders = ordersData?.orders || [];
  const [filter, setFilter] = useState("All");

  const filtered = orders.filter((o: any) => {
    if (filter === "All") return true;
    if (filter === "Delivered") return o.status === "completed";
    return o.status === filter.toLowerCase();
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-4xl">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white">My Orders</h1>
          <p className="text-sm text-white/40 mt-0.5">{orders.length} order{orders.length !== 1 ? "s" : ""} total</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-none">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0",
                filter === f
                  ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                  : "bg-white/5 border border-white/8 text-white/45 hover:text-white hover:bg-white/8",
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-28 w-full rounded-2xl bg-white/5" />)}
          </div>
        ) : filtered.length === 0 ? (
          <GlassCard className="py-16 text-center">
            <ShoppingBag className="h-12 w-12 text-white/10 mx-auto mb-4" />
            <h2 className="text-base font-semibold text-white/60 mb-1">No orders {filter !== "All" ? `in "${filter}"` : "yet"}</h2>
            <p className="text-sm text-white/30 mb-6">Place an order to see it here</p>
            <Link href="/products">
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, hsl(145 65% 32%), hsl(145 60% 40%))" }}>
                Browse Products <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {filtered.map((order: any) => {
              const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
              const StatusIcon = cfg.icon;
              return (
                <Link key={order.id} href={`/orders/${order.id}`}>
                  <GlassCard className="p-4 hover:border-white/15 hover:-translate-y-0.5 transition-all cursor-pointer group">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center shrink-0">
                          <Package className="h-5 w-5 text-white/30" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white">Order #{order.id}</p>
                          <p className="text-xs text-white/35 mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString("en-BD", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={cn("text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 capitalize", cfg.color)}>
                          <StatusIcon className="h-3 w-3" /> {cfg.label}
                        </span>
                        <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-white/50 transition-colors" />
                      </div>
                    </div>

                    <div className="border-t pt-3 flex items-end justify-between gap-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                      <div className="min-w-0">
                        {order.items?.slice(0, 2).map((item: any, i: number) => (
                          <p key={i} className="text-xs text-white/55 truncate">
                            {item.quantity}× {item.productName}
                          </p>
                        ))}
                        {order.items?.length > 2 && (
                          <p className="text-xs text-white/30">+{order.items.length - 2} more item{order.items.length - 2 !== 1 ? "s" : ""}</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-base font-bold text-white">৳{order.totalAmount?.toLocaleString()}</p>
                        <p className="text-[10px] text-white/30 capitalize">{order.paymentMethod?.replace(/_/g, " ")}</p>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
