import React, { useState } from "react";
import { Link } from "wouter";
import { SellerLayout } from "@/components/layout/SellerLayout";
import { useListProducts } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { Package, PlusCircle, Pencil, Trash2, Eye, Search } from "lucide-react";

const GLOW = "#00FF9C"; const RED = "#FF3B3B"; const TEXT = "#E8F5EE"; const MUTED = "#A3C9B8";

function GCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className} style={{ background: "linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>{children}</div>;
}

const FALLBACKS = [
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=120&q=70",
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&q=70",
  "https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=120&q=70",
];

export default function SellerProductsPage() {
  const { user } = useAuth();
  const { data, isLoading } = useListProducts({ vendor_id: user?.id, limit: 50 });
  const [search, setSearch] = useState("");

  const products = (data?.products ?? []).filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SellerLayout title="My Products">
      <div className="max-w-4xl mx-auto space-y-4">

        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 h-10 px-4 rounded-xl" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
            <Search className="h-4 w-4 shrink-0" style={{ color: MUTED }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="flex-1 bg-transparent border-none outline-none text-sm" style={{ color: TEXT }} />
          </div>
          <Link href="/seller/products/add">
            <button className="flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-bold btn-glow shrink-0">
              <PlusCircle className="h-4 w-4" /> Add Product
            </button>
          </Link>
        </div>

        {/* Table */}
        <GCard>
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <h2 className="font-semibold text-sm" style={{ color: TEXT }}>All Products <span className="ml-2 text-xs font-normal" style={{ color: MUTED }}>({products.length})</span></h2>
          </div>

          {isLoading ? (
            <div className="p-4 space-y-3 animate-pulse">
              {[1,2,3,4].map(i => <div key={i} className="h-16 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-3">
              <Package className="h-12 w-12 opacity-20" style={{ color: MUTED }} />
              <p className="text-sm font-medium" style={{ color: TEXT }}>No products yet</p>
              <p className="text-xs" style={{ color: MUTED }}>Add your first product to get started</p>
              <Link href="/seller/products/add">
                <button className="mt-2 h-9 px-5 rounded-xl text-xs font-bold btn-glow">+ Add Product</button>
              </Link>
            </div>
          ) : (
            <div>
              {products.map((p, i) => (
                <div key={p.id} className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: i < products.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  {/* Thumb */}
                  <div className="h-12 w-12 rounded-lg overflow-hidden shrink-0" style={{ background: "#f4f6f4" }}>
                    <img src={p.images?.[0] ?? FALLBACKS[i % 3]} alt={p.name} className="w-full h-full object-contain p-1" onError={e => { (e.target as HTMLImageElement).src = FALLBACKS[0]; }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: TEXT }}>{p.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs" style={{ color: MUTED }}>{p.category}</span>
                      <span className="text-xs font-semibold" style={{ color: GLOW }}>৳ {(p.price ?? 0).toLocaleString()}</span>
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold" style={{ background: p.inStock ? "rgba(0,255,156,0.12)" : "rgba(255,59,59,0.12)", color: p.inStock ? GLOW : RED }}>
                        {p.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Link href={`/products/${p.id}`}>
                      <button className="h-8 w-8 flex items-center justify-center rounded-lg transition-all hover:bg-white/8" style={{ color: MUTED }} title="View">
                        <Eye className="h-4 w-4" />
                      </button>
                    </Link>
                    <Link href={`/seller/products/edit/${p.id}`}>
                      <button className="h-8 w-8 flex items-center justify-center rounded-lg transition-all hover:bg-white/8" style={{ color: GLOW }} title="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                    </Link>
                    <button className="h-8 w-8 flex items-center justify-center rounded-lg transition-all hover:bg-red-900/20" style={{ color: RED }} title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GCard>

      </div>
    </SellerLayout>
  );
}
