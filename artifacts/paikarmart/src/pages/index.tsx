import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useListProducts, useListSellers } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import type { Product } from "@workspace/api-zod/src/generated/types";
import {
  Store, Tag, TrendingUp, Package, HeadphonesIcon, Building2,
  Star, ShoppingCart, Zap, ChevronLeft, ChevronRight,
  ShieldCheck, CreditCard, Truck, Award, MapPin,
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  ArrowRight, Flame, Sparkles, BadgePercent
} from "lucide-react";

/* ─── Static Data ──────────────────────────────────────────────── */

const HERO_SLIDES = [
  {
    id: 1,
    gradient: "from-emerald-900 via-teal-800 to-emerald-700",
    glowColor: "rgba(16,185,129,0.25)",
    eyebrow: "Welcome to PaikarMart",
    headline: "Bangladesh's Premium Marketplace",
    sub: "Connect with wholesalers, brands, and local shops. Best prices, reliable delivery.",
    cta1: { label: "Start Shopping", href: "/products" },
    cta2: { label: "Become a Seller", href: "/seller/register" },
    badge: "🚀 10,000+ Products Listed",
    img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
    accent: "emerald",
  },
  {
    id: 2,
    gradient: "from-violet-900 via-purple-800 to-indigo-800",
    glowColor: "rgba(139,92,246,0.25)",
    eyebrow: "Wholesale Marketplace",
    headline: "Buy in Bulk, Save More",
    sub: "Access thousands of wholesale suppliers. MOQ as low as 10 units.",
    cta1: { label: "Browse Wholesale", href: "/vendors?type=wholesale" },
    cta2: { label: "Register as Seller", href: "/seller/register" },
    badge: "💰 Up to 60% Wholesale Savings",
    img: "https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?w=600&q=80",
    accent: "purple",
  },
  {
    id: 3,
    gradient: "from-slate-900 via-emerald-900 to-teal-800",
    glowColor: "rgba(20,184,166,0.25)",
    eyebrow: "Digital & Services",
    headline: "Software, Services & Digital",
    sub: "Professional services, digital downloads, and software licenses — all in one place.",
    cta1: { label: "Explore Services", href: "/vendors?type=service" },
    cta2: { label: "List Your Service", href: "/seller/register" },
    badge: "⚡ Instant Digital Delivery",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    accent: "teal",
  },
];

const CATEGORIES = [
  { name: "Wholesale", icon: Package, href: "/vendors?type=wholesale", emoji: "📦", color: "from-orange-500/20 to-orange-600/10", border: "border-orange-500/20", text: "text-orange-400" },
  { name: "Retail", icon: Tag, href: "/vendors?type=retail", emoji: "🏷️", color: "from-blue-500/20 to-blue-600/10", border: "border-blue-500/20", text: "text-blue-400" },
  { name: "Brand", icon: Building2, href: "/vendors?type=brand_seller", emoji: "✨", color: "from-purple-500/20 to-purple-600/10", border: "border-purple-500/20", text: "text-purple-400" },
  { name: "Dropship", icon: TrendingUp, href: "/vendors?type=dropship", emoji: "🚀", color: "from-teal-500/20 to-teal-600/10", border: "border-teal-500/20", text: "text-teal-400" },
  { name: "Services", icon: HeadphonesIcon, href: "/vendors?type=service", emoji: "🔧", color: "from-pink-500/20 to-pink-600/10", border: "border-pink-500/20", text: "text-pink-400" },
  { name: "Local Shop", icon: Store, href: "/vendors?type=local_shop", emoji: "🏪", color: "from-yellow-500/20 to-yellow-600/10", border: "border-yellow-500/20", text: "text-yellow-400" },
];

const STORY_SELLERS = [
  { id: "s1", name: "TechZone BD", emoji: "📱", ring: "from-emerald-400 to-teal-500" },
  { id: "s2", name: "Fashion Hub", emoji: "👗", ring: "from-purple-400 to-pink-500" },
  { id: "s3", name: "Grocery King", emoji: "🛒", ring: "from-orange-400 to-red-500" },
  { id: "s4", name: "HomeDeco", emoji: "🏡", ring: "from-blue-400 to-cyan-500" },
  { id: "s5", name: "SportsGear", emoji: "⚽", ring: "from-green-400 to-emerald-500" },
  { id: "s6", name: "BeautyShop", emoji: "💄", ring: "from-pink-400 to-rose-500" },
  { id: "s7", name: "BookWorld", emoji: "📚", ring: "from-yellow-400 to-amber-500" },
  { id: "s8", name: "ToolMart", emoji: "🔨", ring: "from-red-400 to-orange-500" },
];

