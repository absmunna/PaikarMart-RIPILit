import React, { useState } from "react";
import { useGetProduct } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { useParams, Link, useLocation } from "wouter";
import {
  ShoppingCart, Zap, Star, Truck, Package, Store,
  ChevronRight, MapPin, Shield, RotateCcw, CheckCircle, Heart
} from "lucide-react";

const TABS = ["Description", "Specifications", "Reviews"];

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useGetProduct(id || "", { query: { enabled: !!id } });
  const { addToCart } = useCart();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("Description");
  const [selectedImage, setSelectedImage] = useState(0);
  const [adding, setAdding] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-4 w-64 mb-6 bg-white/5" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square w-full rounded-2xl bg-white/5" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4 bg-white/5" />
              <Skeleton className="h-4 w-1/2 bg-white/5" />
              <Skeleton className="h-24 w-full bg-white/5" />
              <Skeleton className="h-14 w-full bg-white/5" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
            <Package className="h-12 w-12 text-white/20" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Product Not Found</h1>
          <p className="text-white/40 mb-8">The product you are looking for does not exist.</p>
          <Link href="/products">
            <Button className="bg-primary hover:bg-primary/90">Browse Products</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleAdd = () => {
    setAdding(true);
    addToCart({
      productId: product.id, productName: product.name,
      vendorId: product.vendorId, vendorName: product.vendorName,
      price: product.price || 0, quantity: 1, image: product.images?.[0] || "",
    });
    toast.success("Added to cart!");
    setTimeout(() => setAdding(false), 800);
  };

  const handleBuyNow = () => {
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
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-white/30 mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/products?category=${product.category}`} className="hover:text-primary transition-colors">{product.category}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-white/60 line-clamp-1">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Section */}
          <div>
            <div className="aspect-square bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-3 relative">
              {product.images?.[selectedImage] ? (
                <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-20 w-20 text-white/10" />
                </div>
              )}
              {discount > 0 && (
                <div className="absolute top-3 left-3">
                  <Badge className="bg-red-500/90 text-white border-0 font-bold">{discount}% OFF</Badge>
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img: string, i: number) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`h-16 w-16 rounded-lg overflow-hidden border-2 transition-all ${
                      i === selectedImage ? "border-primary shadow-lg shadow-primary/20" : "border-white/10 hover:border-white/30"
                    }`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="flex flex-col">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className="bg-primary/15 text-primary border-primary/30">{product.category}</Badge>
              {product.type && (
                <Badge className="bg-purple-500/15 text-purple-300 border-purple-500/30 capitalize">{product.type}</Badge>
              )}
              {product.inStock !== false ? (
                <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> In Stock
                </Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            <h1 className="text-2xl font-bold text-white mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`h-4 w-4 ${s <= Math.round(product.rating || 4) ? "text-yellow-400 fill-yellow-400" : "text-white/10 fill-white/10"}`} />
                ))}
              </div>
              <span className="text-sm text-white/70">{product.rating?.toFixed(1) || "4.0"}</span>
              <span className="text-sm text-white/30">({product.reviewCount || 0} reviews)</span>
            </div>

            {/* Vendor */}
            <Link href={`/vendors/${product.vendorId}`}
              className="flex items-center gap-2 mb-5 group w-fit bg-white/5 border border-white/10 hover:border-primary/30 rounded-xl px-3 py-2 transition-all">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Store className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-white/30">Sold by</p>
                <p className="text-sm font-medium text-white group-hover:text-primary transition-colors">{product.vendorName}</p>
              </div>
            </Link>

            {/* Price Box */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-5">
              {product.priceOnInquiry ? (
                <div>
                  <span className="text-2xl font-bold text-amber-400">Price on Request</span>
                  {product.moq && <p className="text-sm text-white/50 mt-1">Minimum Order: <strong className="text-white">{product.moq} units</strong></p>}
                </div>
              ) : (
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-white">৳{product.price?.toLocaleString()}</span>
                    {originalPrice > 0 && (
                      <>
                        <span className="text-lg text-white/30 line-through">৳{originalPrice.toLocaleString()}</span>
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">{discount}% OFF</Badge>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-white/30 mt-1">Inclusive of all taxes</p>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { icon: Truck, label: "Delivery", value: product.deliveryDays || "3-7 days", color: "text-primary" },
                { icon: Shield, label: "Guarantee", value: "Verified Seller", color: "text-blue-400" },
                { icon: RotateCcw, label: "Returns", value: "7-day policy", color: "text-purple-400" },
              ].map(f => {
                const Icon = f.icon;
                return (
                  <div key={f.label} className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                    <Icon className={`h-4 w-4 ${f.color} mx-auto mb-1`} />
                    <p className="text-[10px] text-white/30">{f.label}</p>
                    <p className="text-xs font-semibold text-white/70 mt-0.5">{f.value}</p>
                  </div>
                );
              })}
            </div>

            {product.location && (
              <div className="flex items-center gap-1.5 text-sm text-white/40 mb-5">
                <MapPin className="h-4 w-4 text-primary/60" /> Available in: <strong className="text-white/70">{product.location}</strong>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-auto">
              <Button size="lg" variant="outline"
                className="flex-1 border-white/15 text-white/70 hover:border-primary hover:text-primary bg-transparent"
                onClick={handleAdd} disabled={adding || product.inStock === false}>
                <ShoppingCart className="h-4 w-4 mr-2" /> {adding ? "Added!" : "Add to Cart"}
              </Button>
              <Button size="lg" className="flex-1 bg-primary hover:bg-primary/90"
                onClick={handleBuyNow} disabled={!!product.priceOnInquiry || product.inStock === false}>
                <Zap className="h-4 w-4 mr-2" /> Buy Now
              </Button>
              <Button size="lg" variant="outline"
                className={`border-white/15 bg-transparent ${wishlisted ? "text-red-400 border-red-400/30" : "text-white/40 hover:text-red-400 hover:border-red-400/30"}`}
                onClick={() => setWishlisted(v => !v)}>
                <Heart className={`h-5 w-5 ${wishlisted ? "fill-red-400" : ""}`} />
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4 border-b border-white/10">
          <div className="flex gap-1">
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  activeTab === tab ? "border-primary text-primary" : "border-transparent text-white/40 hover:text-white/70"
                }`}>{tab}</button>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-xl p-6">
          {activeTab === "Description" && (
            <div className="text-white/60 leading-relaxed">
              <p>{product.description || "No description available for this product."}</p>
            </div>
          )}
          {activeTab === "Specifications" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {[
                ["Product Type", product.type || "Physical"],
                ["Category", product.category],
                ["Subcategory", product.subcategory || "—"],
                ["Stock", product.stock?.toString() || "—"],
                ["Delivery", product.deliveryDays || "3-7 days"],
                ["Location", product.location || "Bangladesh"],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-2 p-3 bg-white/5 rounded-lg border border-white/5">
                  <span className="font-medium text-white/40 w-28 shrink-0">{k}:</span>
                  <span className="text-white/70 capitalize">{v}</span>
                </div>
              ))}
            </div>
          )}
          {activeTab === "Reviews" && (
            <div>
              <div className="flex items-center gap-6 mb-6 p-5 bg-white/5 border border-white/10 rounded-xl">
                <div className="text-center shrink-0">
                  <div className="text-5xl font-extrabold text-white">{product.rating?.toFixed(1) || "4.0"}</div>
                  <div className="flex items-center gap-0.5 justify-center mt-1">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`h-4 w-4 ${s <= Math.round(product.rating || 4) ? "text-yellow-400 fill-yellow-400" : "text-white/10 fill-white/10"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-white/30 mt-1">{product.reviewCount || 0} reviews</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5,4,3,2,1].map(s => (
                    <div key={s} className="flex items-center gap-2">
                      <span className="text-xs text-white/30 w-2">{s}</span>
                      <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${s === 5 ? 60 : s === 4 ? 25 : s === 3 ? 10 : 3}%` }} />
                      </div>
                      <span className="text-xs text-white/30 w-8 text-right">
                        {s === 5 ? "60%" : s === 4 ? "25%" : s === 3 ? "10%" : s === 2 ? "3%" : "2%"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-sm text-white/30 text-center py-4">
                Only verified buyers can submit reviews. Login and purchase this product to leave a review.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
