import React, { useState } from "react";
import { Link, useSearch } from "wouter";
import { useListProducts } from "@workspace/api-client-react";
import type { Product } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { ShoppingCart, Star, SlidersHorizontal, Search, ChevronRight, Heart } from "lucide-react";

/* ─── Theme ─── */
const GLOW  = "#00FF9C";
const RED   = "#FF3B3B";
const TEXT  = "#E8F5EE";
const MUTED = "#A3C9B8";

/* ─── Categories ─── */
const CATS = [
  { id: "all",         label: "All",           emoji: "🏪" },
  { id: "agriculture", label: "Agriculture",   emoji: "🌾" },
  { id: "grocery",     label: "Grocery",       emoji: "🛒" },
  { id: "electronics", label: "Electronics",   emoji: "⚡" },
  { id: "textiles",    label: "Textiles",      emoji: "🧵" },
  { id: "spices",      label: "Spices",        emoji: "🌶️" },
  { id: "beauty",      label: "Beauty",        emoji: "✨" },
  { id: "home",        label: "Home",          emoji: "🏠" },
];

const SORTS = ["Popular", "Price: Low→High", "Price: High→Low", "Newest", "Rating"];

const FALLBACKS = [
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=75",
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=75",
  "https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=400&q=75",
  "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&q=75",
  "https://images.unsplash.com/photo-1559181567-c3190bce8d0a?w=400&q=75",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=75",
];

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addToCart }       = useCart();
  const [wished, setWished] = useState(false);
  const [added, setAdded]   = useState(false);
  const fallback = FALLBACKS[index % FALLBACKS.length];
  const discPct  = 8 + (index * 9) % 25;
  const oldPrice = Math.round((product.price ?? 0) * (1 + discPct / 100));
  const rating   = (4.1 + (index * 0.15) % 0.8).toFixed(1);
  const reviews  = 10 + (index * 29) % 200;

  const handleCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      productId: product.id,
      productName: product.name,
      vendorId: product.vendorId,
      vendorName: product.vendorName,
      quantity: 1,
      price: product.price ?? 0,
      image: product.images?.[0] ?? "",
    });
    setAdded(true);
    toast.success("Added to cart!", {
      style: { background: "#0B2B1F", border: "1px solid rgba(0,255,156,0.3)", color: TEXT },
    });
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <Link href={`/products/${product.id}`}>
      <div
        className="group cursor-pointer overflow-hidden transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background: "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.025) 100%)",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden" style={{ background: "#f4f6f4" }}>
          <img
            src={product.images?.[0] ?? fallback}
            alt={product.name}
            className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
            onError={e => { (e.target as HTMLImageElement).src = fallback; }}
          />
          {/* Discount */}
          <div
            className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
            style={{ background: RED }}
          >
            -{discPct}%
          </div>
          {/* Wishlist */}
          <button
            onClick={e => { e.preventDefault(); setWished(w => !w); }}
            className="absolute top-2 right-2 h-7 w-7 rounded-full flex items-center justify-center transition-all"
            style={{
              background: "rgba(6,26,18,0.80)",
              border: `1px solid ${wished ? RED + "80" : "rgba(255,255,255,0.18)"}`,
            }}
          >
            <Heart className="h-3.5 w-3.5" style={{ fill: wished ? RED : "transparent", color: wished ? RED : MUTED }} />
          </button>
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="text-xs font-semibold line-clamp-2 leading-snug mb-1.5" style={{ color: TEXT }}>
            {product.name}
          </p>
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-[11px] font-semibold" style={{ color: "#f59e0b" }}>{rating}</span>
            <span className="text-[10px]" style={{ color: MUTED }}>({reviews})</span>
          </div>
          {/* Price */}
          <div className="flex items-baseline gap-1.5 mb-2.5">
            <span className="text-sm font-bold" style={{ color: RED }}>৳{(product.price ?? 0).toLocaleString()}</span>
            <span className="text-[10px] line-through" style={{ color: MUTED }}>৳{oldPrice.toLocaleString()}</span>
          </div>
          {/* Add to cart */}
          <button
            onClick={handleCart}
            className="w-full flex items-center justify-center gap-1.5 h-8 rounded-xl text-[11px] font-bold border transition-all duration-200"
            style={{
              borderColor: added ? GLOW : `${RED}55`,
              color: added ? "#061A12" : RED,
              background: added ? GLOW : "rgba(255,59,59,0.07)",
              boxShadow: added ? `0 0 14px rgba(0,255,156,0.3)` : "none",
            }}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {added ? "Added!" : "Add to Cart"}
          </button>
        </div>
      </div>
    </Link>
  );
}

