import { useGetSellerStats, getGetSellerStatsQueryKey } from "@workspace/api-client-react";
import { formatBDT } from "@/lib/format";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Plus, DollarSign, ShoppingBag, Box, Eye, Users, Star } from "lucide-react";
import { Link } from "wouter";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useSeller } from "@/seller/SellerContext";

const FALLBACK_WEEKLY = [
  { day: "Mon", value: 320 },
  { day: "Tue", value: 480 },
  { day: "Wed", value: 410 },
  { day: "Thu", value: 620 },
  { day: "Fri", value: 540 },
  { day: "Sat", value: 780 },
  { day: "Sun", value: 690 },
];

export default function SellerDashboard() {
  const { data: stats } = useGetSellerStats({ query: { queryKey: getGetSellerStatsQueryKey() } });
  const { products, orders, profile } = useSeller();

  const activeOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "processing" || o.status === "shipped",
  );
  const totalSales = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const revenue = stats?.revenue ?? totalSales;
  const ordersToday = stats?.ordersToday ?? activeOrders.length;
  const productsLive = stats?.productsLive ?? products.filter((p) => p.stock > 0).length;
  const matches = stats?.activeDemandMatches ?? 4;
  const views = stats?.viewsThisWeek ?? products.reduce((s, p) => s + p.views, 0);
  const weekly = stats?.weeklySales?.length ? stats.weeklySales : FALLBACK_WEEKLY;

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-primary/20 via-blue-500/10 to-cyan-500/10 p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Welcome back, {profile.shopName}</h1>
          <p className="text-white/60 mt-1 text-sm">Compact seller control panel with orders, products and growth metrics.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/seller/products">
            <Button variant="outline" className="bg-white/5 border-white/15 text-white hover:bg-white/10">Manage Products</Button>
          </Link>
          <Link href="/seller/products/new">
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
        <Stat icon={DollarSign} label="Total Sales" value={formatBDT(revenue)} />
        <Stat icon={ShoppingBag} label="Active Orders" value={String(activeOrders.length)} />
        <Stat icon={Box} label="Products" value={String(productsLive)} />
        <Stat icon={Users} label="Matches" value={String(matches)} />
        <Stat
          icon={Eye}
          label="Views"
          value={views.toLocaleString()}
          className="col-span-2 md:col-span-1"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="p-4 col-span-1 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Weekly Revenue</h2>
            <span className="text-xs text-white/50">Last 7 days</span>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekly}>
                <defs>
                  <linearGradient id="dashRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "white" }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#dashRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
          {orders.length === 0 ? (
            <div className="flex-1 flex flex-col justify-center items-center text-center text-white/50 py-8">
              <Star className="w-8 h-8 text-white/20 mb-3" />
              <p className="text-sm">No orders yet.</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-white/5">
              {orders.slice(0, 4).map((o) => (
                <div key={o.id} className="flex items-center gap-3 py-3">
                  <img
                    src={o.productImage}
                    alt=""
                    className="w-10 h-10 rounded object-cover border border-white/10"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">{o.productTitle}</div>
                    <div className="text-xs text-white/50">{o.customerName}</div>
                  </div>
                  <div className="text-sm font-semibold text-primary">{formatBDT(o.total)}</div>
                </div>
              ))}
            </div>
          )}
          <Link href="/seller/orders" className="mt-auto">
            <Button variant="ghost" className="w-full text-primary hover:bg-white/5">
              View all orders
            </Button>
          </Link>
        </GlassCard>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Top Products</h2>
          <Link href="/seller/products">
            <Button variant="link" className="text-primary pr-0">
              Manage all
            </Button>
          </Link>
        </div>
        {products.length === 0 ? (
          <div className="py-12 text-center text-white/50 border border-white/10 border-dashed rounded-xl bg-white/5">
            You haven't added any products yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.slice(0, 4).map((p) => (
              <GlassCard key={p.id} className="overflow-hidden">
                <div className="aspect-[4/3] bg-black/20">
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <div className="text-sm text-white truncate">{p.title}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-primary font-semibold">{formatBDT(p.price)}</span>
                    <span className="text-xs text-white/50">{p.views} views</span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <GlassCard className={`p-5 flex flex-col gap-2 ${className ?? ""}`}>
      <div className="flex items-center gap-2 text-white/50 text-xs font-medium uppercase tracking-wide">
        <Icon className="w-4 h-4" />
        {label}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </GlassCard>
  );
}
