import React from "react";
import { Link } from "wouter";
import { useListProducts } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Store, Tag, TrendingUp, Package, HeadphonesIcon, Building2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { Product } from "@workspace/api-zod/src/generated/types";

const CATEGORIES = [
  { name: "Wholesale", icon: Package, desc: "Bulk orders at lowest prices" },
  { name: "Retail", icon: Tag, desc: "Single items for personal use" },
  { name: "Brand Seller", icon: Building2, desc: "Official brand stores" },
  { name: "Dropship", icon: TrendingUp, desc: "Start selling with zero inventory" },
  { name: "Service", icon: HeadphonesIcon, desc: "Professional services" },
  { name: "Local Shop", icon: Store, desc: "Stores in your neighborhood" },
];

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
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
    toast.success("Added to cart");
  };

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg border-muted">
        <CardContent className="p-0">
          <div className="aspect-square bg-muted relative overflow-hidden">
            {product.images?.[0] ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
            )}
          </div>
          <div className="p-4">
            <div className="text-xs text-muted-foreground mb-1">{product.category}</div>
            <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
            <div className="flex items-center justify-between mt-auto">
              <div className="font-bold text-lg">
                {product.priceOnInquiry ? "Price on Request" : `৳${product.price?.toLocaleString()}`}
              </div>
              <Button size="sm" onClick={handleAdd} className="opacity-0 group-hover:opacity-100 transition-opacity">
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function Home() {
  const { data: productsData, isLoading } = useListProducts({ limit: 8 });
  const products = productsData?.products || [];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/90 to-emerald-600 text-primary-foreground py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-extrabold mb-6 tracking-tight">
            The Premium Market for <br className="hidden sm:block" /> Bangladesh
          </h1>
          <p className="text-lg lg:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Connect with wholesalers, brands, and local shops. Get the best prices with reliable delivery across the country.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/products" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full text-primary font-semibold">
                Start Shopping
              </Button>
            </Link>
            <Link href="/seller/register" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full bg-transparent text-white border-white hover:bg-white/10">
                Become a Seller
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">Shop by Vendor Type</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.name} href={`/vendors?type=${cat.name.toLowerCase()}`}>
                <Card className="hover:border-primary hover:shadow-md transition-all cursor-pointer h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{cat.name}</h3>
                      <p className="text-xs text-muted-foreground">{cat.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link href="/products">
              <Button variant="ghost">View All</Button>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square w-full rounded-xl" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 container mx-auto px-4 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl bg-primary/5">
            <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4">
              <span className="font-bold text-xl">1</span>
            </div>
            <h3 className="font-bold mb-2">Verified Sellers</h3>
            <p className="text-sm text-muted-foreground">Every seller on our platform is verified for your safety.</p>
          </div>
          <div className="p-6 rounded-2xl bg-primary/5">
            <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4">
              <span className="font-bold text-xl">2</span>
            </div>
            <h3 className="font-bold mb-2">Secure Payments</h3>
            <p className="text-sm text-muted-foreground">Your money is safe. Pay securely via multiple methods.</p>
          </div>
          <div className="p-6 rounded-2xl bg-primary/5">
            <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4">
              <span className="font-bold text-xl">3</span>
            </div>
            <h3 className="font-bold mb-2">Fast Delivery</h3>
            <p className="text-sm text-muted-foreground">Get your orders delivered quickly across Bangladesh.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
