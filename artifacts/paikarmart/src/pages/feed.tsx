import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Layout } from "@/components/layout/Layout";
import {
  Heart, MessageCircle, ShoppingCart, Share2, Bookmark,
  MapPin, Store, ShoppingBag, Zap, ChevronRight, MoreHorizontal,
  Star, Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";
import { useListProducts } from "@workspace/api-client-react";
import type { Product } from "@workspace/api-zod/src/generated/types";
import { toast } from "sonner";

const FEED_CATEGORIES = [
  { id: "all", label: "সব", emoji: "🏠" },
  { id: "electronics", label: "Electronics", emoji: "📱" },
  { id: "fashion", label: "Fashion", emoji: "👗" },
  { id: "food", label: "Food", emoji: "🍔" },
  { id: "home", label: "Home & Living", emoji: "🏡" },
  { id: "wholesale", label: "Wholesale", emoji: "📦" },
  { id: "services", label: "Services", emoji: "🔧" },
  { id: "beauty", label: "Beauty", emoji: "💄" },
];

function timeAgo(i: number) {
  const times = ["২ মিনিট আগে", "১৫ মিনিট আগে", "৩০ মিনিট আগে", "১ ঘণ্টা আগে", "২ ঘণ্টা আগে", "৫ ঘণ্টা আগে"];
  return times[i % times.length];
}

function initials(name: string) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

function PostCard({ product, index }: { product: Product; index: number }) {
  const { addToCart } = useCart();
  const [, navigate] = useLocation();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saves, setSaves] = useState(Math.floor(Math.random() * 200) + 10);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      productName: product.name,
      vendorId: product.vendorId,
      vendorName: product.vendorName,
      quantity: 1,
      price: product.price || 0,
      image: product.images?.[0] || "",
    });
    toast.success("Cart-এ যোগ হয়েছে!", { duration: 2000 });
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: product.name, url: `${window.location.origin}/products/${product.id}` });
    } else {
      await navigator.clipboard.writeText(`${window.location.origin}/products/${product.id}`);
      toast("Link copied!", { duration: 1500 });
    }
  };

  const originalPrice = product.price ? Math.round(product.price * 1.18) : 0;
  const discount = product.price ? Math.round(((originalPrice - product.price) / originalPrice) * 100) : 0;

  return (
    <article className="bg-white/85 backdrop-blur-sm rounded-2xl overflow-hidden gold-ring-sm shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <Link href={`/vendors/${product.vendorId}`} className="flex items-center gap-3 group">
          <div className="h-11 w-11 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md shrink-0"
            style={{ background: "linear-gradient(135deg, hsl(350 55% 28%), hsl(350 55% 42%))", border: "2px solid hsl(42 72% 50% / 0.5)" }}>
            {initials(product.vendorName)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-gray-800 group-hover:underline">{product.vendorName}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium text-white" style={{ background: "hsl(42 72% 45%)" }}>✓ Verified</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <MapPin className="h-2.5 w-2.5" /> {product.location || "Bangladesh"}
              <span>•</span>
              <span>{timeAgo(index)}</span>
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-xs px-3 gold-ring-sm font-medium" style={{ color: "hsl(350 55% 32%)", borderColor: "transparent" }}>
            Follow
          </Button>
          <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <Package className="h-12 w-12 text-gray-300" />
          </div>
        )}
        {discount > 0 && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold text-white shadow" style={{ background: "hsl(350 55% 30%)" }}>
            -{discount}% OFF
          </div>
        )}
        {product.stock !== null && product.stock !== undefined && product.stock <= 10 && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold text-white bg-orange-500 shadow">
            মাত্র {product.stock}টি বাকি
          </div>
        )}
      </div>

      <div className="px-4 pt-3 pb-2">
        <h3 className="font-semibold text-gray-800 text-sm leading-snug mb-1">{product.name}</h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-2">{product.description}</p>
        <div className="flex items-center gap-2">
          {product.priceOnInquiry ? (
            <span className="text-sm font-semibold text-gray-500">Price on Inquiry</span>
          ) : (
            <>
              <span className="text-lg font-bold" style={{ color: "hsl(350 55% 32%)" }}>৳{(product.price || 0).toLocaleString()}</span>
              {originalPrice > (product.price || 0) && (
                <span className="text-xs text-gray-400 line-through">৳{originalPrice.toLocaleString()}</span>
              )}
            </>
          )}
          <span className="text-xs text-gray-400 ml-auto">{product.category}</span>
        </div>
      </div>

      <div className="px-4 py-1.5 flex items-center gap-3 text-xs text-gray-400 border-b border-gray-100">
        <span>❤️ {saves} saves</span>
        <span>⭐ {product.rating?.toFixed(1) || "4.5"}</span>
        <span>📦 {product.reviewCount || 0} reviews</span>
      </div>

      <div className="px-3 py-2 grid grid-cols-5 gap-1">
        <button onClick={() => { setLiked(l => !l); setSaves(s => liked ? s - 1 : s + 1); }}
          className="flex flex-col items-center gap-1 py-2 rounded-xl text-xs transition-all hover:bg-rose-50"
          style={{ color: liked ? "hsl(350 55% 32%)" : "#9ca3af" }}>
          <Heart className="h-4 w-4" fill={liked ? "hsl(350 55% 32%)" : "none"} />
          <span>Save</span>
        </button>
        <button className="flex flex-col items-center gap-1 py-2 rounded-xl text-xs text-gray-400 transition-all hover:bg-gray-50 hover:text-gray-600">
          <MessageCircle className="h-4 w-4" />
          <span>Q&amp;A</span>
        </button>
        <button onClick={handleAddToCart}
          className="flex flex-col items-center gap-1 py-2 rounded-xl text-xs transition-all hover:bg-rose-50"
          style={{ color: "hsl(350 55% 32%)" }}>
          <ShoppingCart className="h-4 w-4" />
          <span>Cart</span>
        </button>
        <button onClick={handleShare}
          className="flex flex-col items-center gap-1 py-2 rounded-xl text-xs text-gray-400 transition-all hover:bg-gray-50 hover:text-gray-600">
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </button>
        <button onClick={() => setSaved(s => !s)}
          className="flex flex-col items-center gap-1 py-2 rounded-xl text-xs transition-all hover:bg-amber-50"
          style={{ color: saved ? "hsl(42 72% 45%)" : "#9ca3af" }}>
          <Bookmark className="h-4 w-4" fill={saved ? "hsl(42 72% 42%)" : "none"} />
          <span>Wishlist</span>
        </button>
      </div>

      <div className="px-3 pb-3">
        <button onClick={() => navigate(`/products/${product.id}`)}
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, hsl(350 55% 28%), hsl(350 55% 40%))", boxShadow: "0 2px 8px hsl(350 55% 28% / 0.35)" }}>
          <Zap className="h-4 w-4" /> এখনই কিনুন
        </button>
      </div>
    </article>
  );
}

