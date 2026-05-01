import { Link } from "wouter";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Settings as SettingsIcon,
  History,
  Coins,
  Store,
  Sparkles,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { useGetPlatformStats } from "@workspace/api-client-react";

export default function AdminDashboardPage() {
  const { user, role, promoteToAdmin } = useAuth();
  const { data: stats } = useGetPlatformStats();

  if (role !== "admin") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <GlassCard className="p-6 text-center">
          <Sparkles className="h-10 w-10 text-primary mx-auto mb-3" />
          <h1 className="text-xl font-bold mb-2">Admin Panel</h1>
          <p className="text-sm text-muted-foreground mb-4">
            {user
              ? "You are not an admin yet. Promote this account for the demo."
              : "Log in first, then promote yourself to admin to explore the panel."}
          </p>
          {user ? (
            <Button onClick={promoteToAdmin}>Promote me to admin (demo)</Button>
          ) : (
            <Link href="/auth/login"><Button>Log in</Button></Link>
          )}
        </GlassCard>
      </div>
    );
  }

  const cards = [
    { href: "/admin/settings", Icon: SettingsIcon, title: "Platform Settings", desc: "Profit share, feature flags, payment and delivery providers." },
    { href: "/admin/changes", Icon: History, title: "AI Change Log", desc: "Track every admin and AI initiated change." },
    { href: "/admin/users", Icon: Users, title: "Users", desc: "Manage buyers, sellers and admin access." },
    { href: "/admin/registry", Icon: LayoutDashboard, title: "UI Registry", desc: "Switch component variants from one place." },
    { href: "/wallet", Icon: Coins, title: "Wallet", desc: "Review PK coin wallet and ledger events." },
    { href: "/seller", Icon: Store, title: "Seller Center", desc: "Jump into seller tools and storefront operations." },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-5 space-y-4">
      <header className="rounded-2xl border border-white/10 bg-gradient-to-r from-primary/20 via-blue-500/15 to-cyan-500/10 p-4 md:p-5">
        <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
          <ShieldCheck className="h-4 w-4" />
          Admin Control
        </div>
        <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Role based control center for platform operations</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        <GlassCard className="p-3.5"><div className="text-[11px] text-muted-foreground">Total products</div><div className="text-xl font-bold">{stats?.totalProducts ?? "-"}</div></GlassCard>
        <GlassCard className="p-3.5"><div className="text-[11px] text-muted-foreground">Total vendors</div><div className="text-xl font-bold">{stats?.totalVendors ?? "-"}</div></GlassCard>
        <GlassCard className="p-3.5"><div className="text-[11px] text-muted-foreground">Total orders</div><div className="text-xl font-bold">{stats?.totalOrders ?? "-"}</div></GlassCard>
        <GlassCard className="p-3.5"><div className="text-[11px] text-muted-foreground">Total users</div><div className="text-xl font-bold">{stats?.totalUsers ?? "-"}</div></GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {cards.map(({ href, Icon, title, desc }) => (
          <Link key={href} href={href}>
            <GlassCard className="p-4 cursor-pointer h-full" hoverEffect>
              <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center mb-2.5">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="font-semibold">{title}</div>
              <div className="text-sm text-muted-foreground">{desc}</div>
            </GlassCard>
          </Link>
        ))}
      </div>

      <GlassCard className="p-4 flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <div className="font-medium">Operational note</div>
          <div className="text-sm text-muted-foreground">UI role flows are active. Backend permission enforcement should mirror these policies.</div>
        </div>
      </GlassCard>
    </div>
  );
}

