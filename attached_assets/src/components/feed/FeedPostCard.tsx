import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
  ShoppingCart,
  Star,
} from "lucide-react";
import { Post } from "@/types/post.types";
import { Avatar } from "@/components/common/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/utils/formatPrice";
import { MOCK_SELLERS } from "@/features/posts/post.api";
import { useCart } from "@/features/cart/cart.context";
import { getProductActionBySellerType } from "@/core/utils/productActions";
import { SellerType } from "@/types/user.types";

interface FeedPostCardProps {
  post: Post;
}

export function FeedPostCard({ post }: FeedPostCardProps) {
  const seller = MOCK_SELLERS.find((s) => s.id === post.authorId) || MOCK_SELLERS[0];
  const isProduct = post.type === "Product";
  const isService = post.type === "Service";
  const { addItem } = useCart();
  const [liked, setLiked] = useState(!!post.isLiked);
  const [saved, setSaved] = useState(false);
  const [added, setAdded] = useState(false);

  const getMediaImage = () => {
    if (post.id.includes("p-1")) return "/generated/product1.png";
    if (post.id.includes("p-2")) return "/generated/product2.png";
    if (post.id.includes("p-4")) return "/generated/product3.png";
    return null;
  };
  
  const mediaSrc = getMediaImage();
  const sellerType = (seller as any)?.sellerType as SellerType | undefined || "retail";
  const productAction = getProductActionBySellerType(sellerType);

  return (
    <div className="glass-card overflow-hidden flex flex-col mb-4 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <Link to={`/seller/${seller.handle.replace("@", "")}`} className="flex items-center gap-3">
          <Avatar src={`/generated/avatar${parseInt(seller.id.replace("s-", "")) || 1}.png`} fallback={seller.name} size="md" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[rgb(var(--text))] text-sm">{seller.name}</span>
              <Badge variant={isProduct ? "primary" : isService ? "success" : "warning"}>{post.type}</Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-[rgb(var(--text-muted))] mt-0.5">
              <span>2h ago</span>
              {post.location && (
                <>
                  <span>•</span>
                  <span>{post.location}</span>
                </>
              )}
            </div>
          </div>
        </Link>
        <button className="p-2 text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] rounded-full hover:bg-[rgba(var(--glass-tint)/0.1)]">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <Link to={`/post/${post.id}`} className="block px-4 pb-3">
        <h3 className="font-bold text-[rgb(var(--text))] text-base mb-1 leading-snug">{post.title}</h3>
        <p className="text-sm text-[rgb(var(--text-subtle))] line-clamp-2">{post.description}</p>
      </Link>

      {/* Media */}
      {mediaSrc && (
        <div className="relative w-full aspect-[4/5] bg-[rgba(var(--glass-tint)/0.05)] border-y border-[rgba(var(--glass-stroke)/0.1)]">
          <img src={mediaSrc} alt={post.title} className="w-full h-full object-cover" />
          {isProduct && post.price && (
            <div className="absolute bottom-3 left-3 bg-[rgba(17,25,42,0.85)] backdrop-blur-md text-white font-bold px-3 py-1.5 rounded-lg border border-white/10 shadow-lg text-sm">
              {formatPrice(post.price)}
            </div>
          )}
        </div>
      )}
      {!mediaSrc && post.price && (
        <div className="px-4 pb-2">
          <span className="font-bold text-[rgb(var(--primary))] text-lg">{formatPrice(post.price)}</span>
        </div>
      )}

      {/* Rating & Social Actions Row */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-[rgba(var(--glass-stroke)/0.1)]">
        <div className="flex items-center gap-1">
          {post.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-bold text-[rgb(var(--text))]">{post.rating}</span>
              <span className="text-xs text-[rgb(var(--text-muted))]">({post.reviewCount})</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setLiked((v) => !v)}
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-full transition-colors press ${
              liked
                ? "text-pink-500"
                : "text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] hover:bg-[rgba(var(--glass-tint)/0.1)]"
            }`}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
            <span className="text-xs font-medium">{post.likes + (liked && !post.isLiked ? 1 : 0)}</span>
          </button>
          <Link
            to={`/post/${post.id}`}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-full text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] hover:bg-[rgba(var(--glass-tint)/0.1)] transition press"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs font-medium">{post.comments}</span>
          </Link>
          <button
            onClick={() => setSaved((v) => !v)}
            className={`flex items-center px-2 py-1.5 rounded-full transition press ${
              saved
                ? "text-[rgb(var(--primary))]"
                : "text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] hover:bg-[rgba(var(--glass-tint)/0.1)]"
            }`}
            aria-label="Save"
          >
            <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
          </button>
          <button
            className="flex items-center px-2 py-1.5 rounded-full text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] hover:bg-[rgba(var(--glass-tint)/0.1)] transition press"
            aria-label="Share"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Hybrid commerce action row — only for product/service posts */}
      {(isProduct || isService) && (
        <div className="px-4 py-4 flex gap-2">
          {isProduct && (
            <button
              onClick={() => {
                if (added) return;
                addItem({
                  id: post.id,
                  title: post.title,
                  price: post.price ?? 0,
                  image: mediaSrc ?? "/generated/product1.png",
                  sellerName: seller.name,
                });
                setAdded(true);
                setTimeout(() => setAdded(false), 1500);
              }}
              className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-[rgba(var(--glass-tint)/0.1)] border border-[rgba(var(--glass-stroke)/0.25)] text-[rgb(var(--text))] text-sm font-semibold hover:bg-[rgba(var(--glass-tint)/0.2)] press"
            >
              <ShoppingCart className="h-4 w-4" />
              {added ? "Added" : "Add to Cart"}
            </button>
          )}
          <Button
            size="md"
            variant={productAction.variant}
            className={isProduct ? "flex-1" : "w-full"} 
            onClick={() => {
              if (sellerType === "wholesale") {
                alert("Request quote feature coming soon!");
              } else if (sellerType === "service") {
                alert("Book service feature coming soon!");
              } else if (sellerType === "content_creator") {
                alert("Subscribe feature coming soon!");
              }
            }}
          >
            {productAction.label}
          </Button>
        </div>
      )}

      {/* Demand posts only get a respond CTA */}
      {!isProduct && !isService && (
        <div className="px-4 pb-4">
          <Button size="md" variant="soft" className="w-full press">
            Respond to Demand
          </Button>
        </div>
      )}
    </div>
  );
}