export default function ProductsPage() {
  const searchStr = useSearch();
  const params    = new URLSearchParams(searchStr);
  const query     = params.get("q") ?? "";

  const [activeCat, setActiveCat] = useState("all");
  const [activeSort, setActiveSort] = useState("Popular");
  const [showSort, setShowSort]     = useState(false);

  const { data, isLoading } = useListProducts({ limit: 24 });
  const products = (data?.products ?? []).filter(p =>
    !query || p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-[540px] mx-auto w-full">

        {/* ── Header row ── */}
        <div className="sticky top-[88px] z-30 px-3 pt-3 pb-2" style={{ background: "rgba(6,26,18,0.95)", backdropFilter: "blur(16px)" }}>

          {/* Category pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
            {CATS.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className="flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-semibold shrink-0 transition-all duration-200"
                style={{
                  background: activeCat === cat.id ? GLOW : "rgba(255,255,255,0.06)",
                  color: activeCat === cat.id ? "#061A12" : MUTED,
                  border: activeCat === cat.id ? `1px solid ${GLOW}` : "1px solid rgba(255,255,255,0.10)",
                  boxShadow: activeCat === cat.id ? `0 0 14px rgba(0,255,156,0.3)` : "none",
                }}
              >
                <span>{cat.emoji}</span> {cat.label}
              </button>
            ))}
          </div>

          {/* Sort + result count */}
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs" style={{ color: MUTED }}>
              <span className="font-semibold" style={{ color: TEXT }}>{products.length}</span> products found
              {query && <span> for "<span style={{ color: GLOW }}>{query}</span>"</span>}
            </p>
            <div className="relative">
              <button
                onClick={() => setShowSort(v => !v)}
                className="flex items-center gap-1.5 h-7 px-3 rounded-xl text-xs font-semibold transition-all hover:bg-white/6"
                style={{ color: MUTED, border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.04)" }}
              >
                <SlidersHorizontal className="h-3 w-3" /> {activeSort}
              </button>
              {showSort && (
                <div
                  className="absolute right-0 top-full mt-1.5 w-44 rounded-2xl overflow-hidden z-40"
                  style={{ background: "rgba(8,28,18,0.97)", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 16px 48px rgba(0,0,0,0.5)", backdropFilter: "blur(24px)" }}
                >
                  {SORTS.map(s => (
                    <button
                      key={s}
                      onClick={() => { setActiveSort(s); setShowSort(false); }}
                      className="w-full text-left px-4 py-2.5 text-xs transition-all hover:bg-white/6 flex items-center justify-between"
                      style={{ color: s === activeSort ? GLOW : MUTED }}
                    >
                      {s}
                      {s === activeSort && <span style={{ color: GLOW, fontSize: 10 }}>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Product grid ── */}
        <div className="px-3 pb-4">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden animate-pulse"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16 }}
                >
                  <div className="aspect-square" style={{ background: "rgba(255,255,255,0.05)" }} />
                  <div className="p-3 space-y-2">
                    <div className="h-3 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
                    <div className="h-2.5 rounded-full w-2/3" style={{ background: "rgba(255,255,255,0.04)" }} />
                    <div className="h-7 rounded-xl mt-2" style={{ background: "rgba(255,255,255,0.04)" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="text-5xl">🔍</div>
              <p className="text-base font-semibold" style={{ color: TEXT }}>No products found</p>
              <p className="text-sm" style={{ color: MUTED }}>Try a different search or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}
