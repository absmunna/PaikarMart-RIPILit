import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Plus } from "lucide-react";
import { getProducts } from "@/features/marketplace/product.api";
import { Product } from "@/types/product.types";
import { formatPrice } from "@/utils/formatPrice";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Loader from "@/components/common/Loader";
import { useAuth } from "@/features/auth/auth.context";

export default function SellerProducts() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { handle } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && handle !== user.handle.replace("@", "")) {
      navigate(`/seller/${user.handle.replace("@", "")}/products`, { replace: true });
    }
  }, [user, handle, navigate]);

  if (!user || handle !== user.handle.replace("@", "")) {
    return null; // or loading state
  }

  useEffect(() => {
    getProducts().then(data => {
      setProducts(data.slice(0, 4)); // mock just a few
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen pb-24 px-4 pt-4 flex flex-col gap-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="h-9 w-9 flex items-center justify-center rounded-full glass hover:bg-[rgba(var(--glass-tint)/0.2)]">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold text-[rgb(var(--text))]">My Products</h1>
        </div>
        <Button size="sm" variant="primary" className="gap-1.5" onClick={() => alert("Add product functionality - coming soon")}><Plus className="h-4 w-4" /> Add</Button>
      </div>

      {loading ? <Loader /> : (
        <div className="flex flex-col gap-4">
          {products.map(p => (
            <div key={p.id} className="glass-card p-3 flex gap-4">
              <img src={p.image || "/generated/product1.png"} alt={p.title} className="w-20 h-20 rounded-xl object-cover" />
              <div className="flex-1 py-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-sm line-clamp-1">{p.title}</h3>
                  <p className="font-bold text-[rgb(var(--primary))] mt-1">{formatPrice(p.price)}</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="success">In Stock</Badge>
                  <div className="flex gap-2">
                    <button className="text-[rgb(var(--text-muted))] hover:text-[rgb(var(--primary))]" onClick={() => alert("Edit product functionality - coming soon")}><Edit className="h-4 w-4" /></button>
                    <button className="text-[rgb(var(--text-muted))] hover:text-red-500" onClick={() => alert("Delete product functionality - coming soon")}><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
