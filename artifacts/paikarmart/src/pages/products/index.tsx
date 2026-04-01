import React from "react";
import { useListProducts } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { Product } from "@workspace/api-zod/src/generated/types";

export default function ProductsPage() {
  const { data: productsData, isLoading } = useListProducts();
  const products = productsData?.products || [];
  const { addToCart } = useCart();

  const handleAdd = (e: React.MouseEvent, product: Product) => {
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
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">All Products</h1>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
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
              <Link key={product.id} href={`/products/${product.id}`}>
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
                        <Button size="sm" onClick={(e) => handleAdd(e, product)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                          Add
                        </Button>
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