const MOCK_POSTS_COMPAT = [
  {
    id: "1",
    seller: { name: "Rahman Electronics", avatar: "RE", district: "Mirpur, Dhaka", verified: true, rating: 4.8, followers: 1240 },
    timeAgo: "২ মিনিট আগে",
    product: {
      title: "Samsung Galaxy A55 5G — অফিশিয়াল",
      description: "১২GB RAM, ২৫৬GB Storage। বাংলাদেশ অফিশিয়াল। ১ বছর ওয়ারেন্টি সহ। সীমিত স্টক!",
      price: 42500,
      originalPrice: 48000,
      unit: "piece",
      images: ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80"],
      category: "electronics",
      stock: 8,
      discount: 11,
    },
    saves: 142, comments: 23, shares: 18, liked: false, saved: false,
  },
  {
    id: "2",
    seller: { name: "Dhaka Fashion House", avatar: "DF", district: "Gulshan, Dhaka", verified: true, rating: 4.6, followers: 3820 },
    timeAgo: "১৫ মিনিট আগে",
    product: {
      title: "Exclusive Muslin Sharee — Handloom",
      description: "খাঁটি মসলিন কাপড়, হাতে বোনা। বিয়ে ও উৎসবের জন্য পারফেক্ট। কাস্টম কালার অর্ডার নেওয়া হয়।",
      price: 3800,
      originalPrice: 5200,
      unit: "piece",
      images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80"],
      category: "fashion",
      stock: 15,
      discount: 27,
    },
    saves: 89, comments: 11, shares: 7, liked: false, saved: false,
  },
  {
    id: "3",
    seller: { name: "Mama's Kitchen", avatar: "MK", district: "Dhanmondi, Dhaka", verified: false, rating: 4.9, followers: 562 },
    timeAgo: "৩০ মিনিট আগে",
    product: {
      title: "Special Biryani Box — আজকের অফার 🔥",
      description: "কাচ্চি বিরিয়ানি ১ প্লেট + রায়তা + বোরহানি। Home delivery available. ন্যূনতম ২ box অর্ডার।",
      price: 280,
      originalPrice: 350,
      unit: "box",
      images: ["https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&q=80"],
      category: "food",
      stock: 20,
      discount: 20,
    },
    saves: 201, comments: 47, shares: 63, liked: true, saved: true,
  },
  {
    id: "4",
    seller: { name: "AgroFresh BD", avatar: "AF", district: "Gazipur, Dhaka", verified: true, rating: 4.7, followers: 890 },
    timeAgo: "১ ঘণ্টা আগে",
    product: {
      title: "Organic Hilsa Fish — Padma Nodi",
      description: "পদ্মার খাঁটি ইলিশ। ১ কেজি থেকে অর্ডার। সকালে ধরা, দুপুরে ডেলিভারি। ১০০% ফ্রেশ গ্যারান্টি।",
      price: 1200,
      originalPrice: 1500,
      unit: "kg",
      images: ["https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=600&q=80"],
      category: "food",
      stock: 50,
      discount: 20,
    },
    saves: 58, comments: 8, shares: 12, liked: false, saved: false,
  },
  {
    id: "5",
    seller: { name: "TechWorld BD", avatar: "TW", district: "Uttara, Dhaka", verified: true, rating: 4.5, followers: 2100 },
    timeAgo: "২ ঘণ্টা আগে",
    product: {
      title: "JBL Tune 720BT Wireless Headphone",
      description: "৭৬ ঘণ্টা ব্যাটারি লাইফ। Pure Bass Sound. Hands-free Call। ৩টি রঙে পাওয়া যাচ্ছে।",
      price: 3990,
      originalPrice: 5500,
      unit: "piece",
      images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"],
      category: "electronics",
      stock: 12,
      discount: 27,
    },
    saves: 178, comments: 34, shares: 22, liked: false, saved: false,
  },
];

