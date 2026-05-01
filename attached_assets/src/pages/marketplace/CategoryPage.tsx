import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { getProducts } from "@/features/marketplace/product.api";
import { Product } from "@/types/product.types";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductGridSkeleton } from "@/components/common/Loader";

export default function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProducts(slug).then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, [slug]);

  const categoryName = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "Category";

  return (
    <div className="min-h-screen px-4 pt-4 pb-8 flex flex-col gap-6">
      <div className="flex items-center justify-between sticky top-16 z-30 bg-[rgba(var(--bg)/0.8)] backdrop-blur-md py-2 -mx-4 px-4 border-b border-[rgba(var(--glass-stroke)/0.1)]">
        <div className="flex items-center gap-3">
          <Link to="/marketplace" className="h-8 w-8 flex items-center justify-center rounded-full glass hover:bg-[rgba(var(--glass-tint)/0.2)]">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-lg font-bold text-[rgb(var(--text))]">{categoryName}</h1>
        </div>
        <button className="h-8 w-8 flex items-center justify-center rounded-full glass text-[rgb(var(--text))] hover:bg-[rgba(var(--glass-tint)/0.3)]">
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
        {["All", "Top Rated", "Price: Low to High", "Newest"].map(f => (
          <button key={f} className={`chip ${f === "All" ? "chip-active" : ""}`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? <ProductGridSkeleton count={6} /> : <ProductGrid products={products} />}
    </div>
  );
}
