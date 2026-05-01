import { ProductCard } from "./ProductCard";
import { Product } from "@workspace/api-client-react";
import { GlassCard } from "@/components/ui/GlassCard";

interface ProductGridProps {
  products?: Product[];
  emptyMessage?: string;
  isLoading?: boolean;
  skeletonCount?: number;
}

export function ProductGrid({
  products,
  emptyMessage = "No products found.",
  isLoading = false,
  skeletonCount = 8,
}: ProductGridProps) {
  if (isLoading || products === undefined) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {(Array.isArray(Array.from({ length: skeletonCount })) ? Array.from({ length: skeletonCount }) : []).map((_, i) => (
          <GlassCard key={i} className="h-full overflow-hidden">
            <div className="aspect-square skeleton-shimmer" />
            <div className="p-3 flex flex-col gap-2">
              <div className="h-3 w-1/2 rounded skeleton-shimmer" />
              <div className="h-4 w-full rounded skeleton-shimmer" />
              <div className="h-4 w-1/3 rounded skeleton-shimmer mt-1" />
            </div>
          </GlassCard>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-12 text-center text-white/50 border border-white/10 border-dashed rounded-xl bg-white/5">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
      {(Array.isArray(products) ? products : []).map((product, i) => (
        <div
          key={product.id}
          className="animate-in fade-in slide-in-from-bottom-4"
          style={{ animationDelay: `${Math.min(i, 10) * 40}ms` }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
