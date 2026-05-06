import React, { useState } from "react";
import { useGetProduct } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { useParams, Link, useLocation } from "wouter";
import {
  ShoppingCart, Zap, Star, Truck, Package, Store,
  ChevronRight, MapPin, Shield, RotateCcw, CheckCircle
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

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-4 w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square w-full rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
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
          <Package className="h-20 w-20 text-gray-200 mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-2 text-gray-800">Product Not Found</h1>
          <p className="text-gray-500 mb-8">The product you are looking for does not exist.</p>
          <Link href="/products">
            <Button className="bg-green-600 hover:bg-green-700">Browse Products</Button>
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
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/products" className="hover:text-green-600">Products</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/products?category=${product.category}`} className="hover:text-green-600">{product.category}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-800 font-medium line-clamp-1">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Image Section */}
          <div>
            <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 mb-3">
              {product.images?.[selectedImage] ? (
                <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-20 w-20 text-gray-200" />
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`h-16 w-16 rounded-lg overflow-hidden border-2 transition-all ${i === selectedImage ? "border-green-500" : "border-gray-200"}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="flex flex-col">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className="bg-green-50 text-green-700 border-green-100">{product.category}</Badge>
              {product.type && <Badge variant="outline" className="capitalize">{product.type}</Badge>}
              {product.inStock ? (
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> In Stock
                </Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`h-4 w-4 ${s <= Math.round(product.rating || 4) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`} />
                ))}
              </div>
              <span className="text-sm text-gray-600">{product.rating?.toFixed(1) || "4.0"}</span>
              <span className="text-sm text-gray-400">({product.reviewCount || 0} reviews)</span>
            </div>

            <Link href={`/vendors/${product.vendorId}`} className="flex items-center gap-2 mb-5 group w-fit">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <Store className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Sold by</p>
                <p className="text-sm font-medium text-green-700 group-hover:underline">{product.vendorName}</p>
              </div>
            </Link>

            <div className="bg-gray-50 rounded-xl p-4 mb-5">
              {product.priceOnInquiry ? (
                <div>
                  <span className="text-2xl font-bold text-orange-600">Price on Request</span>
                  {product.moq && <p className="text-sm text-gray-600 mt-1">Minimum Order: <strong>{product.moq} units</strong></p>}
                </div>
              ) : (
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-gray-900">৳{product.price?.toLocaleString()}</span>
                    {originalPrice > 0 && (
                      <>
                        <span className="text-lg text-gray-400 line-through">৳{originalPrice.toLocaleString()}</span>
                        <Badge className="bg-red-50 text-red-600 border-red-100">{discount}% OFF</Badge>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6 text-center">
              {[
                { icon: Truck, label: "Delivery", value: product.deliveryDays || "3-7 days" },
                { icon: Shield, label: "Guarantee", value: "Verified Seller" },
                { icon: RotateCcw, label: "Returns", value: "7-day policy" },
              ].map(f => {
                const Icon = f.icon;
                return (
                  <div key={f.label} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <Icon className="h-4 w-4 text-green-600 mx-auto mb-1" />
                    <p className="text-[10px] text-gray-500">{f.label}</p>
                    <p className="text-xs font-semibold text-gray-700 mt-0.5">{f.value}</p>
                  </div>
                );
              })}
            </div>

            {product.location && (
              <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-5">
                <MapPin className="h-4 w-4 text-green-600" /> Available in: <strong>{product.location}</strong>
              </div>
            )}

            <div className="flex gap-3 mt-auto">
              <Button size="lg" variant="outline" className="flex-1 border-green-500 text-green-700 hover:bg-green-50" onClick={handleAdd} disabled={adding || product.inStock === false}>
                <ShoppingCart className="h-4 w-4 mr-2" /> {adding ? "Added!" : "Add to Cart"}
              </Button>
              <Button size="lg" className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleBuyNow} disabled={!!product.priceOnInquiry || product.inStock === false}>
                <Zap className="h-4 w-4 mr-2" /> Buy Now
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4 border-b border-gray-100">
          <div className="flex gap-1">
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  activeTab === tab ? "border-green-600 text-green-700" : "border-transparent text-gray-500 hover:text-gray-700"
                }`}>{tab}</button>
            ))}
          </div>
        </div>

        <Card className="border-gray-100 shadow-sm">
          <CardContent className="p-6">
            {activeTab === "Description" && (
              <div className="prose prose-sm max-w-none text-gray-700">
                <p>{product.description || "No description available for this product."}</p>
              </div>
            )}
            {activeTab === "Specifications" && (
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Product Type", product.type || "Physical"],
                  ["Category", product.category],
                  ["Subcategory", product.subcategory || "—"],
                  ["Stock", product.stock?.toString() || "—"],
                  ["Delivery", product.deliveryDays || "3-7 days"],
                  ["Location", product.location || "Bangladesh"],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-2 p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-600 w-28 shrink-0">{k}:</span>
                    <span className="text-gray-800 capitalize">{v}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "Reviews" && (
              <div>
                <div className="flex items-center gap-4 mb-6 p-4 bg-green-50 rounded-xl">
                  <div className="text-center">
                    <div className="text-5xl font-extrabold text-gray-900">{product.rating?.toFixed(1) || "4.0"}</div>
                    <div className="flex items-center gap-0.5 justify-center mt-1">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`h-4 w-4 ${s <= Math.round(product.rating || 4) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{product.reviewCount || 0} reviews</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5,4,3,2,1].map(s => (
                      <div key={s} className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-2">{s}</span>
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${s === 5 ? 60 : s === 4 ? 25 : s === 3 ? 10 : 5}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-500 text-center py-4">
                  Only verified buyers can submit reviews. Login and purchase this product to leave a review.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
