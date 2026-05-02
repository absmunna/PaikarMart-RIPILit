import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { useListProducts } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GlassCard } from "@/components/ui/GlassCard";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/context/WishlistContext";
import { useUserLocation } from "@/context/LocationContext";
import { formatBDT } from "@/lib/format";
import { toast } from "sonner";
import type { Product } from "@workspace/api-zod/src/generated/types";
import {
  Store, Tag, Package, Star, ShoppingCart, Zap,
  ChevronLeft, ChevronRight, ShieldCheck, CreditCard,
  Truck, Award, MapPin, Heart, MessageCircle, Share2,
  Bookmark, ArrowRight, Sparkles, SlidersHorizontal,
  TrendingUp, Filter, ChevronDown, BadgeCheck,
} from "lucide-react";

/* ─── Static Data ──────────────────────────────────────────────── */

const HERO_SLIDES = [
  {
    id: 1,
    gradient: "from-emerald-900 via-teal-900 to-[hsl(160_28%_5%)]",
    glowColor: "rgba(16,185,129,0.3)",
    eyebrow: "Welcome to PaikarMart",
    headline: "Bangladesh's Premium Marketplace",
    sub: "Connect with wholesalers, brands, and local shops. Best prices, reliable delivery.",
    cta1: { label: "Start Shopping", href: "/products" },
    cta2: { label: "Become a Seller", href: "/seller/register" },
    badge: "🚀 10,000+ Products Listed",
    img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
  },
  {
    id: 2,
    gradient: "from-violet-900 via-purple-900 to-[hsl(160_28%_5%)]",
    glowColor: "rgba(139,92,246,0.3)",
    eyebrow: "Wholesale Marketplace",
    headline: "Buy in Bulk, Save More",
    sub: "Access thousands of wholesale suppliers. MOQ as low as 10 units.",
    cta1: { label: "Browse Wholesale", href: "/vendors?type=wholesale" },
    cta2: { label: "Register as Seller", href: "/seller/register" },
    badge: "💰 Up to 60% Wholesale Savings",
    img: "https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?w=600&q=80",
  },
  {
    id: 3,
    gradient: "from-slate-900 via-emerald-950 to-[hsl(160_28%_5%)]",
    glowColor: "rgba(20,184,166,0.3)",
    eyebrow: "Digital & Services",
    headline: "Software, Services & Digital",
    sub: "Professional services, digital downloads, and software licenses — all in one place.",
    cta1: { label: "Explore Services", href: "/vendors?type=service" },
    cta2: { label: "List Your Service", href: "/seller/register" },
    badge: "⚡ Instant Digital Delivery",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
  },
];

