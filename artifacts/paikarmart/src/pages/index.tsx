import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useListProducts, useListSellers } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Store, Tag, TrendingUp, Package, HeadphonesIcon, Building2,
  Star, ShoppingCart, Zap, ChevronLeft, ChevronRight,
  ShieldCheck, CreditCard, Truck, Award, MapPin
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import type { Product } from "@workspace/api-client-react";

const HERO_SLIDES = [
  {
    id: 1,
    gradient: "from-green-800 via-green-700 to-emerald-600",
    eyebrow: "Welcome to PaikarMart",
    headline: "The Premium Market for Bangladesh",
    sub: "Connect with wholesalers, brands, and local shops. Get the best prices with reliable delivery.",
    cta1: { label: "Start Shopping", href: "/products" },
    cta2: { label: "Become a Seller", href: "/seller/register" },
    badge: "🚀 10,000+ Products Listed",
    img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
  },
  {
    id: 2,
    gradient: "from-blue-900 via-blue-800 to-blue-700",
    eyebrow: "Wholesale Marketplace",
    headline: "Buy in Bulk, Save More",
    sub: "Access thousands of wholesale suppliers across Bangladesh. MOQ as low as 10 units.",
    cta1: { label: "Browse Wholesale", href: "/vendors?type=wholesale" },
    cta2: { label: "Register as Seller", href: "/seller/register" },
    badge: "💰 Up to 60% Wholesale Savings",
    img: "https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?w=600&q=80",
  },
  {
    id: 3,
    gradient: "from-purple-900 via-purple-800 to-violet-700",
    eyebrow: "Digital & Services",
    headline: "Software, Services & Digital Products",
    sub: "Find professional services, digital downloads, and software licenses all in one place.",
    cta1: { label: "Explore Services", href: "/vendors?type=service" },
    cta2: { label: "List Your Service", href: "/seller/register" },
    badge: "⚡ Instant Digital Delivery",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
  },
];

const CATEGORIES = [
  { name: "Wholesale", icon: Package, desc: "Bulk orders at lowest prices", href: "/vendors?type=wholesale", color: "bg-orange-100 text-orange-600" },
  { name: "Retail", icon: Tag, desc: "Single items, personal use", href: "/vendors?type=retail", color: "bg-blue-100 text-blue-600" },
  { name: "Brand Seller", icon: Building2, desc: "Official brand stores", href: "/vendors?type=brand_seller", color: "bg-purple-100 text-purple-600" },
  { name: "Dropship", icon: TrendingUp, desc: "Sell with zero inventory", href: "/vendors?type=dropship", color: "bg-teal-100 text-teal-600" },
  { name: "Service", icon: HeadphonesIcon, desc: "Professional services", href: "/vendors?type=service", color: "bg-pink-100 text-pink-600" },
  { name: "Local Shop", icon: Store, desc: "Stores near you", href: "/vendors?type=local_shop", color: "bg-yellow-100 text-yellow-600" },
];

const PROMO_BANNERS_1 = [
  { title: "Flash Sale", sub: "Electronics up to 40% off", color: "from-orange-500 to-red-500", href: "/products?category=Electronics" },
  { title: "New Arrivals", sub: "Fresh fashion collections", color: "from-pink-500 to-purple-500", href: "/products?category=Fashion" },
  { title: "Wholesale Hub", sub: "MOQ deals for resellers", color: "from-blue-500 to-cyan-500", href: "/vendors?type=wholesale" },
];

