import React from "react";
import { Layout } from "@/components/layout/Layout";
import { useGetOrder } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams, Link } from "wouter";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  ArrowLeft, Package, CheckCircle2, Truck, Clock,
  MapPin, Phone, User, CreditCard, ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_STEPS = ["pending", "confirmed", "shipped", "completed"] as const;

const STATUS_LABELS: Record<string, string> = {
  pending:   "Order Placed",
  confirmed: "Confirmed",
  shipped:   "Shipped",
  completed: "Delivered",
};

const STATUS_COLORS: Record<string, string> = {
  pending:   "text-yellow-400 bg-yellow-500/15 border-yellow-500/25",
  confirmed: "text-blue-400 bg-blue-500/15 border-blue-500/25",
  shipped:   "text-purple-400 bg-purple-500/15 border-purple-500/25",
  completed: "text-emerald-400 bg-emerald-500/15 border-emerald-500/25",
  cancelled: "text-red-400 bg-red-500/15 border-red-500/25",
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useGetOrder(id || "", { query: { enabled: !!id } });

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Skeleton className="h-5 w-32 mb-6 bg-white/5" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-44 w-full rounded-2xl bg-white/5" />
              <Skeleton className="h-60 w-full rounded-2xl bg-white/5" />
            </div>
            <Skeleton className="h-60 w-full rounded-2xl bg-white/5" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="h-20 w-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-5">
            <Package className="h-10 w-10 text-white/15" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Order not found</h1>
          <p className="text-sm text-white/40 mb-6">This order doesn't exist or you don't have access.</p>
          <Link href="/orders">
            <button className="px-5 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/25 transition-all">
              Back to Orders
            </button>
          </Link>
        </div>
      </Layout>
    );
  }

  const currentStep = STATUS_STEPS.indexOf(order.status as any);
  const statusColor = STATUS_COLORS[order.status] ?? STATUS_COLORS.pending;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-4xl">

        {/* Back + Header */}
        <Link href="/orders">
          <button className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors mb-5">
            <ArrowLeft className="h-4 w-4" /> My Orders
          </button>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl font-bold text-white">Order Details</h1>
            <p className="text-sm text-white/40 mt-0.5">#{order.id}</p>
          </div>
          <span className={cn("text-xs font-bold px-3 py-1.5 rounded-full border w-fit capitalize", statusColor)}>
            {order.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 space-y-5">

            {/* Tracking Timeline */}
            <GlassCard className="p-5">
              <h2 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
                <Truck className="h-4 w-4 text-emerald-400" /> Tracking
              </h2>
              <div className="relative ml-4">
                {STATUS_STEPS.map((s, i) => {
                  const done   = i <= currentStep;
                  const active = i === currentStep;
                  return (
                    <div key={s} className="relative flex gap-4 pb-6 last:pb-0">
                      {/* Connector line */}
                      {i < STATUS_STEPS.length - 1 && (
                        <div className={cn(
                          "absolute left-3.5 top-7 bottom-0 w-0.5 -translate-x-1/2 transition-all",
                          i < currentStep ? "bg-emerald-500" : "bg-white/8",
                        )} />
                      )}
                      {/* Dot */}
                      <div className={cn(
                        "h-7 w-7 rounded-full flex items-center justify-center shrink-0 border-2 transition-all",
                        done
                          ? "bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/30"
                          : "bg-transparent border-white/15",
                      )}>
                        <CheckCircle2 className={cn("h-3.5 w-3.5", done ? "text-white" : "text-white/20")} />
                      </div>
                      <div className="pt-0.5">
                        <p className={cn("text-sm font-semibold", active ? "text-emerald-400" : done ? "text-white/80" : "text-white/30")}>
                          {STATUS_LABELS[s]}
                        </p>
                        {s === "pending" && (
                          <p className="text-xs text-white/35 mt-0.5">
                            {new Date(order.createdAt).toLocaleString("en-BD", { dateStyle: "medium", timeStyle: "short" })}
                          </p>
                        )}
                        {s === "shipped" && order.trackingCode && (
                          <p className="text-xs text-white/35 mt-0.5">Tracking: {order.trackingCode}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            {/* Items */}
            <GlassCard className="p-5">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-purple-400" /> Items
              </h2>
              <div className="space-y-3">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-start py-2.5 border-b last:border-0"
                    style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <div className="flex-1 min-w-0 pr-3">
                      <p className="font-medium text-sm text-white/85">{item.productName}</p>
                      <p className="text-xs text-white/35 mt-0.5">
                        Qty: {item.quantity} × ৳{item.price?.toLocaleString()}
                      </p>
                      {item.vendorName && (
                        <p className="text-xs text-white/25 mt-0.5">Vendor: {item.vendorName}</p>
                      )}
                    </div>
                    <span className="font-bold text-sm text-white/80 shrink-0">
                      ৳{item.subtotal?.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>

          </div>

          <div className="space-y-5">

            {/* Order Summary */}
            <GlassCard className="p-5">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-emerald-400" /> Summary
              </h2>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Subtotal</span>
                  <span className="text-white/70">৳{(order.totalAmount - (order.deliveryCharge || 0)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Delivery</span>
                  <span className="text-white/70">৳{(order.deliveryCharge || 0).toLocaleString()}</span>
                </div>
              </div>
              <div className="border-t pt-3" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                <div className="flex justify-between font-bold text-sm text-white">
                  <span>Total</span>
                  <span className="text-emerald-400">৳{order.totalAmount?.toLocaleString()}</span>
                </div>
                <p className="text-[11px] text-white/30 mt-1 text-right capitalize">
                  via {order.paymentMethod}
                </p>
              </div>
            </GlassCard>

            {/* Shipping Info */}
            <GlassCard className="p-5">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-purple-400" /> Shipping Info
              </h2>
              <div className="space-y-3">
                {[
                  { icon: User,   label: "Name",    value: order.customerName    || "N/A" },
                  { icon: Phone,  label: "Phone",   value: order.customerPhone   || "N/A" },
                  { icon: MapPin, label: "Address", value: [order.customerAddress, order.area, order.district].filter(Boolean).join(", ") || "N/A" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="h-3.5 w-3.5 text-white/30" />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider">{label}</p>
                      <p className="text-sm text-white/75 font-medium">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

          </div>
        </div>
      </div>
    </Layout>
  );
}
