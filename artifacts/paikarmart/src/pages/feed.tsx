import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Layout } from "@/components/layout/Layout";
import {
  Heart, MessageCircle, ShoppingCart, Share2, Bookmark,
  MapPin, Store, Zap, Package, MoreHorizontal, BadgeCheck,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";
import { useListProducts } from "@workspace/api-client-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatBDT } from "@/lib/format";

/* ─── Constants ─────────────────────────────────────────────── */

const FEED_CATEGORIES = [
  { id: "all", label: "সব", emoji: "🏠" },
  { id: "electronics", label: "Electronics", emoji: "📱" },
  { id: "fashion", label: "Fashion", emoji: "👗" },
  { id: "food", label: "Food", emoji: "🍔" },
  { id: "home", label: "Home & Living", emoji: "🏡" },
  { id: "wholesale", label: "Wholesale", emoji: "📦" },
  { id: "services", label: "Services", emoji: "🔧" },
  { id: "beauty", label: "Beauty", emoji: "💄" },
];

function timeAgo(i: number) {
  const times = ["২ মিনিট আগে", "১৫ মিনিট আগে", "৩০ মিনিট আগে", "১ ঘণ্টা আগে", "২ ঘণ্টা আগে", "৫ ঘণ্টা আগে"];
  return times[i % times.length];
}

/* ─── PostCard ───────────────────────────────────────────────── */

function PostCard({ product, index }: { product: any; index: number }) {
  const { addToCart } = useCart();
  const [, navigate] = useLocation();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saves, setSaves] = useState(Math.floor(Math.random() * 200) + 10);

  const compareAt = product.price ? Math.round(product.price * 1.18) : 0;
  const discount = product.price && compareAt > product.price
    ? Math.round(((compareAt - product.price) / compareAt) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      productName: product.name,
      vendorId: product.vendorId,
      vendorName: product.vendorName,
      quantity: 1,
      price: product.price || 0,
      image: product.images?.[0] || "",
    });
    toast.success("Cart-এ যোগ হয়েছে!", { duration: 2000 });
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: product.name, url: `${window.location.origin}/products/${product.id}` });
    } else {
      await navigator.clipboard.writeText(`${window.location.origin}/products/${product.id}`);
      toast("Link copied!", { duration: 1500 });
    }
  };

  return (
    <article className="glass-card rounded-2xl overflow-hidden">
      {/* Post header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <Link href={`/vendors/${product.vendorId}`} className="flex items-center gap-3 group">
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-md shrink-0 border border-white/10"
            style={{ background: "linear-gradient(135deg,hsl(145 65% 22%),hsl(265 55% 28%))" }}
          >
            {(product.vendorName || "V").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-white group-hover:text-emerald-300 transition-colors">
                {product.vendorName || "Seller"}
              </span>
              <BadgeCheck className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-white/40">
              <MapPin className="h-2.5 w-2.5 text-emerald-400" />
              {product.location || "Bangladesh"}
              <span>·</span>
              <span>{timeAgo(index)}</span>
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <button className="text-xs px-3 py-1 rounded-full border border-white/10 text-white/50 hover:border-emerald-500/40 hover:text-emerald-400 transition-all">
            Follow
          </button>
          <button className="text-white/30 hover:text-white/60 transition-colors">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 1:1 image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "1/1" }}>
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/5">
            <Package className="h-16 w-16 text-white/15" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {discount > 0 && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white bg-red-500 shadow">
            -{discount}% OFF
          </div>
        )}
        {product.stock != null && product.stock <= 10 && product.stock > 0 && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-white bg-orange-500/90 shadow">
            মাত্র {product.stock}টি বাকি
          </div>
        )}

        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-semibold text-white text-sm line-clamp-1 drop-shadow">{product.name}</h3>
        </div>
      </div>

      {/* Price + description */}
      <div className="px-4 pt-3 pb-2">
        <p className="text-xs text-white/50 line-clamp-2 mb-2 leading-relaxed">{product.description}</p>
        <div className="flex items-center gap-2">
          {product.priceOnInquiry ? (
            <span className="text-sm font-semibold text-orange-400">Price on Inquiry</span>
          ) : (
            <>
              <span className="text-lg font-bold text-emerald-400">{formatBDT(product.price)}</span>
              {compareAt > (product.price || 0) && (
                <span className="text-xs text-white/30 line-through">{formatBDT(compareAt)}</span>
              )}
            </>
          )}
          <span className="text-[10px] text-white/30 ml-auto border border-white/10 px-2 py-0.5 rounded-full">
            {product.category}
          </span>
        </div>
      </div>

      {/* Engagement stats */}
      <div className="px-4 py-1.5 flex items-center gap-3 text-[11px] text-white/35 border-b border-white/5">
        <span>❤️ {saves} saves</span>
        <span>⭐ {product.rating?.toFixed(1) || "4.5"}</span>
        <span>📦 {product.reviewCount || 0} reviews</span>
      </div>

      {/* Action buttons */}
      <div className="px-2 py-1 grid grid-cols-5 gap-0.5">
        {[
          {
            icon: Heart,
            label: "Save",
            active: liked,
            activeColor: "text-rose-400",
            activeBg: "bg-rose-500/10",
            onClick: () => { setLiked(l => { setSaves(s => l ? s - 1 : s + 1); return !l; }); },
            fill: liked ? "currentColor" : "none",
          },
          {
            icon: MessageCircle,
            label: "Q&A",
            active: false,
            activeColor: "",
            activeBg: "",
            onClick: () => {},
            fill: "none",
          },
          {
            icon: ShoppingCart,
            label: "Cart",
            active: false,
            activeColor: "text-emerald-400",
            activeBg: "bg-emerald-500/10",
            onClick: handleAddToCart,
            fill: "none",
            alwaysActive: true,
          },
          {
            icon: Share2,
            label: "Share",
            active: false,
            activeColor: "",
            activeBg: "",
            onClick: handleShare,
            fill: "none",
          },
          {
            icon: Bookmark,
            label: "Wishlist",
            active: saved,
            activeColor: "text-purple-400",
            activeBg: "bg-purple-500/10",
            onClick: () => setSaved(s => !s),
            fill: saved ? "currentColor" : "none",
          },
        ].map(btn => (
          <button
            key={btn.label}
            onClick={btn.onClick}
            className={cn(
              "flex flex-col items-center gap-1 py-2 rounded-xl text-[10px] transition-all",
              (btn.active || btn.alwaysActive) ? `${btn.activeColor} ${btn.activeBg}` : "text-white/35 hover:text-white/60 hover:bg-white/5",
            )}
          >
            <btn.icon className="h-4 w-4" fill={btn.fill} />
            <span>{btn.label}</span>
          </button>
        ))}
      </div>

      {/* Buy Now CTA */}
      <div className="px-3 pb-3">
        <button
          onClick={() => navigate(`/products/${product.id}`)}
          className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg,hsl(145 65% 30%),hsl(265 55% 38%))", boxShadow: "0 4px 16px rgba(16,185,129,0.2)" }}
        >
          <Zap className="h-4 w-4" /> এখনই কিনুন
        </button>
      </div>
    </article>
  );
}

