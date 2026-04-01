import React from "react";
import { useGetProduct } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { useParams, Link } from "wouter";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useGetProduct(id || "", { query: { enabled: !!id } });
  const { addToCart } = useCart();

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square w-full rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleAdd = () => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="aspect-square bg-muted rounded-xl overflow-hidden">
            {product.images?.[0] ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
            )}
          </div>
          <div className="flex flex-col">
            <div className="text-sm text-primary font-medium mb-2">{product.category}</div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="text-sm text-muted-foreground mb-4">
              Sold by: <Link href={`/vendors/${product.vendorId}`} className="text-primary hover:underline">{product.vendorName}</Link>
            </div>
            
            <div className="text-3xl font-bold mb-6">
              {product.priceOnInquiry ? "Price on Request" : `৳${product.price?.toLocaleString()}`}
            </div>

            <p className="text-muted-foreground mb-8 line-clamp-4">
              {product.description || "No description available."}
            </p>

            <div className="flex gap-4 mt-auto">
              <Button size="lg" className="flex-1" onClick={handleAdd}>Add to Cart</Button>
              <Link href="/checkout" className="flex-1">
                <Button size="lg" variant="secondary" className="w-full" onClick={handleAdd}>Buy Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