const PROMO_BANNERS = [
  { title: "Flash Sale", sub: "Electronics up to 40% off", emoji: "⚡", color: "from-orange-500/20 to-red-500/10", border: "border-orange-500/25", badge: "Limited Time", href: "/products?category=Electronics" },
  { title: "New Arrivals", sub: "Fresh fashion collections", emoji: "✨", color: "from-purple-500/20 to-pink-500/10", border: "border-purple-500/25", badge: "Just In", href: "/products?category=Fashion" },
  { title: "Wholesale Hub", sub: "MOQ deals for resellers", emoji: "📦", color: "from-emerald-500/20 to-teal-500/10", border: "border-emerald-500/25", badge: "B2B", href: "/vendors?type=wholesale" },
];

const TRUST_FEATURES = [
  { icon: ShieldCheck, title: "Verified Sellers", desc: "Every seller verified for your safety.", color: "text-emerald-400", bg: "bg-emerald-500/10 border border-emerald-500/20" },
  { icon: CreditCard, title: "Secure Payments", desc: "Multiple secure payment methods.", color: "text-blue-400", bg: "bg-blue-500/10 border border-blue-500/20" },
  { icon: Truck, title: "Fast Delivery", desc: "Delivery across all Bangladesh.", color: "text-orange-400", bg: "bg-orange-500/10 border border-orange-500/20" },
  { icon: Award, title: "Quality Assured", desc: "Products meet quality standards.", color: "text-purple-400", bg: "bg-purple-500/10 border border-purple-500/20" },
];

/* ─── Hero Slider ──────────────────────────────────────────────── */

