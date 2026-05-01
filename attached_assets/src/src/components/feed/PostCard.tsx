import { useState } from "react";
import { formatBDT } from "@/lib/format";
import { Link } from "wouter";
import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark, ShoppingCart, Zap, Store } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAddToCart, useTogglePostLike, getListPostsQueryKey, type Post } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { useCart } from "@/features/cart/CartContext";
import { useWishlist } from "@/features/wishlist/WishlistContext";
import { isEnabled } from "@/config/feature.flags";
import { PostComments } from "./PostComments";

const VENDOR_TYPE_LABELS: Record<string, { label: string; cls: string }> = {
  retail:      { label: "Retail",      cls: "bg-blue-500/15 text-blue-300 border-blue-400/30" },
  wholesale:   { label: "Wholesale",   cls: "bg-purple-500/15 text-purple-300 border-purple-400/30" },
  service:     { label: "Service",     cls: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30" },
  grocery:     { label: "Grocery",     cls: "bg-amber-500/15 text-amber-300 border-amber-400/30" },
  hotel:       { label: "Hotel",       cls: "bg-rose-500/15 text-rose-300 border-rose-400/30" },
  real_estate: { label: "Real Estate", cls: "bg-cyan-500/15 text-cyan-300 border-cyan-400/30" },
  dropship:    { label: "Dropship",    cls: "bg-indigo-500/15 text-indigo-300 border-indigo-400/30" },
};

function VendorTypeBadge({ type }: { type?: string }) {
  if (!type) return null;
  const meta = VENDOR_TYPE_LABELS[type] ?? { label: type, cls: "bg-white/10 text-white/70 border-white/20" };
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border", meta.cls)}>
      <Store className="h-2.5 w-2.5" />
      {meta.label}
    </span>
  );
}

