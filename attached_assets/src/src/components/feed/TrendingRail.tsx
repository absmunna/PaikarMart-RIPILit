import { useGetTrendingProducts, getGetTrendingProductsQueryKey } from "@workspace/api-client-react";
import { formatBDT } from "@/lib/format";
import { GlassCard } from "@/components/ui/GlassCard";
import { Link } from "wouter";

export function TrendingRail() {
  const { data: products, isLoading } = useGetTrendingProducts({ query: { queryKey: getGetTrendingProductsQueryKey() } });
  const productsArray = Array.isArray(products) ? products : [];

  if (isLoading) {
    return (
      <GlassCard className="p-4">
        <h3 className="font-semibold text-white mb-4">Trending Now</h3>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-lg skeleton-shimmer" />
          ))}
        </div>
      </GlassCard>
    );
  }

  if (productsArray.length === 0) return null;

  return (
    <GlassCard className="p-4">
      <h3 className="font-semibold text-white mb-4">Trending Now</h3>
      <div className="grid grid-cols-2 gap-3">
        {productsArray.slice(0, 4).map((product) => {
          const img = product.images?.[0];
          return (
            <Link
              key={product.id}
              href={`/marketplace/product/${product.id}`}
              className="group relative rounded-lg overflow-hidden border border-white/10"
            >
              <div className="aspect-square bg-white/5">
                {img ? (
                  <img
                    src={img}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full skeleton-shimmer" />
                )}
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <p className="text-xs font-medium text-white truncate">{product.title}</p>
                <p className="text-xs text-primary font-bold">{formatBDT(product.price)}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </GlassCard>
  );
}
