import React, { useState, useRef, useEffect } from "react";
import { Link, useParams } from "wouter";
import { useGetSeller, useGetSellerProducts } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/context/WishlistContext";
import { formatBDT } from "@/lib/format";
import { toast } from "sonner";
import type { Product } from "@workspace/api-zod/src/generated/types";
import { cn } from "@/lib/utils";
import {
  MapPin, Star, Store, Mail, Phone, Calendar, BadgeCheck,
  Heart, MessageCircle, Share2, Bookmark, ShoppingCart, Zap,
  ArrowLeft, Clock, Package, TrendingUp, Users, ChevronRight,
  Globe, Instagram, Facebook, MessageSquare,
} from "lucide-react";

/* ─── Mock enrichment data (fields not yet in API) ─────────── */

const MOCK_HOURS = [
  { day: "Saturday–Wednesday", hours: "9:00 AM – 10:00 PM" },
  { day: "Thursday", hours: "9:00 AM – 8:00 PM" },
  { day: "Friday", hours: "2:00 PM – 10:00 PM" },
];

const MOCK_REVIEWS = [
  { id: "r1", name: "Nadia Rahman", avatar: "N", rating: 5, date: "3 days ago", text: "Excellent shop! Very fast delivery and packaging was perfect. Will definitely order again.", verified: true },
  { id: "r2", name: "Imran Hossain", avatar: "I", rating: 4, date: "1 week ago", text: "Good quality products. Price is a bit high but worth it for the quality.", verified: true },
  { id: "r3", name: "Sadia Akter", avatar: "S", rating: 5, date: "2 weeks ago", text: "Best seller on PaikarMart! Fast response and product exactly as described.", verified: false },
];

const TYPE_LABELS: Record<string, string> = {
  wholesaler: "Wholesale",
  retailer: "Retail Shop",
  brand_seller: "Brand Seller",
  local_shop: "Local Shop",
  dropship: "Dropship",
  service: "Service Provider",
};

const TYPE_COLORS: Record<string, string> = {
  wholesaler: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  retailer: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  brand_seller: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  local_shop: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  dropship: "bg-teal-500/20 text-teal-400 border-teal-500/30",
  service: "bg-pink-500/20 text-pink-400 border-pink-500/30",
};

const TABS = ["Posts", "Products", "About", "Reviews"] as const;
type Tab = typeof TABS[number];

/* ─── Compact product card (1:1) ──────────────────────────── */

function VendorProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { has, toggle } = useWishlist();
  const isWishlisted = has(product.id);

  const compareAt = product.price ? Math.round(product.price * 1.2) : undefined;
  const discount = compareAt && product.price && compareAt > product.price
    ? Math.round(((compareAt - product.price) / compareAt) * 100)
    : null;

  const handleCart = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    addToCart({
      productId: product.id, productName: product.name, vendorId: product.vendorId,
      vendorName: product.vendorName, price: product.price ?? 0, quantity: 1,
      image: product.images?.[0] ?? "",
    });
    toast.success("Added to cart!");
  };

  return (
    <Link href={`/products/${product.id}`}>
      <div className="glass-card rounded-xl overflow-hidden group cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl h-full flex flex-col">
        <div className="relative overflow-hidden bg-white/5" style={{ aspectRatio: "1/1" }}>
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/15">
              <Package className="h-8 w-8" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          {discount && (
            <span className="absolute top-1.5 left-1.5 text-[8px] font-bold px-1.5 py-0.5 rounded-md bg-red-500 text-white">-{discount}%</span>
          )}
          <button onClick={e => { e.preventDefault(); e.stopPropagation(); toggle({ productId: product.id, title: product.name, price: product.price, imageUrl: product.images?.[0] }); toast(isWishlisted ? "Removed" : "Saved ❤️"); }}
            className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/15 hover:scale-110 transition-all">
            <Heart className={`h-3 w-3 ${isWishlisted ? "fill-rose-400 text-rose-400" : "text-white/70"}`} />
          </button>
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
              <span className="text-[10px] font-semibold text-white/80 border border-white/20 px-2 py-0.5 rounded-full">Out of Stock</span>
            </div>
          )}
        </div>
        <div className="p-2.5 flex flex-col flex-1 gap-1">
          <h3 className="font-semibold text-[11px] text-white/90 line-clamp-2 leading-snug flex-1 group-hover:text-emerald-300 transition-colors">{product.name}</h3>
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(s => <Star key={s} className={`h-2 w-2 ${s <= Math.round(product.rating ?? 4) ? "text-yellow-400 fill-yellow-400" : "text-white/15"}`} />)}
            <span className="text-[9px] text-white/35 ml-0.5">{product.reviewCount ?? 0}</span>
          </div>
          <div className="flex items-center justify-between gap-1">
            {product.priceOnInquiry ? (
              <span className="text-[10px] font-bold text-orange-400">On Request</span>
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-xs text-emerald-400">{formatBDT(product.price)}</span>
                {compareAt && <span className="text-[9px] text-white/30 line-through">{formatBDT(compareAt)}</span>}
              </div>
            )}
            <button onClick={handleCart} disabled={!product.inStock}
              className="h-6 w-6 rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary flex items-center justify-center transition-all disabled:opacity-40 shrink-0">
              <ShoppingCart className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── Feed Post (using seller's products) ──────────────────── */

function FeedPost({ product, shopName, shopVerified, shopImg }: {
  product: Product; shopName: string; shopVerified: boolean; shopImg?: string;
}) {
  const { addToCart } = useCart();
  const { has, toggle } = useWishlist();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 200) + 20);
  const [saved, setSaved] = useState(false);
  const isWishlisted = has(product.id);
  const compareAt = product.price ? Math.round(product.price * 1.2) : undefined;
  const discount = compareAt && product.price ? Math.round(((compareAt - product.price) / compareAt) * 100) : null;

  return (
    <GlassCard className="overflow-hidden rounded-2xl">
      {/* Post header */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl overflow-hidden bg-white/8 border border-white/10 shrink-0">
          {shopImg ? <img src={shopImg} alt={shopName} className="w-full h-full object-cover" /> : <Store className="h-5 w-5 m-2.5 text-white/40" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-white truncate">{shopName}</span>
            {shopVerified && <BadgeCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-white/35">
            <MapPin className="h-2.5 w-2.5" />{product.location ?? "Bangladesh"} · Just now
          </div>
        </div>
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white bg-emerald-500/80 shrink-0">New</span>
      </div>

      {/* 1:1 image */}
      <div className="relative" style={{ aspectRatio: "1/1" }}>
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/20">
            <Package className="h-16 w-16" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        {discount && (
          <div className="absolute top-3 left-3">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-red-500 text-white">-{discount}% OFF</span>
          </div>
        )}
        <button onClick={() => { toggle({ productId: product.id, title: product.name, price: product.price, imageUrl: product.images?.[0] }); toast(isWishlisted ? "Removed" : "Saved ❤️"); }}
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20 hover:scale-110 transition-all">
          <Heart className={`h-4 w-4 ${isWishlisted ? "fill-rose-400 text-rose-400" : "text-white/80"}`} />
        </button>
        <div className="absolute bottom-3 left-3 right-4">
          <p className="text-white font-semibold text-sm line-clamp-1 drop-shadow">{product.name}</p>
        </div>
      </div>

      {/* Price + CTA */}
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-emerald-400">{formatBDT(product.price)}</span>
            {compareAt && <span className="text-xs text-white/30 line-through">{formatBDT(compareAt)}</span>}
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            {[1,2,3,4,5].map(s => <Star key={s} className={`h-2.5 w-2.5 ${s <= Math.round(product.rating ?? 4) ? "text-yellow-400 fill-yellow-400" : "text-white/15"}`} />)}
            <span className="text-[10px] text-white/35 ml-0.5">{product.reviewCount ?? 0} reviews</span>
          </div>
        </div>
        <button onClick={() => { addToCart({ productId: product.id, productName: product.name, vendorId: product.vendorId, vendorName: product.vendorName, price: product.price ?? 0, quantity: 1, image: product.images?.[0] ?? "" }); toast.success("Added to cart!"); }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 shrink-0"
          style={{ background: "linear-gradient(135deg,hsl(145 65% 32%),hsl(265 55% 44%))" }}>
          <Zap className="h-3.5 w-3.5" /> Buy Now
        </button>
      </div>

      {/* Social actions */}
      <div className="px-4 pb-4 flex items-center gap-0.5 border-t border-white/5 pt-3">
        <button onClick={() => { setLiked(l => { setLikes(c => l ? c - 1 : c + 1); return !l; }); }}
          className={cn("flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-medium transition-all", liked ? "text-rose-400 bg-rose-500/10" : "text-white/45 hover:text-white/70 hover:bg-white/5")}>
          <Heart className={`h-3.5 w-3.5 ${liked ? "fill-rose-400" : ""}`} /> {likes}
        </button>
        <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-medium text-white/45 hover:text-white/70 hover:bg-white/5 transition-all">
          <MessageCircle className="h-3.5 w-3.5" /> Comment
        </button>
        <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-medium text-white/45 hover:text-white/70 hover:bg-white/5 transition-all">
          <Share2 className="h-3.5 w-3.5" /> Share
        </button>
        <button onClick={() => setSaved(s => !s)}
          className={cn("flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-medium transition-all ml-auto", saved ? "text-emerald-400 bg-emerald-500/10" : "text-white/45 hover:text-white/70 hover:bg-white/5")}>
          <Bookmark className={`h-3.5 w-3.5 ${saved ? "fill-emerald-400" : ""}`} />
        </button>
      </div>
    </GlassCard>
  );
}

/* ─── Skeleton loader ───────────────────────────────────────── */

function StoreSkeleton() {
  return (
    <Layout>
      <div>
        <Skeleton className="h-44 sm:h-56 w-full" />
        <div className="container mx-auto px-4">
          <div className="flex items-end gap-4 -mt-10 mb-4">
            <Skeleton className="h-20 w-20 rounded-2xl shrink-0" />
            <div className="flex-1 space-y-2 pb-1">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-3.5 w-32" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass-card rounded-xl overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <div className="p-2.5 space-y-1.5">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

/* ─── Main Page ─────────────────────────────────────────────── */

export default function VendorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<Tab>("Posts");
  const [following, setFollowing] = useState(false);
  const [productFilter, setProductFilter] = useState("All");
  const tabBarRef = useRef<HTMLDivElement>(null);

  const { data: seller, isLoading: loadingSeller } = useGetSeller(id ?? "", { query: { enabled: !!id } });
  const { data: productsData, isLoading: loadingProducts } = useGetSellerProducts(id ?? "", { query: { enabled: !!id } });

  const products = (productsData as any)?.products ?? [];

  /* sticky tab bar scroll detection */
  const [tabSticky, setTabSticky] = useState(false);
  useEffect(() => {
    const el = tabBarRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setTabSticky(!e.isIntersecting), { threshold: 1, rootMargin: "-1px 0px 0px 0px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (loadingSeller) return <StoreSkeleton />;

  if (!seller) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <Store className="h-14 w-14 text-white/15 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">Vendor not found</h1>
          <p className="text-white/50 text-sm mb-6">This shop may have been removed or never existed.</p>
          <Link href="/vendors">
            <button className="px-5 py-2.5 rounded-xl bg-primary/20 border border-primary/30 text-primary text-sm font-semibold hover:bg-primary/30 transition-all">
              Browse All Vendors
            </button>
          </Link>
        </div>
      </Layout>
    );
  }

  const typeLabel = TYPE_LABELS[seller.businessType] ?? seller.businessType;
  const typeColor = TYPE_COLORS[seller.businessType] ?? "bg-white/10 text-white/60 border-white/15";
  const followers = Math.floor(Math.random() * 5000) + 200;

  /* filter products */
  const filteredProducts = products.filter((p: Product) => {
    if (productFilter === "All") return true;
    if (productFilter === "Wholesale") return (p as any).moq && (p as any).moq > 1;
    if (productFilter === "Retail") return !((p as any).moq && (p as any).moq > 1);
    if (productFilter === "On Sale") return p.price && p.price < p.price * 1.2;
    return true;
  });

  return (
    <Layout>
      <div className="pb-28 md:pb-8">
        {/* ── Back button ── */}
        <div className="px-4 pt-3 pb-0">
          <Link href="/vendors">
            <button className="inline-flex items-center gap-1.5 text-sm text-white/45 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" /> All Vendors
            </button>
          </Link>
        </div>

        {/* ── Cover Banner ── */}
        <div className="relative h-44 sm:h-56 mt-2 overflow-hidden">
          {seller.image ? (
            <img
              src={`https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?w=1200&q=80`}
              alt="cover"
              className="w-full h-full object-cover"
            />
          ) : null}
          <div
            className="absolute inset-0"
            style={{
              background: seller.image
                ? "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(5,16,12,0.7))"
                : "linear-gradient(135deg, hsl(160 35% 8%), hsl(265 30% 12%))",
            }}
          />
          {/* Subtle pattern */}
          {!seller.image && (
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: "repeating-linear-gradient(45deg,white 0,white 1px,transparent 1px,transparent 20px)" }} />
          )}
        </div>

        {/* ── Profile section ── */}
        <div className="px-4 -mt-10 relative z-10">
          <div className="flex items-end justify-between gap-3">
            {/* Shop logo */}
            <div className="h-20 w-20 rounded-2xl overflow-hidden border-4 shadow-2xl shrink-0"
              style={{ borderColor: "hsl(160 28% 5%)", background: "linear-gradient(135deg,hsl(145 65% 18%),hsl(265 55% 22%))" }}>
              {seller.image ? (
                <img src={seller.image} alt={seller.shopName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">
                  🏪
                </div>
              )}
            </div>

            {/* Follow + Message buttons */}
            <div className="flex gap-2 pb-1">
              <button
                onClick={() => { setFollowing(f => !f); toast(following ? "Unfollowed" : "Following! You'll see their updates."); }}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold border transition-all",
                  following
                    ? "bg-white/8 border-white/15 text-white/70 hover:bg-white/12"
                    : "text-white border-emerald-500/40 hover:opacity-90",
                )}
                style={!following ? { background: "linear-gradient(135deg,hsl(145 65% 32%),hsl(145 60% 40%))" } : {}}
              >
                {following ? "Following" : "+ Follow"}
              </button>
              <button className="h-8 w-8 rounded-xl border border-white/12 bg-white/6 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all">
                <MessageSquare className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Shop info */}
          <div className="mt-3 mb-4">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="text-xl font-extrabold text-white">{seller.shopName}</h1>
              <BadgeCheck className="h-5 w-5 text-emerald-400 shrink-0" />
              <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", typeColor)}>
                {typeLabel}
              </span>
            </div>

            {seller.description && (
              <p className="text-sm text-white/55 mb-2.5 line-clamp-2 leading-relaxed">{seller.description}</p>
            )}

            {/* Stats row */}
            <div className="flex items-center gap-4 flex-wrap text-xs">
              {seller.rating && (
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`h-3 w-3 ${s <= Math.round(seller.rating!) ? "text-yellow-400 fill-yellow-400" : "text-white/15"}`} />
                    ))}
                  </div>
                  <span className="text-white/70 font-semibold">{seller.rating.toFixed(1)}</span>
                </div>
              )}
              {(seller.location || seller.district) && (
                <div className="flex items-center gap-1 text-white/45">
                  <MapPin className="h-3 w-3 text-emerald-400" />
                  {seller.district ?? seller.location}
                </div>
              )}
              <div className="flex items-center gap-1 text-white/45">
                <Users className="h-3 w-3 text-purple-400" />
                <span>{followers.toLocaleString()} followers</span>
              </div>
              {seller.totalProducts && (
                <div className="flex items-center gap-1 text-white/45">
                  <Package className="h-3 w-3 text-white/30" />
                  {seller.totalProducts} products
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Tab navigation ── */}
        <div
          ref={tabBarRef}
          className="sticky top-[52px] z-30 px-4 pb-0"
          style={{
            background: tabSticky ? "rgba(5,16,12,0.95)" : "transparent",
            backdropFilter: tabSticky ? "blur(20px)" : "none",
            borderBottom: tabSticky ? "1px solid rgba(16,185,129,0.1)" : "1px solid rgba(255,255,255,0.05)",
            transition: "all 0.2s",
          }}
        >
          <div className="flex gap-0 overflow-x-auto scrollbar-hide">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 min-w-[70px] py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap",
                  activeTab === tab
                    ? "text-emerald-400 border-emerald-400"
                    : "text-white/40 border-transparent hover:text-white/70",
                )}
              >
                {tab}
                {tab === "Products" && products.length > 0 && (
                  <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded-full bg-white/8 text-white/40">{products.length}</span>
                )}
                {tab === "Reviews" && (
                  <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded-full bg-white/8 text-white/40">{MOCK_REVIEWS.length}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab content ── */}
        <div className="px-4 pt-4 max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-8 lg:items-start">

          {/* ── Desktop left sidebar ── */}
          <aside className="hidden lg:flex flex-col gap-4 sticky top-24">

            {/* Mini shop card */}
            <div className="glass-card rounded-2xl p-4 text-center">
              <div className="h-16 w-16 rounded-2xl mx-auto mb-3 overflow-hidden border-2 border-emerald-500/20 flex items-center justify-center text-3xl"
                style={{ background: "linear-gradient(135deg,hsl(145 65% 18%),hsl(265 55% 22%))" }}>
                {seller.image ? <img src={seller.image} alt={seller.shopName} className="w-full h-full object-cover" /> : "🏪"}
              </div>
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <p className="text-sm font-bold text-white">{seller.shopName}</p>
                <BadgeCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              </div>
              <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block mb-2", typeColor)}>
                {typeLabel}
              </span>
              {seller.rating && (
                <div className="flex items-center justify-center gap-1 mb-3">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`h-3 w-3 ${s <= Math.round(seller.rating!) ? "text-yellow-400 fill-yellow-400" : "text-white/15"}`} />
                  ))}
                  <span className="text-xs text-white/60 ml-1">{seller.rating.toFixed(1)}</span>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => { setFollowing(f => !f); toast(following ? "Unfollowed" : "Following!"); }}
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
                  style={!following ? { background: "linear-gradient(135deg,hsl(145 65% 32%),hsl(145 60% 40%))" } : { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  {following ? "Following" : "+ Follow"}
                </button>
                <a
                  href={seller.phone ? `tel:${seller.phone}` : seller.email ? `mailto:${seller.email}` : "#"}
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-white/70 transition-all hover:text-white glass-card flex items-center justify-center gap-1 border border-white/10"
                >
                  <MessageSquare className="h-3 w-3" /> Chat
                </a>
              </div>
            </div>

            {/* Stats */}
            <div className="glass-card rounded-2xl p-4">
              <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3">Shop Stats</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Products", value: seller.totalProducts ?? products.length, icon: Package, color: "text-emerald-400" },
                  { label: "Sales", value: seller.totalSales ? `${seller.totalSales}+` : "50+", icon: TrendingUp, color: "text-purple-400" },
                  { label: "Followers", value: followers.toLocaleString(), icon: Users, color: "text-blue-400" },
                  { label: "Rating", value: seller.rating?.toFixed(1) ?? "4.5", icon: Star, color: "text-yellow-400" },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-2.5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <s.icon className={`h-3.5 w-3.5 ${s.color} mb-1`} />
                    <p className="text-sm font-bold text-white">{s.value}</p>
                    <p className="text-[9px] text-white/35">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="glass-card rounded-2xl p-4">
              <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3">Contact</h3>
              <div className="space-y-2.5">
                {(seller.location || seller.district) && (
                  <div className="flex items-center gap-2.5 text-xs text-white/55">
                    <div className="h-7 w-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                      <MapPin className="h-3 w-3 text-blue-400" />
                    </div>
                    {seller.district ?? seller.location}
                  </div>
                )}
                {seller.phone && (
                  <a href={`tel:${seller.phone}`} className="flex items-center gap-2.5 text-xs text-white/55 hover:text-emerald-400 transition-colors">
                    <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <Phone className="h-3 w-3 text-emerald-400" />
                    </div>
                    {seller.phone}
                  </a>
                )}
                {seller.email && (
                  <a href={`mailto:${seller.email}`} className="flex items-center gap-2.5 text-xs text-white/55 hover:text-purple-400 transition-colors">
                    <div className="h-7 w-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                      <Mail className="h-3 w-3 text-purple-400" />
                    </div>
                    <span className="truncate">{seller.email}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Business hours */}
            <div className="glass-card rounded-2xl p-4">
              <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-orange-400" /> Hours
              </h3>
              <div className="space-y-2">
                {MOCK_HOURS.map(h => (
                  <div key={h.day} className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-white/40">{h.day}</span>
                    <span className="text-[11px] text-white/70 font-medium">{h.hours}</span>
                  </div>
                ))}
                <div className="flex items-center gap-1.5 pt-1 mt-1 border-t border-white/5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-emerald-400 font-medium">Open Now</span>
                </div>
              </div>
            </div>
          </aside>

          {/* ── Main content ── */}
          <div>

          {/* POSTS TAB */}
          {activeTab === "Posts" && (
            <div className="flex flex-col gap-4">
              {loadingProducts ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <GlassCard key={i} className="overflow-hidden rounded-2xl">
                    <div className="px-4 pt-4 pb-3 flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                      <div className="flex-1 space-y-1.5"><Skeleton className="h-3 w-32" /><Skeleton className="h-2.5 w-24" /></div>
                    </div>
                    <Skeleton className="aspect-square w-full" />
                    <div className="p-4 space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-3 w-40" /></div>
                  </GlassCard>
                ))
              ) : products.length === 0 ? (
                <div className="py-16 text-center">
                  <Store className="h-12 w-12 text-white/15 mx-auto mb-3" />
                  <p className="text-white/40 text-sm">No posts yet from this seller.</p>
                </div>
              ) : (
                products.map((p: Product) => (
                  <FeedPost key={p.id} product={p} shopName={seller.shopName} shopVerified={true} shopImg={seller.image} />
                ))
              )}
            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === "Products" && (
            <div>
              {/* Filter chips */}
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3">
                {["All", "Wholesale", "Retail", "On Sale"].map(f => (
                  <button key={f} onClick={() => setProductFilter(f)}
                    className={cn(
                      "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all",
                      productFilter === f
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                        : "bg-white/5 text-white/55 border-white/10 hover:border-white/20",
                    )}>
                    {f}
                  </button>
                ))}
              </div>

              {loadingProducts ? (
                <div className="grid grid-cols-2 gap-2.5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="glass-card rounded-xl overflow-hidden">
                      <Skeleton className="aspect-square w-full" />
                      <div className="p-2.5 space-y-1.5"><Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-1/2" /></div>
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="py-16 text-center">
                  <Package className="h-12 w-12 text-white/15 mx-auto mb-3" />
                  <p className="text-white/40 text-sm mb-2">No products in this category.</p>
                  <button onClick={() => setProductFilter("All")} className="text-xs text-primary hover:underline">Show all</button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5">
                  {filteredProducts.map((p: Product) => <VendorProductCard key={p.id} product={p} />)}
                </div>
              )}
            </div>
          )}

          {/* ABOUT TAB */}
          {activeTab === "About" && (
            <div className="flex flex-col gap-4">
              {/* Shop description */}
              <GlassCard className="p-5">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Store className="h-4 w-4 text-emerald-400" /> About the Shop
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  {seller.description || `Welcome to ${seller.shopName}! We are a trusted ${typeLabel.toLowerCase()} offering quality products across Bangladesh. Our goal is to provide the best products at competitive prices with reliable delivery.`}
                </p>
              </GlassCard>

              {/* Contact info */}
              <GlassCard className="p-5">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-emerald-400" /> Contact Information
                </h3>
                <div className="space-y-3">
                  {seller.phone && (
                    <a href={`tel:${seller.phone}`} className="flex items-center gap-3 text-sm text-white/60 hover:text-white transition-colors group">
                      <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                        <Phone className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                      <span>{seller.phone}</span>
                      <ChevronRight className="h-3.5 w-3.5 ml-auto text-white/20 group-hover:text-white/50" />
                    </a>
                  )}
                  {seller.email && (
                    <a href={`mailto:${seller.email}`} className="flex items-center gap-3 text-sm text-white/60 hover:text-white transition-colors group">
                      <div className="h-8 w-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                        <Mail className="h-3.5 w-3.5 text-purple-400" />
                      </div>
                      <span>{seller.email}</span>
                      <ChevronRight className="h-3.5 w-3.5 ml-auto text-white/20 group-hover:text-white/50" />
                    </a>
                  )}
                  {(seller.address || seller.location) && (
                    <div className="flex items-center gap-3 text-sm text-white/60">
                      <div className="h-8 w-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                        <MapPin className="h-3.5 w-3.5 text-blue-400" />
                      </div>
                      <span>{seller.address ?? seller.location}</span>
                    </div>
                  )}
                </div>
              </GlassCard>

              {/* Business hours */}
              <GlassCard className="p-5">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-400" /> Business Hours
                </h3>
                <div className="space-y-2.5">
                  {MOCK_HOURS.map(h => (
                    <div key={h.day} className="flex items-center justify-between text-sm">
                      <span className="text-white/50">{h.day}</span>
                      <span className="text-white/80 font-medium text-xs">{h.hours}</span>
                    </div>
                  ))}
                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-emerald-400 font-medium">Currently Open</span>
                  </div>
                </div>
              </GlassCard>

              {/* Stats */}
              <GlassCard className="p-5">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-400" /> Shop Stats
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Total Products", value: seller.totalProducts ?? products.length, icon: Package, color: "text-emerald-400" },
                    { label: "Total Sales", value: seller.totalSales ? `${seller.totalSales}+` : "50+", icon: TrendingUp, color: "text-purple-400" },
                    { label: "Followers", value: followers.toLocaleString(), icon: Users, color: "text-blue-400" },
                    { label: "Rating", value: seller.rating?.toFixed(1) ?? "4.5", icon: Star, color: "text-yellow-400" },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <s.icon className={`h-4 w-4 ${s.color} mb-1.5`} />
                      <p className="text-base font-bold text-white">{s.value}</p>
                      <p className="text-[10px] text-white/35 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Delivery & coverage */}
              {seller.deliveryTypes && seller.deliveryTypes.length > 0 && (
                <GlassCard className="p-5">
                  <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-teal-400" /> Delivery Options
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {seller.deliveryTypes.map((d: string) => (
                      <span key={d} className="text-xs px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 font-medium">
                        {d}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* Member since */}
              {seller.createdAt && (
                <div className="flex items-center gap-2 text-xs text-white/30 py-2">
                  <Calendar className="h-3.5 w-3.5" />
                  Member since {new Date(seller.createdAt).toLocaleDateString("en-BD", { year: "numeric", month: "long" })}
                </div>
              )}
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === "Reviews" && (
            <div className="flex flex-col gap-4">
              {/* Rating summary */}
              <GlassCard className="p-5">
                <div className="flex items-center gap-5">
                  <div className="text-center shrink-0">
                    <p className="text-4xl font-extrabold text-white">{seller.rating?.toFixed(1) ?? "4.8"}</p>
                    <div className="flex justify-center gap-0.5 my-1">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`h-3.5 w-3.5 ${s <= Math.round(seller.rating ?? 5) ? "text-yellow-400 fill-yellow-400" : "text-white/15"}`} />
                      ))}
                    </div>
                    <p className="text-[10px] text-white/35">{MOCK_REVIEWS.length} reviews</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5, 4, 3, 2, 1].map(star => {
                      const count = MOCK_REVIEWS.filter(r => r.rating === star).length;
                      const pct = (count / MOCK_REVIEWS.length) * 100;
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-[10px] text-white/35 w-3 text-right">{star}</span>
                          <Star className="h-2.5 w-2.5 text-yellow-400 fill-yellow-400 shrink-0" />
                          <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
                            <div className="h-full rounded-full bg-yellow-400 transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[10px] text-white/30 w-4">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </GlassCard>

              {/* Review cards */}
              {MOCK_REVIEWS.map(review => (
                <GlassCard key={review.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500/30 to-purple-500/20 border border-white/10 flex items-center justify-center text-sm font-bold text-white shrink-0">
                      {review.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="text-sm font-semibold text-white">{review.name}</span>
                        {review.verified && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">Verified</span>
                        )}
                        <span className="text-[10px] text-white/30 ml-auto">{review.date}</span>
                      </div>
                      <div className="flex gap-0.5 mb-2">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={`h-3 w-3 ${s <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-white/15"}`} />
                        ))}
                      </div>
                      <p className="text-sm text-white/60 leading-relaxed">{review.text}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}

              <div className="text-center py-3">
                <span className="text-[11px] text-white/25">All reviews verified by PaikarMart</span>
              </div>
            </div>
          )}

          </div>{/* end main content col */}
          </div>{/* end lg:grid */}
        </div>{/* end tab content wrapper */}
      </div>

      {/* ── Floating Contact Button (mobile) ── */}
      <div className="fixed bottom-20 left-0 right-0 z-40 flex justify-center pointer-events-none md:hidden">
        <a
          href={seller.phone ? `tel:${seller.phone}` : seller.email ? `mailto:${seller.email}` : "#"}
          className="pointer-events-auto flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm text-white shadow-2xl transition-all active:scale-95"
          style={{
            background: "linear-gradient(135deg,hsl(145 65% 30%),hsl(265 55% 40%))",
            boxShadow: "0 8px 32px rgba(16,185,129,0.4)",
          }}
        >
          <MessageSquare className="h-4 w-4" />
          Contact Seller
        </a>
      </div>
    </Layout>
  );
}
