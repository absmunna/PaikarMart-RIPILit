import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { useListProducts } from "@workspace/api-client-react";
import { BottomNav } from "@/components/layout/BottomNav";
import { GlassCard } from "@/components/ui/GlassCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/context/WishlistContext";
import { useUserLocation } from "@/context/LocationContext";
import { useAuth } from "@/hooks/use-auth";
import { formatBDT } from "@/lib/format";
import { toast } from "sonner";
import type { Product } from "@workspace/api-zod/src/generated/types";
import {
  Menu, Search, MapPin, ShoppingCart, X, ChevronRight,
  Home, Package, Store, Tag, TrendingUp, HeadphonesIcon,
  Building2, ShoppingBag, HelpCircle, Star, Heart,
  MessageCircle, Share2, Bookmark, Zap, BadgeCheck,
  Sun, Moon, Globe, ChevronLeft, ChevronDown, Plus,
  ShieldCheck, CreditCard, Truck, Award, Sparkles, ArrowRight,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   STATIC DATA
═══════════════════════════════════════════════════════════════ */

const HERO_SLIDES = [
  {
    id: 1,
    gradient: "from-emerald-900 via-teal-900 to-[hsl(160_28%_5%)]",
    glow: "rgba(16,185,129,0.28)",
    eyebrow: "Welcome to PaikarMart",
    headline: "Bangladesh's Premium Marketplace",
    sub: "Connect with wholesalers, brands & local shops.",
    cta1: { label: "Start Shopping", href: "/products" },
    cta2: { label: "Become a Seller", href: "/seller/register" },
    badge: "🚀 10,000+ Products Listed",
    img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
  },
  {
    id: 2,
    gradient: "from-violet-900 via-purple-900 to-[hsl(160_28%_5%)]",
    glow: "rgba(139,92,246,0.28)",
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
    glow: "rgba(20,184,166,0.28)",
    eyebrow: "Digital & Services",
    headline: "Software, Services & Digital",
    sub: "Professional services, digital downloads — all in one place.",
    cta1: { label: "Explore Services", href: "/vendors?type=service" },
    cta2: { label: "List Your Service", href: "/seller/register" },
    badge: "⚡ Instant Digital Delivery",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
  },
];

const STORIES = [
  { id: "s1", name: "TechZone", emoji: "📱", ring: "from-emerald-400 to-teal-500" },
  { id: "s2", name: "Fashion", emoji: "👗", ring: "from-purple-400 to-pink-500" },
  { id: "s3", name: "Grocery", emoji: "🛒", ring: "from-orange-400 to-red-500" },
  { id: "s4", name: "HomeDeco", emoji: "🏡", ring: "from-blue-400 to-cyan-500" },
  { id: "s5", name: "Sports", emoji: "⚽", ring: "from-green-400 to-emerald-500" },
  { id: "s6", name: "Beauty", emoji: "💄", ring: "from-pink-400 to-rose-500" },
  { id: "s7", name: "Books", emoji: "📚", ring: "from-yellow-400 to-amber-500" },
];

const CATEGORIES = [
  { name: "Electronics", emoji: "📱", href: "/products?category=Electronics", color: "from-blue-500/20 to-blue-600/5", border: "border-blue-500/20", text: "text-blue-400" },
  { name: "Fashion", emoji: "👗", href: "/products?category=Fashion", color: "from-purple-500/20 to-purple-600/5", border: "border-purple-500/20", text: "text-purple-400" },
  { name: "Grocery", emoji: "🛒", href: "/products?category=Grocery", color: "from-green-500/20 to-green-600/5", border: "border-green-500/20", text: "text-green-400" },
  { name: "Home", emoji: "🏡", href: "/products?category=Home", color: "from-orange-500/20 to-orange-600/5", border: "border-orange-500/20", text: "text-orange-400" },
  { name: "Services", emoji: "🔧", href: "/products?category=Services", color: "from-pink-500/20 to-pink-600/5", border: "border-pink-500/20", text: "text-pink-400" },
  { name: "Wholesale", emoji: "📦", href: "/vendors?type=wholesale", color: "from-teal-500/20 to-teal-600/5", border: "border-teal-500/20", text: "text-teal-400" },
];

const SIDEBAR_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/products", label: "All Products", icon: ShoppingBag },
  { href: "/vendors", label: "All Vendors", icon: Store },
  { href: "/vendors?type=wholesale", label: "Wholesale Hub", icon: Package },
  { href: "/vendors?type=retail", label: "Retail Shops", icon: Tag },
  { href: "/vendors?type=brand_seller", label: "Brand Shops", icon: Building2 },
  { href: "/vendors?type=dropship", label: "Dropship", icon: TrendingUp },
  { href: "/vendors?type=service", label: "Services", icon: HeadphonesIcon },
  { href: "/orders", label: "My Orders", icon: Package },
  { href: "/faq", label: "Help & FAQ", icon: HelpCircle },
];

