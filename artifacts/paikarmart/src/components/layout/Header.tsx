import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import {
  Search, ShoppingCart, Bell, Menu, User, MapPin,
  X, ChevronDown, Home, Package, Store, LogOut,
  UserPlus, Check, ScanLine, Heart, ShoppingBag,
  HelpCircle, Zap
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useListNotifications } from "@workspace/api-client-react";

const DISTRICTS = ["Dhaka","Chittagong","Sylhet","Rajshahi","Khulna","Barisal","Rangpur","Mymensingh","Comilla","Gazipur"];
const AREAS: Record<string, string[]> = {
  Dhaka: ["Mirpur","Gulshan","Dhanmondi","Uttara","Banani","Mohammadpur","Old Dhaka"],
  Chittagong: ["Agrabad","GEC Circle","Pahartali"],
  Sylhet: ["Zindabazar","Ambarkhana"],
};

const GLOW  = "#00FF9C";
const RED   = "#FF3B3B";
const TEXT  = "#E8F5EE";
const MUTED = "#A3C9B8";

export function Header() {
  const { user, logout } = useAuth();
  const { totalItems }   = useCart();
  const [, navigate] = useLocation();

  const [searchQuery, setSearchQuery]           = useState("");
  const [showSidebar, setShowSidebar]           = useState(false);
  const [showAccountMenu, setShowAccountMenu]   = useState(false);
  const [showNotifMenu, setShowNotifMenu]       = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(() => localStorage.getItem("pm_district") || "Dhaka");
  const [selectedArea, setSelectedArea]         = useState(() => localStorage.getItem("pm_area") || "Mirpur");
  const [tempDistrict, setTempDistrict]         = useState(selectedDistrict);
  const [tempArea, setTempArea]                 = useState(selectedArea);

  const accountRef = useRef<HTMLDivElement>(null);
  const notifRef   = useRef<HTMLDivElement>(null);
  const { data: notifData } = useListNotifications({});
  const unread = notifData?.notifications?.filter(n => !n.read).length ?? 0;

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setShowAccountMenu(false);
      if (notifRef.current  && !notifRef.current.contains(e.target as Node))   setShowNotifMenu(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const saveLocation = useCallback(() => {
    setSelectedDistrict(tempDistrict); setSelectedArea(tempArea);
    localStorage.setItem("pm_district", tempDistrict);
    localStorage.setItem("pm_area", tempArea);
    setShowLocationModal(false);
  }, [tempDistrict, tempArea]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
  };

  const isGuest = !user || user.id === "guest";
  const locationLabel = selectedDistrict ? (selectedArea ? `${selectedArea}, ${selectedDistrict}` : selectedDistrict) : "Select Location";

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          HEADER — [Menu] [Search Pill Center] [Icons]
          ══════════════════════════════════════════════════════ */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: "rgba(6,26,18,0.88)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(0,255,156,0.06)",
        }}
      >
        {/* Single row: Menu | Search | Icons */}
        <div className="flex items-center gap-2 px-3 h-[60px]">

          {/* Menu button */}
          <button
            onClick={() => setShowSidebar(true)}
            className="shrink-0 h-10 w-10 flex items-center justify-center rounded-xl transition-all hover:bg-white/8"
            style={{ color: MUTED }}
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search pill — flex-1 center */}
          <form onSubmit={handleSearch} className="flex-1">
            <div
              className="flex items-center gap-2 px-4"
              style={{
                height: "40px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <Search className="h-4 w-4 shrink-0" style={{ color: MUTED }} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products, brands..."
                className="flex-1 bg-transparent border-none outline-none text-sm"
                style={{ color: TEXT }}
              />
            </div>
          </form>

          {/* Right icons: Wishlist | Cart | Profile */}
          <div className="shrink-0 flex items-center gap-0.5">

            {/* Wishlist */}
            <Link href="/wishlist">
              <button className="relative h-10 w-10 flex items-center justify-center rounded-xl transition-all hover:bg-white/8" style={{ color: MUTED }}>
                <Heart className="h-5 w-5" />
              </button>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <button className="relative h-10 w-10 flex items-center justify-center rounded-xl transition-all hover:bg-white/8" style={{ color: MUTED }}>
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 h-4 min-w-4 px-0.5 rounded-full text-[9px] font-bold flex items-center justify-center text-white" style={{ background: RED }}>{totalItems}</span>
                )}
              </button>
            </Link>

            {/* Profile */}
            <div ref={accountRef} className="relative">
              <button
                onClick={() => setShowAccountMenu(v => !v)}
                className="relative h-10 w-10 flex items-center justify-center rounded-xl transition-all hover:bg-white/8"
                style={{ color: MUTED }}
              >
                <User className="h-5 w-5" />
                {unread > 0 && (
                  <span className="absolute top-1 right-1 h-4 min-w-4 px-0.5 rounded-full text-[9px] font-bold flex items-center justify-center text-white" style={{ background: RED }}>{unread}</span>
                )}
              </button>

              {showAccountMenu && (
                <div
                  className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden z-50"
                  style={{ background: "rgba(8,28,18,0.97)", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 16px 48px rgba(0,0,0,0.5)", backdropFilter: "blur(28px)" }}
                >
                  {isGuest ? (
                    <div className="p-2 space-y-0.5">
                      {[
                        { href: "/login",             icon: User,     label: "Customer Login" },
                        { href: "/login?role=seller", icon: Store,    label: "Seller Login"   },
                        { href: "/register",          icon: UserPlus, label: "Sign Up Free"   },
                      ].map(item => (
                        <Link key={item.href} href={item.href} onClick={() => setShowAccountMenu(false)}>
                          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer text-sm transition-all hover:bg-white/6" style={{ color: MUTED }}>
                            <item.icon className="h-4 w-4" style={{ color: GLOW }} /> {item.label}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                        <p className="text-sm font-semibold" style={{ color: TEXT }}>{user.name}</p>
                        <p className="text-xs capitalize" style={{ color: MUTED }}>{user.role}</p>
                      </div>
                      <div className="p-2 space-y-0.5">
                        {[
                          { href: "/profile", icon: User,        label: "My Account" },
                          { href: "/orders",  icon: Package,     label: "My Orders"  },
                          { href: "/wallet",  icon: ShoppingBag, label: "Wallet"     },
                        ].map(item => (
                          <Link key={item.href} href={item.href} onClick={() => setShowAccountMenu(false)}>
                            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer text-sm transition-all hover:bg-white/6" style={{ color: MUTED }}>
                              <item.icon className="h-4 w-4" style={{ color: GLOW }} /> {item.label}
                            </div>
                          </Link>
                        ))}
                        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", margin: "4px 0" }} />
                        <div onClick={() => { logout(); setShowAccountMenu(false); }} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer text-sm transition-all hover:bg-red-900/20" style={{ color: RED }}>
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

        {/* Location row */}
        <button
          onClick={() => { setTempDistrict(selectedDistrict); setTempArea(selectedArea); setShowLocationModal(true); }}
          className="w-full flex items-center gap-2 px-4 py-1.5 text-xs transition-colors hover:bg-white/4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)", color: MUTED }}
        >
          <MapPin className="h-3 w-3 shrink-0" style={{ color: GLOW }} />
          <span>Deliver to: <span className="font-semibold" style={{ color: TEXT }}>{locationLabel}</span></span>
          <ChevronDown className="h-3 w-3 ml-auto opacity-40" />
        </button>
      </header>

      {/* ══════════════════════════════════════════════════════
          SIDEBAR
          ══════════════════════════════════════════════════════ */}
      {showSidebar && (
        <div className="fixed inset-0 z-[60] flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSidebar(false)} />
          <div className="relative w-72 flex flex-col overflow-hidden shadow-2xl" style={{ background: "#061A12", borderRight: "1px solid rgba(255,255,255,0.10)" }}>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <span className="font-extrabold text-lg font-['Outfit']">
                <span style={{ color: TEXT }}>Paikar</span>
                <span style={{ color: GLOW, textShadow: "0 0 12px rgba(0,255,156,0.5)" }}>Mart</span>
              </span>
              <button onClick={() => setShowSidebar(false)} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-white/8" style={{ color: MUTED }}>
                <X className="h-4 w-4" />
              </button>
            </div>

            {!isGuest && (
              <div className="px-5 py-3" style={{ background: "rgba(0,255,156,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: "rgba(0,255,156,0.15)", color: GLOW }}>
                    {user.name?.charAt(0) ?? "U"}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: TEXT }}>{user.name}</p>
                    <p className="text-xs capitalize" style={{ color: MUTED }}>{user.role}</p>
                  </div>
                </div>
              </div>
            )}

            <nav className="flex-1 overflow-y-auto py-2 px-2">
              {[
                { href: "/",         label: "Home",        icon: Home        },
                { href: "/feed",     label: "Feed",        icon: Zap         },
                { href: "/products", label: "Marketplace", icon: ShoppingBag },
                { href: "/vendors",  label: "All Vendors", icon: Store       },
                { href: "/orders",   label: "My Orders",   icon: Package     },
                { href: "/wishlist", label: "Wishlist",    icon: Heart       },
                { href: "/faq",      label: "Help & FAQ",  icon: HelpCircle  },
              ].map(link => (
                <Link key={link.href} href={link.href} onClick={() => setShowSidebar(false)}>
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm font-medium transition-all hover:bg-white/6" style={{ color: MUTED }}>
                    <link.icon className="h-4 w-4 shrink-0" style={{ color: GLOW }} />
                    {link.label}
                  </div>
                </Link>
              ))}
            </nav>

            <div className="p-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              {isGuest ? (
                <div className="flex gap-2">
                  <Link href="/login" className="flex-1" onClick={() => setShowSidebar(false)}>
                    <button className="w-full h-9 text-sm font-semibold rounded-xl btn-glow">Login</button>
                  </Link>
                  <Link href="/register" className="flex-1" onClick={() => setShowSidebar(false)}>
                    <button className="w-full h-9 text-sm font-semibold rounded-xl btn-outline">Register</button>
                  </Link>
                </div>
              ) : (
                <button onClick={() => { logout(); setShowSidebar(false); }} className="w-full h-9 text-sm font-medium rounded-xl border flex items-center justify-center gap-2 transition-all hover:bg-red-900/20" style={{ borderColor: "rgba(255,59,59,0.35)", color: RED }}>
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          LOCATION MODAL
          ══════════════════════════════════════════════════════ */}
      {showLocationModal && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowLocationModal(false)} />
          <div className="relative w-full max-w-md p-6 glass-card animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold flex items-center gap-2" style={{ color: TEXT }}>
                <MapPin className="h-5 w-5" style={{ color: GLOW }} /> Select Delivery Location
              </h2>
              <button onClick={() => setShowLocationModal(false)} className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-white/8" style={{ color: MUTED }}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: MUTED }}>District</label>
                <select value={tempDistrict} onChange={e => { setTempDistrict(e.target.value); setTempArea(""); }} className="w-full rounded-xl px-3 py-2.5 text-sm input-glass">
                  <option value="" className="bg-[#0B2B1F]">-- Select District --</option>
                  {DISTRICTS.map(d => <option key={d} className="bg-[#0B2B1F]">{d}</option>)}
                </select>
              </div>
              {tempDistrict && AREAS[tempDistrict] && (
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: MUTED }}>Area / Thana</label>
                  <select value={tempArea} onChange={e => setTempArea(e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm input-glass">
                    <option value="" className="bg-[#0B2B1F]">-- Select Area --</option>
                    {AREAS[tempDistrict].map(a => <option key={a} className="bg-[#0B2B1F]">{a}</option>)}
                  </select>
                </div>
              )}
              {tempDistrict && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm glass-inner" style={{ color: GLOW }}>
                  <Check className="h-4 w-4" /> {tempArea ? `${tempArea}, ` : ""}{tempDistrict}
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => { setTempDistrict(""); setTempArea(""); }} className="flex-1 h-10 text-sm font-medium rounded-xl btn-outline">Reset</button>
              <button onClick={saveLocation} className="flex-1 h-10 text-sm font-semibold rounded-xl btn-glow">Save Location</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
