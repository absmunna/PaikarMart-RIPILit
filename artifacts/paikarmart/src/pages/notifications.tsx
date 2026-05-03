import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { useListNotifications } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { GlassCard } from "@/components/ui/GlassCard";
import { Bell, Package, Truck, Info, Store, Check, BellOff } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  order:    { icon: Package, color: "text-blue-400",   bg: "bg-blue-500/15" },
  delivery: { icon: Truck,   color: "text-emerald-400", bg: "bg-emerald-500/15" },
  account:  { icon: Info,    color: "text-purple-400",  bg: "bg-purple-500/15" },
  seller:   { icon: Store,   color: "text-orange-400",  bg: "bg-orange-500/15" },
  default:  { icon: Bell,    color: "text-white/40",    bg: "bg-white/5" },
};

const FILTERS = ["All", "Unread", "Orders", "Delivery", "Account"];

export default function NotificationsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("All");

  if (user?.id === "guest") return <Redirect to="/login" />;

  const { data: notifData, isLoading } = useListNotifications({ user_id: user?.id || "user-1" });
  const notifications = notifData?.notifications || [];
  const unreadCount = notifData?.unreadCount || 0;

  const filtered = notifications.filter((n: any) => {
    if (filter === "Unread")   return !n.read;
    if (filter === "Orders")   return n.type === "order";
    if (filter === "Delivery") return n.type === "delivery";
    if (filter === "Account")  return n.type === "account";
    return true;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-3xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">{unreadCount}</span>
              )}
            </h1>
            <p className="text-sm text-white/40 mt-0.5">Your updates and alerts</p>
          </div>
          {unreadCount > 0 && (
            <button className="text-xs text-emerald-400 flex items-center gap-1.5 hover:text-emerald-300 transition-colors">
              <Check className="h-3.5 w-3.5" /> Mark all read
            </button>
          )}
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
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 w-full rounded-2xl bg-white/5" />)}
          </div>
        ) : filtered.length === 0 ? (
          <GlassCard className="py-16 text-center">
            <BellOff className="h-10 w-10 text-white/10 mx-auto mb-3" />
            <p className="text-white/40 font-medium text-sm">No notifications{filter !== "All" ? ` in "${filter}"` : ""}</p>
            <p className="text-xs text-white/25 mt-1">You're all caught up!</p>
          </GlassCard>
        ) : (
          <GlassCard className="overflow-hidden">
            <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              {filtered.map((notif: any) => {
                const cfg = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.default;
                const Icon = cfg.icon;
                return (
                  <div
                    key={notif.id}
                    className={cn(
                      "px-4 py-3.5 flex items-start gap-3 transition-colors hover:bg-white/3 cursor-pointer",
                      !notif.read && "bg-emerald-500/4",
                    )}
                  >
                    <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5", cfg.bg)}>
                      <Icon className={cn("h-4 w-4", cfg.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn("text-sm font-semibold line-clamp-1", notif.read ? "text-white/70" : "text-white")}>
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-white/30 shrink-0">
                          {new Date(notif.createdAt || Date.now()).toLocaleDateString("en-BD", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                      <p className="text-xs text-white/40 line-clamp-2 mt-0.5">{notif.message}</p>
                    </div>
                    {!notif.read && (
                      <div className="h-2 w-2 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                    )}
                  </div>
                );
              })}
            </div>
          </GlassCard>
        )}
      </div>
    </Layout>
  );
}
