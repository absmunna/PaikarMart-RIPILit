import { useState } from "react";
import { formatBDT } from "@/lib/format";
import { useParams, useLocation } from "wouter";
import { useGetProduct, getGetProductQueryKey, useAddToCart, useListProducts, getListProductsQueryKey } from "@workspace/api-client-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ShoppingCart, Star, Minus, Plus, Share2, Heart, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const qc = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const { data: product } = useGetProduct(id, { query: { queryKey: getGetProductQueryKey(id), enabled: !!id } });
  const { data: relatedProducts } = useListProducts(
    { categoryId: product?.category?.id, limit: 5 },
    { query: { queryKey: getListProductsQueryKey({ categoryId: product?.category?.id, limit: 5 }), enabled: !!product?.category?.id } }
  );

  const addToCart = useAddToCart();

  if (!product) return <div className="p-8 text-center text-white">Loading...</div>;

  const handleAddToCart = () => {
    addToCart.mutate({ data: { productId: product.id, quantity } }, {
      onSuccess: () => {
        toast.success(`Added ${quantity} ${product.title} to cart`);
        qc.invalidateQueries({ queryKey: ["/api/cart"] });
      }
    });
  };

  const handleBuyNow = () => {
    addToCart.mutate({ data: { productId: product.id, quantity } }, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["/api/cart"] });
        setLocation("/cart");
      }
    });
  };

  return (
    <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8 animate-in fade-in duration-500">
      <Link href="/marketplace" className="inline-flex items-center gap-2 text-white/70 hover:text-white w-fit">
        <ArrowLeft className="w-4 h-4" />
        Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div className="flex flex-col gap-4">
          <div className="aspect-square bg-black/20 rounded-2xl overflow-hidden border border-white/10 relative">
            <img 
              src={product.images[activeImage]} 
              alt={product.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <Button variant="secondary" size="icon" className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="secondary" size="icon" className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {product.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    "w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all",
                    activeImage === idx ? "border-primary" : "border-transparent opacity-50 hover:opacity-100"
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold capitalize tracking-wider">
              {product.type.replace('_', ' ')}
            </span>
            <span className="text-white/50 text-sm">{product.category.name}</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">{product.title}</h1>
          
          <div className="flex items-center gap-4 mb-6 text-sm">
            <div className="flex items-center gap-1 text-yellow-400 bg-white/5 px-2 py-1 rounded-lg">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-medium">{product.rating.toFixed(1)}</span>
              <span className="text-white/50 ml-1">({product.reviewCount} reviews)</span>
            </div>
            <div className="text-green-400 font-medium bg-green-400/10 px-2 py-1 rounded-lg">
              {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
            </div>
          </div>

          <div className="flex items-end gap-3 mb-8">
            <span className="text-4xl font-bold text-primary">{formatBDT(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-xl text-white/40 line-through mb-1">{formatBDT(product.compareAtPrice)}</span>
            )}
          </div>

          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{product.description}</p>
          </div>

          {/* Vendor */}
          <Link href={`/vendors/${product.vendor.id}`}>
            <GlassCard className="p-4 flex items-center justify-between mb-8 cursor-pointer group">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border border-white/20">
                  <AvatarImage src={product.vendor.avatarUrl} />
                  <AvatarFallback>{product.vendor.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-primary transition-colors">{product.vendor.name}</h3>
                  <p className="text-sm text-white/50">{product.location}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-white">View Shop</Button>
            </GlassCard>
          </Link>

          <div className="mt-auto flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-white/10">
            <div className="flex items-center bg-white/5 rounded-xl border border-white/10 h-14 w-full sm:w-auto">
              <button 
                className="w-14 h-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/5 rounded-l-xl transition-colors disabled:opacity-50"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="w-12 text-center text-lg font-semibold text-white">{quantity}</span>
              <button 
                className="w-14 h-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/5 rounded-r-xl transition-colors disabled:opacity-50"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-4 w-full">
              <Button 
                variant="outline" 
                className="flex-1 h-14 bg-white/5 border-white/20 text-white hover:bg-white/10 text-lg rounded-xl"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button 
                className="flex-1 h-14 bg-primary hover:bg-primary/90 text-white text-lg rounded-xl"
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-12 pt-12 border-t border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">Related Products</h2>
          <ProductGrid products={relatedProducts.filter(p => p.id !== product.id).slice(0, 4)} />
        </div>
      )}
    </div>
  );
}
