import React from "react";
import { Layout } from "@/components/layout/Layout";
import { useGetSeller, useGetSellerProducts } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Star, Store, Mail, Phone, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VendorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: seller, isLoading: isLoadingSeller } = useGetSeller(id || "", { query: { enabled: !!id } });
  const { data: productsData, isLoading: isLoadingProducts } = useGetSellerProducts(id || "", { query: { enabled: !!id } });
  
  const products = productsData?.products || [];

  if (isLoadingSeller) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 space-y-8">
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-64 w-full rounded-xl" />)}
          </div>
        </div>
      </Layout>
    );
  }

  if (!seller) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Vendor not found</h1>
          <Link href="/vendors"><Button>Back to Vendors</Button></Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Vendor Header */}
      <div className="bg-primary/5 py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="h-32 w-32 rounded-full bg-background shadow-md flex items-center justify-center shrink-0 border-4 border-background overflow-hidden">
              {seller.image ? (
                <img src={seller.image} alt={seller.shopName} className="h-full w-full object-cover" />
              ) : (
                <Store className="h-12 w-12 text-primary/50" />
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold">{seller.shopName}</h1>
                <Badge className="w-fit mx-auto md:mx-0 text-sm capitalize">{seller.businessType.replace('_', ' ')}</Badge>
              </div>
              
              <p className="text-muted-foreground mb-6 max-w-2xl">
                {seller.description || "Welcome to our store. We offer high quality products at great prices."}
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-bold">{seller.rating?.toFixed(1) || "New"} Rating</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{seller.location || seller.district || "Location N/A"}</span>
                </div>
                {seller.createdAt && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(seller.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col gap-3 min-w-[200px]">
              <Button className="w-full gap-2"><Phone className="h-4 w-4" /> Contact Vendor</Button>
              {seller.email && (
                <Button variant="outline" className="w-full gap-2"><Mail className="h-4 w-4" /> Send Message</Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Products */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Products from {seller.shopName}</h2>
          <span className="text-muted-foreground">{products.length} items</span>
        </div>

        {isLoadingProducts ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square w-full rounded-xl" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-muted/30 rounded-xl">
            <PackageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No products yet</h3>
            <p className="text-muted-foreground">This vendor hasn't uploaded any products.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {products.map(product => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg border-muted h-full">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="aspect-square bg-muted relative overflow-hidden shrink-0">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <div className="text-xs text-muted-foreground mb-1">{product.category}</div>
                      <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                      <div className="font-bold text-lg mt-auto">
                        {product.priceOnInquiry ? "Price on Request" : `৳${product.price?.toLocaleString()}`}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

function PackageIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}