/* ─── Skeleton loader ───────────────────────────────────────── */

function PostSkeleton() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 p-4">
        <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-2.5 w-24" />
        </div>
      </div>
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-5 w-28" />
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────── */

export default function FeedPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [, navigate] = useLocation();

  const categoryParam = activeCategory === "all" ? undefined : activeCategory;
  const { data, isLoading } = useListProducts({ category: categoryParam, limit: 20 });
  const products: any[] = data?.products || [];

  return (
    <Layout>
      {/* ── Mode Toggle ── */}
      <div
        className="sticky z-30 border-b"
        style={{
          top: "52px",
          background: "rgba(5,16,12,0.92)",
          backdropFilter: "blur(16px)",
          borderColor: "rgba(16,185,129,0.12)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center h-11 gap-2">
            <div className="flex items-center p-1 rounded-full gap-0.5" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <button
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-white transition-all"
                style={{ background: "linear-gradient(135deg,hsl(145 65% 28%),hsl(145 60% 38%))" }}
              >
                📰 Feed
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium text-white/50 hover:text-white transition-all"
              >
                🛍️ Marketplace
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Category Filter ── */}
      <div
        className="sticky z-20 border-b"
        style={{
          top: "95px",
          background: "rgba(5,16,12,0.88)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(255,255,255,0.05)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 py-2 overflow-x-auto scrollbar-hide">
            {FEED_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 border",
                  activeCategory === cat.id
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                    : "bg-white/5 text-white/50 border-white/10 hover:border-white/20 hover:text-white/80",
                )}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Feed ── */}
      <div className="min-h-screen py-4">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-[1fr_300px] lg:gap-8 lg:items-start">

            {/* ── Posts column ── */}
            <div className="max-w-lg mx-auto lg:max-w-none space-y-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)
              ) : products.length === 0 ? (
                <div className="text-center py-20">
                  <Package className="h-12 w-12 text-white/15 mx-auto mb-3" />
                  <p className="text-sm text-white/35">এই category-তে এখন কোনো পোস্ট নেই</p>
                </div>
              ) : (
                products.map((product: any, i: number) => (
                  <PostCard key={product.id} product={product} index={i} />
                ))
              )}

              {products.length > 0 && (
                <button className="w-full py-3 rounded-xl text-sm font-medium text-white/50 border border-white/10 hover:border-white/20 hover:text-white/70 transition-all glass-card">
                  আরো পোস্ট দেখুন ↓
                </button>
              )}
            </div>

            {/* ── Desktop right sidebar ── */}
            <aside className="hidden lg:flex flex-col gap-4 sticky top-36">

              {/* Browse Categories */}
              <div className="glass-card rounded-2xl p-4">
                <h3 className="text-sm font-bold text-white mb-3">📂 Browse Categories</h3>
                <div className="flex flex-col gap-0.5">
                  {FEED_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left w-full",
                        activeCategory === cat.id
                          ? "bg-primary/20 text-emerald-400 border border-primary/30"
                          : "text-white/50 hover:bg-white/5 hover:text-white/80",
                      )}
                    >
                      <span className="text-base leading-none">{cat.emoji}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending shops */}
              <div className="glass-card rounded-2xl p-4">
                <h3 className="text-sm font-bold text-white mb-3">🔥 Trending Shops</h3>
                <div className="flex flex-col gap-3">
                  {[
                    { name: "TechZone BD", type: "Electronics", emoji: "📱", rating: 4.9 },
                    { name: "Fashion Hub", type: "Fashion", emoji: "👗", rating: 4.7 },
                    { name: "Grocery King", type: "Grocery", emoji: "🛒", rating: 4.8 },
                  ].map(shop => (
                    <Link href="/vendors" key={shop.name}>
                      <div className="flex items-center gap-3 cursor-pointer group">
                        <div className="h-9 w-9 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-lg shrink-0 group-hover:border-emerald-500/30 transition-all">
                          {shop.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white/80 group-hover:text-white truncate">{shop.name}</p>
                          <p className="text-[10px] text-white/35">{shop.type} · ⭐ {shop.rating}</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-white/40 hover:border-emerald-500/30 hover:text-emerald-400 transition-all shrink-0 cursor-pointer">
                          Follow
                        </span>
                      </div>
                    </Link>
                  ))}
                  <Link href="/vendors">
                    <span className="text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer mt-1 inline-block">
                      See all vendors →
                    </span>
                  </Link>
                </div>
              </div>

              {/* Download app promo */}
              <div
                className="rounded-2xl p-5 text-center"
                style={{
                  background: "linear-gradient(135deg,hsl(145 65% 10%),hsl(265 55% 14%))",
                  border: "1px solid rgba(16,185,129,0.18)",
                }}
              >
                <p className="text-3xl mb-2">📱</p>
                <p className="text-sm font-bold text-white mb-1">PaikarMart App</p>
                <p className="text-[11px] text-white/45 mb-3 leading-relaxed">Exclusive deals, instant notifications, faster checkout</p>
                <button
                  className="w-full py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg,hsl(145 65% 30%),hsl(265 55% 38%))" }}
                >
                  Download Free
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
}