const CATEGORIES_NAV = [
  { name: "Electronics", emoji: "📱", href: "/products?category=Electronics", color: "from-blue-500/20 to-blue-600/5", border: "border-blue-500/20", text: "text-blue-400" },
  { name: "Fashion", emoji: "👗", href: "/products?category=Fashion", color: "from-purple-500/20 to-purple-600/5", border: "border-purple-500/20", text: "text-purple-400" },
  { name: "Grocery", emoji: "🛒", href: "/products?category=Grocery", color: "from-green-500/20 to-green-600/5", border: "border-green-500/20", text: "text-green-400" },
  { name: "Home", emoji: "🏡", href: "/products?category=Home", color: "from-orange-500/20 to-orange-600/5", border: "border-orange-500/20", text: "text-orange-400" },
  { name: "Services", emoji: "🔧", href: "/products?category=Services", color: "from-pink-500/20 to-pink-600/5", border: "border-pink-500/20", text: "text-pink-400" },
  { name: "Wholesale", emoji: "📦", href: "/vendors?type=wholesale", color: "from-teal-500/20 to-teal-600/5", border: "border-teal-500/20", text: "text-teal-400" },
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

const TRUST_FEATURES = [
  { icon: ShieldCheck, title: "Verified Sellers", desc: "Every seller KYC verified.", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { icon: CreditCard, title: "Secure Payments", desc: "bKash, Nagad, Card & COD.", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  { icon: Truck, title: "Fast Delivery", desc: "Across all of Bangladesh.", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
  { icon: Award, title: "Quality Assured", desc: "Products meet our standards.", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
];

/* ─── Mock feed posts (no feed API yet) ────────────────────────── */

const FEED_POSTS = [
  { id: "f1", shopName: "TechZone BD", shopVerified: true, shopEmoji: "📱", timeAgo: "2m", tag: "Wholesale", tagColor: "bg-orange-500/90", productName: "Samsung 65W Super Fast Charger – USB-C", price: 1250, compareAt: 1800, image: "https://images.unsplash.com/photo-1604671368394-2240d0b1bb6c?w=600&q=80", rating: 4.8, sold: 312, location: "Mirpur, Dhaka", likes: 148, comments: 23, distance: "1.2 km" },
  { id: "f2", shopName: "Fashion Hub", shopVerified: true, shopEmoji: "👗", timeAgo: "15m", tag: "Retail", tagColor: "bg-blue-500/90", productName: "Premium Linen Kurta Set — Navy Blue (M–XXL)", price: 890, compareAt: 1400, image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80", rating: 4.6, sold: 87, location: "Gulshan, Dhaka", likes: 89, comments: 11, distance: "3.4 km" },
  { id: "f3", shopName: "HomeDeco BD", shopVerified: false, shopEmoji: "🏡", timeAgo: "42m", tag: "Retail", tagColor: "bg-blue-500/90", productName: "Handwoven Cotton Throw Blanket – Artisan Made", price: 2100, compareAt: 2900, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80", rating: 4.9, sold: 56, location: "Dhanmondi, Dhaka", likes: 213, comments: 34, distance: "5.1 km" },
  { id: "f4", shopName: "Grocery King", shopVerified: true, shopEmoji: "🛒", timeAgo: "1h", tag: "Service", tagColor: "bg-purple-500/90", productName: "Organic Basmati Rice 5kg – Farm Direct", price: 650, compareAt: 850, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80", rating: 4.7, sold: 1243, location: "Uttara, Dhaka", likes: 67, comments: 8, distance: "2.7 km" },
  { id: "f5", shopName: "SportsGear BD", shopVerified: true, shopEmoji: "⚽", timeAgo: "2h", tag: "Wholesale", tagColor: "bg-orange-500/90", productName: "Professional Football – FIFA Quality Pro", price: 3500, compareAt: 4800, image: "https://images.unsplash.com/photo-1614632537239-e2258e9dd771?w=600&q=80", rating: 4.5, sold: 29, location: "Banani, Dhaka", likes: 44, comments: 6, distance: "4.8 km" },
  { id: "f6", shopName: "BeautyShop BD", shopVerified: true, shopEmoji: "💄", timeAgo: "3h", tag: "Retail", tagColor: "bg-blue-500/90", productName: "Korean Skin Care Bundle – 5 Step Routine", price: 1890, compareAt: 2800, image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80", rating: 4.9, sold: 445, location: "Tejgaon, Dhaka", likes: 302, comments: 51, distance: "6.2 km" },
];

const SORT_OPTIONS = [
  { value: "", label: "Recommended" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

const FILTER_CATEGORIES = ["All", "Electronics", "Fashion", "Grocery", "Home", "Services"];

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
    <section className={`relative bg-gradient-to-br ${slide.gradient} text-white overflow-hidden transition-all duration-700`}>
      <div className="absolute inset-0 transition-all duration-700"
        style={{ background: `radial-gradient(ellipse 70% 60% at 80% 50%, ${slide.glowColor}, transparent)` }} />
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg,white 0,white 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,white 0,white 1px,transparent 1px,transparent 40px)" }} />

      <div className="container mx-auto px-4 py-6 sm:py-10 lg:py-16 flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-8 relative z-10">
        <div className="flex-1 text-center lg:text-left w-full">
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-white text-[10px] sm:text-xs font-semibold px-3 py-1 rounded-full mb-2.5 border border-white/20">
            <Sparkles className="h-2.5 w-2.5" /> {slide.badge}
          </div>
          <p className="text-white/60 font-medium text-[10px] sm:text-xs mb-1 uppercase tracking-widest">{slide.eyebrow}</p>
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold mb-2 sm:mb-3 leading-tight">{slide.headline}</h1>
          <p className="text-white/70 text-xs sm:text-sm lg:text-base mb-4 sm:mb-6 max-w-md mx-auto lg:mx-0 line-clamp-2 sm:line-clamp-none">{slide.sub}</p>
          <div className="flex flex-row items-center justify-center lg:justify-start gap-2 sm:gap-3">
            <button onClick={() => navigate(slide.cta1.href)}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white text-gray-900 hover:bg-white/90 transition-all shadow-lg">
              {slide.cta1.label} <ArrowRight className="h-3.5 w-3.5 inline ml-1" />
            </button>
            <button onClick={() => navigate(slide.cta2.href)}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-white/12 border border-white/25 hover:bg-white/20 text-white backdrop-blur-sm transition-all">
              {slide.cta2.label}
            </button>
          </div>
        </div>
        <div className="hidden lg:block w-72 h-56 rounded-2xl overflow-hidden shadow-2xl border border-white/15 shrink-0">
          <img src={slide.img} alt={slide.headline} className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 pb-3 relative z-20">
        <button onClick={() => setCurrent(c => (c - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          className="h-6 w-6 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center border border-white/20 transition-all">
          <ChevronLeft className="h-3 w-3 text-white" />
        </button>
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? "w-6 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40"}`} />
        ))}
        <button onClick={() => setCurrent(c => (c + 1) % HERO_SLIDES.length)}
          className="h-6 w-6 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center border border-white/20 transition-all">
          <ChevronRight className="h-3 w-3 text-white" />
        </button>
      </div>
    </section>
  );
}

/* ─── Stories Row ──────────────────────────────────────────────── */

function StoriesRow() {
  const [viewed, setViewed] = useState<Set<string>>(new Set());
  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2 px-4">
      {/* Add Story */}
      <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer">
        <div className="h-14 w-14 rounded-2xl flex items-center justify-center border-2 border-dashed border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-400/60 transition-colors">
          <span className="text-xl">+</span>
        </div>
        <span className="text-[10px] text-white/40 font-medium w-14 text-center">Your Story</span>
      </div>
      {STORY_SELLERS.map(seller => {
        const seen = viewed.has(seller.id);
        return (
          <div key={seller.id} onClick={() => setViewed(v => new Set([...v, seller.id]))}
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
            <div className={`p-[2px] rounded-2xl bg-gradient-to-br ${seller.ring} transition-opacity ${seen ? "opacity-40" : ""}`}>
              <div className="h-12 w-12 rounded-[14px] flex items-center justify-center text-2xl"
                style={{ background: "hsl(160 28% 7%)" }}>
                {seller.emoji}
              </div>
            </div>
            <span className="text-[10px] text-white/60 group-hover:text-white/90 font-medium w-14 text-center truncate transition-colors">{seller.name}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Category Quick-Nav ───────────────────────────────────────── */

function CategoryNav() {
  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2 px-4">
      {CATEGORIES_NAV.map(cat => (
        <Link key={cat.name} href={cat.href}>
          <div className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-2xl border bg-gradient-to-br ${cat.color} ${cat.border} hover:opacity-90 transition-all cursor-pointer`}>
            <span className="text-base">{cat.emoji}</span>
            <span className={`text-xs font-semibold whitespace-nowrap ${cat.text}`}>{cat.name}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ─── Unified Product Card (1:1) ───────────────────────────────── */

interface UnifiedCardProps {
  id: string;
  image: string;
  tag: string;
  tagColor: string;
  name: string;
  shopName: string;
  shopVerified: boolean;
  price: number;
  compareAt?: number;
  rating: number;
  sold: number;
  distance?: string;
  inStock?: boolean;
  moq?: number;
  priceOnInquiry?: boolean;
  onAddToCart?: (e: React.MouseEvent) => void;
  href?: string;
}

function ProductCardUnified({
  id, image, tag, tagColor, name, shopName, shopVerified,
  price, compareAt, rating, sold, distance, inStock = true,
  moq, priceOnInquiry, onAddToCart, href,
}: UnifiedCardProps) {
  const { has, toggle } = useWishlist();
  const isWishlisted = has(id);

  const discount = compareAt && compareAt > price
    ? Math.round(((compareAt - price) / compareAt) * 100)
    : null;

  const card = (
    <div className="glass-card rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 h-full flex flex-col">
      {/* ── 1:1 Image ── */}
      <div className="relative overflow-hidden bg-white/5" style={{ aspectRatio: "1/1" }}>
        {image ? (
          <img src={image} alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20">
            <Package className="h-10 w-10" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70" />

        {/* Top-left: badge */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md text-white ${tagColor}`}>{tag}</span>
          {discount !== null && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-red-500 text-white">-{discount}%</span>
          )}
        </div>

        {/* Top-right: wishlist heart */}
        <button
          onClick={e => {
            e.preventDefault(); e.stopPropagation();
            toggle({ productId: id, title: name, price, imageUrl: image });
            toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist ❤️");
          }}
          className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20 transition-all hover:scale-110">
          <Heart className={`h-3.5 w-3.5 transition-colors ${isWishlisted ? "fill-rose-400 text-rose-400" : "text-white/70"}`} />
        </button>

        {/* Bottom-right: distance */}
        {distance && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-full border border-white/10">
            <MapPin className="h-2.5 w-2.5 text-emerald-400" />
            <span className="text-[9px] text-white/80 font-medium">{distance}</span>
          </div>
        )}

        {/* Out of stock overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-xs font-semibold text-white/80 border border-white/30 px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="p-3 flex flex-col flex-1 gap-1.5">
        {/* Shop name + verified */}
        <div className="flex items-center gap-1">
          <Store className="h-3 w-3 text-white/30 shrink-0" />
          <span className="text-[10px] text-white/50 truncate flex-1">{shopName}</span>
          {shopVerified && <BadgeCheck className="h-3 w-3 text-emerald-400 shrink-0" />}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-sm text-white/90 line-clamp-2 leading-snug group-hover:text-emerald-300 transition-colors flex-1">
          {name}
        </h3>

        {/* Stars + sold */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} className={`h-2.5 w-2.5 ${s <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-white/15"}`} />
            ))}
          </div>
          <span className="text-[10px] text-white/40">{rating.toFixed(1)}</span>
          <span className="text-[10px] text-white/30">·</span>
          <span className="text-[10px] text-white/40">{sold >= 1000 ? `${(sold / 1000).toFixed(1)}k` : sold} sold</span>
        </div>

        {/* Price */}
        <div>
          {priceOnInquiry ? (
            <span className="text-sm font-bold text-orange-400">Price on Request</span>
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-base text-emerald-400">{formatBDT(price)}</span>
              {compareAt && compareAt > price && (
                <span className="text-[11px] text-white/30 line-through">{formatBDT(compareAt)}</span>
              )}
            </div>
          )}
          {moq && moq > 1 && (
            <p className="text-[10px] text-orange-400 mt-0.5">MOQ: {moq} units</p>
          )}
        </div>

        {/* Add to cart */}
        {onAddToCart && (
          <button
            onClick={onAddToCart}
            disabled={!inStock}
            className="mt-auto w-full py-1.5 rounded-lg text-xs font-semibold bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5">
            <ShoppingCart className="h-3 w-3" />
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );

  return href ? <Link href={href}>{card}</Link> : card;
}

/* ─── Social Feed Post ─────────────────────────────────────────── */

type FeedPost = typeof FEED_POSTS[0];

function FeedPost({ post }: { post: FeedPost }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const { has, toggle } = useWishlist();
  const { addToCart } = useCart();
  const isWishlisted = has(post.id);

  const handleLike = () => {
    setLiked(l => {
      setLikeCount(c => l ? c - 1 : c + 1);
      return !l;
    });
  };

  const discount = post.compareAt > post.price
    ? Math.round(((post.compareAt - post.price) / post.compareAt) * 100)
    : null;

  return (
    <GlassCard className="overflow-hidden">
      {/* Post header */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-xl shrink-0">
          {post.shopEmoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-white truncate">{post.shopName}</span>
            {post.shopVerified && <BadgeCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />}
          </div>
          <div className="flex items-center gap-2 text-[10px] text-white/40">
            <MapPin className="h-2.5 w-2.5 text-white/30" />
            <span>{post.location}</span>
            <span>·</span>
            <span>{post.timeAgo} ago</span>
          </div>
        </div>
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full text-white ${post.tagColor}`}>{post.tag}</span>
      </div>

      {/* Product image 1:1 */}
      <div className="relative" style={{ aspectRatio: "1/1" }}>
        <img src={post.image} alt={post.productName} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Discount badge */}
        {discount && (
          <div className="absolute top-3 left-3">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-red-500 text-white">-{discount}% OFF</span>
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={() => {
            toggle({ productId: post.id, title: post.productName, price: post.price, imageUrl: post.image });
            toast(isWishlisted ? "Removed from wishlist" : "Saved to wishlist ❤️");
          }}
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20 transition-all hover:scale-110">
          <Heart className={`h-4 w-4 transition-colors ${isWishlisted ? "fill-rose-400 text-rose-400" : "text-white/80"}`} />
        </button>

        {/* Distance badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full border border-white/10">
          <MapPin className="h-3 w-3 text-emerald-400" />
          <span className="text-[10px] text-white/80 font-medium">{post.distance}</span>
        </div>

        {/* Product info overlay */}
        <div className="absolute bottom-3 left-3 right-14">
          <p className="text-white font-semibold text-sm line-clamp-1 drop-shadow">{post.productName}</p>
        </div>
      </div>

      {/* Price + CTA */}
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-emerald-400">{formatBDT(post.price)}</span>
            {post.compareAt > post.price && (
              <span className="text-xs text-white/35 line-through">{formatBDT(post.compareAt)}</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className={`h-2.5 w-2.5 ${s <= Math.round(post.rating) ? "text-yellow-400 fill-yellow-400" : "text-white/15"}`} />
              ))}
            </div>
            <span className="text-[10px] text-white/40">{post.rating} · {post.sold} sold</span>
          </div>
        </div>
        <button
          onClick={() => {
            addToCart({ productId: post.id, productName: post.productName, vendorId: post.id, vendorName: post.shopName, price: post.price, quantity: 1, image: post.image });
            toast.success("Added to cart!");
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shrink-0">
          <Zap className="h-3.5 w-3.5" /> Buy Now
        </button>
      </div>

      {/* Social actions */}
      <div className="px-4 pb-4 flex items-center gap-1 border-t border-white/5 pt-3">
        <button onClick={handleLike}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${liked ? "text-rose-400 bg-rose-500/10" : "text-white/50 hover:text-white/80 hover:bg-white/5"}`}>
          <Heart className={`h-3.5 w-3.5 ${liked ? "fill-rose-400" : ""}`} /> {likeCount}
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-white/50 hover:text-white/80 hover:bg-white/5 transition-all">
          <MessageCircle className="h-3.5 w-3.5" /> {post.comments}
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-white/50 hover:text-white/80 hover:bg-white/5 transition-all">
          <Share2 className="h-3.5 w-3.5" /> Share
        </button>
        <button onClick={() => setSaved(s => !s)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ml-auto ${saved ? "text-emerald-400 bg-emerald-500/10" : "text-white/50 hover:text-white/80 hover:bg-white/5"}`}>
          <Bookmark className={`h-3.5 w-3.5 ${saved ? "fill-emerald-400" : ""}`} />
        </button>
      </div>
    </GlassCard>
  );
}

/* ─── Social Feed Tab ──────────────────────────────────────────── */

function SocialFeedTab() {
  return (
    <div className="flex flex-col gap-4 max-w-xl mx-auto">
      {FEED_POSTS.map(post => (
        <FeedPost key={post.id} post={post} />
      ))}
      {/* Infinite scroll sentinel placeholder */}
      <div className="text-center py-6">
        <span className="text-xs text-white/30 px-4 py-2 rounded-full border border-white/10">Loading more...</span>
      </div>
    </div>
  );
}

/* ─── Marketplace Tab ──────────────────────────────────────────── */

function MarketplaceTab() {
  const { addToCart } = useCart();
  const { location } = useUserLocation();
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useListProducts(
    category !== "All" ? { category } : {},
  );
  const products = data?.products ?? [];

  const sorted = [...products].sort((a, b) => {
    if (sort === "price_asc") return (a.price ?? 0) - (b.price ?? 0);
    if (sort === "price_desc") return (b.price ?? 0) - (a.price ?? 0);
    if (sort === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
    return 0;
  });

  const handleAddToCart = useCallback((p: Product) => (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    addToCart({ productId: p.id, productName: p.name, vendorId: p.vendorId, vendorName: p.vendorName, price: p.price ?? 0, quantity: 1, image: p.images?.[0] ?? "" });
    toast.success("Added to cart!");
  }, [addToCart]);

  const typeLabel = (t?: string) => {
    if (t === "service") return "Service";
    if (t === "digital") return "Digital";
    return "Retail";
  };
  const typeColor = (t?: string) => {
    if (t === "service") return "bg-purple-500/90";
    if (t === "digital") return "bg-blue-500/90";
    return "bg-blue-500/90";
  };

  return (
    <div>
      {/* Filter bar */}
      <div className="sticky top-[72px] z-30 glass-card border-b border-white/5 px-4 py-3">
        <div className="flex items-center gap-2">
          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1">
            {FILTER_CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  category === cat
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                    : "bg-white/5 text-white/60 border-white/10 hover:border-white/20 hover:text-white/80"
                }`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Sort + filter */}
          <div className="flex gap-2 shrink-0">
            <div className="relative">
              <select value={sort} onChange={e => setSort(e.target.value)}
                className="appearance-none bg-white/5 border border-white/10 text-white/70 text-xs rounded-xl px-3 py-1.5 pr-6 cursor-pointer hover:border-white/20 focus:outline-none focus:border-primary/50 transition-all">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-[#0d1f1a] text-white">{o.label}</option>)}
              </select>
              <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white/40 pointer-events-none" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`h-7 w-7 rounded-xl border flex items-center justify-center transition-all ${showFilters ? "bg-primary/20 border-primary/40 text-primary" : "bg-white/5 border-white/10 text-white/50 hover:text-white/80"}`}>
              <SlidersHorizontal className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Location nearby info */}
        {location.source !== "none" && (
          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-white/40">
            <MapPin className="h-3 w-3 text-emerald-400" />
            <span>Showing products near <span className="text-emerald-400">{location.city ?? "your location"}</span></span>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="px-4 pt-4">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <div className="p-3 space-y-2">
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="py-16 text-center">
            <Package className="h-12 w-12 text-white/15 mx-auto mb-3" />
            <p className="text-white/40 text-sm">No products found in this category.</p>
            <button onClick={() => setCategory("All")} className="mt-3 text-xs text-primary hover:underline">Show all</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {sorted.map(p => (
              <ProductCardUnified
                key={p.id}
                id={p.id}
                image={p.images?.[0] ?? ""}
                tag={p.moq && p.moq > 1 ? "Wholesale" : typeLabel(p.type)}
                tagColor={p.moq && p.moq > 1 ? "bg-orange-500/90" : typeColor(p.type)}
                name={p.name}
                shopName={p.vendorName}
                shopVerified={true}
                price={p.price ?? 0}
                compareAt={p.price ? Math.round(p.price * 1.2) : undefined}
                rating={p.rating ?? 4.5}
                sold={p.reviewCount ? p.reviewCount * 3 : 12}
                distance={p.location ? `${Math.round(Math.random() * 8 + 1) * 0.5} km` : undefined}
                inStock={p.inStock}
                moq={p.moq}
                priceOnInquiry={p.priceOnInquiry}
                onAddToCart={handleAddToCart(p)}
                href={`/products/${p.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Dual Feed Tabs ───────────────────────────────────────────── */

type TabKey = "feed" | "market";

function DualFeedSection() {
  const [tab, setTab] = useState<TabKey>("feed");

  return (
    <div>
      {/* Sticky tab bar */}
      <div className="sticky top-[56px] z-30 glass-card border-b border-white/5 px-4">
        <div className="flex gap-1 py-2">
          <TabButton active={tab === "feed"} onClick={() => setTab("feed")} icon="🏠" label="Social Feed" />
          <TabButton active={tab === "market"} onClick={() => setTab("market")} icon="🛍️" label="Marketplace" />
        </div>
      </div>

      <div className="py-4">
        {tab === "feed" ? (
          <div className="px-4">
            <SocialFeedTab />
          </div>
        ) : (
          <MarketplaceTab />
        )}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: string; label: string }) {
  return (
    <button onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
        active
          ? "bg-primary text-white shadow-lg shadow-primary/20"
          : "text-white/50 hover:text-white/80 hover:bg-white/5"
      }`}>
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

/* ─── Trust Section ────────────────────────────────────────────── */

function TrustSection() {
  return (
    <section className="px-4 py-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {TRUST_FEATURES.map(f => (
          <GlassCard key={f.title} className={`p-4 flex flex-col gap-2 border ${f.bg}`}>
            <f.icon className={`h-5 w-5 ${f.color}`} />
            <div className="font-semibold text-sm text-white">{f.title}</div>
            <div className="text-xs text-white/50">{f.desc}</div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

/* ─── Main Page ────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <Layout>
      {/* Hero */}
      <HeroSlider />

      {/* Stories + Category nav */}
      <div className="py-3 border-b border-white/5 space-y-1">
        <StoriesRow />
        <CategoryNav />
      </div>

      {/* Dual Feed Tabs (main content) */}
      <DualFeedSection />

      {/* Trust badges */}
      <div className="border-t border-white/5">
        <TrustSection />
      </div>
    </Layout>
  );
}
