import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, Smartphone, Shirt, Apple, Home, Sparkles, Headphones, Sofa, BookOpen } from "lucide-react";
import { getProducts } from "@/features/marketplace/product.api";
import { Product } from "@/types/product.types";
import { ProductCard } from "@/components/product/ProductCard";
import { Input } from "@/components/ui/Input";
import { ProductGridSkeleton } from "@/components/common/Loader";

const CATEGORIES = [
  { slug: "electronics", label: "Electronics", Icon: Smartphone, grad: "grad-sky" },
  { slug: "fashion", label: "Fashion", Icon: Shirt, grad: "grad-arrival" },
  { slug: "groceries", label: "Groceries", Icon: Apple, grad: "grad-primary" },
  { slug: "home", label: "Home", Icon: Home, grad: "grad-flash" },
  { slug: "beauty", label: "Beauty", Icon: Sparkles, grad: "grad-wine" },
  { slug: "audio", label: "Audio", Icon: Headphones, grad: "grad-hub" },
  { slug: "furniture", label: "Furniture", Icon: Sofa, grad: "grad-gold" },
  { slug: "books", label: "Books", Icon: BookOpen, grad: "grad-aurora" },
];

export default function MarketplaceHome() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Override body theme feeling slightly by rendering light-mode tokens in marketplace contexts via DOM or just let globals handle it. 
    // The spec says use globals toggle, so we rely on that.
    getProducts().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen px-4 pt-4 pb-8 flex flex-col gap-6">
      
      {/* Search Header */}
      <div className="flex items-center gap-2 sticky top-16 z-30 bg-[rgba(var(--bg)/0.8)] backdrop-blur-md py-2 -mx-4 px-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgb(var(--text-subtle))]" />
          <Input placeholder="Search products, brands..." className="pl-10 bg-[rgba(var(--glass-tint)/0.2)] shadow-inner" />
        </div>
        <button className="h-11 w-11 shrink-0 rounded-xl bg-[rgba(var(--glass-tint)/0.2)] border border-[rgba(var(--glass-stroke)/0.3)] flex items-center justify-center text-[rgb(var(--text))] hover:bg-[rgba(var(--glass-tint)/0.3)]">
          <SlidersHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Categories */}
      <section>
        <h2 className="text-lg font-bold mb-3 text-[rgb(var(--text))]">Categories</h2>
        <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-4 px-4">
          {CATEGORIES.map(({ slug, label, Icon, grad }) => (
            <Link key={slug} to={`/marketplace/category/${slug}`} className="flex flex-col items-center gap-2 min-w-[72px] group">
              <div className={`h-16 w-16 rounded-2xl ${grad} flex items-center justify-center shadow-md transition-transform group-hover:-translate-y-1`}>
                <Icon className="h-7 w-7 text-white drop-shadow" strokeWidth={2.2} />
              </div>
              <span className="text-xs font-semibold text-[rgb(var(--text))]">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Flash Sale Banner */}
      <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden relative shadow-lg">
        <img src="/generated/banner3.png" alt="Flash Sale" className="w-full h-full object-cover" />
      </div>

      {/* Product Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[rgb(var(--text))]">Just For You</h2>
        </div>
        
        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
