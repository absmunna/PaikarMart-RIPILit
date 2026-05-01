import { useLocation } from "wouter";
import { useListProducts, getListProductsQueryKey, ListProductsType, ListProductsSort } from "@workspace/api-client-react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CategoryChips } from "@/components/product/CategoryChips";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Zap, Store, ShieldCheck, Truck } from "lucide-react";

export default function Marketplace() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  const q = searchParams.get("q") || undefined;
  const categoryId = searchParams.get("categoryId") || undefined;
  const type = (searchParams.get("type") as ListProductsType) || undefined;
  const sort = (searchParams.get("sort") as ListProductsSort) || undefined;
  const nearMe = searchParams.get("nearMe") === "true";

  const { data: products, isLoading } = useListProducts(
    { q, categoryId, type, sort, nearMe },
    { query: { queryKey: getListProductsQueryKey({ q, categoryId, type, sort, nearMe }) } }
  );

  const updateParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(window.location.search);
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    setLocation(`/marketplace?${params.toString()}`);
  };

  const types = ["retail", "wholesale", "dropship", "grocery", "service", "hotel"];

  return (
    <div className="flex flex-col gap-4 p-2 md:p-3">
      <section className="rounded-2xl border border-white/10 overflow-hidden bg-gradient-to-r from-primary/85 via-blue-500/80 to-cyan-500/75 text-white px-4 py-5 md:px-6 md:py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/20">Marketplace</Badge>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">Shop smarter, faster, closer</h1>
            <p className="text-white/85 text-sm md:text-base max-w-2xl">
              Retail, wholesale, local vendors and service listings in one compact commerce view.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
            <div className="rounded-xl bg-black/20 px-3 py-2 border border-white/20 flex items-center gap-2"><Zap className="h-4 w-4" /> Fast Deals</div>
            <div className="rounded-xl bg-black/20 px-3 py-2 border border-white/20 flex items-center gap-2"><Store className="h-4 w-4" /> Verified Vendors</div>
            <div className="rounded-xl bg-black/20 px-3 py-2 border border-white/20 flex items-center gap-2"><Truck className="h-4 w-4" /> Local Delivery</div>
            <div className="rounded-xl bg-black/20 px-3 py-2 border border-white/20 flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Secure Orders</div>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-3">
        <CategoryChips activeId={categoryId} />

        <div className="flex flex-wrap items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
          <div className="flex items-center space-x-2 mr-auto">
            <Switch 
              id="near-me" 
              checked={nearMe}
              onCheckedChange={(checked) => updateParams("nearMe", checked ? "true" : null)}
            />
            <Label htmlFor="near-me" className="text-white">Near Me</Label>
          </div>

          <Select value={type || "all"} onValueChange={(v) => updateParams("type", v === "all" ? null : v)}>
            <SelectTrigger className="w-[138px] bg-white/5 border-white/10 text-white h-9">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map(t => (
                <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sort || "newest"} onValueChange={(v) => updateParams("sort", v)}>
            <SelectTrigger className="w-[158px] bg-white/5 border-white/10 text-white h-9">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest Arrivals</SelectItem>
              <SelectItem value="trending">Trending Now</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {q && (
        <h2 className="text-lg font-semibold text-white px-1">Search results for "{q}"</h2>
      )}

      <ProductGrid products={products} isLoading={isLoading} />
    </div>
  );
}
