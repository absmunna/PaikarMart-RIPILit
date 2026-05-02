import React, { useState } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import {
  Heart, MessageCircle, ShoppingCart, MoreHorizontal,
  Star, Eye, Plus, Globe, BadgeCheck, TrendingUp, Flame
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useListProducts } from "@workspace/api-client-react";
import type { Product } from "@workspace/api-client-react";
import { toast } from "sonner";

/* ─── Theme ─── */
const GLOW  = "#00FF9C";
const RED   = "#FF3B3B";
const TEXT  = "#E8F5EE";
const MUTED = "#A3C9B8";

/* ─── Stories ─── */
const STORIES = [
  { id: "your",  label: "Add Story",    bg: "rgba(255,255,255,0.07)", border: "rgba(255,255,255,0.18)", isYour: true },
  { id: "new",   label: "New Arrivals", bg: "#1a2e20",                border: RED,                     emoji: "🔥"  },
  { id: "hot",   label: "Hot Deals",    bg: "#2b1a10",                border: "#f59e0b",               emoji: "⚡"  },
  { id: "top",   label: "Top Sellers",  bg: "#1a1a2e",                border: "#8b5cf6",               emoji: "⭐"  },
  { id: "ws",    label: "Wholesale",    bg: "#0a1e2e",                border: "#0ea5e9",               emoji: "📦"  },
  { id: "fresh", label: "Fresh Stock",  bg: "#0e2a1a",                border: GLOW,                    emoji: "🌿"  },
];

/* ─── Sellers ─── */
const SELLERS = [
  { initials: "GH", name: "Green Harvest Traders", color: "#1a6b38", verified: true,  cat: "Agriculture",    desc: "সেরা মানের মিনিকেট চাল – পাইকারী দামে পাওয়া যাচ্ছে!\nআপনার ব্যবসার জন্য সেরা পছন্দ। আজই অর্ডার করুন। 🌾" },
  { initials: "AA", name: "Apon Agro Supply",       color: "#15803d", verified: false, cat: "Food & Grocery", desc: "খাঁটি সরিষার তেল ৫ লিটার – স্বাস্থ্যকর ও বিশুদ্ধ। সরাসরি মিলের দামে। 🛢️" },
  { initials: "BF", name: "BD Fresh Market",        color: "#065f46", verified: true,  cat: "Agriculture",    desc: "তাজা মসুর ডাল ১ কেজি – সরাসরি কৃষকের কাছ থেকে। হোলসেলে বিশাল ছাড়! 🌱" },
  { initials: "MS", name: "Metro Spice House",      color: "#1e3a5f", verified: true,  cat: "Spices",         desc: "সেরা মানের চক্কি আটা ৫ কেজি – রুটি ও পরোটার জন্য পারফেক্ট। 🌾" },
  { initials: "RC", name: "Royal Cotton Mills",     color: "#3b1f6b", verified: false, cat: "Textiles",       desc: "উচ্চমানের সুতা ও কাপড় – পাইকারি মূল্যে সরাসরি মিল থেকে। 🧵" },
  { initials: "DF", name: "Delta Foods Ltd.",       color: "#7f1d1d", verified: true,  cat: "Food",           desc: "মানসম্মত প্রক্রিয়াজাত খাদ্যপণ্য – রেস্টুরেন্ট ও হোটেলের জন্য আদর্শ। 🍽️" },
];

const TIMES   = ["just now","2 min ago","15 min ago","1 hour ago","3 hours ago","Yesterday"];
const FALLBACKS = [
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80",
  "https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=600&q=80",
  "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&q=80",
  "https://images.unsplash.com/photo-1559181567-c3190bce8d0a?w=600&q=80",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80",
];

