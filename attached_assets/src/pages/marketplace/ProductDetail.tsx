import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Heart, Share2, Star, ChevronRight } from "lucide-react";
import { getProducts } from "@/features/marketplace/product.api";
import { MOCK_SELLERS } from "@/features/posts/post.api";
import { Product } from "@/types/product.types";
import { formatPrice } from "@/utils/formatPrice";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/common/Avatar";
import { CommentsSection } from "@/components/product/CommentsSection";
import { useCart } from "@/features/cart/cart.context";
import { getProductActionBySellerType } from "@/core/utils/productActions";
import Loader from "@/components/common/Loader";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then(data => {
      setProduct(data.find(p => p.id === id) || data[0]);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <Loader full />;
  if (!product) return <div className="p-8 text-center">Product not found</div>;

  const seller = MOCK_SELLERS.find((s) => s.id === product.sellerId) || MOCK_SELLERS[0];
  const imgSrc = product.image || "/generated/product1.png";
  const productAction = getProductActionBySellerType(seller.sellerType);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: imgSrc,
      sellerId: seller.id,
      sellerName: seller.name,
    });
  };

  const handleAction = () => {
    if (seller.sellerType === "wholesale") {
      alert("Request quote feature is available for wholesale sellers.");
      return;
    }
    if (seller.sellerType === "service") {
      alert("Booking flow will open soon.");
      return;
    }
    if (seller.sellerType === "content_creator") {
      alert("Subscription flow will open soon.");
      return;
    }

    handleAddToCart();
    navigate("/cart");
  };

  return (
    <div className="pb-24 min-h-screen bg-[rgb(var(--bg))]">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 max-w-[480px] lg:max-w-[520px] mx-auto z-40 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
        <button onClick={() => navigate(-1)} className="h-10 w-10 rounded-full glass flex items-center justify-center text-white pointer-events-auto backdrop-blur-md">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex gap-2 pointer-events-auto">
          <button className="h-10 w-10 rounded-full glass flex items-center justify-center text-white backdrop-blur-md">
            <Share2 className="h-5 w-5" />
          </button>
          <button className="h-10 w-10 rounded-full glass flex items-center justify-center text-white backdrop-blur-md">
            <Heart className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Image */}
      <div className="w-full h-[45vh] bg-black/5 relative">
        <img src={imgSrc} alt={product.title} className="w-full h-full object-cover" />
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
          <div className="h-1.5 w-4 rounded-full bg-[rgb(var(--primary))]" />
          <div className="h-1.5 w-1.5 rounded-full bg-white/50" />
          <div className="h-1.5 w-1.5 rounded-full bg-white/50" />
        </div>
      </div>

      {/* Info */}
      <div className="px-4 py-5 -mt-6 relative z-10 bg-[rgb(var(--bg))] rounded-t-3xl">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-xl font-bold text-[rgb(var(--text))] leading-tight">
            {product.title}
          </h1>
        </div>
        
        <div className="flex items-end gap-2 mb-4">
          <span className="text-3xl font-extrabold text-[rgb(var(--primary))] leading-none">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-sm text-[rgb(var(--text-subtle))] line-through mb-1">
              {formatPrice(product.oldPrice)}
            </span>
          )}
          {product.isFlashSale && <Badge variant="danger" className="ml-2 mb-1">Flash Sale</Badge>}
        </div>

        <div className="flex items-center gap-4 text-sm mb-6 pb-6 border-b border-[rgba(var(--glass-stroke)/0.1)]">
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="font-bold text-[rgb(var(--text))]">{product.rating}</span>
            <span className="text-[rgb(var(--text-muted))]">({product.reviewCount} reviews)</span>
          </div>
          <span className="text-[rgb(var(--text-subtle))]">•</span>
          <span className="text-[rgb(var(--text-muted))]">1k+ sold</span>
        </div>

        {/* Seller Mini Card */}
        <Link to={`/seller/${seller.handle.replace("@", "")}`} className="glass-card p-3 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar src={`/generated/avatar${parseInt(seller.id.replace("s-", "")) || 1}.png`} fallback={seller.name} />
            <div>
              <p className="font-bold text-sm text-[rgb(var(--text))]">{seller.name}</p>
              <p className="text-xs text-[rgb(var(--text-muted))]">{seller.followers} followers</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-[rgb(var(--primary))]">
            Visit Store <ChevronRight className="h-4 w-4" />
          </div>
        </Link>

        {/* Description */}
        <div className="mb-6">
          <h3 className="font-bold text-[rgb(var(--text))] mb-2">Description</h3>
          <p className="text-sm text-[rgb(var(--text-muted))] leading-relaxed">
            {product.description}
            <br /><br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
          </p>
        </div>

        <CommentsSection
          targetType="product"
          targetId={product.id}
          productId={product.id}
        />

        {/* Spacer so reviews aren't covered by sticky CTA */}
        <div className="h-20" />
      </div>

      {/* Sticky CTA Bar */}
      <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+96px)] left-0 right-0 z-50 pointer-events-none px-3">
        <div
          className="mx-auto max-w-[456px] lg:max-w-[496px] px-3 py-3 rounded-2xl sticky-cta-shadow border border-[rgba(var(--glass-stroke)/0.4)] backdrop-blur-2xl pointer-events-auto"
          style={{ background: "rgba(var(--bg-elevated) / 0.96)" }}
        >
          <div className="flex gap-3">
            <Button
              variant="ghost"
              size="lg"
              className="flex-1 font-bold press hover-lift"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-1 font-bold press hover-lift glow-primary"
              onClick={handleAction}
            >
              {productAction.label}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