export function PostCard({ post }: { post: Post }) {
  const qc = useQueryClient();
  const toggleLike = useTogglePostLike();
  const addToCart = useAddToCart();
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const cart = useCart();
  const wishlist = useWishlist();

  const author = post?.author ?? { id: "", name: "Unknown", avatarUrl: undefined, verified: false };
  const images = post?.images ?? [];
  const product = post?.product;
  const vendorType = (author as { type?: string })?.type;

  const handleLike = () => {
    setIsLiking(true);
    toggleLike.mutate(
      { id: post?.id },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getListPostsQueryKey() });
          setTimeout(() => setIsLiking(false), 300);
        },
        onError: () => setIsLiking(false),
      },
    );
  };

  const handleAddToCart = () => {
    if (!product?.id) return;

    addToCart.mutate(
      { data: { productId: product.id, quantity: 1 } },
      {
        onSuccess: () => {
          cart.add({
            productId: product.id,
            title: product.title ?? "Untitled product",
            price: product.price ?? 0,
            currency: "USD",
            imageUrl: product.images?.[0],
            vendorId: author?.id,
            vendorName: author?.name,
          });
          toast.success("Added to cart", { description: product.title });
        },
        onError: () => {
          toast.error("Unable to add item to cart. Please try again.");
        },
      },
    );
  };

  const handleBuyNow = () => {
    if (!product?.id) return;

    addToCart.mutate(
      { data: { productId: product.id, quantity: 1 } },
      {
        onSuccess: () => {
          cart.add({
            productId: product.id,
            title: product.title ?? "Untitled product",
            price: product.price ?? 0,
            currency: "USD",
            imageUrl: product.images?.[0],
            vendorId: author?.id,
            vendorName: author?.name,
          });
          toast.success("Added to cart", { description: product.title });
          setTimeout(() => {
            window.location.assign(`${import.meta.env.BASE_URL}cart`);
          }, 200);
        },
        onError: () => {
          toast.error("Unable to add item to cart. Please try again.");
        },
      },
    );
  };

  const handleWishlist = () => {
    if (!product?.id) return;
    wishlist.toggle({
      productId: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.images?.[0],
    });
  };

  let timeAgo = "";
  try {
    timeAgo = post?.createdAt
      ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
      : "";
  } catch {
    timeAgo = "";
  }

  const wishlisted = product?.id ? wishlist.has(product.id) : false;
  const inCart = product?.id ? cart.has(product.id) : false;

  return (
    <GlassCard className="p-4 sm:p-5 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <Link href={author?.id ? `/vendors/${author.id}` : "#"} className="flex items-center gap-3 min-w-0">
          <Avatar className="border border-white/20 shrink-0">
            <AvatarImage src={author?.avatarUrl} />
            <AvatarFallback>{author?.name?.[0] ?? "?"}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-medium text-foreground truncate">{author?.name}</h3>
              {author?.verified && <span className="text-primary text-xs">✓</span>}
              <VendorTypeBadge type={vendorType} />
            </div>
            {timeAgo && <p className="text-xs text-muted-foreground">{timeAgo}</p>}
          </div>
        </Link>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-white/10 shrink-0" aria-label="More">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {post?.content && (
        <p className="text-sm text-foreground/90 whitespace-pre-wrap break-words">{post.content}</p>
      )}

      {images.length > 0 && (
        <div className={cn("grid gap-2", images.length > 1 ? "grid-cols-2" : "grid-cols-1")}>
          {images.map((url, i) => (
            <img
              key={i}
              src={url}
              alt="Post content"
              className="rounded-lg object-cover w-full aspect-video border border-white/10"
              loading="lazy"
            />
          ))}
        </div>
      )}

      {product && (
        <div className="rounded-lg bg-white/5 border border-white/10 overflow-hidden">
          <Link href={`/marketplace/product/${product.id}`}>
            <div className="flex items-center gap-3 p-3 hover:bg-white/10 transition-colors">
              {product.images?.[0] && (
                <img src={product.images[0]} alt={product.title} className="h-16 w-16 object-cover rounded-md shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-foreground truncate">{product.title}</h4>
                <p className="text-primary font-bold">{formatBDT(product.price)}</p>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2 p-2 border-t border-white/10 bg-black/20">
            {isEnabled("wishlist.enabled") && (
              <Button
                variant="ghost" size="sm"
                onClick={handleWishlist}
                className={cn("flex-1", wishlisted && "text-primary")}
                aria-label="Toggle wishlist"
              >
                <Bookmark className={cn("h-4 w-4 mr-1", wishlisted && "fill-primary")} />
                {wishlisted ? "Saved" : "Save"}
              </Button>
            )}
            {isEnabled("cart.enabled") && (
              <Button
                variant="ghost" size="sm"
                onClick={handleAddToCart}
                className={cn("flex-1", inCart && "text-primary")}
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                {inCart ? "In cart" : "Add to cart"}
              </Button>
            )}
            {isEnabled("buyNow.enabled") && (
              <Button size="sm" onClick={handleBuyNow} className="flex-1">
                <Zap className="h-4 w-4 mr-1" />
                Buy now
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-6 pt-2 border-t border-white/5">
        <button
          onClick={handleLike}
          className={cn(
            "flex items-center gap-2 text-sm transition-all duration-200",
            post?.liked ? "text-primary" : "text-muted-foreground hover:text-foreground",
            isLiking && "scale-125",
          )}
        >
          <Heart className={cn("h-5 w-5", post?.liked && "fill-primary")} />
          <span>{post?.likeCount ?? 0}</span>
        </button>
        <button
          onClick={() => setShowComments((v) => !v)}
          className={cn(
            "flex items-center gap-2 text-sm transition-colors",
            showComments ? "text-primary" : "text-muted-foreground hover:text-foreground",
          )}
        >
          <MessageCircle className="h-5 w-5" />
          <span>{post?.commentCount ?? 0}</span>
        </button>
        <button
          onClick={() => {
            try {
              if (navigator?.share) {
                navigator.share({ title: author?.name, text: post?.content }).catch(() => {});
              } else if (navigator?.clipboard) {
                navigator.clipboard.writeText(post?.content ?? "").then(() => toast.success("Copied to clipboard"));
              }
            } catch { /* noop */ }
          }}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Share2 className="h-5 w-5" />
          <span>{post?.shareCount ?? 0}</span>
        </button>
      </div>

      {showComments && post?.id && <PostComments postId={post.id} />}
    </GlassCard>
  );
}
