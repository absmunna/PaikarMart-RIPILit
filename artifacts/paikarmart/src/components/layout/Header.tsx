import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  Search, ShoppingCart, Bell, Menu, User, MapPin, Globe,
  X, ChevronDown, Home, Package, Store, Tag, TrendingUp,
  HeadphonesIcon, Building2, ShoppingBag, Heart, Settings,
  LogOut, LayoutDashboard, Smartphone, HelpCircle, UserPlus,
  Check, Sparkles
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useListNotifications } from "@workspace/api-client-react";

const DISTRICTS = [
  "Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna",
  "Barisal", "Rangpur", "Mymensingh", "Comilla", "Gazipur",
  "Narayanganj", "Narsingdi", "Tangail", "Bogura", "Jessore"
];

const AREAS: Record<string, string[]> = {
  "Dhaka": ["Mirpur", "Gulshan", "Dhanmondi", "Uttara", "Banani", "Tejgaon", "Mohammadpur", "Old Dhaka"],
  "Chittagong": ["Agrabad", "GEC Circle", "Pahartali", "Halishahar", "Panchlaish"],
  "Sylhet": ["Zindabazar", "Ambarkhana", "Subhanighat", "Shibganj"],
};

const SEARCH_CATEGORIES = [
  "All Products", "Electronics", "Fashion", "Grocery", "Services", "Wholesale"
];

