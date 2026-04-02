import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  Search, ShoppingCart, Bell, Menu, User, MapPin, Globe,
  X, ChevronDown, Home, Package, Store, Tag, TrendingUp,
  HeadphonesIcon, Building2, ShoppingBag, Heart, Settings,
  LogOut, LayoutDashboard, Smartphone, HelpCircle, UserPlus,
  Check
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
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
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

  const resetLocation = () => {
    setTempDistrict("");
    setTempArea("");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(searchCategory)}`);
      setShowSearchSuggestions(false);
    }
  };

  const isGuest = !user || user.id === "guest";
  const locationLabel = selectedDistrict ? (selectedArea ? `${selectedArea}, ${selectedDistrict}` : selectedDistrict) : "Select Location";

  const sidebarLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/products", label: "All Products", icon: ShoppingBag },
    { href: "/vendors", label: "All Vendors", icon: Store },
    { href: "/vendors?type=wholesale", label: "Wholesale", icon: Package },
    { href: "/vendors?type=retail", label: "Retail", icon: Tag },
    { href: "/vendors?type=brand_seller", label: "Brand Shops", icon: Building2 },
    { href: "/vendors?type=dropship", label: "Dropship", icon: TrendingUp },
    { href: "/vendors?type=service", label: "Services", icon: HeadphonesIcon },
    { href: "/vendors?type=local_shop", label: "Local Shops", icon: Store },
    { href: "/orders", label: "My Orders", icon: Package },
    { href: "/wallet", label: "Wallet", icon: ShoppingBag },
    { href: "/faq", label: "FAQ", icon: HelpCircle },
    { href: "/terms", label: "Terms", icon: HelpCircle },
  ];

  return (
    <>
      {/* Top Mini Header */}
      <div className="w-full bg-gray-900 text-gray-300 text-xs py-1.5 px-4 z-50 sticky top-0">
        <div className="container mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <a href="#" className="flex items-center gap-1 hover:text-white transition-colors">
              <Smartphone className="h-3 w-3" /> Download App
            </a>
            <a href="/faq" className="flex items-center gap-1 hover:text-white transition-colors">
              <HelpCircle className="h-3 w-3" /> Help & Support
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/seller/register" className="hover:text-green-400 transition-colors font-medium">Become a Seller</Link>
            {isGuest ? (
              <>
                <Link href="/login" className="hover:text-white transition-colors">Login</Link>
                <Link href="/register" className="hover:text-white transition-colors">Sign Up</Link>
              </>
            ) : (
              <span className="text-green-400">Welcome, {user.name.split(" ")[0]}</span>
            )}
            <span className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
              <Globe className="h-3 w-3" /> EN / বাংলা
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-[30px] z-40 w-full border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-3">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <Button variant="ghost" size="icon" onClick={() => setShowSidebar(true)} className="shrink-0">
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/" className="flex items-center gap-1.5">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center shadow">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="font-bold text-xl hidden sm:inline-block">
                <span className="bg-gradient-to-r from-green-700 to-emerald-500 bg-clip-text text-transparent">Paikar</span>
                <span className="bg-gradient-to-r from-red-700 to-rose-500 bg-clip-text text-transparent">Mart</span>
              </span>
            </Link>
          </div>

          {/* Center: Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:flex items-center gap-0 border border-gray-200 rounded-full overflow-hidden shadow-sm bg-gray-50 focus-within:ring-2 focus-within:ring-green-500/30 focus-within:border-green-500 transition-all">
            <div className="relative">
              <select
                value={searchCategory}
                onChange={e => setSearchCategory(e.target.value)}
                className="h-10 pl-3 pr-7 text-sm bg-transparent border-r border-gray-200 text-gray-700 focus:outline-none cursor-pointer appearance-none"
              >
                {SEARCH_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative flex-1">
              <Input
                type="text"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setShowSearchSuggestions(e.target.value.length > 0); }}
                onFocus={() => searchQuery.length > 0 && setShowSearchSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 150)}
                placeholder="Search products, brands, categories..."
                className="border-none bg-transparent shadow-none focus-visible:ring-0 rounded-none h-10 px-4"
              />
              {showSearchSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
                  {["Electronics", "Fashion", "Grocery"].filter(s => s.toLowerCase().includes(searchQuery.toLowerCase())).map(s => (
                    <div key={s} onClick={() => { setSearchQuery(s); setShowSearchSuggestions(false); }}
                      className="px-4 py-2.5 hover:bg-green-50 cursor-pointer text-sm flex items-center gap-2">
                      <Search className="h-3 w-3 text-muted-foreground" /> {s}
                    </div>
                  ))}
                  <div onClick={() => { navigate(`/products?q=${encodeURIComponent(searchQuery)}`); setShowSearchSuggestions(false); }}
                    className="px-4 py-2.5 hover:bg-green-50 cursor-pointer text-sm text-green-600 font-medium flex items-center gap-2">
                    <Search className="h-3 w-3" /> Search for "{searchQuery}"
                  </div>
                </div>
              )}
            </div>
            <button type="submit" className="h-10 px-5 bg-green-600 hover:bg-green-700 text-white font-medium transition-colors text-sm rounded-r-full">
              Search
            </button>
          </form>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              onClick={() => { setTempDistrict(selectedDistrict); setTempArea(selectedArea); setShowLocationModal(true); }}
              className="hidden lg:flex items-center gap-1.5 text-sm text-gray-600 hover:text-green-600"
              size="sm"
            >
              <MapPin className="h-4 w-4 text-green-600" />
              <span className="max-w-[100px] truncate">{locationLabel}</span>
            </Button>

            {/* Notification Bell */}
            <div ref={notifRef} className="relative">
              <Button variant="ghost" size="icon" onClick={() => setShowNotifMenu(v => !v)} className="relative">
                <Bell className="h-5 w-5" />
                {unread > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">{unread}</span>
                )}
              </Button>
              {showNotifMenu && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b flex items-center justify-between">
                    <span className="font-semibold text-sm">Notifications</span>
                    <Link href="/notifications" className="text-xs text-green-600 hover:underline" onClick={() => setShowNotifMenu(false)}>View All</Link>
                  </div>
                  <div className="divide-y max-h-72 overflow-y-auto">
                    {notifData?.notifications?.slice(0, 5).map(n => (
                      <div key={n.id} className={`px-4 py-3 text-sm ${!n.read ? "bg-green-50" : ""}`}>
                        <p className="font-medium text-gray-800 line-clamp-1">{n.title}</p>
                        <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">{n.message}</p>
                      </div>
                    )) || (
                      <div className="px-4 py-6 text-center text-sm text-muted-foreground">No notifications</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-green-600 text-white text-[10px] font-bold flex items-center justify-center">{totalItems}</span>
                )}
              </Button>
            </Link>

            {/* Account Dropdown */}
            <div ref={accountRef} className="relative">
              <Button variant="ghost" size="icon" onClick={() => setShowAccountMenu(v => !v)}>
                <User className="h-5 w-5" />
              </Button>
              {showAccountMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  {isGuest ? (
                    <>
                      <div className="px-4 py-3 bg-green-50 border-b">
                        <p className="text-sm font-semibold text-green-800">Welcome to PaikarMart</p>
                        <p className="text-xs text-green-600">Sign in for the best experience</p>
                      </div>
                      <div className="p-2 space-y-1">
                        <Link href="/login" onClick={() => setShowAccountMenu(false)}>
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 text-sm cursor-pointer">
                            <User className="h-4 w-4 text-green-600" /> Customer Login
                          </div>
                        </Link>
                        <Link href="/login?role=seller" onClick={() => setShowAccountMenu(false)}>
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 text-sm cursor-pointer">
                            <Store className="h-4 w-4 text-green-600" /> Seller Login
                          </div>
                        </Link>
                        <Link href="/register" onClick={() => setShowAccountMenu(false)}>
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 text-sm cursor-pointer font-medium text-green-700">
                            <UserPlus className="h-4 w-4" /> Sign Up Free
                          </div>
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-3 bg-green-50 border-b">
                        <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                        <p className="text-xs text-green-600 capitalize">{user.role}</p>
                      </div>
                      <div className="p-2 space-y-1">
                        <Link href="/profile" onClick={() => setShowAccountMenu(false)}>
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm cursor-pointer">
                            <User className="h-4 w-4" /> My Account
                          </div>
                        </Link>
                        <Link href="/orders" onClick={() => setShowAccountMenu(false)}>
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm cursor-pointer">
                            <Package className="h-4 w-4" /> My Orders
                          </div>
                        </Link>
                        <Link href="/wallet" onClick={() => setShowAccountMenu(false)}>
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm cursor-pointer">
                            <ShoppingBag className="h-4 w-4" /> Wallet
                          </div>
                        </Link>
                        {user.role === "seller" && (
                          <Link href="/seller/dashboard" onClick={() => setShowAccountMenu(false)}>
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm cursor-pointer">
                              <LayoutDashboard className="h-4 w-4" /> Seller Dashboard
                            </div>
                          </Link>
                        )}
                        {user.role === "admin" && (
                          <Link href="/admin/dashboard" onClick={() => setShowAccountMenu(false)}>
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm cursor-pointer">
                              <LayoutDashboard className="h-4 w-4" /> Admin Panel
                            </div>
                          </Link>
                        )}
                        <div className="border-t my-1" />
                        <div onClick={() => { logout(); setShowAccountMenu(false); }}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-sm cursor-pointer text-red-600">
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
          <form onSubmit={handleSearch} className="flex items-center gap-0 border border-gray-200 rounded-full overflow-hidden bg-gray-50">
            <div className="relative flex-1">
              <Input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="border-none bg-transparent shadow-none focus-visible:ring-0 h-9 px-4 text-sm"
              />
            </div>
            <button type="submit" className="h-9 px-4 bg-green-600 text-white rounded-r-full">
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>
      </header>

      {/* Sidebar */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowSidebar(false)} />
          <div className="relative w-72 bg-white h-full shadow-2xl flex flex-col overflow-hidden" style={{ marginTop: 0 }}>
            <div className="h-16 flex items-center justify-between px-4 bg-gradient-to-r from-green-700 to-emerald-600">
              <Link href="/" className="flex items-center gap-2" onClick={() => setShowSidebar(false)}>
                <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">P</span>
                </div>
                <span className="text-white font-bold text-xl">PaikarMart</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setShowSidebar(false)} className="text-white hover:bg-white/20">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex-1 overflow-y-auto py-2">
              {sidebarLinks.map(link => {
                const Icon = link.icon;
                return (
                  <Link key={link.href} href={link.href} onClick={() => setShowSidebar(false)}>
                    <div className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 hover:text-green-700 transition-colors text-gray-700">
                      <Icon className="h-4 w-4 shrink-0 text-green-600" />
                      <span className="text-sm font-medium">{link.label}</span>
                    </div>
                  </Link>
                );
              })}
              {user?.role === "seller" && (
                <Link href="/seller/dashboard" onClick={() => setShowSidebar(false)}>
                  <div className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 hover:text-green-700 transition-colors text-gray-700 border-t">
                    <LayoutDashboard className="h-4 w-4 shrink-0 text-green-600" />
                    <span className="text-sm font-medium">Seller Dashboard</span>
                  </div>
                </Link>
              )}
              {user?.role === "admin" && (
                <Link href="/admin/dashboard" onClick={() => setShowSidebar(false)}>
                  <div className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 hover:text-green-700 transition-colors text-gray-700 border-t">
                    <LayoutDashboard className="h-4 w-4 shrink-0 text-green-600" />
                    <span className="text-sm font-medium">Admin Panel</span>
                  </div>
                </Link>
              )}
            </nav>
            <div className="p-4 border-t bg-gray-50">
              {isGuest ? (
                <div className="flex gap-2">
                  <Link href="/login" className="flex-1" onClick={() => setShowSidebar(false)}>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white" size="sm">Login</Button>
                  </Link>
                  <Link href="/register" className="flex-1" onClick={() => setShowSidebar(false)}>
                    <Button variant="outline" className="w-full" size="sm">Register</Button>
                  </Link>
                </div>
              ) : (
                <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50" size="sm" onClick={() => { logout(); setShowSidebar(false); }}>
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowLocationModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2"><MapPin className="h-5 w-5 text-green-600" /> Select Your Location</h2>
              <button onClick={() => setShowLocationModal(false)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">District</label>
                <select
                  value={tempDistrict}
                  onChange={e => { setTempDistrict(e.target.value); setTempArea(""); }}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">-- Select District --</option>
                  {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              {tempDistrict && AREAS[tempDistrict] && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Area / Thana</label>
                  <select
                    value={tempArea}
                    onChange={e => setTempArea(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">-- Select Area --</option>
                    {AREAS[tempDistrict].map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
              )}
              {tempDistrict && (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg text-sm text-green-700">
                  <Check className="h-4 w-4" /> {tempArea ? `${tempArea}, ` : ""}{tempDistrict}
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={resetLocation} className="flex-1">Reset</Button>
              <Button onClick={saveLocation} className="flex-1 bg-green-600 hover:bg-green-700">Save Location</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
