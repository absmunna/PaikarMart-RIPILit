import React, { useState } from "react";
import { useListProducts } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import type { Product } from "@workspace/api-zod";
import {
  ShoppingCart, Star, Zap, Package, Store, Filter,
  ChevronRight, SlidersHorizontal, X, Tag, Layers,
  Sparkles, ArrowRight,
} from "lucide-react";

const MARKET_BANNERS = [
  {
    id: "m1",
    gradient: "from-emerald-900 via-teal-900 to-emerald-950",
    glow: "rgba(16,185,129,0.35)",
    badge: "🔥 Flash Deals",
    headline: "Up to 60% Off Today",
    img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80",
    href: "/products?sort=price_asc",
  },
  {
    id: "m2",
    gradient: "from-violet-900 via-purple-900 to-violet-950",
    glow: "rgba(139,92,246,0.35)",
    badge: "📦 Wholesale",
    headline: "Bulk Orders — Low MOQ",
    img: "https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?w=400&q=80",
    href: "/vendors?type=wholesale",
  },
  {
    id: "m3",
    gradient: "from-blue-900 via-indigo-900 to-blue-950",
    glow: "rgba(59,130,246,0.35)",
    badge: "📱 Electronics",
    headline: "New Tech Arrivals",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
    href: "/products?category=Electronics",
  },
  {
    id: "m4",
    gradient: "from-orange-900 via-amber-900 to-orange-950",
    glow: "rgba(251,146,60,0.35)",
    badge: "👗 Fashion Week",
    headline: "New Season Collection",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&q=80",
    href: "/products?category=Fashion",
  },
  {
    id: "m5",
    gradient: "from-rose-900 via-pink-900 to-rose-950",
    glow: "rgba(244,63,94,0.35)",
    badge: "🏡 Home & Living",
    headline: "Decor Starts at ৳299",
    img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
    href: "/products?category=Home",
  },
];