export function Header() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [, navigate] = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("All Products");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(() => localStorage.getItem("pm_district") || "");
  const [selectedArea, setSelectedArea] = useState(() => localStorage.getItem("pm_area") || "");
  const [tempDistrict, setTempDistrict] = useState(selectedDistrict);
  const [tempArea, setTempArea] = useState(selectedArea);

  const accountRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const { data: notifData } = useListNotifications({ user_id: user?.id || "user-1", limit: 5 });
  const unread = notifData?.unreadCount || 0;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setShowAccountMenu(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifMenu(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const saveLocation = () => {
    localStorage.setItem("pm_district", tempDistrict);
    localStorage.setItem("pm_area", tempArea);
    setSelectedDistrict(tempDistrict);
    setSelectedArea(tempArea);
    setShowLocationModal(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(searchCategory)}`);
      setShowSearchSuggestions(false);
    }
  };

  const isGuest = !user || user.id === "guest";
  const locationLabel = selectedDistrict
    ? (selectedArea ? `${selectedArea}, ${selectedDistrict}` : selectedDistrict)
    : "Location";

  const sidebarLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/products", label: "All Products", icon: ShoppingBag },
    { href: "/vendors", label: "All Vendors", icon: Store },
    { href: "/vendors?type=wholesale", label: "Wholesale", icon: Package },
    { href: "/vendors?type=retail", label: "Retail", icon: Tag },
    { href: "/vendors?type=brand_seller", label: "Brand Shops", icon: Building2 },
    { href: "/vendors?type=dropship", label: "Dropship", icon: TrendingUp },
    { href: "/vendors?type=service", label: "Services", icon: HeadphonesIcon },
    { href: "/orders", label: "My Orders", icon: Package },
    { href: "/wallet", label: "Wallet", icon: ShoppingBag },
    { href: "/faq", label: "FAQ", icon: HelpCircle },
    { href: "/terms", label: "Terms", icon: HelpCircle },
  ];

  return (
    <>
      {/* Top Mini Bar */}
      <div
        className="w-full text-xs py-1.5 px-4 z-50 sticky top-0"
        style={{ background: "linear-gradient(90deg, hsl(160 35% 6%), hsl(265 30% 10%))" }}
      >
        <div className="container mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <a href="#" className="flex items-center gap-1 text-white/40 hover:text-emerald-400 transition-colors">
              <Smartphone className="h-3 w-3" /> Download App
            </a>
            <a href="/faq" className="flex items-center gap-1 text-white/40 hover:text-emerald-400 transition-colors">
              <HelpCircle className="h-3 w-3" /> Help
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/seller/register">
              <span className="flex items-center gap-1 font-semibold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer">
                <Sparkles className="h-3 w-3" /> Become a Seller
              </span>
            </Link>
            {isGuest ? (
              <>
                <Link href="/login" className="text-white/40 hover:text-white transition-colors">Login</Link>
                <Link href="/register" className="text-white/40 hover:text-white transition-colors">Sign Up</Link>
              </>
            ) : (
              <span className="text-emerald-400 font-medium">Hi, {user.name.split(" ")[0]}</span>
            )}
            <span className="flex items-center gap-1 cursor-pointer text-white/40 hover:text-white transition-colors">
              <Globe className="h-3 w-3" /> EN
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="glass sticky top-[30px] z-40 w-full">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-3">

          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowSidebar(true)}
              className="h-9 w-9 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/8 transition-all"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div
                className="h-9 w-9 rounded-xl flex items-center justify-center shadow-lg green-ring"
                style={{ background: "linear-gradient(135deg, hsl(145 65% 28%), hsl(145 60% 38%))" }}
              >
                <span className="text-white font-bold text-lg" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>P</span>
              </div>
              <span className="font-bold text-xl hidden sm:inline-block tracking-tight">
                <span className="text-gradient-green">Paikar</span>
                <span className="text-gradient-purple">Mart</span>
              </span>
            </Link>
          </div>

          {/* Center: Search */}
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-2xl hidden md:flex items-center rounded-xl overflow-hidden shadow-sm transition-all green-ring-sm focus-within:border-emerald-500/50"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <div className="relative">
              <select
                value={searchCategory}
                onChange={e => setSearchCategory(e.target.value)}
                className="h-10 pl-3 pr-6 text-xs bg-transparent border-r text-white/60 focus:outline-none cursor-pointer appearance-none"
                style={{ borderColor: "rgba(16,185,129,0.2)" }}
              >
                {SEARCH_CATEGORIES.map(c => <option key={c} className="bg-gray-900">{c}</option>)}
              </select>
              <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 h-3 w-3 text-white/40 pointer-events-none" />
            </div>
            <div className="relative flex-1">
              <Input
                type="text"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setShowSearchSuggestions(e.target.value.length > 0); }}
                onFocus={() => searchQuery.length > 0 && setShowSearchSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 150)}
                placeholder="Search products, brands, categories..."
                className="border-none bg-transparent shadow-none focus-visible:ring-0 rounded-none h-10 px-4 text-white placeholder:text-white/30 text-sm"
              />
              {showSearchSuggestions && (
                <div
                  className="absolute top-full left-0 right-0 mt-1 rounded-xl shadow-xl z-50 overflow-hidden glass-dark border"
                  style={{ borderColor: "rgba(16,185,129,0.2)" }}
                >
                  {["Electronics", "Fashion", "Grocery"].filter(s => s.toLowerCase().includes(searchQuery.toLowerCase())).map(s => (
                    <div
                      key={s}
                      onClick={() => { setSearchQuery(s); setShowSearchSuggestions(false); }}
                      className="px-4 py-2.5 cursor-pointer text-sm flex items-center gap-2 hover:bg-emerald-500/10 text-white/70 hover:text-white transition-colors"
                    >
                      <Search className="h-3 w-3 text-emerald-400" /> {s}
                    </div>
                  ))}
                  <div
                    onClick={() => { navigate(`/products?q=${encodeURIComponent(searchQuery)}`); setShowSearchSuggestions(false); }}
                    className="px-4 py-2.5 cursor-pointer text-sm font-medium flex items-center gap-2 hover:bg-emerald-500/10 text-emerald-400 transition-colors"
                  >
                    <Search className="h-3 w-3" /> Search for "{searchQuery}"
                  </div>
                </div>
              )}
            </div>
            <button
              type="submit"
              className="h-10 px-5 text-white font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, hsl(145 65% 32%), hsl(145 60% 40%))" }}
            >
              Search
            </button>
          </form>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Location */}
            <button
              onClick={() => { setTempDistrict(selectedDistrict); setTempArea(selectedArea); setShowLocationModal(true); }}
              className="hidden lg:flex items-center gap-1.5 text-xs text-white/50 hover:text-emerald-400 transition-colors px-2 py-1.5 rounded-lg hover:bg-emerald-500/8"
            >
              <MapPin className="h-4 w-4 text-emerald-500 shrink-0" />
              <span className="max-w-[90px] truncate">{locationLabel}</span>
            </button>

            {/* Notification */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => setShowNotifMenu(v => !v)}
                className="h-9 w-9 rounded-xl flex items-center justify-center relative text-white/50 hover:text-white hover:bg-white/8 transition-all"
              >
                <Bell className="h-5 w-5" />
                {unread > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {unread}
                  </span>
                )}
              </button>
              {showNotifMenu && (
                <div
                  className="absolute right-0 top-full mt-2 w-80 rounded-xl shadow-2xl z-50 overflow-hidden glass-dark border"
                  style={{ borderColor: "rgba(16,185,129,0.18)" }}
                >
                  <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "rgba(16,185,129,0.12)" }}>
                    <span className="font-semibold text-sm text-white">Notifications</span>
                    <Link href="/notifications" className="text-xs text-emerald-400 hover:text-emerald-300" onClick={() => setShowNotifMenu(false)}>View All</Link>
                  </div>
                  <div className="divide-y max-h-72 overflow-y-auto" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    {notifData?.notifications?.slice(0, 5).map(n => (
                      <div key={n.id} className={`px-4 py-3 text-sm ${!n.read ? "bg-emerald-500/5" : ""}`}>
                        <p className="font-medium text-white/90 line-clamp-1">{n.title}</p>
                        <p className="text-white/40 text-xs line-clamp-1 mt-0.5">{n.message}</p>
                      </div>
                    )) || (
                      <div className="px-4 py-6 text-center text-sm text-white/40">No notifications</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cart */}
            <Link href="/cart">
              <button className="h-9 w-9 rounded-xl flex items-center justify-center relative text-white/50 hover:text-white hover:bg-white/8 transition-all">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center glow-green">
                    {totalItems}
                  </span>
                )}
              </button>
            </Link>

            {/* Account */}
            <div ref={accountRef} className="relative">
              <button
                onClick={() => setShowAccountMenu(v => !v)}
                className="h-9 w-9 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/8 transition-all"
              >
                <User className="h-5 w-5" />
              </button>
              {showAccountMenu && (
                <div
                  className="absolute right-0 top-full mt-2 w-56 rounded-xl shadow-2xl z-50 overflow-hidden glass-dark border"
                  style={{ borderColor: "rgba(16,185,129,0.18)" }}
                >
                  {isGuest ? (
                    <>
                      <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(16,185,129,0.12)", background: "rgba(16,185,129,0.06)" }}>
                        <p className="text-sm font-semibold text-white">Welcome to PaikarMart</p>
                        <p className="text-xs text-emerald-400/70">Sign in for the best experience</p>
                      </div>
                      <div className="p-2 space-y-1">
                        <Link href="/login" onClick={() => setShowAccountMenu(false)}>
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-emerald-500/10 text-sm cursor-pointer text-white/70 hover:text-white transition-colors">
                            <User className="h-4 w-4 text-emerald-400" /> Customer Login
                          </div>
                        </Link>
                        <Link href="/login?role=seller" onClick={() => setShowAccountMenu(false)}>
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-emerald-500/10 text-sm cursor-pointer text-white/70 hover:text-white transition-colors">
                            <Store className="h-4 w-4 text-emerald-400" /> Seller Login
                          </div>
                        </Link>
                        <Link href="/register" onClick={() => setShowAccountMenu(false)}>
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-emerald-500/10 text-sm cursor-pointer text-emerald-400 font-medium transition-colors">
                            <UserPlus className="h-4 w-4" /> Sign Up Free
                          </div>
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(16,185,129,0.12)", background: "rgba(16,185,129,0.06)" }}>
                        <p className="text-sm font-semibold text-white">{user.name}</p>
                        <p className="text-xs text-emerald-400 capitalize">{user.role}</p>
                      </div>
                      <div className="p-2 space-y-1">
                        {[
                          { href: "/profile", label: "My Account", icon: User },
                          { href: "/orders", label: "My Orders", icon: Package },
                          { href: "/wallet", label: "Wallet", icon: ShoppingBag },
                        ].map(item => {
                          const Icon = item.icon;
                          return (
                            <Link key={item.href} href={item.href} onClick={() => setShowAccountMenu(false)}>
                              <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/6 text-sm cursor-pointer text-white/70 hover:text-white transition-colors">
                                <Icon className="h-4 w-4" /> {item.label}
                              </div>
                            </Link>
                          );
                        })}
                        {user.role === "seller" && (
                          <Link href="/seller/dashboard" onClick={() => setShowAccountMenu(false)}>
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/6 text-sm cursor-pointer text-white/70 hover:text-white transition-colors">
                              <LayoutDashboard className="h-4 w-4" /> Seller Dashboard
                            </div>
                          </Link>
                        )}
                        {user.role === "admin" && (
                          <Link href="/admin/dashboard" onClick={() => setShowAccountMenu(false)}>
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/6 text-sm cursor-pointer text-white/70 hover:text-white transition-colors">
                              <LayoutDashboard className="h-4 w-4" /> Admin Panel
                            </div>
                          </Link>
                        )}
                        <div className="border-t my-1" style={{ borderColor: "rgba(255,255,255,0.07)" }} />
                        <div
                          onClick={() => { logout(); setShowAccountMenu(false); }}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/10 text-sm cursor-pointer text-red-400 hover:text-red-300 transition-colors"
                        >
                          <LogOut className="h-4 w-4" /> Logout
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-3">
          <form
            onSubmit={handleSearch}
            className="flex items-center rounded-xl overflow-hidden green-ring-sm"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <div className="relative flex-1">
              <Input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="border-none bg-transparent shadow-none focus-visible:ring-0 h-9 px-4 text-sm text-white placeholder:text-white/30"
              />
            </div>
            <button
              type="submit"
              className="h-9 px-4 text-white"
              style={{ background: "linear-gradient(135deg, hsl(145 65% 32%), hsl(145 60% 40%))" }}
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>
      </header>

      {/* Sidebar */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSidebar(false)} />
          <div
            className="relative w-72 flex flex-col overflow-hidden glass-dark"
            style={{ marginTop: 94, height: "calc(100vh - 94px)", borderRight: "1px solid rgba(16,185,129,0.15)" }}
          >
            <div
              className="px-4 py-3 flex items-center justify-between shrink-0"
              style={{ background: "linear-gradient(135deg, hsl(160 35% 8%), hsl(265 30% 12%))", borderBottom: "1px solid rgba(16,185,129,0.15)" }}
            >
              <span className="text-white font-bold text-base tracking-wide text-gradient-green">Menu</span>
              <button
                onClick={() => setShowSidebar(false)}
                className="h-7 w-7 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-2">
              {sidebarLinks.map(link => {
                const Icon = link.icon;
                return (
                  <Link key={link.href} href={link.href} onClick={() => setShowSidebar(false)}>
                    <div className="flex items-center gap-3 px-4 py-3 hover:bg-emerald-500/8 transition-colors text-white/60 hover:text-white">
                      <Icon className="h-4 w-4 shrink-0 text-emerald-500" />
                      <span className="text-sm font-medium">{link.label}</span>
                    </div>
                  </Link>
                );
              })}
              {user?.role === "seller" && (
                <Link href="/seller/dashboard" onClick={() => setShowSidebar(false)}>
                  <div className="flex items-center gap-3 px-4 py-3 hover:bg-emerald-500/8 transition-colors text-white/60 hover:text-white border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <LayoutDashboard className="h-4 w-4 shrink-0 text-purple-400" />
                    <span className="text-sm font-medium">Seller Dashboard</span>
                  </div>
                </Link>
              )}
              {user?.role === "admin" && (
                <Link href="/admin/dashboard" onClick={() => setShowSidebar(false)}>
                  <div className="flex items-center gap-3 px-4 py-3 hover:bg-emerald-500/8 transition-colors text-white/60 hover:text-white border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <LayoutDashboard className="h-4 w-4 shrink-0 text-purple-400" />
                    <span className="text-sm font-medium">Admin Panel</span>
                  </div>
                </Link>
              )}
            </nav>
            <div className="p-4 border-t" style={{ borderColor: "rgba(16,185,129,0.12)" }}>
              {isGuest ? (
                <div className="flex gap-2">
                  <Link href="/login" className="flex-1" onClick={() => setShowSidebar(false)}>
                    <button
                      className="w-full h-9 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                      style={{ background: "linear-gradient(135deg, hsl(145 65% 32%), hsl(145 60% 40%))" }}
                    >
                      Login
                    </button>
                  </Link>
                  <Link href="/register" className="flex-1" onClick={() => setShowSidebar(false)}>
                    <button className="w-full h-9 rounded-xl text-sm font-medium text-white/70 border border-white/10 hover:bg-white/6 transition-all">
                      Register
                    </button>
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => { logout(); setShowSidebar(false); }}
                  className="w-full h-9 rounded-xl text-sm font-medium text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowLocationModal(false)} />
          <div
            className="relative rounded-2xl shadow-2xl w-full max-w-md p-6 glass-dark border"
            style={{ borderColor: "rgba(16,185,129,0.2)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                <MapPin className="h-5 w-5 text-emerald-400" /> Select Location
              </h2>
              <button onClick={() => setShowLocationModal(false)} className="text-white/40 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white/70 mb-1.5 block">District</label>
                <select
                  value={tempDistrict}
                  onChange={e => { setTempDistrict(e.target.value); setTempArea(""); }}
                  className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none text-white"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(16,185,129,0.25)" }}
                >
                  <option value="" className="bg-gray-900">-- Select District --</option>
                  {DISTRICTS.map(d => <option key={d} className="bg-gray-900">{d}</option>)}
                </select>
              </div>
              {tempDistrict && AREAS[tempDistrict] && (
                <div>
                  <label className="text-sm font-medium text-white/70 mb-1.5 block">Area</label>
                  <select
                    value={tempArea}
                    onChange={e => setTempArea(e.target.value)}
                    className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none text-white"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(16,185,129,0.25)" }}
                  >
                    <option value="" className="bg-gray-900">-- Select Area --</option>
                    {AREAS[tempDistrict].map(a => <option key={a} className="bg-gray-900">{a}</option>)}
                  </select>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setTempDistrict(""); setTempArea(""); }}
                  className="flex-1 h-10 rounded-xl text-sm text-white/50 border border-white/10 hover:bg-white/6 transition-all"
                >
                  Reset
                </button>
                <button
                  onClick={saveLocation}
                  className="flex-1 h-10 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, hsl(145 65% 32%), hsl(145 60% 40%))" }}
                >
                  <Check className="h-4 w-4 inline mr-1" /> Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
