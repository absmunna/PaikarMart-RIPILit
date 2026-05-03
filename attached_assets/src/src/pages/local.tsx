import { useListProducts, getListProductsQueryKey } from "@workspace/api-client-react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { MapPin } from "lucide-react";

export default function Local() {
  const { data: products } = useListProducts(
    { nearMe: true }, 
    { query: { queryKey: getListProductsQueryKey({ nearMe: true }) } }
  );

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 text-primary p-4 rounded-xl">
        <MapPin className="h-6 w-6" />
        <div>
          <h1 className="font-semibold">Local Discoveries</h1>
          <p className="text-sm opacity-80">Showing products and services near your location</p>
        </div>
      </div>

      <ProductGrid products={products} emptyMessage="No local products found." />
    </div>
  );
}