function MarketReelBanner() {
  const [, navigate] = useLocation();
  return (
    <div className="overflow-x-auto scrollbar-hide" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="flex gap-2.5 px-3 py-3" style={{ width: "max-content" }}>
        {MARKET_BANNERS.map((slide) => (
          <div
            key={slide.id}
            onClick={() => navigate(slide.href)}
            className="relative rounded-2xl overflow-hidden shrink-0 cursor-pointer active:scale-95 transition-all duration-200"
            style={{ width: "148px", height: "220px" }}
          >
            {/* BG image */}
            <img src={slide.img} alt={slide.headline}
              className="absolute inset-0 w-full h-full object-cover" />
            {/* Gradient overlays */}
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-75`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 80% 60% at 50% 20%, ${slide.glow}, transparent)` }} />

            {/* Badge */}
            <div className="absolute top-2.5 left-2.5 right-2.5 z-10">
              <span className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-full border border-white/20">
                <Sparkles className="h-2 w-2" /> {slide.badge}
              </span>
            </div>

            {/* Bottom text */}
            <div className="absolute bottom-0 left-0 right-0 p-2.5 z-10">
              <p className="text-white font-extrabold text-sm leading-tight line-clamp-2 mb-2">
                {slide.headline}
              </p>
              <div className="flex items-center gap-1">
                <span className="text-white/60 text-[10px] font-medium">Shop now</span>
                <ArrowRight className="h-3 w-3 text-white/60" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const CATEGORIES = ["All", "Electronics", "Fashion", "Grocery", "Services", "Wholesale"];
const VENDOR_TYPES = ["All Types", "Wholesale", "Retail", "Brand", "Local"];
const PRICE_RANGES = [
  { label: "Any Price", min: "", max: "" },
  { label: "Under ৳500", min: "", max: "500" },
  { label: "৳500 – ৳2,000", min: "500", max: "2000" },
  { label: "৳2,000 – ৳10,000", min: "2000", max: "10000" },
  { label: "Above ৳10,000", min: "10000", max: "" },
];
const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [, navigate] = useLocation();
  const [adding, setAdding] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setAdding(true);
    addToCart({
      productId: product.id, productName: product.name,
      vendorId: product.vendorId, vendorName: product.vendorName,
      price: product.price || 0, quantity: 1, image: product.images?.[0] || "",
    });
    toast.success("Added to cart!");
    setTimeout(() => setAdding(false), 800);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    addToCart({
      productId: product.id, productName: product.name,
      vendorId: product.vendorId, vendorName: product.vendorName,
      price: product.price || 0, quantity: 1, image: product.images?.[0] || "",
    });
    navigate("/checkout");
  };

  const originalPrice = product.price ? Math.round(product.price * 1.15) : 0;
  const discount = originalPrice > 0 ? Math.round(((originalPrice - (product.price || 0)) / originalPrice) * 100) : 0;

  return (
    <Link href={`/products/${product.id}`}>
      <div className="group cursor-pointer glass-card rounded-xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 hover:border-primary/30 h-full flex flex-col">
        <div className="aspect-square bg-white/5 relative overflow-hidden">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center"><Package className="h-12 w-12 text-white/10" /></div>
          )}
          {product.type === "digital" && (
            <div className="absolute top-2 left-2"><Badge className="bg-purple-600/90 text-white text-[10px] border-0">Digital</Badge></div>
          )}
          {discount > 0 && (
            <div className="absolute top-2 right-2"><Badge className="bg-red-500/90 text-white text-[10px] border-0">-{discount}%</Badge></div>
          )}
          {product.inStock === false && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
        </div>
        <div className="p-3 flex flex-col flex-1">
          <div className="text-[10px] text-primary font-semibold uppercase tracking-wide mb-1">{product.category}</div>
          <h3 className="font-medium text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors text-white flex-1">{product.name}</h3>
          <p className="text-xs text-white/40 mb-2 line-clamp-1 flex items-center gap-1">
            <Store className="h-3 w-3 shrink-0 text-primary/60" /> {product.vendorName}
          </p>
          <div className="flex items-center gap-1 mb-2">
            {[1,2,3,4,5].map(s => (
              <Star key={s} className={`h-3 w-3 ${s <= Math.round(product.rating || 4) ? "text-yellow-400 fill-yellow-400" : "text-white/10 fill-white/10"}`} />
            ))}
            <span className="text-[10px] text-white/30 ml-0.5">({product.reviewCount || 0})</span>
          </div>
          <div className="mb-3">
            {product.priceOnInquiry ? (
              <span className="text-sm font-bold text-amber-400">Price on Request</span>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-white">৳{product.price?.toLocaleString()}</span>
                {originalPrice > 0 && <span className="text-xs text-white/30 line-through">৳{originalPrice.toLocaleString()}</span>}
              </div>
            )}
          </div>
          <div className="flex gap-1.5">
            <Button size="sm" variant="outline" className="flex-1 h-8 text-xs border-white/15 text-white/70 hover:border-primary hover:text-primary bg-transparent" onClick={handleAdd} disabled={adding || product.inStock === false}>
              <ShoppingCart className="h-3 w-3 mr-1" /> {adding ? "Added!" : "Cart"}
            </Button>
            <Button size="sm" className="flex-1 h-8 text-xs bg-primary hover:bg-primary/90" onClick={handleBuyNow} disabled={!!product.priceOnInquiry || product.inStock === false}>
              <Zap className="h-3 w-3 mr-1" /> Buy
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("");
  const [priceRange, setPriceRange] = useState(PRICE_RANGES[0]);
  const [vendorType, setVendorType] = useState("All Types");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  const { data: productsData, isLoading } = useListProducts(
    selectedCategory !== "All" ? { category: selectedCategory } : {}
  );

  let products = productsData?.products || [];
  if (priceRange.min) products = products.filter((p: any) => (p.price || 0) >= Number(priceRange.min));
  if (priceRange.max) products = products.filter((p: any) => (p.price || 0) <= Number(priceRange.max));
  if (inStockOnly) products = products.filter((p: any) => p.inStock !== false);
  if (sortBy === "price_asc") products = [...products].sort((a, b) => (a.price || 0) - (b.price || 0));
  if (sortBy === "price_desc") products = [...products].sort((a, b) => (b.price || 0) - (a.price || 0));
  if (sortBy === "rating") products = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));

  const hasFilters = selectedCategory !== "All" || priceRange.min !== "" || priceRange.max !== "" || vendorType !== "All Types" || inStockOnly;

  const clearAll = () => {
    setSelectedCategory("All");
    setPriceRange(PRICE_RANGES[0]);
    setVendorType("All Types");
    setInStockOnly(false);
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Layers className="h-3.5 w-3.5" /> Category
        </h3>
        <div className="space-y-1">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                selectedCategory === cat
                  ? "bg-primary/15 text-primary font-medium"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}>
              <span>{cat}</span>
              {selectedCategory === cat && <ChevronRight className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Tag className="h-3.5 w-3.5" /> Price Range
        </h3>
        <div className="space-y-1">
          {PRICE_RANGES.map(range => (
            <button key={range.label} onClick={() => setPriceRange(range)}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-all ${
                priceRange.label === range.label
                  ? "bg-primary/15 text-primary font-medium"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}>
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vendor Type */}
      <div>
        <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Store className="h-3.5 w-3.5" /> Vendor Type
        </h3>
        <div className="space-y-1">
          {VENDOR_TYPES.map(type => (
            <button key={type} onClick={() => setVendorType(type)}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-all ${
                vendorType === type
                  ? "bg-primary/15 text-primary font-medium"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}>
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* In Stock */}
      <div>
        <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3">Availability</h3>
        <label className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer hover:bg-white/5 transition-all">
          <div onClick={() => setInStockOnly(v => !v)}
            className={`h-5 w-9 rounded-full transition-colors flex items-center ${inStockOnly ? "bg-primary" : "bg-white/10"}`}>
            <div className={`h-4 w-4 rounded-full bg-white shadow transition-transform mx-0.5 ${inStockOnly ? "translate-x-4" : ""}`} />
          </div>
          <span className="text-sm text-white/60">In Stock Only</span>
        </label>
      </div>

      {hasFilters && (
        <Button variant="outline" size="sm" onClick={clearAll} className="w-full border-white/15 text-white/50 hover:text-white hover:bg-white/5">
          <X className="h-3.5 w-3.5 mr-1.5" /> Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <Layout>
      {/* Reel-style promo banner */}
      <MarketReelBanner />

      {/* Mobile Filter Overlay */}
      {mobileSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileSidebar(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 glass-card rounded-l-2xl p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-white">Filters</h2>
              <button onClick={() => setMobileSidebar(false)} className="text-white/40 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <FilterPanel />
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Left Sidebar */}
          <aside className="hidden lg:block w-56 xl:w-64 shrink-0">
            <div className="glass-card rounded-2xl p-4 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-white flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-primary" /> Filters
                </h2>
                {hasFilters && (
                  <button onClick={clearAll} className="text-xs text-primary hover:underline">Clear all</button>
                )}
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h1 className="text-xl font-bold text-white">
                  {selectedCategory === "All" ? "All Products" : selectedCategory}
                </h1>
                <p className="text-sm text-white/40 mt-0.5">
                  {isLoading ? "Loading..." : `${products.length} products`}
                  {hasFilters && " · Filtered"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMobileSidebar(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-lg border border-white/15 text-sm text-white/60 hover:bg-white/5 transition-all"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {hasFilters && <span className="h-4 w-4 rounded-full bg-primary text-white text-[9px] flex items-center justify-center">!</span>}
                </button>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-gray-900">{o.label}</option>)}
                </select>
              </div>
            </div>

            {/* Active filter chips */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCategory !== "All" && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/15 text-primary text-xs font-medium">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory("All")}><X className="h-3 w-3" /></button>
                  </span>
                )}
                {priceRange.label !== "Any Price" && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/15 text-primary text-xs font-medium">
                    {priceRange.label}
                    <button onClick={() => setPriceRange(PRICE_RANGES[0])}><X className="h-3 w-3" /></button>
                  </span>
                )}
                {vendorType !== "All Types" && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/15 text-primary text-xs font-medium">
                    {vendorType}
                    <button onClick={() => setVendorType("All Types")}><X className="h-3 w-3" /></button>
                  </span>
                )}
                {inStockOnly && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/15 text-primary text-xs font-medium">
                    In Stock
                    <button onClick={() => setInStockOnly(false)}><X className="h-3 w-3" /></button>
                  </span>
                )}
              </div>
            )}

            {/* Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {[1,2,3,4,5,6,7,8].map(i => (
                  <div key={i} className="glass-card rounded-xl overflow-hidden">
                    <Skeleton className="aspect-square w-full bg-white/5" />
                    <div className="p-3 space-y-2">
                      <Skeleton className="h-3 w-1/3 bg-white/5" />
                      <Skeleton className="h-4 w-full bg-white/5" />
                      <Skeleton className="h-4 w-2/3 bg-white/5" />
                      <Skeleton className="h-8 w-full bg-white/5" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <Package className="h-10 w-10 text-white/20" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
                <p className="text-white/40 mb-6">Try a different category or clear your filters</p>
                <Button onClick={clearAll} variant="outline" className="border-white/20 text-white/60 hover:bg-white/5">
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product: any) => <ProductCard key={product.id} product={product} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
