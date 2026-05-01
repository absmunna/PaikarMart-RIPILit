import {
  useListPosts,
  getListPostsQueryKey,
  useGetPlatformStats,
  getGetPlatformStatsQueryKey,
} from "@workspace/api-client-react";
import { StoryBar } from "@/components/feed/StoryBar";
import { PostCard } from "@/components/feed/PostCard";
import { CreatePostComposer } from "@/components/feed/CreatePostComposer";
import { SuggestedVendors } from "@/components/feed/SuggestedVendors";
import { TrendingRail } from "@/components/feed/TrendingRail";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Users,
  Store,
  ShoppingBag,
  TrendingUp,
  Flame,
  Layers,
  FileText,
  Sparkles,
  PlayCircle,
  Newspaper,
} from "lucide-react";
import { HeroSpotlight } from "@/components/home/HeroSpotlight";
import { SectionHeader } from "@/components/home/SectionHeader";
import { CategoryQuickGrid } from "@/components/home/CategoryQuickGrid";
import { ProductRail } from "@/components/home/ProductRail";
import { DemandRail } from "@/components/home/DemandRail";

export default function Home() {
  const { data: posts } = useListPosts({}, { query: { queryKey: getListPostsQueryKey() } });
  const { data: stats } = useGetPlatformStats({ query: { queryKey: getGetPlatformStatsQueryKey() } });

  return (
    <div className="flex flex-col gap-6 md:gap-8 pb-10">
      {/* Hero spotlight */}
      <section className="pt-1">
        <HeroSpotlight />
      </section>

      {/* Stats strip */}
      {stats && (
        <section className="">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard Icon={ShoppingBag} color="text-primary" label="Products" value={stats.totalProducts} />
            <StatCard Icon={Store} color="text-purple-400" label="Vendors" value={stats.totalVendors} />
            <StatCard Icon={Users} color="text-blue-400" label="Users" value={stats.totalUsers} />
            <StatCard Icon={TrendingUp} color="text-green-400" label="Daily GMV" value={stats.dailyGmv} prefix="৳" />
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="">
        <SectionHeader title="Browse Categories" subtitle="Jump into a market" Icon={Layers} href="/categories" />
        <CategoryQuickGrid />
      </section>

      {/* Trending products */}
      <section className="">
        <SectionHeader title="Trending Products" subtitle="What people are buying right now" Icon={Flame} href="/marketplace?sort=trending" />
        <ProductRail sort="trending" />
      </section>

      {/* Stories + Reels teaser row */}
      <section className="">
        <SectionHeader title="Stories" subtitle="Live from your network" Icon={PlayCircle} />
        <StoryBar />
      </section>

      {/* Open demands */}
      <section className="">
        <SectionHeader title="Open Demands" subtitle="Sell what people are asking for" Icon={FileText} href="/demand" />
        <DemandRail />
      </section>

      {/* New arrivals */}
      <section className="">
        <SectionHeader title="New Arrivals" subtitle="Just listed by sellers" Icon={Sparkles} href="/marketplace?sort=newest" />
        <ProductRail sort="newest" />
      </section>

      {/* Community feed (composer + posts + side rails) */}
      <section className="">
        <SectionHeader title="Community Feed" subtitle="Posts from sellers, buyers and creators" Icon={Newspaper} />
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0 max-w-2xl w-full flex flex-col gap-5">
            <CreatePostComposer />
            <div className="flex flex-col gap-4 md:gap-5">
              {posts === undefined
                ? (Array.isArray(Array.from({ length: 3 })) ? Array.from({ length: 3 }) : []).map((_, i) => (
                    <div
                      key={i}
                      className="glass-card rounded-xl p-4 sm:p-5 flex flex-col gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full skeleton-shimmer" />
                        <div className="flex-1 flex flex-col gap-2">
                          <div className="h-3 w-1/3 rounded skeleton-shimmer" />
                          <div className="h-3 w-1/4 rounded skeleton-shimmer" />
                        </div>
                      </div>
                      <div className="aspect-video rounded-lg skeleton-shimmer" />
                    </div>
                  ))
                : (Array.isArray(posts?.slice(0, 6)) ? posts.slice(0, 6) : []).map((post) => <PostCard key={post.id} post={post} />)}
            </div>
          </div>

          <aside className="hidden lg:flex w-80 flex-col gap-6 shrink-0">
            <TrendingRail />
            <SuggestedVendors />
          </aside>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  Icon,
  color,
  label,
  value,
  prefix = "",
}: {
  Icon: React.ComponentType<{ className?: string }>;
  color: string;
  label: string;
  value: number;
  prefix?: string;
}) {
  return (
    <GlassCard className="p-4 flex items-center gap-3">
      <div className={`h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="text-lg sm:text-xl font-bold text-white truncate">
          {prefix}
          {Number(value ?? 0).toLocaleString()}
        </div>
        <div className="text-[11px] text-white/50 uppercase tracking-wider truncate">{label}</div>
      </div>
    </GlassCard>
  );
}