const FEED_POSTS = [
  { id: "f1", shopName: "TechZone BD", shopVerified: true, shopEmoji: "📱", timeAgo: "2m", tag: "Wholesale", tagColor: "bg-orange-500", productName: "Samsung 65W USB-C Super Fast Charger", price: 1250, compareAt: 1800, image: "https://images.unsplash.com/photo-1604671368394-2240d0b1bb6c?w=600&q=80", rating: 4.8, sold: 312, location: "Mirpur, Dhaka", likes: 148, comments: 23, distance: "1.2 km" },
  { id: "f2", shopName: "Fashion Hub", shopVerified: true, shopEmoji: "👗", timeAgo: "15m", tag: "Retail", tagColor: "bg-blue-500", productName: "Premium Linen Kurta Set — Navy Blue", price: 890, compareAt: 1400, image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80", rating: 4.6, sold: 87, location: "Gulshan, Dhaka", likes: 89, comments: 11, distance: "3.4 km" },
  { id: "f3", shopName: "HomeDeco BD", shopVerified: false, shopEmoji: "🏡", timeAgo: "42m", tag: "Retail", tagColor: "bg-blue-500", productName: "Handwoven Cotton Throw Blanket – Artisan", price: 2100, compareAt: 2900, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80", rating: 4.9, sold: 56, location: "Dhanmondi, Dhaka", likes: 213, comments: 34, distance: "5.1 km" },
  { id: "f4", shopName: "Grocery King", shopVerified: true, shopEmoji: "🛒", timeAgo: "1h", tag: "Service", tagColor: "bg-purple-500", productName: "Organic Basmati Rice 5kg – Farm Direct", price: 650, compareAt: 850, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80", rating: 4.7, sold: 1243, location: "Uttara, Dhaka", likes: 67, comments: 8, distance: "2.7 km" },
  { id: "f5", shopName: "BeautyShop BD", shopVerified: true, shopEmoji: "💄", timeAgo: "3h", tag: "Retail", tagColor: "bg-blue-500", productName: "Korean Skin Care Bundle – 5 Step Routine", price: 1890, compareAt: 2800, image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80", rating: 4.9, sold: 445, location: "Tejgaon, Dhaka", likes: 302, comments: 51, distance: "6.2 km" },
];

const DISTRICTS = [
  "Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna",
  "Barisal", "Rangpur", "Mymensingh", "Comilla", "Gazipur",
];

/* ═══════════════════════════════════════════════════════════════
   COMPACT HEADER
═══════════════════════════════════════════════════════════════ */

function CompactHeader({
  onMenuOpen,
  lang,
  onLangToggle,
  darkMode,
  onDarkToggle,
}: {
  onMenuOpen: () => void;
  lang: "EN" | "বাং";
  onLangToggle: () => void;
  darkMode: boolean;
  onDarkToggle: () => void;
}) {
  const { totalItems } = useCart();
  const { location: userLoc } = useUserLocation();
  const [, navigate] = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLocPicker, setShowLocPicker] = useState(false);
  const [locInput, setLocInput] = useState(() => localStorage.getItem("pm_district") || "");
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* auto-close search after 4 s of empty input */
  useEffect(() => {
    if (searchOpen && !searchQuery) {
      searchTimerRef.current = setTimeout(() => setSearchOpen(false), 4000);
    }
    return () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current); };
  }, [searchOpen, searchQuery]);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const saveLocation = (district: string) => {
    localStorage.setItem("pm_district", district);
    setLocInput(district);
    setShowLocPicker(false);
    toast.success(`Location set to ${district}`);
  };

  const locLabel = locInput || userLoc.city || "Location";

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* ── Main bar ── */}
      <div
        className="flex items-center h-[52px] px-3 gap-2"
        style={{
          background: "rgba(6,18,14,0.92)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(16,185,129,0.1)",
        }}
      >
        {/* Hamburger */}
        <button
          onClick={onMenuOpen}
          className="h-8 w-8 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/8 transition-all shrink-0"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Logo — center */}
        <div className="flex-1 flex justify-center">
          <Link href="/">
            <span className="font-extrabold text-lg tracking-tight cursor-pointer select-none">
              <span className="text-gradient-green">Paikar</span>
              <span className="text-gradient-purple">Mart</span>
            </span>
          </Link>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Location */}
          <button
            onClick={() => setShowLocPicker(v => !v)}
            className="h-8 px-2 rounded-xl flex items-center gap-1 text-white/50 hover:text-emerald-400 hover:bg-white/5 transition-all"
          >
            <MapPin className="h-4 w-4" />
            <span className="text-[10px] max-w-[56px] truncate hidden sm:inline">{locLabel}</span>
          </button>

          {/* Search */}
          <button
            onClick={() => setSearchOpen(v => !v)}
            className="h-8 w-8 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/8 transition-all"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Cart */}
          <Link href="/cart">
            <button className="relative h-8 w-8 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/8 transition-all">
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
          </Link>
        </div>
      </div>

      {/* ── Slide-down search bar ── */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: searchOpen ? "60px" : "0px",
          background: "rgba(6,18,14,0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: searchOpen ? "1px solid rgba(16,185,129,0.1)" : "none",
        }}
      >
        <form onSubmit={handleSearch} className="flex items-center gap-2 px-3 py-2">
          <Search className="h-4 w-4 text-white/30 shrink-0" />
          <input
            ref={inputRef}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search products, sellers, brands..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
          />
          {searchQuery ? (
            <button type="submit" className="text-[10px] font-semibold text-emerald-400 px-2">
              Go
            </button>
          ) : (
            <button type="button" onClick={() => setSearchOpen(false)} className="text-white/30 hover:text-white/60 transition-colors">
              <X className="h-4 w-4" />
            </button>
          )}
        </form>
      </div>

      {/* ── Location picker dropdown ── */}
      {showLocPicker && (
        <div
          className="absolute top-full left-0 right-0 z-50 mx-3 mt-1 rounded-2xl shadow-2xl overflow-hidden"
          style={{ background: "rgba(8,22,16,0.98)", border: "1px solid rgba(16,185,129,0.15)" }}
        >
          <div className="p-3 border-b border-white/5">
            <p className="text-xs text-white/40 font-medium">Select District</p>
          </div>
          <div className="grid grid-cols-2 gap-1 p-2 max-h-48 overflow-y-auto">
            {DISTRICTS.map(d => (
              <button key={d} onClick={() => saveLocation(d)}
                className={`text-left px-3 py-2 rounded-xl text-xs transition-all ${locInput === d ? "bg-emerald-500/20 text-emerald-400 font-semibold" : "text-white/60 hover:bg-white/5 hover:text-white"}`}>
                {d}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HAMBURGER SIDE DRAWER
═══════════════════════════════════════════════════════════════ */

function SideDrawer({
  open,
  onClose,
  lang,
  onLangToggle,
  darkMode,
  onDarkToggle,
}: {
  open: boolean;
  onClose: () => void;
  lang: "EN" | "বাং";
  onLangToggle: () => void;
  darkMode: boolean;
  onDarkToggle: () => void;
}) {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  /* close on route change */
  const handleLink = (href: string) => {
    onClose();
    navigate(href);
  };

  /* trap scroll when open */
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 transition-all duration-300"
        style={{
          background: open ? "rgba(0,0,0,0.6)" : "transparent",
          backdropFilter: open ? "blur(4px)" : "none",
          pointerEvents: open ? "auto" : "none",
        }}
      />

      {/* Drawer panel */}
      <div
        className="fixed top-0 left-0 bottom-0 z-50 w-72 flex flex-col transition-transform duration-300 ease-out"
        style={{
          background: "rgba(6,18,14,0.97)",
          backdropFilter: "blur(24px)",
          borderRight: "1px solid rgba(16,185,129,0.12)",
          transform: open ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <span className="font-extrabold text-xl tracking-tight">
            <span className="text-gradient-green">Paikar</span>
            <span className="text-gradient-purple">Mart</span>
          </span>
          <button onClick={onClose} className="h-8 w-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 transition-all">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* User greeting */}
        {user && user.id !== "guest" ? (
          <div className="px-5 py-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500/30 to-purple-500/20 border border-white/10 flex items-center justify-center text-lg">
                {user.name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{user.name}</p>
                <p className="text-[10px] text-white/40 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-5 py-4 border-b border-white/5 flex gap-2">
            <button onClick={() => handleLink("/login")}
              className="flex-1 py-2 rounded-xl border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/10 transition-all">
              Login
            </button>
            <button onClick={() => handleLink("/register")}
              className="flex-1 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/30 transition-all">
              Sign Up
            </button>
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          {SIDEBAR_LINKS.map(item => (
            <button key={item.href} onClick={() => handleLink(item.href)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all text-left group">
              <item.icon className="h-4 w-4 text-white/30 group-hover:text-emerald-400 transition-colors" />
              {item.label}
              <ChevronRight className="h-3.5 w-3.5 ml-auto text-white/20 group-hover:text-white/40" />
            </button>
          ))}

          {/* Become a seller */}
          <div className="mt-3 mx-1">
            <button onClick={() => handleLink("/seller/register")}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: "linear-gradient(135deg, hsl(145 65% 28%), hsl(265 55% 38%))" }}>
              <Sparkles className="h-4 w-4" /> Become a Seller
            </button>
          </div>
        </nav>

        {/* Bottom toggles */}
        <div className="px-5 py-4 border-t border-white/5 space-y-3">
          {/* Language toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-white/50">
              <Globe className="h-4 w-4" /> Language
            </div>
            <button onClick={onLangToggle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-semibold text-white/70 hover:border-emerald-500/30 hover:text-emerald-400 transition-all bg-white/5">
              {lang === "EN" ? "🇬🇧 English" : "🇧🇩 বাংলা"}
            </button>
          </div>

          {/* Dark/Light mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-white/50">
              {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              {darkMode ? "Dark Mode" : "Light Mode"}
            </div>
            <button onClick={onDarkToggle}
              className={`relative h-6 w-11 rounded-full border transition-all ${darkMode ? "bg-emerald-500/30 border-emerald-500/40" : "bg-white/10 border-white/20"}`}>
              <span className={`absolute top-0.5 h-5 w-5 rounded-full transition-all duration-300 flex items-center justify-center text-[10px] ${darkMode ? "left-5 bg-emerald-400" : "left-0.5 bg-white/50"}`}>
                {darkMode ? "🌙" : "☀️"}
              </span>
            </button>
          </div>

          {/* Logout */}
          {user && user.id !== "guest" && (
            <button onClick={() => { logout(); onClose(); }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all">
              <X className="h-3.5 w-3.5" /> Sign Out
            </button>
          )}
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HERO SLIDER (compact)
═══════════════════════════════════════════════════════════════ */

function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [, navigate] = useLocation();

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const s = HERO_SLIDES[current];

  return (
    <section className={`relative bg-gradient-to-br ${s.gradient} text-white overflow-hidden`}>
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 70% 80% at 75% 50%, ${s.glow}, transparent)` }} />

      {/* Desktop layout */}
      <div className="hidden lg:flex items-center gap-8 px-10 py-12 relative z-10 min-h-[300px]">
        <div className="flex-1 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-white/20">
            <Sparkles className="h-3 w-3" /> {s.badge}
          </div>
          <p className="text-white/50 text-sm font-medium mb-1.5">{s.eyebrow}</p>
          <h2 className="text-4xl font-extrabold mb-3 leading-tight">{s.headline}</h2>
          <p className="text-white/60 text-base mb-6 leading-relaxed">{s.sub}</p>
          <div className="flex gap-3">
            <button onClick={() => navigate(s.cta1.href)}
              className="px-6 py-2.5 rounded-xl font-bold text-sm bg-white text-gray-900 hover:bg-white/90 transition-all shadow-lg flex items-center gap-1.5">
              {s.cta1.label} <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => navigate(s.cta2.href)}
              className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-white/12 border border-white/25 hover:bg-white/20 text-white backdrop-blur-sm transition-all">
              {s.cta2.label}
            </button>
          </div>
        </div>
        <div className="w-80 h-56 rounded-2xl overflow-hidden border border-white/15 shrink-0 shadow-2xl">
          <img src={s.img} alt={s.headline} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden px-4 py-5 relative z-10" style={{ minHeight: "180px" }}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full mb-2 border border-white/20">
              <Sparkles className="h-2.5 w-2.5" /> {s.badge}
            </div>
            <h2 className="text-xl font-extrabold mb-1.5 leading-tight">{s.headline}</h2>
            <p className="text-white/65 text-xs mb-3 line-clamp-2">{s.sub}</p>
            <div className="flex gap-2">
              <button onClick={() => navigate(s.cta1.href)}
                className="px-4 py-1.5 rounded-xl font-bold text-xs bg-white text-gray-900 hover:bg-white/90 transition-all shadow">
                {s.cta1.label} <ArrowRight className="h-3 w-3 inline ml-0.5" />
              </button>
              <button onClick={() => navigate(s.cta2.href)}
                className="px-4 py-1.5 rounded-xl font-semibold text-xs bg-white/12 border border-white/25 hover:bg-white/20 text-white backdrop-blur-sm transition-all">
                {s.cta2.label}
              </button>
            </div>
          </div>
          <div className="hidden sm:block w-40 h-28 rounded-xl overflow-hidden border border-white/15 shrink-0 shadow-xl">
            <img src={s.img} alt={s.headline} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 pb-3 relative z-10">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? "w-5 h-1 bg-white" : "w-1 h-1 bg-white/35"}`} />
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STORIES ROW
═══════════════════════════════════════════════════════════════ */

function StoriesRow() {
  const [viewed, setViewed] = useState<Set<string>>(new Set());
  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide py-3 px-4">
      <div className="flex flex-col items-center gap-1 shrink-0 cursor-pointer">
        <div className="h-11 w-11 rounded-xl border-2 border-dashed border-emerald-500/30 bg-emerald-500/5 flex items-center justify-center hover:border-emerald-400/60 transition-colors">
          <Plus className="h-4 w-4 text-emerald-500/60" />
        </div>
        <span className="text-[9px] text-white/35 font-medium">Add</span>
      </div>
      {STORIES.map(s => {
        const seen = viewed.has(s.id);
        return (
          <div key={s.id} onClick={() => setViewed(v => new Set([...v, s.id]))}
            className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group">
            <div className={`p-[2px] rounded-xl bg-gradient-to-br ${s.ring} transition-opacity ${seen ? "opacity-40" : ""}`}>
              <div className="h-10 w-10 rounded-[10px] flex items-center justify-center text-xl"
                style={{ background: "hsl(160 28% 7%)" }}>
                {s.emoji}
              </div>
            </div>
            <span className="text-[9px] text-white/50 group-hover:text-white/80 font-medium w-11 text-center truncate transition-colors">{s.name}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CATEGORY NAV
═══════════════════════════════════════════════════════════════ */

function CategoryNav() {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2 px-4">
      {CATEGORIES.map(cat => (
        <Link key={cat.name} href={cat.href}>
          <div className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border bg-gradient-to-br ${cat.color} ${cat.border} hover:opacity-90 transition-all cursor-pointer`}>
            <span className="text-sm">{cat.emoji}</span>
            <span className={`text-[11px] font-semibold whitespace-nowrap ${cat.text}`}>{cat.name}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPACT PRODUCT CARD (1:1)
═══════════════════════════════════════════════════════════════ */

interface CardProps {
  id: string;
  image: string;
  tag: string;
  tagColor: string;
  name: string;
  shopName: string;
  shopVerified?: boolean;
  price: number;
  compareAt?: number;
  rating: number;
  sold: number;
  distance?: string;
  inStock?: boolean;
  moq?: number;
  priceOnInquiry?: boolean;
  onCart?: (e: React.MouseEvent) => void;
  href?: string;
}

function CompactCard(props: CardProps) {
  const { has, toggle } = useWishlist();
  const isWishlisted = has(props.id);
  const discount = props.compareAt && props.compareAt > props.price
    ? Math.round(((props.compareAt - props.price) / props.compareAt) * 100)
    : null;

  const inner = (
    <div className="glass-card rounded-xl overflow-hidden group cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/10 h-full flex flex-col">
      {/* Image 1:1 */}
      <div className="relative overflow-hidden bg-white/5" style={{ aspectRatio: "1/1" }}>
        {props.image ? (
          <img src={props.image} alt={props.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/15">
            <Package className="h-8 w-8" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

        {/* Top-left: type badge + discount */}
        <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md text-white ${props.tagColor}`}>{props.tag}</span>
          {discount !== null && (
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-md bg-red-500 text-white">-{discount}%</span>
          )}
        </div>

        {/* Top-right: wishlist */}
        <button
          onClick={e => {
            e.preventDefault(); e.stopPropagation();
            toggle({ productId: props.id, title: props.name, price: props.price, imageUrl: props.image });
            toast(isWishlisted ? "Removed" : "Saved ❤️");
          }}
          className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/15 transition-all hover:scale-110">
          <Heart className={`h-3 w-3 ${isWishlisted ? "fill-rose-400 text-rose-400" : "text-white/70"}`} />
        </button>

        {/* Bottom-right: distance */}
        {props.distance && (
          <div className="absolute bottom-1.5 right-1.5 flex items-center gap-0.5 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-full border border-white/10">
            <MapPin className="h-2 w-2 text-emerald-400" />
            <span className="text-[8px] text-white/80 font-medium">{props.distance}</span>
          </div>
        )}

        {!props.inStock && (
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-[10px] font-semibold text-white/80 border border-white/20 px-2 py-0.5 rounded-full">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-2.5 flex flex-col flex-1 gap-1">
        {/* Shop */}
        <div className="flex items-center gap-1">
          <span className="text-[9px] text-white/40 truncate flex-1">{props.shopName}</span>
          {props.shopVerified && <BadgeCheck className="h-2.5 w-2.5 text-emerald-400 shrink-0" />}
        </div>

        {/* Name */}
        <h3 className="font-semibold text-[11px] text-white/90 line-clamp-2 leading-snug flex-1 group-hover:text-emerald-300 transition-colors">
          {props.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex">
            {[1,2,3,4,5].map(s => (
              <Star key={s} className={`h-2 w-2 ${s <= Math.round(props.rating) ? "text-yellow-400 fill-yellow-400" : "text-white/15"}`} />
            ))}
          </div>
          <span className="text-[9px] text-white/35">{props.sold >= 1000 ? `${(props.sold/1000).toFixed(1)}k` : props.sold} sold</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between gap-1">
          {props.priceOnInquiry ? (
            <span className="text-[10px] font-bold text-orange-400">On Request</span>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-sm text-emerald-400">{formatBDT(props.price)}</span>
              {props.compareAt && props.compareAt > props.price && (
                <span className="text-[9px] text-white/30 line-through">{formatBDT(props.compareAt)}</span>
              )}
            </div>
          )}
          {props.onCart && (
            <button onClick={props.onCart} disabled={props.inStock === false}
              className="h-6 w-6 rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary flex items-center justify-center transition-all disabled:opacity-40 shrink-0">
              <ShoppingCart className="h-3 w-3" />
            </button>
          )}
        </div>

        {props.moq && props.moq > 1 && (
          <p className="text-[9px] text-orange-400">MOQ: {props.moq} units</p>
        )}
      </div>
    </div>
  );

  return props.href ? <Link href={props.href}>{inner}</Link> : inner;
}

/* ═══════════════════════════════════════════════════════════════
   FEED POST CARD
═══════════════════════════════════════════════════════════════ */

type FeedPost = typeof FEED_POSTS[0];

function FeedPostCard({ post }: { post: FeedPost }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [saved, setSaved] = useState(false);
  const { has, toggle } = useWishlist();
  const { addToCart } = useCart();
  const isWishlisted = has(post.id);

  const discount = post.compareAt > post.price
    ? Math.round(((post.compareAt - post.price) / post.compareAt) * 100)
    : null;

  return (
    <GlassCard className="overflow-hidden rounded-2xl">
      {/* ── DESKTOP: horizontal card ── */}
      <div className="hidden lg:flex gap-0">
        {/* Image — fixed width landscape */}
        <div className="relative w-64 shrink-0" style={{ aspectRatio: "4/3" }}>
          <img src={post.image} alt={post.productName} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
          {discount && (
            <div className="absolute top-2.5 left-2.5">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-red-500 text-white">-{discount}% OFF</span>
            </div>
          )}
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-full border border-white/10">
            <MapPin className="h-2.5 w-2.5 text-emerald-400" />
            <span className="text-[9px] text-white/80 font-medium">{post.distance}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between p-4 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-9 w-9 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-lg shrink-0">{post.shopEmoji}</div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-white truncate">{post.shopName}</span>
                  {post.shopVerified && <BadgeCheck className="h-3 w-3 text-emerald-400 shrink-0" />}
                </div>
                <div className="flex items-center gap-1.5 text-[9px] text-white/35">
                  <MapPin className="h-2 w-2" />{post.location} · {post.timeAgo} ago
                </div>
              </div>
            </div>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full text-white shrink-0 ${post.tagColor}`}>{post.tag}</span>
          </div>

          {/* Product name */}
          <p className="text-sm font-semibold text-white/90 line-clamp-2 mb-2 leading-snug">{post.productName}</p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            {[1,2,3,4,5].map(s => (
              <Star key={s} className={`h-2.5 w-2.5 ${s <= Math.round(post.rating) ? "text-yellow-400 fill-yellow-400" : "text-white/15"}`} />
            ))}
            <span className="text-[10px] text-white/40 ml-1">{post.rating} · {post.sold} sold</span>
          </div>

          {/* Price row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-emerald-400">{formatBDT(post.price)}</span>
              {post.compareAt > post.price && (
                <span className="text-[10px] text-white/30 line-through">{formatBDT(post.compareAt)}</span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => { toggle({ productId: post.id, title: post.productName, price: post.price, imageUrl: post.image }); toast(isWishlisted ? "Removed" : "Saved ❤️"); }}
                className="h-8 w-8 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center hover:border-rose-400/30 transition-all">
                <Heart className={`h-3.5 w-3.5 ${isWishlisted ? "fill-rose-400 text-rose-400" : "text-white/50"}`} />
              </button>
              <button
                onClick={() => { addToCart({ productId: post.id, productName: post.productName, vendorId: post.id, vendorName: post.shopName, price: post.price, quantity: 1, image: post.image }); toast.success("Added to cart!"); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, hsl(145 65% 32%), hsl(265 55% 44%))" }}>
                <Zap className="h-3 w-3" /> Buy Now
              </button>
            </div>
          </div>

          {/* Social actions */}
          <div className="flex items-center gap-0.5 border-t border-white/5 pt-2.5 mt-2.5">
            <button onClick={() => { setLiked(l => { setLikes(c => l ? c - 1 : c + 1); return !l; }); }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all ${liked ? "text-rose-400 bg-rose-500/10" : "text-white/45 hover:text-white/70 hover:bg-white/5"}`}>
              <Heart className={`h-3 w-3 ${liked ? "fill-rose-400" : ""}`} /> {likes}
            </button>
            <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium text-white/45 hover:text-white/70 hover:bg-white/5 transition-all">
              <MessageCircle className="h-3 w-3" /> {post.comments}
            </button>
            <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium text-white/45 hover:text-white/70 hover:bg-white/5 transition-all">
              <Share2 className="h-3 w-3" /> Share
            </button>
            <button onClick={() => setSaved(s => !s)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all ml-auto ${saved ? "text-emerald-400 bg-emerald-500/10" : "text-white/45 hover:text-white/70 hover:bg-white/5"}`}>
              <Bookmark className={`h-3 w-3 ${saved ? "fill-emerald-400" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* ── MOBILE: vertical card ── */}
      <div className="lg:hidden">
        {/* Post header */}
        <div className="px-3.5 pt-3.5 pb-2.5 flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-lg shrink-0">{post.shopEmoji}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-white truncate">{post.shopName}</span>
              {post.shopVerified && <BadgeCheck className="h-3 w-3 text-emerald-400 shrink-0" />}
            </div>
            <div className="flex items-center gap-1.5 text-[9px] text-white/35">
              <MapPin className="h-2 w-2" />{post.location} · {post.timeAgo} ago
            </div>
          </div>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full text-white ${post.tagColor}`}>{post.tag}</span>
        </div>

        {/* Image 4:3 on mobile (instead of 1:1) */}
        <div className="relative" style={{ aspectRatio: "4/3" }}>
          <img src={post.image} alt={post.productName} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
          {discount && (
            <div className="absolute top-2.5 left-2.5">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-red-500 text-white">-{discount}% OFF</span>
            </div>
          )}
          <button
            onClick={() => { toggle({ productId: post.id, title: post.productName, price: post.price, imageUrl: post.image }); toast(isWishlisted ? "Removed" : "Saved ❤️"); }}
            className="absolute top-2.5 right-2.5 h-7 w-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/15 transition-all hover:scale-110">
            <Heart className={`h-3.5 w-3.5 ${isWishlisted ? "fill-rose-400 text-rose-400" : "text-white/70"}`} />
          </button>
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-full border border-white/10">
            <MapPin className="h-2.5 w-2.5 text-emerald-400" />
            <span className="text-[9px] text-white/80 font-medium">{post.distance}</span>
          </div>
          <div className="absolute bottom-2.5 left-2.5 right-14">
            <p className="text-white font-semibold text-xs line-clamp-1 drop-shadow">{post.productName}</p>
          </div>
        </div>

        {/* Price + Buy */}
        <div className="px-3.5 py-2.5 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-emerald-400">{formatBDT(post.price)}</span>
              {post.compareAt > post.price && (
                <span className="text-[10px] text-white/30 line-through">{formatBDT(post.compareAt)}</span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              {[1,2,3,4,5].map(s => (
                <Star key={s} className={`h-2 w-2 ${s <= Math.round(post.rating) ? "text-yellow-400 fill-yellow-400" : "text-white/15"}`} />
              ))}
              <span className="text-[9px] text-white/35 ml-0.5">{post.rating} · {post.sold} sold</span>
            </div>
          </div>
          <button
            onClick={() => { addToCart({ productId: post.id, productName: post.productName, vendorId: post.id, vendorName: post.shopName, price: post.price, quantity: 1, image: post.image }); toast.success("Added to cart!"); }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 shrink-0"
            style={{ background: "linear-gradient(135deg, hsl(145 65% 32%), hsl(265 55% 44%))" }}>
            <Zap className="h-3 w-3" /> Buy Now
          </button>
        </div>

        {/* Social actions */}
        <div className="px-3.5 pb-3 flex items-center gap-0.5 border-t border-white/5 pt-2.5">
          <button onClick={() => { setLiked(l => { setLikes(c => l ? c - 1 : c + 1); return !l; }); }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all ${liked ? "text-rose-400 bg-rose-500/10" : "text-white/45 hover:text-white/70 hover:bg-white/5"}`}>
            <Heart className={`h-3 w-3 ${liked ? "fill-rose-400" : ""}`} /> {likes}
          </button>
          <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium text-white/45 hover:text-white/70 hover:bg-white/5 transition-all">
            <MessageCircle className="h-3 w-3" /> {post.comments}
          </button>
          <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium text-white/45 hover:text-white/70 hover:bg-white/5 transition-all">
            <Share2 className="h-3 w-3" /> Share
          </button>
          <button onClick={() => setSaved(s => !s)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all ml-auto ${saved ? "text-emerald-400 bg-emerald-500/10" : "text-white/45 hover:text-white/70 hover:bg-white/5"}`}>
            <Bookmark className={`h-3 w-3 ${saved ? "fill-emerald-400" : ""}`} />
          </button>
        </div>
      </div>
    </GlassCard>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PRODUCT GRID SECTION
═══════════════════════════════════════════════════════════════ */

function ProductGrid() {
  const { addToCart } = useCart();
  const { data, isLoading } = useListProducts({});
  const products = (data as any)?.products ?? [];

  const typeLabel = (t?: string) => t === "service" ? "Service" : t === "digital" ? "Digital" : "Retail";
  const typeColor = (t?: string) => t === "service" ? "bg-purple-500" : "bg-blue-500";

  const handleCart = useCallback((p: Product) => (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    addToCart({ productId: p.id, productName: p.name, vendorId: p.vendorId, vendorName: p.vendorName, price: p.price ?? 0, quantity: 1, image: p.images?.[0] ?? "" });
    toast.success("Added to cart!");
  }, [addToCart]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 px-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-card rounded-xl overflow-hidden">
            <Skeleton className="aspect-square w-full" />
            <div className="p-2.5 space-y-1.5">
              <Skeleton className="h-2.5 w-2/3" />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products.length) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 px-4 lg:px-0">
      {products.map((p: Product) => (
        <CompactCard
          key={p.id}
          id={p.id}
          image={p.images?.[0] ?? ""}
          tag={p.moq && p.moq > 1 ? "Wholesale" : typeLabel(p.type)}
          tagColor={p.moq && p.moq > 1 ? "bg-orange-500" : typeColor(p.type)}
          name={p.name}
          shopName={p.vendorName}
          shopVerified={true}
          price={p.price ?? 0}
          compareAt={p.price ? Math.round(p.price * 1.2) : undefined}
          rating={p.rating ?? 4.5}
          sold={p.reviewCount ? p.reviewCount * 3 : 12}
          distance={p.location ? `${(Math.random() * 8 + 0.5).toFixed(1)} km` : undefined}
          inStock={p.inStock}
          moq={p.moq}
          priceOnInquiry={p.priceOnInquiry}
          onCart={handleCart(p)}
          href={`/products/${p.id}`}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TRUST STRIP
═══════════════════════════════════════════════════════════════ */

const TRUST = [
  { icon: ShieldCheck, label: "Verified Sellers", color: "text-emerald-400" },
  { icon: CreditCard, label: "Secure Payments", color: "text-blue-400" },
  { icon: Truck, label: "Fast Delivery", color: "text-orange-400" },
  { icon: Award, label: "Quality Assured", color: "text-purple-400" },
];

function TrustStrip() {
  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 py-4">
      {TRUST.map(t => (
        <div key={t.label} className="shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl glass-card">
          <t.icon className={`h-4 w-4 ${t.color} shrink-0`} />
          <span className="text-[11px] font-medium text-white/70 whitespace-nowrap">{t.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION HEADER
═══════════════════════════════════════════════════════════════ */

function SectionHeader({ title, href }: { title: string; href?: string }) {
  return (
    <div className="flex items-center justify-between px-4 pt-5 pb-2">
      <h2 className="text-sm font-bold text-white">{title}</h2>
      {href && (
        <Link href={href}>
          <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-0.5 hover:text-emerald-300 transition-colors cursor-pointer">
            See all <ChevronRight className="h-3 w-3" />
          </span>
        </Link>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState<"EN" | "বাং">("EN");
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      {/* Custom compact header */}
      <CompactHeader
        onMenuOpen={() => setMenuOpen(true)}
        lang={lang}
        onLangToggle={() => setLang(l => l === "EN" ? "বাং" : "EN")}
        darkMode={darkMode}
        onDarkToggle={() => setDarkMode(d => !d)}
      />

      {/* Hamburger drawer */}
      <SideDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        lang={lang}
        onLangToggle={() => setLang(l => l === "EN" ? "বাং" : "EN")}
        darkMode={darkMode}
        onDarkToggle={() => setDarkMode(d => !d)}
      />

      {/* Scrollable main content */}
      <main className="flex-1 pb-24 overflow-y-auto">
        {/* Hero */}
        <HeroSlider />

        {/* Stories + Categories */}
        <div className="border-b border-white/5">
          <StoriesRow />
          <CategoryNav />
        </div>

        {/* Desktop 2-col layout for feed + marketplace */}
        <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-[1fr_300px] lg:gap-6 lg:px-6 lg:pt-2 lg:items-start">

          {/* Main column */}
          <div>
            {/* Social Feed */}
            <SectionHeader title="🔥 Live Feed" />
            <div className="px-4 lg:px-0 flex flex-col gap-3 max-w-lg mx-auto lg:max-w-none">
              {FEED_POSTS.map(post => (
                <FeedPostCard key={post.id} post={post} />
              ))}
              <Link href="/feed">
                <div className="py-3 rounded-xl text-center text-xs font-medium text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/5 transition-all cursor-pointer glass-card">
                  See all posts in Feed →
                </div>
              </Link>
            </div>

            {/* Marketplace Grid */}
            <SectionHeader title="🛍️ Marketplace" href="/products" />
            <div className="lg:px-0">
              <ProductGrid />
            </div>
          </div>

          {/* Desktop right sidebar */}
          <aside className="hidden lg:flex flex-col gap-4 sticky top-[70px] pt-2">

            {/* Quick categories */}
            <div className="glass-card rounded-2xl p-4">
              <h3 className="text-sm font-bold text-white mb-3">🗂️ Shop by Category</h3>
              <div className="flex flex-col gap-0.5">
                {CATEGORIES.map(cat => (
                  <Link key={cat.name} href={cat.href}>
                    <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer hover:bg-white/5 transition-all group`}>
                      <span className="text-base leading-none">{cat.emoji}</span>
                      <span className={`text-xs font-medium ${cat.text} group-hover:text-white transition-colors`}>{cat.name}</span>
                      <ChevronRight className="h-3 w-3 text-white/20 ml-auto group-hover:text-white/50 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Featured vendors */}
            <div className="glass-card rounded-2xl p-4">
              <h3 className="text-sm font-bold text-white mb-3">⭐ Top Vendors</h3>
              <div className="flex flex-col gap-3">
                {[
                  { name: "TechZone BD", emoji: "📱", tag: "Electronics", rating: 4.9, sellers: "Wholesale" },
                  { name: "Fashion Hub", emoji: "👗", tag: "Fashion", rating: 4.7, sellers: "Retail" },
                  { name: "Grocery King", emoji: "🛒", tag: "Grocery", rating: 4.8, sellers: "Retail" },
                ].map(v => (
                  <Link href="/vendors" key={v.name}>
                    <div className="flex items-center gap-3 group cursor-pointer">
                      <div className="h-9 w-9 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-lg shrink-0 group-hover:border-emerald-500/30 transition-all">
                        {v.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white/80 group-hover:text-white truncate transition-colors">{v.name}</p>
                        <p className="text-[10px] text-white/35">{v.tag} · ⭐ {v.rating}</p>
                      </div>
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-white/6 text-white/40 shrink-0">{v.sellers}</span>
                    </div>
                  </Link>
                ))}
                <Link href="/vendors">
                  <span className="text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer inline-block mt-1">
                    Browse all vendors →
                  </span>
                </Link>
              </div>
            </div>

            {/* Trust badges */}
            <div className="glass-card rounded-2xl p-4">
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3">Why PaikarMart?</h3>
              <div className="space-y-3">
                {[
                  { icon: ShieldCheck, label: "Verified Sellers", sub: "Every seller is vetted", color: "text-emerald-400" },
                  { icon: CreditCard, label: "Secure Payments", sub: "SSL encrypted checkout", color: "text-blue-400" },
                  { icon: Truck, label: "Fast Delivery", sub: "Nationwide coverage", color: "text-orange-400" },
                  { icon: Award, label: "Quality Assured", sub: "Buyer protection policy", color: "text-purple-400" },
                ].map(t => (
                  <div key={t.label} className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0`}>
                      <t.icon className={`h-4 w-4 ${t.color}`} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white/70">{t.label}</p>
                      <p className="text-[10px] text-white/35">{t.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Download app */}
            <div
              className="rounded-2xl p-4 text-center"
              style={{
                background: "linear-gradient(135deg,hsl(145 65% 10%),hsl(265 55% 14%))",
                border: "1px solid rgba(16,185,129,0.18)",
              }}
            >
              <p className="text-2xl mb-1.5">📱</p>
              <p className="text-sm font-bold text-white mb-1">Get the App</p>
              <p className="text-[11px] text-white/45 mb-3">Exclusive deals & instant alerts</p>
              <button
                className="w-full py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 transition-all"
                style={{ background: "linear-gradient(135deg,hsl(145 65% 30%),hsl(265 55% 38%))" }}
              >
                Download Free
              </button>
            </div>
          </aside>
        </div>

        {/* Mobile: Trust strip */}
        <div className="lg:hidden mt-4 border-t border-white/5">
          <TrustStrip />
        </div>

        {/* Bottom spacer */}
        <div className="h-4" />
      </main>

      {/* Bottom nav */}
      <BottomNav />
    </div>
  );
}
