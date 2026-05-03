import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/types/product.types";
import { formatPrice } from "@/utils/formatPrice";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/common/Rating";
import { useCart } from "@/features/cart/cart.context";
import { MOCK_SELLERS } from "@/features/posts/post.api";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = forwardRef<HTMLAnchorElement, ProductCardProps>(
  ({ product }, ref) => {
    const { addItem } = useCart();
    const seller = MOCK_SELLERS.find(s => s.id === product.sellerId)?.name || "Unknown Seller";

    const handleAdd = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image || "/generated/product1.png", // fallback
        sellerId: product.sellerId,
        sellerName: seller,
      });
    };

    const imgSrc = product.image || "/generated/product1.png";

    return (
      <Link 
        ref={ref}
        to={`/product/${product.id}`} 
        className="glass-card flex flex-col overflow-hidden group hover-lift press relative hover:border-[rgba(var(--primary)/0.35)] hover:shadow-[0_18px_40px_-18px_rgba(16,185,129,0.45)]"
      >
        <div className="relative aspect-[4/5] bg-black/5 overflow-hidden">
          <img 
            src={imgSrc} 
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
            {product.isFlashSale && <Badge variant="danger" className="bg-orange-500/90 text-white border-none shadow-md">Flash Sale</Badge>}
            {product.isNewArrival && <Badge variant="primary" className="bg-pink-500/90 text-white border-none shadow-md">New</Badge>}
            {product.isWholesale && <Badge variant="primary" className="bg-blue-500/90 text-white border-none shadow-md">Wholesale</Badge>}
          </div>
        </div>
        
        <div className="p-3 flex flex-col flex-1">
          <h3 className="font-medium text-sm text-[rgb(var(--text))] line-clamp-2 leading-tight mb-1 group-hover:text-[rgb(var(--primary))] transition-colors">
            {product.title}
          </h3>
          <div className="mt-auto pt-2 flex flex-col gap-1">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="font-bold text-lg text-[rgb(var(--primary))] leading-none">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-xs text-[rgb(var(--text-subtle))] line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between mt-1">
              <Rating value={product.rating} count={product.reviewCount} size="sm" />
              <button 
                onClick={handleAdd}
                className="h-7 w-7 rounded-full bg-[rgba(var(--primary)/0.1)] text-[rgb(var(--primary))] flex items-center justify-center hover:bg-[rgb(var(--primary))] hover:text-white transition-all"
                aria-label="Add to cart"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  }
);
ProductCard.displayName = "ProductCard";
