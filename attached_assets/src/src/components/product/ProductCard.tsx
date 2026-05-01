import { Product } from "@workspace/api-client-react";
import { Link } from "wouter";
import { GlassCard } from "@/components/ui/GlassCard";
import { Star, MapPin } from "lucide-react";
import { formatBDT, discountPercent } from "@/lib/format";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const img = product.images?.[0];
  const vendorName = product.vendor?.name ?? "Unknown vendor";
  const rating = typeof product.rating === "number" ? product.rating : null;
  const discount = discountPercent(product.price ?? 0, product.compareAtPrice);

  return (
    <Link href={`/marketplace/product/${product.id}`}>
      <GlassCard className="h-full flex flex-col group overflow-hidden cursor-pointer" hoverEffect>
        <div className="relative aspect-square overflow-hidden bg-black/20">
          {img ? (
            <img
              src={img}
              alt={product.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full skeleton-shimmer" />
          )}
          {discount !== null && (
            <div className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
              -{discount}%
            </div>
          )}
          {product.distanceKm !== undefined && (
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10 flex items-center gap-1 text-[10px] text-white">
              <MapPin className="w-3 h-3 text-primary" />
              <span>{product.distanceKm.toFixed(1)}km</span>
            </div>
          )}
        </div>

        <div className="p-2.5 sm:p-3 flex flex-col flex-1 gap-1">
          <h3 className="text-sm font-medium text-white line-clamp-2 leading-snug min-h-[2.5rem] group-hover:text-primary transition-colors">
            {product.title}
          </h3>

          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-primary font-bold text-base">{formatBDT(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > (product.price ?? 0) && (
              <span className="text-xs text-white/40 line-through">
                {formatBDT(product.compareAtPrice)}
              </span>
            )}
          </div>

          <div className="mt-auto pt-1.5 flex items-center justify-between gap-2 text-[11px]">
            <span className="text-white/55 truncate" title={vendorName}>{vendorName}</span>
            {rating !== null && (
              <div className="flex items-center gap-0.5 text-yellow-400 shrink-0">
                <Star className="w-3 h-3 fill-current" />
                <span>{rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}