function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [, navigate] = useLocation();

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[current];

  return (
    <section className={`relative bg-gradient-to-r ${slide.gradient} text-white overflow-hidden transition-all duration-700`} style={{ minHeight: 420 }}>
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_70%_50%,white,transparent)]" />
      <div className="container mx-auto px-4 py-14 lg:py-20 flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-4 border border-white/30">
            {slide.badge}
          </div>
          <p className="text-white/70 font-medium text-sm mb-2 uppercase tracking-widest">{slide.eyebrow}</p>
          <h1 className="text-3xl lg:text-5xl font-extrabold mb-4 leading-tight">{slide.headline}</h1>
          <p className="text-white/80 text-base lg:text-lg mb-8 max-w-lg">{slide.sub}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
            <Button size="lg" variant="secondary" onClick={() => navigate(slide.cta1.href)} className="w-full sm:w-auto font-bold">
              {slide.cta1.label}
            </Button>
            <Button size="lg" onClick={() => navigate(slide.cta2.href)} className="w-full sm:w-auto bg-white/20 border border-white/40 hover:bg-white/30 text-white backdrop-blur-sm">
              {slide.cta2.label}
            </Button>
          </div>
        </div>
        <div className="hidden lg:block w-80 h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 shrink-0">
          <img src={slide.img} alt={slide.headline} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Slide Navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        <button onClick={() => setCurrent(c => (c - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center border border-white/30 transition-colors">
          <ChevronLeft className="h-4 w-4 text-white" />
        </button>
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? "w-8 h-2.5 bg-white" : "w-2.5 h-2.5 bg-white/50"}`} />
        ))}
        <button onClick={() => setCurrent(c => (c + 1) % HERO_SLIDES.length)}
          className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center border border-white/30 transition-colors">
          <ChevronRight className="h-4 w-4 text-white" />
        </button>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [, navigate] = useLocation();
  const [adding, setAdding] = useState(false);

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

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1 border-gray-100 h-full flex flex-col">
        <div className="aspect-square bg-gray-50 relative overflow-hidden">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <Package className="h-12 w-12" />
            </div>
          )}
          {product.inStock === false && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
          {product.type === "digital" && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-blue-600 text-white text-[10px]">Digital</Badge>
            </div>
          )}
        </div>
        <CardContent className="p-3 flex flex-col flex-1">
          <div className="text-[10px] text-green-600 font-semibold uppercase tracking-wide mb-1">{product.category}</div>
          <h3 className="font-medium text-sm line-clamp-2 mb-1.5 group-hover:text-green-700 transition-colors text-gray-800 flex-1">{product.name}</h3>
          <p className="text-xs text-gray-500 mb-2 line-clamp-1 flex items-center gap-1">
            <Store className="h-3 w-3 shrink-0" /> {product.vendorName}
          </p>
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} className={`h-3 w-3 ${s <= Math.round(product.rating || 4) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`} />
            ))}
            <span className="text-[10px] text-gray-500 ml-0.5">({product.reviewCount || 0})</span>
          </div>
          <div className="mb-3">
            {product.priceOnInquiry ? (
              <span className="text-sm font-bold text-orange-600">Price on Request</span>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-base text-gray-900">৳{product.price?.toLocaleString()}</span>
                {originalPrice > 0 && (
                  <span className="text-xs text-gray-400 line-through">৳{originalPrice.toLocaleString()}</span>
                )}
              </div>
            )}
            {product.moq && <p className="text-[10px] text-orange-500 mt-0.5">MOQ: {product.moq} units</p>}
          </div>
          <div className="flex gap-1.5">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-8 text-xs border-green-200 hover:border-green-500 hover:text-green-600"
              onClick={handleAdd}
              disabled={adding || product.inStock === false}
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              {adding ? "Added!" : "Add"}
            </Button>
            <Button
              size="sm"
              className="flex-1 h-8 text-xs bg-green-600 hover:bg-green-700"
              onClick={handleBuyNow}
              disabled={product.priceOnInquiry || product.inStock === false}
            >
              <Zap className="h-3 w-3 mr-1" /> Buy Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function VendorCard({ seller }: { seller: any }) {
  return (
    <Link href={`/vendors/${seller.id}`}>
      <Card className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden h-full">
        <div className="h-28 bg-gradient-to-br from-green-100 to-emerald-50 relative overflow-hidden">
          {seller.image && <img src={seller.image} alt={seller.shopName} className="w-full h-full object-cover opacity-60" />}
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-green-600 text-white text-[10px] capitalize">{seller.businessType?.replace("_", " ")}</Badge>
          </div>
        </div>
        <CardContent className="p-3">
          <h3 className="font-semibold text-sm line-clamp-1 mb-1">{seller.shopName}</h3>
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <MapPin className="h-3 w-3 text-green-600" /> {seller.district || seller.location || "Bangladesh"}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-medium">{seller.rating?.toFixed(1) || "4.0"}</span>
            </div>
            <Button size="sm" variant="outline" className="h-6 text-[10px] border-green-200 text-green-700 hover:bg-green-50 px-2">Visit Store</Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function Home() {
  const [, navigate] = useLocation();
  const { data: productsData, isLoading: productsLoading } = useListProducts({ limit: 8 });
  const { data: sellersData, isLoading: sellersLoading } = useListSellers({ status: "active" });

  const products = productsData?.products || [];
  const sellers = sellersData?.sellers?.slice(0, 4) || [];

  return (
    <Layout>
      {/* Feed / Marketplace Toggle */}
      <div className="sticky z-30" style={{ top: "94px" }}>
        <div className="glass border-b" style={{ borderColor: "hsl(42 72% 50% / 0.2)" }}>
          <div className="container mx-auto px-4">
            <div className="flex items-center h-11 gap-1">
              <div className="flex items-center bg-white/60 rounded-full p-1 gold-ring-sm">
                <button
                  onClick={() => navigate("/feed")}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium text-gray-500 hover:text-gray-700 transition-all"
                >
                  🏠 Feed
                </button>
                <button
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white transition-all"
                  style={{ background: "linear-gradient(135deg, hsl(350 55% 28%), hsl(350 55% 38%))" }}
                >
                  🛍️ Marketplace
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <HeroSlider />

      {/* Promo Banners */}
      <section className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PROMO_BANNERS_1.map(b => (
            <Link key={b.title} href={b.href}>
              <div className={`bg-gradient-to-r ${b.color} rounded-xl p-5 text-white cursor-pointer hover:opacity-90 transition-opacity`}>
                <h3 className="font-bold text-base">{b.title}</h3>
                <p className="text-white/80 text-sm mt-1">{b.sub}</p>
                <span className="text-xs mt-3 inline-block bg-white/20 px-3 py-1 rounded-full">Shop Now →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-12 container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Shop by Vendor Type</h2>
          <Link href="/vendors"><Button variant="ghost" size="sm" className="text-green-600">View All</Button></Link>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <Link key={cat.name} href={cat.href}>
                <Card className="hover:border-green-400 hover:shadow-md transition-all cursor-pointer h-full group">
                  <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                    <div className={`h-11 w-11 rounded-full ${cat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-gray-800 group-hover:text-green-700">{cat.name}</h3>
                      <p className="text-[10px] text-gray-500 hidden sm:block mt-0.5">{cat.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <Link href="/products"><Button variant="ghost" size="sm" className="text-green-600">View All →</Button></Link>
          </div>
          {productsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          )}
        </div>
      </section>

      {/* Promo Ad Section 2 */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-green-700 to-emerald-600 rounded-2xl p-8 text-white flex items-center justify-between overflow-hidden relative">
            <div className="absolute right-0 top-0 h-full w-48 opacity-10 bg-[radial-gradient(circle,white,transparent)]" />
            <div>
              <p className="text-white/70 text-sm mb-1">For Sellers</p>
              <h3 className="text-2xl font-bold mb-2">Start Selling Today</h3>
              <p className="text-white/80 text-sm mb-4">Join 500+ active sellers on PaikarMart</p>
              <Link href="/seller/register">
                <Button variant="secondary" size="sm" className="font-semibold">Register as Seller</Button>
              </Link>
            </div>
            <Store className="h-24 w-24 text-white/20 shrink-0" />
          </div>
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-8 text-white flex items-center justify-between overflow-hidden relative">
            <div>
              <p className="text-white/70 text-sm mb-1">Wholesale Hub</p>
              <h3 className="text-2xl font-bold mb-2">B2B Marketplace</h3>
              <p className="text-white/80 text-sm mb-4">Bulk deals for business buyers</p>
              <Link href="/vendors?type=wholesale">
                <Button variant="outline" size="sm" className="text-white border-white/40 hover:bg-white/10">Explore Wholesale</Button>
              </Link>
            </div>
            <Package className="h-24 w-24 text-white/20 shrink-0" />
          </div>
        </div>
      </section>

      {/* Vendors Section */}
      {sellers.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Featured Vendors</h2>
              <Link href="/vendors"><Button variant="ghost" size="sm" className="text-green-600">View All →</Button></Link>
            </div>
            {sellersLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40 rounded-xl" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sellers.map(s => <VendorCard key={s.id} seller={s} />)}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Trust Section */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-10 text-gray-900">Why Choose PaikarMart?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: ShieldCheck, title: "Verified Sellers", desc: "Every seller is verified for your safety.", color: "bg-green-100 text-green-600" },
            { icon: CreditCard, title: "Secure Payments", desc: "Multiple secure payment methods.", color: "bg-blue-100 text-blue-600" },
            { icon: Truck, title: "Fast Delivery", desc: "Delivery across all Bangladesh.", color: "bg-orange-100 text-orange-600" },
            { icon: Award, title: "Quality Assured", desc: "Products meet quality standards.", color: "bg-purple-100 text-purple-600" },
          ].map(f => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className={`h-14 w-14 rounded-full ${f.color} flex items-center justify-center mb-4`}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="font-bold mb-2 text-gray-800">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </Layout>
  );
}