function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.025) 100%)",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 20,
        boxShadow: "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  const { addToCart }             = useCart();
  const { data, isLoading }       = useListProducts({ limit: 12 });
  const products                  = data?.products ?? [];
  const [liked, setLiked]         = useState<Record<string, boolean>>({});
  const [wishlist, setWishlist]   = useState<Record<string, boolean>>({});
  const [cartAdded, setCartAdded] = useState<Record<string, boolean>>({});

  const handleCart = (product: Product) => {
    addToCart({
      productId: product.id,
      productName: product.name,
      vendorId: product.vendorId,
      vendorName: product.vendorName,
      quantity: 1,
      price: product.price ?? 0,
      image: product.images?.[0] ?? "",
    });
    setCartAdded(p => ({ ...p, [product.id]: true }));
    toast.success("Added to cart!", {
      style: { background: "#0B2B1F", border: "1px solid rgba(0,255,156,0.3)", color: TEXT },
    });
    setTimeout(() => setCartAdded(p => ({ ...p, [product.id]: false })), 1500);
  };

  return (
    <Layout>
      <div className="max-w-[480px] mx-auto w-full">

        {/* ══════════════════ STORIES ══════════════════ */}
        <div className="px-3 pt-3 pb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-start gap-3 overflow-x-auto scrollbar-hide pb-1">
            {STORIES.map(s => (
              <button key={s.id} className="flex flex-col items-center gap-1.5 shrink-0 group">
                <div
                  className="h-[58px] w-[58px] rounded-full flex items-center justify-center text-xl transition-transform duration-200 group-hover:scale-105"
                  style={{
                    background: s.bg,
                    border: `2.5px solid ${s.border}`,
                    boxShadow: `0 0 10px ${s.border}40`,
                  }}
                >
                  {s.isYour
                    ? <Plus className="h-5 w-5" style={{ color: MUTED }} />
                    : <span>{s.emoji}</span>
                  }
                </div>
                <span className="text-[10px] font-medium leading-none max-w-[60px] truncate text-center" style={{ color: MUTED }}>
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ══════════════════ FEED ══════════════════ */}
        <div className="px-3 py-3 space-y-4">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <GlassCard key={i}>
                  <div className="p-4 flex items-center gap-3 animate-pulse">
                    <div className="h-10 w-10 rounded-full shrink-0" style={{ background: "rgba(255,255,255,0.07)" }} />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 rounded-full w-36" style={{ background: "rgba(255,255,255,0.07)" }} />
                      <div className="h-2.5 rounded-full w-24" style={{ background: "rgba(255,255,255,0.05)" }} />
                    </div>
                  </div>
                  <div className="aspect-square" style={{ background: "rgba(255,255,255,0.04)" }} />
                  <div className="p-4 space-y-2 animate-pulse">
                    <div className="h-3 rounded-full w-full" style={{ background: "rgba(255,255,255,0.06)" }} />
                    <div className="h-2.5 rounded-full w-2/3" style={{ background: "rgba(255,255,255,0.04)" }} />
                  </div>
                </GlassCard>
              ))
            : products.map((product, i) => {
                const seller     = SELLERS[i % SELLERS.length];
                const timeStr    = TIMES[i % TIMES.length];
                const fallback   = FALLBACKS[i % FALLBACKS.length];
                const discPct    = 10 + (i * 7) % 20;
                const oldPrice   = Math.round((product.price ?? 0) * (1 + discPct / 100));
                const rating     = (4.2 + (i * 0.13) % 0.7).toFixed(1);
                const reviews    = 24 + (i * 37) % 180;
                const views      = 350 + (i * 213) % 2200;
                const isLiked    = liked[product.id];
                const inWishlist = wishlist[product.id];
                const inCart     = cartAdded[product.id];

                return (
                  <GlassCard key={product.id}>

                    {/* ─ Seller header ─ */}
                    <div className="flex items-center gap-2.5 px-4 pt-4 pb-2">
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                        style={{ background: seller.color, boxShadow: `0 0 14px ${seller.color}60` }}
                      >
                        {seller.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="font-semibold text-sm truncate" style={{ color: TEXT }}>{seller.name}</p>
                          {seller.verified && <BadgeCheck className="h-3.5 w-3.5 shrink-0" style={{ color: GLOW }} />}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs" style={{ color: MUTED }}>{timeStr}</span>
                          <span style={{ color: MUTED, fontSize: 10 }}>·</span>
                          <Globe className="h-3 w-3" style={{ color: MUTED }} />
                          <span
                            className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold"
                            style={{ background: "rgba(0,255,156,0.08)", color: GLOW, border: "1px solid rgba(0,255,156,0.18)" }}
                          >
                            {seller.cat}
                          </span>
                        </div>
                      </div>
                      <button
                        className="shrink-0 h-7 px-3 rounded-lg text-[11px] font-bold border transition-all hover:scale-105"
                        style={{ borderColor: `${RED}60`, color: RED, background: "rgba(255,59,59,0.07)" }}
                      >
                        + Follow
                      </button>
                      <button
                        className="shrink-0 h-7 w-7 flex items-center justify-center rounded-lg transition-all hover:bg-white/6"
                        style={{ color: MUTED }}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>

                    {/* ─ Description ─ */}
                    <div className="px-4 pb-2">
                      <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: `${TEXT}bb` }}>
                        {seller.desc}
                      </p>
                    </div>

                    {/* ─ Product image — white bg, object-contain ─ */}
                    <Link href={`/products/${product.id}`}>
                      <div className="relative aspect-square w-full overflow-hidden" style={{ background: "#f4f6f4" }}>
                        <img
                          src={product.images?.[0] ?? fallback}
                          alt={product.name}
                          className="w-full h-full object-contain p-6 transition-transform duration-300 hover:scale-105"
                          onError={e => { (e.target as HTMLImageElement).src = fallback; }}
                        />

                        {/* Discount pill */}
                        <div
                          className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-bold text-white"
                          style={{ background: RED, boxShadow: `0 0 14px ${RED}70` }}
                        >
                          -{discPct}%
                        </div>

                        {/* Trend badge */}
                        {i % 3 === 0 && (
                          <div
                            className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                            style={{ background: "rgba(6,26,18,0.88)", color: GLOW, border: `1px solid ${GLOW}30`, backdropFilter: "blur(8px)" }}
                          >
                            <TrendingUp className="h-2.5 w-2.5" /> Trending
                          </div>
                        )}
                        {i % 5 === 1 && (
                          <div
                            className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                            style={{ background: "rgba(6,26,18,0.88)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.25)", backdropFilter: "blur(8px)" }}
                          >
                            <Flame className="h-2.5 w-2.5" /> Hot
                          </div>
                        )}

                        {/* Price overlay */}
                        <div
                          className="absolute bottom-3 left-3 px-3 py-2 rounded-xl"
                          style={{
                            background: "rgba(6,26,18,0.90)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            backdropFilter: "blur(12px)",
                          }}
                        >
                          <p className="font-bold text-[15px] leading-none" style={{ color: RED }}>
                            ৳ {(product.price ?? 0).toLocaleString("en-BD")}
                          </p>
                          <p className="text-xs line-through leading-none mt-0.5" style={{ color: MUTED }}>
                            ৳ {oldPrice.toLocaleString("en-BD")}
                          </p>
                        </div>
                      </div>
                    </Link>

                    {/* ─ Product info ─ */}
                    <div className="px-4 pt-3 pb-2">
                      <p className="font-semibold text-sm line-clamp-1" style={{ color: TEXT }}>{product.name}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, j) => (
                            <Star
                              key={j}
                              className="h-3 w-3"
                              style={{
                                fill: j < Math.floor(Number(rating)) ? "#f59e0b" : "transparent",
                                color: "#f59e0b",
                              }}
                            />
                          ))}
                          <span className="text-xs font-semibold ml-1" style={{ color: "#f59e0b" }}>{rating}</span>
                          <span className="text-xs ml-0.5" style={{ color: MUTED }}>({reviews})</span>
                        </div>
                        <div className="flex items-center gap-1" style={{ color: MUTED }}>
                          <Eye className="h-3 w-3" />
                          <span className="text-xs">{views >= 1000 ? (views / 1000).toFixed(1) + "k" : views} views</span>
                        </div>
                      </div>
                    </div>

                    {/* ─ Divider ─ */}
                    <div className="mx-4" style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

                    {/* ─ Actions ─ */}
                    <div className="flex items-center justify-between px-4 py-3">
                      {/* Like + Comment */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setLiked(p => ({ ...p, [product.id]: !p[product.id] }))}
                          className="flex items-center gap-1.5 h-9 px-3 rounded-xl transition-all hover:bg-white/5"
                          style={{ color: isLiked ? RED : MUTED }}
                        >
                          <Heart
                            className="h-[17px] w-[17px]"
                            style={{ fill: isLiked ? RED : "transparent", filter: isLiked ? `drop-shadow(0 0 4px ${RED})` : "none" }}
                          />
                          <span className="text-xs font-medium">Like</span>
                        </button>
                        <button
                          className="flex items-center gap-1.5 h-9 px-3 rounded-xl transition-all hover:bg-white/5"
                          style={{ color: MUTED }}
                        >
                          <MessageCircle className="h-[17px] w-[17px]" />
                          <span className="text-xs font-medium">Comment</span>
                        </button>
                      </div>

                      {/* Wishlist + Cart */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setWishlist(p => ({ ...p, [product.id]: !p[product.id] }))}
                          className="h-9 w-9 flex items-center justify-center rounded-xl border transition-all"
                          style={{
                            borderColor: inWishlist ? `${RED}55` : "rgba(255,255,255,0.12)",
                            background: inWishlist ? "rgba(255,59,59,0.09)" : "transparent",
                            color: inWishlist ? RED : MUTED,
                          }}
                        >
                          <Heart className="h-4 w-4" style={{ fill: inWishlist ? RED : "transparent" }} />
                        </button>
                        <button
                          onClick={() => handleCart(product)}
                          className="flex items-center gap-1.5 h-9 px-4 rounded-xl border font-semibold text-[12px] transition-all duration-200"
                          style={{
                            borderColor: inCart ? GLOW : `${GLOW}45`,
                            color: inCart ? "#061A12" : GLOW,
                            background: inCart ? GLOW : "rgba(0,255,156,0.07)",
                            boxShadow: inCart ? `0 0 16px rgba(0,255,156,0.35)` : "none",
                          }}
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                          {inCart ? "Added!" : "Add to Cart"}
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                );
              })
          }
        </div>

      </div>
    </Layout>
  );
}
