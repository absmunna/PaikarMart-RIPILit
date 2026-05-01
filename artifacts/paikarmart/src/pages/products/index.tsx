import React, { useState } from "react";
import { useListProducts } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { Product } from "@workspace/api-zod/src/generated/types";
import {
  ShoppingCart, Star, Zap, Package, Store, Filter, X, SlidersHorizontal
} from "lucide-react";

const CATEGORIES = ["All", "Electronics", "Fashion", "Grocery", "Services", "Wholesale"];
const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [, navigate] = useLocation();
  const [adding, setAdding] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setAdding(true);
    addToCart({
      productId: product.id, productName: product.name,
      vendorId: product.vendorId, vendorName: product.vendorName,
      price: product.price || 0, quantity: 1, image: product.images?.[0] || "",
    });
    toast.success("Added to cart!");
    setTimeout(() => setAdding(false), 800);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    addToCart({
      productId: product.id, productName: product.name,
      vendorId: product.vendorId, vendorName: product.vendorName,
      price: product.price || 0, quantity: 1, image: product.images?.[0] || "",
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
            <div className="w-full h-full flex items-center justify-center"><Package className="h-12 w-12 text-gray-200" /></div>
          )}
          {product.type === "digital" && (
            <div className="absolute top-2 left-2"><Badge className="bg-blue-600 text-white text-[10px]">Digital</Badge></div>
          )}
          {product.inStock === false && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
        </div>
        <CardContent className="p-3 flex flex-col flex-1">
          <div className="text-[10px] text-green-600 font-semibold uppercase tracking-wide mb-1">{product.category}</div>
          <h3 className="font-medium text-sm line-clamp-2 mb-1 group-hover:text-green-700 transition-colors text-gray-800 flex-1">{product.name}</h3>
          <p className="text-xs text-gray-500 mb-2 line-clamp-1 flex items-center gap-1">
            <Store className="h-3 w-3 shrink-0 text-green-600" /> {product.vendorName}
          </p>
          <div className="flex items-center gap-1 mb-2">
            {[1,2,3,4,5].map(s => (
              <Star key={s} className={`h-3 w-3 ${s <= Math.round(product.rating || 4) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`} />
            ))}
            <span className="text-[10px] text-gray-500 ml-0.5">({product.reviewCount || 0})</span>
          </div>
          <div className="mb-3">
            {product.priceOnInquiry ? (
              <span className="text-sm font-bold text-orange-600">Price on Request</span>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-gray-900">৳{product.price?.toLocaleString()}</span>
                {originalPrice > 0 && <span className="text-xs text-gray-400 line-through">৳{originalPrice.toLocaleString()}</span>}
              </div>
            )}
          </div>
          <div className="flex gap-1.5">
            <Button size="sm" variant="outline" className="flex-1 h-8 text-xs border-green-200 hover:border-green-500 hover:text-green-600" onClick={handleAdd} disabled={adding || product.inStock === false}>
              <ShoppingCart className="h-3 w-3 mr-1" /> {adding ? "Added!" : "Cart"}
            </Button>
            <Button size="sm" className="flex-1 h-8 text-xs bg-green-600 hover:bg-green-700" onClick={handleBuyNow} disabled={!!product.priceOnInquiry || product.inStock === false}>
              <Zap className="h-3 w-3 mr-1" /> Buy
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const { data: productsData, isLoading } = useListProducts(
    selectedCategory !== "All" ? { category: selectedCategory } : {}
  );

  let products = productsData?.products || [];

  if (priceMin) products = products.filter(p => (p.price || 0) >= Number(priceMin));
  if (priceMax) products = products.filter(p => (p.price || 0) <= Number(priceMax));
  if (sortBy === "price_asc") products = [...products].sort((a, b) => (a.price || 0) - (b.price || 0));
  if (sortBy === "price_desc") products = [...products].sort((a, b) => (b.price || 0) - (a.price || 0));
  if (sortBy === "rating") products = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
            <p className="text-sm text-gray-500 mt-0.5">{products.length} products found</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <Button variant="outline" size="sm" onClick={() => setShowFilters(v => !v)} className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {(priceMin || priceMax) && <span className="h-4 w-4 rounded-full bg-green-600 text-white text-[9px] flex items-center justify-center">!</span>}
            </Button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-green-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white border border-gray-100 rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2"><Filter className="h-4 w-4" /> Filter Products</h3>
              <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">Min Price (৳)</label>
                <input type="number" value={priceMin} onChange={e => setPriceMin(e.target.value)} placeholder="0"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">Max Price (৳)</label>
                <input type="number" value={priceMax} onChange={e => setPriceMax(e.target.value)} placeholder="99999"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div className="flex items-end">
                <Button variant="outline" size="sm" onClick={() => { setPriceMin(""); setPriceMax(""); }} className="w-full">
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[1,2,3,4,5,6,7,8,9,10].map(i => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Package className="h-16 w-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Try a different category or clear your filters</p>
            <Button onClick={() => { setSelectedCategory("All"); setPriceMin(""); setPriceMax(""); }} variant="outline">
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </div>
    </Layout>
  );
}
