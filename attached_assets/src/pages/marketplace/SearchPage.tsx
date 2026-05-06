import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search as SearchIcon, X } from "lucide-react";
import { getProducts } from "@/features/marketplace/product.api";
import { Product } from "@/types/product.types";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Input } from "@/components/ui/Input";
import Loader from "@/components/common/Loader";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setProducts([]);
      return;
    }
    const timer = setTimeout(() => {
      setLoading(true);
      getProducts().then(data => {
        setProducts(data.filter(p => p.title.toLowerCase().includes(query.toLowerCase())));
        setLoading(false);
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="min-h-screen pt-4 pb-8 flex flex-col gap-4">
      <div className="flex items-center gap-3 sticky top-16 z-30 bg-[rgba(var(--bg)/0.8)] backdrop-blur-md py-2 px-4 border-b border-[rgba(var(--glass-stroke)/0.1)]">
        <Link to="/marketplace" className="shrink-0 h-9 w-9 flex items-center justify-center rounded-full glass hover:bg-[rgba(var(--glass-tint)/0.2)]">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgb(var(--text-subtle))]" />
          <Input 
            autoFocus
            placeholder="Search products..." 
            className="pl-10 pr-10 bg-[rgba(var(--glass-tint)/0.2)]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--text-subtle))]">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="px-4">
        {!query ? (
          <div>
            <h3 className="text-sm font-semibold text-[rgb(var(--text-muted))] mb-3">Popular Searches</h3>
            <div className="flex flex-wrap gap-2">
              {["Smartphones", "Kurta", "Ceiling Fan", "Rice"].map(term => (
                <button 
                  key={term} 
                  onClick={() => setQuery(term)}
                  className="chip bg-[rgba(var(--glass-tint)/0.1)] hover:bg-[rgba(var(--glass-tint)/0.2)]"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        ) : loading ? (
          <Loader />
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
}
