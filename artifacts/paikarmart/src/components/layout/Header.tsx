import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  Menu, Search, MapPin, ShoppingCart, X, ChevronDown, ChevronRight,
  Home, Package, Store, Tag, TrendingUp, HeadphonesIcon,
  Building2, ShoppingBag, HelpCircle, Globe, Sun, Moon, Sparkles,
  User, Flame,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useUserLocation } from "@/context/LocationContext";
import { toast } from "sonner";

/* ─── Constants ─────────────────────────────────────────────── */

const DISTRICTS = [
  "Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna",
  "Barisal", "Rangpur", "Mymensingh", "Comilla", "Gazipur",
  "Narayanganj", "Narsingdi", "Tangail", "Bogura", "Jessore",
];

const DESKTOP_NAV = [
  { href: "/", label: "Home", icon: Home },
  { href: "/products", label: "Market", icon: ShoppingBag },
  { href: "/feed", label: "Feed", icon: Flame },
  { href: "/vendors", label: "Vendors", icon: Store },
  { href: "/categories", label: "Categories", icon: Tag },
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

/* ─── SideDrawer ─────────────────────────────────────────────── */

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

  const handleLink = (href: string) => {
    onClose();
    navigate(href);
  };

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 transition-all duration-300"
        style={{
          background: open ? "rgba(0,0,0,0.6)" : "transparent",
          backdropFilter: open ? "blur(4px)" : "none",
          pointerEvents: open ? "auto" : "none",
        }}
      />
      <div
        className="fixed top-0 left-0 bottom-0 z-50 w-72 flex flex-col transition-transform duration-300 ease-out"
        style={{
          background: "rgba(6,18,14,0.97)",
          backdropFilter: "blur(24px)",
          borderRight: "1px solid rgba(16,185,129,0.12)",
          transform: open ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <span className="font-extrabold text-xl tracking-tight">
            <span className="text-gradient-green">Paikar</span>
            <span style={{ color: "#9B1942" }}>Mart</span>
          </span>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 transition-all"
          >
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
            <button
              onClick={() => handleLink("/login")}
              className="flex-1 py-2 rounded-xl border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/10 transition-all"
            >
              Login
            </button>
            <button
              onClick={() => handleLink("/register")}
              className="flex-1 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/30 transition-all"
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          {SIDEBAR_LINKS.map(item => (
            <button
              key={item.href}
              onClick={() => handleLink(item.href)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all text-left group"
            >
              <item.icon className="h-4 w-4 text-white/30 group-hover:text-emerald-400 transition-colors" />
              {item.label}
              <ChevronRight className="h-3.5 w-3.5 ml-auto text-white/20 group-hover:text-white/40" />
            </button>
          ))}

          {user?.role === "seller" && (
            <button
              onClick={() => handleLink("/seller/dashboard")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-purple-400 hover:text-white hover:bg-white/5 transition-all text-left group mt-1 border-t border-white/5"
            >
              <ShoppingBag className="h-4 w-4" />
              Seller Dashboard
              <ChevronRight className="h-3.5 w-3.5 ml-auto text-white/20 group-hover:text-white/40" />
            </button>
          )}

          {user?.role === "admin" && (
            <button
              onClick={() => handleLink("/admin/dashboard")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-purple-400 hover:text-white hover:bg-white/5 transition-all text-left group mt-1 border-t border-white/5"
            >
              <ShoppingBag className="h-4 w-4" />
              Admin Panel
              <ChevronRight className="h-3.5 w-3.5 ml-auto text-white/20 group-hover:text-white/40" />
            </button>
          )}

          <div className="mt-3 mx-1">
            <button
              onClick={() => handleLink("/seller/register")}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: "linear-gradient(135deg, hsl(145 65% 28%), hsl(265 55% 38%))" }}
            >
              <Sparkles className="h-4 w-4" /> Become a Seller
            </button>
          </div>
        </nav>

        {/* Bottom toggles */}
        <div className="px-5 py-4 border-t border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-white/50">
              <Globe className="h-4 w-4" /> Language
            </div>
            <button
              onClick={onLangToggle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-semibold text-white/70 hover:border-emerald-500/30 hover:text-emerald-400 transition-all bg-white/5"
            >
              {lang === "EN" ? "🇬🇧 English" : "🇧🇩 বাংলা"}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-white/50">
              {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              {darkMode ? "Dark Mode" : "Light Mode"}
            </div>
            <button
              onClick={onDarkToggle}
              className={`relative h-6 w-11 rounded-full border transition-all ${darkMode ? "bg-emerald-500/30 border-emerald-500/40" : "bg-white/10 border-white/20"}`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full transition-all duration-300 flex items-center justify-center text-[10px] ${darkMode ? "left-5 bg-emerald-400" : "left-0.5 bg-white/50"}`}
              >
                {darkMode ? "🌙" : "☀️"}
              </span>
            </button>
          </div>

          {user && user.id !== "guest" && (
            <button
              onClick={() => { logout(); onClose(); }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
            >
              <X className="h-3.5 w-3.5" /> Sign Out
            </button>
          )}
        </div>
      </div>
    </>
  );
}

/* ─── Main Header (universal across all pages) ───────────────── */

export function Header() {
  const { user } = useAuth();
  const { totalItems } = useCart();
  const { location: userLoc } = useUserLocation();
  const [loc, navigate] = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState<"EN" | "বাং">("EN");
  const [darkMode, setDarkMode] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLocPicker, setShowLocPicker] = useState(false);
  const [locInput, setLocInput] = useState(() => localStorage.getItem("pm_district") || "");

  const mobileInputRef = React.useRef<HTMLInputElement>(null);
  const desktopInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) mobileInputRef.current?.focus();
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

  const locLabel = locInput || userLoc.city || "Dhaka";
  const firstName = user?.name?.split(" ")[0] ?? null;
  const isGuest = !user || user.id === "guest";

  const headerBg: React.CSSProperties = {
    background: "rgba(6,18,14,0.95)",
    backdropFilter: "blur(24px)",
  };

  return (
    <>
      <header
        className="sticky top-0 z-40 w-full"
        style={{ borderBottom: "1px solid rgba(16,185,129,0.1)" }}
      >
        {/* ══════════════════════════════════════════
            DESKTOP HEADER  (lg+)
        ══════════════════════════════════════════ */}
        <div className="hidden lg:block" style={headerBg}>

          {/* Row 1 — Logo · Location · Search · Profile/Auth · Cart */}
          <div className="flex items-center gap-3 h-[60px] px-6 max-w-[1400px] mx-auto">

            {/* Logo */}
            <Link href="/">
              <span className="font-extrabold text-xl tracking-tight cursor-pointer select-none shrink-0">
                <span className="text-gradient-green">Paikar</span>
                <span style={{ color: "#9B1942" }}>Mart</span>
              </span>
            </Link>

            {/* Location chip */}
            <button
              onClick={() => setShowLocPicker(v => !v)}
              className="shrink-0 flex items-center gap-1.5 h-9 px-3 rounded-xl border transition-all text-white/60 hover:text-emerald-400"
              style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
            >
              <MapPin className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-xs font-medium max-w-[96px] truncate">{locLabel}</span>
              <ChevronDown className="h-3 w-3 opacity-40" />
            </button>

            {/* Search bar */}
            <form
              onSubmit={handleSearch}
              className="flex-1 flex items-center gap-2.5 h-9 px-4 rounded-xl transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(16,185,129,0.35)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
            >
              <Search className="h-4 w-4 text-white/30 shrink-0" />
              <input
                ref={desktopInputRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products, sellers, brands..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
              />
              {searchQuery && (
                <button
                  type="submit"
                  className="shrink-0 text-[11px] font-bold text-white px-3 py-1 rounded-lg transition-all"
                  style={{ background: "linear-gradient(135deg,hsl(145 65% 30%),hsl(265 55% 38%))" }}
                >
                  Search
                </button>
              )}
            </form>

            {/* Auth actions */}
            {isGuest ? (
              <div className="flex items-center gap-2 shrink-0">
                <Link href="/login">
                  <button
                    className="flex items-center gap-1.5 h-9 px-3 rounded-xl border text-xs font-medium transition-all text-white/60 hover:text-white"
                    style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
                  >
                    <User className="h-4 w-4" /> Login
                  </button>
                </Link>
                <Link href="/register">
                  <button
                    className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-semibold text-white transition-all"
                    style={{ background: "linear-gradient(135deg, hsl(145 65% 28%), hsl(265 55% 38%))" }}
                  >
                    Sign Up
                  </button>
                </Link>
              </div>
            ) : (
              <Link href="/profile">
                <button
                  className="flex items-center gap-2 h-9 px-3 rounded-xl border transition-all text-white/60 hover:text-white shrink-0"
                  style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
                >
                  <div className="h-5 w-5 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <User className="h-3 w-3 text-emerald-400" />
                  </div>
                  <span className="text-xs font-medium">{firstName}</span>
                </button>
              </Link>
            )}

            {/* Cart */}
            <Link href="/cart">
              <button
                className="relative flex items-center gap-2 h-9 px-3 rounded-xl border transition-all text-white/60 hover:text-white shrink-0"
                style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="text-xs font-medium">Cart</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center shadow">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </button>
            </Link>
          </div>

          {/* Row 2 — Nav tabs */}
          <div
            className="flex items-center px-6 max-w-[1400px] mx-auto"
            style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
          >
            {DESKTOP_NAV.map(item => {
              const active = loc === item.href || (item.href !== "/" && loc.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold transition-all cursor-pointer border-b-2 ${
                      active
                        ? "text-emerald-400 border-emerald-400"
                        : "text-white/45 border-transparent hover:text-white/80 hover:border-white/20"
                    }`}
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            MOBILE HEADER  (< lg)
        ══════════════════════════════════════════ */}
        <div className="lg:hidden" style={headerBg}>
          <div className="flex items-center h-[52px] px-3 gap-2">

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(true)}
              className="h-8 w-8 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/8 transition-all shrink-0"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Logo */}
            <div className="flex-1 flex justify-start">
              <Link href="/">
                <span className="font-extrabold text-2xl tracking-tight cursor-pointer select-none">
                  <span className="text-gradient-green">Paikar</span>
                  <span style={{ color: "#9B1942" }}>Mart</span>
                </span>
              </Link>
            </div>

            {/* Right: Location · Search · Cart */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setShowLocPicker(v => !v)}
                className="h-8 px-2 rounded-xl flex items-center gap-1 text-white/50 hover:text-emerald-400 hover:bg-white/5 transition-all"
              >
                <MapPin className="h-3.5 w-3.5" />
                <span className="text-[10px] max-w-[52px] truncate hidden sm:inline">{locLabel}</span>
              </button>
              <button
                onClick={() => setSearchOpen(v => !v)}
                className="h-8 w-8 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/8 transition-all"
              >
                <Search className="h-4 w-4" />
              </button>
              <Link href="/cart">
                <button className="relative h-8 w-8 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/8 transition-all">
                  <ShoppingCart className="h-4 w-4" />
                  {totalItems > 0 && (
                    <span className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {totalItems > 9 ? "9+" : totalItems}
                    </span>
                  )}
                </button>
              </Link>
            </div>
          </div>

          {/* Mobile slide-down search */}
          <div
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{
              maxHeight: searchOpen ? "56px" : "0px",
              borderTop: searchOpen ? "1px solid rgba(16,185,129,0.08)" : "none",
            }}
          >
            <form onSubmit={handleSearch} className="flex items-center gap-2 px-3 py-2">
              <Search className="h-4 w-4 text-white/30 shrink-0" />
              <input
                ref={mobileInputRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products, sellers, brands..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
              />
              {searchQuery
                ? <button type="submit" className="text-[10px] font-semibold text-emerald-400 px-2">Go</button>
                : <button type="button" onClick={() => setSearchOpen(false)} className="text-white/30 hover:text-white/60 transition-colors"><X className="h-4 w-4" /></button>
              }
            </form>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            LOCATION PICKER  (shared)
        ══════════════════════════════════════════ */}
        {showLocPicker && (
          <div
            className="absolute top-full left-0 right-0 z-50 mx-3 mt-1 rounded-2xl shadow-2xl overflow-hidden lg:left-[160px] lg:right-auto lg:mx-0 lg:w-72"
            style={{ background: "rgba(8,22,16,0.98)", border: "1px solid rgba(16,185,129,0.15)" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-3 border-b border-white/5 flex items-center justify-between">
              <p className="text-xs text-white/40 font-medium">Select District</p>
              <button onClick={() => setShowLocPicker(false)} className="text-white/30 hover:text-white/60 transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1 p-2 max-h-52 overflow-y-auto">
              {DISTRICTS.map(d => (
                <button
                  key={d}
                  onClick={() => saveLocation(d)}
                  className={`text-left px-3 py-2 rounded-xl text-xs transition-all ${locInput === d ? "bg-emerald-500/20 text-emerald-400 font-semibold" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Side Drawer */}
      <SideDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        lang={lang}
        onLangToggle={() => setLang(l => l === "EN" ? "বাং" : "EN")}
        darkMode={darkMode}
        onDarkToggle={() => setDarkMode(d => !d)}
      />
    </>
  );
}