function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [, navigate] = useLocation();

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const slide = HERO_SLIDES[current];

  return (
    <section
      className={`relative bg-gradient-to-br ${slide.gradient} text-white overflow-hidden transition-all duration-700`}
      style={{ minHeight: 400 }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{ background: `radial-gradient(ellipse 70% 60% at 80% 50%, ${slide.glowColor}, transparent)` }}
      />
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg,white 0,white 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,white 0,white 1px,transparent 1px,transparent 40px)" }}
      />

      <div className="container mx-auto px-4 py-12 lg:py-16 flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-4 border border-white/20">
            <Sparkles className="h-3 w-3" /> {slide.badge}
          </div>
          <p className="text-white/60 font-medium text-xs mb-2 uppercase tracking-widest">{slide.eyebrow}</p>
          <h1 className="text-3xl lg:text-5xl font-extrabold mb-4 leading-tight">{slide.headline}</h1>
          <p className="text-white/70 text-sm lg:text-base mb-8 max-w-md">{slide.sub}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
            <button
              onClick={() => navigate(slide.cta1.href)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm bg-white text-gray-900 hover:bg-white/90 transition-all shadow-lg"
            >
              {slide.cta1.label} <ArrowRight className="h-4 w-4 inline ml-1" />
            </button>
            <button
              onClick={() => navigate(slide.cta2.href)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm bg-white/12 border border-white/25 hover:bg-white/20 text-white backdrop-blur-sm transition-all"
            >
              {slide.cta2.label}
            </button>
          </div>
        </div>
        <div className="hidden lg:block w-72 h-56 rounded-2xl overflow-hidden shadow-2xl border border-white/15 shrink-0">
          <img src={slide.img} alt={slide.headline} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        <button
          onClick={() => setCurrent(c => (c - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          className="h-7 w-7 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center border border-white/20 transition-all"
        >
          <ChevronLeft className="h-3.5 w-3.5 text-white" />
        </button>
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? "w-7 h-2 bg-white" : "w-2 h-2 bg-white/40"}`}
          />
        ))}
        <button
          onClick={() => setCurrent(c => (c + 1) % HERO_SLIDES.length)}
          className="h-7 w-7 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center border border-white/20 transition-all"
        >
          <ChevronRight className="h-3.5 w-3.5 text-white" />
        </button>
      </div>
    </section>
  );
}

/* ─── Stories ──────────────────────────────────────────────────── */

function StoriesSection() {
  const [viewed, setViewed] = useState<Set<string>>(new Set());

  return (
    <section className="py-4 px-4">
      <div className="container mx-auto">
        <div className="scroll-x-hidden flex gap-4 py-2">
          {/* Add Story */}
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <div
              className="h-14 w-14 rounded-2xl flex items-center justify-center border-2 border-dashed cursor-pointer hover:border-emerald-500 transition-colors"
              style={{ borderColor: "rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.06)" }}
            >
              <span className="text-2xl">+</span>
            </div>
            <span className="text-[10px] text-white/40 font-medium">Your Story</span>
          </div>

          {STORY_SELLERS.map(seller => {
            const isViewed = viewed.has(seller.id);
            return (
              <div
                key={seller.id}
                className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer"
                onClick={() => setViewed(v => new Set([...v, seller.id]))}
              >
                <div className={`story-ring rounded-2xl p-[2px] ${isViewed ? "opacity-50" : ""} bg-gradient-to-br ${seller.ring}`}>
                  <div
                    className="h-12 w-12 rounded-[14px] flex items-center justify-center text-2xl"
                    style={{ background: "hsl(160 28% 7%)" }}
                  >
                    {seller.emoji}
                  </div>
                </div>
                <span className="text-[10px] text-white/60 font-medium w-14 text-center truncate">{seller.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Product Card (Glossy Dark) ───────────────────────────────── */

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [, navigate] = useLocation();
  const [adding, setAdding] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addToCart({
      productId: product.id,
      productName: product.name,
      vendorId: product.vendorId,
      vendorName: product.vendorName,
      price: product.price || 0,
      quantity: 1,
      image: product.images?.[0] || "",
    });
    toast.success("Added to cart!");
    setTimeout(() => setAdding(false), 800);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      productName: product.name,
      vendorId: product.vendorId,
      vendorName: product.vendorName,
      price: product.price || 0,
      quantity: 1,
      image: product.images?.[0] || "",
    });
    navigate("/checkout");
  };

  const originalPrice = product.price ? Math.round(product.price * 1.15) : 0;
  const discount = originalPrice > 0 ? Math.round(((originalPrice - (product.price || 0)) / originalPrice) * 100) : 0;

  return (
    <Link href={`/products/${product.id}`}>
      <div className="glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer group h-full flex flex-col">
        {/* Image */}
        <div className="relative overflow-hidden bg-white/4" style={{ aspectRatio: "1/1" }}>
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20">
              <Package className="h-10 w-10" />
            </div>
          )}
          {/* Gradient overlay at bottom */}
          <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Badges */}
          {discount > 0 && (
            <div className="absolute top-2 left-2">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500 text-white">-{discount}%</span>
            </div>
          )}
          {product.inStock === false && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
              <span className="text-xs font-semibold text-white/80 border border-white/30 px-3 py-1 rounded-full">Out of Stock</span>
            </div>
          )}

          {/* Like button */}
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); setLiked(l => !l); }}
            className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/15 opacity-0 group-hover:opacity-100 transition-all"
          >
            <Heart className={`h-3.5 w-3.5 ${liked ? "fill-red-400 text-red-400" : "text-white/70"}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 flex flex-col flex-1">
          <div className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wide mb-1">{product.category}</div>
          <h3 className="font-semibold text-sm line-clamp-2 mb-1.5 text-white/90 group-hover:text-emerald-300 transition-colors flex-1">
            {product.name}
          </h3>
          <p className="text-xs text-white/40 mb-2 line-clamp-1 flex items-center gap-1">
            <Store className="h-3 w-3 shrink-0 text-white/30" /> {product.vendorName}
          </p>

          {/* Stars */}
          <div className="flex items-center gap-0.5 mb-2.5">
            {[1,2,3,4,5].map(s => (
              <Star key={s} className={`h-3 w-3 ${s <= Math.round(product.rating || 4) ? "text-yellow-400 fill-yellow-400" : "text-white/15 fill-white/15"}`} />
            ))}
            <span className="text-[10px] text-white/30 ml-0.5">({product.reviewCount || 0})</span>
          </div>

          {/* Price */}
          <div className="mb-3">
            {product.priceOnInquiry ? (
              <span className="text-sm font-bold text-orange-400">Price on Request</span>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-base text-white">৳{product.price?.toLocaleString()}</span>
                {originalPrice > 0 && (
                  <span className="text-xs text-white/30 line-through">৳{originalPrice.toLocaleString()}</span>
                )}
              </div>
            )}
            {product.moq && <p className="text-[10px] text-orange-400 mt-0.5">MOQ: {product.moq} units</p>}
          </div>

          {/* Wholesale / Retail labels */}
          <div className="flex gap-1 mb-2.5">
            <span className="text-[9px] px-1.5 py-0.5 rounded-md font-medium" style={{ background: "rgba(16,185,129,0.15)", color: "hsl(145 65% 55%)" }}>Wholesale</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-md font-medium" style={{ background: "rgba(139,92,246,0.15)", color: "hsl(265 65% 70%)" }}>Retail</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-1.5">
            <button
              onClick={handleAdd}
              disabled={adding || product.inStock === false}
              className="flex-1 h-8 rounded-xl text-xs font-semibold border transition-all hover:bg-emerald-500/15 disabled:opacity-40 flex items-center justify-center gap-1"
              style={{ borderColor: "rgba(16,185,129,0.35)", color: "hsl(145 65% 52%)" }}
            >
              <ShoppingCart className="h-3 w-3" />
              {adding ? "Added!" : "Add"}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!!product.priceOnInquiry || product.inStock === false}
              className="flex-1 h-8 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-1"
              style={{ background: "linear-gradient(135deg, hsl(145 65% 30%), hsl(145 60% 40%))" }}
            >
              <Zap className="h-3 w-3" /> Buy Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── Seller Feed Card ─────────────────────────────────────────── */

function FeedCard({ product, index }: { product: Product; index: number }) {
  const { addToCart } = useCart();
  const [, navigate] = useLocation();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const likes = 42 + index * 13;

  const handleAdd = () => {
    addToCart({
      productId: product.id,
      productName: product.name,
      vendorId: product.vendorId,
      vendorName: product.vendorName,
      price: product.price || 0,
      quantity: 1,
      image: product.images?.[0] || "",
    });
    toast.success("Added to cart!");
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Post Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm text-white shrink-0"
            style={{ background: `linear-gradient(135deg, hsl(${145 + index * 30} 60% 30%), hsl(${165 + index * 30} 55% 40%))` }}
          >
            {(product.vendorName || "S").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-white/90">{product.vendorName || "Seller"}</p>
            <p className="text-[11px] text-white/40 flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Dhaka, BD · {["2 min", "15 min", "1 hr", "3 hr"][index % 4]} ago
            </p>
          </div>
        </div>
        <button className="text-white/30 hover:text-white/60 transition-colors">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Post Image */}
      {product.images?.[0] && (
        <Link href={`/products/${product.id}`}>
          <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-400 cursor-pointer" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            {/* Price overlay */}
            <div className="absolute bottom-3 left-3">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-lg">৳{product.price?.toLocaleString() || "—"}</span>
                {product.moq && (
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: "rgba(16,185,129,0.8)", color: "white" }}
                  >
                    MOQ {product.moq}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Post Body */}
      <div className="px-4 py-3">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-white/90 mb-1 hover:text-emerald-300 transition-colors cursor-pointer line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-white/50 line-clamp-2 mb-3">
          {product.description || "Premium quality product available for wholesale and retail. Contact seller for bulk pricing."}
        </p>

        {/* Wholesale / Retail Price Tags */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
            style={{ background: "rgba(16,185,129,0.12)", color: "hsl(145 65% 55%)" }}
          >
            <Package className="h-3 w-3" />
            Wholesale: ৳{product.price ? Math.round(product.price * 0.85).toLocaleString() : "—"}
          </div>
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
            style={{ background: "rgba(139,92,246,0.12)", color: "hsl(265 65% 70%)" }}
          >
            <Tag className="h-3 w-3" />
            Retail: ৳{product.price?.toLocaleString() || "—"}
          </div>
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLiked(l => !l)}
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-red-400 transition-colors"
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-red-400 text-red-400" : ""}`} />
              <span>{liked ? likes + 1 : likes}</span>
            </button>
            <button className="flex items-center gap-1.5 text-xs text-white/40 hover:text-blue-400 transition-colors">
              <MessageCircle className="h-4 w-4" />
              <span>{8 + index * 3}</span>
            </button>
            <button className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSaved(s => !s)}
              className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all ${saved ? "bg-purple-500/20 text-purple-400" : "text-white/30 hover:text-white/60 hover:bg-white/6"}`}
            >
              <Bookmark className={`h-3.5 w-3.5 ${saved ? "fill-purple-400" : ""}`} />
            </button>
            <button
              onClick={handleAdd}
              className="h-7 px-3 rounded-lg text-xs font-semibold text-white flex items-center gap-1 transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, hsl(145 65% 30%), hsl(145 60% 40%))" }}
            >
              <ShoppingCart className="h-3 w-3" /> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Vendor Card ──────────────────────────────────────────────── */

function VendorCard({ seller }: { seller: any }) {
  return (
    <Link href={`/vendors/${seller.id}`}>
      <div className="glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
        <div
          className="h-24 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(139,92,246,0.1))" }}
        >
          {seller.image && <img src={seller.image} alt={seller.shopName} className="w-full h-full object-cover opacity-40 group-hover:opacity-55 transition-opacity duration-300" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-2 left-2">
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize"
              style={{ background: "rgba(16,185,129,0.8)", color: "white" }}
            >
              {seller.businessType?.replace("_", " ")}
            </span>
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-sm text-white/90 line-clamp-1 mb-1 group-hover:text-emerald-300 transition-colors">{seller.shopName}</h3>
          <div className="flex items-center gap-1 text-xs text-white/40 mb-2.5">
            <MapPin className="h-3 w-3 text-emerald-500" /> {seller.district || seller.location || "Bangladesh"}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-medium text-white/70">{seller.rating?.toFixed(1) || "4.0"}</span>
            </div>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              style={{ background: "rgba(16,185,129,0.15)", color: "hsl(145 65% 52%)", border: "1px solid rgba(16,185,129,0.25)" }}
            >
              Visit Store
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── Home Page ────────────────────────────────────────────────── */

export default function Home() {
  const [, navigate] = useLocation();
  const { data: productsData, isLoading: productsLoading } = useListProducts({ limit: 8 });
  const { data: feedData, isLoading: feedLoading } = useListProducts({ limit: 6 });
  const { data: sellersData, isLoading: sellersLoading } = useListSellers({ status: "active" });

  const products = productsData?.products || [];
  const feedProducts = feedData?.products || [];
  const sellers = sellersData?.sellers?.slice(0, 4) || [];

  return (
    <Layout>
      {/* Feed / Marketplace Toggle */}
      <div className="sticky z-30" style={{ top: "94px" }}>
        <div
          className="glass border-b px-4"
          style={{ borderColor: "rgba(16,185,129,0.12)" }}
        >
          <div className="container mx-auto">
            <div className="flex items-center h-11 gap-1">
              <div className="flex items-center rounded-full p-0.5" style={{ background: "rgba(255,255,255,0.06)" }}>
                <button
                  onClick={() => navigate("/feed")}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium text-white/40 hover:text-white/70 transition-all"
                >
                  🏠 Feed
                </button>
                <button
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white transition-all"
                  style={{ background: "linear-gradient(135deg, hsl(145 65% 30%), hsl(145 60% 42%))" }}
                >
                  🛍️ Marketplace
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <HeroSlider />

      {/* Stories */}
      <div className="border-b" style={{ borderColor: "rgba(16,185,129,0.08)" }}>
        <StoriesSection />
      </div>

      {/* Promo Banners */}
      <section className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PROMO_BANNERS.map(b => (
            <Link key={b.title} href={b.href}>
              <div
                className={`bg-gradient-to-br ${b.color} rounded-2xl p-5 cursor-pointer hover:scale-[1.02] transition-all border ${b.border} relative overflow-hidden group`}
              >
                <div className="absolute top-3 right-3">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)" }}
                  >
                    {b.badge}
                  </span>
                </div>
                <div className="text-3xl mb-2">{b.emoji}</div>
                <h3 className="font-bold text-base text-white">{b.title}</h3>
                <p className="text-white/60 text-xs mt-0.5">{b.sub}</p>
                <span className="text-xs mt-3 inline-flex items-center gap-1 text-white/70 group-hover:text-white transition-colors">
                  Shop Now <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-8 container mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-emerald-400 inline-block" />
            Shop by Category
          </h2>
          <Link href="/vendors">
            <span className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <Link key={cat.name} href={cat.href}>
                <div className={`glass-card rounded-2xl p-3 flex flex-col items-center gap-2 cursor-pointer hover:-translate-y-1 transition-all duration-200 group`}>
                  <div
                    className={`h-11 w-11 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br ${cat.color} border ${cat.border} group-hover:scale-110 transition-transform`}
                  >
                    {cat.emoji}
                  </div>
                  <span className={`text-xs font-semibold ${cat.text} group-hover:text-white transition-colors`}>{cat.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Seller Feed Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-400" />
              Live Seller Feed
            </h2>
            <Link href="/feed">
              <span className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1">
                View Feed <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </div>

          {feedLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3].map(i => (
                <div key={i} className="glass-card rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-xl bg-white/8" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-3 w-28 bg-white/8" />
                      <Skeleton className="h-3 w-20 bg-white/6" />
                    </div>
                  </div>
                  <Skeleton className="h-40 w-full rounded-xl bg-white/8" />
                  <Skeleton className="h-3 w-3/4 bg-white/8" />
                  <Skeleton className="h-3 w-1/2 bg-white/6" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {feedProducts.slice(0, 6).map((p, i) => (
                <FeedCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              Featured Products
            </h2>
            <Link href="/products">
              <span className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="glass-card rounded-2xl p-3 space-y-2">
                  <Skeleton className="aspect-square w-full rounded-xl bg-white/8" />
                  <Skeleton className="h-3 w-3/4 bg-white/8" />
                  <Skeleton className="h-3 w-1/2 bg-white/6" />
                  <Skeleton className="h-8 w-full rounded-xl bg-white/8" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banners */}
      <section className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="rounded-2xl p-8 text-white flex items-center justify-between overflow-hidden relative border"
            style={{
              background: "linear-gradient(135deg, hsl(145 65% 14%), hsl(145 55% 20%))",
              borderColor: "rgba(16,185,129,0.25)"
            }}
          >
            <div className="absolute right-0 top-0 h-full w-40 opacity-10"
              style={{ background: "radial-gradient(circle, white, transparent)" }} />
            <div>
              <p className="text-white/50 text-xs mb-1 uppercase tracking-wide">For Sellers</p>
              <h3 className="text-xl font-bold mb-1">Start Selling Today</h3>
              <p className="text-white/60 text-sm mb-4">Join 500+ active sellers on PaikarMart</p>
              <Link href="/seller/register">
                <button className="px-4 py-2 rounded-xl text-sm font-semibold bg-white text-emerald-900 hover:bg-white/90 transition-all">
                  Register as Seller
                </button>
              </Link>
            </div>
            <Store className="h-20 w-20 text-emerald-400/15 shrink-0" />
          </div>

          <div
            className="rounded-2xl p-8 text-white flex items-center justify-between overflow-hidden relative border"
            style={{
              background: "linear-gradient(135deg, hsl(265 50% 14%), hsl(265 45% 20%))",
              borderColor: "rgba(139,92,246,0.25)"
            }}
          >
            <div>
              <p className="text-white/50 text-xs mb-1 uppercase tracking-wide">Wholesale Hub</p>
              <h3 className="text-xl font-bold mb-1">B2B Marketplace</h3>
              <p className="text-white/60 text-sm mb-4">Bulk deals for business buyers</p>
              <Link href="/vendors?type=wholesale">
                <button
                  className="px-4 py-2 rounded-xl text-sm font-semibold border transition-all hover:bg-white/10"
                  style={{ borderColor: "rgba(139,92,246,0.5)", color: "hsl(265 65% 75%)" }}
                >
                  Explore Wholesale
                </button>
              </Link>
            </div>
            <Package className="h-20 w-20 text-purple-400/15 shrink-0" />
          </div>
        </div>
      </section>

      {/* Featured Vendors */}
      {sellers.length > 0 && (
        <section className="py-8 px-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="h-5 w-1 rounded-full bg-purple-400 inline-block" />
                Featured Vendors
              </h2>
              <Link href="/vendors">
                <span className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1">
                  View All <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            </div>
            {sellersLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1,2,3,4].map(i => <Skeleton key={i} className="h-40 rounded-2xl bg-white/8" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sellers.map(s => <VendorCard key={s.id} seller={s} />)}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Trust Features */}
      <section className="py-12 container mx-auto px-4">
        <h2 className="text-lg font-bold text-center mb-8 text-white">
          Why Choose <span className="text-gradient-brand">PaikarMart</span>?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TRUST_FEATURES.map(f => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="glass-card rounded-2xl p-5 flex flex-col items-center text-center">
                <div className={`h-12 w-12 rounded-xl ${f.bg} flex items-center justify-center mb-3`}>
                  <Icon className={`h-6 w-6 ${f.color}`} />
                </div>
                <h3 className="font-bold text-sm text-white/90 mb-1">{f.title}</h3>
                <p className="text-xs text-white/40">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </Layout>
  );
}