function _OldPostCard_UNUSED({ post: initialPost }: { post: typeof MOCK_POSTS_COMPAT[0] }) {
  const [post, setPost] = useState(initialPost);
  const { addToCart } = useCart();
  const [, navigate] = useLocation();

  const toggleSave = () => {
    setPost(p => ({
      ...p,
      saved: !p.saved,
      saves: p.saved ? p.saves - 1 : p.saves + 1,
    }));
    toast(post.saved ? "Removed from saved" : "Saved!", { duration: 1500 });
  };

  const toggleLike = () => {
    setPost(p => ({ ...p, liked: !p.liked }));
  };

  const handleAddToCart = () => {
    addItem({
      id: post.id,
      name: post.product.title,
      price: post.product.price,
      image: post.product.images[0],
      sellerId: post.seller.name,
      sellerName: post.seller.name,
    });
    toast.success("Cart-এ যোগ হয়েছে!", { duration: 2000 });
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: post.product.title, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast("Link copied!", { duration: 1500 });
    }
  };

  return (
    <article className="bg-white/85 backdrop-blur-sm rounded-2xl overflow-hidden gold-ring-sm shadow-sm hover:shadow-md transition-shadow">
      {/* Post Header — Seller Info */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <Link href={`/vendors/${post.id}`} className="flex items-center gap-3 group">
          <div className="h-11 w-11 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md shrink-0" style={{ background: "linear-gradient(135deg, hsl(350 55% 28%), hsl(350 55% 42%))", border: "2px solid hsl(42 72% 50% / 0.5)" }}>
            {post.seller.avatar}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-gray-800 group-hover:underline">{post.seller.name}</span>
              {post.seller.verified && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium text-white" style={{ background: "hsl(42 72% 45%)" }}>✓ Verified</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <MapPin className="h-2.5 w-2.5" /> {post.seller.district}
              <span>•</span>
              <span>{post.timeAgo}</span>
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-xs px-3 gold-ring-sm font-medium" style={{ color: "hsl(350 55% 32%)", borderColor: "transparent" }}>
            Follow
          </Button>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Product Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
        <img
          src={post.product.images[0]}
          alt={post.product.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {post.product.discount > 0 && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold text-white shadow" style={{ background: "hsl(350 55% 30%)" }}>
            -{post.product.discount}% OFF
          </div>
        )}
        {post.product.stock <= 10 && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold text-white bg-orange-500 shadow">
            মাত্র {post.product.stock}টি বাকি
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="px-4 pt-3 pb-2">
        <h3 className="font-semibold text-gray-800 text-sm leading-snug mb-1">{post.product.title}</h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-2">{post.product.description}</p>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold" style={{ color: "hsl(350 55% 32%)" }}>৳{post.product.price.toLocaleString()}</span>
          {post.product.originalPrice > post.product.price && (
            <span className="text-xs text-gray-400 line-through">৳{post.product.originalPrice.toLocaleString()}</span>
          )}
          <span className="text-xs text-gray-400">/ {post.product.unit}</span>
        </div>
      </div>

      {/* Engagement Stats */}
      <div className="px-4 py-1.5 flex items-center gap-3 text-xs text-gray-400 border-b border-gray-100">
        <span>❤️ {post.saves} saves</span>
        <span>💬 {post.comments} comments</span>
        <span>↗️ {post.shares} shares</span>
      </div>

      {/* Action Buttons */}
      <div className="px-3 py-2 grid grid-cols-5 gap-1">
        <button
          onClick={toggleLike}
          className="flex flex-col items-center gap-1 py-2 rounded-xl text-xs transition-all hover:bg-rose-50"
          style={{ color: post.liked ? "hsl(350 55% 32%)" : "#9ca3af" }}
        >
          <Heart className="h-4 w-4" fill={post.liked ? "hsl(350 55% 32%)" : "none"} />
          <span>Save</span>
        </button>

        <button className="flex flex-col items-center gap-1 py-2 rounded-xl text-xs text-gray-400 transition-all hover:bg-gray-50 hover:text-gray-600">
          <MessageCircle className="h-4 w-4" />
          <span>Q&amp;A</span>
        </button>

        <button
          onClick={handleAddToCart}
          className="flex flex-col items-center gap-1 py-2 rounded-xl text-xs transition-all hover:bg-rose-50"
          style={{ color: "hsl(350 55% 32%)" }}
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Cart</span>
        </button>

        <button
          onClick={handleShare}
          className="flex flex-col items-center gap-1 py-2 rounded-xl text-xs text-gray-400 transition-all hover:bg-gray-50 hover:text-gray-600"
        >
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </button>

        <button
          onClick={toggleSave}
          className="flex flex-col items-center gap-1 py-2 rounded-xl text-xs transition-all hover:bg-amber-50"
          style={{ color: post.saved ? "hsl(42 72% 42%)" : "#9ca3af" }}
        >
          <Bookmark className="h-4 w-4" fill={post.saved ? "hsl(42 72% 42%)" : "none"} />
          <span>Wishlist</span>
        </button>
      </div>

      {/* Buy Now CTA */}
      <div className="px-3 pb-3">
        <button
          onClick={() => navigate(`/products/${post.id}`)}
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, hsl(350 55% 28%), hsl(350 55% 40%))", boxShadow: "0 2px 8px hsl(350 55% 28% / 0.35)" }}
        >
          <Zap className="h-4 w-4" /> এখনই কিনুন
        </button>
      </div>
    </article>
  );
}

export default function FeedPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [, navigate] = useLocation();

  const categoryParam = activeCategory === "all" ? undefined : activeCategory;
  const { data, isLoading } = useListProducts({ category: categoryParam, limit: 20 });
  const products = data?.products || [];

  return (
    <Layout>
      {/* Mode Toggle Banner */}
      <div className="sticky z-30 top-0" style={{ top: "94px" }}>
        <div className="glass border-b" style={{ borderColor: "hsl(42 72% 50% / 0.2)" }}>
          <div className="container mx-auto px-4">
            <div className="flex items-center h-11 gap-1">
              <div className="flex items-center bg-white/60 rounded-full p-1 gold-ring-sm">
                <button
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white transition-all"
                  style={{ background: "linear-gradient(135deg, hsl(350 55% 28%), hsl(350 55% 38%))" }}>
                  🏠 Feed
                </button>
                <button onClick={() => navigate("/")}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium text-gray-500 hover:text-gray-700 transition-all">
                  🛍️ Marketplace
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="border-b bg-white/60 backdrop-blur-sm sticky z-20" style={{ top: "139px", borderColor: "hsl(42 72% 50% / 0.12)" }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 py-2 overflow-x-auto scrollbar-hide">
            {FEED_CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0"
                style={activeCategory === cat.id
                  ? { background: "hsl(350 55% 30%)", color: "white", boxShadow: "0 2px 6px hsl(350 55% 30% / 0.35)" }
                  : { background: "white", color: "#6b7280", border: "1px solid hsl(42 72% 50% / 0.3)" }}>
                <span>{cat.emoji}</span> {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="min-h-screen py-4" style={{ background: "linear-gradient(180deg, hsl(350 30% 97%) 0%, hsl(42 30% 97%) 100%)" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white/85 rounded-2xl overflow-hidden gold-ring-sm">
                  <div className="flex items-center gap-3 p-4">
                    <Skeleton className="h-11 w-11 rounded-full" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              ))
            ) : products.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">এই category-তে এখন কোনো পোস্ট নেই</p>
              </div>
            ) : (
              products.map((product, i) => <PostCard key={product.id} product={product} index={i} />)
            )}

            {products.length > 0 && (
              <button className="w-full py-3 rounded-xl text-sm font-medium text-gray-500 border gold-ring-sm bg-white/60 hover:bg-white transition-all">
                আরো পোস্ট দেখুন ↓
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
