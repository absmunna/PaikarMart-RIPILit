import React from "react";
import { Layout } from "@/components/layout/Layout";
import { useListSellers } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Store } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function VendorsPage() {
  const { data: sellersData, isLoading } = useListSellers();
  const sellers = sellersData?.sellers || [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Vendor Directory</h1>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-6 w-2/3" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                  </div>
                  <Skeleton className="h-20 w-full mt-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellers.map((seller) => (
              <Link key={seller.id} href={`/vendors/${seller.id}`}>
                <Card className="hover:shadow-lg transition-all cursor-pointer h-full group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex gap-4 items-center">
                        <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          {seller.image ? (
                            <img src={seller.image} alt={seller.shopName} className="h-full w-full rounded-full object-cover" />
                          ) : (
                            <Store className="h-8 w-8" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{seller.shopName}</h3>
                          <Badge variant="secondary" className="capitalize mt-1">
                            {seller.businessType?.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {seller.description || "No description available for this vendor."}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{seller.location || seller.district || "Location N/A"}</span>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-medium text-foreground">{seller.rating?.toFixed(1) || "New"}</span>
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
