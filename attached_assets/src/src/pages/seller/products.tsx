import { useState } from "react";
import { formatBDT } from "@/lib/format";
import { Link } from "wouter";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useSeller } from "@/seller/SellerContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function SellerProducts() {
  const { products, deleteProduct } = useSeller();
  const [query, setQuery] = useState("");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(query.toLowerCase()),
  );

  const onConfirmDelete = () => {
    if (!pendingDelete) return;
    deleteProduct(pendingDelete);
    toast.success("Product removed");
    setPendingDelete(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Products</h1>
          <p className="text-white/60 mt-1">
            {products.length} listing{products.length === 1 ? "" : "s"} in your shop.
          </p>
        </div>
        <Link href="/seller/products/new">
          <Button className="bg-primary hover:bg-primary/90 rounded-full">
            <Plus className="w-4 h-4 mr-2" /> New Product
          </Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
        <Input
          placeholder="Search your products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 bg-white/5 border-white/10 text-white"
        />
      </div>

      {filtered.length === 0 ? (
        <GlassCard className="p-10 text-center text-white/60">
          {products.length === 0 ? (
            <>
              <p className="mb-4">You haven't listed any products yet.</p>
              <Link href="/seller/products/new">
                <Button className="bg-primary hover:bg-primary/90 rounded-full">
                  <Plus className="w-4 h-4 mr-2" /> Create your first product
                </Button>
              </Link>
            </>
          ) : (
            <p>No products match "{query}".</p>
          )}
        </GlassCard>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((p) => (
            <GlassCard
              key={p.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <img
                src={p.images[0]}
                alt={p.title}
                className="w-full sm:w-24 h-24 object-cover rounded-lg border border-white/10"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-white font-semibold">{p.title}</h3>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-white/70">
                    {p.categoryName}
                  </span>
                  {p.stock === 0 && (
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-red-500/20 text-red-400">
                      Out of stock
                    </span>
                  )}
                </div>
                <p className="text-sm text-white/60 line-clamp-1 mt-1">{p.description}</p>
                <div className="flex items-center gap-4 text-sm mt-2">
                  <span className="text-primary font-bold">{formatBDT(p.price)}</span>
                  <span className="text-white/60">Stock: {p.stock}</span>
                  <span className="text-white/40">{p.views} views</span>
                </div>
              </div>
              <div className="flex sm:flex-col gap-2 shrink-0">
                <Link href={`/seller/products/${p.id}/edit`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10 w-full"
                  >
                    <Pencil className="w-4 h-4 mr-2" /> Edit
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPendingDelete(p.id)}
                  className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent className="bg-[#0f172a] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this product?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              This will remove the listing from your shop. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirmDelete}
              className="bg-red-500 hover:bg-red-500/90 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
