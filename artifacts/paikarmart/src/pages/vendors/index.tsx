import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useListSellers } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Store, Package, ShieldCheck, TrendingUp, Search } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

const FILTERS = ["All", "Wholesale", "Retail", "Brand", "Local", "Service"];
const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "rating", label: "Top Rated" },
  { value: "name", label: "A – Z" },
];

const TYPE_COLOR: Record<string, string> = {
  wholesale: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  retail: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  brand: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  local: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  service: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
};

function VendorCard({ seller }: { seller: any }) {
  const typeColor = TYPE_COLOR[seller.businessType?.toLowerCase()] || "bg-white/10 text-white/60 border-white/15";
  const rating = seller.rating?.toFixed(1) || null;

  return (
    <Link href={`/vendors/${seller.id}`}>
      <div className="group cursor-pointer glass-card rounded-2xl overflow-hidden hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 hover:shadow-xl h-full flex flex-col">
        {/* Cover */}
        <div className="h-24 bg-gradient-to-br from-primary/20 via-purple-500/10 to-transparent relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-end px-4 opacity-10">
            <Store className="h-20 w-20 text-white" />
          </div>
          {seller.coverImage && (
            <img src={seller.coverImage} alt="" className="w-full h-full object-cover" />
          )}
          {/* Verified badge */}
          {seller.isVerified && (
            <div className="absolute top-2 right-2">
              <div className="flex items-center gap-1 bg-primary/20 border border-primary/30 rounded-full px-2 py-0.5">
                <ShieldCheck className="h-3 w-3 text-primary" />
                <span className="text-[10px] text-primary font-medium">Verified</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1">
          <div className="flex gap-3 items-start mb-3">
            {/* Avatar */}
            <div className="h-14 w-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 -mt-8 ring-2 ring-background overflow-hidden">
              {seller.image ? (
                <img src={seller.image} alt={seller.shopName} className="h-full w-full object-cover" />
              ) : (
                <Store className="h-7 w-7 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <h3 className="font-bold text-white group-hover:text-primary transition-colors truncate">{seller.shopName}</h3>
              <Badge className={`text-[10px] border capitalize mt-0.5 ${typeColor}`}>
                {seller.businessType?.replace(/_/g, ' ') || 'Vendor'}
              </Badge>
            </div>
          </div>

          <p className="text-sm text-white/40 line-clamp-2 mb-4 flex-1">
            {seller.description || "Trusted seller on PaikarMart."}
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 mb-3 text-center">
            <div className="bg-white/3 rounded-lg p-2">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-bold text-white">{rating || "New"}</span>
              </div>
              <span className="text-[10px] text-white/30">Rating</span>
            </div>
            <div className="bg-white/3 rounded-lg p-2">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <Package className="h-3 w-3 text-primary" />
                <span className="text-sm font-bold text-white">{seller.productCount || "—"}</span>
              </div>
              <span className="text-[10px] text-white/30">Products</span>
            </div>
            <div className="bg-white/3 rounded-lg p-2">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <TrendingUp className="h-3 w-3 text-purple-400" />
                <span className="text-sm font-bold text-white">{seller.totalSales || "—"}</span>
              </div>
              <span className="text-[10px] text-white/30">Sales</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-white/40">
            <MapPin className="h-3.5 w-3.5 text-primary/60 shrink-0" />
            <span className="truncate">{seller.location || seller.district || "Bangladesh"}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function VendorsPage() {
  const { data: sellersData, isLoading } = useListSellers();
  const sellers = sellersData?.sellers || [];
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState("");
  const [search, setSearch] = useState("");

  let filtered = sellers.filter((s: any) => {
    if (activeFilter !== "All") {
      const type = (s.businessType || "").toLowerCase();
      if (!type.includes(activeFilter.toLowerCase())) return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        (s.shopName || "").toLowerCase().includes(q) ||
        (s.description || "").toLowerCase().includes(q) ||
        (s.location || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  if (sortBy === "rating") filtered = [...filtered].sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
  if (sortBy === "name") filtered = [...filtered].sort((a: any, b: any) => (a.shopName || "").localeCompare(b.shopName || ""));

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Vendor Directory</h1>
            <p className="text-white/40 mt-1">
              {isLoading ? "Loading vendors..." : `${filtered.length} vendors found`}
            </p>
          </div>

          {/* Search + Sort */}
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search vendors…"
                className="pl-9 pr-4 py-2 bg-white/5 border border-white/15 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary w-48"
              />
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value} className="bg-gray-900">{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                activeFilter === f
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Vendors", value: sellers.length || "–", icon: Store, color: "text-primary" },
            { label: "Verified Shops", value: sellers.filter((s: any) => s.isVerified).length || "–", icon: ShieldCheck, color: "text-emerald-400" },
            { label: "Product Listings", value: "5,000+", icon: Package, color: "text-purple-400" },
            { label: "Cities Covered", value: "64", icon: MapPin, color: "text-blue-400" },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="glass-card rounded-xl p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-white/40">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Vendor Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden">
                <Skeleton className="h-24 w-full bg-white/5" />
                <div className="p-4 space-y-3">
                  <div className="flex gap-3 items-start -mt-8">
                    <Skeleton className="h-14 w-14 rounded-xl bg-white/5 shrink-0" />
                    <div className="flex-1 pt-1 space-y-2">
                      <Skeleton className="h-5 w-3/4 bg-white/5" />
                      <Skeleton className="h-4 w-1/3 bg-white/5" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-full bg-white/5" />
                  <Skeleton className="h-14 w-full bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Store className="h-10 w-10 text-white/20" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No vendors found</h3>
            <p className="text-white/40 mb-4">Try a different filter or search</p>
            <button onClick={() => { setActiveFilter("All"); setSearch(""); }}
              className="px-4 py-2 rounded-lg border border-white/15 text-sm text-white/60 hover:bg-white/5">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((seller: any) => <VendorCard key={seller.id} seller={seller} />)}
          </div>
        )}
      </div>
    </Layout>
  );
}
