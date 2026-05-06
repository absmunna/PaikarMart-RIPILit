import { useMemo } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSeller } from "@/seller/SellerContext";
import { Eye, MousePointerClick, ShoppingBag, TrendingUp } from "lucide-react";

const PIE_COLORS = ["hsl(var(--primary))", "#8b5cf6", "#22d3ee", "#facc15", "#f97316"];

export default function SellerAnalytics() {
  const { products, orders } = useSeller();

  const dailySales = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day, i) => ({
      day,
      sales: 200 + Math.round(Math.sin(i + 1) * 120 + i * 60 + 180),
      orders: 4 + Math.round(Math.cos(i) * 2 + i * 0.5 + 3),
    }));
  }, []);

  const productPerformance = useMemo(
    () =>
      products
        .map((p) => ({
          name: p.title,
          views: p.views,
          orders: orders.filter((o) => o.productTitle === p.title).length,
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 5),
    [products, orders],
  );

  const trafficSources = [
    { name: "Direct", value: 38 },
    { name: "Search", value: 27 },
    { name: "Social", value: 19 },
    { name: "Reels", value: 11 },
    { name: "Demand", value: 5 },
  ];

  const totalViews = products.reduce((s, p) => s + p.views, 0);
  const totalOrders = orders.length;
  const conversion = totalViews ? ((totalOrders / totalViews) * 100).toFixed(1) : "0.0";
  const engagement = 4.2;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-white/60 mt-1">Track how your shop is performing over time.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat icon={Eye} label="Views (7d)" value={totalViews.toLocaleString()} />
        <Stat icon={ShoppingBag} label="Orders" value={String(totalOrders)} />
        <Stat icon={MousePointerClick} label="Conversion" value={`${conversion}%`} />
        <Stat icon={TrendingUp} label="Engagement" value={`${engagement}%`} />
      </div>

      <GlassCard className="p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Daily Sales</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailySales}>
              <defs>
                <linearGradient id="anaSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="day"
                stroke="rgba(255,255,255,0.3)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
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
                dataKey="sales"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                fill="url(#anaSales)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-white mb-6">Orders per Day</h2>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="day"
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
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
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                />
                <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Traffic Sources</h2>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficSources}
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {trafficSources.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "white" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {trafficSources.map((s, i) => (
              <div key={s.name} className="flex items-center gap-2 text-xs text-white/70">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                />
                {s.name}
                <span className="text-white/40 ml-auto">{s.value}%</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Product Performance</h2>
        {productPerformance.length === 0 ? (
          <p className="text-white/50 text-sm py-6 text-center">No products to analyze yet.</p>
        ) : (
          <div className="flex flex-col divide-y divide-white/5">
            {productPerformance.map((p, i) => {
              const max = productPerformance[0].views || 1;
              const pct = Math.max(6, (p.views / max) * 100);
              return (
                <div key={i} className="py-3 flex items-center gap-4">
                  <div className="w-6 text-white/40 text-sm">{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">{p.name}</div>
                    <div className="mt-1.5 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right text-xs text-white/60 w-24 shrink-0">
                    <div className="text-white text-sm font-semibold">
                      {p.views.toLocaleString()}
                    </div>
                    <div>views · {p.orders} orders</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <GlassCard className="p-5 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-white/50 text-xs font-medium uppercase tracking-wide">
        <Icon className="w-4 h-4" />
        {label}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </GlassCard>
  );
}
